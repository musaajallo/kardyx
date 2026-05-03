# 4. Platform Features & User Experience

## Account & Onboarding

- Email / phone / OAuth sign-up
- Player profile with avatar, region, and display name
- **Global rankings** — ELO-style leaderboard per game mode
- Friends list and recent-players quick-invite

## Game Parties

A "Party" is a session container that holds players, mode, topics, and game state.

### Invite Channels

- **WhatsApp** — deep-link share with a join code
- **SMS** — fallback for offline-notification scenarios
- **In-App alert** — push notification to friends list
- **QR join code** — scan to join nearby parties

## Game Modes

### Dual Mode (2v2)

- Pair-based logic with shared Power-Up pool
- Alliance-specific cards (Shield, Link, Synergy) become active
- Communication channel between teammates (Secret Handshake)

### Tournament Mode

- Bracket-style elimination
- Configurable round timers and Power-Up restrictions
- Spectator view for non-active players

## Governance Modes

### Democratic Mode

- Rule changes and Power-Up assignments are **voted on** via the app
- Veto Power-Up applies during play
- Best for friend groups and casual sessions

### Dungeon Master (DM) Mode

- One user controls the rules with elevated permissions
- DM can:
  - Force topic changes
  - Trigger "Breaks"
  - End rounds manually
  - Override Power-Up resolutions
- Best for streamed sessions, family game nights with a host, and storytelling-heavy games

## Custom Card Designer

A backend tool to author personalized cards.

**Example workflow:**

1. Pick a base card — e.g., *"Musa's Turtle" = 8 of Hearts*
2. Modify stats — promote to *10 of Clubs*
3. Assign a custom Power-Up (or chain of effects)
4. Save as part of a personal deck or share with the community

### Use Cases

- Personalized character cards (mascots, family members)
- Branded decks for events and sponsors
- Community-designed expansions

## Session Gallery

- Photos and highlights captured during play
- **Private to the party** by default
- Optional share to player profile or social

## Notifications

- Friend joined a party
- Your turn / Quick-Draw timer
- Tournament bracket advancement
- Weekly ranking digest
