import { Test } from '@nestjs/testing';
import { GamesController } from './games.controller';

describe('GamesController', () => {
  it('returns current games', async () => {
    const moduleRef = await Test.createTestingModule({ controllers: [GamesController] }).compile();
    expect(moduleRef.get(GamesController).getCurrentGames()).toHaveLength(2);
  });
});
