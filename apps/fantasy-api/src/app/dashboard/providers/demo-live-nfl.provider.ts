import { Injectable } from '@nestjs/common';
import { currentGames, defaultNflState } from '../../fantasy-data';
import { LiveNflDataProvider } from '../dashboard-provider.types';

@Injectable()
export class DemoLiveNflProvider implements LiveNflDataProvider {
  readonly name = 'demo';

  async getNflState() {
    return defaultNflState;
  }

  async getLiveGames() {
    return currentGames;
  }
}
