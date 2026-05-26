import { CurrentGame, NflState, PlayerStatus } from '@ux-lib-csr/contracts';

export interface FantasyNightDashboardMeta {
  lastUpdated: string;
  liveGameCount: number;
  myPlayersActive: number;
  opponentPlayersActive: number;
}

export interface FantasyMatchupSnapshot {
  managerName: string;
  teamName: string;
  opponentTeamName: string;
  myLivePoints: number;
  opponentLivePoints: number;
  myProjectedPoints: number;
  opponentProjectedPoints: number;
  projectedDelta: number;
  kickoffProjectionDelta: number;
  trendNote: string;
}

export interface PositionLeader {
  position: 'QB' | 'RB' | 'WR' | 'TE';
  playerName: string;
  team: string;
  fantasyPoints: number;
  note: string;
}

export interface ActiveFantasyPlayer {
  id: string;
  playerName: string;
  slot: string;
  position: string;
  nflTeam: string;
  projectedPoints: number;
  livePoints: number;
  trend: string;
  status: PlayerStatus | 'active';
}

export interface LeagueImpactSnapshot {
  currentRank: number;
  projectedRank: number;
  playoffOdds: number;
  movementSummary: string;
}

export interface FantasyNightDashboard {
  nflState: NflState;
  meta: FantasyNightDashboardMeta;
  matchup: FantasyMatchupSnapshot;
  liveGames: CurrentGame[];
  positionLeaders: PositionLeader[];
  myActivePlayers: ActiveFantasyPlayer[];
  opponentActivePlayers: ActiveFantasyPlayer[];
  leagueImpact: LeagueImpactSnapshot;
}
