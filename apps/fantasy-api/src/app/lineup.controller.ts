import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { UpdateLineupRequest } from '@ux-lib-csr/contracts';
import { lineup } from './fantasy-data';

@Controller('lineup')
export class LineupController {
  @Get()
  getLineup() {
    return lineup;
  }

  @Post()
  updateLineup(@Body() request: UpdateLineupRequest) {
    if (!request.playerIds || request.playerIds.length < 4) {
      throw new BadRequestException(['Select at least four players before saving your lineup.']);
    }
    return { message: 'Lineup saved', lineup };
  }
}
