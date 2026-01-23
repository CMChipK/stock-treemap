// API 設定
const API_CONFIG = {
    url: 'https://asterisk-chipsapi.cmoney.tw/AdditionInformationRevisit/api/GetOtherQuery/FocusIndustryRankRequest/IEnumerable%3CFocusIndustry%3E',
    columns: '成交金額,指數匯編分類,欄位1,欄位2,欄位3,漲跌幅,焦點個股1,焦點個股1市值,產業',
    // 注意：需要提供有效的 Authorization token
    // 可以從瀏覽器開發者工具中取得
    getAuthToken: () => {
        // 請在這裡設定您的 token，或從環境變數/設定檔讀取
        return 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkEydWczbUIxRFQiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIyNDQ2NzE4IiwidXNlcl9ndWlkIjoiNzQ2MzI4NTgtNzUzZC00ZWU5LWEzZDgtMGUzNGI5MTY0Zjc2IiwidG9rZW5faWQiOiIyNjU4IiwiYXBwX2lkIjoiMiIsImlzX2d1ZXN0IjpmYWxzZSwibmJmIjoxNzY4NTQ4MTM2LCJleHAiOjE3Njg2MzgxMzYsImlhdCI6MTc2ODU1MTczNiwiaXNzIjoiaHR0cHM6Ly93d3cuY21vbmV5LnR3IiwiYXVkIjoiY21vbmV5YXBpIn0.RbJAlL01hFsn8CYisKo4kI38q45JyHgrHpFvr_1BMNBv08N_KlEPPCYZdGx6YY7M9GuPVASkhM4M89a3dr7DHFrsv5YV26qUTDnwuyCzPpVXWSDSz-TIrJd-rRMiFk25ZPGCFjISzkzX-owFVSZwOqqBw8NJbG_vDHqINcghPscwy0tJ4WFCa_jZnsFI-WNVfvPQfysol0M_BCGdJp9F7GjRr5oiPTgpFOHQp2uPfCwArRqdw67onP2JmpZD8JfGZBMj4HIlu5wjAYXvY5EFROv2MVln6OsxvSkGxM-nCZQdiX7Y2pgXEnZO2pyGKWwQHvziSekNzdWReOZotxEOUg';
    }
};

// 產業代碼對照表（從 CSV 檔案載入）
const INDUSTRY_CODE_MAP = {
    // 從 CSV 檔案讀取的對照
    'C11010': '水泥',
    'C12010': '食品',
    'C13010': '塑膠',
    'C14010': '紡織',
    'C15010': '電機',
    'C16010': '電線',
    'C17010': '化工',
    'C17020': '生技',
    'C18010': '玻璃',
    'C19010': '紙業',
    'C20010': '鋼鐵',
    'C21010': '橡膠',
    'C22010': '汽車',
    'C22020': '汽車零件',
    'C23010': 'IC設計',
    'C23020': 'IC代工',
    'C23030': 'DRAM製造',
    'C23040': 'DRAM銷售',
    'C23050': 'IC製造',
    'C23060': 'IC封測',
    'C23070': 'IC通路',
    'C23080': 'IC其他',
    'C23090': '被動元件',
    'C23100': 'LED',
    'C23110': '連接元件',
    'C23120': 'PCB製造',
    'C23130': 'PCB材料',
    'C23140': 'LCD-TFT',
    'C23150': 'LCD零件',
    'C23160': 'LCD-STN',
    'C23170': '電源',
    'C23180': '變壓器UPS',
    'C23190': '主機板',
    'C23200': '光學',
    'C23210': 'NB手機零件',
    'C23220': 'PC介面',
    'C23230': '機殼',
    'C23240': '電子儀器',
    'C23250': '電子通訊',
    'C23260': '網通',
    'C23270': 'EMS',
    'C23280': '電子中游',
    'C23290': '數位相機',
    'C23300': '光碟',
    'C23310': '顯示器',
    'C23320': '電信',
    'C23330': '工業電腦',
    'C23350': '資訊通路',
    'C23360': '掃描器',
    'C23370': '安全監控',
    'C23380': 'NB',
    'C23390': '消費電子',
    'C23400': '自動化',
    'C23410': '手機',
    'C23415': '太陽能',
    'C23420': '電子下游',
    'C23430': '系統整合',
    'C23440': '遊戲',
    'C23450': '軟體',
    'C25010': '營建',
    'C26010': '航運',
    'C27010': '觀光',
    'C28010': '金控',
    'C28020': '銀行',
    'C28030': '證券',
    'C28040': '保險',
    'C29010': '百貨',
    'C29020': '傳產',
    'C29030': '自行車',
    'C30010': '高爾夫',
    // 用戶新增的分類
    'C30011': '運動休閒',
    'C30012': '文創娛樂',
    'C30013': '綠能環保',
    'C30014': '照明',
    'C30015': 'IC-半導體設備',
    'C30016': '晶圓材料',
    'C30017': '半導體元件',
    'C30018': '記憶體IC設計',
    'C30019': 'IP/ASIC',
    'C30020': 'IC-導線架',
    'C30021': 'ABF',
    'C30022': '磁碟陣列',
    'C30023': '二次電池',
    'C30024': '散熱零組件',
    'C30025': '聲學元件',
    'C30026': '金屬製品',
    'C30027': '電子元件通路',
    'C30028': '電腦周邊',
    // 概念股（部分）
    'C50020': '水資源',
    'C50030': 'Apple',
    'C50040': 'ApplePay',
    'C50050': '機器人',
    'C50070': 'Tesla',
    'C50080': '物聯網',
    'C50090': 'TypeC',
    'C50100': 'VR',
    'C50110': '手遊',
    'C50120': '文創',
    'C50130': '生物辨識',
    'C50140': '夏季',
    'C50150': '自駕',
    'C50160': '行動支付',
    'C50170': '車用電子',
    'C50180': 'NFC',
    'C50190': '長照',
    'C50200': '指紋',
    'C50210': '航太',
    'C50220': 'ADAS',
    'C50230': '資訊月',
    'C50240': '福建自貿',
    'C50250': '一帶一路',
    'C50260': '穿戴裝置',
    'C50270': '三方支付',
    'C50280': '車聯網',
    'C50290': '無線充電',
    'C50300': 'CES',
    'C50310': 'HD',
    'C50320': 'MWC',
    'C50330': 'TPP',
    'C50340': 'UA',
    'C50350': '5G',
    'C50360': 'FANG',
    'C50380': 'MicorLED',
    'C50390': 'RFID',
    'C50400': 'Switch',
    'C50410': 'AI',
    'C50420': '共享單車',
    'C50430': '暑假',
    'C50440': 'AI音箱',
    'C50450': '電競',
    'C50460': '3D感測',
    'C50470': '空汙',
    'C50480': 'AR',
    'C50490': '氫電池',
    'C50500': '電動車',
    'C50510': 'AI城市',
    'C50530': '矽晶圓',
    'C50540': '寧德',
    'C50550': 'A股入摩',
    'C50560': '新零售',
    'C50570': 'DANCE',
    'C50580': '二胎化',
    'C50590': 'AI顯示',
    'C50600': '挖礦',
    'C50610': '旅展',
    'C50620': '無線耳機',
    'C50630': '防疫',
    'C50640': '風電',
    'C50650': 'AI電網',
    'C50660': '軍工',
    'C50670': 'AI醫療',
    'C50680': '美容',
    'C50690': '資安',
    'C50700': '摺疊機',
    'C50710': '衛星',
    'C50720': '遠距',
    'C50730': '環工',
    'C50740': '保健',
    'C50750': '寵物',
    'C50760': '東協',
    'C50770': '建材',
    'C50780': '黃金',
    'C50790': 'MiniLED',
    'C50800': '散熱模組',
    'C50810': '新藥',
    'C50820': 'i12',
    'C50830': 'AMD',
    'C50840': '雙11',
    'C50850': 'PS5',
    'C50851': 'PCB',
    'C50852': 'IC載板',
    'C50853': '被動元件',
    'C50854': '電容',
    'C50855': '電阻',
    'C50856': '電感',
    'C50857': '石英',
    'C50858': '鋁電容',
    'C50859': '保護元件',
    'C50860': '濾波器',
    'C50861': '變壓器',
    'C50862': '電源',
    'C50863': '連接器',
    'C50864': 'PCB材料',
    'C50865': '銅箔',
    'C50866': '銅箔基板',
    'C50867': 'Chrombook',
    'C50868': 'WFH',
    'C50869': '物流',
    'C50870': 'OpenRAN',
    'C50871': '電商',
    'C50872': '線上遊戲',
    'C50873': '功率半導體',
    'C50874': '虛擬貨幣',
    'C50875': 'NIKE',
    'C50876': '快充',
    'C50877': '資產',
    'C50878': 'MIH',
    'C50879': 'Wifi6',
    'C50880': 'HPC',
    'C50881': '元宇宙',
    'C50882': '原料藥',
    'C50883': '生物相似藥',
    'C50884': '新藥',
    'C50885': '生技',
    'C50886': '生物檢測',
    'C50887': '再生醫',
    'C50888': '醫通路',
    'C50889': '醫耗材',
    'C50890': '醫設備',
    'C50891': '醫美',
    'C50892': '運動',
    'C50893': '視力',
    'C50894': '衛生',
    'C50895': '農技',
    'C50896': '醫院',
    'C50897': '醫顧問',
    'C50898': '製藥',
    'C99010': '印刷電路板'
};

// 根據產業代碼取得名稱（如果沒有對照，就使用代碼）
function getIndustryName(code) {
    return INDUSTRY_CODE_MAP[code] || code || '未知產業';
}

// 格式化數字（加上千分位逗號）
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 轉換 API 回應資料為我們需要的格式
function transformApiData(apiResponse, sortBy = 'volume', fundsSortType = 'abs') {
    if (!Array.isArray(apiResponse) || apiResponse.length === 0) {
        console.error('API 回應格式錯誤');
        return [];
    }

    console.log('API 回應資料筆數:', apiResponse.length);
    console.log('前3筆原始資料:', apiResponse.slice(0, 3));

    // API 回應是二維陣列，每個元素是一個產業的資料
    const transformed = apiResponse.map(item => {
        // 根據 columns 參數，欄位順序為：
        // 0: 成交金額, 1: 指數匯編分類, 2: 欄位1, 3: 欄位2, 4: 欄位3, 5: 漲跌幅, 6: 焦點個股1, 7: 焦點個股1市值, 8: 產業
        const volume = parseFloat(item[0]) / 100000000; // 轉換成億
        const fundsFlow = parseFloat(item[4]) / 100000000; // 欄位3 可能是資金流向，轉換成億
        const changePercent = parseFloat(item[5]); // 漲跌幅
        const stockCode = item[6] ? String(item[6]) : ''; // 焦點個股
        const industryCode = item[8] || ''; // 產業代碼
        const industryName = getIndustryName(industryCode);

        // Debug: 記錄 IC-代工 和 ABF 的資料
        if (industryCode === 'C23020' || industryCode === 'C30021' ||
            industryName.includes('IC-代工') || industryName.includes('IC代工') ||
            industryName.includes('ABF')) {
            console.log('找到目標產業:', {
                code: industryCode,
                name: industryName,
                volume: volume,
                fundsFlow: fundsFlow,
                changePercent: changePercent
            });
        }

        return {
            name: industryName,
            code: industryCode,
            category: '產業', // 可以根據需要分類
            changePercent: changePercent,
            fundsFlow: fundsFlow,
            volume: volume,
            stocks: stockCode ? [stockCode] : []
        };
    }).filter(item => item.volume > 0 && item.code >= 'C11010' && item.code <= 'C30028'); // 過濾掉成交量為 0 且不在範圍內的資料

    // 根據排序類型進行排序
    if (sortBy === 'volume') {
        transformed.sort((a, b) => b.volume - a.volume);
    } else {
        // 資金流量排序
        if (fundsSortType === 'abs') {
            // 絕對值排序
            transformed.sort((a, b) => Math.abs(b.fundsFlow) - Math.abs(a.fundsFlow));
        } else if (fundsSortType === 'net-in') {
            // 資金流入排序（由大到小）
            transformed.sort((a, b) => b.fundsFlow - a.fundsFlow);
        } else if (fundsSortType === 'net-out') {
            // 資金流出排序（由小到大，負數較大的在前）
            transformed.sort((a, b) => a.fundsFlow - b.fundsFlow);
        }
    }

    console.log('轉換後前5筆（按', sortBy, fundsSortType, '排序）:', transformed.slice(0, 5).map(item => ({
        name: item.name,
        code: item.code,
        volume: item.volume,
        fundsFlow: item.fundsFlow
    })));

    return transformed.slice(0, 20); // 只返回前20筆
}

// 從 API 取得資料（透過後端代理）
async function fetchIndustryData(sortBy = 'volume', fundsSortType = 'abs') {
    try {
        const requestBody = {
            Json: JSON.stringify({ Type: 4371, Rank: 30 }),
            AppId: 2,
            Processing: [],
            Guid: '74632858-753d-4ee9-a3d8-0e34b9164f76' // 可以動態產生
        };

        const token = API_CONFIG.getAuthToken();

        console.log('開始 API 請求（透過代理）...');
        console.log('Token 長度:', token ? token.length : 0);

        // 透過本地代理伺服器請求 API
        const response = await fetch('/api/industry-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                requestBody: requestBody
            })
        });

        console.log('代理回應狀態:', response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('代理錯誤回應:', errorData);
            throw new Error(`API 請求失敗: ${response.status} - ${errorData.error || response.statusText}`);
        }

        // 解析代理回應
        const result = await response.json();
        console.log('代理回應:', result);

        if (result.success && result.data) {
            console.log('成功取得資料，共', result.data.length, '筆');
            return transformApiData(result.data, sortBy, fundsSortType);
        } else {
            console.warn('代理回應格式異常:', result);
            return [];
        }

    } catch (error) {
        console.error('取得 API 資料失敗:', error);
        console.error('錯誤詳情:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // 檢查是否為 CORS 錯誤
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
            console.error('⚠️ 可能是 CORS 問題！瀏覽器直接請求可能被阻擋。');
            console.error('建議：使用後端代理或啟用 CORS 設定');
        }

        // 發生錯誤時返回 null，讓系統使用假資料
        return null;
    }
}

// 假資料 - 股市族群資料（作為備用）
const mockData = [
    {
        name: '半導體',
        category: '電子',
        changePercent: 2.87,
        fundsFlow: 548.33, // 億
        volume: 1372.95, // 億
        stocks: ['2330', '2303', '2311', '2329', '2454']
    },
    {
        name: '金融',
        category: '金融',
        changePercent: 0.58,
        fundsFlow: 210.53,
        volume: 382.31,
        stocks: ['2882', '2881', '2886', '2891', '2884']
    },
    {
        name: '電子組件',
        category: '電子',
        changePercent: 4.28,
        fundsFlow: 188.44,
        volume: 418.42,
        stocks: ['2327', '2382', '2409', '2458', '2474']
    },
    {
        name: '電腦週邊',
        category: '電子',
        changePercent: -0.18,
        fundsFlow: -45.22,
        volume: 256.78,
        stocks: ['2357', '2388', '2395', '2412', '2424']
    },
    {
        name: '網通',
        category: '電子',
        changePercent: -0.60,
        fundsFlow: -32.15,
        volume: 189.65,
        stocks: ['2314', '2345', '2419', '2455', '2485']
    },
    {
        name: '航運',
        category: '傳產',
        changePercent: -1.22,
        fundsFlow: -78.90,
        volume: 312.45,
        stocks: ['2603', '2609', '2615', '2636', '2642']
    },
    {
        name: '塑膠',
        category: '傳產',
        changePercent: 0.35,
        fundsFlow: 12.45,
        volume: 98.76,
        stocks: ['1301', '1303', '1304', '1308', '1312']
    },
    {
        name: '鋼鐵',
        category: '傳產',
        changePercent: 1.15,
        fundsFlow: 56.78,
        volume: 145.32,
        stocks: ['2002', '2014', '2023', '2027', '2030']
    },
    {
        name: '水泥',
        category: '傳產',
        changePercent: 0.25,
        fundsFlow: 8.90,
        volume: 45.67,
        stocks: ['1101', '1102', '1103', '1104', '1108']
    },
    {
        name: '紡織',
        category: '傳產',
        changePercent: -0.45,
        fundsFlow: -15.23,
        volume: 67.89,
        stocks: ['1402', '1409', '1413', '1414', '1417']
    },
    {
        name: '食品',
        category: '傳產',
        changePercent: 0.88,
        fundsFlow: 23.45,
        volume: 89.12,
        stocks: ['1216', '1227', '1229', '1231', '1232']
    },
    {
        name: '電機',
        category: '傳產',
        changePercent: 0.55,
        fundsFlow: 18.90,
        volume: 112.34,
        stocks: ['1504', '1513', '1514', '1515', '1517']
    },
    {
        name: '化學',
        category: '傳產',
        changePercent: -0.30,
        fundsFlow: -9.87,
        volume: 56.78,
        stocks: ['1701', '1702', '1707', '1708', '1709']
    },
    {
        name: '生技',
        category: '生技',
        changePercent: 1.85,
        fundsFlow: 67.23,
        volume: 178.90,
        stocks: ['1730', '1731', '1732', '1733', '1734']
    },
    {
        name: '觀光',
        category: '服務',
        changePercent: 0.42,
        fundsFlow: 5.67,
        volume: 34.56,
        stocks: ['2702', '2704', '2705', '2706', '2707']
    },
    {
        name: '營建',
        category: '傳產',
        changePercent: 0.75,
        fundsFlow: 34.56,
        volume: 123.45,
        stocks: ['2501', '2504', '2505', '2506', '2509']
    },
    {
        name: '電子通路',
        category: '電子',
        changePercent: -0.15,
        fundsFlow: -12.34,
        volume: 78.90,
        stocks: ['2347', '2349', '2350', '2351', '2352']
    },
    {
        name: '運動休閒',
        category: '傳產',
        changePercent: 0.28,
        fundsFlow: 4.56,
        volume: 23.45,
        stocks: ['9904', '9910', '9914', '9917', '9921']
    },
    {
        name: '貿易',
        category: '服務',
        changePercent: -0.12,
        fundsFlow: -3.45,
        volume: 19.87,
        stocks: ['2903', '2905', '2906', '2908', '2910']
    },
    {
        name: '居家生活',
        category: '傳產',
        changePercent: 0.18,
        fundsFlow: 2.34,
        volume: 15.67,
        stocks: ['9917', '9924', '9925', '9926', '9927']
    },
    {
        name: '綠能環保',
        category: '傳產',
        changePercent: 0.95,
        fundsFlow: 15.67,
        volume: 45.23,
        stocks: ['9958', '9960', '9962', '9964', '9966']
    },
    {
        name: '玻璃',
        category: '傳產',
        changePercent: -0.22,
        fundsFlow: -1.23,
        volume: 8.90,
        stocks: ['1802', '1805', '1806', '1808', '1809']
    },
    {
        name: '造紙',
        category: '傳產',
        changePercent: 0.10,
        fundsFlow: 1.45,
        volume: 12.34,
        stocks: ['1904', '1905', '1907', '1909', '1910']
    }
];

// 全域變數
let currentSortBy = 'volume'; // 'volume' 或 'funds'
let currentFundsSortType = 'abs'; // 'abs', 'net-in', 或 'net-out'
let selectedCategory = null;
let currentData = []; // 當前使用的資料
let allIndustryData = []; // 儲存完整的產業資料（包含所有排序結果）

// 處理產業點擊（統一入口）
function handleIndustryClick(industryData) {
    loadStockDetails(industryData.code, industryData.name);
    updateDetailHeader(industryData);
}

// 渲染焦點股跑馬燈
function renderFocusStocksMarquee(data) {
    // 取得資金流入前10名的類股
    const topIndustries = data
        .filter(item => item.fundsFlow > 0 && item.focusStock) // 只要資金流入且有焦點股
        .sort((a, b) => b.fundsFlow - a.fundsFlow)
        .slice(0, 10);

    const marqueeContent = document.getElementById('focus-stocks-content');
    if (!marqueeContent) return;

    // 創建焦點股項目（重複兩次以實現無縫輪播）
    const items = topIndustries.map(industry => {
        const changeClass = industry.changePercent >= 0 ? 'positive' : 'negative';
        const changeSign = industry.changePercent >= 0 ? '+' : '';
        
        return `
            <div class="focus-stock-item" data-industry-code="${industry.code}">
                <span class="focus-stock-industry">${industry.name}</span>
                <span class="focus-stock-code">${industry.focusStock}</span>
                <span class="focus-stock-change ${changeClass}">${changeSign}${industry.changePercent.toFixed(2)}%</span>
            </div>
        `;
    }).join('');

    // 重複兩次以實現無縫輪播
    marqueeContent.innerHTML = items + items;

    // 添加點擊事件
    const stockItems = marqueeContent.querySelectorAll('.focus-stock-item');
    stockItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const industryCode = item.getAttribute('data-industry-code');
            const industry = allIndustryData.find(d => d.code === industryCode);
            if (industry) {
                handleIndustryClick(industry);
            }
        });
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    initializeEventListeners();

    // 嘗試從 API 取得資料，失敗則使用假資料
    const indicator = document.getElementById('data-source-indicator');
    indicator.textContent = '載入中...';

    const apiData = await fetchIndustryData();
    if (apiData && apiData.length > 0) {
        currentData = apiData;
        allIndustryData = apiData; // 儲存完整資料
        indicator.textContent = `API 資料 (${apiData.length} 筆)`;
        console.log('使用 API 資料，共', apiData.length, '筆');
    } else {
        currentData = mockData;
        allIndustryData = mockData;
        indicator.textContent = `假資料 (${mockData.length} 筆)`;
        console.log('使用假資料，共', mockData.length, '筆');
    }

    renderTreemap();
    renderFocusStocksMarquee(allIndustryData); // 渲染焦點股跑馬燈
});

// 初始化事件監聽器
function initializeEventListeners() {
    document.getElementById('sort-volume').addEventListener('click', async () => {
        currentSortBy = 'volume';
        updateSortButtons();
        // 重新載入資料
        const indicator = document.getElementById('data-source-indicator');
        indicator.textContent = '載入中...';
        const apiData = await fetchIndustryData('volume', currentFundsSortType);
        if (apiData && apiData.length > 0) {
            currentData = apiData;
            indicator.textContent = `API 資料 (${apiData.length} 筆)`;
        } else {
            currentData = mockData;
            indicator.textContent = `假資料 (${mockData.length} 筆)`;
        }
        renderTreemap();
    });

    document.getElementById('sort-funds').addEventListener('click', async () => {
        currentSortBy = 'funds';
        updateSortButtons();
        // 重新載入資料
        const indicator = document.getElementById('data-source-indicator');
        indicator.textContent = '載入中...';
        const apiData = await fetchIndustryData('funds', currentFundsSortType);
        if (apiData && apiData.length > 0) {
            currentData = apiData;
            indicator.textContent = `API 資料 (${apiData.length} 筆)`;
        } else {
            currentData = mockData;
            indicator.textContent = `假資料 (${mockData.length} 筆)`;
        }
        renderTreemap();
    });

    document.getElementById('sort-funds-type').addEventListener('change', async (e) => {
        currentFundsSortType = e.target.value;
        // 重新載入資料
        const indicator = document.getElementById('data-source-indicator');
        indicator.textContent = '載入中...';
        const apiData = await fetchIndustryData('funds', currentFundsSortType);
        if (apiData && apiData.length > 0) {
            currentData = apiData;
            indicator.textContent = `API 資料 (${apiData.length} 筆)`;
        } else {
            currentData = mockData;
            indicator.textContent = `假資料 (${mockData.length} 筆)`;
        }
        renderTreemap();
    });

    document.getElementById('close-detail').addEventListener('click', () => {
        document.getElementById('detail-panel').classList.add('hidden');
        selectedCategory = null;
    });

    // 重新載入資料按鈕
    document.getElementById('refresh-data').addEventListener('click', async () => {
        const indicator = document.getElementById('data-source-indicator');
        indicator.textContent = '載入中...';

        const apiData = await fetchIndustryData(currentSortBy, currentFundsSortType);
        if (apiData && apiData.length > 0) {
            currentData = apiData;
            indicator.textContent = `API 資料 (${apiData.length} 筆)`;
            renderTreemap();
        } else {
            currentData = mockData;
            indicator.textContent = `假資料 (${mockData.length} 筆)`;
            renderTreemap();
        }
    });
}

// 更新排序按鈕狀態
function updateSortButtons() {
    document.getElementById('sort-volume').classList.toggle('active', currentSortBy === 'volume');
    document.getElementById('sort-funds').classList.toggle('active', currentSortBy === 'funds');

    const fundsSelect = document.getElementById('sort-funds-type');
    if (fundsSelect) {
        fundsSelect.style.display = currentSortBy === 'funds' ? 'block' : 'none';
    }

    const indicator = document.getElementById('size-indicator');
    indicator.textContent = currentSortBy === 'volume' ? '成交量' : '資金流量';
}

// 取得顏色（根據漲跌幅）- 使用柔和、舒適的顏色
function getColor(changePercent) {
    // 上漲：紅色系（顏色越深漲幅越大，但更柔和）
    if (changePercent > 1) return '#8b3a3a';      // 深紅（降低亮度）
    if (changePercent > 0.5) return '#a04a4a';   // 中紅
    if (changePercent > 0) return '#b55a5a';     // 淺紅
    // 平盤
    if (changePercent === 0) return '#4a4a4a';   // 灰色
    // 下跌：綠色系（顏色越深跌幅越大，但更柔和）
    if (changePercent > -0.5) return '#4a6b4a'; // 淺綠
    if (changePercent > -1) return '#3a5a3a';   // 中綠
    return '#2a4a2a';                            // 深綠
}

// 渲染 Treemap
function renderTreemap() {
    // 準備資料
    let data = currentData.map(item => ({
        name: item.name,
        code: item.code,
        category: item.category,
        changePercent: item.changePercent,
        fundsFlow: item.fundsFlow,
        volume: item.volume,
        stocks: item.stocks,
        size: currentSortBy === 'volume' ? item.volume : Math.abs(item.fundsFlow)
    }));

    // 清空並重新繪製
    const container = document.getElementById('treemap');
    container.innerHTML = '';

    const width = container.clientWidth;
    const height = container.clientHeight || 600;

    let root = d3.hierarchy({ children: data })
        .sum(d => d.size);

    // D3 Treemap Sorting Logic
    if (currentSortBy === 'volume') {
        // Volume: Descending size
        root.sort((a, b) => b.value - a.value);
    } else {
        // Funds Flow
        if (currentFundsSortType === 'abs') {
            // Absolute Value: Descending size
            root.sort((a, b) => b.value - a.value);
        } else if (currentFundsSortType === 'net-in') {
            // Net Inflow: Positive funds flow first.
            // Since 'value' is absolute size, we need to look at data.fundsFlow
            root.sort((a, b) => b.data.fundsFlow - a.data.fundsFlow);
        } else if (currentFundsSortType === 'net-out') {
            // Net Outflow: Negative funds flow first (smallest/most negative first)
            root.sort((a, b) => a.data.fundsFlow - b.data.fundsFlow);
        } else {
            // Default fallback
            root.sort((a, b) => b.value - a.value);
        }
    }

    d3.treemap()
        .size([width, height])
        .padding(1)
        .round(true)
        (root);

    // 內部 helper 沒問題
    const getColor = (changePercent) => {
        // 上漲：紅色系
        if (changePercent > 5) return '#8b1a1a';      // >5% 最深紅
        if (changePercent > 2.5) return '#a03030';    // 2.5~5% 中紅
        if (changePercent > 0) return '#c05050';      // 0~2.5% 淺紅
        // 平盤
        if (changePercent === 0) return '#4a4a4a';    // 灰色
        // 下跌：綠色系
        if (changePercent > -2.5) return '#4a7a4a';   // 0~-2.5% 淺綠
        if (changePercent > -5) return '#2a5a2a';     // -2.5~-5% 中綠
        return '#1a4a1a';                              // <-5% 最深綠
    };

    const svg = d3.select('#treemap')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // 創建 tooltip
    let tooltip = d3.select('#treemap').select('.treemap-tooltip');
    if (tooltip.empty()) {
        tooltip = d3.select('#treemap')
            .append('div')
            .attr('class', 'treemap-tooltip');
    }

    const nodes = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    nodes.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => getColor(d.data.changePercent))
        .attr('class', 'treemap-rect')
        .on('click', (event, d) => {
            loadStockDetails(d.data.code, d.data.name);
            updateDetailHeader(d.data);
        })
        .on('mouseover', (event, d) => {
            const boxWidth = d.x1 - d.x0;
            const boxHeight = d.y1 - d.y0;
            
            // 如果方塊太小無法顯示完整資訊，則顯示 tooltip
            if (boxWidth < 80 || boxHeight < 60) {
                const fundsSign = d.data.fundsFlow > 0 ? '+' : '';
                tooltip
                    .style('display', 'block')
                    .html(`
                        <div><strong>${d.data.name}</strong></div>
                        <div>漲跌幅: ${d.data.changePercent > 0 ? '+' : ''}${d.data.changePercent.toFixed(2)}%</div>
                        <div>資金流: ${fundsSign}${d.data.fundsFlow.toFixed(2)}億</div>
                        <div>成交量: ${d.data.volume.toFixed(2)}億</div>
                    `)
                    .style('left', (event.pageX - 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            }
        })
        .on('mousemove', (event) => {
            tooltip
                .style('left', (event.pageX - 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none');
        });

    // Centered Text Logic with adaptive display
    // Name - 根據方塊大小調整字體
    nodes.append('text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2 - 14)
        .text(d => {
            const boxWidth = d.x1 - d.x0;
            const name = d.data.name;
            // 如果方塊太小，縮短文字
            if (boxWidth < 60) {
                return name.substring(0, 2);
            } else if (boxWidth < 80) {
                return name.substring(0, 3);
            }
            return name;
        })
        .attr('class', 'treemap-label')
        .style('font-size', d => {
            const boxWidth = d.x1 - d.x0;
            if (boxWidth < 60) return '11px';
            if (boxWidth < 80) return '13px';
            return '15px';
        })
        .style('display', d => (d.x1 - d.x0) > 40 && (d.y1 - d.y0) > 40 ? 'block' : 'none');

    // Change % - 根據方塊大小調整顯示
    nodes.append('text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2 + 2)
        .text(d => `${d.data.changePercent > 0 ? '+' : ''}${d.data.changePercent.toFixed(2)}%`)
        .attr('class', d => {
            const val = d.data.changePercent;
            return `treemap-change ${val > 0 ? 'positive' : val < 0 ? 'negative' : 'neutral'}`;
        })
        .style('font-size', d => {
            const boxWidth = d.x1 - d.x0;
            if (boxWidth < 60) return '10px';
            if (boxWidth < 80) return '11px';
            return '13px';
        })
        .style('display', d => (d.x1 - d.x0) > 50 && (d.y1 - d.y0) > 50 ? 'block' : 'none');

    // Value (Volume or Funds) - 根據方塊大小調整顯示
    nodes.append('text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2 + 16)
        .text(d => {
            const boxWidth = d.x1 - d.x0;
            let value;
            if (currentSortBy === 'volume') {
                // 即使顯示成交量，也顯示資金流向的正負號
                const sign = d.data.fundsFlow > 0 ? '+' : '';
                value = `${sign}${d.data.volume.toFixed(boxWidth < 70 ? 0 : 2)}億`;
            } else {
                const sign = d.data.fundsFlow > 0 ? '+' : '';
                value = `${sign}${d.data.fundsFlow.toFixed(boxWidth < 70 ? 0 : 2)}億`;
            }
            // 如果方塊太小，移除「億」字
            if (boxWidth < 60) {
                value = value.replace('億', '');
            }
            return value;
        })
        .attr('class', d => {
            // 無論顯示成交量還是資金流，都根據資金流向來著色
            const val = d.data.fundsFlow;
            return `treemap-value ${val > 0 ? 'positive' : val < 0 ? 'negative' : 'neutral'}`;
        })
        .style('font-size', d => {
            const boxWidth = d.x1 - d.x0;
            if (boxWidth < 60) return '9px';
            if (boxWidth < 80) return '10px';
            return '12px';
        })
        .style('display', d => (d.x1 - d.x0) > 50 && (d.y1 - d.y0) > 65 ? 'block' : 'none');
}

// Update Header Helper
function updateDetailHeader(data) {
    document.getElementById('detail-title').textContent = data.name;
    document.getElementById('detail-panel').classList.remove('hidden');
    // Pre-fill header stats from treemap data if possible
}

// 載入詳細資料（股票清單與走勢）
async function loadStockDetails(industryCode, industryName) {
    const detailPanel = document.getElementById('detail-panel');
    const chartPlaceholder = document.getElementById('chart-placeholder');
    const listPlaceholder = document.getElementById('stock-list-placeholder');

    detailPanel.classList.remove('hidden');
    document.getElementById('detail-title').textContent = industryName;

    // Clear previous
    chartPlaceholder.innerHTML = '<p>載入中...</p>';
    listPlaceholder.innerHTML = '<p>載入中...</p>';

    try {
        // 1. 取得成分股清單
        // Data format: [["StockName", "StockCode"], ...]
        const stockListResponse = await fetch('/api/stock-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commkey: industryCode })
        });

        const stockListResult = await stockListResponse.json();

        if (!stockListResult.success || !Array.isArray(stockListResult.data)) {
            throw new Error('無法取得成分股清單');
        }

        const rawStocks = stockListResult.data; // 2D Array
        if (rawStocks.length === 0) {
            listPlaceholder.innerHTML = '<p>無成分股資料</p>';
            return;
        }

        // Map stocks: [Name, Code]
        const stocks = rawStocks.map(item => ({
            Name: item[0],
            CommKey: item[1]
        }));

        // 取得前 50 檔股票代碼
        const stockCodes = stocks.slice(0, 50).map(s => s.CommKey).join(',');

        // 2. 取得即時行情 (StockCalculation)
        // Data format: [Time, Seq, Price, Vol, Low, High, Code, Change, ChangeP, TotalVal, TotalVol, Open]
        const tickResponse = await fetch('/api/tick-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stockCodes: stockCodes })
        });

        const tickResult = await tickResponse.json();

        if (!tickResult.success || !Array.isArray(tickResult.data)) {
            throw new Error('無法取得即時行情');
        }

        // Map ticks: Code is index 6, Price is index 2, ChangeP is index 8
        const ticks = tickResult.data.map(item => ({
            CommKey: item[6],
            DealPrice: parseFloat(item[2]),
            ChangePercent: parseFloat(item[8]),
            TotalVolume: parseFloat(item[3]), // Using instant volume per user log? Or total volume? Log says index 3 is instant vol, 10 is accumulated. Usually we want accumulated. 
            // Let's re-verify column order from Plan: 
            // Columns: 交易時間,傳輸序號,即時成交價,即時成交量,最低價,最高價,標的,漲跌,漲跌幅,累計成交總額,累計成交量,開盤價
            // Index:   0       1       2         3           4      5      6   7    8      9           10          11
            // So Index 10 is Accumulated Volume.
            AccumulatedVolume: parseFloat(item[10]),
            RefPrice: parseFloat(item[2]) / (1 + parseFloat(item[8]) / 100)
        }));

        // 3. 渲染股票清單表格
        renderStockTable(stocks, ticks);

        // 4. 取得並渲染走勢圖 (CandlestickChart)
        const trendResponse = await fetch('/api/trend-chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commkey: industryCode })
        });

        const trendResult = await trendResponse.json();
        if (trendResult.success && Array.isArray(trendResult.data) && trendResult.data.length > 0) {
            const data = trendResult.data;
            const lastPoint = data[data.length - 1]; // Latest

            // Update Header UI
            updateHeaderStatsRefactored(lastPoint, data, industryCode);

            renderComplexTrendChart(data);
        } else {
            chartPlaceholder.innerHTML = '<p>暫無走勢資料</p>';
        }

    } catch (error) {
        console.error('載入詳細資料失敗:', error);
        listPlaceholder.innerHTML = `<p class="error">載入失敗: ${error.message}</p>`;
        chartPlaceholder.innerHTML = '<p>無法載入走勢</p>';
    }
}

// Update Header Helper
function updateHeaderStatsRefactored(lastPoint, allPoints, code) {
    const price = parseFloat(lastPoint[2]);
    const firstPoint = allPoints[0];
    const refPrice = parseFloat(firstPoint[10]); // Open of first minute

    const change = price - refPrice;
    const changeP = (change / refPrice) * 100;

    // Find funds flow from global data (naive search)
    const industryData = currentData.find(d => d.code === code);
    const funds = industryData ? industryData.fundsFlow : 0;
    const volume = industryData ? industryData.volume : 0;

    // 更新上方價格顯示
    const currentPriceEl = document.getElementById('current-price');
    const priceChangeEl = document.getElementById('price-change');
    
    if (currentPriceEl) {
        // 計算K棒：用開高低收繪製
        // 從所有數據點中找出最高價和最低價
        // Data format: [Seq, RangeVol, Close, Time, Interval, Low, High, Key, Index, AccVol, Open]
        const open = refPrice;  // 開盤價 (第一個點的開盤價)
        const close = price;    // 收盤價（現價）
        
        // 從所有點中找出最高價和最低價
        let high = open;
        let low = open;
        
        allPoints.forEach(point => {
            const pointHigh = parseFloat(point[6]); // index 6 是最高價
            const pointLow = parseFloat(point[5]);  // index 5 是最低價
            if (pointHigh > high) high = pointHigh;
            if (pointLow < low) low = pointLow;
        });
        
        const kbarSvg = createKBarSVG(open, high, low, close);
        currentPriceEl.innerHTML = kbarSvg + ' ' + price.toFixed(2);
        currentPriceEl.className = `current-price ${change >= 0 ? 'positive' : 'negative'}`;
    }
    
    if (priceChangeEl) {
        const sign = change >= 0 ? '+' : '';
        const arrow = change >= 0 ? '▲' : '▼';
        priceChangeEl.textContent = `${arrow} ${sign}${change.toFixed(2)} (${sign}${changeP.toFixed(2)}%)`;
        priceChangeEl.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
    }

    // Use old elements
    const changeEl = document.getElementById('detail-change');
    const fundsEl = document.getElementById('detail-funds');
    const volEl = document.getElementById('detail-volume');

    const sign = change >= 0 ? '+' : '';
    changeEl.textContent = `${sign}${changeP.toFixed(2)}%`;
    changeEl.className = `stat-value ${change >= 0 ? 'positive' : 'negative'}`;

    const fundsSign = funds >= 0 ? '+' : '';
    fundsEl.textContent = `${fundsSign}${funds.toFixed(2)}億`;
    fundsEl.className = `stat-value ${funds >= 0 ? 'positive' : 'negative'}`;

    volEl.textContent = `${volume.toFixed(2)}億`;
    volEl.className = 'stat-value';
}

// 創建K棒SVG
function createKBarSVG(open, high, low, close) {
    // K棒尺寸設定
    const width = 16;
    const height = 24;
    const bodyWidth = 10;
    
    // 正規化價格到SVG坐標
    const priceRange = high - low;
    if (priceRange === 0) {
        // 如果沒有價格變化，顯示一條橫線
        return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="kbar-svg" style="display: inline-block; vertical-align: middle;">
            <line x1="3" y1="${height/2}" x2="${width-3}" y2="${height/2}" stroke="#888" stroke-width="2"/>
        </svg>`;
    }
    
    const scale = (height - 4) / priceRange;
    const toY = (price) => height - 2 - (price - low) * scale;
    
    // 計算座標
    const highY = toY(high);
    const lowY = toY(low);
    const openY = toY(open);
    const closeY = toY(close);
    
    // 判斷紅K還是綠K
    const isRed = close > open;
    const isGreen = close < open;
    const bodyColor = isRed ? '#ff5252' : (isGreen ? '#4caf50' : '#888');
    const lineColor = bodyColor;
    
    // 實體的上下端
    const bodyTop = Math.min(openY, closeY);
    const bodyBottom = Math.max(openY, closeY);
    const bodyHeight = Math.max(bodyBottom - bodyTop, 1); // 至少1px
    
    const centerX = width / 2;
    const bodyLeft = centerX - bodyWidth / 2;
    
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="kbar-svg" style="display: inline-block; vertical-align: middle;">
        <!-- 上影線 -->
        <line x1="${centerX}" y1="${highY}" x2="${centerX}" y2="${bodyTop}" stroke="${lineColor}" stroke-width="1.5"/>
        <!-- 實體 -->
        <rect x="${bodyLeft}" y="${bodyTop}" width="${bodyWidth}" height="${bodyHeight}" fill="${bodyColor}" stroke="${bodyColor}" stroke-width="1"/>
        <!-- 下影線 -->
        <line x1="${centerX}" y1="${bodyBottom}" x2="${centerX}" y2="${lowY}" stroke="${lineColor}" stroke-width="1.5"/>
    </svg>`;
}

// Advanced Chart Rendering
function renderComplexTrendChart(data) {
    const container = document.getElementById('chart-placeholder');
    container.innerHTML = '';

    // Dimensions
    // Use container dimensions but ensure we have valid values
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 250;

    // Split height: 75% for Price, 25% for Volume
    const priceHeight = height * 0.7;
    const volHeight = height * 0.3;
    const margin = { top: 10, right: 0, bottom: 20, left: 50 };

    // Parse Data
    // [Seq, RangeVol, Close, Time, Interval, Low, High, Key, Index, AccVol, Open]
    const parsedData = data.map(d => ({
        time: new Date(parseInt(d[3])),
        price: parseFloat(d[2]),
        vol: parseFloat(d[1]), // Range Volume
        open: parseFloat(d[10]),
        close: parseFloat(d[2])
    })).sort((a, b) => a.time - b.time);

    // Determine Base Color (Green if down, Red if up overall)
    const isUp = parsedData[parsedData.length - 1].price > parsedData[0].open;
    const mainColor = isUp ? '#ff5252' : '#4caf50';
    const mainFill = isUp ? 'rgba(255, 82, 82, 0.2)' : 'rgba(76, 175, 80, 0.2)';

    const svg = d3.select('#chart-placeholder')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'none'); // Allow stretching to fill container

    // X Scale
    const x = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.time))
        .range([margin.left, width - margin.right]);

    // Y Scale (Price)
    const yPrice = d3.scaleLinear()
        .domain([
            d3.min(parsedData, d => d.price) * 0.995,
            d3.max(parsedData, d => d.price) * 1.005
        ])
        .range([priceHeight, margin.top]);

    // Y Scale (Volume)
    const yVol = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.vol)])
        .range([height - margin.bottom, priceHeight + 10]);

    // Gridlines
    const makeYLines = () => d3.axisLeft(yPrice).ticks(5);
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(${margin.left},0)`)
        .call(makeYLines()
            .tickSize(-width + margin.left + margin.right)
            .tickFormat('')
        )
        .attr('opacity', 0.1);

    // Area Generator
    const area = d3.area()
        .x(d => x(d.time))
        .y0(priceHeight)
        .y1(d => yPrice(d.price));

    // Append Area
    svg.append('path')
        .datum(parsedData)
        .attr('fill', mainFill)
        .attr('d', area);

    // Line Generator
    const line = d3.line()
        .x(d => x(d.time))
        .y(d => yPrice(d.price));

    // Append Line
    svg.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', mainColor)
        .attr('stroke-width', 1.5)
        .attr('d', line);


    // Close Line (Dashed) - Optional, using open of first point as Ref
    svg.append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yPrice(parsedData[0].open))
        .attr('y2', yPrice(parsedData[0].open))
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.5);

    // Volume Bars
    svg.selectAll('.vol-bar')
        .data(parsedData)
        .enter()
        .append('rect')
        .attr('x', d => x(d.time))
        .attr('y', d => yVol(d.vol))
        .attr('width', (width - margin.left - margin.right) / parsedData.length * 0.8) // Gap
        .attr('height', d => (height - margin.bottom) - yVol(d.vol))
        .attr('fill', d => d.close >= d.open ? '#ff5252' : '#4caf50') // Red if Up bar, Green if Down
        .attr('opacity', 0.8);

    // Axes
    // X Axis
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%H:%M')))
        .attr('color', '#888');

    // Y Axis Price
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yPrice).ticks(5))
        .attr('color', mainColor) // Color Y axis match trend? Or white.
        .style('font-size', '10px');

    // Y Axis Vol (Optional, mostly visual)
    // svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(yVol).ticks(2));

    // === 查價功能 ===
    // 創建十字線和資訊框
    const crosshairGroup = svg.append('g')
        .attr('class', 'crosshair')
        .style('display', 'none');

    // 垂直線
    const verticalLine = crosshairGroup.append('line')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.7)
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom);

    // 水平線
    const horizontalLine = crosshairGroup.append('line')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.7)
        .attr('x1', margin.left)
        .attr('x2', width - margin.right);

    // 資訊框
    const infoBox = crosshairGroup.append('g')
        .attr('class', 'info-box');

    const infoRect = infoBox.append('rect')
        .attr('fill', 'rgba(0, 0, 0, 0.85)')
        .attr('stroke', '#666')
        .attr('rx', 4);

    const infoText = infoBox.append('text')
        .attr('fill', '#fff')
        .attr('font-size', '12px')
        .attr('dy', '1em');

    // 互動區域
    const overlay = svg.append('rect')
        .attr('class', 'overlay')
        .attr('x', margin.left)
        .attr('y', margin.top)
        .attr('width', width - margin.left - margin.right)
        .attr('height', priceHeight - margin.top)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .style('cursor', 'crosshair');

    // 滑鼠和觸控事件處理
    function handleMove(event) {
        // 使用 getBoundingClientRect 獲取 SVG 的絕對位置
        const svgNode = svg.node();
        const rect = svgNode.getBoundingClientRect();
        
        // 處理觸控和滑鼠事件
        let clientX, clientY;
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        // 計算相對於 SVG 的位置
        const svgX = clientX - rect.left;
        const xDate = x.invert(svgX);
        
        // 找到最接近的數據點
        const bisect = d3.bisector(d => d.time).left;
        const index = bisect(parsedData, xDate);
        const d0 = parsedData[index - 1];
        const d1 = parsedData[index];
        const d = d1 && d0 ? (xDate - d0.time > d1.time - xDate ? d1 : d0) : (d1 || d0);
        
        if (d) {
            // 更新十字線位置
            const xPos = x(d.time);
            const yPos = yPrice(d.price);
            
            verticalLine
                .attr('x1', xPos)
                .attr('x2', xPos);
            
            horizontalLine
                .attr('y1', yPos)
                .attr('y2', yPos);
            
            // 計算漲跌
            const refPrice = parsedData[0].open;
            const change = d.price - refPrice;
            const changeP = (change / refPrice * 100);
            const changeSign = change >= 0 ? '▲' : '▼';
            const changeColor = change >= 0 ? '#ff6b6b' : '#51cf66';
            
            // 格式化成交量（億/萬）
            let volStr;
            if (d.vol >= 100000000) {
                volStr = (d.vol / 100000000).toFixed(1) + '億';
            } else if (d.vol >= 10000) {
                volStr = (d.vol / 10000).toFixed(1) + '萬';
            } else {
                volStr = Math.floor(d.vol).toString();
            }
            
            // 更新資訊框
            const timeStr = d3.timeFormat('%H:%M')(d.time);
            const priceStr = d.price.toFixed(2);
            const changeStr = `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
            const changePStr = `${changeP >= 0 ? '+' : ''}${changeP.toFixed(2)}%`;
            
            infoText.selectAll('tspan').remove();
            
            // 第一行：時間
            infoText.append('tspan')
                .attr('x', 8)
                .attr('dy', '1em')
                .text(`時：${timeStr}`);
            
            // 第二行：價格
            infoText.append('tspan')
                .attr('x', 8)
                .attr('dy', '1.2em')
                .text(`價：${priceStr}`);
            
            // 第三行：量
            infoText.append('tspan')
                .attr('x', 8)
                .attr('dy', '1.2em')
                .text(`量：${volStr}`);
            
            // 第四行：漲跌（帶顏色）
            const changeTspan = infoText.append('tspan')
                .attr('x', 8)
                .attr('dy', '1.2em')
                .attr('fill', changeColor)
                .text(`${changeSign} ${changeStr}(${changePStr})`);
            
            // 計算資訊框大小和位置
            const bbox = infoText.node().getBBox();
            const padding = 6;
            const boxWidth = bbox.width + padding * 2;
            const boxHeight = bbox.height + padding * 2;
            
            infoRect
                .attr('width', boxWidth)
                .attr('height', boxHeight);
            
            // 根據位置調整資訊框，避免超出邊界
            let infoX = xPos + 10;
            let infoY = yPos - boxHeight - 10;
            
            if (infoX + boxWidth > width - margin.right) {
                infoX = xPos - boxWidth - 10;
            }
            if (infoY < margin.top) {
                infoY = yPos + 10;
            }
            
            infoBox.attr('transform', `translate(${infoX}, ${infoY})`);
            infoText.attr('transform', `translate(0, ${padding})`);
            
            crosshairGroup.style('display', null);
        }
    }
    
    function handleOut() {
        crosshairGroup.style('display', 'none');
    }
    
    overlay
        .on('mousemove', handleMove)
        .on('touchmove', function(event) {
            event.preventDefault();
            handleMove(event);
        })
        .on('mouseout', handleOut)
        .on('touchend', handleOut);
}

// 視窗大小改變時重新渲染
window.addEventListener('resize', () => {
    // Debounce?
    renderTreemap();
});

// Helper for stock table
let currentStockSortBy = 'volume'; // 'volume' or 'change'
let currentStockSortOrder = 'desc'; // 'desc' or 'asc'
let cachedStocks = null;
let cachedTicks = null;

function renderStockTable(stocks, ticks) {
    const container = document.getElementById('stock-list-placeholder');
    const tickMap = {};
    if (ticks) ticks.forEach(t => tickMap[t.CommKey] = t);
    
    // 緩存數據供排序使用
    cachedStocks = stocks;
    cachedTicks = ticks;

    const sData = stocks.map(s => {
        const t = tickMap[s.CommKey];
        return {
            ...s,
            price: t ? t.DealPrice : 0,
            changeP: t ? t.ChangePercent : 0,
            vol: t ? t.AccumulatedVolume : 0,
            hasData: !!t
        };
    });
    
    // 根據當前排序設置排序
    if (currentStockSortBy === 'volume') {
        sData.sort((a, b) => currentStockSortOrder === 'desc' ? b.vol - a.vol : a.vol - b.vol);
    } else if (currentStockSortBy === 'change') {
        sData.sort((a, b) => currentStockSortOrder === 'desc' ? b.changeP - a.changeP : a.changeP - b.changeP);
    }

    // 創建表格HTML，表頭可點擊
    let html = `<table class="stock-table">
        <thead>
            <tr>
                <th>代碼</th>
                <th>名稱</th>
                <th>成交價</th>
                <th class="sortable ${currentStockSortBy === 'change' ? 'active' : ''}" data-sort="change">
                    漲跌幅 ${currentStockSortBy === 'change' ? (currentStockSortOrder === 'desc' ? '▼' : '▲') : ''}
                </th>
                <th class="sortable ${currentStockSortBy === 'volume' ? 'active' : ''}" data-sort="volume">
                    成交量 ${currentStockSortBy === 'volume' ? (currentStockSortOrder === 'desc' ? '▼' : '▲') : ''}
                </th>
            </tr>
        </thead><tbody>`;

    sData.forEach(s => {
        const pStr = s.hasData ? s.price.toFixed(2) : '-';
        const cpStr = s.hasData ? s.changeP.toFixed(2) + '%' : '-';
        const vStr = s.hasData ? Math.floor(s.vol).toLocaleString() : '-';
        let cls = 'neutral';
        if (s.changeP > 0) cls = 'positive';
        if (s.changeP < 0) cls = 'negative';

        html += `<tr>
            <td>${s.CommKey}</td><td>${s.Name}</td>
            <td class="${cls}">${pStr}</td>
            <td class="${cls}">${cpStr}</td>
            <td class="${cls}">${vStr}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    
    // 綁定表頭點擊事件
    setupTableHeaderSorting();
}

// 設置表頭點擊排序
function setupTableHeaderSorting() {
    const sortableHeaders = document.querySelectorAll('.stock-table th.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortType = header.getAttribute('data-sort');
            
            // 如果點擊同一欄位，切換排序順序
            if (currentStockSortBy === sortType) {
                currentStockSortOrder = currentStockSortOrder === 'desc' ? 'asc' : 'desc';
            } else {
                // 如果點擊不同欄位，設為新的排序欄位，預設降冪
                currentStockSortBy = sortType;
                currentStockSortOrder = 'desc';
            }
            
            // 重新渲染表格
            if (cachedStocks && cachedTicks) {
                renderStockTable(cachedStocks, cachedTicks);
            }
        });
    });
}
