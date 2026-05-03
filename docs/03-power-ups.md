# 3. The Power-Up Vault

The catalog of digital effects triggered by scanned cards. Power-Ups are mapped to ranks/suits (standard deck) or QR markers (premium decks).

> **Note:** This document captures the curated **Top 100** concept. The first 53 are detailed below; the remaining 47 are summarized in *Section D*.

---

## Category A: Turn & Flow Control

| #  | Name           | Effect                                                                  |
| -- | -------------- | ----------------------------------------------------------------------- |
| 1  | **Lockup**     | The next player is skipped for 2 rounds.                                |
| 2  | **Reverse**    | Reverses the direction of play.                                         |
| 3  | **Turbo**      | The current player takes an extra turn immediately.                     |
| 4  | **Stall**      | No power-ups can be played for 3 rounds.                                |
| 5  | **Chain**      | Playing a card of the same suit lets you play a third card.            |
| 6  | **Quick-Draw** | Everyone must scan a card within 5 seconds or lose a turn.              |
| 7  | **Mirror**     | Reflects the last power-up played back at the sender.                   |
| 8  | **Vortex**     | Everyone passes their physical hand to the left.                        |
| 9  | **Time Warp**  | Revert the game state to 2 turns ago.                                   |
| 10 | **Freeze**     | One specific player cannot scan cards until they answer a challenge.    |

---

## Category B: Collaboration & Alliances (Dual Mode)

| #  | Name                | Effect                                                              |
| -- | ------------------- | ------------------------------------------------------------------- |
| 11 | **Gift Boost**      | Assign a "Double Play" (2 cards) to a teammate or ally.             |
| 12 | **Shield**          | Protect an ally from the next negative power-up.                    |
| 13 | **Link**            | Whatever happens to you also happens to your linked partner.        |
| 14 | **Trade-Off**       | Swap one card with your partner via the app interface.              |
| 15 | **Synergy**         | If you and your partner play the same color, the next opponent skips.|
| 16 | **Tandem**          | Both scan a card; the highest value triggers a "Super Move."        |
| 17 | **Sacrifice**       | Take a penalty so your partner gains a Power-Up.                    |
| 18 | **Secret Handshake**| Only you and your partner see a "hidden card" on your phones.       |
| 19 | **Rally**           | If a teammate is low on cards, the other grants 2 from the deck.    |
| 20 | **United Front**    | Opponents cannot use "Lockup" on this team for 3 rounds.            |

---

## Category C: Topic-Specific & Social (Updated Rules)

| #     | Name / Rule                  | Effect                                                                                                  |
| ----- | ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| 21–40 | **Mobile Knowledge Base**    | Challenges appear on the phone. *Music Master* is replaced by **"Lyric Weaver"** — finish the line/rhythm using local audio. |
| 41–43 | **Topic Selection**          | Host picks 5 topics at start (Tech, History, Pop Culture, Math, Art). Scanning these triggers topic trivia. |
| 44    | **Dynamic Context**          | Challenges are generated based on the chosen game theme.                                                |
| 45    | **Charades 2.0**             | Phone displays a word; player acts it out, others guess to earn a card.                                 |
| 46    | **Identity**                 | A "Who Am I?" digital card assigned to a player's phone.                                                |
| 47    | **Topic Swap**               | Halfway through, the Dungeon Master can force a topic change.                                           |
| 48    | **Veto**                     | Players vote on the phone to cancel a challenge.                                                        |
| 49    | **Bounty**                   | First person to answer a topic question gets a Boost.                                                   |
| 50–52 | **Comfort Updates**          | Replaced "Physical Forfeit" with **Digital Dare** (e.g., funny profile name) or **Point Tax**.          |
| 53    | **The Gallery**              | Results and photos saved to a private in-app session gallery (not a projector).                         |

---

## Category D: Reserve Vault (Concepts 54–100)

Includes (non-exhaustive):

- **Heal** — restore a lost turn
- **Double Points** — next scored card counts twice
- **Card Spy** — peek at one opponent's hand on your phone
- **Suit Silence** — one suit becomes inert for 2 rounds
- **Gravity** — pulls a card from each opponent into a shared pile
- **Multiplier** — stacks with the next Power-Up for compounded effect
- **Echo** — repeats the previous Power-Up one round later
- **Shuffle** — randomizes the order of the next 3 turns
- **Bank** — store a Power-Up for later use
- **Trap** — hidden card; triggers when an opponent scans a specific suit
- *...and 37 more to be finalized in Phase 2 design.*

---

## Power-Up Engine Notes

- Each Power-Up is a **pure function** of `(gameState, trigger) → newGameState + events`
- Effects are versioned for replay/Time Warp support
- Power-Ups are **data-driven** (JSON definitions) so designers can author new ones without code changes
- Stacking and conflict resolution handled by a deterministic priority queue
