# 11. Offline & LAN Multiplayer

> Kardyx must work meaningfully without internet — for solo play, owned content, and same-room multiplayer. Online unlocks new content, global ranking, and matchmaking.

## Connectivity Modes (Recap)

| Mode               | Internet | Multiplayer            | Content Access            |
| ------------------ | -------- | ---------------------- | ------------------------- |
| **Online**         | Yes      | Global + LAN           | All purchased + free      |
| **LAN Multiplayer**| No       | Same-network only      | Owned + free              |
| **Solo Offline**   | No       | None                   | Owned + free              |

## Offline Solo Play

- All free Power-Ups + decks bundled with the app
- Purchased content cached locally on first download (encrypted at rest with device key)
- AI opponent runs entirely in-app using the same `packages/game-engine` deterministic state machine
- Game results queued locally; sync to ranking when online

### Local Storage

- **Mobile:** SQLite via Expo SQLite for game history; FileSystem for cached art
- **Web PWA:** IndexedDB for state; Cache API for assets via Service Worker
- **Encryption at rest:** content keys derived from user account; stored in SecureStore (mobile) / Web Crypto Subtle (web)

## LAN Multiplayer Architecture

```
┌────────────────────────────────────────────────────────┐
│  Local WiFi Network or Hotspot                         │
│                                                        │
│   ┌────────────────────┐                               │
│   │   HOST PHONE       │   advertises via mDNS         │
│   │   ┌──────────────┐ │   _kardyx._tcp.local          │
│   │   │  Embedded    │ │                               │
│   │   │  Fastify +   │ │                               │
│   │   │  Socket.io   │ │ ◀── peer connects via         │
│   │   └──────────────┘ │     Socket.io (LAN IP)        │
│   └─────────┬──────────┘                               │
│             │                                          │
│   ┌─────────▼──────────┐    ┌────────────────────┐     │
│   │   PEER PHONE       │    │   PEER PHONE       │     │
│   │   discovers via    │    │   discovers via    │     │
│   │   mDNS, joins      │    │   mDNS, joins      │     │
│   └────────────────────┘    └────────────────────┘     │
└────────────────────────────────────────────────────────┘
```

### How It Works

1. **Host election:** the player who creates the party is the host
2. **Embedded server:** host phone runs an in-process Fastify + Socket.io server bound to `0.0.0.0:<port>`
3. **Discovery:** mDNS broadcast via `react-native-zeroconf` advertises `_kardyx._tcp.local` with metadata (party name, host nickname, player count)
4. **Pairing:** host displays a 6-digit code; peer enters it to authenticate
5. **Game state:** authoritative on host, syncs to peers via WebSocket diffs
6. **Sync to cloud:** when host regains internet, queued events flush to Postgres and rankings update

### Why a Single Authoritative Host (No CRDT)

- Game is **turn-based** — at most one mutation in flight at a time
- Conflict resolution would add complexity for no real benefit
- If the host disconnects, the session is preserved on disk and can be resumed when host returns or transferred to a peer

### Host Migration (Stretch Goal — Phase 5)

If the host disconnects mid-game:

- Peers detect via WebSocket disconnect + missing mDNS announcements
- A peer with the most recent known state is elected new host
- New host re-advertises mDNS; remaining peers reconnect
- Edge cases (network split, simultaneous reconnects) handled by Lamport timestamp on state snapshots

## Bluetooth Fallback (Phase 5+ Stretch)

For environments with no shared WiFi / hotspot:

- React Native BLE for low-bandwidth peer-to-peer
- Send only state diffs, not full snapshots
- Limited to small parties (2–4 players) due to BLE throughput
- CV results compress to a few bytes per scan; viable

## Sync Strategy When Online Returns

```
Local event queue (durable, ordered)
        │
        ├─ Game results        ─▶ POST /sessions/sync
        ├─ Audit / telemetry   ─▶ POST /telemetry/batch
        ├─ Photos (opt-in)     ─▶ Upload to R2
        └─ Purchase intents    ─▶ Re-attempt with idempotency keys
```

- Idempotency keys ensure retries are safe
- Server is the merge authority for ranking, but session results are append-only (no merge conflicts possible)
- User sees "Syncing X items" indicator with retry on failure

## Content Licensing & DRM-Lite

- All content has an entitlement check on load (online + cached)
- Owned content remains playable offline indefinitely
- Periodic online entitlement refresh (every 30 days) — if user fails to refresh in 60 days, premium content is locked until they reconnect once
- Free content has no expiration

## Offline Update Strategy

- App OTA updates from EAS happen only when online
- Old clients gracefully refuse to sync if their game-engine version is too old (server returns 426 Upgrade Required)
- Game-engine versioning is part of every state snapshot

## Failure Modes & UX

| Scenario                             | Behavior                                                            |
| ------------------------------------ | ------------------------------------------------------------------- |
| User goes offline mid-online game    | Switch to local-only mode; warn that ranking won't apply            |
| Host's phone crashes during LAN game | Auto-resume from disk on relaunch; peers reconnect                  |
| Peer disconnects from LAN            | Player marked AFK; can rejoin within timeout                        |
| Cellular data only (no WiFi)         | Hotspot prompt; or fall back to BLE (Phase 5)                       |
| Premium content past refresh window  | Locked with a clear "Reconnect to unlock" CTA                       |

## Testing Strategy for Offline / LAN

- **Airplane-mode test suite** — automated runs of solo and AI matches with networking disabled
- **Multi-device LAN harness** — 4 simulators on a virtual LAN running scripted games
- **Connectivity churn tests** — random disconnect/reconnect during sync to verify idempotency
- **Performance:** LAN p95 round-trip target < 30ms (vs. < 100ms online)
