# 📇 Build 46 — HTMX Contact Manager & Creator CRM

> **Zero JS Framework, 100% Server-Rendered HTML Fragments with HTMX & Node.js Express**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel)](https://htmx-contact-manager-build46.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/breakingthebot/htmx-contact-manager-build46)
[![Tests](https://img.shields.io/badge/Vitest-36%20Passed-6E9F18?style=for-the-badge&logo=vitest)](file:///C:/Users/marve/Desktop/AI-286-Builds/Build_46/contactService.spec.js)
[![Version](https://img.shields.io/badge/Release-v1.8.0-blue?style=for-the-badge)](file:///C:/Users/marve/Desktop/AI-286-Builds/Build_46/CHANGELOG.md)

---

## 🌟 Overview

**HTMX Contact Manager** (Build 46) is a high-performance, dark glassmorphism Contact & Creator CRM web application. Engineered without heavy client-side JavaScript frameworks (React/Vue/Angular), it leverages **HTMX** and **Express.js** to swap partial HTML fragments in real-time with zero full page reloads. Over 18 iterations, it evolved into a enterprise-grade CRM with contact lead scoring, privacy field encryption, vCard `.vcf` export, duplicate profile merging, audit activity timelines, and server-side validation toast popups.

### 🌐 Live Production Demo
- **Live Vercel Application**: [https://htmx-contact-manager-build46.vercel.app](https://htmx-contact-manager-build46.vercel.app)
- **GitHub Codebase**: [https://github.com/breakingthebot/htmx-contact-manager-build46](https://github.com/breakingthebot/htmx-contact-manager-build46)

---

## 🎯 Topics Covered & Core Learning Objectives

- **HTMX Server-Driven Interactivity**:
  - `hx-get`, `hx-post`, `hx-put`, `hx-delete` RESTful HTML fragment swapping.
  - Out-Of-Band updates (`hx-swap-oob="true"`) for simultaneous counter and table updates.
  - Form inclusion (`hx-include`) and target response error handling (`htmx:responseError`, `response-targets`).
  - Custom HTMX event triggers (`HX-Trigger: favoriteToggled`, `HX-Trigger: contactUpdated`).
- **CRM Domain Modeling & Data Processing**:
  - Lead scoring algorithms (`calculateLeadScore`) with `HOT`, `WARM`, and `COLD` engagement badges.
  - Privacy mode masking (`maskEmail`, `maskPhone`) with interactive CSS hover unblur filters.
  - RFC 6350 `.vcf` vCard payload generation for address book sync.
  - Duplicate profile scanning & merging algorithm consolidating activity timelines.
  - CSV spreadsheet export and JSON batch ingestion vault.
- **Automated Unit Testing & Quality Assurance**:
  - Vitest test suite with 36 passing unit tests covering validation, pagination, duplicate merging, lead score calculation, and field encryption sanitization.

---

## 🔥 Feature Highlights Across 18 Iterations

- **v1.0.0 — Core HTMX CRUD Foundation**: Full HTMX contact list table, add modal, inline edit, delete, and search filtering.
- **v1.1.0 — Starred Favorites & Out-Of-Band Counters**: Star favorite contacts with real-time OOB top bar counter updates.
- **v1.2.0 — Server-Rendered HTMX Pagination**: Dynamic pagination controls (`Page X of Y`) and items-per-page selector.
- **v1.3.0 — Contact Activity Audit Timeline**: Chronological event logging for contact edits, favoriting, and notes.
- **v1.4.0 — Duplicate Detection & Merge Engine**: Scan matching emails/names and consolidate notes & activity logs.
- **v1.5.0 — Reminders & Scheduled Follow-up Alerts**: Set follow-up dates with urgency indicators (`🚨 Overdue`, `⏰ Today`).
- **v1.6.0 — vCard (.vcf) Payload Vault**: Single-click export of contact records to RFC 6350 `.vcf` address book files.
- **v1.7.0 — Contact Lead Score & Engagement Calculator**: 0-100 engagement calculator with `🔥 HOT`, `⚡ WARM`, and `❄️ COLD` badges.
- **v1.8.0 — Privacy Shield & Sensitive Field Sanitizer**: Single-click header toggle to mask emails and phone numbers with CSS hover unblur.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Node.js, Express.js (HTML Fragment Rendering Engine)
- **Frontend**: HTMX (Fragment Swapping & Response Targets Extension)
- **Styling**: Modern Vanilla CSS (Dark Glassmorphic UI Design System)
- **Testing**: Vitest unit test suite (36 passing unit tests)
- **Deployment**: Vercel Serverless Platform

---

## 🚀 Local Installation & Run Guide

```bash
# 1. Clone repository
git clone https://github.com/breakingthebot/htmx-contact-manager-build46.git
cd htmx-contact-manager-build46

# 2. Install dependencies
npm install

# 3. Run unit test suite
npm test

# 4. Start local development server
npm run dev
# App running at http://localhost:3000
```
