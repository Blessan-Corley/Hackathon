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
    await expect(page.locator('text=SpendNest Revenue Intelligence')).toBeVisible();
    await expect(page.locator('text=21 August 2026')).toBeVisible();
  });

  test('E2E 2: Filters records by person (Arun) and source type (call)', async ({ page }) => {
    // Select Call source type
    await page.click('button:has-text("Calls")');
    // Select Arun from person dropdown
    await page.selectOption('select:has(option:has-text("All Reps"))', 'Arun');

    // Should display Arun's calls
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
    // Click Run 5-Step Evaluation Suite
    await page.click('button:has-text("Run 5-Step Evaluation Suite")');

    // Wait for report modal to appear
    await expect(page.locator('text=Data Contract & Replay Verification Report')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=100% Passed')).toBeVisible();

    // Close report modal
    await page.click('button:has-text("Close Report")');
  });

  test('E2E 5: Opens Manager Daily Brief and verifies 3 forensic findings', async ({ page }) => {
    await page.click('button:has-text("Manager Daily Brief")');

    await expect(page.getByRole('heading', { name: /Manager Daily Brief/i })).toBeVisible();
    await expect(page.locator('text=The Phantom Follow-up on Departed Contact')).toBeVisible();
    await expect(page.locator('text=Customer Defect Escalation: Payment Description Persistence')).toBeVisible();
    await expect(page.locator('text=Rep Attribution Mismatch in Telephony Metadata')).toBeVisible();

    await page.click('button:has-text("Close Brief")');
  });

  test('E2E 6: Opens Export & Manifest Hub and verifies download links', async ({ page }) => {
    await page.click('button:has-text("Exports & Manifest")');

    await expect(page.getByRole('heading', { name: /Exported Dossiers & Manifest Hub/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Download ZIP Archive/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Download manifest\.csv/i })).toBeVisible();

    await page.click('button:has-text("Close")');
  });
});
