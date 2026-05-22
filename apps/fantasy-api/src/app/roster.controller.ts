import { Controller, Get } from '@nestjs/common';
import { starters } from './fantasy-data';

@Controller('roster')
export class RosterController {
  @Get('preview')
  getPreview() {
    return starters;
  }
}
