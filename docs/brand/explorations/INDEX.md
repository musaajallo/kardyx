# Kardyx · Brand Exploration · Phase 0

Three differentiated visual directions for Kardyx. Each is a self-contained HTML brand specimen — open in a browser to view.

## How to View

```bash
xdg-open A-atlas.html        # or just double-click in your file manager
xdg-open B-living-cards.html
xdg-open C-quiet-game.html
```

Each file shows: logo + wordmark, color system, typography specimen, motion principle (live CSS animation), and three sample app screens (Round / Scan / Rankings).

---

## Direction A — Atlas

> *A federation of play. The cards are credentials; the rules are a constitution.*

| Attribute | Value |
|---|---|
| **School** | Information Architecture (Pentagram / Manuel Lima) |
| **Logo** | Stamped geometric K-mark inside a square frame, single ochre dot accent |
| **Wordmark** | KARDYX in Space Grotesk 700, the Y in clay |
| **Palette** | Ink `#0F1A1A` · Clay `#C04A1A` · Cream `#F2EBDD` · Slate `#6B7280` · Verdigris `#2A5550` |
| **Display type** | Newsreader (warm serif) |
| **Product type** | Space Grotesk |
| **Metadata type** | JetBrains Mono |
| **Motion** | *Stamp and settle* — cards drop with weight, slight settle, no bounce. `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| **Voice** | Confident, archival, editorial. "Round 03 · KX-7240" |
| **Vibes** | Confident · Archival · Modular · Editorial · Federation · Banjul-meets-global |
| **Best for** | Enterprise legitimacy, tournaments, credibility with partners and sponsors |
| **Tradeoffs** | Could read as "serious" or "corporate" if not balanced with character art in product |

---

## Direction B — Living Cards

> *A storybook that breathes. Every card is a tiny performer, the deck is the cast.*

| Attribute | Value |
|---|---|
| **School** | Experimental Avant-garde (Sagmeister / Wolff Olins) |
| **Logo** | Hand-rendered seal + lowercase wordmark, slightly off-axis letters |
| **Wordmark** | Fraunces 900 with mixed colors: K in ink, A in rust italic, Y in saffron, X in mint |
| **Palette** | Ink `#1A1614` · Rust `#D85A2C` · Cream `#F5EBD8` · Mint `#6FCB91` · Saffron `#F5B935` |
| **Display type** | Fraunces (warm humanist serif with personality) |
| **Body type** | Inter |
| **Flavor type** | Caveat (handwritten, for character lines and party invites) |
| **Motion** | *Cards have feelings* — bouncy springs, slight overshoot, like placing stickers. `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| **Voice** | Warm, character-led. *"You'll need allies for this round, friend."* |
| **Vibes** | Storybook · Character-led · Hand-rendered · Warm rebellion · Saturday-afternoon energy · Risograph print |
| **Best for** | Character IP (Musa's Turtle), social parties, the "block-party in Banjul" energy |
| **Tradeoffs** | Could feel less "enterprise" — needs careful application to look credible to partners |

---

## Direction C — Quiet Game

> *The hand is silent. The deck breathes. The player listens.*

| Attribute | Value |
|---|---|
| **School** | Eastern Philosophy (Kenya Hara / Muji / Aesop) |
| **Logo** | Single brushed enso ring with a small ochre K nested inside |
| **Wordmark** | "kardyx" lowercase, Cormorant 300 with generous letter-spacing |
| **Palette** | Paper `#FAF7F2` · Mist `#E8E2D4` · Ochre `#C18A4A` · Sumi-soft `#3A332A` · Sumi `#1F1B16` |
| **Display type** | Cormorant Garamond (light, breathing serif) |
| **Body type** | Inter Light |
| **Ceremony type** | Noto Serif JP (for character names, season markers, rituals) |
| **Motion** | *Settle, like ink onto paper* — slow blur-in, no bounce, no overshoot. `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| **Voice** | Reverent, observant. *"A round of Kardyx is a kind of attention."* |
| **Vibes** | Stillness · Ceremony · Restraint · Attention · Paper-ink-breath · Slow play |
| **Best for** | Differentiation in a loud market; could become the "thoughtful card game" niche |
| **Tradeoffs** | Risks reading as too quiet for a party game — best paired with Living-Cards-style energy in actual play moments |

---

## Decision Frame

Before picking, ask yourself the three questions in order:

1. **Who is the target hero customer?**
   - Tournament player / partner / sponsor → **Atlas** weights heaviest
   - The friend group around a table on a Saturday → **Living Cards** weights heaviest
   - The thoughtful gamer who wants a different kind of game → **Quiet Game** weights heaviest

2. **What does the physical card art need to feel like?**
   - Federation-issued credential → Atlas
   - Hand-illustrated character (Musa's Turtle as a real personality) → Living Cards
   - Restrained, almost koan-like → Quiet Game

3. **Where will the brand live in 5 years?**
   - Globally credible across cultures → Atlas
   - West African cultural export, character licensing → Living Cards
   - Premium niche, design-press attention → Quiet Game

You can also **mix**: pick a primary and borrow from a second. Common moves:
- Atlas + Living Cards: structured federation, character-led card art
- Atlas + Quiet Game: structured federation, ochre-only accent (the most refined option)
- Living Cards + Quiet Game: warm storytelling held by ceremonial restraint

---

## Next Steps After You Pick

1. Tell me **A**, **B**, **C**, or a hybrid (e.g. "A's structure + B's color")
2. I'll lock the chosen direction into design tokens in `packages/tokens/`
3. Then run a 5-dimension expert review (philosophy, hierarchy, execution, function, innovation) and a Fix list before signing off
4. Output the locked brand kit to `docs/brand/` (logo files, color spec, type spec, motion principles, voice guide)
