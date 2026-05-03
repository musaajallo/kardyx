# 1. Concept Note

## Vision

**Kardyx** is a global hybrid gaming platform that bridges the tactile satisfaction of physical card games with the infinite dynamism of a digital backend. It is a **Living Card Game (LCG)** ecosystem where the cards in your hand are merely the interface for an evolving digital engine.

## MVP Core Concept

The goal is a low-barrier entry using **Computer Vision (CV)** to recognize standard decks, eventually scaling to custom QR-coded premium decks and character-based expansions.

### The Physical Element

- Users play with **standard 52-card decks**
- Custom **"Kardyx Power-Up" decks**
- Unique **character cards** (e.g., "Musa's Turtle")

### The Digital Element

A mobile app acts as the **Game Engine**:

- Scans cards to trigger events
- Tracks scores and game state
- Manages team logic (alliances, dual mode)
- Hosts the **Dungeon Master** interface

### Scalability Principle

A strictly **JavaScript-based architecture** ensures high performance and cross-platform compatibility. Offline-first CV keeps the experience playable in low-connectivity regions (e.g., The Gambia) while syncing to global infrastructure when online.

## Player Journey (MVP)

1. **Open app** → create or join a Game Party
2. **Invite friends** via WhatsApp / SMS / in-app alert
3. **Choose mode** — Democratic, Dungeon Master, Dual, or Tournament
4. **Pick topics** (5 categories: Tech, History, Pop Culture, Math, Art, etc.)
5. **Scan cards** with the phone camera as you play physically
6. **Trigger Power-Ups** — digital effects activate based on the scanned card
7. **Complete challenges** — trivia, charades, lyric weaver, etc.
8. **Climb rankings** — global leaderboards persist across sessions

## Core Differentiators

- **Hybrid play** — neither pure digital nor pure physical
- **Offline-first CV** — works without constant connectivity
- **Modular Power-Ups** — 100+ effects, expandable via custom decks
- **Governance modes** — Democratic vote vs. DM authority
- **Comfort-first design** — digital dares replace physical forfeits
