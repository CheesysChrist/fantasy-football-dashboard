import { expect, test } from '@playwright/test';

const currentGames = [
  {
    id: 'game-1',
    awayTeam: { id: 'away-1', city: 'Portland', name: 'Pioneers', abbreviation: 'POR', score: 21 },
    homeTeam: { id: 'home-1', city: 'Austin', name: 'Outlaws', abbreviation: 'AUS', score: 24 },
    status: 'in-progress',
    quarter: 'Q3',
    clock: '05:42',
    possessionTeamId: 'home-1',
    fantasyImpact: 'Mason Cole has 18.4 points with a red-zone target share climbing.',
    headline: 'Outlaws driving late in the third quarter',
  },
];

const leagueSummary = {
  leagueName: 'Sunday Strategists',
  managerName: 'Chrise',
  teamName: 'Gridiron Architects',
  record: '7-3',
  rank: 2,
  projectedPoints: 128.6,
  waiverPriority: 4,
  upcomingOpponent: 'Red Zone Rebels',
};

const rosterPreview = [
  { id: 'p1', name: 'Mason Cole', position: 'QB', proTeam: 'AUS', projectedPoints: 22.4, status: 'healthy', news: 'High-volume matchup indoors.' },
  { id: 'p2', name: 'Theo Grant', position: 'RB', proTeam: 'COL', projectedPoints: 16.8, status: 'healthy', news: 'Expected lead back.' },
];

const nflState = {
  season: '2026',
  week: 14,
  seasonType: 'regular',
};

test('shows a backend-driven dashboard preview and saves a screenshot', async ({ page }) => {
  await page.route('http://localhost:3000/games/current', async (route) => {
    await route.fulfill({ json: currentGames });
  });

  await page.route('http://localhost:3000/league/summary', async (route) => {
    await route.fulfill({ json: leagueSummary });
  });

  await page.route('http://localhost:3000/league/nfl-state', async (route) => {
    await route.fulfill({ json: nflState });
  });

  await page.route('http://localhost:3000/roster/preview', async (route) => {
    await route.fulfill({ json: rosterPreview });
  });

  await page.goto('/dashboard');

  await expect(page.locator('h1')).toContainText('Fantasy football command center');
  await expect(page.locator('.hero p')).toContainText('2026 season · Week 14 · regular');
  await expect(page.getByText('Sleeper-backed NFL state')).toBeVisible();
  await expect(page.getByText('Falls back to safe demo state if Sleeper is unavailable.')).toBeVisible();

  await page.screenshot({ path: 'test-results/dashboard-preview.png', fullPage: true });
});
