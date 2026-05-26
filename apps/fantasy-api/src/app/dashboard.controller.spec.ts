import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  it('returns an aggregate fantasy night payload with real NFL fixture data', () => {
    const controller = new DashboardController();

    expect(controller.getNightDashboard()).toEqual(
      expect.objectContaining({
        liveGames: expect.arrayContaining([
          expect.objectContaining({
            id: 'game-det-chi',
            awayTeam: expect.objectContaining({ abbreviation: 'DET' }),
            homeTeam: expect.objectContaining({ abbreviation: 'CHI' }),
          }),
        ]),
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
      })
    );
  });
});
