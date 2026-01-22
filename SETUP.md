# 設定說明 - 使用代理伺服器解決 CORS 問題

## 問題說明

瀏覽器的 CORS（跨來源資源共享）政策會阻擋直接從前端發送到不同網域的 API 請求。因此需要透過後端代理伺服器來處理 API 請求。

## 安裝步驟

### 1. 安裝 Node.js

如果還沒有安裝 Node.js，請先安裝：
- 下載：https://nodejs.org/
- 選擇 LTS 版本下載並安裝

### 2. 安裝依賴套件

在專案資料夾中開啟終端機（命令提示字元或 PowerShell），執行：

```bash
cd c:\Users\user1\Desktop\stock-treemap
npm install
```

這會安裝以下套件：
- `express` - Web 伺服器框架
- `node-fetch` - HTTP 請求庫
- `cors` - CORS 中間件

### 3. 啟動代理伺服器

執行以下命令啟動伺服器：

```bash
npm start
```

或

```bash
node server.js
```

您應該會看到：
```
✅ 代理伺服器已啟動！
📡 本地端: http://localhost:3000
🌐 請在瀏覽器中開啟: http://localhost:3000/index.html
```

### 4. 開啟網頁

在瀏覽器中開啟：
```
http://localhost:3000/index.html
```

或直接訪問：
```
http://localhost:3000
```

## 使用方式

1. **啟動代理伺服器**：執行 `npm start`
2. **開啟網頁**：在瀏覽器中訪問 `http://localhost:3000`
3. **查看資料**：網頁會自動透過代理伺服器取得 API 資料
4. **重新載入**：點擊「重新載入」按鈕可以更新資料

## 疑難排解

### 問題：`npm install` 失敗
- 檢查 Node.js 是否正確安裝：執行 `node --version`
- 檢查網路連線
- 嘗試使用 `npm install --legacy-peer-deps`

### 問題：Port 3000 已被使用
- 修改 `server.js` 中的 `PORT` 變數為其他數字（如 3001, 8080）
- 或關閉使用 Port 3000 的其他程式

### 問題：API 請求失敗
- 檢查 token 是否正確設定在 `app.js` 中
- 檢查 token 是否過期
- 查看終端機中的錯誤訊息

### 問題：資料顯示為假資料
- 檢查瀏覽器 Console（F12）是否有錯誤訊息
- 檢查終端機中的伺服器日誌
- 確認代理伺服器正在運行

## 檔案說明

- `server.js` - 代理伺服器主程式
- `package.json` - Node.js 專案設定檔
- `app.js` - 前端 JavaScript（已更新為使用代理）
- `index.html` - 網頁主頁面
- `styles.css` - 樣式表

## 停止伺服器

在終端機中按 `Ctrl + C` 停止伺服器。
