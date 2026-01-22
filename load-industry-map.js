// 從 CSV 檔案載入產業代碼對照表
// 這個檔案可以手動執行來更新對照表，或整合到建置流程中

const fs = require('fs');
const path = require('path');

function loadIndustryMapFromCSV() {
    const csvPath = path.join(__dirname, '..', 'IndustryNameCSV (2).csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    const map = {};
    lines.forEach(line => {
        const [code, category, name] = line.split(',');
        if (code && name) {
            map[code.trim()] = name.trim();
        }
    });
    
    // 添加用戶指定的額外分類
    const additionalMappings = {
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
        'C30028': '電腦周邊'
    };
    
    Object.assign(map, additionalMappings);
    
    return map;
}

// 如果直接執行此檔案，輸出對照表
if (require.main === module) {
    const map = loadIndustryMapFromCSV();
    console.log('const INDUSTRY_CODE_MAP = {');
    Object.keys(map).sort().forEach(code => {
        console.log(`    '${code}': '${map[code]}',`);
    });
    console.log('};');
}

module.exports = { loadIndustryMapFromCSV };
