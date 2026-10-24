#!/bin/bash
# Shared xTool Studio payload installer. Sourced by container-setup.sh and
# install-freebsd.sh. Requires XTOOL_URL. Optional: XTOOL_FORCE_SOFTWARE_RENDERING.

xtool_find_extractor() {
    if command -v 7z >/dev/null 2>&1; then
        printf '%s\n' 7z
        return 0
    fi
    if command -v 7zz >/dev/null 2>&1; then
        printf '%s\n' 7zz
        return 0
    fi
    return 1
}

xtool_install_payload() {
    local app_home installer_dir payload_dir prefix_dir
    local url_record extracted_url_record installer_path
    local user_name app_install_dir nsis_plugin_dir archive extractor

    : "${XTOOL_URL:?XTOOL_URL is required}"
    XTOOL_FORCE_SOFTWARE_RENDERING="${XTOOL_FORCE_SOFTWARE_RENDERING:-1}"

    extractor="$(xtool_find_extractor)" || {
        echo "Need 7z or 7zz to extract the xTool Studio installer." >&2
        return 1
    }

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
        if command -v wineboot >/dev/null 2>&1; then
            WINEPREFIX="$prefix_dir" wineboot -u >/dev/null 2>&1 || true
        elif command -v wine >/dev/null 2>&1; then
            WINEPREFIX="$prefix_dir" wine wineboot -u >/dev/null 2>&1 || true
        else
            echo "Wine is not installed; cannot initialize the prefix." >&2
            return 1
        fi
    fi

    if [ ! -f "$app_install_dir/xTool Studio.exe" ] || [ ! -f "$extracted_url_record" ] || [ "$(cat "$extracted_url_record")" != "$XTOOL_URL" ]; then
        echo 'Extracting xTool Studio application payload'
        rm -rf "$payload_dir" "$app_install_dir"
        mkdir -p "$payload_dir" "$app_install_dir"
        "$extractor" x -y "$installer_path" -o"$payload_dir" >/dev/null

        archive="$payload_dir/$nsis_plugin_dir/app-64.7z"
        if [ ! -f "$archive" ]; then
            archive="$(find "$payload_dir" -type f -name 'app-64.7z' -print | head -n 1)"
        fi
        if [ -z "$archive" ] || [ ! -f "$archive" ]; then
            echo "Could not find app-64.7z in the extracted NSIS payload." >&2
            echo "Installer format may have changed. Payload contents:" >&2
            find "$payload_dir" -maxdepth 3 -print >&2 || true
            return 1
        fi

        "$extractor" x -y "$archive" -o"$app_install_dir" >/dev/null
        printf '%s\n' "$XTOOL_URL" > "$extracted_url_record"
    fi
}
