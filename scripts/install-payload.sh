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

xtool_count_literal() {
    local needle="$1"
    local file="$2"

    { LC_ALL=C grep -aoF -- "$needle" "$file" 2>/dev/null || true; } | awk 'END { print NR }'
}

xtool_patch_electron_startup() {
    local app_asar="$1"
    local legacy_pattern='nodeIntegration:!0,contextIsolation:!1,webSecurity:!1'
    local fixed_pattern='nodeIntegration:!0,contextIsolation:!0,webSecurity:!1'
    local legacy_count fixed_count expected_fixed_count
    local before_size after_size remaining_legacy_count final_fixed_count temp_asar

    if [ ! -f "$app_asar" ]; then
        echo "Missing xTool Studio Electron archive: $app_asar" >&2
        return 1
    fi

    legacy_count="$(xtool_count_literal "$legacy_pattern" "$app_asar")"
    fixed_count="$(xtool_count_literal "$fixed_pattern" "$app_asar")"

    if [ "$legacy_count" -eq 0 ]; then
        if [ "$fixed_count" -gt 0 ]; then
            echo "xTool Electron startup compatibility patch is already applied ($fixed_count windows)"
        else
            echo 'WARN: xTool Electron startup compatibility signature was not found; leaving app.asar unchanged' >&2
        fi
        return 0
    fi

    if ! command -v perl >/dev/null 2>&1; then
        echo 'Perl is required to apply the xTool Electron startup compatibility patch.' >&2
        return 1
    fi

    temp_asar="$app_asar.context-isolation.tmp"
    rm -f "$temp_asar"
    if ! cp -f "$app_asar" "$temp_asar"; then
        echo 'Could not create a temporary copy of app.asar for patching.' >&2
        return 1
    fi

    before_size="$(wc -c < "$app_asar" | tr -d '[:space:]')"
    echo "Applying xTool Electron startup compatibility patch ($legacy_count windows)"
    if ! perl -0pi -e 's/nodeIntegration:!0,contextIsolation:!1,webSecurity:!1/nodeIntegration:!0,contextIsolation:!0,webSecurity:!1/g' "$temp_asar"; then
        rm -f "$temp_asar"
        echo 'Could not patch the xTool Electron archive.' >&2
        return 1
    fi

    after_size="$(wc -c < "$temp_asar" | tr -d '[:space:]')"
    remaining_legacy_count="$(xtool_count_literal "$legacy_pattern" "$temp_asar")"
    final_fixed_count="$(xtool_count_literal "$fixed_pattern" "$temp_asar")"
    expected_fixed_count="$((legacy_count + fixed_count))"

    if [ "$after_size" -ne "$before_size" ] || \
       [ "$remaining_legacy_count" -ne 0 ] || \
       [ "$final_fixed_count" -ne "$expected_fixed_count" ]; then
        rm -f "$temp_asar"
        echo 'xTool Electron startup patch validation failed; app.asar was not changed.' >&2
        return 1
    fi

    mv -f "$temp_asar" "$app_asar"
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

    # xTool 1.9.11 globally loads a contextBridge preload, but its four legacy
    # startup windows disable context isolation. Electron rejects that preload
    # and the first-run window never finishes loading under Wine. Keep Node
    # integration enabled for those bundled pages and enable context isolation.
    # This runs on every installer rerun so existing 1.9.11 prefixes are fixed.
    xtool_patch_electron_startup "$app_install_dir/resources/app.asar"
}
