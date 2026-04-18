const { test, expect } = require('@playwright/test');
const path = require('path');

const MOCK_PATH = path.join(__dirname, '../fixtures/supabase-mock.js');

// Boot the app with a fake logged-in session and 3 fixture skills:
//   moves:   Basic Step (level 0), Cross Body Lead (level 3)
//   styling: Arm Waves (level 5, working_on: true)

test.beforeEach(async ({ page }) => {
  // Block the Supabase CDN so it cannot overwrite our mock
  await page.route('**/supabase-js**', route =>
    route.fulfill({ contentType: 'application/javascript', body: '// mocked' })
  );
  // Inject our mock before any page script runs
  await page.addInitScript({ path: MOCK_PATH });
  await page.goto('/');
  // Auth overlay hidden = app initialised and data rendered
  await page.waitForSelector('#authOverlay.hidden', { timeout: 10000 });
});

// ── Auth ──────────────────────────────────────────────────────────────────
test('auth overlay is hidden after mock login', async ({ page }) => {
  await expect(page.locator('#authOverlay')).toHaveClass(/hidden/);
});

test('shows the mocked user email in the header', async ({ page }) => {
  await expect(page.locator('#userEmailDisplay')).toHaveText('test@example.com');
});

// ── Skill rendering ───────────────────────────────────────────────────────
test('renders all 3 fixture skills in the All section', async ({ page }) => {
  await page.waitForSelector('.skill-card');
  await expect(page.locator('#all-list .skill-card')).toHaveCount(3);
});

test('skill names from fixture are visible', async ({ page }) => {
  await page.waitForSelector('.skill-card');
  await expect(page.locator('#all-list')).toContainText('Basic Step');
  await expect(page.locator('#all-list')).toContainText('Cross Body Lead');
  await expect(page.locator('#all-list')).toContainText('Arm Waves');
});

// ── Navigation ────────────────────────────────────────────────────────────
test('clicking Moves nav shows only moves section', async ({ page }) => {
  await page.click('[data-section="moves"]');
  await expect(page.locator('#moves')).toHaveClass(/active/);
  await expect(page.locator('#all')).not.toHaveClass(/active/);
});

test('Moves section shows 2 fixture skills', async ({ page }) => {
  await page.click('[data-section="moves"]');
  await page.waitForSelector('#moves-list .skill-card');
  await expect(page.locator('#moves-list .skill-card')).toHaveCount(2);
});

test('Styling section shows 1 fixture skill', async ({ page }) => {
  await page.click('[data-section="styling"]');
  await page.waitForSelector('#styling-list .skill-card');
  await expect(page.locator('#styling-list .skill-card')).toHaveCount(1);
});

// ── Search ────────────────────────────────────────────────────────────────
test('search in All section filters skill cards', async ({ page }) => {
  await page.waitForSelector('.skill-card');
  await page.fill('[data-section="all"].search-input', 'arm');
  await expect(page.locator('#all-list .skill-card')).toHaveCount(1);
  await expect(page.locator('#all-list')).toContainText('Arm Waves');
});

test('search with no match shows empty state', async ({ page }) => {
  await page.waitForSelector('.skill-card');
  await page.fill('[data-section="all"].search-input', 'zzznomatch');
  await expect(page.locator('#all-list .skill-card')).toHaveCount(0);
  await expect(page.locator('#all-list .skill-empty')).toBeVisible();
});

// ── Focus section ─────────────────────────────────────────────────────────
test('Focus section shows only working_on skills', async ({ page }) => {
  await page.click('[data-section="focus"]');
  await page.waitForSelector('#focus-list .skill-card');
  await expect(page.locator('#focus-list .skill-card')).toHaveCount(1);
  await expect(page.locator('#focus-list')).toContainText('Arm Waves');
});
