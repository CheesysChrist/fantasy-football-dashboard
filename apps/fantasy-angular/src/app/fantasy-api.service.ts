import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CurrentGame, FantasyPlayer, LeagueSummary, Lineup, NflState, Standing, WaiverPlayer } from '@ux-lib-csr/contracts';

const API_BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class FantasyApiService {
  private readonly http = inject(HttpClient);

  currentGames() { return this.http.get<CurrentGame[]>(`${API_BASE}/games/current`); }
  leagueSummary() { return this.http.get<LeagueSummary>(`${API_BASE}/league/summary`); }
  leagueNflState() { return this.http.get<NflState>(`${API_BASE}/league/nfl-state`); }
  standings() { return this.http.get<Standing[]>(`${API_BASE}/standings`); }
  waivers() { return this.http.get<WaiverPlayer[]>(`${API_BASE}/waivers`); }
  rosterPreview() { return this.http.get<FantasyPlayer[]>(`${API_BASE}/roster/preview`); }
  lineup() { return this.http.get<Lineup>(`${API_BASE}/lineup`); }
  saveLineup(playerIds: string[]) { return this.http.post(`${API_BASE}/lineup`, { playerIds }); }
}
