import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FantasyApiService } from '../fantasy-api.service';
import { CurrentGamesDashboardComponent } from './current-games-dashboard.component';

describe('CurrentGamesDashboardComponent', () => {
  const nightDashboard = {
    nflState: {
      season: '2026',
      week: 14,
      seasonType: 'regular',
    },
    meta: {
      lastUpdated: '8:42 PM ET',
      liveGameCount: 2,
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
    liveGames: [
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
    positionLeaders: [
      { position: 'QB', playerName: 'Jared Goff', team: 'DET', fantasyPoints: 24.8, note: '3 total touchdowns' },
      { position: 'RB', playerName: 'Jahmyr Gibbs', team: 'DET', fantasyPoints: 21.8, note: '2 goal-line scores' },
    ],
    myActivePlayers: [
      { id: 'my-1', playerName: 'Jahmyr Gibbs', slot: 'RB', position: 'RB', nflTeam: 'DET', projectedPoints: 18.4, livePoints: 21.8, trend: 'beating projection', status: 'active' },
    ],
    opponentActivePlayers: [
      { id: 'opp-1', playerName: 'DJ Moore', slot: 'WR', position: 'WR', nflTeam: 'CHI', projectedPoints: 16.1, livePoints: 11.4, trend: 'needs late touchdown', status: 'active' },
    ],
    leagueImpact: {
      currentRank: 2,
      projectedRank: 1,
      playoffOdds: 91,
      movementSummary: 'Projected to climb to 1st if the current pace holds.',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentGamesDashboardComponent],
      providers: [
        {
          provide: FantasyApiService,
          useValue: {
            nightDashboard: () => of(nightDashboard),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the fantasy live-night dashboard experience', async () => {
    const fixture = TestBed.createComponent(CurrentGamesDashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero p')?.textContent).toContain('2026 season · Week 14 · regular');
    expect(compiled.textContent).toContain('My players active: 4');
    expect(compiled.textContent).toContain('Projected edge');
    expect(compiled.textContent).toContain('Top performers by position');
    expect(compiled.textContent).toContain('Jahmyr Gibbs');
    expect(compiled.textContent).toContain('Projected to climb to 1st if the current pace holds.');
  });
});
