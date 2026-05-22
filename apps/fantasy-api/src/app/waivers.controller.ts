import { Controller, Get } from '@nestjs/common';
import { waivers } from './fantasy-data';

@Controller('waivers')
export class WaiversController {
  @Get()
  getWaivers() {
    return waivers;
  }
}
