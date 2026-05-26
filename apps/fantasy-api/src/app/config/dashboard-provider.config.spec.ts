import {
  createFantasyLeagueProvider,
  createLiveNflProvider,
  resolveFantasyLeagueProviderName,
  resolveLiveNflProviderName,
} from './dashboard-provider.config';
import { DemoFantasyLeagueProvider } from '../dashboard/providers/demo-fantasy-league.provider';
import { DemoLiveNflProvider } from '../dashboard/providers/demo-live-nfl.provider';

describe('dashboard provider config', () => {
  it('defaults both providers to demo', () => {
    expect(resolveLiveNflProviderName({} as NodeJS.ProcessEnv)).toBe('demo');
    expect(resolveFantasyLeagueProviderName({} as NodeJS.ProcessEnv)).toBe('demo');
  });

  it('falls back to demo for unimplemented configured providers', () => {
    expect(resolveLiveNflProviderName({ LIVE_NFL_PROVIDER: 'espn' } as NodeJS.ProcessEnv)).toBe('demo');
    expect(resolveFantasyLeagueProviderName({ FANTASY_LEAGUE_PROVIDER: 'nfl' } as NodeJS.ProcessEnv)).toBe('demo');
  });

  it('returns the demo provider instances for the current implementation set', () => {
    const demoLiveProvider = new DemoLiveNflProvider();
    const demoFantasyProvider = new DemoFantasyLeagueProvider();

    expect(createLiveNflProvider(demoLiveProvider, { LIVE_NFL_PROVIDER: 'demo' } as NodeJS.ProcessEnv)).toBe(demoLiveProvider);
    expect(createFantasyLeagueProvider(demoFantasyProvider, { FANTASY_LEAGUE_PROVIDER: 'demo' } as NodeJS.ProcessEnv)).toBe(
      demoFantasyProvider,
    );
  });
});
