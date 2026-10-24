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

if [ ! -f "$XTOOL_LAUNCHER_SRC" ]; then
    echo "Missing launcher script: $XTOOL_LAUNCHER_SRC" >&2
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

app_home="$HOME/.local/share/xtool-studio"
installer_dir="$app_home/downloads"
payload_dir="$app_home/payload"
prefix_dir="$app_home/prefix"
url_record="$app_home/last-download-url"
extracted_url_record="$app_home/last-extracted-url"
installer_path="$installer_dir/xTool-Studio-setup.exe"
user_name="${USER:-$(id -un 2>/dev/null || echo user)}"
app_install_dir="$prefix_dir/drive_c/users/$user_name/AppData/Local/Programs/xTool Studio"
nsis_plugin_dir='$PLUGINSDIR'

mkdir -p "$installer_dir" "$app_home"
printf '%s\n' "$XTOOL_FORCE_SOFTWARE_RENDERING" > "$app_home/force-software-rendering"

if [ ! -f "$installer_path" ] || [ ! -f "$url_record" ] || [ "$(cat "$url_record")" != "$XTOOL_URL" ]; then
    echo 'Downloading xTool Studio Windows installer (with retries)'
    curl --fail -L --retry 5 --retry-delay 2 --connect-timeout 15 --max-time 300 --progress-bar "$XTOOL_URL" -o "$installer_path"
    printf '%s\n' "$XTOOL_URL" > "$url_record"
fi

if [ ! -d "$prefix_dir" ]; then
    echo 'Initializing Wine prefix'
    WINEPREFIX="$prefix_dir" wineboot -u >/dev/null 2>&1 || true
fi

if [ ! -f "$app_install_dir/xTool Studio.exe" ] || [ ! -f "$extracted_url_record" ] || [ "$(cat "$extracted_url_record")" != "$XTOOL_URL" ]; then
    echo 'Extracting xTool Studio application payload'
    rm -rf "$payload_dir" "$app_install_dir"
    mkdir -p "$payload_dir" "$app_install_dir"
    7z x -y "$installer_path" -o"$payload_dir" >/dev/null

    archive="$payload_dir/$nsis_plugin_dir/app-64.7z"
    if [ ! -f "$archive" ]; then
        archive="$(find "$payload_dir" -type f -name 'app-64.7z' -print -quit || true)"
    fi
    if [ -z "$archive" ] || [ ! -f "$archive" ]; then
        echo "Could not find app-64.7z in the extracted NSIS payload." >&2
        echo "Installer format may have changed. Payload contents:" >&2
        find "$payload_dir" -maxdepth 3 -print >&2 || true
        exit 1
    fi

    7z x -y "$archive" -o"$app_install_dir" >/dev/null
    printf '%s\n' "$XTOOL_URL" > "$extracted_url_record"
fi

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
