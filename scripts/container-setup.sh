#!/bin/bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

SETUP_DIR="${XTOOL_SETUP_DIR:-$HOME/.cache/xtool-studio-cachy-box}"
ENV_FILE="${XTOOL_SETUP_ENV:-$SETUP_DIR/container-setup.env}"

if [ ! -f "$ENV_FILE" ]; then
    echo "Missing setup environment file: $ENV_FILE" >&2
    exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${XTOOL_URL:?XTOOL_URL is required}"
: "${XTOOL_LAUNCHER_SRC:?XTOOL_LAUNCHER_SRC is required}"
XTOOL_FORCE_SOFTWARE_RENDERING="${XTOOL_FORCE_SOFTWARE_RENDERING:-1}"
PAYLOAD_LIB="${XTOOL_PAYLOAD_LIB:-$SETUP_DIR/install-payload.sh}"
XTOOL_MAPPER_SRC="${XTOOL_MAPPER_SRC:-$SETUP_DIR/xtool-map-windows.py}"

if [ ! -f "$XTOOL_LAUNCHER_SRC" ]; then
    echo "Missing launcher script: $XTOOL_LAUNCHER_SRC" >&2
    exit 1
fi

if [ ! -f "$PAYLOAD_LIB" ]; then
    echo "Missing payload installer: $PAYLOAD_LIB" >&2
    exit 1
fi

xtool_install_wine() {
    local codename winehq_src winehq_key ver major

    hash -r 2>/dev/null || true
    if command -v wine >/dev/null 2>&1; then
        ver="$(wine --version 2>/dev/null || true)"
        major="$(printf '%s\n' "$ver" | sed -n 's/^wine-\([0-9][0-9]*\).*/\1/p' | head -n 1)"
        if [ -n "$major" ] && [ "$major" -ge 10 ]; then
            echo "Wine already new enough for xTool Studio 1.9.11: $ver"
            return 0
        fi
        echo "Found ${ver:-no wine}; replacing Ubuntu Wine 9 with WineHQ 11"
    fi

    echo 'Enabling i386 architecture for Wine'
    sudo dpkg --add-architecture i386
    sudo apt-get update

    # Ubuntu 24.04's wine64 is 9.0. Electron 36 BrowserWindow.show()
    # native-crashes there, so the country dialog never paints. WineHQ
    # stable is Wine 11 and can show a framed first-run window. Do not
    # fall back to Wine 9: that path looks like a successful install and
    # then a black country window.
    sudo apt-get install -y ca-certificates curl gnupg wget
    sudo mkdir -pm755 /etc/apt/keyrings
    winehq_key=/etc/apt/keyrings/winehq-archive.key
    echo 'Adding the WineHQ repository key'
    # WineHQ's .sources file Signed-By's this path. Keep the upstream
    # armored key as-is; apt accepts it without dearmoring.
    sudo curl -fsSL --retry 5 --retry-delay 2 -o "$winehq_key" \
        https://dl.winehq.org/wine-builds/winehq.key
    . /etc/os-release
    codename="${VERSION_CODENAME:-noble}"
    winehq_src="/etc/apt/sources.list.d/winehq-${codename}.sources"
    echo "Adding the WineHQ ${codename} repository"
    sudo curl -fsSL --retry 5 --retry-delay 2 -o "$winehq_src" \
        "https://dl.winehq.org/wine-builds/ubuntu/dists/${codename}/winehq-${codename}.sources"
    sudo apt-get update

    echo 'Removing Ubuntu Wine 9 packages if they are present'
    sudo apt-get remove -y wine64 wine32 wine32:i386 wine libwine fonts-wine || true

    echo 'Installing WineHQ stable (Wine 11)'
    if ! sudo apt-get install -y --install-recommends winehq-stable; then
        echo 'WineHQ stable failed; trying WineHQ devel' >&2
        sudo apt-get install -y --install-recommends winehq-devel || true
    fi
    hash -r 2>/dev/null || true
    ver="$(command -v wine >/dev/null 2>&1 && wine --version 2>/dev/null || true)"
    major="$(printf '%s\n' "$ver" | sed -n 's/^wine-\([0-9][0-9]*\).*/\1/p' | head -n 1)"
    if [ -z "$major" ] || [ "$major" -lt 10 ]; then
        echo "ERROR: xTool Studio 1.9.11 needs Wine 10+ (WineHQ 11). Found: ${ver:-no wine}." >&2
        echo 'WineHQ did not install. Check that dl.winehq.org is reachable and i386 packages installed.' >&2
        return 1
    fi
    echo "WineHQ installed: $ver"
}

echo 'Running: apt update'
sudo apt-get update

echo 'Running: apt install'
PACKAGES=(
    curl
    ca-certificates
    lsb-release
    locales
    perl
    sudo
    winbind
    cabextract
    p7zip-full
    xdg-utils
    procps
    findutils
    libgl1
    libglx-mesa0
    libegl1
    libgl1-mesa-dri
    mesa-utils
    mesa-vulkan-drivers
    libpulse0
    libgstreamer1.0-0
    libgstreamer-plugins-base1.0-0
    libwebkit2gtk-4.1-0
    libjavascriptcoregtk-4.1-0
    libwayland-server0
    python3
)

sudo apt-get install -y "${PACKAGES[@]}"
xtool_install_wine
if ! sudo apt-get install -y libasound2t64; then
    sudo apt-get install -y libasound2 || true
fi

echo 'Generating locales'
sudo locale-gen en_US.UTF-8

# shellcheck disable=SC1090
source "$PAYLOAD_LIB"
xtool_install_payload

# This path is inside the Distrobox container, not on the host. Create it
# explicitly because minimal base images are not required to ship it.
sudo mkdir -p /usr/local/bin
sudo install -m 0755 "$XTOOL_LAUNCHER_SRC" /usr/local/bin/xToolStudio
sudo test -x /usr/local/bin/xToolStudio
if [ -f "$XTOOL_MAPPER_SRC" ]; then
    sudo install -m 0755 "$XTOOL_MAPPER_SRC" /usr/local/bin/xtool-map-windows.py
fi
printf '%s\n' \
    '[Desktop Entry]' \
    'Type=Application' \
    'Version=1.0' \
    'Name=xTool Studio' \
    'Comment=Run xTool Studio inside a Distrobox Wine container' \
    'Exec=/usr/local/bin/xToolStudio %F' \
    'TryExec=/usr/local/bin/xToolStudio' \
    'Terminal=false' \
    'Categories=Graphics;Utility;' \
    'StartupNotify=false' \
    'Icon=wine' | sudo tee /usr/share/applications/xToolStudio.desktop >/dev/null

echo 'Installed container launcher: /usr/local/bin/xToolStudio'

if [ -f /run/host/usr/share/cachyos-fish-config/cachyos-config.fish ]; then
    sudo mkdir -p /usr/share/cachyos-fish-config
    sudo ln -sfn /run/host/usr/share/cachyos-fish-config/cachyos-config.fish /usr/share/cachyos-fish-config/cachyos-config.fish
    if [ -d /run/host/usr/share/cachyos-fish-config/conf.d ]; then
        sudo ln -sfn /run/host/usr/share/cachyos-fish-config/conf.d /usr/share/cachyos-fish-config/conf.d
    fi
fi
