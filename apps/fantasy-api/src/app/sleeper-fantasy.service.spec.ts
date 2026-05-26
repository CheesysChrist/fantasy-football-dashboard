import { waivers } from './fantasy-data';
import { SleeperFantasyService } from './sleeper-fantasy.service';

describe('SleeperFantasyService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('maps Sleeper trending adds into waiver players', async () => {
    const fetchMock = jest.fn(async (input: string | URL | Request) => {
      const url = String(input);

      if (url.endsWith('/state/nfl')) {
        return {
          ok: true,
          json: async () => ({ season: '2026', week: 5, season_type: 'regular' }),
        } as Response;
      }

      if (url.includes('/players/nfl/trending/add')) {
        return {
          ok: true,
          json: async () => [{ player_id: '123', count: 321 }],
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          '123': {
            full_name: 'John Runner',
            position: 'RB',
            team: 'BUF',
            fantasy_positions: ['RB'],
            status: 'Active',
          },
        }),
      } as Response;
    });

    global.fetch = fetchMock as typeof fetch;

    const service = new SleeperFantasyService();
    const result = await service.getTrendingWaivers();

    expect(result).toEqual([
      expect.objectContaining({
        id: '123',
        name: 'John Runner',
        position: 'RB',
        proTeam: 'BUF',
        status: 'healthy',
        claimStatus: 'available',
        news: expect.stringContaining('321'),
      }),
    ]);
    expect(fetchMock).toHaveBeenCalledWith('https://api.sleeper.app/v1/players/nfl');
    expect(fetchMock).toHaveBeenCalledWith('https://api.sleeper.app/v1/players/nfl/trending/add?lookback_hours=24&limit=10');
  });

  it('caches the Sleeper players dictionary between waiver requests', async () => {
    const fetchMock = jest.fn(async (input: string | URL | Request) => {
      const url = String(input);

      if (url.includes('/players/nfl/trending/add')) {
        return {
          ok: true,
          json: async () => [{ player_id: '123', count: 88 }],
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          '123': {
            full_name: 'Cache Test',
            position: 'WR',
            team: 'KC',
            fantasy_positions: ['WR'],
            status: 'Active',
          },
        }),
      } as Response;
    });

    global.fetch = fetchMock as typeof fetch;

    const service = new SleeperFantasyService();

    await service.getTrendingWaivers();
    await service.getTrendingWaivers();

    expect(fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/players/nfl'))).toHaveLength(1);
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes('/players/nfl/trending/add'))).toHaveLength(2);
  });

  it('falls back to demo waivers when Sleeper fetch fails', async () => {
    global.fetch = jest.fn(async () => {
      throw new Error('network down');
    }) as typeof fetch;

    const service = new SleeperFantasyService();

    await expect(service.getTrendingWaivers()).resolves.toEqual(waivers);
  });

  it('returns mapped nfl state and falls back when Sleeper fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ season: '2026', week: 8, season_type: 'post' }),
      } as Response)
      .mockRejectedValueOnce(new Error('boom')) as typeof fetch;

    const service = new SleeperFantasyService();

    await expect(service.getNflState()).resolves.toEqual({ season: '2026', week: 8, seasonType: 'post' });
    await expect(service.getNflState()).resolves.toEqual({ season: '2026', week: 14, seasonType: 'regular' });
  });
});