const fetch = require('node-fetch');

let CACHED_TOKEN = null;
let CACHED_GUID = '74632858-753d-4ee9-a3d8-0e34b9164f76';

function parseJwt(token) {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch (e) {
        return null;
    }
}

async function getAccessToken() {
    if (CACHED_TOKEN) return CACHED_TOKEN;

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('login_method', 'email');
    params.append('client_id', process.env.CMONEY_CLIENT_ID);
    params.append('client_secret', process.env.CMONEY_CLIENT_SECRET);
    params.append('account', process.env.CMONEY_ACCOUNT);
    params.append('password', process.env.CMONEY_PASSWORD);

    const response = await fetch('https://www.cmoney.tw/identity/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    if (!response.ok) {
        throw new Error(`Token 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    CACHED_TOKEN = data.access_token;

    const decoded = parseJwt(CACHED_TOKEN);
    if (decoded && decoded.user_guid) {
        CACHED_GUID = decoded.user_guid;
    }

    return CACHED_TOKEN;
}

async function parseChipkResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const text = await response.text();
    const arrayStartIndex = text.indexOf('[[');
    if (arrayStartIndex > 0) {
        try {
            const arrayText = text.substring(arrayStartIndex);
            const lastBracketIndex = arrayText.lastIndexOf(']]');
            if (lastBracketIndex > 0) {
                const arrayJson = arrayText.substring(0, lastBracketIndex + 2);
                return JSON.parse(arrayJson);
            }
        } catch (e) {
            console.warn('解析陣列部分失敗:', e.message);
        }
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { stockCodes } = req.body;
        if (!stockCodes) return res.status(400).json({ error: '缺少必要參數' });

        const codesArray = Array.isArray(stockCodes) ? stockCodes : stockCodes.split(',');
        const token = await getAccessToken();

        const apiUrl = 'https://asterisk-chipsapi.cmoney.tw/AdditionInformationRevisit/api/GetTarget/StockCalculation';
        const columns = '交易時間,傳輸序號,即時成交價,即時成交量,最低價,最高價,標的,漲跌,漲跌幅,累計成交總額,累計成交量,開盤價';
        const url = `${apiUrl}?columns=${encodeURIComponent(columns)}&keyNamePath=Commodity,CommKey`;

        const requestBody = {
            Json: JSON.stringify(codesArray),
            AppId: 2,
            Processing: [],
            Guid: CACHED_GUID
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept-Encoding': 'gzip'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await parseChipkResponse(response);
        res.json({ success: true, data: data });

    } catch (error) {
        console.error('代理即時行情錯誤:', error);
        res.status(500).json({ error: error.message });
    }
};
