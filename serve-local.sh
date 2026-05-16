#!/usr/bin/env bash

set -euo pipefail

port=8080
root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/docs"
open_browser=0
python_cmd=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--port)
      [[ $# -ge 2 ]] || {
        echo "Missing value for $1" >&2
        exit 1
      }
      port="$2"
      shift 2
      ;;
    -r|--root)
      [[ $# -ge 2 ]] || {
        echo "Missing value for $1" >&2
        exit 1
      }
      root="$2"
      shift 2
      ;;
    --no-browser)
      open_browser=0
      shift
      ;;
    -h|--help)
      cat <<'EOF'
Usage: ./serve-local.sh [options]

Options:
  -p, --port <port>   Port to listen on. Default: 8080
  -r, --root <dir>    Static site root. Default: ./docs
      --no-browser    Do not open a browser automatically
  -h, --help          Show this help text
EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if [[ ! -d "$root" ]]; then
  echo "Static site root not found: $root" >&2
  exit 1
fi

if command -v python3 >/dev/null 2>&1 && python3 --version >/dev/null 2>&1; then
  python_cmd=(python3)
elif command -v py >/dev/null 2>&1 && py -3 --version >/dev/null 2>&1; then
  python_cmd=(py -3)
elif command -v python >/dev/null 2>&1 && python --version >/dev/null 2>&1; then
  python_cmd=(python)
else
  echo "A working Python 3 interpreter is required to run the local server." >&2
  exit 1
fi

case "$port" in
  ''|*[!0-9]*)
    echo "Port must be a number: $port" >&2
    exit 1
    ;;
esac

site_url="http://localhost:${port}/"

echo "Serving static site from $root"
echo "Open $site_url"
echo "Press Ctrl+C to stop."

if [[ "$open_browser" -eq 1 ]]; then
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$site_url" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$site_url" >/dev/null 2>&1 || true
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -Command "Start-Process '$site_url'" >/dev/null 2>&1 || true
  fi
fi

cd "$root"
exec "${python_cmd[@]}" -m http.server "$port"
