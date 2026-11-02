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

# Same-length in-place replacement so the asar header offsets stay valid.
xtool_replace_same_length() {
    local file="$1"
    local from="$2"
    local to="$3"
    local expected="$4"
    local from_count to_count after_from after_to

    if [ "${#from}" -ne "${#to}" ]; then
        echo "Internal error: replacement length mismatch for Electron patch." >&2
        return 1
    fi

    from_count="$(xtool_count_literal "$from" "$file")"
    to_count="$(xtool_count_literal "$to" "$file")"

    if [ "$from_count" -eq 0 ]; then
        return 0
    fi

    if [ "$from_count" -ne "$expected" ]; then
        echo "xTool Electron startup patch matched $from_count copies, expected $expected." >&2
        return 1
    fi

    if ! FROM="$from" TO="$to" perl -0pi -e 's/\Q$ENV{FROM}\E/$ENV{TO}/g' "$file"; then
        echo 'Could not patch the xTool Electron archive.' >&2
        return 1
    fi

    after_from="$(xtool_count_literal "$from" "$file")"
    after_to="$(xtool_count_literal "$to" "$file")"
    if [ "$after_from" -ne 0 ] || [ "$after_to" -ne "$((to_count + from_count))" ]; then
        echo 'xTool Electron startup patch validation failed.' >&2
        return 1
    fi

    return 0
}

# Electron 36 BrowserWindow.show() native-crashes under Wine 9, including
# framed windows. Wine 10+ can ShowWindow a framed dialog. Ubuntu 24.04's
# distro wine is 9.0; WineHQ stable is 11.x.
xtool_wine_major() {
    local ver major
    ver="$(command -v wine >/dev/null 2>&1 && wine --version 2>/dev/null || true)"
    major="$(printf '%s\n' "$ver" | sed -n 's/^wine-\([0-9][0-9]*\).*/\1/p' | head -n 1)"
    if [ -z "$major" ]; then
        printf '0\n'
    else
        printf '%s\n' "$major"
    fi
}

xtool_patch_gate_frames() {
    local file="$1"
    local suffix='movable:!0,webPreferences:{nodeIntegration:!0,contextIsolation:!1,webSecurity:!1}'
    local hidden="show:!1,frame:!1,${suffix}"
    local framed="show:!1,frame:!0,${suffix}"
    local shown="show:!0,frame:!0,${suffix}"
    local shown_frameless="show:!0,frame:!1,${suffix}"
    local wine_major desired from count
    local applied_here=0

    wine_major="$(xtool_wine_major)"
    if [ "$wine_major" -ge 10 ] 2>/dev/null; then
        desired="$shown"
        echo "Wine $(wine --version 2>/dev/null || echo "$wine_major") can show framed Electron windows"
        set -- "$hidden" "$framed" "$shown_frameless"
    else
        desired="$framed"
        echo "Wine $(wine --version 2>/dev/null || echo "$wine_major") crashes Electron show(); keeping first-run windows hidden+framed"
        set -- "$hidden" "$shown" "$shown_frameless"
    fi

    for from in "$@"; do
        [ "$from" = "$desired" ] && continue
        count="$(xtool_count_literal "$from" "$file")"
        if [ "$count" -eq 0 ]; then
            continue
        fi
        if [ "$count" -ne 2 ] && [ "$count" -ne 3 ]; then
            echo "WARN: xTool first-run window frame signature matched $count copies; leaving those bytes unchanged" >&2
            continue
        fi
        echo "Applying xTool first-run window show patch ($count windows)"
        if ! xtool_replace_same_length "$file" "$from" "$desired" "$count"; then
            return 1
        fi
        applied_here=1
    done

    if [ "$applied_here" -eq 1 ]; then
        return 0
    fi
    return 0
}

xtool_patch_electron_startup() {
    local app_asar="$1"
    local isolation_old='nodeIntegration:!0,contextIsolation:!0,webSecurity:!1'
    local isolation_orig='nodeIntegration:!0,contextIsolation:!1,webSecurity:!1'
    local gate_suffix='movable:!0,webPreferences:{nodeIntegration:!0,contextIsolation:!1,webSecurity:!1}'
    local gate_hidden="show:!1,frame:!1,${gate_suffix}"
    local gate_shown="show:!0,frame:!0,${gate_suffix}"
    local gate_shown_frameless="show:!0,frame:!1,${gate_suffix}"
    local gate_framed="show:!1,frame:!0,${gate_suffix}"
    local launch_frame_old='Start Page - xTool Studio`,frame:!1'
    local launch_frame_new='Start Page - xTool Studio`,frame:!0'
    local launch_transparent_old='resizable:!1,transparent:!0,roundedCorners:!1'
    local launch_transparent_new='resizable:!1,transparent:!1,roundedCorners:!1'
    local isolation_old_count gate_hidden_count gate_shown_count gate_shown_frameless_count
    local gate_framed_count launch_frame_old_count launch_frame_new_count
    local launch_transparent_old_count launch_transparent_new_count
    local before_size after_size temp_asar applied=0 wine_major

    if [ ! -f "$app_asar" ]; then
        echo "Missing xTool Studio Electron archive: $app_asar" >&2
        return 1
    fi

    isolation_old_count="$(xtool_count_literal "$isolation_old" "$app_asar")"
    gate_hidden_count="$(xtool_count_literal "$gate_hidden" "$app_asar")"
    gate_shown_count="$(xtool_count_literal "$gate_shown" "$app_asar")"
    gate_shown_frameless_count="$(xtool_count_literal "$gate_shown_frameless" "$app_asar")"
    gate_framed_count="$(xtool_count_literal "$gate_framed" "$app_asar")"
    launch_frame_old_count="$(xtool_count_literal "$launch_frame_old" "$app_asar")"
    launch_frame_new_count="$(xtool_count_literal "$launch_frame_new" "$app_asar")"
    launch_transparent_old_count="$(xtool_count_literal "$launch_transparent_old" "$app_asar")"
    launch_transparent_new_count="$(xtool_count_literal "$launch_transparent_new" "$app_asar")"
    max_old='maximizable:!1,minimizable:!1,alwaysOnTop:!1,modal:!1,show:!0,frame:!0,movable:!0,webPreferences:{nodeIntegration:!0,contextIsolation:!1,webSecurity:!1}'
    improve_old='width:se.width,height:se.height,center:!0,resizable:!1'
    max_old_count="$(xtool_count_literal "$max_old" "$app_asar")"
    improve_old_count="$(xtool_count_literal "$improve_old" "$app_asar")"
    wine_major="$(xtool_wine_major)"

    if [ "$isolation_old_count" -eq 0 ] && [ "$gate_hidden_count" -eq 0 ] && \
       [ "$gate_shown_frameless_count" -eq 0 ] && \
       [ "$launch_frame_old_count" -eq 0 ] && [ "$launch_transparent_old_count" -eq 0 ]; then
        if [ "$wine_major" -ge 10 ] 2>/dev/null; then
            if [ "$gate_framed_count" -eq 0 ] && [ "$max_old_count" -eq 0 ] && \
               [ "$improve_old_count" -eq 0 ] && { [ "$gate_shown_count" -gt 0 ] || \
               [ "$launch_frame_new_count" -gt 0 ] || [ "$launch_transparent_new_count" -gt 0 ]; }; then
                echo "xTool Electron first-run window patch is already applied"
                return 0
            fi
            if [ "$gate_framed_count" -eq 0 ] && [ "$gate_shown_count" -eq 0 ]; then
                echo 'WARN: xTool Electron first-run window signature was not found; leaving app.asar unchanged' >&2
                return 0
            fi
        else
            if [ "$gate_shown_count" -eq 0 ] && [ "$max_old_count" -eq 0 ] && \
               [ "$improve_old_count" -eq 0 ] && { [ "$gate_framed_count" -gt 0 ] || \
               [ "$launch_frame_new_count" -gt 0 ] || [ "$launch_transparent_new_count" -gt 0 ]; }; then
                echo "xTool Electron first-run window patch is already applied"
                return 0
            fi
            if [ "$gate_framed_count" -eq 0 ] && [ "$gate_shown_count" -eq 0 ]; then
                echo 'WARN: xTool Electron first-run window signature was not found; leaving app.asar unchanged' >&2
                return 0
            fi
        fi
    fi

    if ! command -v perl >/dev/null 2>&1; then
        echo 'Perl is required to apply the xTool Electron startup compatibility patch.' >&2
        return 1
    fi

    temp_asar="$app_asar.startup-visibility.tmp"
    rm -f "$temp_asar"
    if ! cp -f "$app_asar" "$temp_asar"; then
        echo 'Could not create a temporary copy of app.asar for patching.' >&2
        return 1
    fi

    before_size="$(wc -c < "$app_asar" | tr -d '[:space:]')"

    # Revert the earlier contextIsolation flip. country-select.html uses
    # window.require('electron'), which needs isolation left off.
    if [ "$isolation_old_count" -gt 0 ]; then
        echo "Reverting xTool contextIsolation patch ($isolation_old_count windows)"
        if ! xtool_replace_same_length "$temp_asar" "$isolation_old" "$isolation_orig" "$isolation_old_count"; then
            rm -f "$temp_asar"
            return 1
        fi
        applied=1
    fi

    # 1.9.11 first-run country/privacy/plan windows start hidden and frameless.
    # Wine 10+ can ShowWindow a framed dialog. Wine 9 native-crashes on show().
    if ! xtool_patch_gate_frames "$temp_asar"; then
        rm -f "$temp_asar"
        return 1
    fi
    if [ "$(xtool_count_literal "$gate_shown" "$temp_asar")" -ne "$gate_shown_count" ] || \
       [ "$(xtool_count_literal "$gate_framed" "$temp_asar")" -ne "$gate_framed_count" ]; then
        applied=1
    fi

    # GNOME CSD sits outside Electron's frame:true size, so Confirm and the
    # improvement-plan copy clip. Allow maximize/resize; the mapper also
    # grows those dialogs.
    max_old='maximizable:!1,minimizable:!1,alwaysOnTop:!1,modal:!1,show:!0,frame:!0,movable:!0,webPreferences:{nodeIntegration:!0,contextIsolation:!1,webSecurity:!1}'
    max_new='maximizable:!0,minimizable:!1,alwaysOnTop:!1,modal:!1,show:!0,frame:!0,movable:!0,webPreferences:{nodeIntegration:!0,contextIsolation:!1,webSecurity:!1}'
    max_count="$(xtool_count_literal "$max_old" "$temp_asar")"
    if [ "$max_count" -eq 2 ] || [ "$max_count" -eq 3 ]; then
        echo "Applying xTool first-run maximize patch ($max_count windows)"
        if ! xtool_replace_same_length "$temp_asar" "$max_old" "$max_new" "$max_count"; then
            rm -f "$temp_asar"
            return 1
        fi
        applied=1
    fi
    improve_old='width:se.width,height:se.height,center:!0,resizable:!1'
    improve_new='width:se.width,height:se.height,center:!0,resizable:!0'
    if [ "$(xtool_count_literal "$improve_old" "$temp_asar")" -eq 1 ]; then
        echo 'Applying xTool improvement-plan resize patch'
        if ! xtool_replace_same_length "$temp_asar" "$improve_old" "$improve_new" 1; then
            rm -f "$temp_asar"
            return 1
        fi
        applied=1
    fi

    if [ "$launch_frame_old_count" -eq 1 ]; then
        echo "Applying xTool launch window frame patch"
        if ! xtool_replace_same_length "$temp_asar" "$launch_frame_old" "$launch_frame_new" 1; then
            rm -f "$temp_asar"
            return 1
        fi
        applied=1
    elif [ "$launch_frame_old_count" -gt 1 ]; then
        echo "WARN: xTool launch window frame signature matched $launch_frame_old_count copies; leaving those bytes unchanged" >&2
    fi

    if [ "$launch_transparent_old_count" -eq 1 ]; then
        echo "Applying xTool launch window opaque patch"
        if ! xtool_replace_same_length "$temp_asar" "$launch_transparent_old" "$launch_transparent_new" 1; then
            rm -f "$temp_asar"
            return 1
        fi
        applied=1
    elif [ "$launch_transparent_old_count" -gt 1 ]; then
        echo "WARN: xTool launch window opaque signature matched $launch_transparent_old_count copies; leaving those bytes unchanged" >&2
    fi

    after_size="$(wc -c < "$temp_asar" | tr -d '[:space:]')"
    if [ "$after_size" -ne "$before_size" ]; then
        rm -f "$temp_asar"
        echo 'xTool Electron startup patch validation failed; app.asar was not changed.' >&2
        return 1
    fi

    if [ "$applied" -eq 1 ]; then
        mv -f "$temp_asar" "$app_asar"
    else
        rm -f "$temp_asar"
    fi
}

# Always wineboot the xTool prefix. A Distrobox reinstall keeps the host
# prefix, so a leftover Wine 9 prefix must be upgraded to Wine 11 before
# Electron 36 runs.
xtool_upgrade_prefix() {
    local prefix_dir="$1"
    local ver

    if ! command -v wine >/dev/null 2>&1 && ! command -v wineboot >/dev/null 2>&1; then
        echo "Wine is not installed; cannot initialize the prefix." >&2
        return 1
    fi

    ver="$(command -v wine >/dev/null 2>&1 && wine --version 2>/dev/null || echo unknown)"
    if [ ! -d "$prefix_dir" ]; then
        echo "Initializing Wine prefix for $ver"
    else
        echo "Updating existing Wine prefix for $ver"
    fi
    mkdir -p "$prefix_dir"
    # Electron does not need .NET or Gecko. Keep wineboot from prompting.
    case ":${WINEDLLOVERRIDES-}:" in
        *:mscoree=*) ;;
        *)
            if [ -n "${WINEDLLOVERRIDES-}" ]; then
                export WINEDLLOVERRIDES="$WINEDLLOVERRIDES;mscoree=;mshtml="
            else
                export WINEDLLOVERRIDES="mscoree=;mshtml="
            fi
            ;;
    esac
    if command -v wineboot >/dev/null 2>&1; then
        WINEPREFIX="$prefix_dir" WINEDEBUG=-all wineboot -u || {
            echo "WARN: wineboot -u failed for $prefix_dir" >&2
        }
    else
        WINEPREFIX="$prefix_dir" WINEDEBUG=-all wine wineboot -u || {
            echo "WARN: wineboot -u failed for $prefix_dir" >&2
        }
    fi
    WINEPREFIX="$prefix_dir" wineserver -w >/dev/null 2>&1 || true
    return 0
}

# Wine 9 GPU/crash caches keep Chromium on the spoofed HD 5600 path after
# a Wine 11 upgrade. Drop those caches only; leave country/privacy state.
xtool_clear_electron_gpu_caches() {
    local prefix_dir="$1"
    local user_name="$2"
    local base cache
    local cleared=0

    for base in \
        "$prefix_dir/drive_c/users/$user_name/AppData/Roaming/xTool Studio" \
        "$prefix_dir/drive_c/users/$user_name/AppData/Local/xTool Studio"
    do
        [ -d "$base" ] || continue
        for cache in GPUCache ShaderCache GrShaderCache DawnGraphiteCache DawnWebGPUCache Crashpad; do
            if [ -e "$base/$cache" ]; then
                echo "Clearing stale Electron cache: $base/$cache"
                rm -rf "$base/$cache"
                cleared=1
            fi
        done
        if [ -d "$base/Code Cache" ]; then
            echo "Clearing stale Electron cache: $base/Code Cache"
            rm -rf "$base/Code Cache"
            cleared=1
        fi
    done
    if [ "$cleared" -eq 1 ]; then
        echo 'Cleared stale Electron GPU/crash caches from the Wine 9 prefix'
    fi
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
    if command -v wine >/dev/null 2>&1; then
        wine --version >"$app_home/wine-version" 2>/dev/null || true
    fi

    if [ ! -f "$installer_path" ] || [ ! -f "$url_record" ] || [ "$(cat "$url_record")" != "$XTOOL_URL" ]; then
        echo 'Downloading xTool Studio Windows installer (with retries)'
        curl --fail -L --retry 5 --retry-delay 2 --connect-timeout 15 --max-time 300 --progress-bar "$XTOOL_URL" -o "$installer_path"
        printf '%s\n' "$XTOOL_URL" > "$url_record"
    fi

    if ! xtool_upgrade_prefix "$prefix_dir"; then
        return 1
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

    # xTool 1.9.11 first-run country/privacy/plan windows start hidden and
    # frameless. Wine 10+ gets a normal frame plus show:true. Wine 9 keeps
    # them hidden+framed because show() native-crashes. Keep contextIsolation
    # off so country-select.html can use window.require('electron').
    xtool_patch_electron_startup "$app_install_dir/resources/app.asar"
    if [ -f "$app_install_dir/resources/app.asar" ] && \
       [ "$(xtool_count_literal 'createCountrySelectWindow' "$app_install_dir/resources/app.asar")" -gt 0 ]; then
        xtool_clear_electron_gpu_caches "$prefix_dir" "$user_name"
    fi
}
