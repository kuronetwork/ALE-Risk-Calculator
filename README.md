# 資安風險量化與定性分析工具 (ALE Risk Calculator)
# Cybersecurity Risk Quantification & Qualitative Analysis Tool (ALE Risk Calculator)

**厭世資安人量化救星 — 快速計算 ALE、SLE 與投資淨效益，產出專業的資安評估報告。**  
**A simple and reliable tool to calculate ALE, SLE, and ROI for cybersecurity investments.**

🔗 **線上使用 (Live Demo)**  
👉 

---

## 📖 專案簡介 (Introduction)

在資安治理與合規的流程中，我們常遇到一個問題：  
**「要怎麼證明資安投資真的有幫助？」**

本工具基於 **NIST SP 800-30** 方法論，讓資安人員、稽核與管理階層能快速執行：

- **量化分析 (Quantitative Analysis)**：計算 SLE、ALE、ROI  
- **定性分析 (Qualitative Analysis)**：使用風險矩陣評估風險等級  
- **報表匯出**：一鍵輸出 PDF / Excel 報告供簡報與決策使用  

此工具為 **純前端 (Pure Frontend)** 靜態頁面，所有資料均在瀏覽器端運算，  
**不會上傳任何資料**，確保機敏資訊安全。

---

## ✨ 核心功能 (Features)

### 📊 量化風險分析 (Quantitative Risk Analysis)

- **即時計算 (Instant Calculation)**：輸入 AV、EF、ARO 後自動產生 SLE 與 ALE  
- **導入前後比較 (Before vs After Comparison)**：清楚呈現控制措施的影響  
- **效益分析 (Benefit Analysis)**：計算「風險降低金額」與「最終淨效益 (Net Benefit)」  

#### 視覺化圖表 (Visual Charts)

- **ALE 比較圖 (ALE Comparison Bars)**：直觀比較風險降低幅度  
- **淨效益瀑布圖 (Net Benefit Waterfall Chart)**：呈現「風險降低 − 成本 = 淨效益」的財務邏輯  

---

### 🛡️ 定性風險分析 (Qualitative Risk Analysis)

- **3×3 風險矩陣 (3×3 Risk Matrix)**：基於 Likelihood × Impact  
- **動態標示 (Dynamic Highlight)**：顯示 Low / Medium / High / Critical  
- **前後比較 (Before/After View)**：呈現控制措施導入後的風險下降情況  

---

### 💾 匯出與分享 (Export & Sharing)

- **PDF 匯出 (PDF Export)**：完整包含圖表與所有數據  
- **Excel 匯出 (Excel Export)**：便於二次分析與內部存檔  

---

## 🛠️ 技術棧 (Tech Stack)

本專案為純前端，無後端服務。  
This project is a fully static frontend application.

- **Core**：HTML5、Vanilla JavaScript  
- **Styling**：Tailwind CSS (CDN)  
- **Charts**：Chart.js  

**Export Libraries**

- jsPDF（PDF 生成 / PDF Generation）  
- html2canvas（畫面截圖 / HTML Snapshot）  
- SheetJS（Excel 輸出 / Excel Export）  

## 🏛️ 架構圖 (System Architecture)

                +----------------------+
                |        使用者        |
                |      User Input      |
                +----------+-----------+
                           |
                           v
             +-----------------------------+
             |  前端計算邏輯 (JavaScript)  |
             |  Risk Calculation Engine    |
             +-----------------------------+
               |            |             |
      (Quantitative)   (Qualitative)   (Visualization)
         SLE/ALE       Risk Matrix      Charts/Graphs
               |            |             |
               +------------+-------------+
                           |
                           v
         +------------------------------------------+
         |         匯出功能 Export Module            |
         |  - PDF (jsPDF + html2canvas)             |
         |  - Excel (SheetJS)                       |
         +------------------------------------------+


---

## 🚀 快速開始 (Quick Start)

### 1. Clone 專案 (Clone the Repository)

```bash
git clone https://github.com/YourUsername/ale-risk-calculator.git
