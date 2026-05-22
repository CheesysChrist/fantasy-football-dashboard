import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { UxButtonDirective, UxDashboardCardComponent } from '@ux-lib-csr/angular-ui';
import { WaiverPlayer } from '@ux-lib-csr/contracts';
import { Observable } from 'rxjs';
import { FantasyApiService } from '../fantasy-api.service';

@Component({
  selector: 'app-waiver-claims-page',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatChipsModule, UxButtonDirective, UxDashboardCardComponent],
  templateUrl: './waiver-claims-page.component.html',
  styleUrl: './waiver-claims-page.component.scss',
})
export class WaiverClaimsPageComponent {
  protected readonly waivers$: Observable<WaiverPlayer[]> = inject(FantasyApiService).waivers();
}
