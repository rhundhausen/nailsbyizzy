# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The website for **nailsbyizzy.com**, a cute showcase for Izzy's hand-painted
press-on nail sets. It is a **Hugo static site** deployed to **Cloudflare
Pages**. It is a portfolio/contact site, not a shop: there is no cart,
checkout, or payments. Visitors browse the gallery and order by email or
Instagram.

Two pages: the home page (`/`) and the gallery (`/gallery/`).

Design spec: `docs/superpowers/specs/2026-07-12-nailsbyizzy-design.md`.

## Commands

Run from the repo root:

```bash
hugo server          # local dev server with live reload
hugo --minify        # production build into ./public (what CI runs)
```

CI builds with Hugo **extended v0.162.1**, pinned in
`.github/workflows/deploy-to-cloudflare.yml` to match the version the site was
built and verified against. Use the extended edition locally.

> **Version gotcha (inherited lesson):** CI is pinned to a specific Hugo
> version. If you bump it, a build can start failing on config keys or template
> functions whose behavior changed. This site deliberately avoids the
> deprecated `languageCode` config key and `.Site.LanguageCode` (the html
> `lang` is hardcoded to `en` in `baseof.html`), so keep it that way unless you
> bump Hugo and update accordingly.

## Architecture

`config.toml` is the control panel: the artist name, tagline, about text,
pricing note, and contact details (email, Instagram) are all `[params.*]`
entries, and the nav is `[[menu.main]]` entries. Nothing is hardcoded in
templates.

- `layouts/index.html` is the home page: `nav`, `hero`, `about`, `contact`,
  `footer` partials.
- `layouts/gallery.html` is the gallery page, selected by
  `layout: "gallery"` in `content/gallery.md`. It renders `nav`, `gallery`,
  `contact`, `footer`, `lightbox`.
- `layouts/_default/baseof.html` + `layouts/partials/head.html` are the HTML
  skeleton (meta, fonts, CSS/JS wiring).
- Section partials live in `layouts/partials/`.
- The theme is a small custom theme **vendored into the repo root**
  (`layouts/`, `assets/`), not installed under `themes/` (that directory is
  unused). Edit the root `layouts/` and `assets/` directly.
- `assets/css/style.css` is hand-written CSS (pink Y2K palette via CSS custom
  properties). There is **no Sass pipeline**; edit the CSS directly.
- `assets/js/app.js` is vanilla JS only (hamburger nav, hero sparkles, gallery
  lightbox). No framework, no build step.

### Nav: add a page, add a menu entry

`layouts/partials/nav.html` renders `.Site.Menus.main`, so the nav and the
phone hamburger stay in sync automatically. Adding a page is two steps:

1. Add `content/<name>.md` with `layout: "<name>"` and a matching
   `layouts/<name>.html` (copy `layouts/gallery.html` as the pattern).
2. Add a `[[menu.main]]` block in `config.toml` with `name`, `url`, `weight`.

The nav is inline links above 700px and collapses to a hamburger below it (CSS
`@media (max-width:700px)` plus the toggle in `app.js`). The breakpoint is
duplicated in the JS `matchMedia('(min-width:701px)')` check that resets the
open state on resize: change both together.

### The gallery: drop a photo in a folder

- Nail-set photos live in `assets/gallery/`. They are rendered on the
  `/gallery/` page (reached from the hero button and the nav).
- `layouts/partials/gallery.html` globs that folder and renders every image,
  sorted by filename **descending** (newest first). Hugo image processing makes
  the grid thumbnail and the larger lightbox image, so originals are not served
  full-size in the grid.
- The caption/name is derived from the filename: a leading `NN-` order prefix
  is stripped, hyphens become spaces, and the result is title-cased
  (`16-busy-bee.jpg` -> "Busy Bee").
- **To add a design:** drop a `.jpg`/`.png` into `assets/gallery/`. No config
  or template edit needed. To control order, prefix the filename with a number.
- Note that the processed images publish to `public/gallery/` alongside the
  gallery page's own `index.html`. That is fine, but do not name a source image
  `index.jpg`.

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
