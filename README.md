# 資安風險量化與定性分析工具 (ALE Risk Calculator)

## 🌐 Language / 語言選擇

**Choose your language / 選擇語言：**

- [🇺🇸 English Version](#english-version)
- [🇹🇼 中文版本](#中文版本)

---

## English Version

# Cybersecurity Risk Quantification & Qualitative Analysis Tool (ALE Risk Calculator)

**A simple and reliable tool to calculate ALE, SLE, and ROI for cybersecurity investments.**

🔗 **Live Demo**  
👉 https://aleriskcalc.kuronetwork.me/

---

## 📖 Introduction

In cybersecurity governance and compliance processes, we often encounter a critical question:  
**"How do we prove that cybersecurity investments actually help?"**

This tool is based on **NIST SP 800-30** methodology, enabling cybersecurity professionals, auditors, and management to quickly perform:

- **Quantitative Analysis**: Calculate SLE, ALE, ROI  
- **Qualitative Analysis**: Assess risk levels using risk matrices  
- **Report Export**: One-click PDF/Excel report generation for presentations and decision-making  

This tool is a **pure frontend** static page where all data is processed in the browser,  
**no data is uploaded**, ensuring the security of sensitive information.

---

## ✨ Core Features

### 📊 Quantitative Risk Analysis

- **Instant Calculation**: Automatically generate SLE and ALE after inputting AV, EF, ARO  
- **Before vs After Comparison**: Clearly show the impact of control measures  
- **Benefit Analysis**: Calculate "risk reduction amount" and "final net benefit"  

#### Visual Charts

- **ALE Comparison Bars**: Intuitively compare risk reduction magnitude  
- **Net Benefit Waterfall Chart**: Present the financial logic of "risk reduction − cost = net benefit"  

---

### 🛡️ Qualitative Risk Analysis

- **3×3 Risk Matrix**: Based on Likelihood × Impact  
- **Dynamic Highlight**: Display Low / Medium / High / Critical levels  
- **Before/After View**: Show risk reduction after implementing control measures  

---

### 💾 Export & Sharing

- **PDF Export**: Complete with charts and all data  
- **Excel Export**: Convenient for secondary analysis and internal archiving  

---

## 🛠️ Tech Stack

This project is a fully static frontend application with no backend services.

- **Core**: HTML5, Vanilla JavaScript  
- **Styling**: Tailwind CSS (CDN)  
- **Charts**: Chart.js  

**Export Libraries**

- jsPDF (PDF Generation)  
- html2canvas (HTML Snapshot)  
- SheetJS (Excel Export)  

## 🏛️ System Architecture

                +----------------------+
                |      User Input      |
                +----------+-----------+
                           |
                           v
             +-----------------------------+
             |  Risk Calculation Engine    |
             |      (JavaScript)           |
             +-----------------------------+
               |            |             |
      (Quantitative)   (Qualitative)   (Visualization)
         SLE/ALE       Risk Matrix      Charts/Graphs
               |            |             |
               +------------+-------------+
                           |
                           v
         +------------------------------------------+
         |         Export Module                    |
         |  - PDF (jsPDF + html2canvas)             |
         |  - Excel (SheetJS)                       |
         +------------------------------------------+

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YourUsername/ale-risk-calculator.git
cd ale-risk-calculator
```

### 2. Open in Browser

Simply open `index.html` in your web browser. No server setup required!

### 3. Start Calculating

1. **Quantitative Analysis**: Enter Asset Value (AV), Exposure Factor (EF), and Annual Rate of Occurrence (ARO)
2. **Qualitative Analysis**: Select likelihood and impact levels on the risk matrix
3. **Export Results**: Generate PDF or Excel reports with one click

---

## 📊 Usage Examples

### Quantitative Analysis Example

**Scenario**: Email server security assessment

- **Asset Value (AV)**: $100,000
- **Exposure Factor (EF)**: 30% (0.3)
- **Annual Rate of Occurrence (ARO)**: 2 times/year

**Results**:
- **SLE** = AV × EF = $100,000 × 0.3 = $30,000
- **ALE** = SLE × ARO = $30,000 × 2 = $60,000

**After implementing security controls**:
- **New ARO**: 0.5 times/year
- **New ALE**: $30,000 × 0.5 = $15,000
- **Risk Reduction**: $60,000 - $15,000 = $45,000
- **Control Cost**: $20,000
- **Net Benefit**: $45,000 - $20,000 = $25,000

### Qualitative Analysis Example

**Before Controls**:
- **Likelihood**: High (3)
- **Impact**: High (3)
- **Risk Level**: Critical (9)

**After Controls**:
- **Likelihood**: Low (1)
- **Impact**: High (3)
- **Risk Level**: Medium (3)

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- **NIST SP 800-30** for risk assessment methodology
- **Chart.js** for beautiful data visualization
- **Tailwind CSS** for responsive design
- All contributors and users who provide feedback

---

## 📞 Contact

- **Project Link**: https://github.com/YourUsername/ale-risk-calculator
- **Live Demo**: https://aleriskcalc.kuronetwork.me/
- **Issues**: https://github.com/YourUsername/ale-risk-calculator/issues

---

---

## 中文版本

# 資安風險量化與定性分析工具 (ALE Risk Calculator)

**厭世資安人量化救星 — 快速計算 ALE、SLE 與投資淨效益，產出專業的資安評估報告。**

🔗 **線上使用**  
👉 https://aleriskcalc.kuronetwork.me/

---

## 📖 專案簡介

在資安治理與合規的流程中，我們常遇到一個問題：  
**「要怎麼證明資安投資真的有幫助？」**

本工具基於 **NIST SP 800-30** 方法論，讓資安人員、稽核與管理階層能快速執行：

- **量化分析**：計算 SLE、ALE、ROI  
- **定性分析**：使用風險矩陣評估風險等級  
- **報表匯出**：一鍵輸出 PDF / Excel 報告供簡報與決策使用  

此工具為 **純前端** 靜態頁面，所有資料均在瀏覽器端運算，  
**不會上傳任何資料**，確保機敏資訊安全。

---

## ✨ 核心功能

### 📊 量化風險分析

- **即時計算**：輸入 AV、EF、ARO 後自動產生 SLE 與 ALE  
- **導入前後比較**：清楚呈現控制措施的影響  
- **效益分析**：計算「風險降低金額」與「最終淨效益」  

#### 視覺化圖表

- **ALE 比較圖**：直觀比較風險降低幅度  
- **淨效益瀑布圖**：呈現「風險降低 − 成本 = 淨效益」的財務邏輯  

---

### 🛡️ 定性風險分析

- **3×3 風險矩陣**：基於 Likelihood × Impact  
- **動態標示**：顯示 Low / Medium / High / Critical  
- **前後比較**：呈現控制措施導入後的風險下降情況  

---

### 💾 匯出與分享

- **PDF 匯出**：完整包含圖表與所有數據  
- **Excel 匯出**：便於二次分析與內部存檔  

---

## 🛠️ 技術棧

本專案為純前端，無後端服務。

- **核心技術**：HTML5、Vanilla JavaScript  
- **樣式框架**：Tailwind CSS (CDN)  
- **圖表庫**：Chart.js  

**匯出函式庫**

- jsPDF（PDF 生成）  
- html2canvas（畫面截圖）  
- SheetJS（Excel 輸出）  

## 🏛️ 系統架構

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

## 🚀 快速開始

### 1. Clone 專案

```bash
git clone https://github.com/YourUsername/ale-risk-calculator.git
cd ale-risk-calculator
```

### 2. 開啟瀏覽器

直接用瀏覽器開啟 `index.html` 即可，無需架設伺服器！

### 3. 開始計算

1. **量化分析**：輸入資產價值 (AV)、暴露因子 (EF)、年發生率 (ARO)
2. **定性分析**：在風險矩陣上選擇可能性與影響程度
3. **匯出結果**：一鍵產生 PDF 或 Excel 報告

---

## 📊 使用範例

### 量化分析範例

**情境**：電子郵件伺服器資安評估

- **資產價值 (AV)**：$100,000
- **暴露因子 (EF)**：30% (0.3)
- **年發生率 (ARO)**：2 次/年

**計算結果**：
- **SLE** = AV × EF = $100,000 × 0.3 = $30,000
- **ALE** = SLE × ARO = $30,000 × 2 = $60,000

**導入資安控制措施後**：
- **新 ARO**：0.5 次/年
- **新 ALE**：$30,000 × 0.5 = $15,000
- **風險降低**：$60,000 - $15,000 = $45,000
- **控制成本**：$20,000
- **淨效益**：$45,000 - $20,000 = $25,000

### 定性分析範例

**控制措施導入前**：
- **可能性**：高 (3)
- **影響程度**：高 (3)
- **風險等級**：嚴重 (9)

**控制措施導入後**：
- **可能性**：低 (1)
- **影響程度**：高 (3)
- **風險等級**：中等 (3)

---

## 🤝 貢獻指南

歡迎貢獻！請隨時提交 issues 和 pull requests。

### 開發環境設置

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE.md](LICENSE.md) 檔案。

---

## 🙏 致謝

- **NIST SP 800-30** 風險評估方法論
- **Chart.js** 提供美觀的資料視覺化
- **Tailwind CSS** 響應式設計框架
- 所有提供回饋的貢獻者與使用者

---

## 📞 聯絡資訊

- **專案連結**：https://github.com/YourUsername/ale-risk-calculator
- **線上展示**：https://aleriskcalc.kuronetwork.me/
- **問題回報**：https://github.com/YourUsername/ale-risk-calculator/issues
