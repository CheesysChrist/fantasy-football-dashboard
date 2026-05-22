import { Injectable, Logger } from '@nestjs/common';
import { LineupSlot, NflState, PlayerProfile, PlayerStatus, PlayerTrend, WaiverPlayer, mapSleeperNflState, mapSleeperPlayers, mapSleeperTrend } from '@ux-lib-csr/contracts';
import { defaultNflState, waivers } from './fantasy-data';

const SLEEPER_BASE_URL = 'https://api.sleeper.app/v1';
const TREND_LIMIT = 10;
const PLAYER_CACHE_TTL_MS = 1000 * 60 * 60;
const SUPPORTED_POSITIONS: ReadonlySet<LineupSlot> = new Set(['QB', 'RB', 'WR', 'TE', 'FLEX', 'DST', 'K', 'BENCH']);

@Injectable()
export class SleeperFantasyService {
  private readonly logger = new Logger(SleeperFantasyService.name);
  private playersCache?: { fetchedAt: number; players: Record<string, PlayerProfile> };

  async getTrendingWaivers(): Promise<WaiverPlayer[]> {
    try {
      const players = await this.getPlayers();
      const response = await this.fetchJson<Array<{ player_id?: string | number; count?: number }>>(
        `${SLEEPER_BASE_URL}/players/nfl/trending/add?lookback_hours=24&limit=${TREND_LIMIT}`,
      );

      return response
        .map((trend) => mapSleeperTrend(trend, 'add', players))
        .filter((trend) => Boolean(trend.playerId))
        .map((trend) => this.toWaiverPlayer(trend));
    } catch (error) {
      this.logger.warn(`Falling back to demo waivers because Sleeper trending fetch failed: ${this.describeError(error)}`);
      return waivers;
    }
  }

  async getNflState(): Promise<NflState> {
    try {
      const response = await this.fetchJson<{ season?: string | number; week?: number; season_type?: string }>(`${SLEEPER_BASE_URL}/state/nfl`);
      return mapSleeperNflState(response);
    } catch (error) {
      this.logger.warn(`Falling back to default NFL state because Sleeper state fetch failed: ${this.describeError(error)}`);
      return defaultNflState;
    }
  }

  private async getPlayers(): Promise<Record<string, PlayerProfile>> {
    if (this.playersCache && Date.now() - this.playersCache.fetchedAt < PLAYER_CACHE_TTL_MS) {
      return this.playersCache.players;
    }

    const response = await this.fetchJson<Record<string, unknown>>(`${SLEEPER_BASE_URL}/players/nfl`);
    const players = mapSleeperPlayers(response as Parameters<typeof mapSleeperPlayers>[0]);

    this.playersCache = {
      fetchedAt: Date.now(),
      players,
    };

    return players;
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Sleeper request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  private toWaiverPlayer(trend: PlayerTrend): WaiverPlayer {
    const player = trend.player;
    const position = this.toLineupSlot(player?.position);
    const status = this.toPlayerStatus(player);
    const projectedPoints = Math.min(20, 6 + trend.count / 40);
    const rosteredPercent = Math.max(1, Math.min(95, Math.round(trend.count / 8)));

    return {
      id: trend.playerId,
      name: player?.fullName || `Sleeper Player ${trend.playerId}`,
      position,
      proTeam: player?.team || 'FA',
      projectedPoints: Number(projectedPoints.toFixed(1)),
      status,
      news: `${player?.fullName || 'Player'} is trending on Sleeper adds (${trend.count} adds in the last 24 hours).`,
      rosteredPercent,
      claimStatus: 'available',
    };
  }

  private toLineupSlot(position?: string): LineupSlot {
    if (position && SUPPORTED_POSITIONS.has(position as LineupSlot)) {
      return position as LineupSlot;
    }

    return 'FLEX';
  }

  private toPlayerStatus(player?: PlayerProfile): PlayerStatus {
    const rawStatus = `${player?.injuryStatus || ''} ${player?.status || ''}`.trim().toLowerCase();

    if (rawStatus.includes('out') || rawStatus.includes('inactive')) {
      return 'out';
    }

    if (rawStatus.includes('doubt')) {
      return 'doubtful';
    }

    if (rawStatus.includes('question') || rawStatus.includes('probable')) {
      return 'questionable';
    }

    return 'healthy';
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : 'unknown error';
  }
}
