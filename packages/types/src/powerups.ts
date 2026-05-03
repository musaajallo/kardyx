import type { Card, GameState, GameEvent } from './game.js';

export type PowerUpCategory = 'flow' | 'collaboration' | 'topic' | 'social';

export interface PowerUpDefinition {
  id: string;
  name: string;
  category: PowerUpCategory;
  description: string;
  triggerCard?: Card;
  priority: number;
  resolve: PowerUpResolver;
}

export interface PowerUpContext {
  state: GameState;
  triggeredBy: string;
  triggeredAt: string;
  card: Card;
}

export interface PowerUpResult {
  nextState: GameState;
  events: GameEvent[];
}

export type PowerUpResolver = (ctx: PowerUpContext) => PowerUpResult;
