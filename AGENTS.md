# 🤖 AGENTS.md — Universal Standard Operating Procedures for AI-286 Projects

> **Mandatory instructions and standard workflow for AI coding agents building projects in the AI-286 workspace.**

---

## 🛠️ Master Build Directive & Workflow Rules

When building or updating projects in `AI-286-Builds`, the AI Agent MUST follow these strict standards across **every single build**:

### 1. New Project Setup (Iteration 1 Initial Scaffolding)
Whenever a new build folder is initialized, the agent MUST immediately set up all project files and ignore configurations before writing feature code:
- `.gitignore`: Exclude `node_modules/`, `.env`, `.vercel/`, `dist/`, `.DS_Store`, build artifacts.
- `README.md`: Root public project documentation with project overview, live Vercel URL, GitHub repository link, feature list, tech stack, and local installation/run instructions.
- `BUILD_NOTES.md`: Chronological log of every iteration built, file-by-file explanations, manual test steps, top 5 candidate next iterations, and chosen iteration.
- `CHANGELOG.md`: Semantic versioning log following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standards (`v0.1.0`, `v0.2.0`, ..., `v1.0.0 Milestone`).
- `AGENTS.md`: Copy of this universal standard operating procedures file into the build directory.

### 2. Mandatory Iteration Workflow Checklist
For **EVERY** build iteration, the AI Agent MUST perform the following steps sequentially:

1. **Feature Implementation**:
   - Write clean, modular, production-quality code.
   - Maintain modern, responsive design aesthetics (dark mode, glassmorphism, dynamic micro-animations).
2. **Automated Unit Testing**:
   - Write comprehensive unit tests for all core services and logic.
   - Execute the project test command (`npm test`) and verify 100% pass rate.
3. **Documentation Updates**:
   - Update `BUILD_NOTES.md` with summary, file-by-file changes, manual test steps, and top 5 candidate next iterations.
   - Update `CHANGELOG.md` with semantic version release notes.
   - Update `README.md` features and badges.
4. **Git Repository Commit & Push**:
   - Stage all changes: `git add .`
   - Commit with structured message: `git commit -m "feat: ..."`
   - Push to main branch: `git push origin main`
5. **Vercel Production Deployment**:
   - Trigger production deployment: `npx vercel --prod --yes`
   - Confirm deployment status returns `READY`.
6. **User Progress Report**:
   - Provide clear manual test steps.
   - Present the next top 5 candidate iterations for the user to select.

---

## 📌 Code Quality & Architecture Guardrails
- **No Symptom Patches**: Never wrap failing code in silent try/except or dummy fallbacks. Identify and resolve underlying root causes.
- **Empirical Verification**: Never claim a task is completed until tests have run and deployment is verified live.
- **Preserve Existing Logic**: Preserve existing docstrings, tests, and API signatures unless explicitly asked to modify them.
