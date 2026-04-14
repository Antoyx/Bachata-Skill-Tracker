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

## Design System

All UI work MUST follow the style guide. Full specs: `.claude/skills/ui-style-guide/SKILL.md`

### Colors
```
--color-dark:           #222222   /* backgrounds, primary text */
--color-white:          #FFFFFF   /* surfaces, cards */
--color-indigo:         #4B4E6D   /* secondary actions, depth */
--color-mint:           #84DCC6   /* primary CTA, success, highlights */
--color-grey:           #95A3B3   /* secondary text, borders, muted */
--color-primary-hover:  #6FD4B8
--color-primary-subtle: rgba(132,220,198,0.12)
--color-surface:        #F8F9FA
--color-border:         rgba(149,163,179,0.2)
--color-danger:         #E5534B
--color-warning:        #E5A93D
```

### Typography
- **Headings:** Manrope (weights: 400–800) — import from Google Fonts
- **Body:** Karla (weights: 300–500) — import from Google Fonts
- Never use Inter, Roboto, Arial, or system-ui

### Components
- Border radius: `6px` on all interactive elements
- Buttons: solid fill, Manrope 600, `all 0.2s ease` transition
- Inputs: `1.5px solid rgba(149,163,179,0.25)`, Karla 400 14px, padding 12px 16px
- Focus ring: `border-color: #84DCC6` + `box-shadow: 0 0 0 3px rgba(132,220,198,0.15)`

### Spacing & Layout
- Base unit: 8px — scale: 0, 4, 8, 16, 24, 32, 48, 64, 96
- Grid: `repeat(auto-fit, minmax(280px, 1fr))` with 16px gap
- Max container width: 1200px
- Breakpoints: 640px (tablet), 1024px (desktop), 1440px (wide)
