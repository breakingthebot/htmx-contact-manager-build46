# Changelog - Build 46

All notable changes to the **HTMX Contact Manager** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
