import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CurrentGame, FantasyPlayer, LeagueSummary, Lineup, NflState, Standing, WaiverPlayer } from '@ux-lib-csr/contracts';
import { catchError, of } from 'rxjs';
import { previewCurrentGames, previewLeagueSummary, previewLineup, previewNflState, previewRoster, previewStandings, previewWaivers } from './preview-data';

const API_BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class FantasyApiService {
  private readonly http = inject(HttpClient);

  currentGames() { return this.http.get<CurrentGame[]>(`${API_BASE}/games/current`).pipe(catchError(() => of(previewCurrentGames))); }
  leagueSummary() { return this.http.get<LeagueSummary>(`${API_BASE}/league/summary`).pipe(catchError(() => of(previewLeagueSummary))); }
  leagueNflState() { return this.http.get<NflState>(`${API_BASE}/league/nfl-state`).pipe(catchError(() => of(previewNflState))); }
  standings() { return this.http.get<Standing[]>(`${API_BASE}/standings`).pipe(catchError(() => of(previewStandings))); }
  waivers() { return this.http.get<WaiverPlayer[]>(`${API_BASE}/waivers`).pipe(catchError(() => of(previewWaivers))); }
  rosterPreview() { return this.http.get<FantasyPlayer[]>(`${API_BASE}/roster/preview`).pipe(catchError(() => of(previewRoster))); }
  lineup() { return this.http.get<Lineup>(`${API_BASE}/lineup`).pipe(catchError(() => of(previewLineup))); }
  saveLineup(playerIds: string[]) { return this.http.post(`${API_BASE}/lineup`, { playerIds }).pipe(catchError(() => of({ saved: true }))); }
}
