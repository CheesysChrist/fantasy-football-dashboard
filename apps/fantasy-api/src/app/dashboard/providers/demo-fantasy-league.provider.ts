import { Injectable } from '@nestjs/common';
import { fantasyNightDashboard } from '../../fantasy-data';
import { FantasyDashboardShell, FantasyLeagueProvider } from '../dashboard-provider.types';

@Injectable()
export class DemoFantasyLeagueProvider implements FantasyLeagueProvider {
  readonly name = 'demo';

  async getDashboardShell(): Promise<FantasyDashboardShell> {
    return {
      matchup: fantasyNightDashboard.matchup,
      positionLeaders: fantasyNightDashboard.positionLeaders,
      myActivePlayers: fantasyNightDashboard.myActivePlayers,
      opponentActivePlayers: fantasyNightDashboard.opponentActivePlayers,
      leagueImpact: fantasyNightDashboard.leagueImpact,
      meta: {
        lastUpdated: fantasyNightDashboard.meta.lastUpdated,
        myPlayersActive: fantasyNightDashboard.meta.myPlayersActive,
        opponentPlayersActive: fantasyNightDashboard.meta.opponentPlayersActive,
      },
    };
  }
}
