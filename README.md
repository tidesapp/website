# tides-website

Static site for UK Tides Offline: app landing page, privacy policy, 404.
Published via GitHub Pages (branch `main`, root `/`). No build step on the
server, no external dependencies — all CSS, fonts, images and JS are
self-hosted in this repo.

## Structure

```
index.html         Landing page (hero, features, screenshots, beta CTA)
privacy.html       Privacy policy (single source of truth: /tmp/draft.md)
404.html           Custom 404
style.css          Compiled CSS (generated — do not edit by hand)
site.webmanifest   PWA manifest (icons in assets/favicon/)
assets/
  consent.js       Cookie-consent gate (top banner). GA loads only on "Allow".
  analytics.js     Google Analytics setup (measurement ID lives here only).
  screenshots/     AVIF + WebP variants, widths 360/720/1080.
  favicon/         SVG favicon + PNG/ICO renditions (from the app icon).
fonts/             Inter variable woff2 (OFL-1.1, see fonts/LICENSE.md).
src/input.css      Tailwind v4 source (theme, components) — edit this.
build.sh           Compiles src/input.css → style.css (minified).
```

## Development

```sh
./build.sh          # installs the Tailwind v4 standalone CLI if missing,
                    # compiles src/input.css → style.css
```

Then serve the repo root locally (e.g. `python3 -m http.server`) and check at
360 / 768 / 1280 px in both light and dark mode.

After changing `src/input.css` or any HTML/JS class usage, **run `./build.sh`
and commit `style.css`** — the compiled CSS is versioned so the published site
never runs a build.

## Screenshots

Originals live outside this repo (`~/Documents/projects/tidesapp/`). To
regenerate the web variants (1080×2400 PNG → AVIF/WebP at 360/720/1080):

```sh
magick in.png -strip /tmp/clean.png                  # strip EXIF first — see note
magick /tmp/clean.png -resize 720x /tmp/w.png        # per width/format
magick /tmp/w.png -quality 80 out.webp
avifenc -q 34 /tmp/w.png out.avif
```

**Note:** the source screenshots carry an `eXIf` chunk (device build
fingerprint) and *both* converters copy it into the output. Always run
`-strip` on the source first and byte-scan the outputs for `EXIF`/`XMP`
markers before committing.

Google Play listing exports (PNG/JPG, 9:16 + 9:20) are produced in
`../play-listing/` (sibling of this repo, not published).

## Links used on the site

- Beta application form: https://forms.gle/kTfjTmrAgcGXGwMX6 (internal testing, ≤100 users)
- Extensionless URLs (`/privacy`, `/index`) are served directly by GitHub
  Pages — keep internal links extensionless. `404.html` must use an absolute
  link (`/`) because it can be served at any path.
