import type { Card, GameEvent, GameState } from '@kardyx/types';
import type { PowerUpRegistry } from './registry.js';

export interface ScanInput {
  state: GameState;
  card: Card;
  scannedBy: string;
  scannedAt: string;
  registry: PowerUpRegistry;
}

export interface ScanOutput {
  nextState: GameState;
  events: GameEvent[];
}

export function applyScan(input: ScanInput): ScanOutput {
  const { state, card, scannedBy, scannedAt, registry } = input;

  const scanEvent: GameEvent = {
    id: crypto.randomUUID(),
    type: 'card.scanned',
    playerId: scannedBy,
    occurredAt: scannedAt,
    payload: { card },
  };

  const def = registry.resolve(card);

  if (!def) {
    return {
      nextState: { ...state, history: [...state.history, scanEvent], version: state.version + 1 },
      events: [scanEvent],
    };
  }

  const result = def.resolve({
    state: { ...state, history: [...state.history, scanEvent] },
    triggeredBy: scannedBy,
    triggeredAt: scannedAt,
    card,
  });

  return {
    nextState: { ...result.nextState, version: state.version + 1 },
    events: [scanEvent, ...result.events],
  };
}
