import { Route } from '@angular/router';
import { CurrentGamesDashboardComponent } from './dashboard/current-games-dashboard.component';
import { LineupManagementPageComponent } from './lineup/lineup-management-page.component';
import { StandingsPageComponent } from './standings/standings-page.component';
import { WaiverClaimsPageComponent } from './waivers/waiver-claims-page.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: CurrentGamesDashboardComponent },
  { path: 'standings', component: StandingsPageComponent },
  { path: 'waivers', component: WaiverClaimsPageComponent },
  { path: 'lineup', component: LineupManagementPageComponent },
];
