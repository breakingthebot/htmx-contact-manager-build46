# Changelog - Build 46

All notable changes to the **HTMX Contact Manager** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-27

### Added
- Initialized **HTMX Contact Manager** with zero JS client framework using Express server-rendered HTML fragments.
- Integrated `contactService.js` with in-memory CRUD operations, search filtering, and unit tests (`contactService.spec.js`).
- Built `server.js` handling `hx-get`, `hx-post`, `hx-put`, and `hx-delete` fragment requests.
- Built dark mode glassmorphism UI in `public/index.html` and `public/style.css`.
