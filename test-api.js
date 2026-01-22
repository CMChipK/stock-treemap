const fetch = require('node-fetch');

async function testApi() {
    console.log('Testing /api/stock-list...');

    try {
        const response = await fetch('http://localhost:3000/api/stock-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commkey: 'C30017' })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Response Length:', text.length);
        console.log('Response Preview:', text.substring(0, 500));
    } catch (error) {
        console.error('Error:', error);
    }
}

testApi();
