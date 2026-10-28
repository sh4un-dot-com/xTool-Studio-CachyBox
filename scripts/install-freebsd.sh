#!/bin/bash
set -euo pipefail

SETUP_DIR="${XTOOL_SETUP_DIR:-$HOME/.cache/xtool-studio-cachy-box}"
ENV_FILE="${XTOOL_SETUP_ENV:-$SETUP_DIR/container-setup.env}"
PAYLOAD_LIB="${XTOOL_PAYLOAD_LIB:-$SETUP_DIR/install-payload.sh}"
DRY_RUN="${XTOOL_DRY_RUN:-false}"

if [ ! -f "$ENV_FILE" ]; then
    echo "Missing setup environment file: $ENV_FILE" >&2
    exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${XTOOL_URL:?XTOOL_URL is required}"
: "${XTOOL_LAUNCHER_SRC:?XTOOL_LAUNCHER_SRC is required}"
XTOOL_FORCE_SOFTWARE_RENDERING="${XTOOL_FORCE_SOFTWARE_RENDERING:-1}"

if [ ! -f "$XTOOL_LAUNCHER_SRC" ]; then
    echo "Missing launcher script: $XTOOL_LAUNCHER_SRC" >&2
    exit 1
fi

if [ ! -f "$PAYLOAD_LIB" ]; then
    echo "Missing payload installer: $PAYLOAD_LIB" >&2
    exit 1
fi

xtool_pkg() {
    if [ "$(id -u)" -eq 0 ]; then
        env ASSUME_ALWAYS_YES=yes pkg "$@"
    elif command -v doas >/dev/null 2>&1; then
        doas env ASSUME_ALWAYS_YES=yes pkg "$@"
    elif command -v sudo >/dev/null 2>&1; then
        sudo env ASSUME_ALWAYS_YES=yes pkg "$@"
    else
        echo "Need doas or sudo to install packages with pkg." >&2
        exit 1
    fi
}

if [ "$DRY_RUN" = true ]; then
    echo "DRY RUN: would install Wine and extract xTool Studio on FreeBSD"
    exit 0
fi

echo 'Installing FreeBSD packages for native Wine'
xtool_pkg install -y wine curl
xtool_pkg install -y wine-gecko wine-mono cabextract desktop-file-utils || true
if ! command -v 7z >/dev/null 2>&1 && ! command -v 7zz >/dev/null 2>&1; then
    if ! xtool_pkg install -y 7-zip; then
        xtool_pkg install -y p7zip
    fi
fi

if ! command -v wine >/dev/null 2>&1; then
    echo "Wine did not install. Install it with: pkg install wine" >&2
    exit 1
fi

# shellcheck disable=SC1090
source "$PAYLOAD_LIB"
xtool_install_payload

bin_dir="$HOME/.local/bin"
app_dir="$HOME/.local/share/applications"
mkdir -p "$bin_dir" "$app_dir"
install -m 0755 "$XTOOL_LAUNCHER_SRC" "$bin_dir/xToolStudio"

desktop_file="$app_dir/xToolStudio.desktop"
{
    printf '%s\n' '[Desktop Entry]'
    printf '%s\n' 'Type=Application'
    printf '%s\n' 'Version=1.0'
    printf '%s\n' 'Name=xTool Studio'
    printf '%s\n' 'Comment=Run xTool Studio through native FreeBSD Wine'
    printf '%s\n' "Exec=$bin_dir/xToolStudio %F"
    printf '%s\n' "TryExec=$bin_dir/xToolStudio"
    printf '%s\n' 'Terminal=false'
    printf '%s\n' 'Categories=Graphics;Utility;'
    printf '%s\n' 'StartupNotify=false'
    printf '%s\n' 'Icon=wine'
    printf '%s\n' 'StartupWMClass=xToolStudio'
} > "$desktop_file"

if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$app_dir" >/dev/null 2>&1 || true
fi

echo "Installed launcher: $bin_dir/xToolStudio"
echo "Installed desktop entry: $desktop_file"
