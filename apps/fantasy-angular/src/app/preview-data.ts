import { CurrentGame, FantasyPlayer, LeagueSummary, Lineup, NflState, Standing, WaiverPlayer } from '@ux-lib-csr/contracts';
import { FantasyNightDashboard } from './fantasy-night-dashboard';

export const previewCurrentGames: CurrentGame[] = [
  {
    id: 'game-det-chi',
    awayTeam: { id: 'DET', city: 'Detroit', name: 'Lions', abbreviation: 'DET', score: 27 },
    homeTeam: { id: 'CHI', city: 'Chicago', name: 'Bears', abbreviation: 'CHI', score: 20 },
    status: 'in-progress',
    quarter: 'Q4',
    clock: '06:14',
    possessionTeamId: 'CHI',
    fantasyImpact: 'Jahmyr Gibbs is up to 21.8 PPR points and still handling red-zone work.',
    headline: 'Bears pushing while Lions lean on Gibbs and St. Brown to close.',
  },
  {
    id: 'game-kc-lv',
    awayTeam: { id: 'KC', city: 'Kansas City', name: 'Chiefs', abbreviation: 'KC', score: 24 },
    homeTeam: { id: 'LV', city: 'Las Vegas', name: 'Raiders', abbreviation: 'LV', score: 17 },
    status: 'in-progress',
    quarter: 'Q3',
    clock: '02:31',
    possessionTeamId: 'KC',
    fantasyImpact: 'Travis Kelce has stabilized your floor while Mahomes keeps the pace hot for both managers.',
    headline: 'Chiefs attacking the middle of the field in a high-leverage third quarter.',
  },
];

export const previewLeagueSummary: LeagueSummary = {
  leagueName: 'Sunday Strategists',
  managerName: 'Chrise',
  teamName: 'Gridiron Architects',
  record: '7-3',
  rank: 2,
  projectedPoints: 132.4,
  waiverPriority: 4,
  upcomingOpponent: 'Red Zone Rebels',
};

export const previewStandings: Standing[] = [
  { rank: 1, teamName: 'Red Zone Rebels', managerName: 'Maya Stone', record: '8-2', pointsFor: 1268.4, pointsAgainst: 1112.2, streak: 'W4', playoffProbability: 89 },
  { rank: 2, teamName: 'Gridiron Architects', managerName: 'Chrise', record: '7-3', pointsFor: 1244.8, pointsAgainst: 1130.5, streak: 'W2', playoffProbability: 91 },
  { rank: 3, teamName: 'Fourth Down Foundry', managerName: 'Noah Brooks', record: '6-4', pointsFor: 1192.1, pointsAgainst: 1164.9, streak: 'L1', playoffProbability: 70 },
  { rank: 4, teamName: 'Pocket Presence', managerName: 'Ava Reed', record: '6-4', pointsFor: 1178.9, pointsAgainst: 1151.0, streak: 'W1', playoffProbability: 64 },
];

export const previewRoster: FantasyPlayer[] = [
  { id: 'p1', name: 'Jahmyr Gibbs', position: 'RB', proTeam: 'DET', projectedPoints: 18.4, status: 'healthy', news: 'Explosive workload in a plus matchup.' },
  { id: 'p2', name: 'Amon-Ra St. Brown', position: 'WR', proTeam: 'DET', projectedPoints: 19.1, status: 'healthy', news: 'Elite target share with red-zone usage.' },
  { id: 'p3', name: 'Travis Kelce', position: 'TE', proTeam: 'KC', projectedPoints: 15.8, status: 'healthy', news: 'Chief underneath volume remains secure.' },
  { id: 'p4', name: 'Caleb Williams', position: 'QB', proTeam: 'CHI', projectedPoints: 17.2, status: 'questionable', news: 'Boom-bust fantasy line powered by rushing upside.' },
];

export const previewWaivers: WaiverPlayer[] = [
  { id: 'w1', name: 'Tyjae Spears', position: 'RB', proTeam: 'TEN', projectedPoints: 11.2, status: 'healthy', news: 'Passing-down role expanding into flex value.', rosteredPercent: 42, claimStatus: 'available' },
  { id: 'w2', name: 'Josh Palmer', position: 'WR', proTeam: 'LAC', projectedPoints: 10.9, status: 'healthy', news: 'Vertical usage makes him a useful bye-week fill-in.', rosteredPercent: 37, claimStatus: 'pending' },
  { id: 'w3', name: 'Luke Musgrave', position: 'TE', proTeam: 'GB', projectedPoints: 7.4, status: 'questionable', news: 'Streaming option if full practice momentum holds.', rosteredPercent: 18, claimStatus: 'available' },
];

export const previewNflState: NflState = {
  season: '2026',
  week: 14,
  seasonType: 'regular',
};

export const previewLineup: Lineup = {
  week: 14,
  projectedTotal: 132.4,
  entries: [
    { slot: 'QB', player: previewRoster[3] },
    { slot: 'RB', player: previewRoster[0] },
    { slot: 'WR', player: previewRoster[1] },
    { slot: 'TE', player: previewRoster[2] },
    { slot: 'FLEX' },
  ],
};

export const previewFantasyNightDashboard: FantasyNightDashboard = {
  nflState: previewNflState,
  meta: {
    lastUpdated: '8:42 PM ET',
    liveGameCount: 2,
    myPlayersActive: 4,
    opponentPlayersActive: 3,
  },
  matchup: {
    managerName: 'Chrise',
    teamName: 'Gridiron Architects',
    opponentTeamName: 'Red Zone Rebels',
    myLivePoints: 84.3,
    opponentLivePoints: 79.8,
    myProjectedPoints: 132.4,
    opponentProjectedPoints: 126.1,
    projectedDelta: 6.3,
    kickoffProjectionDelta: -1.8,
    trendNote: 'You have swung into the lead on Gibbs and St. Brown volume.',
  },
  liveGames: previewCurrentGames,
  positionLeaders: [
    { position: 'QB', playerName: 'Jared Goff', team: 'DET', fantasyPoints: 24.8, note: '3 total touchdowns' },
    { position: 'RB', playerName: 'Jahmyr Gibbs', team: 'DET', fantasyPoints: 21.8, note: '2 goal-line scores' },
    { position: 'WR', playerName: 'Amon-Ra St. Brown', team: 'DET', fantasyPoints: 19.6, note: '11 catches with a deep shot still live' },
    { position: 'TE', playerName: 'Travis Kelce', team: 'KC', fantasyPoints: 17.3, note: 'Commanding third-down targets' },
  ],
  myActivePlayers: [
    { id: 'my-1', playerName: 'Jahmyr Gibbs', slot: 'RB', position: 'RB', nflTeam: 'DET', projectedPoints: 18.4, livePoints: 21.8, trend: 'beating projection', status: 'active' },
    { id: 'my-2', playerName: 'Amon-Ra St. Brown', slot: 'WR', position: 'WR', nflTeam: 'DET', projectedPoints: 19.1, livePoints: 19.6, trend: 'on pace', status: 'active' },
    { id: 'my-3', playerName: 'Travis Kelce', slot: 'TE', position: 'TE', nflTeam: 'KC', projectedPoints: 15.8, livePoints: 17.3, trend: 'beating projection', status: 'active' },
    { id: 'my-4', playerName: 'Chiefs D/ST', slot: 'DST', position: 'DST', nflTeam: 'KC', projectedPoints: 8.1, livePoints: 6.0, trend: 'needs one more sack', status: 'active' },
  ],
  opponentActivePlayers: [
    { id: 'opp-1', playerName: 'DJ Moore', slot: 'WR', position: 'WR', nflTeam: 'CHI', projectedPoints: 16.1, livePoints: 11.4, trend: 'needs late touchdown', status: 'active' },
    { id: 'opp-2', playerName: 'Caleb Williams', slot: 'QB', position: 'QB', nflTeam: 'CHI', projectedPoints: 17.2, livePoints: 15.7, trend: 'slightly behind projection', status: 'active' },
    { id: 'opp-3', playerName: 'Jakobi Meyers', slot: 'FLEX', position: 'WR', nflTeam: 'LV', projectedPoints: 12.4, livePoints: 9.1, trend: 'volume intact, efficiency lagging', status: 'active' },
  ],
  leagueImpact: {
    currentRank: 2,
    projectedRank: 1,
    playoffOdds: 91,
    movementSummary: 'Projected to climb to 1st if the current pace holds.',
  },
};
