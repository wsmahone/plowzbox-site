# PlowzBox product image assets

> 2026-07-17 brand/imagery pass: `plowzbox-nuc.svg` regenerated (outlined lid
> wordmark + brushed texture), `plowzbox-og.png` re-rasterized, and NEW assets
> added: `plowzbox-shelf.svg`, 11 framed real product screenshots
> (`shot-*.png`), 8 spot illustrations (`spot-*.svg`), plus the brand set in
> `../brand/`. Placement instructions, alt text, and drop-in snippets for ALL
> of it: see **/IMAGERY.md** (repo root).
>
> 2026-07-17 cleanup pass: `plowzbox-nuc.png` DELETED (it was a stale v1-lid
> raster; nothing on the site referenced it). If a raster fallback is ever
> needed again, re-rasterize from the current `plowzbox-nuc.svg`.

| File | Size | Use |
|---|---|---|
| `plowzbox-nuc.svg` | ~11 KB, viewBox `195 330 745 480` (~1.55:1) | **THE hero asset.** Inline it into the hero (or `<img>`). Vector, crisp at any size. Transparent background; includes its own contact shadow + floor reflection. Tuned for dark backgrounds (`--chq-green-900` #123324 / `--chq-green-950` #0b241a); verified legible on light #fafaf7 too. |
| `plowzbox-og.png` | 1200x630, opaque | Social share card (`og:image` / `twitter:image`, `summary_large_image`). Supersedes `assets/og-image.png`. Copy on card: H1 "Never miss another job." + approved caption "One box. Your whole front office." (no em-dashes, per COPY.md rule). |

## Recommended hero usage

Inline `plowzbox-nuc.svg` directly in the hero markup. All internal ids are
prefixed `pbxn-` and all gradients/masks are self-contained, so inlining next
to other SVGs (logo, mark, favicon) is collision-safe. Suggested display width
560-760px on desktop; the built-in reflection means you should NOT add an
extra CSS drop-shadow under it.

The wordmark on the device top and the OG card headline use the system font
stack (no webfonts), consistent with tokens.css section 3.

## Use-case / section illustrations (uc-*.svg)

Flat brand diagrams on a self-contained dark-pine panel (#143726 to #102b1f gradient,
#2a4a39 border, rx 26). The panel means each file renders identically on dark heroes and
light sections; verified on both. No external resources, system font stack only. Each
file's internal ids are uniquely prefixed and gradients are self-contained, so they are
safe to inline next to each other and next to `plowzbox-nuc.svg`.

| File | viewBox | id prefix | What it shows / where used |
|---|---|---|---|
| `uc-inbox-channels.svg` | `0 0 760 440` | `ucic-` | "Four ways in, one place to answer": missed call, text, email, booking page flow into the box, out to one approval queue. Used in the `pages/use-cases.html` hero. |
| `uc-approve-tap.svg` | `0 0 420 440` | `ucap-` | The one-tap approval: phone with a dashed DRAFT card, Edit/Approve pills, tap rings, "Sent after your tap". Used in the use-cases "pattern" band. |
| `uc-data-shield.svg` | `0 0 420 440` | `ucds-` | Data sovereignty: the box + padlock inside a shield, crossed-out "no cloud copy" cloud, FDE + no-inbound check line. Used in the use-cases "pattern" band. |
| `uc-weather-reflow.svg` | `0 0 760 440` | `ucwr-` | Weather reflow: Mon-Fri board, rain over Tuesday, at-risk jobs (dashed) sliding to Wednesday, single "Approve new plan" pill. Used in use-cases scenario 02; also fits `pages/scheduling.html`. |

Copy rules honored inside the SVGs: no em-dashes, no invented stats, approval-first
framing ("nothing moves until you say so").

## Render notes

Single hand-built axonometric 3/4 view: three planar faces via matrix
transforms, key light upper-left (top-face gradient + diagonal sheen), rim
light on the back edge, near-corner specular strip, brand-green status LED
(the only bright color) with glow + floor echo, USB/USB-C ports, side vents,
ethernet hint, lid seam, power button. Reflection is two face-matched fading
quads (seamless at the contact edge), not a naive vertical flip.
