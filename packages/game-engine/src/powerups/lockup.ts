import type { PowerUpDefinition } from '@kardyx/types';

export const LOCKUP: PowerUpDefinition = {
  id: 'lockup',
  name: 'Lockup',
  category: 'flow',
  description: 'The next player is skipped for 2 rounds.',
  priority: 100,
  resolve: ({ state, triggeredBy, triggeredAt }) => {
    const playerIds = Object.keys(state.scores);
    const currentIdx = playerIds.indexOf(state.currentPlayerId);
    const nextIdx = (currentIdx + (state.direction === 'cw' ? 1 : -1) + playerIds.length) % playerIds.length;
    const targetId = playerIds[nextIdx];

    const effectId = crypto.randomUUID();

    return {
      nextState: {
        ...state,
        effectsActive: [
          ...state.effectsActive,
          {
            id: effectId,
            powerUpId: 'lockup',
            appliedAt: triggeredAt,
            expiresAtRound: state.round + 2,
            targetPlayerId: targetId,
          },
        ],
      },
      events: [
        {
          id: crypto.randomUUID(),
          type: 'powerup.applied',
          playerId: triggeredBy,
          occurredAt: triggeredAt,
          payload: { powerUpId: 'lockup', targetId, durationRounds: 2 },
        },
      ],
    };
  },
};
