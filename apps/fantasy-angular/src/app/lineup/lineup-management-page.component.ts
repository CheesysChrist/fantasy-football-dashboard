import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UxAlertComponent, UxButtonDirective, UxDashboardCardComponent } from '@ux-lib-csr/angular-ui';
import { mapHttpErrorToUxError } from '@ux-lib-csr/angular-utils';
import { Lineup } from '@ux-lib-csr/contracts';
import { Observable } from 'rxjs';
import { FantasyApiService } from '../fantasy-api.service';

@Component({
  selector: 'app-lineup-management-page',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, MatButtonModule, MatSnackBarModule, UxAlertComponent, UxButtonDirective, UxDashboardCardComponent],
  templateUrl: './lineup-management-page.component.html',
  styleUrl: './lineup-management-page.component.scss',
})
export class LineupManagementPageComponent {
  private readonly api = inject(FantasyApiService);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly lineup$: Observable<Lineup> = inject(FantasyApiService).lineup();
  protected readonly form = new FormGroup({ playerIds: new FormControl<string[]>([]) });
  protected errorMessage = '';

  save(): void {
    this.api.saveLineup(this.form.value.playerIds ?? []).subscribe({
      next: () => this.snackBar.open('Lineup saved', 'Close', { duration: 2500 }),
      error: (error: unknown) => { this.errorMessage = mapHttpErrorToUxError(error).message; },
    });
  }
}
