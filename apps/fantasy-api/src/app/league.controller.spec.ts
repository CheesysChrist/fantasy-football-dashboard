import { Test } from '@nestjs/testing';
import { NflState } from '@ux-lib-csr/contracts';
import { SleeperFantasyService } from './sleeper-fantasy.service';
import { LeagueController } from './league.controller';

describe('LeagueController', () => {
  it('returns nfl state from the sleeper fantasy service', async () => {
    const nflState: NflState = { season: '2026', week: 7, seasonType: 'regular' };

    const moduleRef = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [
        {
          provide: SleeperFantasyService,
          useValue: { getNflState: jest.fn().mockResolvedValue(nflState) },
        },
      ],
    }).compile();

    await expect(moduleRef.get(LeagueController).getNflState()).resolves.toEqual(nflState);
  });
});