import { Test } from '@nestjs/testing';
import { DashboardDataService } from './dashboard/dashboard-data.service';
import { FANTASY_LEAGUE_PROVIDER, LIVE_NFL_DATA_PROVIDER } from './dashboard/dashboard-provider.tokens';
import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  it('returns an aggregate fantasy night payload with real NFL fixture data', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardDataService,
        {
          provide: LIVE_NFL_DATA_PROVIDER,
          useValue: {
            name: 'demo',
            getNflState: async () => ({ season: '2026', week: 14, seasonType: 'regular' }),
            getLiveGames: async () => [
              {
                id: 'game-det-chi',
                awayTeam: { id: 'DET', city: 'Detroit', name: 'Lions', abbreviation: 'DET', score: 27 },
                homeTeam: { id: 'CHI', city: 'Chicago', name: 'Bears', abbreviation: 'CHI', score: 20 },
                status: 'in-progress',
                quarter: 'Q4',
                clock: '06:14',
                possessionTeamId: 'CHI',
                fantasyImpact: 'Jahmyr Gibbs is up to 21.8 PPR points and still handling red-zone work.',
                headline: 'Bears pushing while Lions lean on Gibbs and St. Brown to close.',
              },
            ],
          },
        },
        {
          provide: FANTASY_LEAGUE_PROVIDER,
          useValue: {
            name: 'demo',
            getDashboardShell: async () => ({
              meta: {
                lastUpdated: '8:42 PM ET',
                myPlayersActive: 4,
                opponentPlayersActive: 3,
              },
              matchup: {
                managerName: 'Chrise',
                teamName: 'Gridiron Architects',
                opponentTeamName: 'Red Zone Rebels',
                myLivePoints: 84.3,
                opponentLivePoints: 79.8,
                myProjectedPoints: 132.4,
                opponentProjectedPoints: 126.1,
                projectedDelta: 6.3,
                kickoffProjectionDelta: -1.8,
                trendNote: 'You have swung into the lead on Gibbs and St. Brown volume.',
              },
              positionLeaders: [
                { position: 'QB', playerName: 'Jared Goff', team: 'DET', fantasyPoints: 24.8, note: '3 total touchdowns' },
                { position: 'RB', playerName: 'Jahmyr Gibbs', team: 'DET', fantasyPoints: 21.8, note: '2 goal-line scores' },
                { position: 'WR', playerName: 'Amon-Ra St. Brown', team: 'DET', fantasyPoints: 19.6, note: '11 catches with a deep shot still live' },
                { position: 'TE', playerName: 'Travis Kelce', team: 'KC', fantasyPoints: 17.3, note: 'Commanding third-down targets' },
              ],
              myActivePlayers: [],
              opponentActivePlayers: [],
              leagueImpact: {
                currentRank: 2,
                projectedRank: 1,
                playoffOdds: 91,
                movementSummary: 'Projected to climb to 1st if the current pace holds.',
              },
            }),
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(DashboardController);

    await expect(controller.getNightDashboard()).resolves.toEqual(
      expect.objectContaining({
        liveGames: expect.arrayContaining([
          expect.objectContaining({
            id: 'game-det-chi',
            awayTeam: expect.objectContaining({ abbreviation: 'DET' }),
            homeTeam: expect.objectContaining({ abbreviation: 'CHI' }),
          }),
        ]),
        meta: expect.objectContaining({
          liveGameCount: 1,
        }),
        matchup: expect.objectContaining({
          managerName: 'Chrise',
          projectedDelta: expect.any(Number),
        }),
        positionLeaders: expect.arrayContaining([
          expect.objectContaining({ position: 'QB' }),
          expect.objectContaining({ position: 'RB' }),
          expect.objectContaining({ position: 'WR' }),
          expect.objectContaining({ position: 'TE' }),
        ]),
      }),
    );
  });
});
