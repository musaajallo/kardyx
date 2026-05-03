export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type GameMode = 'democratic' | 'dungeon-master' | 'dual' | 'tournament';

export type Topic = 'tech' | 'history' | 'pop-culture' | 'math' | 'art' | string;

export interface Player {
  id: string;
  displayName: string;
  isHost: boolean;
  joinedAt: string;
  status: 'active' | 'afk' | 'left';
}

export interface PartySettings {
  mode: GameMode;
  topics: Topic[];
  maxPlayers: number;
  roundsTotal: number;
}

export interface Party {
  id: string;
  joinCode: string;
  hostId: string;
  players: Player[];
  settings: PartySettings;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export interface GameState {
  partyId: string;
  round: number;
  currentPlayerId: string;
  direction: 'cw' | 'ccw';
  scores: Record<string, number>;
  effectsActive: ActiveEffect[];
  history: GameEvent[];
  version: number;
}

export interface ActiveEffect {
  id: string;
  powerUpId: string;
  appliedAt: string;
  expiresAtRound?: number;
  targetPlayerId?: string;
  metadata?: Record<string, unknown>;
}

export type GameEventType =
  | 'card.scanned'
  | 'powerup.triggered'
  | 'powerup.applied'
  | 'powerup.vetoed'
  | 'turn.advanced'
  | 'round.completed'
  | 'player.joined'
  | 'player.left';

export interface GameEvent {
  id: string;
  type: GameEventType;
  playerId: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}
