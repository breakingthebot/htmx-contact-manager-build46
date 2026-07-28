# Changelog - Build 46

All notable changes to the **HTMX Contact Manager** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-07-27

### Added
- Integrated **Contact Export to VCF / vCard Payload Vault** in `contactService.js` and `server.js`.
- Added RFC 6350 vCard formatter (`exportContactsAsVcard`), Express endpoints (`GET /contacts/export-vcard`, `GET /contacts/:id/vcard`), and single/bulk download actions.
- Updated `public/index.html` and `public/style.css` with **📇 Export vCard** toolbar button, table row download icons, and detail drawer header actions.
- Added unit tests in `contactService.spec.js` (32 total unit tests passing).

## [1.5.0] - 2026-07-27

### Added
- Integrated **Contact Performance & Analytics Dashboard Fragment** in `contactService.js` and `server.js`.
- Added analytics aggregation logic (`getAnalyticsSummary`), Express endpoint (`GET /contacts/analytics`), and fragment renderer (`renderAnalyticsDashboard`).
- Updated `public/index.html` and `public/style.css` with **📊 CRM Analytics & Performance Dashboard** card, key metric counters (Total Contacts, Favorites, Notes, Attributes), and category distribution progress bars.
- Added unit tests in `contactService.spec.js` (31 total unit tests passing).

## [1.4.0] - 2026-07-27

### Added
- Integrated **Contact Reminders & Scheduled Follow-up Alerts** in `contactService.js` and `server.js`.
- Added follow-up date and reminder note properties, scheduler methods (`setContactReminder`, `clearContactReminder`, `getUpcomingReminders`), and Express endpoints (`POST /contacts/:id/reminder`, `DELETE /contacts/:id/reminder`, `GET /contacts/reminders-bar`).
- Updated `public/index.html` and `public/style.css` with **🔔 Scheduled Reminders Bar**, urgency row badges (`🚨 Overdue`, `⏰ Today`, `📅 Upcoming`), and detail drawer datepicker controls.
- Added unit tests in `contactService.spec.js` (30 total unit tests passing).

## [1.3.0] - 2026-07-27

### Added
- Integrated **Contact Duplicate Detection & Merge Engine** in `contactService.js` and `server.js`.
- Added email-based duplicate detector (`detectDuplicateContacts`), record merge engine (`mergeDuplicateContacts`), and Express endpoints (`GET /contacts/duplicates`, `POST /contacts/merge`).
- Updated `public/index.html` and `public/style.css` with **👯 Duplicate Detection & Merge Engine** card, match alerts, primary/duplicate contact badges, and amber merge action buttons.
- Added unit tests in `contactService.spec.js` (28 total unit tests passing).

## [1.2.0] - 2026-07-27

### Added
- Integrated **Contact Field Customizer & Custom Key-Value Attributes** in `contactService.js` and `server.js`.
- Added custom key-value attribute store (`customFields`), mutation functions (`addCustomField`, `removeCustomField`), and Express endpoints (`POST /contacts/:id/custom-fields`, `DELETE /contacts/:id/custom-fields/:key`).
- Updated `public/index.html` and `public/style.css` extending contact drawer panel with custom key/value input fields, custom attribute pills, and delete actions.
- Added unit tests in `contactService.spec.js` (26 total unit tests passing).

## [1.1.0] - 2026-07-27

### Added
- Integrated **Contact Pagination & Items-Per-Page Selector** in `contactService.js` and `server.js`.
- Added array pagination calculations (`getPaginatedContacts`), pagination controls fragment renderer (`renderPaginationControls`), and HTMX Out-Of-Band (`hx-swap-oob="true"`) pagination container swapping.
- Updated `public/index.html` and `public/style.css` with Previous/Next page buttons, page index indicators (`Page X of Y`), and items-per-page selector dropdowns (`5`, `10`, `25`, `50`).
- Added unit tests in `contactService.spec.js` (24 total unit tests passing).

## [1.0.0] - 2026-07-27 - Milestone Release 🎉

### Added
- Integrated **Contact Field Sorting & Multi-Column Reordering** in `contactService.js` and `server.js`.
- Added multi-column array sorting (`getAllContacts(q, category, sortField, sortOrder)`) and dynamic table header fragment renderer (`renderTableHeader`).
- Updated `public/index.html` and `public/style.css` with clickable table column headers, sorting indicators (`▲`/`▼`), and active header column highlights.
- Added unit tests in `contactService.spec.js` (23 total unit tests passing).

## [0.9.0] - 2026-07-27

### Added
- Integrated **Contact Import via JSON Payload Vault** in `contactService.js` and `server.js`.
- Added batch JSON array parser (`importContactsFromJson`) and `POST /contacts/import-json` endpoint.
- Updated `public/index.html` and `public/style.css` with **📥 Bulk JSON Import Vault** card, monospace textarea input, and emerald gradient submit buttons.
- Added unit tests in `contactService.spec.js`.

## [0.8.0] - 2026-07-27

### Added
- Integrated **Contact Activity Audit Timeline** in `contactService.js` and `server.js`.
- Added automated activity logging (`logContactActivity`: `CREATE`, `UPDATE`, `NOTE_ADD`, `STARRED`, `UNSTARRED`, `AVATAR_UPDATE`) and `renderActivityTimeline` fragment helper.
- Updated `public/index.html` and `public/style.css` extending contact detail drawer with chronological activity audit timeline section, icons, and timestamp badges.
- Added unit tests in `contactService.spec.js`.

## [0.7.0] - 2026-07-27

### Added
- Integrated **Contact Avatar Image Uploader & Gravatar Integration** in `contactService.js` and `server.js`.
- Added auto-generated Gravatar / Identicon URL generator (`generateGravatarUrl`), `renderAvatarImg` HTML fragment helper, and custom avatar update capabilities.
- Updated `public/index.html` and `public/style.css` with circular contact avatar profile images in table rows, detail drawer, and top favorites toolbar.
- Added unit tests in `contactService.spec.js`.

## [0.6.0] - 2026-07-27

### Added
- Integrated **Contact Favoriting & Quick Star Bookmark Bar** in `contactService.js` and `server.js`.
- Added favorite state toggling (`toggleFavoriteContact`, `POST /contacts/:id/favorite`) and quick-access favorites bar fragment (`renderFavoritesBar`, `GET /contacts/favorites-bar`).
- Updated `public/index.html` and `public/style.css` with top starred favorites bar, star toggle button (`⭐`/`☆`), and favorite row highlight styles.
- Added unit tests in `contactService.spec.js`.

## [0.5.0] - 2026-07-27

### Added
- Integrated **HTMX Form Validation & Server-Side Toast Error Engine** in `contactService.js` and `server.js`.
- Added email regex format validation (`validateContactInput`) and server-rendered toast notification fragments (`renderToastNotification`).
- Updated `public/index.html` and `public/style.css` with `response-targets` HTMX extension, `#toast-container` element, and glassmorphism toast popup keyframe animations.
- Added unit tests in `contactService.spec.js`.

## [0.4.0] - 2026-07-27

### Added
- Integrated **Contact Tagging & Category Color Badge Customizer** in `contactService.js` and `server.js`.
- Added category tag filtering (`getAllContacts(q, category)`), category stats calculation (`getCategoryStats`), and category pills fragment route (`GET /contacts/categories`).
- Updated `public/index.html` and `public/style.css` with interactive category filter bar, category count badges, and active state pill styling.
- Added unit tests in `contactService.spec.js`.

## [0.3.0] - 2026-07-27

### Added
- Integrated **HTMX Active Contact Detail Drawer & Interaction Notes** in `contactService.js` and `server.js`.
- Added note creation (`addContactNote`, `POST /contacts/:id/notes`) and slide-out drawer fragments (`GET /contacts/:id/drawer`, `GET /contacts/clear-drawer`).
- Updated `public/index.html` and `public/style.css` with `👁️ View` buttons, drawer slide-in panel, and note card logging UI.
- Added unit tests in `contactService.spec.js`.

## [0.2.0] - 2026-07-27

### Added
- Integrated **Interactive Bulk Contact Selection & CSV Export Vault** in `contactService.js` and `server.js`.
- Added bulk contact deletion (`bulkDeleteContacts`, `POST /contacts/bulk-delete`) and CSV payload exporter (`exportContactsAsCsv`, `GET /contacts/export-csv`).
- Updated `public/index.html` and `public/style.css` with bulk selection checkboxes, master select-all toggle, and bulk actions toolbar.
- Added unit tests in `contactService.spec.js`.

## [0.1.0] - 2026-07-27

### Added
- Initialized **HTMX Contact Manager** with zero JS client framework using Express server-rendered HTML fragments.
- Integrated `contactService.js` with in-memory CRUD operations, search filtering, and unit tests (`contactService.spec.js`).
- Built `server.js` handling `hx-get`, `hx-post`, `hx-put`, and `hx-delete` fragment requests.
- Built dark mode glassmorphism UI in `public/index.html` and `public/style.css`.
