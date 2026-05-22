import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FantasyApiService } from '../fantasy-api.service';
import { CurrentGamesDashboardComponent } from './current-games-dashboard.component';

describe('CurrentGamesDashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentGamesDashboardComponent],
      providers: [
        {
          provide: FantasyApiService,
          useValue: {
            currentGames: () => of([]),
            leagueSummary: () => of({
              leagueName: 'Sunday Strategists',
              managerName: 'Chrise',
              teamName: 'Gridiron Architects',
              record: '7-3',
              rank: 2,
              projectedPoints: 128.6,
              waiverPriority: 4,
              upcomingOpponent: 'Red Zone Rebels',
            }),
            rosterPreview: () => of([]),
            leagueNflState: () => of({
              season: '2026',
              week: 14,
              seasonType: 'regular',
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the live NFL state from the backend', async () => {
    const fixture = TestBed.createComponent(CurrentGamesDashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero p')?.textContent).toContain('2026 season · Week 14 · regular');
    expect(compiled.textContent).toContain('Sleeper-backed NFL state');
  });
});
