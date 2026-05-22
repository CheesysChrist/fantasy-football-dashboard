import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UxDashboardCardComponent } from '@ux-lib-csr/angular-ui';
import { Standing } from '@ux-lib-csr/contracts';
import { Observable } from 'rxjs';
import { FantasyApiService } from '../fantasy-api.service';

@Component({
  selector: 'app-standings-page',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, MatTableModule, UxDashboardCardComponent],
  templateUrl: './standings-page.component.html',
})
export class StandingsPageComponent {
  protected readonly columns = ['rank', 'team', 'record', 'points', 'playoffs'];
  protected readonly standings$: Observable<Standing[]> = inject(FantasyApiService).standings();
}
