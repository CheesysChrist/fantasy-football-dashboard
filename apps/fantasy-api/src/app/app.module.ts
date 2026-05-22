import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesController } from './games.controller';
import { LeagueController } from './league.controller';
import { LineupController } from './lineup.controller';
import { RosterController } from './roster.controller';
import { StandingsController } from './standings.controller';
import { WaiversController } from './waivers.controller';
import { SleeperFantasyService } from './sleeper-fantasy.service';

@Module({
  imports: [],
  controllers: [AppController, GamesController, LeagueController, StandingsController, WaiversController, RosterController, LineupController],
  providers: [AppService, SleeperFantasyService],
})
export class AppModule {}
