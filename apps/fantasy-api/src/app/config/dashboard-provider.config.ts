import { Logger } from '@nestjs/common';
import { DemoFantasyLeagueProvider } from '../dashboard/providers/demo-fantasy-league.provider';
import { DemoLiveNflProvider } from '../dashboard/providers/demo-live-nfl.provider';
import { FantasyLeagueProvider, LiveNflDataProvider } from '../dashboard/dashboard-provider.types';

export const SUPPORTED_LIVE_NFL_PROVIDERS = ['demo', 'espn'] as const;
export const SUPPORTED_FANTASY_LEAGUE_PROVIDERS = ['demo', 'sleeper', 'nfl'] as const;

export type LiveNflProviderName = (typeof SUPPORTED_LIVE_NFL_PROVIDERS)[number];
export type FantasyLeagueProviderName = (typeof SUPPORTED_FANTASY_LEAGUE_PROVIDERS)[number];

const logger = new Logger('DashboardProviderConfig');

export function resolveLiveNflProviderName(env = process.env): LiveNflProviderName {
  const configured = (env.LIVE_NFL_PROVIDER || 'demo').trim().toLowerCase();
  if (configured === 'demo' || configured === 'espn') {
    if (configured !== 'demo') {
      logger.warn(`LIVE_NFL_PROVIDER=${configured} is not implemented yet; falling back to demo.`);
    }
    return 'demo';
  }

  logger.warn(`Unknown LIVE_NFL_PROVIDER=${configured}; falling back to demo.`);
  return 'demo';
}

export function resolveFantasyLeagueProviderName(env = process.env): FantasyLeagueProviderName {
  const configured = (env.FANTASY_LEAGUE_PROVIDER || 'demo').trim().toLowerCase();
  if (configured === 'demo' || configured === 'sleeper' || configured === 'nfl') {
    if (configured !== 'demo') {
      logger.warn(`FANTASY_LEAGUE_PROVIDER=${configured} is not implemented yet; falling back to demo.`);
    }
    return 'demo';
  }

  logger.warn(`Unknown FANTASY_LEAGUE_PROVIDER=${configured}; falling back to demo.`);
  return 'demo';
}

export function createLiveNflProvider(demoProvider: DemoLiveNflProvider, env = process.env): LiveNflDataProvider {
  resolveLiveNflProviderName(env);
  return demoProvider;
}

export function createFantasyLeagueProvider(
  demoProvider: DemoFantasyLeagueProvider,
  env = process.env,
): FantasyLeagueProvider {
  resolveFantasyLeagueProviderName(env);
  return demoProvider;
}
