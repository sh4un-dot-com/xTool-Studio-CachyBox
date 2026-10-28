#!/bin/sh
set -eu

APP_HOME="$HOME/.local/share/xtool-studio"
PREFIX_DIR="$APP_HOME/prefix"
INSTALLER_DIR="$APP_HOME/downloads"
INSTALLER_PATH="$INSTALLER_DIR/xTool-Studio-setup.exe"
USER_NAME="${USER:-$(id -un 2>/dev/null || echo user)}"
INSTALLER_TEMP_DIR="$PREFIX_DIR/drive_c/users/$USER_NAME/Temp/xTool-Studio"
RENDER_FLAG_FILE="$APP_HOME/force-software-rendering"
LAUNCH_LOG_DIR="$HOME/.cache/xtool-studio-cachy-box"
LAUNCH_LOG="$LAUNCH_LOG_DIR/launch.log"

# Desktop launchers normally discard stdout/stderr. Preserve it so a failed
# Wine/Electron startup can be diagnosed without changing the menu entry.
if [ ! -t 2 ]; then
	mkdir -p "$LAUNCH_LOG_DIR"
	if [ -f "$LAUNCH_LOG" ] && [ "$(wc -c <"$LAUNCH_LOG")" -gt 1048576 ]; then
		mv -f "$LAUNCH_LOG" "$LAUNCH_LOG.old"
	fi
	exec >>"$LAUNCH_LOG" 2>&1
fi

printf '\n[%s] Starting xTool Studio\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# Distrobox enter forwards the host environment. Host Electron/VS Code
# sets ELECTRON_RUN_AS_NODE=1, which makes xTool Studio (Electron) treat
# itself as Node, eval stdin, and exit. CI=true also changes startup.
unset ELECTRON_RUN_AS_NODE
unset ELECTRON_NO_ATTACH_CONSOLE
unset CI
unset VSCODE_ESM_ENTRYPOINT
unset VSCODE_PID
unset VSCODE_IPC_HOOK
unset CHROME_DESKTOP

is_installer_running() {
	if command -v pgrep >/dev/null 2>&1; then
		pgrep -af "xTool-Studio-setup\\.exe" >/dev/null 2>&1
	else
		return 1
	fi
}

find_installed_exe() {
	for dir in \
		"$PREFIX_DIR/drive_c/users/$USER_NAME/AppData/Local/Programs/xTool Studio" \
		"$PREFIX_DIR/drive_c/Program Files/xTool Studio" \
		"$PREFIX_DIR/drive_c/Program Files (x86)/xTool Studio"
	do
		if [ -d "$dir" ]; then
			for candidate in "$dir/xTool Studio.exe" "$dir/xTool-Studio.exe" "$dir/xToolStudio.exe"; do
				if [ -f "$candidate" ]; then
					printf '%s\n' "$candidate"
					return 0
				fi
			done
			find "$dir" -type f -iname "*.exe" \
				! -iname "xTool Studio.exe" ! -iname "xTool-Studio.exe" ! -iname "xToolStudio.exe" \
				! -iname "elevate.exe" ! -iname "*setup*.exe" ! -iname "*unins*.exe" \
				! -iname "*uninstall*.exe" ! -iname "*update*.exe" | sort | head -n 1
			return 0
		fi
	done
	find "$PREFIX_DIR/drive_c" -type f \
		\( -iname "xTool Studio*.exe" -o -iname "xTool-Studio*.exe" -o -iname "xToolStudio*.exe" \) \
		! -iname "elevate.exe" ! -iname "*setup*.exe" ! -iname "*unins*.exe" \
		! -iname "*uninstall*.exe" ! -iname "*update*.exe" | sort | head -n 1
}

force_software_rendering=0
if [ -n "${XTOOL_FORCE_SOFTWARE_RENDERING:-}" ]; then
	force_software_rendering="$XTOOL_FORCE_SOFTWARE_RENDERING"
elif [ -f "$RENDER_FLAG_FILE" ]; then
	force_software_rendering="$(tr -d '[:space:]' < "$RENDER_FLAG_FILE")"
fi

mkdir -p "$APP_HOME" "$INSTALLER_DIR"
if [ ! -d "$PREFIX_DIR" ]; then
	WINEPREFIX="$PREFIX_DIR" wineboot -u >/dev/null 2>&1 || true
fi

if [ "$force_software_rendering" = "1" ]; then
	export LIBGL_ALWAYS_SOFTWARE="${LIBGL_ALWAYS_SOFTWARE:-1}"
	export GALLIUM_DRIVER="${GALLIUM_DRIVER:-llvmpipe}"
	export MESA_LOADER_DRIVER_OVERRIDE="${MESA_LOADER_DRIVER_OVERRIDE:-llvmpipe}"
	export __GLX_VENDOR_LIBRARY_NAME="${__GLX_VENDOR_LIBRARY_NAME:-mesa}"
	export ELECTRON_DISABLE_GPU="${ELECTRON_DISABLE_GPU:-1}"
	if [ -z "${__EGL_VENDOR_LIBRARY_FILENAMES:-}" ] && [ -f /usr/share/glvnd/egl_vendor.d/50_mesa.json ]; then
		export __EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/50_mesa.json
	fi
	set -- --disable-gpu --disable-gpu-compositing --use-angle=swiftshader --disable-features=Vulkan "$@"
fi

APP_EXE="$(find_installed_exe)"
if [ -z "$APP_EXE" ]; then
	if is_installer_running; then
		echo "xTool Studio installer is already running. Complete it or close it before retrying." >&2
		exit 2
	fi
	rm -rf "$INSTALLER_TEMP_DIR"
	echo "Launching xTool Studio installer inside Wine..."
	if [ ! -t 0 ]; then
		exec </dev/null
	fi
	exec env WINEPREFIX="$PREFIX_DIR" wine "$INSTALLER_PATH" "$@"
fi

printf 'Using executable: %s\n' "$APP_EXE"

# Missing stdin is redirected so Electron/Node does not crash with EBADF.
# Keep this process in the Distrobox enter session until Wine exits so
# podman does not tear down the cgroup.
if [ ! -t 0 ]; then
	exec </dev/null
fi
env WINEPREFIX="$PREFIX_DIR" wine start /unix "$APP_EXE" "$@"
exec env WINEPREFIX="$PREFIX_DIR" wineserver -w
