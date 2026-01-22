const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 啟用 CORS
app.use(cors());

// 解析 JSON body
app.use(express.json());

// 提供靜態檔案（HTML, CSS, JS）
app.use(express.static(__dirname));

// Token 快取
let CACHED_TOKEN = null;
let CACHED_GUID = '74632858-753d-4ee9-a3d8-0e34b9164f76'; // Default fallback

function parseJwt(token) {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch (e) {
        return null;
    }
}

// 取得 Token 的函數
async function getAccessToken() {
    if (CACHED_TOKEN) return CACHED_TOKEN;

    console.log('正在取得新 Token...');
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('login_method', 'email');
        params.append('client_id', process.env.CMONEY_CLIENT_ID || 'cmchipkmobile');
        params.append('client_secret', process.env.CMONEY_CLIENT_SECRET || '735c6defb9e33085f7bd8389');
        params.append('account', process.env.CMONEY_ACCOUNT || 'jerry_yang@cmoney.com.tw');
        params.append('password', process.env.CMONEY_PASSWORD || 'Jerry072577');

        const response = await fetch('https://www.cmoney.tw/identity/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error(`Token 請求失敗: ${response.status}`);
        }

        const data = await response.json();
        console.log('成功取得新 Token');
        CACHED_TOKEN = data.access_token;

        const decoded = parseJwt(CACHED_TOKEN);
        if (decoded && decoded.user_guid) {
            CACHED_GUID = decoded.user_guid;
            console.log('更新 GUID:', CACHED_GUID);
        }

        return CACHED_TOKEN;
    } catch (error) {
        console.error('取得 Token 發生錯誤:', error);
        throw error;
    }
}

// 統一的 API 請求處理器 (含 Retry 邏輯)
async function makeAuthenticatedRequest(url, options = {}, isRetry = false) {
    try {
        const token = await getAccessToken();

        // 確保 headers 存在並注入 Token
        const headers = options.headers || {};
        headers['Authorization'] = `Bearer ${token}`;

        options.headers = headers;

        const response = await fetch(url, options);

        // 如果是 401 且未重試過，嘗試刷新 Token
        if (response.status === 401 && !isRetry) {
            console.log('收到 401，嘗試刷新 Token 並重試...');
            CACHED_TOKEN = null; // 清除快取
            return makeAuthenticatedRequest(url, options, true);
        }

        return response;
    } catch (error) {
        console.error('請求發生錯誤:', error);
        throw error;
    }
}

// Common helper to parse ChipK API response (extract array from mixed content)
async function parseChipkResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const text = await response.text();

    // The API returns metadata followed by the JSON array (e.g. {...metadata}[ [...data...] ])
    // We need to extract the array part at the end.
    const arrayStartIndex = text.indexOf('[[');
    if (arrayStartIndex > 0) {
        try {
            const arrayText = text.substring(arrayStartIndex);
            // Ensure we only take up to the last bracket just in case
            const lastBracketIndex = arrayText.lastIndexOf(']]');
            if (lastBracketIndex > 0) {
                const arrayJson = arrayText.substring(0, lastBracketIndex + 2);
                return JSON.parse(arrayJson);
            }
        } catch (e) {
            console.warn('解析陣列部分失敗:', e.message);
        }
    }

    // Fallback if direct parsing fails or format is different
    try {
        return JSON.parse(text);
    } catch (e) {
        return text; // Return raw text if all else fails
    }
}


// API 代理端點：產業數據 (Main Treemap)
app.post('/api/industry-data', async (req, res) => {
    try {
        const { requestBody } = req.body;

        const apiUrl = 'https://asterisk-chipsapi.cmoney.tw/AdditionInformationRevisit/api/GetOtherQuery/FocusIndustryRankRequest/IEnumerable%3CFocusIndustry%3E';
        const columns = '成交金額,指數匯編分類,欄位1,欄位2,欄位3,漲跌幅,焦點個股1,焦點個股1市值,產業';
        const url = `${apiUrl}?columns=${encodeURIComponent(columns)}&keyNamePath=`;

        if (requestBody && !requestBody.Guid) {
            requestBody.Guid = CACHED_GUID;
        }

        console.log('代理請求產業數據 API...');

        const response = await makeAuthenticatedRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await parseChipkResponse(response);
        res.json({ success: true, data: data });

    } catch (error) {
        console.error('代理錯誤:', error);
        res.status(500).json({ error: '代理伺服器錯誤', message: error.message });
    }
});

// API 代理端點：成分股清單 (Stock List)
app.post('/api/stock-list', async (req, res) => {
    try {
        const { commkey } = req.body;
        if (!commkey) return res.status(400).json({ error: '缺少必要參數' });

        const apiUrl = 'https://asterisk-chipsapi.cmoney.tw/AdditionInformationRevisit/api/GetOtherQuery/ConceptRequest/IEnumerable%3CStockCommodity%3E';
        const columns = '商品名稱,標的'; // Name, Code
        const url = `${apiUrl}?columns=${encodeURIComponent(columns)}&keyNamePath=`;

        const requestBody = {
            Json: JSON.stringify({ CommKey: commkey }),
            AppId: 2,
            Processing: [],
            Guid: CACHED_GUID
        };

        console.log('代理請求成分股清單 API...');

        const response = await makeAuthenticatedRequest(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' },
            body: JSON.stringify(requestBody)
        });

        const data = await parseChipkResponse(response);
        res.json({ success: true, data: data });

    } catch (error) {
        console.error('代理成分股清單錯誤:', error);
        res.status(500).json({ error: error.message });
    }
});

// API 代理端點：即時行情 (Tick Info / StockCalculation)
app.post('/api/tick-info', async (req, res) => {
    try {
        const { stockCodes } = req.body; // Array of stock strings, e.g. ['2330', '2317']
        if (!stockCodes) return res.status(400).json({ error: '缺少必要參數' });

        // Parse stockCodes if it's a string (comma separated)
        const codesArray = Array.isArray(stockCodes) ? stockCodes : stockCodes.split(',');

        const apiUrl = 'https://asterisk-chipsapi.cmoney.tw/AdditionInformationRevisit/api/GetTarget/StockCalculation';
        // Columns requested by user's log: 交易時間,傳輸序號,即時成交價,即時成交量,最低價,最高價,標的,漲跌,漲跌幅,累計成交總額,累計成交量,開盤價
        // We need: 標的(Code), 即時成交價(Price), 漲跌幅(Change), 累計成交量(Volume)
        const columns = '交易時間,傳輸序號,即時成交價,即時成交量,最低價,最高價,標的,漲跌,漲跌幅,累計成交總額,累計成交量,開盤價';
        const url = `${apiUrl}?columns=${encodeURIComponent(columns)}&keyNamePath=Commodity,CommKey`;

        const requestBody = {
            Json: JSON.stringify(codesArray),
            AppId: 2,
            Processing: [],
            Guid: CACHED_GUID
        };

        console.log('代理請求即時行情 API (Batch)...');

        const response = await makeAuthenticatedRequest(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' },
            body: JSON.stringify(requestBody)
        });

        const data = await parseChipkResponse(response);
        res.json({ success: true, data: data });

    } catch (error) {
        console.error('代理即時行情錯誤:', error);
        res.status(500).json({ error: error.message });
    }
});

// API 代理端點：走勢圖 (Trend Chart) - NEW
app.post('/api/trend-chart', async (req, res) => {
    try {
        const { commkey } = req.body;
        if (!commkey) return res.status(400).json({ error: '缺少必要參數' });

        const apiUrl = 'https://asterisk-chipsapi.cmoney.tw/AdditionInformationRevisit/api/GetMultiple/CandlestickChart%3CConceptStockCommodity%3E';
        // Columns: 傳輸序號,區間成交總額,收盤價,時間,時間間隔,最低價,最高價,標的,索引,累計成交總額,開盤價
        const columns = '傳輸序號,區間成交總額,收盤價,時間,時間間隔,最低價,最高價,標的,索引,累計成交總額,開盤價';
        const url = `${apiUrl}?columns=${encodeURIComponent(columns)}&keyNamePath=Key`;

        const requestBody = {
            Json: JSON.stringify({ Commodity: commkey, MinuteInterval: 1 }),
            AppId: 2,
            Processing: [],
            Guid: CACHED_GUID
        };

        console.log('代理請求走勢圖 API...');

        const response = await makeAuthenticatedRequest(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' },
            body: JSON.stringify(requestBody)
        });

        const data = await parseChipkResponse(response);
        res.json({ success: true, data: data });

    } catch (error) {
        console.error('代理走勢圖錯誤:', error);
        res.status(500).json({ error: error.message });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`\n✅ 代理伺服器已啟動！`);
    console.log(`📡 本地端: http://localhost:${PORT}`);
    console.log(`🌐 請在瀏覽器中開啟: http://localhost:${PORT}/index.html\n`);
});
