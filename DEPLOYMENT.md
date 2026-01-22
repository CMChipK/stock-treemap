# 股市族群熱力圖 - 部署指南

## 📦 本地開發

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設定環境變數**
   - 複製 `.env.example` 為 `.env`
   - 填入您的 CMoney 帳號密碼
   ```bash
   cp .env.example .env
   ```

3. **啟動服務器**
   ```bash
   npm start
   ```

4. **開啟瀏覽器**
   - 訪問 `http://localhost:3000`

---

## 🚀 部署到 Vercel

### 方法一：使用 Vercel CLI（推薦）

1. **安裝 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **部署專案**
   ```bash
   vercel
   ```
   首次部署會詢問一些問題，都按 Enter 使用預設值即可

4. **設定環境變數**
   ```bash
   vercel env add CMONEY_ACCOUNT
   vercel env add CMONEY_PASSWORD
   vercel env add CMONEY_CLIENT_ID
   vercel env add CMONEY_CLIENT_SECRET
   ```
   每個命令會提示輸入值，輸入後選擇 Production、Preview、Development 都要設定

5. **重新部署**
   ```bash
   vercel --prod
   ```

### 方法二：使用 Vercel 網站

1. **上傳到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **連接 Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 點擊 "Add New Project"
   - 選擇您的 GitHub 倉庫
   - 點擊 "Import"

3. **設定環境變數**
   - 在 "Environment Variables" 區域添加：
     - `CMONEY_ACCOUNT` = 您的帳號
     - `CMONEY_PASSWORD` = 您的密碼
     - `CMONEY_CLIENT_ID` = cmchipkmobile
     - `CMONEY_CLIENT_SECRET` = 735c6defb9e33085f7bd8389

4. **部署**
   - 點擊 "Deploy"
   - 等待部署完成

---

## 🌐 部署到 Render

1. **上傳到 GitHub**（同上）

2. **創建 Web Service**
   - 前往 [render.com](https://render.com)
   - 點擊 "New +" → "Web Service"
   - 連接您的 GitHub 倉庫

3. **設定**
   - Name: 自訂名稱
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **環境變數**
   - 點擊 "Advanced"
   - 添加環境變數：
     - `CMONEY_ACCOUNT`
     - `CMONEY_PASSWORD`
     - `CMONEY_CLIENT_ID`
     - `CMONEY_CLIENT_SECRET`

5. **創建服務**
   - 點擊 "Create Web Service"

---

## 🛠️ 部署到 Railway

1. **上傳到 GitHub**（同上）

2. **部署**
   - 前往 [railway.app](https://railway.app)
   - 點擊 "New Project" → "Deploy from GitHub repo"
   - 選擇您的倉庫

3. **設定環境變數**
   - 在專案設定中點擊 "Variables"
   - 添加所有需要的環境變數

---

## ⚠️ 安全提醒

- **絕對不要**將 `.env` 文件上傳到 GitHub
- `.gitignore` 已經設定忽略 `.env` 文件
- 在部署平台上設定環境變數，不要寫在代碼中
- 定期更換密碼

---

## 📝 環境變數說明

| 變數名稱 | 說明 | 必填 |
|---------|------|------|
| `CMONEY_ACCOUNT` | CMoney 帳號 | ✅ |
| `CMONEY_PASSWORD` | CMoney 密碼 | ✅ |
| `CMONEY_CLIENT_ID` | Client ID | ✅ |
| `CMONEY_CLIENT_SECRET` | Client Secret | ✅ |
| `PORT` | 服務器端口 | ❌ (預設3000) |

---

## 🔗 取得分享連結

部署完成後，您會獲得一個公開網址，例如：

- **Vercel**: `https://your-project.vercel.app`
- **Render**: `https://your-project.onrender.com`
- **Railway**: `https://your-project.up.railway.app`

將此網址分享給其他人即可！

---

## 🐛 常見問題

### Q: 部署後顯示 API 錯誤？
A: 檢查環境變數是否正確設定，特別是帳號密碼

### Q: 如何更新部署？
A: 推送新代碼到 GitHub，Vercel/Render/Railway 會自動重新部署

### Q: 如何查看錯誤日誌？
A: 在部署平台的控制台中查看 "Logs" 或 "Runtime Logs"
