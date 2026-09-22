#!/usr/bin/env bash
# Build the site locally (run before every commit). Two steps:
#   1. assemble pages:  src/*.html + partials/ -> *.html (root, committed)
#   2. compile CSS:     src/input.css -> style.css (minified, committed)
# The output is committed, so the published site needs no build step and
# loads no external dependencies.
set -euo pipefail
cd "$(dirname "$0")"

node src/build-html.mjs

TWC="${TWC:-$HOME/tools/tides-build/tailwindcss}"
if [ ! -x "$TWC" ]; then
    mkdir -p "$(dirname "$TWC")"
    case "$(uname -m)" in
        x86_64)  asset=tailwindcss-linux-x64 ;;
        aarch64) asset=tailwindcss-linux-arm64 ;;
        *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
    esac
    echo "Installing Tailwind standalone CLI to $TWC"
    curl -sL -o "$TWC" "https://github.com/tailwindlabs/tailwindcss/releases/download/v4.3.2/$asset"
    chmod +x "$TWC"
fi

"$TWC" build -i src/input.css -o style.css --minify
echo "Built style.css ($(wc -c < style.css) bytes, minified)"
