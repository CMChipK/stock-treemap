const fs = require('fs');
const iconv = require('iconv-lite');

// 讀取 BIG5 編碼的文件
const buffer = fs.readFileSync('公司基本資料.txt');
const content = iconv.decode(buffer, 'big5');

// 解析文件內容
const lines = content.split('\n');
const stockMap = {};

lines.forEach(line => {
    const parts = line.trim().split('\t');
    if (parts.length >= 2 && parts[0] && parts[1]) {
        const code = parts[0].trim();
        const name = parts[1].trim();
        if (code && name && /^\d+$/.test(code)) {
            stockMap[code] = name;
        }
    }
});

// 輸出為 JSON
fs.writeFileSync('stock-names.json', JSON.stringify(stockMap, null, 2), 'utf8');
console.log('轉換完成！共', Object.keys(stockMap).length, '筆股票資料');
