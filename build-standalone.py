#!/usr/bin/env python3
"""
Bundle the invite into ONE self-contained HTML file for publishing.

Everything (CSS, JS, images, audio) is inlined as data: URIs, because the
Artifact host serves a single file under a strict CSP that blocks external
requests. Google Fonts is the one allowed exception and stays linked.

Run:  python3 build-standalone.py
Out:  dist/invite.html
"""
import base64, mimetypes, os, re, pathlib

ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)

# Prefer these substitutions when inlining (smaller than the originals).
OVERRIDES = {
    "assets/audio/wedding-flute-mashup.mp3": "/tmp/music-mono.mp3",
}

_cache = {}


def data_uri(rel_path: str) -> str:
    """Inline an asset, preferring a .webp sibling for raster images."""
    rel = rel_path.split("?")[0].lstrip("./")
    if rel in _cache:
        return _cache[rel]

    src = pathlib.Path(OVERRIDES.get(rel, ROOT / rel))
    if not src.is_absolute():
        src = ROOT / src

    # swap png/jpg for the webp we generated, when one exists
    if src.suffix.lower() in (".png", ".jpg", ".jpeg"):
        webp = src.with_suffix(".webp")
        if webp.exists():
            src = webp

    if not src.exists():
        raise FileNotFoundError(f"missing asset: {rel} -> {src}")

    mime = mimetypes.guess_type(str(src))[0] or "application/octet-stream"
    b64 = base64.b64encode(src.read_bytes()).decode("ascii")
    uri = f"data:{mime};base64,{b64}"
    _cache[rel] = uri
    print(f"  inlined {rel:<52} {src.stat().st_size/1024:8.1f} KB -> {len(uri)/1024:8.1f} KB")
    return uri


html = (ROOT / "index.html").read_text()
css = (ROOT / "css" / "style.css").read_text()
config_js = (ROOT / "js" / "config.js").read_text()
main_js = (ROOT / "js" / "main.js").read_text()

print("Inlining assets…")

# ---- CSS: resolve url(...) and collapse image-set() to a single webp ----
css = re.sub(
    r"background-image:\s*url\([^)]*\);\s*background-image:\s*image-set\([^;]*\);",
    lambda m: f"background-image: url('{data_uri('assets/patterns/floral-beige.jpg')}');",
    css,
)
css = re.sub(
    r"url\(\s*['\"]?\.\./(assets/[^'\")]+)['\"]?\s*\)",
    lambda m: f"url('{data_uri(m.group(1))}')",
    css,
)

# ---- Audio first: fold its <source> up into the <audio> tag, before the
#      picture-source strip below would otherwise remove it ----
audio_src = re.search(r'<source src="/?(assets/audio/[^"]+)"[^>]*>', html)
if audio_src:
    html = re.sub(
        r'<audio([^>]*)>\s*<source src="/?assets/audio/[^"]+"[^>]*>\s*</audio>',
        lambda m: f'<audio{m.group(1)} src="{data_uri(audio_src.group(1))}"></audio>',
        html,
        flags=re.S,
    )

# ---- Drop <picture> <source> elements; the <img> data URI is already webp ----
html = re.sub(r"\s*<source[^>]*>", "", html)
main_js = re.sub(r"\s*<source[^>]*>", "", main_js)

# ---- Map iframe can't load under CSP: swap for a link-out panel ----
html = re.sub(
    r'<div class="map-embed">.*?</div>',
    '<a class="map-link" id="map-link" href="#" target="_blank" rel="noopener noreferrer">'
    '<span class="map-pin">📍</span><span>View the venue on Google Maps</span></a>',
    html,
    flags=re.S,
)
css += """
/* published build: static link in place of the blocked map iframe */
.map-link{
  display:flex; align-items:center; justify-content:center; gap:10px;
  padding:18px 20px; margin-bottom:22px;
  border:1px solid var(--paper-line); border-radius:14px;
  background:var(--cream); color:var(--maroon); text-decoration:none;
  font-size:0.95rem; box-shadow:var(--shadow-soft);
}
.map-link:hover{ background:var(--cream-2); }
.map-pin{ font-size:1.1rem; }
"""
main_js = main_js.replace(
    '$("#map-iframe").src = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;',
    'const mapLink = $("#map-link"); if (mapLink) mapLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;',
)

# ---- Same story for the RSVP form: docs.google.com iframes are blocked
#      under the host CSP, so publish a button that opens the form instead ----
_RSVP_BTN = (
    '<a class="rsvp-form-btn" href="${form.url}" target="_blank" rel="noopener noreferrer">'
    '<span class="rsvp-form-btn-icon">\U0001F4DD</span><span>Open the RSVP form</span></a>'
)
main_js, _n = re.subn(
    r'<iframe class="rsvp-frame".*?</iframe>\s*\n\s*<a class="rsvp-form-fallback".*?</a>',
    lambda m: _RSVP_BTN,          # lambda: not treated as a template string
    main_js,
    flags=re.S,
)
if _n != 1:
    raise SystemExit(f"RSVP form swap failed: matched {_n} times, expected 1")
css += """
/* published build: button in place of the blocked Google Form iframe */
.rsvp-form-btn{
  display:flex; align-items:center; justify-content:center; gap:10px;
  width:100%; max-width:300px; margin:0 auto;
  padding:14px 22px; border-radius:999px;
  background:linear-gradient(180deg,var(--gold-light),var(--gold-deep));
  color:var(--brown-2); text-decoration:none; font-size:0.95rem;
  letter-spacing:0.03em; box-shadow:0 4px 14px rgba(166,125,61,.4);
  transition:transform .2s ease, box-shadow .2s ease;
}
.rsvp-form-btn:hover{ transform:translateY(-2px); box-shadow:0 7px 20px rgba(166,125,61,.5); }
.rsvp-form-btn-icon{ font-size:1.05rem; }
"""

# ---- Remaining src="assets/..." in markup and JS ----
html = re.sub(r'src="/?(assets/[^"]+)"', lambda m: f'src="{data_uri(m.group(1))}"', html)
main_js = re.sub(r'src="/?(assets/[^"]+)"', lambda m: f'src="{data_uri(m.group(1))}"', main_js)

# ---- Photo paths live as plain strings in config.js ----
config_js = re.sub(
    r'"/?(assets/photos/[^"]+)"',
    lambda m: '"' + data_uri(m.group(1)) + '"',
    config_js,
)

# ---- Extract the pieces we need out of the full document ----
title = re.search(r"<title>(.*?)</title>", html, re.S).group(1)
fonts = re.search(r'<link href="https://fonts\.googleapis\.com[^>]*>', html).group(0)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)

# strip the local <script src> tags — we inline their contents instead
body = re.sub(r'\s*<script src="[^"]+"></script>', "", body)

def ascii_html(s: str) -> str:
    """Numeric character references — safe regardless of served charset."""
    return "".join(c if ord(c) < 128 else f"&#x{ord(c):X};" for c in s)


def ascii_js(s: str) -> str:
    """\\uXXXX escapes for JS/CSS string literals."""
    out_chars = []
    for c in s:
        if ord(c) < 128:
            out_chars.append(c)
        elif ord(c) > 0xFFFF:            # astral (emoji) -> surrogate pair
            v = ord(c) - 0x10000
            out_chars.append(f"\\u{0xD800 + (v >> 10):04X}\\u{0xDC00 + (v & 0x3FF):04X}")
        else:
            out_chars.append(f"\\u{ord(c):04X}")
    return "".join(out_chars)


# The host owns <head>, so we can't declare a charset. Emitting pure ASCII
# makes the page render correctly whatever charset it is served as.
title = ascii_html(title)
body = ascii_html(body)
css = ascii_js(css)
config_js = ascii_js(config_js)
main_js = ascii_js(main_js)

out = f"""<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{fonts}
<style>
{css}
</style>
{body}
<script>
{config_js}
{main_js}
</script>
"""

dest = DIST / "invite.html"
dest.write_text(out)
size_mb = dest.stat().st_size / 1024 / 1024
print(f"\nWrote {dest}  ({size_mb:.2f} MB)")
print("Artifact limit is 16 MB." if size_mb < 16 else "!! OVER the 16 MB Artifact limit")
