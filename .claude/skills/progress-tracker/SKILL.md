---
name: progress-tracker
description: Design a progress tracking visualization and reward loop for the Bachata Skill Tracker app. Use this skill whenever the user wants to add progress views, charts, skill summaries, reward animations, level-up feedback, badges, streaks, or any feature that reflects a dancer's improvement over time. Trigger even if the user just says "show my progress" or "make it feel more rewarding".
---

# Progress Tracker Skill

Design a **visualization + reward loop** feature for the Bachata Skill Tracker. Output is always an **implementation plan** — no code is written during this skill. The plan will be handed off for implementation.

---

## App Context

Before designing, internalize these constraints:

- **Stack**: Vanilla HTML/CSS/JS — no frameworks, no build tools
- **Files**: `index.html`, `style.css`, `app.js` only
- **Data source**: Existing Supabase `skills` table — do NOT propose new tables or schema changes
- **Existing data shape** per skill:
  - `section`: one of `moves`, `combos`, `styling`, `footwork`, `isolations`, `intros`
  - `level`: 0–5 → Not Started / Learning / Developing / Comfortable / Solid / Mastered
  - `difficulty`: 0–2 → Beginner / Intermediate / Advanced
  - `vars[]`: optional nested variations with their own `level` and `difficulty`
- **Auth**: Supabase auth is already wired — data is per-user
- **Mobile-first**: Primary use is Android Chrome / iOS Safari

---

## Design Process

Work through these stages in order. Be conversational — explain trade-offs and let the user make choices.

### 1. Clarify Scope

Ask (or infer from context) which of these the user wants:

- **Summary view**: overall stats (total skills, % mastered, breakdown by section)
- **Section progress bars**: visual fill per section based on average level
- **Skill-level distribution**: how many skills are at each level (0–5)
- **Reward loop**: animations or feedback when a skill's level increases
- **Badges / milestones**: unlockable achievements based on thresholds
- **Streak / session tracking**: not available from existing data — flag this

If the user wants streaks or session history, note that this requires new Supabase tables and is out of scope for this skill. Offer to design the rest and defer streaks.

### 2. Design the Visualization

Based on scope, design the UI component(s). Always consider:

- **Where does it live?** A dedicated "Progress" section tab? A floating summary card? A header stat bar?
- **What data drives it?** Derive everything from the existing skills array — compute on the client, no new queries beyond what's already loaded
- **Mobile layout**: stacked, scrollable — no sidebars

Propose one of these visualization patterns (or a combination):

| Pattern | Best for | Complexity |
|---|---|---|
| Stat bar (numbers + %) | Quick overview | Low |
| Section progress rings/bars | Per-section progress | Medium |
| Level histogram | Distribution of mastery | Medium |
| Skill heatmap grid | All skills at a glance | High |

Describe the layout in plain terms (e.g., "a horizontal bar per section, filled proportionally to average level, with the section name and X/6 label").

### 3. Design the Reward Loop

The reward loop is triggered when a user **increases a skill's proficiency level**. This happens in the existing level selector UI.

Design one or more of:

- **Level-up toast**: a brief message ("🎉 Cross Body Lead → Comfortable!") that appears and fades
- **Progress bar pulse**: the section bar animates/fills when a skill in that section levels up
- **Milestone badge**: a modal or banner when a threshold is crossed (e.g., "First Mastered skill!", "50% of Moves complete")
- **Confetti / particle burst**: CSS or JS animation on major milestones only (Mastered level)

For each, specify:
- Trigger condition (what user action fires it)
- Visual behaviour (what the user sees)
- Duration / dismissal
- Which file the logic lives in (`app.js` for trigger detection, `style.css` for animation, `index.html` for any new markup)

### 4. Output the Implementation Plan

Produce a structured plan with these sections:

---

## Implementation Plan: [Feature Name]

### Overview
One paragraph: what the user will see and feel.

### Data Derivation
How to compute the needed stats from the existing `skills` array (already in memory). Example:
- `totalSkills`: `skills.length`
- `masteredCount`: `skills.filter(s => s.level === 5).length`
- `sectionProgress`: for each section, `avg(skills.filter(s => s.section === sec).map(s => s.level)) / 5`

Include variations (`vars[]`) if relevant — note they have their own `level`.

### UI Components
List each new HTML element needed:
- Element type, class name, where it's inserted in `index.html`
- Any new CSS classes needed in `style.css`

### JS Logic
List each new function or modification to an existing function in `app.js`:
- Function name, what it does, when it's called
- Which existing function(s) it hooks into (e.g., after `renderSkills()`, inside the level-change handler)

### Reward Loop Triggers
For each reward moment:
- Condition: `if (newLevel > oldLevel && newLevel === 5)`
- Action: call `showLevelUpToast(skill.name, newLevel)`
- Animation: CSS class added/removed, duration

### CSS Animations
List any `@keyframes` or transition rules needed, described in plain terms.

### Order of Implementation
Numbered steps a developer should follow to build this without breaking existing functionality.

---

## Tone & Communication

- Keep explanations short — the user is building a personal dance app, not an enterprise dashboard
- Prefer simple, delightful UI over complex data science
- If the user is non-technical, describe visuals in terms of what they'll *see and feel*, not code
- Always check: "Does this work on a phone screen?"
