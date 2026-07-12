# Nails by Izzy - Design Spec

Date: 2026-07-12

## Overview

A cute, single-page Hugo website showcasing Izzy's hand-painted press-on nail
sets. Pink, playful, Y2K teenage-girl aesthetic (reference: deco.beauty).
Interactive touches (sparkle animations, hover/tap zoom, lightbox) inspired by
natscafe.shop. Published to Cloudflare Pages at nailsbyizzy.com.

Not a shop. There is no online checkout. Visitors browse the gallery and reach
out by phone, email, or Instagram to order.

## Goals

- Showcase Izzy's nail-set designs beautifully on phones and desktop.
- Feel cute, fun, and interactive without being complicated.
- Be dead simple to maintain: add a design by dropping a photo in a folder;
  edit all text in one config file.
- Deploy automatically to Cloudflare Pages on every push to `main`, mirroring
  the existing `whoownsthecode` pipeline.

## Non-Goals (YAGNI)

- No online store, cart, checkout, or payments.
- No per-design price tags or "order this" buttons (too much maintenance as
  sets come and go). Pricing is a single note.
- No filterable categories or multiple gallery sections (may revisit later).
- No contact form or backend. Contact is direct: phone, email, Instagram.
- No CMS. Content is files in the repo.

## Site Structure

Single scrolling page (`/`) with these sections, top to bottom:

1. **Hero** - logo/name "Nails by Izzy", a sparkly tagline, cute floating
   decorations (hearts/sparkles), and a "See my nails" button that
   smooth-scrolls to the gallery.
2. **Gallery** - responsive photo grid of nail sets, newest first. Hover/tap
   gives a soft zoom; clicking opens a lightbox to view the design large with
   its name. Seeded with 16 sets cropped from the provided mashup.
3. **Pricing note** - one short line (e.g. "Sets $15, extra sparkle $20").
4. **About Izzy** - a short, cute blurb and an optional photo.
5. **Contact** - large tappable buttons: Call, Email, Instagram. On phones
   these use `tel:` and `mailto:` so they dial/compose directly.

A small footer with a copyright line.

## Content Model

### Gallery = drop a photo in a folder

- Photos live in `assets/gallery/` (Hugo asset pipeline, so Hugo generates
  responsive thumbnails and the lightbox full-size image).
- The template globs the folder and renders every image, sorted by filename
  descending (newest first). To control order, prefix filenames with a number
  (e.g. `16-busy-bee.jpg`).
- The caption/name shown in the lightbox is derived from the filename:
  strip a leading `NN-` order prefix, replace hyphens with spaces, and
  title-case (e.g. `16-busy-bee.jpg` -> "Busy Bee").
- Adding a design: drop a `.jpg`/`.png` into `assets/gallery/`. No config edit,
  no template edit.

### All text lives in `config.toml`

Under `[params]`:

- `artistName`, `tagline`, `heroButtonText`
- `aboutTitle`, `aboutText`, optional `aboutPhoto`
- `pricingNote`
- `phone`, `email`, `instagram` (handle) and `instagramUrl`
- `footerText`

Placeholders are used where the real values are not yet known (phone, email,
Instagram handle). These are clearly marked so they are easy to find and
replace.

## Technical Design

### Theme

A small custom theme vendored into the repo root (no external theme under
`themes/`), same convention as `whoownsthecode`:

- `layouts/index.html` - the single page; includes the section partials.
- `layouts/partials/` - `hero.html`, `gallery.html`, `about.html`,
  `contact.html`, `footer.html`, plus `head.html` for meta/CSS/fonts.
- `layouts/baseof.html` - minimal HTML skeleton.
- `assets/css/style.css` - hand-written CSS. Pink Y2K palette via CSS custom
  properties. No Sass pipeline required (keeps parity with the pinned CI Hugo
  version and avoids build surprises). Served via Hugo's asset pipeline
  (fingerprinted) or as a static include; hand-written CSS, edited directly.
- `assets/js/app.js` - vanilla JS only: floating sparkles/hearts in the hero,
  and the gallery lightbox (open/close, caption, keyboard Esc, click-outside).
  No framework, no build step.

### Image handling

- The gallery uses Hugo's image processing (`resources.GetMatch` /
  `.Resize`) to produce grid thumbnails and a larger lightbox image, so the
  browser never downloads full-resolution originals in the grid.
- Seed images are produced by cropping the provided `nails.png` (1536x1024,
  4x4 grid of 16 sets). Each cell is cropped and surrounding whitespace
  trimmed, yielding 16 tidy product images placed in `assets/gallery/`. This
  is a one-time asset-prep step (done with a Node/sharp script in scratch,
  not part of the Hugo build).

### Config-driven rendering

Partials read from `[params]`; there is no hardcoded copy in templates. This
mirrors the `whoownsthecode` approach where `config.toml` is the control panel.

## Deployment

Mirror `whoownsthecode` exactly:

- `.github/workflows/deploy-to-cloudflare.yml` runs on push to `main`
  (ignoring `.github/workflows/**`-only changes).
- Uses `peaceiris/actions-hugo` with `extended: true`, Hugo version pinned
  (match the locally installed extended series; document the pin).
- Build: `hugo --minify` into `./public`.
- Deploy: `npx wrangler pages deploy public --project-name=nailsbyizzy
  --branch=main`.
- Requires GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

There is no Worker for this site (unlike `whoownsthecode`), so only the
site-deploy job is present.

### One-time setup (done by the repo owner, documented in CLAUDE.md/README)

1. Create a Cloudflare Pages project named `nailsbyizzy`.
2. Add `CLOUDFLARE_API_TOKEN` (Pages: Edit) and `CLOUDFLARE_ACCOUNT_ID` as
   GitHub repo secrets.
3. Point `nailsbyizzy.com` (and `www`) at the Pages project.
4. Set `baseURL` in `config.toml` to `https://nailsbyizzy.com`.

## Repo Files

- `config.toml` - site config + all content params.
- `layouts/`, `assets/` - the custom theme.
- `assets/gallery/` - the 16 seed nail-set images (plus future additions).
- `.github/workflows/deploy-to-cloudflare.yml` - CI deploy.
- `.gitignore`, `.gitattributes` - adapted from `whoownsthecode`.
- `CLAUDE.md` - guidance for future work (adapted from `whoownsthecode`,
  trimmed to this site's scope).
- `README.md` - one-liner + setup pointer.

## Success Criteria

- `hugo --minify` builds with no errors on the pinned extended version.
- Local `hugo server` renders: hero with sparkles, a 16-image gallery grid,
  working lightbox, pricing note, about, and tappable contact buttons.
- Looks cute and correct on a narrow (phone) viewport and a wide viewport.
- Contact `tel:`/`mailto:`/Instagram links are correct (placeholders clearly
  marked until real values provided).
- Pushing to `main` triggers the workflow and deploys to Cloudflare Pages
  (after the owner completes the one-time setup).

## Open Design Decisions (mockups for user)

To be presented as visual mockups before/while building:

- **Palette direction** - bubblegum pink vs. pastel-multi (deco purple accent)
  vs. soft rose/cream.
- **Hero style** - big playful display-type logo vs. photo-forward hero.
- **Display font** - which cute display typeface for the logo/headings.
- **Gallery card style** - rounded "polaroid" cards vs. clean tiles vs.
  sticker-style with playful borders.
