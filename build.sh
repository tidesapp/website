#!/usr/bin/env bash
# Compile the site CSS with the Tailwind v4 standalone CLI.
# The output (style.css) is committed, so the published site needs no
# build step and loads no external dependencies.
set -euo pipefail
cd "$(dirname "$0")"

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
