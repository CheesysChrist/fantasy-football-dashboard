import { CurrentGame, NflState } from '@ux-lib-csr/contracts';
import { FantasyNightDashboard } from '../fantasy-night-dashboard';

export interface FantasyDashboardShell {
  matchup: FantasyNightDashboard['matchup'];
  positionLeaders: FantasyNightDashboard['positionLeaders'];
  myActivePlayers: FantasyNightDashboard['myActivePlayers'];
  opponentActivePlayers: FantasyNightDashboard['opponentActivePlayers'];
  leagueImpact: FantasyNightDashboard['leagueImpact'];
  meta: Pick<FantasyNightDashboard['meta'], 'lastUpdated' | 'myPlayersActive' | 'opponentPlayersActive'>;
}

export interface LiveNflDataProvider {
  readonly name: string;
  getNflState(): Promise<NflState>;
  getLiveGames(): Promise<CurrentGame[]>;
}

export interface FantasyLeagueProvider {
  readonly name: string;
  getDashboardShell(): Promise<FantasyDashboardShell>;
}
