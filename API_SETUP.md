# API 資料整合設定說明

## 資料格式分析

根據您提供的 API log，資料格式如下：

### API 端點
- **URL**: `https://asterisk-chipsapi.cmoney.tw/AdditionInformationRevisit/api/GetOtherQuery/FocusIndustryRankRequest/IEnumerable%3CFocusIndustry%3E`
- **Method**: POST
- **需要 Authorization**: Bearer Token

### 請求格式
```json
{
  "Json": "{\"Type\":4371,\"Rank\":30}",
  "AppId": 2,
  "Processing": [],
  "Guid": "74632858-753d-4ee9-a3d8-0e34b9164f76"
}
```

### 回應格式
API 回應是一個**二維陣列**，每個元素代表一個產業的資料：

```javascript
[
  ["41842091000", "3", "41842091000", "0.8619", "-6703209000", "1", "4958", "1793.3", "C23120"],
  ["14756972000", "3", "14756972000", "2.0189", "7447503000", "7.32", "3675", "75.1", "C23050"],
  // ... 更多資料
]
```

### 欄位對應（根據 URL 中的 columns 參數）
- **index 0**: 成交金額（單位：元，需轉換成億）
- **index 1**: 指數匯編分類
- **index 2**: 欄位1
- **index 3**: 欄位2
- **index 4**: 欄位3（推測為資金流向，單位：元，需轉換成億）
- **index 5**: 漲跌幅（百分比）
- **index 6**: 焦點個股1（股票代碼）
- **index 7**: 焦點個股1市值
- **index 8**: 產業代碼（如 C23120）

## 設定步驟

### 1. 設定 Authorization Token

開啟 `app.js` 檔案，找到 `API_CONFIG` 區塊：

```javascript
const API_CONFIG = {
    url: '...',
    columns: '...',
    getAuthToken: () => {
        // 請在這裡設定您的 token
        return 'YOUR_AUTH_TOKEN_HERE';  // ← 替換成您的實際 token
    }
};
```

**如何取得 Token：**
1. 從您提供的 log 中，可以看到 Authorization header：
   ```
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkEydWczbUIxRFQiLCJ0eXAiOiJKV1QifQ...
   ```
2. 複製 `Bearer ` 後面的完整 token 字串
3. 貼到 `getAuthToken()` 函數的 return 中

**範例：**
```javascript
getAuthToken: () => {
    return 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkEydWczbUIxRFQiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIyNDQ2NzE4IiwidXNlcl9ndWlkIjoiNzQ2MzI4NTgtNzUzZC00ZWU5LWEzZDgtMGUzNGI5MTY0Zjc2IiwidG9rZW5faWQiOiIyNjU3IiwiYXBwX2lkIjoiMiIsImlzX2d1ZXN0IjpmYWxzZSwibmJmIjoxNzY4NTQ2NTA4LCJleHAiOjE3Njg2MzY1MDgsImlhdCI6MTc2ODU1MDEwOCwiaXNzIjoiaHR0cHM6Ly93d3cuY21vbmV5LnR3IiwiYXVkIjoiY21vbmV5YXBpIn0.OBi0PCgfnPF5G-O6UwU-BISJYVxtLJ5Bpv-jaZJVv5QU4BR_dPA5d-HcBFP3js8h8JwQSPrOgRSjHMZVVFX-eRMJl4bW5hFTLpGDqUnSBLT_yObrc9AvEI20r5guvDaMJYlJYXNqb1qq6Yi1jz9bzo2aTPIBMNRROWoga2GcZ7Oiz2HkMmFSe7HgVK4yuPUxP-UK1TORfmk82gscw753GId7YGJXjGP3BGRCi61f83qqju402H-jA2ErHtZdh6cCiEYJqjiVBd0Fad7sfsHjNODwE3xwr3kNh_GvW-eHSnZ1tfcebZX2u7uR5DEK89917xyVcqFtYbG9rwYiEUvUvw';
}
```

**注意：** Token 通常有過期時間，如果 API 請求失敗，可能需要更新 token。

### 2. 補充產業代碼對照表

在 `app.js` 中的 `INDUSTRY_CODE_MAP` 物件中，補充更多產業代碼對照：

```javascript
const INDUSTRY_CODE_MAP = {
    'C23120': 'IC-代工',
    'C23050': 'ABF',
    'C26010': '航運',
    // 根據實際 API 回應補充更多...
};
```

**如何取得對照表：**
- 執行一次 API 請求，查看回應中的產業代碼
- 根據您的資料庫或文件補充對照關係
- 如果沒有對照，系統會直接顯示代碼

### 3. 測試 API 連線

1. 開啟網頁
2. 開啟瀏覽器開發者工具（F12）
3. 查看 Console 標籤，應該會看到：
   - `使用 API 資料，共 X 筆` 或
   - `使用假資料，共 X 筆`
4. 如果看到錯誤訊息，檢查：
   - Token 是否正確
   - Token 是否過期
   - 網路連線是否正常

### 4. 資料轉換說明

系統會自動將 API 回應轉換為以下格式：

```javascript
{
    name: '產業名稱',        // 從 INDUSTRY_CODE_MAP 對照或使用代碼
    code: 'C23120',         // 產業代碼
    category: '產業',       // 分類（可自訂）
    changePercent: 1.0,    // 漲跌幅（%）
    fundsFlow: -67.03,     // 資金流向（億）
    volume: 418.42,        // 成交量（億）
    stocks: ['4958'],      // 股票代碼陣列
    size: 418.42           // 用於 treemap 的大小
}
```

## 疑難排解

### 問題：API 請求失敗
- **檢查 Token**：確認 token 是否正確且未過期
- **檢查 CORS**：如果遇到 CORS 錯誤，可能需要透過後端代理
- **檢查網路**：確認可以連接到 API 伺服器

### 問題：資料格式不符
- 查看 Console 中的錯誤訊息
- 檢查 API 回應格式是否與預期一致
- 可能需要調整 `transformApiData()` 函數

### 問題：產業名稱顯示為代碼
- 補充 `INDUSTRY_CODE_MAP` 中的對照關係
- 或提供完整的產業代碼對照表

## 下一步

1. ✅ 設定 Authorization Token
2. ✅ 測試 API 連線
3. ⬜ 補充產業代碼對照表
4. ⬜ 根據實際資料調整欄位對應（如果需要）
5. ⬜ 實作走勢圖和股票清單功能
