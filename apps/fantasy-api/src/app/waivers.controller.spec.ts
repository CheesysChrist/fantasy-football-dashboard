import { Test } from '@nestjs/testing';
import { WaiverPlayer } from '@ux-lib-csr/contracts';
import { SleeperFantasyService } from './sleeper-fantasy.service';
import { WaiversController } from './waivers.controller';

describe('WaiversController', () => {
  it('returns waiver players from the sleeper fantasy service', async () => {
    const waiverPlayers: WaiverPlayer[] = [
      {
        id: 'abc',
        name: 'Sleeper Pickup',
        position: 'WR',
        proTeam: 'DET',
        projectedPoints: 12.3,
        status: 'healthy',
        news: 'Trending add.',
        rosteredPercent: 45,
        claimStatus: 'available',
      },
    ];

    const moduleRef = await Test.createTestingModule({
      controllers: [WaiversController],
      providers: [
        {
          provide: SleeperFantasyService,
          useValue: { getTrendingWaivers: jest.fn().mockResolvedValue(waiverPlayers) },
        },
      ],
    }).compile();

    await expect(moduleRef.get(WaiversController).getWaivers()).resolves.toEqual(waiverPlayers);
  });
});