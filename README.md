# Nails by Izzy

A cute single-page Hugo site showcasing Izzy's hand-painted press-on nail sets,
deployed to Cloudflare Pages at [nailsbyizzy.com](https://nailsbyizzy.com).

Not a shop: visitors browse the gallery and order by phone, email, or Instagram.

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

All copy (tagline, pricing, about, phone, email, Instagram) lives in
`config.toml` under `[params]`. No template editing needed.

> The phone, email, and Instagram in `config.toml` are **placeholders**.
> Replace them with Izzy's real details.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy-to-cloudflare.yml`, which
builds with Hugo and runs `wrangler pages deploy`.

### One-time setup (repo owner)

1. Create a Cloudflare Pages project named `nailsbyizzy`.
2. Add GitHub repo secrets `CLOUDFLARE_API_TOKEN` (with Pages: Edit permission)
   and `CLOUDFLARE_ACCOUNT_ID`.
3. Point `nailsbyizzy.com` (and `www`) at the Pages project.

See `CLAUDE.md` for architecture details.
