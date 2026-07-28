# 🤖 AGENTS.md — Agent & Workflow Standard Operating Procedures

> **Mandatory guidelines for AI Coding Agents working on Build 46 (HTMX Contact Manager & Creator CRM)**

---

## 📁 Standard Directory Setup & Required Files

When initializing or working on any build folder in `AI-286-Builds`, the agent MUST maintain the following core files from **Iteration 1**:

1. `README.md`: Public-facing project overview, live demo links (Vercel & GitHub), features list, tech stack, and local installation/run instructions.
2. `BUILD_NOTES.md`: Chronological log of every iteration built, file-by-file explanations, manual testing steps, top 5 candidate next iterations, and chosen iteration.
3. `CHANGELOG.md`: Semantic versioning release history following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standards (`v0.1.0`, `v0.2.0`, ..., `v1.0.0 Milestone`).
4. `AGENTS.md`: Project-specific agent instructions, architectural rules, and deployment procedures.
5. `.gitignore`: Git exclusions (`node_modules/`, `.env`, `.vercel`, `dist/`).

---

## ⚙️ Development & Server Commands

- **Start Local Dev Server**:
  ```bash
  npm run dev
  ```
  *(Runs Express server on `http://localhost:3000`)*

- **Run Unit Test Suite**:
  ```bash
  npm test
  ```
  *(Runs Vitest test suite `contactService.spec.js`)*

- **Deploy to Production Vercel**:
  ```bash
  npx vercel --prod --yes
  ```

---

## 🔄 Iteration Workflow Checklist

For **EVERY** iteration built, the AI Agent MUST perform all of the following steps:

1. **Implement Feature & Code**:
   - Write clean modular functions in `contactService.js`.
   - Add server endpoints & fragment renderers in `server.js`.
   - Update UI HTML/CSS in `public/index.html` and `public/style.css`.
2. **Write & Pass Unit Tests**:
   - Add unit test coverage in `contactService.spec.js`.
   - Run `npm test` and ensure 100% pass rate.
3. **Update Documentation**:
   - Document iteration details, manual test steps, and candidate next iterations in `BUILD_NOTES.md`.
   - Update release version in `CHANGELOG.md`.
   - Update features & badges in `README.md`.
4. **Git Commit & Push**:
   - `git add .`
   - `git commit -m "feat: ..."`
   - `git push origin main`
5. **Vercel Production Deployment**:
   - Run `npx vercel --prod --yes` to deploy live.
   - Verify deployment returns status `READY`.
6. **User Progress Report**:
   - Provide manual test steps.
   - List top 5 candidate next iterations for the user to select.
