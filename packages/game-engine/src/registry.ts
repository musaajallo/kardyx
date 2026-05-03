import type { PowerUpDefinition, Card } from '@kardyx/types';

export class PowerUpRegistry {
  private byId = new Map<string, PowerUpDefinition>();
  private byCard = new Map<string, PowerUpDefinition>();

  register(def: PowerUpDefinition): void {
    this.byId.set(def.id, def);
    if (def.triggerCard) {
      this.byCard.set(cardKey(def.triggerCard), def);
    }
  }

  resolve(card: Card): PowerUpDefinition | undefined {
    return this.byCard.get(cardKey(card));
  }

  get(id: string): PowerUpDefinition | undefined {
    return this.byId.get(id);
  }

  list(): PowerUpDefinition[] {
    return Array.from(this.byId.values()).sort((a, b) => a.priority - b.priority);
  }
}

function cardKey(card: Card): string {
  return `${card.rank}:${card.suit}`;
}
