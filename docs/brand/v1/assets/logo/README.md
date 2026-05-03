# Logo Drop Zone

The client (Musa) is providing the Kardyx logo. Drop files here and the rest of the brand system will pick them up.

## Required Files

| Filename | Purpose | Format |
|---|---|---|
| `primary.svg` | Default usage — full-color on paper background (`#FAF6EC`) | SVG (vector) |
| `reverse.svg` | Light variant for ink/dark backgrounds | SVG (vector) |
| `mono.svg` | Single-color, no fills — for embossing, single-ink print, watermarks | SVG (vector) |
| `mark.svg` | Symbol only, no wordmark — for favicons, app icons | SVG (vector) |
| `primary@2x.png` | Raster fallback for non-SVG contexts (slack avatars, etc.) | PNG, transparent bg |
| `mark-1024.png` | App icon source — exactly 1024×1024 with safe-area | PNG, opaque |

## Optional Files

- `lockup-horizontal.svg` — wordmark to the right of the mark
- `lockup-vertical.svg` — wordmark stacked under the mark
- `mark-on-dark-1024.png` — app icon variant for dark mode App Store / Play Store

## Style Considerations (so the logo lives well in this brand)

The brand v1 system is built around:

- **Paper** (`#FAF6EC`) and **ink** (`#1A1714`) as the workhorse pair
- **Ochre** (`#C18A4A`) as the soft-brand accent (dividers, marks at rest)
- **Clay** (`#C04A1A`) as the high-energy accent (action, Power-Up moments)

Logos that work well in this system:
- Mostly ink with a single ochre or clay accent
- Geometric construction with optical-corrected joins
- Comfortable at 24px (smallest digital) up to 96mm (large print)

Logos that will fight the system:
- Multiple chromatic colors (more than 2)
- Soft gradients or photo elements
- Drop shadows, glow, or 3D effects
- Excessive detail that breaks below 32px

## After You Drop the Files

1. Update `docs/brand/v1/brand-spec.md` — mark the "awaiting logo" section as resolved and add clear-space + minimum-size rules
2. Update `docs/brand/v1/kardyx-brand-v1.html` — replace the dashed logo slot with `<img src="assets/logo/primary.svg">`
3. Run a 5-dimension expert review (philosophy / hierarchy / execution / function / innovation) on the integrated brand
4. Generate Style Dictionary build → `tailwind.config.js` + `nativewind.config.js`
5. Mirror the assets into Figma library
