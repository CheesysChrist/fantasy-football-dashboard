import { Controller, Get } from '@nestjs/common';
import { DashboardDataService } from './dashboard/dashboard-data.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardDataService: DashboardDataService) {}

  @Get('night')
  getNightDashboard() {
    return this.dashboardDataService.getNightDashboard();
  }
}
