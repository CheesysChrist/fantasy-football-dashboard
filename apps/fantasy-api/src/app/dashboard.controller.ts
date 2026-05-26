import { Controller, Get } from '@nestjs/common';
import { fantasyNightDashboard } from './fantasy-data';

@Controller('dashboard')
export class DashboardController {
  @Get('night')
  getNightDashboard() {
    return fantasyNightDashboard;
  }
}
