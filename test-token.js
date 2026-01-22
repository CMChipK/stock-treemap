const fetch = require('node-fetch');

function parseJwt(token) {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch (e) {
        return null;
    }
}

async function testToken() {
    console.log('Testing token fetch...');

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('login_method', 'email');
    params.append('client_id', 'cmchipkmobile');
    params.append('client_secret', '735c6defb9e33085f7bd8389');
    params.append('account', 'jerry_yang@cmoney.com.tw');
    params.append('password', 'Jerry072577');

    try {
        const response = await fetch('https://www.cmoney.tw/identity/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        if (!response.ok) {
            console.error('Token request failed:', response.status);
            return;
        }

        const data = await response.json();
        console.log('Success! Got Token.');

        let guid = '74632858-753d-4ee9-a3d8-0e34b9164f76';
        const decoded = parseJwt(data.access_token);
        if (decoded && decoded.user_guid) {
            guid = decoded.user_guid;
            console.log('GUID extracted:', guid);
        } else {
            console.log('Using default GUID (extraction failed)');
        }

        async function testStockList(tokenType, tokenValue) {
            console.log(`\nTesting Stock List with ${tokenType}...`);

            const params = {
                action: 'getstocksinindex',
                Commkey: 'C30017',
                AppId: '2', // Explicitly set AppId=2 as requested
                Guid: guid,
                AuthToken: tokenValue
            };
            const queryString = new URLSearchParams(params).toString();

            // Test 1: GET
            console.log(`[GET] Requesting...`);
            const urlGet = `http://www.cmoney.tw/MobileService/ashx/InstantTrading/InstantTrading.ashx?${queryString}`;
            try {
                const res = await fetch(urlGet);
                const text = await res.text();
                console.log(`[GET] Result:`, text.substring(0, 200));
            } catch (e) {
                console.error(`[GET] Error:`, e.message);
            }

            // Test 2: POST (x-www-form-urlencoded)
            console.log(`[POST] Requesting...`);
            const urlPost = `http://www.cmoney.tw/MobileService/ashx/InstantTrading/InstantTrading.ashx`;
            try {
                const res = await fetch(urlPost, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: queryString
                });
                const text = await res.text();
                console.log(`[POST] Result:`, text.substring(0, 200));
            } catch (e) {
                console.error(`[POST] Error:`, e.message);
            }
        }

        if (data.access_token) await testStockList('access_token', data.access_token);
        if (data.id_token) await testStockList('id_token', data.id_token);

    } catch (error) {
        console.error('Error:', error);
    }
}

testToken();
