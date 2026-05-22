import { Controller, Get } from '@nestjs/common';
import { currentGames } from './fantasy-data';

@Controller('games')
export class GamesController {
  @Get('current')
  getCurrentGames() {
    return currentGames;
  }
}
