import { Controller, Get } from '@nestjs/common';
import { leagueSummary } from './fantasy-data';

@Controller('league')
export class LeagueController {
  @Get('summary')
  getSummary() {
    return leagueSummary;
  }
}
