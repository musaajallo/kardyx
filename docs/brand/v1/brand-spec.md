# Kardyx · Brand Spec v1.0

> **Locked:** 2026-05-03
> **Decision:** Hybrid of Direction A (Atlas) + Direction C (Quiet Game), with hand-illustrated character art layered into product moments.
> **Visual brief:** Globally credible federation, played at the kitchen table.

## 🎯 Core Assets (one-class citizens)

### Logo
- Status: **awaiting client-supplied design**
- Drop location: `docs/brand/v1/assets/logo/`
- Required variants:
  - `primary.svg` — full-color on paper background
  - `reverse.svg` — light variant for ink/dark backgrounds
  - `mono.svg` — single-color, no fills
  - `mark.svg` — symbol only (for favicons, app icons, watermarks)
- Format: SVG preferred (vector); 2× and 3× PNG exports for raster contexts
- Spec doc to deliver alongside logo:
  - Clear-space rules (recommend ≥ 1× cap-height of the K)
  - Minimum size for legibility (suggest 24px height for digital, 16mm for print)
  - Don'ts: no stretching, no fills with non-palette colors, no drop shadows

### Character Art
- Status: **roster TBD** — Musa's Turtle (8♥) is the anchor; additional characters to follow
- Style brief:
  - Sumi-style line work (hand-drawn, not vector-flat)
  - Watercolor wash in Brand v1 palette only
  - **One** chromatic accent per character (Ochre OR Clay, never both)
  - Character lives on cards and in flavor moments — never in chrome / nav / system UI
- Drop location: `docs/brand/v1/assets/characters/<name>/`
- Each character delivers: full-art, half-portrait, line-only mono, lore one-liner

### UI Reference Screens
- Spec includes 3 reference app screens — Round / Scan / Rankings — see `kardyx-brand-v1.html`

## 🎨 Color System (locked)

| Token | Hex | Role |
|---|---|---|
| `paper` | `#FAF6EC` | Default page background; the "ground" of every surface |
| `paper-deep` | `#F2EDE0` | Inset surfaces, cards, secondary panels |
| `mist` | `#E8E2D4` | Quiet dividers, disabled states, soft fills |
| `ink-soft` | `#3A332A` | Body text, secondary headings |
| `ink` | `#1A1714` | Primary text, headlines, dark surfaces |
| `slate` | `#6B7280` | System metadata, timestamps, rank numbers |
| `ochre` | `#C18A4A` | **Soft accent** — brand divider, marks, passive states, season indicators |
| `clay` | `#C04A1A` | **High-energy accent** — Power-Up triggers, primary CTA, the moment of action |
| `clay-deep` | `#8C3210` | Hover/pressed state for clay; emphasis in editorial italic |
| `verdigris` | `#2A5550` | Reserved — *only* for "saved / persisted / synced" semantic states |

### Color Discipline (rules)

- **Paper + ink + ink-soft do 80% of the work.** Everything else is restraint.
- **Ochre is the brand voice at rest.** Use for dividers, brand marks, passive UI signals.
- **Clay is the brand voice in action.** Reserve for Power-Up triggers and primary CTA only. If clay shows up, something is happening.
- **Forbidden:** bright reds, cool blues, electric greens, any gradient, any glow effects.
- **Even celebration is muted.** Tournament wins use ochre + a single clay flourish, not confetti.

## ✍️ Typography (locked)

| Use | Family | Weights |
|---|---|---|
| Display headlines | **Newsreader** | 600, 700 |
| Editorial body, lore | **Newsreader** | 400, 500 (italic for emphasis) |
| Product UI (buttons, labels, microcopy) | **Inter** | 400, 500, 600 |
| System metadata (codes, IDs, telemetry) | **JetBrains Mono** | 400, 500 |

### Type Discipline

- **Newsreader leads when the moment is a moment.** Power-Up reveal, headlines, character lore.
- **Inter leads when the user is acting.** Buttons, form fields, settings, microcopy.
- **Mono leads when the system is talking.** Party codes, round numbers, telemetry, status.
- **Italic is reserved for editorial emphasis** in Newsreader. Never italicize Inter or Mono.
- **No font stack mixing within a single line.** A heading is one family.

## 🎬 Motion (locked)

### Principle: *Settle, then stamp.*

A card arrives with a slight blur and downward drop, settles into place, then commits with a single decisive frame. No bouncy springs. No swooping fades.

### Curves & Timings

| Event | Duration | Curve |
|---|---|---|
| Card flip / reveal | 320ms | `cubic-bezier(0.22, 0.6, 0.2, 1)` |
| Power-Up trigger animation | 480ms | `cubic-bezier(0.22, 0.6, 0.2, 1)` |
| Round / screen transition | 600ms | `cubic-bezier(0.22, 0.6, 0.2, 1)` |
| Micro-interactions (button press, focus) | 120ms | `cubic-bezier(0.4, 0, 0.2, 1)` |

### Forbidden

- Bouncy springs (`cubic-bezier(0.34, 1.56, ...)` style)
- Long swooping fades (>800ms)
- Parallax decoration on scroll
- Looping idle animations (except the on-deck Power-Up shimmer at <0.05 opacity)

## 🗣️ Voice & Tone

### Principles

- **Direct without being curt.** "Your turn, Musa." not "Hey Musa, time to play!"
- **Warm without being chatty.** Acknowledge the player; don't perform enthusiasm.
- **Specific over clever.** "Fatou skips the next two rounds." not "Lockup activated!"
- **Bilingual-ready.** Copy authored to translate cleanly into French, Wolof, Mandinka, Pulaar — short sentences, plain verbs, no idioms.

### Examples

| ✅ Do | ❌ Don't |
|---|---|
| "Your turn, Musa. Scan a card to begin Round 03." | "Hey Musa! 🎉 Time to play your card now! Let's go!" |
| "Power-Up applied. Fatou skips the next two rounds." | "Boom! Lockup activated 🔒 — Fatou is OUT for 2 rounds!!" |
| "A round of Kardyx is a kind of attention." | "Kardyx is the funnest card game ever!" |
| "You'll need allies for this round, friend." | "GET YOUR SQUAD READY!!! 🤝🔥" |

### Character Lore Voice

When characters speak (flavor lines on cards), tone shifts to *quietly playful*:

- "Slow play, deep memory." — Musa's Turtle
- "Slow is also a strategy."
- "I remember the cards you played in Round 1."

## 🔧 Reference Frame

- **Editorial structure:** Pentagram, Manuel Lima, *Foreign Policy* magazine
- **Restraint:** Kenya Hara, Muji, Aesop
- **Color:** Charlotte Perriand mid-century palettes; West African earth pigments
- **Character art (target reference):** Yuko Shimizu's line work; Olamide Ogundele's hand-illustrated portraits; Comic Republic's character design

## 🚫 Rejected Aesthetics (don't drift here)

- Casino chrome (gold gradients, neon, baize green)
- Gen-Z gaming (purple gradient, glassmorphism, glow)
- "Modern startup" (Inter everywhere, soft shadows, rounded blue cards)
- AI-slop tropes (emojis as icons, decorative stats, every section gets an icon)

## 📁 Folder Structure

```
docs/brand/v1/
├── kardyx-brand-v1.html       # this spec, visualized
├── brand-spec.md              # this file (canonical source)
├── tokens.json                # Style Dictionary source
└── assets/
    ├── logo/                  # ← drop logo files here
    │   ├── primary.svg
    │   ├── reverse.svg
    │   ├── mono.svg
    │   └── mark.svg
    └── characters/
        └── musas-turtle/
            ├── full.png
            ├── portrait.png
            ├── line-mono.svg
            └── lore.md
```

## ✏️ Open Items

- [ ] Receive logo from client (primary, reverse, mono, mark)
- [ ] Commission Musa's Turtle character art per style brief
- [ ] Run 5-dimension expert review (philosophy / hierarchy / execution / function / innovation) once logo is in
- [ ] Generate `tokens.json` and Style Dictionary build → tailwind.config.js + nativewind.config.js
- [ ] Set up Figma library mirroring the spec
