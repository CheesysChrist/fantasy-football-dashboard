import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { UxDashboardCardComponent } from '@ux-lib-csr/angular-ui';
import { CurrentGame, FantasyPlayer, LeagueSummary } from '@ux-lib-csr/contracts';
import { Observable } from 'rxjs';
import { FantasyApiService } from '../fantasy-api.service';

@Component({
  selector: 'app-current-games-dashboard',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, MatChipsModule, UxDashboardCardComponent],
  templateUrl: './current-games-dashboard.component.html',
  styleUrl: './current-games-dashboard.component.scss',
})
export class CurrentGamesDashboardComponent {
  protected readonly games$: Observable<CurrentGame[]> = inject(FantasyApiService).currentGames();
  protected readonly summary$: Observable<LeagueSummary> = inject(FantasyApiService).leagueSummary();
  protected readonly roster$: Observable<FantasyPlayer[]> = inject(FantasyApiService).rosterPreview();
}
