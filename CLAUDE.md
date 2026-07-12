# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The website for **nailsbyizzy.com**, a cute single-page showcase for Izzy's
hand-painted press-on nail sets. It is a **Hugo static site** deployed to
**Cloudflare Pages**. It is a portfolio/contact site, not a shop: there is no
cart, checkout, or payments. Visitors browse the gallery and order by phone,
email, or Instagram.

Design spec: `docs/superpowers/specs/2026-07-12-nailsbyizzy-design.md`.

## Commands

Run from the repo root:

```bash
hugo server          # local dev server with live reload
hugo --minify        # production build into ./public (what CI runs)
```

CI builds with Hugo **extended** (pinned in
`.github/workflows/deploy-to-cloudflare.yml`). Use the extended edition locally.

> **Version gotcha (inherited lesson):** CI pins a specific Hugo version. A
> build can succeed locally on a newer Hugo yet fail in CI if it uses template
> functions or config keys introduced after the pinned version. Stay within the
> pinned version's syntax, or bump the pin deliberately before relying on newer
> features. Deprecation warnings you see locally may not apply to the pinned CI
> version.

## Architecture

Single-page site. `config.toml` is the control panel: the artist name, tagline,
about text, pricing note, and contact details (phone, email, Instagram) are all
`[params.*]` entries, not hardcoded in templates.

- `layouts/index.html` assembles the page from section partials in
  `layouts/partials/` (`hero`, `gallery`, `about`, `contact`, `footer`).
- `layouts/baseof.html` + `layouts/partials/head.html` are the HTML skeleton
  (meta, fonts, CSS/JS wiring).
- The theme is a small custom theme **vendored into the repo root**
  (`layouts/`, `assets/`), not installed under `themes/` (that directory is
  unused). Edit the root `layouts/` and `assets/` directly.
- `assets/css/style.css` is hand-written CSS (pink Y2K palette via CSS custom
  properties). There is **no Sass pipeline**; edit the CSS directly.
- `assets/js/app.js` is vanilla JS only (hero sparkles + gallery lightbox). No
  framework, no build step.

### The gallery: drop a photo in a folder

- Nail-set photos live in `assets/gallery/`.
- `layouts/partials/gallery.html` globs that folder and renders every image,
  sorted by filename **descending** (newest first). Hugo image processing makes
  the grid thumbnail and the larger lightbox image, so originals are not served
  full-size in the grid.
- The caption/name is derived from the filename: a leading `NN-` order prefix
  is stripped, hyphens become spaces, and the result is title-cased
  (`16-busy-bee.jpg` -> "Busy Bee").
- **To add a design:** drop a `.jpg`/`.png` into `assets/gallery/`. No config
  or template edit needed. To control order, prefix the filename with a number.

## Deployment

Single pipeline. `.github/workflows/deploy-to-cloudflare.yml` runs on push to
`main` (pushes that only touch `.github/workflows/**` are skipped). It builds
with Hugo, then runs
`npx wrangler pages deploy public --project-name=nailsbyizzy --branch=main`.
Requires the GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

Unlike the related `whoownsthecode` repo, there is **no Cloudflare Worker**
here; the workflow has only the site-deploy job.

### One-time setup (repo owner)

1. Create a Cloudflare Pages project named `nailsbyizzy`.
2. Add `CLOUDFLARE_API_TOKEN` (Pages: Edit permission) and
   `CLOUDFLARE_ACCOUNT_ID` as GitHub repo secrets.
3. Point `nailsbyizzy.com` (and `www`) at the Pages project.
4. Confirm `baseURL` in `config.toml` is `https://nailsbyizzy.com`.

## Conventions

- Writing style for all content (Markdown, comments, commit messages): do not
  use en-dashes or em-dashes. Use a hyphen, or rephrase with commas,
  parentheses, or colons.
