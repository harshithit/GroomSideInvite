# Harshit &amp; Ishita — Wedding Invitation

A single-page wedding invitation. Static site: no build step, no dependencies,
no server code. Open `index.html` and it works.

**19th &amp; 20th October 2026 · R Chandra Palace, Chomu, Jaipur**

---

## What's in here

```
index.html             the main invite — share this with the bride's side
groom/index.html        groom's-side variant — share this one with Harshit's side
groom/js/overrides.js   the ONLY two differences for that variant (see below)
404.html                friendly not-found, bounces back to the invitation
css/style.css           all styling (shared by both pages)
js/config.js            ← ALL wedding content lives here (names, dates, story, RSVP)
js/main.js              envelope animation, countdown, scratch card, petals, music
assets/                 images, audio, patterns (shared by both pages)
set-domain.sh           fills in the social-preview URLs + CNAME
build-standalone.py     bundles the main page into one file (for Claude Artifacts only)
```

**To change wording, dates, photos or captions, edit `js/config.js`.** Both
pages read from it, so one edit updates both. Nothing else should need
touching.

### Two versions of the card

`groom/index.html` is the same invite with two differences, applied by
`groom/js/overrides.js`:

- **Harshit's name leads** wherever the two are named together — the
  "Harshit weds Ishita" blessing line, the Meet the Couple cards, and the
  footer (the hero reads "Harshit with Ishita" on both versions)
- **Only Harshit's grandparents** are shown in the blessing line

Everything else — dates, venue, event schedule, love story, gallery, RSVP —
comes from the same `js/config.js` as the main page, so it's impossible for
the two versions to drift apart on the facts. If you ever need a third
variant, copy `groom/` as a template and write a short `overrides.js` for it.

Share `https://yourdomain.com/` with the bride's side and
`https://yourdomain.com/groom/` with the groom's side.

---

## Deploy to GitHub Pages

1. Create a repository on GitHub and push this folder:

   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git branch -M main
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages**
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder `/ (root)`
   - Save.

3. Wait ~1 minute. The site is live at
   `https://<you>.github.io/<repo>/`

`.nojekyll` is already included, so GitHub serves every file as-is instead of
running it through Jekyll.

---

## Point your Hostinger domain at it

Two options. **Option A keeps GitHub Pages as the host** and just uses your
Hostinger domain — this is usually what you want, since Pages handles HTTPS
for free.

### Option A — Hostinger domain → GitHub Pages

1. Set the domain in this project and commit:

   ```bash
   ./set-domain.sh yourdomain.com
   git commit -am "Set custom domain"
   git push
   ```

   That writes `CNAME` and makes the WhatsApp preview URLs absolute (they must
   be — relative paths don't work for link previews).

2. In **Hostinger → hPanel → Domains → DNS / Nameservers → DNS Zone Editor**,
   add these records:

   | Type | Name | Points to | TTL |
   |------|------|-----------|-----|
   | A | `@` | `185.199.108.153` | 14400 |
   | A | `@` | `185.199.109.153` | 14400 |
   | A | `@` | `185.199.110.153` | 14400 |
   | A | `@` | `185.199.111.153` | 14400 |
   | CNAME | `www` | `<you>.github.io` | 14400 |

   Delete any existing `A` record on `@` that points at Hostinger's own
   parking/hosting IP first, or it will conflict.

   *Optional, for IPv6 — add these `AAAA` records on `@`:*
   `2606:50c0:8000::153`, `2606:50c0:8001::153`,
   `2606:50c0:8002::153`, `2606:50c0:8003::153`

3. Back on GitHub: **Settings → Pages → Custom domain**, enter your domain and
   save. Once the check passes, tick **Enforce HTTPS**.

DNS can take anywhere from a few minutes to a few hours. Until it resolves,
GitHub may warn the domain isn't verified — that's expected, not an error.

### Option B — host the files on Hostinger directly

1. Run `./set-domain.sh yourdomain.com` (for the preview URLs — the `CNAME`
   file it writes is harmless here and can be deleted).
2. **hPanel → Files → File Manager → `public_html`**
3. Upload the **contents** of this folder (not the folder itself) — so
   `index.html` sits directly inside `public_html`.
4. Enable SSL under **hPanel → Security → SSL**.

Skip `.git/`, `dist/`, `_unused/`, `build-standalone.py`, `_og-source.html`
and `set-domain.sh` — they're dev tooling, not part of the served site.

---

## After going live — check the WhatsApp preview

Sharing the link should show a card with the couple's names, the date and the
venue, not a bare URL.

- Preview image: `assets/og-image.jpg` (1200×630)
- Test it: <https://developers.facebook.com/tools/debug/> — paste the URL and
  hit **Scrape Again**

WhatsApp caches previews aggressively. If you shared the link *before* the
domain was set, the old preview may stick for a while — the Facebook debugger
above forces a refresh.

To regenerate the image after changing names or dates, edit `_og-source.html`
and run:

```bash
python3 -m http.server 8743          # in one terminal, from this folder
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --virtual-time-budget=6000 \
  --screenshot=/tmp/og.png "http://localhost:8743/_og-source.html"
python3 -c "from PIL import Image; Image.open('/tmp/og.png').convert('RGB').save('assets/og-image.jpg','JPEG',quality=88,optimize=True,progressive=True)"
```

---

## Notes

- **Music** starts when a guest taps to open the envelope (browsers block audio
  before a user gesture) and there's a mute toggle bottom-right.
- **The RSVP Google Form** embeds properly here. It does *not* render inside a
  Claude Artifact — that host blocks third-party iframes — which is why
  `build-standalone.py` swaps it for a button in that build only.
- **Google Maps** behaves the same way: real embed here, link-out in the bundle.
- `dist/` and `build-standalone.py` are only for producing the Claude Artifact
  preview. GitHub Pages and Hostinger both serve the real multi-file site.
