import { test, expect } from '@playwright/test';

test.describe('Tier 3 E2E Browser Test: Revenue Intelligence Inbox', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local application and wait for initial state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Total Records')).toBeVisible();
  });

  test('E2E 1: Displays initial dashboard state with 44 records and correct metrics', async ({ page }) => {
    // Check total records headline
    await expect(page.locator('text=44').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SpendNest' })).toBeVisible();
    await expect(page.locator('text=August 21, 2026')).toBeVisible();
  });

  test('E2E 2: Filters records by person (Arun) and source type (call)', async ({ page }) => {
    // Select Call source type via segmented control
    await page.click('button:has-text("Calls (")');
    // Select Arun from person dropdown
    await page.selectOption('select:has(option:has-text("All Team Members"))', 'Arun');

    // Should display Arun's 15 calls
    await expect(page.locator('tbody tr')).toHaveCount(15);
  });

  test('E2E 3: Opens Evidence Inspector for M07 and verifies details', async ({ page }) => {
    // Click on M07 row directly in initial view
    await page.locator('tbody tr:has-text("M07")').first().click();

    // Verify Inspector opens
    await expect(page.locator('text=Identity:').first()).toBeVisible();
    await expect(page.locator('text=Analysis & Intelligence')).toBeVisible();
    await expect(page.locator('text=Evidence & Transcript')).toBeVisible();
    await expect(page.locator('text=Routing & Governance')).toBeVisible();

    // Close inspector
    await page.locator('button:has(svg.lucide-x)').first().click();
  });

  test('E2E 4: Executes 1-Click Evaluation Suite verifying the entire Replay Contract', async ({ page }) => {
    // Open sync & replay drawer
    await page.click('button:has-text("Sync & Replay Feeds")');
    
    // Click Run 5-Step Evaluation Suite
    await page.click('button:has-text("Run 5-Step Evaluation Suite")');

    // Wait for audit modal to appear
    await expect(page.locator('text=Data Contract Verification Audit')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=100% Passed')).toBeVisible();

    // Close audit modal
    await page.click('button:has-text("Close Audit")');
  });

  test('E2E 5: Opens Manager Daily Brief and verifies 3 forensic findings', async ({ page }) => {
    await page.click('button:has-text("Daily Briefing")');

    await expect(page.getByRole('heading', { name: /Manager Daily Briefing/i })).toBeVisible();
    await expect(page.locator('text=Phantom Follow-up on Departed Lead')).toBeVisible();
    await expect(page.locator('text=Data Loss Defect: Event Payment Persistence')).toBeVisible();
    await expect(page.locator('text=Telephony Attribution Mismatch')).toBeVisible();

    await page.click('button:has-text("Close Brief")');
  });

  test('E2E 6: Opens Export Hub and verifies download links', async ({ page }) => {
    await page.click('button:has-text("Export Hub")');

    await expect(page.getByRole('heading', { name: /Export Hub & Manifest/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Download ZIP/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Export manifest\.csv/i })).toBeVisible();

    await page.click('button:has-text("Close")');
  });
});
