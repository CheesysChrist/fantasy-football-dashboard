import { test, expect } from '@playwright/test';

test('shows the fantasy dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toContainText('Fantasy football command center');
});
