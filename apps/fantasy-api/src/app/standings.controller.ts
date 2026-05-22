import { Controller, Get } from '@nestjs/common';
import { standings } from './fantasy-data';

@Controller('standings')
export class StandingsController {
  @Get()
  getStandings() {
    return standings;
  }
}
