# Testing — Bachata Skill Tracker

## Overview

Two layers of testing, both running automatically on every push and PR via GitHub Actions.

| Layer | Tool | What it tests |
|---|---|---|
| Unit | QUnit (browser) | Pure logic: level labels, difficulty labels, offline queue deduplication |
| E2E | Playwright (headless Chrome) | App UI with a mocked Supabase session |

---

## Running locally

### Unit tests
Open `tests/unit/tests.html` directly in a browser. No server or npm required — QUnit loads from CDN.

### E2E tests
```bash
cd tests/e2e
npm install                          # first time only
npx playwright install chromium      # first time only
npx playwright test
```

Playwright starts a local server (`python3 -m http.server 3000`) automatically, runs all specs in headless Chrome, and exits with a non-zero code if anything fails.

---

## How the E2E mock works

`app.js` depends on `window.supabase` (loaded from CDN in `index.html`). In tests:

1. `page.route('**/supabase-js**', ...)` — intercepts the CDN request and returns an empty script, preventing it from overwriting the mock.
2. `page.addInitScript({ path: 'fixtures/supabase-mock.js' })` — injects a fake Supabase client before any page script runs.

The mock returns a hardcoded session (`test@example.com`) and 3 fixture skills so the app boots into a logged-in state without touching the real database.

**Fixture skills:**
| Name | Section | Level | working_on |
|---|---|---|---|
| Basic Step | moves | 0 — Not Started | false |
| Cross Body Lead | moves | 3 — Comfortable | false |
| Arm Waves | styling | 5 — Mastered | true |

---

## File structure

```
tests/
  unit/
    tests.html          Browser test runner (open directly)
    tests.js            QUnit test cases
  e2e/
    package.json        Playwright dependency
    package-lock.json
    playwright.config.js
    .gitignore
    fixtures/
      supabase-mock.js  Fake Supabase client + fixture data
    specs/
      unit.spec.js      Loads tests/unit/tests.html headlessly, fails if any QUnit test fails
      app.spec.js       10 E2E tests covering auth, rendering, navigation, search, focus
  TESTING.md            This file
.github/workflows/
  test.yml              CI: runs on push/PR to main
```

---

## CI workflow

`.github/workflows/test.yml` runs on every push and PR to `main`:

1. Checkout code
2. `npm ci` in `tests/e2e`
3. Install Chromium via Playwright
4. Run all specs (`unit.spec.js` + `app.spec.js`)
5. On failure — uploads `playwright-report/` as an artifact (kept 7 days)

---

## Adding new tests

**New unit test** — add a `QUnit.test(...)` block in `tests/unit/tests.js`. No infrastructure changes needed.

**New E2E test** — add a `test(...)` block in `tests/e2e/specs/app.spec.js`. The `beforeEach` mock is already wired up.

**New fixture skill** — edit the `FIXTURE_SKILLS` array in `tests/e2e/fixtures/supabase-mock.js`, then update any hardcoded counts in `app.spec.js`.

**New pure function worth unit testing** — if the function is added to `app.js`, copy it into `tests/unit/tests.js` (with a comment noting it mirrors `app.js`) and write cases for it.

---

## Known limitations

- E2E tests do not cover the login flow (auth is bypassed by design — Option 3).
- The mock always returns the same 3 fixture skills; tests that depend on specific counts will need updating if the fixture changes.
- No mobile browser in CI — only headless Desktop Chrome. Manual testing on Android/iOS still required for layout issues.
