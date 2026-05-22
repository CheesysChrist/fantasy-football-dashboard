import { expect, test } from '@playwright/test';

test('shows the dashboard in static preview mode without a backend', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.locator('h1')).toContainText('Fantasy football command center');
  await expect(page.locator('.hero p')).toContainText('2026 season · Week 14 · regular');
  await expect(page.getByText('Sleeper-backed NFL state')).toBeVisible();
  await expect(page.getByText('Falls back to safe demo state if Sleeper is unavailable.')).toBeVisible();

  await page.screenshot({ path: 'test-results/dashboard-preview.png', fullPage: true });
});

test('shows other routes from static preview fallback data', async ({ page }) => {
  await page.goto('/waivers');
  await expect(page.getByText('Caleb North')).toBeVisible();

  await page.goto('/lineup');
  await expect(page.getByText('Lineup management')).toBeVisible();
  await expect(page.getByText('Save lineup')).toBeVisible();
});
