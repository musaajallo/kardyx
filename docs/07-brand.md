# 7. Brand Strategy & Design System

> **Status:** Greenfield. Brand exploration is **Phase 0** — must complete before MVP UI work begins.

## Why Brand Comes First

Kardyx spans physical decks, mobile, web, and (eventually) merchandise. If the visual language isn't locked early, every surface drifts and re-skinning becomes a permanent tax. Brand consistency is a hard requirement, not a nice-to-have.

## Brand Pillars (Working Draft)

To be refined during the exploration phase. Initial direction:

- **Tactile** — the product fuses physical and digital; visuals should feel material, not flat
- **Playful but credible** — fun without being childish; this is an enterprise-grade platform
- **Globally legible** — works in The Gambia, Lagos, London, and Tokyo
- **Character-forward** — characters like *Musa's Turtle* are first-class brand assets

## Phase 0 — Brand Exploration (Pre-MVP)

Use the **`huashu-design`** skill to generate 3–5 differentiated visual directions before committing.

### Deliverables

1. **3 differentiated design directions** — distinct philosophies (e.g., Pentagram-style information architecture vs. Field.io motion vs. Sagmeister experimental)
2. **Logo concepts** — wordmark + symbol exploration
3. **Color systems** — primary, secondary, semantic (success/warning/danger)
4. **Typography pairings** — display + body, with non-Latin coverage (consider French, Wolof orthography in extensions)
5. **Motion principles** — how cards flip, how Power-Ups feel, easing curves
6. **Character design language** — proportions, line weight, color treatment for the character roster

### Decision Process

- Generate all directions in parallel (Huashu-Design supports 3 visual demos at once)
- Pick one; apply to a real Power-Up reveal mockup
- Run a 5-dimension expert review (philosophy, hierarchy, execution, function, innovation)
- Lock the chosen direction into design tokens

## Design Tokens — Single Source of Truth

```
packages/tokens/
├── source/
│   ├── color.json
│   ├── spacing.json
│   ├── typography.json
│   ├── motion.json
│   ├── radius.json
│   └── shadow.json
└── build/                # Generated outputs
    ├── tailwind.config.js   # → apps/web
    ├── nativewind.config.js # → apps/mobile
    └── figma-variables.json # → Figma file
```

**Tooling:** [Style Dictionary](https://styledictionary.com/) transforms a single token source into platform-specific outputs. One change in `color.json` updates Tailwind, NativeWind, and Figma.

### Naming Convention

```
color.brand.primary.500
color.semantic.success.fg
spacing.6              // 24px on web, 24dp on mobile
motion.ease.cardFlip   // shared cubic-bezier for card animations
```

## Component Library

```
packages/ui/
├── primitives/           # Button, Input, Card, Dialog (shadcn-derived)
├── game/                 # PowerUpBadge, CardFace, ScanFrame, PartyAvatar
└── motion/               # CardFlip, PowerUpReveal, ScoreTicker
```

- **Web:** shadcn/ui as base + Tailwind classes from tokens
- **Mobile:** **NativeWind** lets you write the same Tailwind classes in React Native
- **Animation:** Framer Motion (web) + Reanimated 3 (mobile), driven by shared `motion` tokens

This means a `<Button variant="primary">` looks and feels identical on both platforms — same spacing, color, radius, and motion.

## Figma as Design Source of Truth

- **One Figma file** mirrors `packages/ui` and `packages/tokens`
- **Figma Variables** synced from token outputs via `figma-generate-library` skill
- **Code Connect** maps Figma components to React components → designers see the actual code snippet for what they design
- Designers and engineers reference the same component names

## Voice & Tone

To be finalized in Phase 0. Initial direction:

- **Direct, warm, confident** — like a host running a great game night
- **No corporate jargon** — "Start a Party" not "Initiate a Session"
- **Bilingual-ready** — copy authored to translate cleanly into French, Wolof, Mandinka
- **Character voices** — each character (Turtle, etc.) has a distinct persona used in flavor text

## Brand Asset Repository

```
docs/brand/
├── logo/
│   ├── primary.svg
│   ├── monochrome.svg
│   ├── icon.svg
│   └── usage-rules.md
├── colors/
│   └── palette.pdf
├── typography/
│   └── specimen.pdf
├── motion/
│   └── principles.md
├── characters/
│   ├── musas-turtle/
│   └── (additional)
└── voice-and-tone.md
```

## Brand Consistency Enforcement

To prevent drift over time:

- **Lint rule** — block hardcoded colors / spacing in `apps/*`; only token references allowed
- **Visual regression tests** — Chromatic on web, Storybook + Percy or screenshot tests on mobile
- **Design review checkpoint** — every PR touching `packages/ui` requires design sign-off
- **Quarterly brand audit** — cross-platform screenshot diff against the locked design system
