import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { UxDashboardCardComponent } from '@ux-lib-csr/angular-ui';
import { Observable } from 'rxjs';
import { FantasyApiService } from '../fantasy-api.service';
import { FantasyNightDashboard } from '../fantasy-night-dashboard';

@Component({
  selector: 'app-current-games-dashboard',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, MatChipsModule, UxDashboardCardComponent],
  templateUrl: './current-games-dashboard.component.html',
  styleUrl: './current-games-dashboard.component.scss',
})
export class CurrentGamesDashboardComponent {
  private readonly fantasyApi = inject(FantasyApiService);

  protected readonly dashboard$: Observable<FantasyNightDashboard> = this.fantasyApi.nightDashboard();
}
