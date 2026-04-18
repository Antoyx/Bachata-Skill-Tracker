const { test, expect } = require('@playwright/test');

// Loads the QUnit test page in a headless browser and fails if any test fails.
// No Supabase mock needed — tests/unit/tests.html is self-contained.

test('QUnit unit tests all pass', async ({ page }) => {
  await page.goto('/tests/unit/tests.html');

  // Wait for QUnit to finish running
  await page.waitForFunction(() => {
    const el = document.getElementById('qunit-testresult');
    return el && el.className.includes('complete');
  }, { timeout: 10000 });

  const failed = await page.locator('#qunit-testresult .failed').textContent();
  const total  = await page.locator('#qunit-testresult .total').textContent();

  expect(parseInt(failed, 10)).toBe(0);
  console.log(`QUnit: ${total} tests passed`);
});
