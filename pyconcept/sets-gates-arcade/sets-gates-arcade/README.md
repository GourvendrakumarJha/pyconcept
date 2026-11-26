# Sets & Gates Arcade

A static site: no build step, no dependencies.

- Venn simulator: Python `set` operations (`|`, `&`, `-`, `^`, `<=`, `>=`, `isdisjoint`)
- Logic gates lab: Python boolean logic (`and`, `or`, `not`, `!=`, `==`) with a safe mini expression evaluator
- Web Audio sound effects, canvas background, hash routing (`#home`, `#venn`, `#logic`)
- Customize panel (colors, fonts, motion, sound, set names, universe size); saved in `localStorage` under `sga`

## Files
- `index.html` markup
- `assets/styles.css` styles
- `assets/app.js` all logic (plain ES2020, no ASI-unsafe minification applied)
- `assets/favicon.svg`

## Run locally
    python3 -m http.server 8080   # then open http://localhost:8080

## Deploy
Upload the folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3). Hash routing means no rewrite rules are needed.

## Optional hardening
- Fonts load from Google Fonts. To self-host, download Orbitron and JetBrains Mono, add `@font-face` rules to `styles.css`, and remove the `<link>` in `index.html`.
- Suggested headers: `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:` (inline styles are used for SVG positioning), plus `X-Content-Type-Options: nosniff`.
- Minify `styles.css` and `app.js` with your usual tool (e.g. esbuild) if you want smaller files.
