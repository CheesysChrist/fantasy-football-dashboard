import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createFantasyLeagueProvider, createLiveNflProvider } from './config/dashboard-provider.config';
import { DashboardDataService } from './dashboard/dashboard-data.service';
import { FANTASY_LEAGUE_PROVIDER, LIVE_NFL_DATA_PROVIDER } from './dashboard/dashboard-provider.tokens';
import { DemoFantasyLeagueProvider } from './dashboard/providers/demo-fantasy-league.provider';
import { DemoLiveNflProvider } from './dashboard/providers/demo-live-nfl.provider';
import { DashboardController } from './dashboard.controller';
import { GamesController } from './games.controller';
import { LeagueController } from './league.controller';
import { LineupController } from './lineup.controller';
import { RosterController } from './roster.controller';
import { StandingsController } from './standings.controller';
import { WaiversController } from './waivers.controller';
import { SleeperFantasyService } from './sleeper-fantasy.service';

@Module({
  imports: [],
  controllers: [AppController, DashboardController, GamesController, LeagueController, StandingsController, WaiversController, RosterController, LineupController],
  providers: [
    AppService,
    SleeperFantasyService,
    DashboardDataService,
    DemoLiveNflProvider,
    DemoFantasyLeagueProvider,
    {
      provide: LIVE_NFL_DATA_PROVIDER,
      inject: [DemoLiveNflProvider],
      useFactory: (demoProvider: DemoLiveNflProvider) => createLiveNflProvider(demoProvider),
    },
    {
      provide: FANTASY_LEAGUE_PROVIDER,
      inject: [DemoFantasyLeagueProvider],
      useFactory: (demoProvider: DemoFantasyLeagueProvider) => createFantasyLeagueProvider(demoProvider),
    },
  ],
})
export class AppModule {}
