# 📇 Build 46 — HTMX Contact Manager & Creator CRM

> **Zero JS Framework, 100% Server-Rendered HTML Fragments with HTMX & Node.js Express**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel)](https://htmx-contact-manager-build46.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/breakingthebot/htmx-contact-manager-build46)
[![Tests](https://img.shields.io/badge/Vitest-30%20Passed-6E9F18?style=for-the-badge&logo=vitest)](file:///C:/Users/marve/Desktop/AI-286-Builds/Build_46/contactService.spec.js)
[![Version](https://img.shields.io/badge/Release-v1.4.0-blue?style=for-the-badge)](file:///C:/Users/marve/Desktop/AI-286-Builds/Build_46/CHANGELOG.md)

---

## 🌟 Overview

**HTMX Contact Manager** is a high-performance, dark glassmorphism Contact & Creator CRM web application. Built without heavy client-side JavaScript frameworks (React/Vue/Angular), it leverages **HTMX** and **Express.js** to swap partial HTML fragments in real-time with zero full page reloads.

### 🌐 Live Production Demo
- **Live Vercel Application**: [https://htmx-contact-manager-build46.vercel.app](https://htmx-contact-manager-build46.vercel.app)
- **GitHub Codebase**: [https://github.com/breakingthebot/htmx-contact-manager-build46](https://github.com/breakingthebot/htmx-contact-manager-build46)

---

## 🔥 Key Features

- **⚡ Zero Client-Side JS Framework**: Powered purely by HTMX `hx-get`, `hx-post`, `hx-put`, and `hx-delete` fragment swaps.
- **🔔 Contact Reminders & Scheduled Follow-up Alerts**: Set follow-up dates and reminder notes with visual urgency badges (`🚨 Overdue`, `⏰ Today`, `📅 Upcoming`) and top quick-access reminders bar.
- **👯 Duplicate Detection & Merge Engine**: Automated scanner detecting matching emails/names and merging duplicate profiles, consolidating notes and activity timelines.
- **🔍 Real-Time Live Search & Category Filtering**: Instantly search contacts by name, email, or category tags (`Sponsor`, `Collaborator`, `VIP`, `Agency`) without page refreshes.
- **📊 Dynamic Column Sorting**: Sort contact records by Name, Email, Phone, Category, or Status ascending/descending with clickable table header fragment triggers (`▲` / `▼`).
- **📄 Server-Rendered HTMX Pagination**: Paginate contact lists dynamically with Out-Of-Band (`hx-swap-oob="true"`) page controls (`Page X of Y`) and items-per-page selectors (`5`, `10`, `25`, `50`).
- **📥 Bulk JSON Import Vault**: Paste or upload JSON arrays of contacts for instant batch database ingestion.
- **🏷️ Custom Key-Value Attributes**: Define custom key-value metadata fields (e.g. `Twitter: @sarah_j`, `Q3 Budget: $25,000`) per contact record inside the slide-out detail drawer.
- **📜 Contact Activity Audit Timeline**: Automated chronological logging of contact creations, edits, notes, favoriting, and custom attribute changes.
- **⭐ Starred Favorites Bar**: Pin favorite contacts to a top quick-access bookmark bar updated via custom HTMX event triggers (`HX-Trigger: favoriteToggled`).
- **🖼️ Auto-Generated Identicon Avatars**: Dynamically generated Identicon SVG URLs via Dicebear API based on contact email seeds.
- **🚨 Server-Side Validation Toast Engine**: Server-rendered glassmorphism toast popups powered by the HTMX `response-targets` extension.
- **📥 CSV Bulk Export**: Export contacts to `.csv` spreadsheets with single-click download.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Node.js, Express.js (HTML Fragment Rendering Engine)
- **Frontend**: HTMX (Fragment Swapping & Response Targets Extension)
- **Styling**: Modern Vanilla CSS (Dark Glassmorphic UI Design System)
- **Testing**: Vitest unit test suite (26 passing unit tests)
- **Deployment**: Vercel Serverless Functions

---

## 📁 Repository Structure

```
Build_46/
├── server.js               # Express server & HTMX HTML fragment render controllers
├── contactService.js       # Contact CRM store, validation, activity audit, & sorting logic
├── contactService.spec.js  # Vitest unit test suite (26 unit tests)
├── public/
│   ├── index.html          # Dark glassmorphic HTML UI layout with HTMX triggers
│   └── style.css           # Custom glassmorphism CSS design system
├── BUILD_NOTES.md          # Comprehensive iteration log & manual testing guides
├── CHANGELOG.md            # Semantic versioning release log
├── package.json            # Dependencies & scripts
└── vercel.json             # Vercel serverless deployment routing config
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `v18.x` or higher
- npm `v9.x` or higher

### Installation & Local Run

1. **Clone Repository**:
   ```bash
   git clone https://github.com/breakingthebot/htmx-contact-manager-build46.git
   cd htmx-contact-manager-build46
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000`.

4. **Run Unit Test Suite**:
   ```bash
   npm test
   ```

---

## 📜 License

MIT License © 2026 AI 286 Builds Team.
