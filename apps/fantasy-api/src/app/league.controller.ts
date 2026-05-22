import { Controller, Get } from '@nestjs/common';
import { leagueSummary } from './fantasy-data';
import { SleeperFantasyService } from './sleeper-fantasy.service';

@Controller('league')
export class LeagueController {
  constructor(private readonly sleeperFantasyService: SleeperFantasyService) {}

  @Get('summary')
  getSummary() {
    return leagueSummary;
  }

  @Get('nfl-state')
  getNflState() {
    return this.sleeperFantasyService.getNflState();
  }
}
