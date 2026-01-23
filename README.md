# 資安風險量化與定性分析工具 (ALE Risk Calculator)

## 🌐 Language / 語言選擇

**Choose your language / 選擇語言：**

- [🇺🇸 English Version](#english-version)
- [🇹🇼 中文版本](#中文版本)

---

## English Version

# Cybersecurity Risk Quantification & Qualitative Analysis Tool (ALE Risk Calculator)

**A comprehensive PWA tool for calculating ALE, SLE, and ROI with advanced features for cybersecurity professionals.**

🔗 **Live Demo**  
👉 https://aleriskcalc.kuronetwork.me/

📱 **iOS App**  
👉 [Download on App Store](https://apps.apple.com/tw/app/kuro-risk-calculator-%E8%B3%87%E5%AE%89%E9%A2%A8%E9%9A%AA%E8%A8%88%E7%AE%97%E8%A9%95%E4%BC%B0%E5%99%A8/id6757115315)

🌐 **Progressive Web App** - Install on any device for offline access!

---

## 📖 Introduction

In cybersecurity governance and compliance processes, we often encounter a critical question:  
**"How do we prove that cybersecurity investments actually help?"**

This tool is based on **NIST SP 800-30** methodology, enabling cybersecurity professionals, auditors, and management to quickly perform:

- **Quantitative Analysis**: Calculate SLE, ALE, ROI with advanced visualizations
- **Qualitative Analysis**: Assess risk levels using interactive risk matrices  
- **Batch Processing**: Upload CSV files for bulk risk assessments
- **History Management**: Track and compare assessments over time
- **PWA Features**: Offline functionality and native app experience
- **Report Export**: Professional PDF/Excel reports for presentations and decision-making  

This tool is a **pure frontend** PWA where all data is processed locally in the browser,  
**no data is uploaded**, ensuring complete security of sensitive information.

---

## ✨ Core Features

### 📊 Quantitative Risk Analysis

- **Instant Calculation**: Real-time SLE and ALE calculation with input validation
- **Before vs After Comparison**: Clear visualization of control measure impacts  
- **Advanced Benefit Analysis**: Calculate risk mitigation value and net benefit with ROI
- **Multi-Currency Support**: USD, TWD, EUR, JPY, CNY with proper formatting

#### Enhanced Visualizations

- **ALE Comparison Charts**: Animated bar charts with gradient colors showing risk reduction
- **ROI Dashboard Cards**: Intuitive card-based layout displaying key metrics
- **Real-time Visual Feedback**: Input validation with smooth animations and color coding
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

---

### 📈 FAIR Risk Analysis

A dedicated module implementing the **OpenFAIR™ (Factor Analysis of Information Risk)** standard — the only international standard for quantitative cyber risk analysis (OpenFAIR™ is a trademark of The Open Group).

#### What is FAIR?

FAIR is a quantitative risk analysis framework that helps organizations understand, analyze, and measure information risk in financial terms. Unlike traditional qualitative methods (High/Medium/Low), FAIR provides:

- **Defensible risk measurements** that can be communicated to executives and boards
- **Consistent methodology** for comparing different risk scenarios
- **Financial quantification** enabling cost-benefit analysis of security investments

#### Core Capabilities

**Monte Carlo Simulation Engine**
- 1K / 10K / 50K simulation iterations for statistical accuracy
- Web Worker-based parallel processing for responsive UI
- Real-time progress tracking and cancellation support

**FAIR Taxonomy Implementation**
- **TEF (Threat Event Frequency)**: How often threat agents attempt attacks
- **Vulnerability**: Probability that an attack succeeds
- **Primary Loss**: Direct financial impact (response, replacement, fines)
- **Secondary Loss**: Indirect impact (reputation, customer loss) with occurrence probability

**Statistical Analysis**
- **Beta-PERT Distribution**: Professional 3-point estimation (Min / Most Likely / Max)
- **AAL (Annualized Loss Expectancy)**: Expected yearly loss
- **VaR 90% (Value at Risk)**: Loss threshold exceeded only 10% of the time
- **Loss Exceedance Curve**: Visual probability distribution of potential losses

**ROSI Calculator (Return on Security Investment)**
- Model control effectiveness (0-100%)
- Calculate risk reduction from security investments
- Before/After comparison with dual Loss Exceedance Curves
- Clear ROI metrics for executive decision-making

**Scenario Templates with Industry Data**
- **Ransomware**: Based on Sophos State of Ransomware reports
- **Data Breach**: IBM Cost of a Data Breach reference data
- **DDoS Attack**: Industry average downtime and recovery costs
- **BEC (Business Email Compromise)**: FBI IC3 report statistics
- **Insider Threat**: Ponemon Institute research data

**Scenario Comparison** (Coming Soon)
- Feature temporarily disabled for improvements

**Multi-language Support**: English, 繁體中文, 日本語

---

### 🛡️ Qualitative Risk Analysis

- **Interactive 3×3 Risk Matrix**: Click-to-select likelihood and impact levels
- **Dynamic Visual Feedback**: Real-time highlighting and risk level indication
- **Before/After Comparison**: Side-by-side risk assessment with clear conclusions
- **Risk Level Descriptions**: Contextual guidance for each risk category

---

### 📋 Batch Assessment System

- **CSV Upload**: Drag-and-drop or click-to-upload CSV files
- **Data Validation**: Comprehensive validation with error reporting
- **Template Download**: Pre-formatted CSV template for easy data entry
- **Bulk Processing**: Process multiple assets simultaneously
- **Summary Dashboard**: Overview cards showing total risk, mitigation, and ROI
- **Detailed Results**: Sortable table with individual asset calculations
- **Excel Export**: Export batch results with summary and detailed sheets

---

### 📚 History Management

- **Auto-Save**: Automatic saving of assessments to local IndexedDB
- **Search & Filter**: Find assessments by name, category, date, or tags
- **Load Previous**: One-click loading of historical assessments
- **Export History**: Backup all assessments to JSON format
- **Assessment Comparison**: Track changes and improvements over time
- **Offline Storage**: All history stored locally for privacy and offline access

---

### 📱 Progressive Web App (PWA)

- **Offline Functionality**: Full calculator functionality without internet
- **App Installation**: Install on desktop, mobile, and tablet devices
- **Service Worker**: Intelligent caching for optimal performance
- **Update Notifications**: Automatic updates with user notification
- **Native Experience**: App-like interface with proper theming
- **Responsive Design**: Optimized for all screen sizes and orientations

---

### 🌍 International Support

- **Multi-Language**: English, 繁體中文, 日本語, Español, Deutsch, Français, Português, Tiếng Việt
- **Currency Localization**: Proper formatting for different regions
- **Cultural Adaptation**: Localized risk descriptions and terminology
- **RTL Support**: Ready for right-to-left languages

---

### 🎨 Enhanced UX/UI Features

- **Dark/Light Mode**: System-aware theme switching with manual override
- **Enhanced Input Fields**: Improved contrast, focus states, and validation feedback
- **Smart Visual Hierarchy**: Key values highlighted with color-coded cards and gradients
- **Smooth Animations**: Input success/error animations, hover effects, and transitions
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Touch Optimized**: Gesture-friendly interface for mobile devices
- **Real-time Validation**: Instant feedback with visual cues for input errors
- **Professional Styling**: Card-based layouts with shadows, gradients, and modern design
- **Responsive Number Display**: Adaptive font sizing prevents number overflow in all display contexts

---

### 💾 Export & Sharing

- **Professional PDF Reports**: High-quality reports with charts, calculations, and metadata
- **Comprehensive Excel Workbooks**: Multi-sheet exports with summary, calculations, and risk matrix
- **Data Validation**: Pre-export validation ensures complete and accurate reports
- **Loading Indicators**: Visual feedback during export processing
- **Timestamped Files**: Automatic file naming with generation dates
- **Print Optimization**: Clean print layouts for physical documentation

---

## 🛠️ Technology Stack

This project is a cutting-edge PWA built with modern web technologies.

### Core Technologies
- **HTML5**: Semantic markup with PWA manifest
- **Vanilla JavaScript**: ES6+ with modular architecture
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Tailwind CSS**: Utility-first CSS framework via CDN

### PWA Infrastructure
- **Service Worker**: Advanced caching strategies and offline support
- **Web App Manifest**: Native app installation and theming
- **IndexedDB**: Client-side database for history management
- **Cache API**: Intelligent resource caching

### Data Processing
- **Papa Parse**: Robust CSV parsing and validation
- **Chart.js**: Interactive and responsive data visualizations
- **Intl API**: Native internationalization and currency formatting

### Export Capabilities
- **jsPDF**: Professional PDF generation
- **html2canvas**: High-quality chart and UI screenshots
- **SheetJS**: Excel workbook creation with multiple sheets

### Development Tools
- **Progressive Enhancement**: Works on all browsers
- **Responsive Design**: Mobile-first approach
- **Performance Optimization**: Lazy loading and code splitting
- **Error Boundaries**: Graceful error handling and recovery

## 🏛️ System Architecture

```
                    ┌─────────────────────┐
                    │    User Interface   │
                    │   (Responsive PWA)  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Application Core  │
                    │  (Modular JS ES6+)  │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
│ Calculation    │  │ History Manager  │  │ Batch Processor  │
│ Engine         │  │ (IndexedDB)      │  │ (CSV + Excel)    │
└───────┬────────┘  └─────────┬────────┘  └─────────┬────────┘
        │                     │                     │
┌───────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
│ Visualization  │  │ PWA Services     │  │ Export System    │
│ (Chart.js)     │  │ (Service Worker) │  │ (PDF + Excel)    │
└────────────────┘  └──────────────────┘  └──────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼────────┐
                    │ Local Storage    │
                    │ • IndexedDB      │
                    │ • LocalStorage   │
                    │ • Cache API      │
                    └──────────────────┘
```

---

## 🚀 Quick Start

### Option 1: Use Online (Recommended)
1. Visit **https://aleriskcalc.kuronetwork.me/**
2. Click the install button (📱) to add to your device as a PWA
3. Start calculating immediately with full offline support

### Option 2: Local Installation
```bash
git clone https://github.com/YourUsername/ale-risk-calculator.git
cd ale-risk-calculator
```

Simply open `index.html` in your web browser. No server setup required!

### 3. Getting Started Guide

#### Single Assessment
1. **Enter Asset Information**: Asset Value, Exposure Factor, ARO values
2. **Set Control Parameters**: Post-control ARO and implementation costs
3. **Review Results**: Automatic calculation with visual charts
4. **Qualitative Assessment**: Use interactive risk matrix for likelihood/impact
5. **Export Reports**: Generate professional PDF or Excel reports

#### Batch Assessment
1. **Download Template**: Click "Download CSV Template" for proper format
2. **Prepare Data**: Fill in multiple assets with required columns
3. **Upload CSV**: Drag-and-drop or click to upload your file
4. **Review Preview**: Validate data before processing
5. **Process Batch**: Generate comprehensive results for all assets
6. **Export Results**: Download detailed Excel reports with summaries

#### History Management
1. **Auto-Save**: Assessments are automatically saved as you work
2. **Browse History**: Click "History" to view all previous assessments
3. **Search & Filter**: Find specific assessments by name, date, or category
4. **Load Previous**: One-click to reload any historical assessment
5. **Export Backup**: Download all history as JSON for backup

---

## 📊 Detailed Usage Examples

### Single Quantitative Analysis

**Scenario**: Email server security assessment

**Input Parameters**:
- **Asset Value (AV)**: $100,000
- **Exposure Factor (EF)**: 30%
- **ARO (Before Controls)**: 2.0 times/year
- **ARO (After Controls)**: 0.5 times/year
- **Annual Control Cost**: $20,000

**Automatic Calculations**:
- **SLE** = AV × EF = $100,000 × 0.30 = $30,000
- **ALE (Before)** = SLE × ARO = $30,000 × 2.0 = $60,000
- **ALE (After)** = SLE × ARO = $30,000 × 0.5 = $15,000
- **Risk Mitigation** = ALE(Before) - ALE(After) = $45,000
- **Net Benefit** = Risk Mitigation - Control Cost = $25,000
- **ROI** = (Net Benefit / Control Cost) × 100 = 125%

**Visual Output**: Interactive charts showing ALE comparison and ROI waterfall analysis

### Qualitative Risk Assessment

**Before Controls**:
- **Likelihood**: High (Level 3)
- **Impact**: High (Level 3)  
- **Risk Level**: Critical (Red zone)
- **Recommendation**: Immediate action required, report to board

**After Controls**:
- **Likelihood**: Low (Level 1)
- **Impact**: High (Level 3)
- **Risk Level**: Medium (Yellow zone)
- **Recommendation**: Monitor and manage within budget

### Batch Assessment Example

**CSV Input** (3 assets):
```csv
Asset Name,Asset Value,Exposure Factor,ARO Before,ARO After,Control Cost,Category
Email Server,1000000,25,2,0.5,100000,Infrastructure
Web App,500000,15,1,0.2,50000,Application  
Database,2000000,30,0.5,0.1,200000,Data
```

**Batch Results Summary**:
- **Total Assets**: 3
- **Total Risk (Before)**: $1,350,000
- **Total Risk (After)**: $280,000
- **Total Risk Mitigation**: $1,070,000
- **Total Control Cost**: $350,000
- **Total Net Benefit**: $720,000
- **Average ROI**: 205.7%

**Output**: Comprehensive Excel workbook with summary dashboard and detailed per-asset calculations

---

## 🔧 Installation & PWA Features

### Progressive Web App Installation

**Desktop (Chrome/Edge/Firefox)**:
1. Visit the application URL
2. Look for the install icon (📱) in the address bar
3. Click "Install" to add to your desktop
4. Launch like any native application

**Mobile (iOS/Android)**:
1. Open in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen"
4. Access from your home screen like any app

### PWA Capabilities

- ✅ **Offline Functionality**: Full calculator works without internet
- ✅ **Background Sync**: Data syncs when connection returns
- ✅ **Push Notifications**: Update alerts and reminders
- ✅ **Native Performance**: Fast loading and smooth interactions
- ✅ **Auto-Updates**: Seamless updates with user notification
- ✅ **Cross-Platform**: Works on Windows, macOS, iOS, Android

### Offline Features

When offline, you can still:
- Perform all risk calculations
- Access calculation history
- Create and export reports
- Use batch assessment (for pre-loaded data)
- Switch languages and themes

---

## 🎯 Advanced Features

### History Management

**Auto-Save Functionality**:
- Assessments automatically saved every 2 seconds
- No data loss during browser crashes or accidental closure
- Intelligent deduplication prevents duplicate entries

**Search & Organization**:
- Full-text search across asset names, categories, and notes
- Filter by date ranges, categories, and tags
- Sort by creation date, asset value, or risk level

**Data Export Options**:
- Individual assessment export to JSON
- Bulk history export for backup
- Excel integration for further analysis

### Batch Processing Workflow

**Step 1: Data Preparation**
- Download the provided CSV template
- Fill in required columns: Asset Name, Asset Value, Exposure Factor, ARO Before, ARO After, Control Cost
- Optional columns: Category, Notes, Tags

**Step 2: Upload & Validation**
- Drag-and-drop CSV file or click to browse
- Real-time validation with detailed error reporting
- Preview first 5 rows before processing

**Step 3: Processing & Results**
- Bulk calculation of all risk metrics
- Summary dashboard with key statistics
- Detailed results table with sorting and filtering

**Step 4: Export & Analysis**
- Professional Excel reports with multiple sheets
- Summary sheet with aggregate statistics
- Detailed sheet with per-asset calculations
- Charts and visualizations included

### Multi-Language Support

**Supported Languages**:
- 🇺🇸 English (Default)
- 🇹🇼 繁體中文 (Traditional Chinese)
- 🇯🇵 日本語 (Japanese)
- 🇪🇸 Español (Spanish)
- 🇩🇪 Deutsch (German)
- 🇫🇷 Français (French)
- 🇵🇹 Português (Portuguese)
- 🇻🇳 Tiếng Việt (Vietnamese)

**Localization Features**:
- Complete UI translation
- Currency formatting per region
- Date/time formatting
- Risk level descriptions
- Cultural adaptation of risk terminology

---

## 🤝 Contributing

We welcome contributions from the cybersecurity community!

### How to Contribute

1. **Report Issues**: Found a bug or have a feature request? Open an issue
2. **Translate**: Help add support for additional languages
3. **Enhance Features**: Contribute new calculation methods or visualizations
4. **Improve Documentation**: Help make the tool more accessible

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YourUsername/ale-risk-calculator.git
cd ale-risk-calculator

# No build process required - it's pure HTML/JS/CSS
# Simply open index.html in your browser

# For development with live reload (optional)
npx live-server
```

### Code Structure

```
ALE-Risk-Calculator/
├── index.html              # Main ALE calculator
├── fair.html               # FAIR risk analysis module
├── fair.worker.js          # Monte Carlo simulation worker
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── icons/                  # PWA icons
│   ├── icon.svg
│   └── icon-192.png
├── README.md               # This file
└── LICENSE.md              # MIT license
```

### Contribution Guidelines

1. **Code Style**: Follow existing JavaScript and CSS patterns
2. **Testing**: Test on multiple browsers and devices
3. **Documentation**: Update README for new features
4. **Accessibility**: Ensure WCAG compliance
5. **Performance**: Maintain fast loading times

---

## 📄 License & Legal

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.

### Third-Party Libraries

- **Chart.js** - MIT License
- **Tailwind CSS** - MIT License  
- **jsPDF** - MIT License
- **html2canvas** - MIT License
- **SheetJS** - Apache 2.0 License
- **Papa Parse** - MIT License

### Privacy & Security

- ✅ **No Data Collection**: All processing happens locally
- ✅ **No Analytics**: No tracking or user behavior monitoring
- ✅ **No External APIs**: Fully self-contained application
- ✅ **Open Source**: Complete transparency of all code
- ✅ **GDPR Compliant**: No personal data processing

---

## 🙏 Acknowledgments

### Methodology & Standards
- **NIST SP 800-30** - Risk Management Guide for Information Technology Systems
- **ISO 27005** - Information Security Risk Management
- **FAIR (Factor Analysis of Information Risk)** - Quantitative risk analysis framework

### Technology Partners
- **Chart.js Community** - Beautiful and responsive data visualizations
- **Tailwind CSS Team** - Modern utility-first CSS framework
- **Web Standards Community** - PWA specifications and best practices

### Special Thanks
- Cybersecurity professionals who provided feedback and testing
- Open source contributors who helped with translations
- Academic institutions using this tool for education
- Organizations that have adopted this for risk assessments

---

## 📞 Contact & Support

### Project Links
- **🌐 Live Application**: https://aleriskcalc.kuronetwork.me/


### Developer Contact
- **👨‍💻 Developer**: Kuro
- **🔗 Portfolio**: https://portaly.cc/kurohuang
- **💼 LinkedIn**: https://www.linkedin.com/in/kurohuang/
- **📝 Medium**: https://medium.com/@kuroH

### Community
- **💬 Discussions**: GitHub Discussions for feature requests and general questions
- **📧 Email**: For security issues or private inquiries
- **🐦 Social**: Follow for updates and cybersecurity insights

---

### Version History

- **v2.4.0** (Current) - Added About Author button to FAIR page, enhanced footer with expandable copyright notice (8 languages), improved code quality for open source release
- **v2.3.0** - Fixed FAIR page mobile layout issue, added version-based cache refresh for FAIR page
- **v2.2.0** - FAIR Analysis module with Monte Carlo simulation and ROSI calculator
- **v2.1.1** - Fixed number overflow in ROI dashboard cards and tables
- **v2.1.0** - PWA features, batch processing, history management
- **v2.0.0** - Multi-language support, enhanced UI/UX
- **v1.5.0** - Qualitative risk analysis, dark mode
- **v1.0.0** - Initial release with quantitative analysis

---

---

## 中文版本

# 資安風險量化與定性分析工具 (ALE Risk Calculator)

**全功能 PWA 資安風險評估工具 — 支援批次處理、歷史管理、離線使用的專業級解決方案**

🔗 **線上使用**  
👉 https://aleriskcalc.kuronetwork.me/

📱 **iOS App**  
👉 [在 App Store 下載](https://apps.apple.com/tw/app/kuro-risk-calculator-%E8%B3%87%E5%AE%89%E9%A2%A8%E9%9A%AA%E8%A8%88%E7%AE%97%E8%A9%95%E4%BC%B0%E5%99%A8/id6757115315)

🌐 **漸進式網頁應用程式** - 可安裝至任何裝置，支援離線使用！

---

## 📖 專案簡介

在資安治理與合規的流程中，我們常遇到一個關鍵問題：  
**「要怎麼證明資安投資真的有幫助？」**

本工具基於 **NIST SP 800-30** 方法論，讓資安人員、稽核與管理階層能快速執行：

- **量化分析**：計算 SLE、ALE、ROI 並提供進階視覺化分析
- **定性分析**：使用互動式風險矩陣評估風險等級  
- **批次處理**：上傳 CSV 檔案進行大量風險評估
- **歷史管理**：追蹤並比較不同時期的評估結果
- **PWA 功能**：離線功能與原生應用程式體驗
- **專業報表**：一鍵輸出 PDF / Excel 報告供簡報與決策使用  

此工具為 **純前端 PWA**，所有資料均在本地瀏覽器端處理，  
**不會上傳任何資料**，確保機敏資訊完全安全。

---

## ✨ 核心功能

### 📊 量化風險分析

- **即時計算**：輸入驗證與即時 SLE、ALE 計算
- **導入前後比較**：清楚視覺化控制措施的影響  
- **進階效益分析**：計算風險降低價值、淨效益與投資報酬率
- **多幣別支援**：支援 USD、TWD、EUR、JPY、CNY 並正確格式化

#### 增強視覺化

- **ALE 比較圖表**：具漸層色彩的動畫長條圖顯示風險降低效果
- **ROI 儀表板卡片**：直觀的卡片式版面顯示關鍵指標
- **即時視覺回饋**：輸入驗證搭配流暢動畫與色彩編碼
- **響應式設計**：針對桌機、平板、手機最佳化

---

### 📈 FAIR 風險分析

實作 **OpenFAIR™（資訊風險因子分析）** 標準的專業量化資安風險分析模組 — 這是唯一的國際量化資安風險分析標準（OpenFAIR™ 為 The Open Group 的商標）。

#### 什麼是 FAIR？

FAIR 是一個量化風險分析框架，協助組織以財務術語理解、分析和衡量資訊風險。與傳統定性方法（高/中/低）不同，FAIR 提供：

- **可辯護的風險衡量**：可向高階主管和董事會溝通的量化數據
- **一致的方法論**：比較不同風險情境的標準化方式
- **財務量化**：支援資安投資的成本效益分析

#### 核心功能

**蒙地卡羅模擬引擎**
- 1K / 10K / 50K 次模擬迭代確保統計準確性
- 基於 Web Worker 的平行處理，維持 UI 響應性
- 即時進度追蹤與取消支援

**FAIR 分類架構實作**
- **TEF（威脅事件頻率）**：威脅行為者嘗試攻擊的頻率
- **脆弱性**：攻擊成功的機率
- **主要損失**：直接財務影響（應變、替換、罰款）
- **次要損失**：間接影響（聲譽、客戶流失）及其發生機率

**統計分析**
- **Beta-PERT 分布**：專業三點估計法（最小值 / 最可能值 / 最大值）
- **AAL（年均損失期望值）**：預期年度損失
- **VaR 90%（風險值）**：僅有 10% 機率超過的損失門檻
- **損失超越曲線**：潛在損失的視覺化機率分布

**ROSI 計算器（資安投資報酬率）**
- 建模控制措施有效性（0-100%）
- 計算資安投資帶來的風險降低
- 控制前後比較，含雙曲線損失超越圖
- 清晰的 ROI 指標供高階決策使用

**情境模板與業界數據**
- **勒索軟體**：基於 Sophos 勒索軟體現況報告
- **資料外洩**：IBM 資料外洩成本報告參考數據
- **DDoS 攻擊**：業界平均停機時間與復原成本
- **BEC（商業電子郵件詐騙）**：FBI IC3 報告統計
- **內部威脅**：Ponemon Institute 研究數據

**情境比較**（即將推出）
- 功能暫時停用以進行改進

**多語系支援**：English、繁體中文、日本語

---

### 🛡️ 定性風險分析

- **互動式 3×3 風險矩陣**：點選選擇可能性與影響程度
- **動態視覺回饋**：即時標示與風險等級指示
- **前後比較**：並排風險評估與清楚結論
- **風險等級說明**：每個風險類別的情境化指導

---

### 📋 批次評估系統

- **CSV 上傳**：拖放或點選上傳 CSV 檔案
- **資料驗證**：完整驗證與錯誤報告
- **範本下載**：預格式化 CSV 範本便於資料輸入
- **批次處理**：同時處理多個資產
- **摘要儀表板**：總風險、降低效果與 ROI 概覽卡片
- **詳細結果**：可排序的個別資產計算表格
- **Excel 匯出**：匯出包含摘要與詳細工作表的批次結果

---

### 📚 歷史管理

- **自動儲存**：評估結果自動儲存至本地 IndexedDB
- **搜尋與篩選**：依名稱、類別、日期或標籤尋找評估
- **載入歷史**：一鍵載入歷史評估
- **匯出歷史**：備份所有評估至 JSON 格式
- **評估比較**：追蹤變化與改善情況
- **離線儲存**：所有歷史本地儲存，保護隱私並支援離線存取

---

### 📱 漸進式網頁應用程式 (PWA)

- **離線功能**：無網路連線時仍可完整使用計算器
- **應用程式安裝**：可安裝至桌機、手機、平板裝置
- **Service Worker**：智慧快取以獲得最佳效能
- **更新通知**：自動更新並通知使用者
- **原生體驗**：類似應用程式的介面與適當主題
- **響應式設計**：針對所有螢幕尺寸與方向最佳化

---

### 🌍 國際化支援

- **多語言**：English、繁體中文、日本語、Español、Deutsch、Français、Português、Tiếng Việt
- **幣別本地化**：不同地區的適當格式化
- **文化適應**：本地化風險描述與術語
- **RTL 支援**：準備支援由右至左語言

---

### 🎨 增強 UX/UI 功能

- **深色/淺色模式**：系統感知主題切換與手動覆寫
- **增強輸入欄位**：改善對比度、焦點狀態與驗證回饋
- **智慧視覺層級**：關鍵數值以色彩編碼卡片與漸層突出顯示
- **流暢動畫**：輸入成功/錯誤動畫、懸停效果與轉場
- **無障礙設計**：符合 WCAG 標準，支援鍵盤導航與螢幕閱讀器
- **觸控最佳化**：手機裝置友善的手勢介面
- **即時驗證**：輸入錯誤的即時回饋與視覺提示
- **專業樣式**：具陰影、漸層與現代設計的卡片式版面
- **響應式數字顯示**：自適應字體大小防止數字在所有顯示情境中溢出

---

### 💾 匯出與分享

- **專業 PDF 報告**：包含圖表、計算與中繼資料的高品質報告
- **完整 Excel 工作簿**：包含摘要、計算與風險矩陣的多工作表匯出
- **資料驗證**：匯出前驗證確保完整準確的報告
- **載入指示器**：匯出處理期間的視覺回饋
- **時間戳檔案**：自動以生成日期命名檔案
- **列印最佳化**：實體文件的清潔列印版面

---

## 🛠️ 技術架構

本專案是使用現代網頁技術建構的尖端 PWA。

### 核心技術
- **HTML5**：具 PWA manifest 的語意標記
- **Vanilla JavaScript**：ES6+ 模組化架構
- **CSS3**：使用 CSS Grid 與 Flexbox 的現代樣式
- **Tailwind CSS**：透過 CDN 的實用優先 CSS 框架

### PWA 基礎設施
- **Service Worker**：進階快取策略與離線支援
- **Web App Manifest**：原生應用程式安裝與主題
- **IndexedDB**：歷史管理的客戶端資料庫
- **Cache API**：智慧資源快取

### 資料處理
- **Papa Parse**：強健的 CSV 解析與驗證
- **Chart.js**：互動式響應資料視覺化
- **Intl API**：原生國際化與幣別格式化

### 匯出功能
- **jsPDF**：專業 PDF 生成
- **html2canvas**：高品質圖表與 UI 截圖
- **SheetJS**：多工作表 Excel 工作簿建立

### 開發工具
- **漸進增強**：適用於所有瀏覽器
- **響應式設計**：行動優先方法
- **效能最佳化**：延遲載入與程式碼分割
- **錯誤邊界**：優雅的錯誤處理與復原

## 🏛️ 系統架構

```
                    ┌─────────────────────┐
                    │    使用者介面       │
                    │   (響應式 PWA)      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   應用程式核心      │
                    │  (模組化 JS ES6+)   │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
│ 計算引擎       │  │ 歷史管理器       │  │ 批次處理器       │
│                │  │ (IndexedDB)      │  │ (CSV + Excel)    │
└───────┬────────┘  └─────────┬────────┘  └─────────┬────────┘
        │                     │                     │
┌───────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
│ 視覺化         │  │ PWA 服務         │  │ 匯出系統         │
│ (Chart.js)     │  │ (Service Worker) │  │ (PDF + Excel)    │
└────────────────┘  └──────────────────┘  └──────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼────────┐
                    │ 本地儲存         │
                    │ • IndexedDB      │
                    │ • LocalStorage   │
                    │ • Cache API      │
                    └──────────────────┘
```

---

## 🚀 快速開始

### 選項 1：線上使用（推薦）
1. 造訪 **https://aleriskcalc.kuronetwork.me/**
2. 點選安裝按鈕（📱）將其新增至您的裝置作為 PWA
3. 立即開始計算，完全支援離線使用

### 選項 2：本地安裝
```bash
git clone https://github.com/YourUsername/ale-risk-calculator.git
cd ale-risk-calculator
```

直接用瀏覽器開啟 `index.html` 即可，無需架設伺服器！

### 3. 入門指南

#### 單一評估
1. **輸入資產資訊**：資產價值、暴露因子、ARO 數值
2. **設定控制參數**：控制後 ARO 與實施成本
3. **檢視結果**：自動計算與視覺化圖表
4. **定性評估**：使用互動式風險矩陣設定可能性/影響程度
5. **匯出報告**：產生專業 PDF 或 Excel 報告

#### 批次評估
1. **下載範本**：點選「下載 CSV 範本」取得正確格式
2. **準備資料**：填入多個資產的必要欄位
3. **上傳 CSV**：拖放或點選上傳您的檔案
4. **檢視預覽**：處理前驗證資料
5. **處理批次**：為所有資產產生完整結果
6. **匯出結果**：下載包含摘要的詳細 Excel 報告

#### 歷史管理
1. **自動儲存**：工作時評估會自動儲存
2. **瀏覽歷史**：點選「歷史記錄」檢視所有先前評估
3. **搜尋與篩選**：依名稱、日期或類別尋找特定評估
4. **載入先前**：一鍵重新載入任何歷史評估
5. **匯出備份**：下載所有歷史作為 JSON 備份

---

## 📊 詳細使用範例

### 單一量化分析

**情境**：電子郵件伺服器資安評估

**輸入參數**：
- **資產價值 (AV)**：$100,000
- **暴露因子 (EF)**：30%
- **ARO（控制前）**：2.0 次/年
- **ARO（控制後）**：0.5 次/年
- **年度控制成本**：$20,000

**自動計算**：
- **SLE** = AV × EF = $100,000 × 0.30 = $30,000
- **ALE（前）** = SLE × ARO = $30,000 × 2.0 = $60,000
- **ALE（後）** = SLE × ARO = $30,000 × 0.5 = $15,000
- **風險降低** = ALE（前）- ALE（後）= $45,000
- **淨效益** = 風險降低 - 控制成本 = $25,000
- **ROI** = （淨效益 / 控制成本）× 100 = 125%

**視覺化輸出**：顯示 ALE 比較與 ROI 瀑布分析的互動圖表

### 定性風險評估

**控制措施前**：
- **可能性**：高（等級 3）
- **影響程度**：高（等級 3）
- **風險等級**：嚴重（紅色區域）
- **建議**：必須立即處理，並向高層匯報

**控制措施後**：
- **可能性**：低（等級 1）
- **影響程度**：高（等級 3）
- **風險等級**：中等（黃色區域）
- **建議**：應持續監控，資源允許時處理

### 批次評估範例

**CSV 輸入**（3 個資產）：
```csv
Asset Name,Asset Value,Exposure Factor,ARO Before,ARO After,Control Cost,Category
Email Server,1000000,25,2,0.5,100000,Infrastructure
Web App,500000,15,1,0.2,50000,Application  
Database,2000000,30,0.5,0.1,200000,Data
```

**批次結果摘要**：
- **總資產數**：3
- **總風險（前）**：$1,350,000
- **總風險（後）**：$280,000
- **總風險降低**：$1,070,000
- **總控制成本**：$350,000
- **總淨效益**：$720,000
- **平均 ROI**：205.7%

**輸出**：包含摘要儀表板與詳細個別資產計算的完整 Excel 工作簿

---

## 🔧 安裝與 PWA 功能

### 漸進式網頁應用程式安裝

**桌機（Chrome/Edge/Firefox）**：
1. 造訪應用程式網址
2. 尋找網址列中的安裝圖示（📱）
3. 點選「安裝」新增至您的桌面
4. 像任何原生應用程式一樣啟動

**手機（iOS/Android）**：
1. 在 Safari（iOS）或 Chrome（Android）中開啟
2. 點選分享按鈕
3. 選擇「加入主畫面」
4. 從主畫面存取，就像任何應用程式一樣

### PWA 功能

- ✅ **離線功能**：無網路連線時完整計算器仍可運作
- ✅ **背景同步**：連線恢復時資料同步
- ✅ **推播通知**：更新提醒與通知
- ✅ **原生效能**：快速載入與流暢互動
- ✅ **自動更新**：無縫更新並通知使用者
- ✅ **跨平台**：適用於 Windows、macOS、iOS、Android

### 離線功能

離線時，您仍可以：
- 執行所有風險計算
- 存取計算歷史
- 建立與匯出報告
- 使用批次評估（針對預載資料）
- 切換語言與主題

---

## 🎯 進階功能

### 歷史管理

**自動儲存功能**：
- 評估每 2 秒自動儲存
- 瀏覽器當機或意外關閉時不會遺失資料
- 智慧去重避免重複項目

**搜尋與組織**：
- 跨資產名稱、類別與備註的全文搜尋
- 依日期範圍、類別與標籤篩選
- 依建立日期、資產價值或風險等級排序

**資料匯出選項**：
- 個別評估匯出至 JSON
- 備份用的批次歷史匯出
- Excel 整合以進行進一步分析

### 批次評估處理工作流程

**步驟 1：資料準備**
- 下載提供的 CSV 範本
- 填入必要欄位：資產名稱、資產價值、暴露因子、ARO 前、ARO 後、控制成本
- 選用欄位：類別、備註、標籤

**步驟 2：上傳與驗證**
- 拖放 CSV 檔案或點選瀏覽
- 即時驗證與詳細錯誤報告
- 處理前預覽前 5 列

**步驟 3：處理與結果**
- 所有風險指標的批量計算
- 包含關鍵統計的摘要儀表板
- 包含排序與篩選的詳細結果表格

**步驟 4：匯出與分析**
- 包含多個工作表的專業 Excel 報告
- 包含彙總統計的摘要工作表
- 包含個別資產計算的詳細工作表
- 包含圖表與視覺化

### 多語言支援

**支援語言**：
- 🇺🇸 English（預設）
- 🇹🇼 繁體中文
- 🇯🇵 日本語
- 🇪🇸 Español（西班牙語）
- 🇩🇪 Deutsch（德語）
- 🇫🇷 Français（法語）
- 🇵🇹 Português（葡萄牙語）
- 🇻🇳 Tiếng Việt（越南語）

**本地化功能**：
- 完整 UI 翻譯
- 各地區幣別格式化
- 日期/時間格式化
- 風險等級描述
- 風險術語的文化適應

---

## 🤝 貢獻指南

我們歡迎資安社群的貢獻！

### 如何貢獻

1. **回報問題**：發現錯誤或有功能請求？開啟 issue
2. **翻譯**：協助新增其他語言支援
3. **增強功能**：貢獻新的計算方法或視覺化
4. **改善文件**：協助讓工具更易於使用

### 開發環境設置

```bash
# Fork 並 clone 儲存庫
git clone https://github.com/YourUsername/ale-risk-calculator.git
cd ale-risk-calculator

# 不需要建置程序 - 純 HTML/JS/CSS
# 只需在瀏覽器中開啟 index.html

# 開發時使用即時重載（選用）
npx live-server
```

### 程式碼結構

```
ALE-Risk-Calculator/
├── index.html              # 主要 ALE 計算器
├── fair.html               # FAIR 風險分析模組
├── fair.worker.js          # 蒙地卡羅模擬 Worker
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── icons/                  # PWA 圖示
│   ├── icon.svg
│   └── icon-192.png
├── README.md               # 此檔案
└── LICENSE.md              # MIT 授權
```

### 貢獻指南

1. **程式碼風格**：遵循現有的 JavaScript 與 CSS 模式
2. **測試**：在多個瀏覽器與裝置上測試
3. **文件**：為新功能更新 README
4. **無障礙**：確保 WCAG 合規
5. **效能**：維持快速載入時間

---

## 📄 授權與法律

本專案採用 **MIT 授權** - 詳見 [LICENSE.md](LICENSE.md) 檔案。

### 第三方函式庫

- **Chart.js** - MIT 授權
- **Tailwind CSS** - MIT 授權  
- **jsPDF** - MIT 授權
- **html2canvas** - MIT 授權
- **SheetJS** - Apache 2.0 授權
- **Papa Parse** - MIT 授權

### 隱私與安全

- ✅ **無資料收集**：所有處理均在本地進行
- ✅ **無分析**：無追蹤或使用者行為監控
- ✅ **無外部 API**：完全自包含應用程式
- ✅ **開源**：所有程式碼完全透明
- ✅ **GDPR 合規**：無個人資料處理

---

## 🙏 致謝

### 方法論與標準
- **NIST SP 800-30** - 資訊技術系統風險管理指南
- **ISO 27005** - 資訊安全風險管理
- **FAIR（資訊風險因子分析）** - 量化風險分析框架

### 技術夥伴
- **Chart.js 社群** - 美觀且響應的資料視覺化
- **Tailwind CSS 團隊** - 現代實用優先 CSS 框架
- **Web 標準社群** - PWA 規範與最佳實務

### 特別感謝
- 提供回饋與測試的資安專業人員
- 協助翻譯的開源貢獻者
- 使用此工具進行教育的學術機構
- 採用此工具進行風險評估的組織

---

## 📞 聯絡與支援

### 專案連結
- **🌐 線上應用程式**：https://aleriskcalc.kuronetwork.me/

### 開發者聯絡
- **👨‍💻 開發者**：Kuro
- **🔗 作品集**：https://portaly.cc/kurohuang
- **💼 LinkedIn**：https://www.linkedin.com/in/kurohuang/
- **📝 Medium**：https://medium.com/@kuroH

### 社群
- **💬 討論**：GitHub Discussions 用於功能請求與一般問題
- **📧 電子郵件**：安全問題或私人詢問
- **🐦 社群媒體**：關注更新與資安見解

---

### 版本歷史

- **v2.3.0**（目前）- 修復 FAIR 頁面手機版跑版問題，新增 FAIR 頁面版本強制刷新機制
- **v2.2.0** - FAIR 風險分析模組，含蒙地卡羅模擬與 ROSI 計算器
- **v2.1.1** - 修復 ROI 儀表板卡片與表格中數字溢出問題
- **v2.1.0** - PWA 功能、批次處理、歷史管理
- **v2.0.0** - 多語言支援、增強 UI/UX
- **v1.5.0** - 定性風險分析、深色模式
- **v1.0.0** - 量化分析的初始版本
