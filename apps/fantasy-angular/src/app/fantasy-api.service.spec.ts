import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FantasyApiService } from './fantasy-api.service';

describe('FantasyApiService', () => {
  let service: FantasyApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FantasyApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(FantasyApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('falls back to preview dashboard data when current games request fails', () => {
    let result: unknown;

    service.currentGames().subscribe((value) => {
      result = value;
    });

    const request = httpController.expectOne('/api/games/current');
    request.flush('backend unavailable', { status: 503, statusText: 'Service Unavailable' });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'game-det-chi',
          fantasyImpact: expect.stringContaining('Jahmyr Gibbs'),
        }),
      ])
    );
  });

  it('falls back to preview night dashboard data when the aggregate request fails', () => {
    let result: unknown;

    service.nightDashboard().subscribe((value) => {
      result = value;
    });

    const request = httpController.expectOne('/api/dashboard/night');
    request.flush('backend unavailable', { status: 503, statusText: 'Service Unavailable' });

    expect(result).toEqual(
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
        ]),
      })
    );
  });

  it('falls back to a successful preview save response when lineup save fails', () => {
    let completed = false;

    service.saveLineup(['p1', 'p2']).subscribe(() => {
      completed = true;
    });

    const request = httpController.expectOne('/api/lineup');
    expect(request.request.method).toBe('POST');
    request.flush('backend unavailable', { status: 503, statusText: 'Service Unavailable' });

    expect(completed).toBe(true);
  });
});
