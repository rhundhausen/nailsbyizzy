# Nails by Izzy

A cute little Hugo site showcasing Izzy's hand-painted press-on nail sets,
deployed to Cloudflare Pages at [nailsbyizzy.com](https://nailsbyizzy.com).

Two pages: the home page and the nail gallery at `/gallery/`.

Not a shop: visitors browse the gallery and order by email or Instagram.

## Run it locally

Requires Hugo **extended** (see the pinned version in
`.github/workflows/deploy-to-cloudflare.yml`).

```bash
hugo server     # http://localhost:1313 with live reload
hugo --minify   # production build into ./public
```

## Add a nail set

Drop a `.jpg` or `.png` into `assets/gallery/`. It appears automatically,
newest first. The caption comes from the filename: a leading number sets the
order, hyphens become spaces, and it is title-cased.

`17-cherry-swirl.jpg` -> shows as **Cherry Swirl** (and sorts before `16-...`).

## Edit the text

All copy (tagline, pricing, about, email, Instagram) lives in `config.toml`
under `[params]`. No template editing needed.

## Add a page

1. Create `content/<name>.md` with `layout: "<name>"`, plus a matching
   `layouts/<name>.html` (copy `layouts/gallery.html`).
2. Add a `[[menu.main]]` entry in `config.toml`. It shows up in the nav and in
   the phone hamburger menu automatically.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy-to-cloudflare.yml`, which
builds with Hugo and runs `wrangler pages deploy`.

### One-time setup (repo owner)

1. Create a Cloudflare Pages project named `nailsbyizzy`.
2. Add GitHub repo secrets `CLOUDFLARE_API_TOKEN` (with Pages: Edit permission)
   and `CLOUDFLARE_ACCOUNT_ID`.
3. Point `nailsbyizzy.com` (and `www`) at the Pages project.

See `CLAUDE.md` for architecture details.
