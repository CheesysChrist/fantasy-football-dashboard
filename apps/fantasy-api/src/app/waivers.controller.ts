import { Controller, Get } from '@nestjs/common';
import { SleeperFantasyService } from './sleeper-fantasy.service';

@Controller('waivers')
export class WaiversController {
  constructor(private readonly sleeperFantasyService: SleeperFantasyService) {}

  @Get()
  getWaivers() {
    return this.sleeperFantasyService.getTrendingWaivers();
  }
}
