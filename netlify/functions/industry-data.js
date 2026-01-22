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

    console.log('正在取得新 Token...');
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

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { requestBody } = JSON.parse(event.body);
        const token = await getAccessToken();

        const apiUrl = 'https://asterisk-chipsapi.cmoney.tw/AdditionInformationRevisit/api/GetOtherQuery/FocusIndustryRankRequest/IEnumerable%3CFocusIndustry%3E';
        const columns = '成交金額,指數匯編分類,欄位1,欄位2,欄位3,漲跌幅,焦點個股1,焦點個股1市值,產業';
        const url = `${apiUrl}?columns=${encodeURIComponent(columns)}&keyNamePath=`;

        if (requestBody && !requestBody.Guid) {
            requestBody.Guid = CACHED_GUID;
        }

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
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, data: data })
        };

    } catch (error) {
        console.error('代理錯誤:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: '代理伺服器錯誤', message: error.message })
        };
    }
};
