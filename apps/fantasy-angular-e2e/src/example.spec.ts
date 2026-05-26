import { expect, test } from '@playwright/test';

test('shows the dashboard in static preview mode without a backend', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.locator('h1')).toContainText('Fantasy football command center');
  await expect(page.locator('.hero p')).toContainText('2026 season · Week 14 · regular');
  await expect(page.getByText('Track tonight\'s NFL action through the lens of your matchup, projections, and standings swing.')).toBeVisible();
  await expect(page.getByText('Jared Goff · DET')).toBeVisible();
  await expect(page.getByText('RB · Jahmyr Gibbs')).toBeVisible();
  await expect(page.getByText('Projected to climb to 1st if the current pace holds.')).toBeVisible();

  await page.screenshot({ path: 'test-results/dashboard-preview.png', fullPage: true });
});

test('shows other routes from static preview fallback data', async ({ page }) => {
  await page.goto('/waivers');
  await expect(page.getByText('Tyjae Spears')).toBeVisible();

  await page.goto('/lineup');
  await expect(page.getByText('Lineup management')).toBeVisible();
  await expect(page.getByText('Save lineup')).toBeVisible();
});
