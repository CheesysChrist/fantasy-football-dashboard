import { CurrentGame, FantasyPlayer, LeagueSummary, Lineup, NflState, Standing, WaiverPlayer } from '@ux-lib-csr/contracts';

export const currentGames: CurrentGame[] = [
  {
    id: 'game-1',
    awayTeam: { id: 'away-1', city: 'Portland', name: 'Pioneers', abbreviation: 'POR', score: 21 },
    homeTeam: { id: 'home-1', city: 'Austin', name: 'Outlaws', abbreviation: 'AUS', score: 24 },
    status: 'in-progress',
    quarter: 'Q3',
    clock: '05:42',
    possessionTeamId: 'home-1',
    fantasyImpact: 'Mason Cole has 18.4 points with a red-zone target share climbing.',
    headline: 'Outlaws driving late in the third quarter',
  },
  {
    id: 'game-2',
    awayTeam: { id: 'away-2', city: 'Columbus', name: 'Comets', abbreviation: 'COL', score: 13 },
    homeTeam: { id: 'home-2', city: 'Sacramento', name: 'Sentinels', abbreviation: 'SAC', score: 10 },
    status: 'in-progress',
    quarter: 'Q2',
    clock: '01:18',
    possessionTeamId: 'away-2',
    fantasyImpact: 'Theo Grant is trending toward a 100-yard bonus.',
    headline: 'Comets controlling possession before halftime',
  },
];

export const leagueSummary: LeagueSummary = {
  leagueName: 'Sunday Strategists',
  managerName: 'Chrise',
  teamName: 'Gridiron Architects',
  record: '7-3',
  rank: 2,
  projectedPoints: 128.6,
  waiverPriority: 4,
  upcomingOpponent: 'Red Zone Rebels',
};

export const standings: Standing[] = [
  { rank: 1, teamName: 'Red Zone Rebels', managerName: 'Maya Stone', record: '8-2', pointsFor: 1268.4, pointsAgainst: 1112.2, streak: 'W4', playoffProbability: 94 },
  { rank: 2, teamName: 'Gridiron Architects', managerName: 'Chrise', record: '7-3', pointsFor: 1244.8, pointsAgainst: 1130.5, streak: 'W2', playoffProbability: 88 },
  { rank: 3, teamName: 'Fourth Down Foundry', managerName: 'Noah Brooks', record: '6-4', pointsFor: 1192.1, pointsAgainst: 1164.9, streak: 'L1', playoffProbability: 70 },
  { rank: 4, teamName: 'Pocket Presence', managerName: 'Ava Reed', record: '6-4', pointsFor: 1178.9, pointsAgainst: 1151.0, streak: 'W1', playoffProbability: 64 },
];

export const starters: FantasyPlayer[] = [
  { id: 'p1', name: 'Mason Cole', position: 'QB', proTeam: 'AUS', projectedPoints: 22.4, status: 'healthy', news: 'High-volume matchup indoors.' },
  { id: 'p2', name: 'Theo Grant', position: 'RB', proTeam: 'COL', projectedPoints: 16.8, status: 'healthy', news: 'Expected lead back.' },
  { id: 'p3', name: 'Darius Vale', position: 'WR', proTeam: 'POR', projectedPoints: 14.1, status: 'questionable', news: 'Limited practice, expected to play.' },
  { id: 'p4', name: 'Elliot Marsh', position: 'TE', proTeam: 'SAC', projectedPoints: 9.6, status: 'healthy', news: 'Red-zone usage trending up.' },
];

export const waivers: WaiverPlayer[] = [
  { id: 'w1', name: 'Caleb North', position: 'RB', proTeam: 'DEN', projectedPoints: 11.2, status: 'healthy', news: 'Injury opened early-down role.', rosteredPercent: 42, claimStatus: 'available' },
  { id: 'w2', name: 'Jalen Cross', position: 'WR', proTeam: 'MIA', projectedPoints: 10.9, status: 'healthy', news: 'Deep threat with favorable matchup.', rosteredPercent: 37, claimStatus: 'pending' },
  { id: 'w3', name: 'Owen Price', position: 'TE', proTeam: 'SEA', projectedPoints: 7.4, status: 'questionable', news: 'Streaming option if active.', rosteredPercent: 18, claimStatus: 'available' },
];

export const defaultNflState: NflState = {
  season: '2026',
  week: 1,
  seasonType: 'regular',
};

export const lineup: Lineup = {
  week: 11,
  projectedTotal: 128.6,
  entries: [
    { slot: 'QB', player: starters[0] },
    { slot: 'RB', player: starters[1] },
    { slot: 'WR', player: starters[2] },
    { slot: 'TE', player: starters[3] },
    { slot: 'FLEX' },
  ],
};
