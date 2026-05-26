import { Inject, Injectable, Logger } from '@nestjs/common';
import { FantasyNightDashboard } from '../fantasy-night-dashboard';
import { FANTASY_LEAGUE_PROVIDER, LIVE_NFL_DATA_PROVIDER } from './dashboard-provider.tokens';
import { FantasyLeagueProvider, LiveNflDataProvider } from './dashboard-provider.types';

@Injectable()
export class DashboardDataService {
  private readonly logger = new Logger(DashboardDataService.name);

  constructor(
    @Inject(LIVE_NFL_DATA_PROVIDER) private readonly liveNflDataProvider: LiveNflDataProvider,
    @Inject(FANTASY_LEAGUE_PROVIDER) private readonly fantasyLeagueProvider: FantasyLeagueProvider,
  ) {
    this.logger.log(
      `Dashboard providers active: live_nfl=${this.liveNflDataProvider.name}, fantasy_league=${this.fantasyLeagueProvider.name}`,
    );
  }

  async getNightDashboard(): Promise<FantasyNightDashboard> {
    const [nflState, liveGames, shell] = await Promise.all([
      this.liveNflDataProvider.getNflState(),
      this.liveNflDataProvider.getLiveGames(),
      this.fantasyLeagueProvider.getDashboardShell(),
    ]);

    return {
      nflState,
      meta: {
        ...shell.meta,
        liveGameCount: liveGames.length,
      },
      matchup: shell.matchup,
      liveGames,
      positionLeaders: shell.positionLeaders,
      myActivePlayers: shell.myActivePlayers,
      opponentActivePlayers: shell.opponentActivePlayers,
      leagueImpact: shell.leagueImpact,
    };
  }
}
