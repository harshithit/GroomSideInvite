#!/usr/bin/env bash
# Point the site at your final domain.
#
# Fills in the SITE_URL placeholders in index.html (needed for the WhatsApp /
# social preview card, which requires ABSOLUTE image URLs) and writes the
# CNAME file GitHub Pages uses for a custom domain.
#
#   ./set-domain.sh harshitweds-ishita.com
#   ./set-domain.sh www.harshitweds-ishita.com
#
# Safe to re-run — it rewrites whatever is currently set.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: $0 ishitaandharshit.one" >&2
  exit 1
fi

DOMAIN="${1#http://}"; DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN%/}"
cd "$(dirname "$0")"

# 1. absolute URLs for the social preview
#    covers both index.html (root) and groom/index.html.
#    og:url keeps whatever path already follows the host — "/" on the root
#    page, "/groom/" on the groom page — only the scheme+host is rewritten,
#    so re-running this after a domain change never collapses that path.
for PAGE in index.html groom/index.html; do
  [ -f "$PAGE" ] || continue
  perl -0pi -e "s{(<meta property=\"og:url\" content=\")https?://[^/\"]*(/[^\"]*\")}{\${1}https://$DOMAIN\${2}}g" "$PAGE"
  perl -0pi -e "s{(content=\")https?://[^\"]*/assets/og-image\.jpg(\")}{\${1}https://$DOMAIN/assets/og-image.jpg\${2}}g" "$PAGE"
done

# 2. CNAME for GitHub Pages (harmless if you host on Hostinger instead)
printf '%s\n' "$DOMAIN" > CNAME

echo "Domain set to: $DOMAIN"
echo
for PAGE in index.html groom/index.html; do
  [ -f "$PAGE" ] || continue
  echo "  $PAGE:"
  grep -E 'og:url|og:image" ' "$PAGE" | sed 's/^/    /'
done
echo "  CNAME -> $(cat CNAME)"
echo
echo "Next: commit and push, then set the custom domain in"
echo "GitHub → Settings → Pages, and add the DNS records (see README)."
