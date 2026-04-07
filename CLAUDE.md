# Bachata Skill Tracker — Claude Code Guidelines

## Environment
- Developed on Android (Galaxy Tab 11) via GitHub Codespaces
- No build tools, no bundlers, no package manager

## Stack
- **Frontend:** Vanilla HTML, CSS, JavaScript (`'use strict'`) — no frameworks
- **Backend/Auth/DB:** Supabase (auth + postgres)
- **Files:** `index.html`, `style.css`, `app.js` — keep it to these three files unless absolutely necessary

## Architecture
- Single-page app; all logic lives in `app.js`
- Supabase client initialized at the top of `app.js` with `SUPABASE_URL` and `SUPABASE_KEY`
- Sections: `moves`, `combos`, `styling`, `footwork`, `isolations`, `intros`
- Proficiency levels (0–5): Not Started → Learning → Developing → Comfortable → Solid → Mastered
- Difficulty levels (0–2): Beginner → Intermediate → Advanced
- Skills can have nested `vars` (variations) with their own level/difficulty

## Code Conventions
- Use `'use strict'` at the top of any JS
- DOM manipulation via `document.querySelector` / `getElementById` — no virtual DOM
- CSS uses custom properties (`--var`) for theming; mobile-first with media queries
- No inline styles in JS — add/remove CSS classes instead
- All Supabase calls are async/await; handle errors with try/catch

## Feature Implementation Process
1. Create a feature branch named `feature/<short-description>`
2. Read and understand the existing code in all three files before making changes
3. Implement the feature following the conventions above
4. Test considerations: works on mobile (iOS Safari + Android Chrome), no console errors
5. Open a PR referencing the issue number (e.g. `Closes #12`)
6. Keep PRs focused — one feature per PR

## What NOT to Do
- Do not introduce npm packages, build steps, or frameworks
- Do not change the Supabase schema without describing the migration in the PR description
- Do not add localStorage logic — data persistence is handled by Supabase
- Do not break the existing auth flow (login/signup overlay in `index.html`)
- Do not add comments that restate what the code obviously does

## PR Description Template
```
## What
[one sentence summary]

## Why
Closes #[issue number]

## Changes
- [bullet list of what changed and where]

## Test on
- [ ] Mobile (Android Chrome or iOS Safari)
- [ ] Desktop browser
```
