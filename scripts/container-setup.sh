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

if [ ! -f "$XTOOL_LAUNCHER_SRC" ]; then
    echo "Missing launcher script: $XTOOL_LAUNCHER_SRC" >&2
    exit 1
fi

if [ ! -f "$PAYLOAD_LIB" ]; then
    echo "Missing payload installer: $PAYLOAD_LIB" >&2
    exit 1
fi

echo 'Running: apt update'
sudo apt-get update
echo 'Enabling i386 architecture for Wine'
sudo dpkg --add-architecture i386
sudo apt-get update

echo 'Running: apt install'
PACKAGES=(
    curl
    ca-certificates
    lsb-release
    locales
    sudo
    wine64
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
)

sudo apt-get install -y "${PACKAGES[@]}"
if ! sudo apt-get install -y wine32:i386; then
    echo 'wine32:i386 is unavailable; trying wine32'
    sudo apt-get install -y wine32 || echo 'WARN: continuing without wine32; 64-bit Wine will still be used'
fi
if ! sudo apt-get install -y libasound2t64; then
    sudo apt-get install -y libasound2 || true
fi

echo 'Generating locales'
sudo locale-gen en_US.UTF-8

# shellcheck disable=SC1090
source "$PAYLOAD_LIB"
xtool_install_payload

sudo install -m 0755 "$XTOOL_LAUNCHER_SRC" /usr/local/bin/xToolStudio
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
    'StartupNotify=true' \
    'Icon=wine' | sudo tee /usr/share/applications/xToolStudio.desktop >/dev/null

if [ -f /run/host/usr/share/cachyos-fish-config/cachyos-config.fish ]; then
    sudo mkdir -p /usr/share/cachyos-fish-config
    sudo ln -sfn /run/host/usr/share/cachyos-fish-config/cachyos-config.fish /usr/share/cachyos-fish-config/cachyos-config.fish
    if [ -d /run/host/usr/share/cachyos-fish-config/conf.d ]; then
        sudo ln -sfn /run/host/usr/share/cachyos-fish-config/conf.d /usr/share/cachyos-fish-config/conf.d
    fi
fi
