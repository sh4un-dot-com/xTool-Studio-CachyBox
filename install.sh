#!/bin/bash

# --- Configuration & Colors ---
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}--------------------------------------------------------${NC}"
echo -e "xTool Studio Cachy Box Installer (Universal Bash)"
echo -e "${BLUE}--------------------------------------------------------${NC}"

# --- CLI options & Logging ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_OS="$(uname -s)"
LOG_DIR="$HOME/.cache/xtool-studio-cachy-box"
SETUP_DIR="$LOG_DIR"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/install.log"
LAST_STEP_FILE="$LOG_DIR/last_failed_step"
CONTAINER_SETUP_SRC="$SCRIPT_DIR/scripts/container-setup.sh"
FREEBSD_SETUP_SRC="$SCRIPT_DIR/scripts/install-freebsd.sh"
PAYLOAD_SRC="$SCRIPT_DIR/scripts/install-payload.sh"
LAUNCHER_SRC="$SCRIPT_DIR/scripts/xtool-studio-launcher.sh"

log(){
    local level="$1"; shift
    local ts; ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo -e "[$ts] [$level] $*" | tee -a "$LOG_FILE"
}

has_nvidia_cdi_spec(){
    find /etc/cdi /var/run/cdi -maxdepth 1 -type f \( -iname '*nvidia*.yaml' -o -iname '*nvidia*.json' \) -print -quit 2>/dev/null | grep -q .
}

has_nvidia_container_support(){
    command -v podman &>/dev/null || return 1
    command -v nvidia-smi &>/dev/null || return 1
    has_nvidia_cdi_spec && return 0
    return 1
}

run_logged(){
    if [ "$DRY_RUN" = true ]; then
        log "INFO" "DRY RUN: would run: $*"
        return 0
    fi

    "$@" 2>&1 | tee -a "$LOG_FILE"
    return ${PIPESTATUS[0]:-0}
}

resolve_latest_xtool_url(){
    local latest_response latest_url

    if [ -n "$XTOOL_URL" ]; then
        case "$XTOOL_URL_SOURCE" in
            cli)
                log "INFO" "Using xTool Studio installer URL from CLI: $XTOOL_URL"
                ;;
            environment)
                log "INFO" "Using xTool Studio installer URL from environment: $XTOOL_URL"
                ;;
        esac
        return 0
    fi

    latest_response=$(curl --fail -fsSL --retry 5 --retry-delay 2 --connect-timeout 15 --max-time 60 \
        "$XTOOL_RELEASE_NOTES_URL" 2>>"$LOG_FILE" || true)

    latest_url=$(printf '%s' "$latest_response" | grep -oE 'https://storage[^"[:space:]]+/xTool-Studio-x64-[^"[:space:]]+\.exe' | head -n 1)

    if [ -n "$latest_url" ]; then
        XTOOL_URL="$latest_url"
        log "INFO" "Resolved latest xTool Studio Windows installer: $XTOOL_URL"
    else
        XTOOL_URL="$DEFAULT_XTOOL_URL"
        log "WARN" "Unable to resolve the latest xTool Studio release; falling back to $XTOOL_URL"
    fi
}

build_distrobox_create_cmd(){
    local image_name="$1"
    local gpu_flag="$2"
    local additional_flags="$3"

    DBX_CREATE_CMD=(distrobox create --name "$CONTAINER_NAME" --image "$image_name")
    if [ -n "$gpu_flag" ]; then
        DBX_CREATE_CMD+=("$gpu_flag")
    fi
    if [ -n "$additional_flags" ]; then
        DBX_CREATE_CMD+=(--additional-flags "$additional_flags")
    fi
    DBX_CREATE_CMD+=(--yes)
}

# latest-release resolution (can be overridden with XTOOL_URL or --url)
DEFAULT_XTOOL_URL="https://storage.atomm.com/efficacy/atomm-package/prod/packages/109/d7cb892b-c082-4565-803e-5e71b9f8026b/xTool-Studio-x64-1.6.6.exe"
XTOOL_RELEASE_NOTES_URL="https://support.xtool.com/article/1773"
XTOOL_URL="${XTOOL_URL:-}"
XTOOL_URL_SOURCE=""
if [ -n "$XTOOL_URL" ]; then
    XTOOL_URL_SOURCE="environment"
fi

# Prevent running as root: distrobox commands do not behave correctly under sudo
if [ "$(id -u)" -eq 0 ]; then
    echo "ERROR: Do not run this installer with sudo or as root."
    echo "Please run as your regular user (no sudo): ./install.sh"
    echo "If you intentionally need root distrobox operations, re-run without this script or use distrobox --root commands as documented."
    exit 1
fi

NON_INTERACTIVE=false
DRY_RUN=false
PRECHECK=false
UNINSTALL=false
CONTAINER_NAME="xtool-studio"

while [[ "$#" -gt 0 ]]; do
    case "$1" in
        --non-interactive|--yes|-y)
            NON_INTERACTIVE=true; shift ;;
        --dry-run)
            DRY_RUN=true; shift ;;
        --check)
            PRECHECK=true; shift ;;
        --uninstall)
            UNINSTALL=true; shift ;;
        --url)
            XTOOL_URL="$2"; XTOOL_URL_SOURCE="cli"; shift 2 ;;
        --container-name)
            CONTAINER_NAME="$2"; shift 2 ;;
        --gpu)
            gpu_choice="$2"; shift 2 ;;
        --image-source)
            img_choice="$2"; shift 2 ;;
        --log-file)
            LOG_FILE="$2"; shift 2 ;;
        --help|-h)
            echo "Usage: $0 [--non-interactive|--yes|-y] [--dry-run] [--check] [--uninstall] [--url URL] [--container-name NAME] [--gpu 1-4] [--image-source 1-2] [--log-file PATH]"
            echo "On FreeBSD, Distrobox is skipped and native Wine is installed with pkg."
            exit 0 ;;
        *) shift ;;
    esac
done

# if uninstall flag passed, delegate to uninstaller script in same directory
if [ "$UNINSTALL" = true ]; then
    log "INFO" "Switching to uninstaller mode"
    exec bash "$(dirname "$0")/uninstall.sh" --container-name "$CONTAINER_NAME" $( [ "$NON_INTERACTIVE" = true ] && echo --yes ) $( [ "$DRY_RUN" = true ] && echo --dry-run )
fi

LAST_STEP="init"

fail(){
    local msg="$1"; shift
    echo
    log "ERROR" "$msg"
    echo "$LAST_STEP" > "$LAST_STEP_FILE" || true
    exit 1
}

trap 'rc=$?; if [ $rc -ne 0 ]; then log "ERROR" "Installer exited with code $rc (last step: $LAST_STEP)"; fi' EXIT

case "$HOST_OS" in
    Linux|FreeBSD) ;;
    *) fail "Unsupported host OS: $HOST_OS. Linux (Distrobox + Wine) and FreeBSD (native Wine) are supported." ;;
esac

# Helpers: download with retries and run commands (logs + dry-run)
download_with_retries(){
    local url="$1" dest="$2"
    local tries=0 max=5
    while [ $tries -lt $max ]; do
        tries=$((tries+1))
        if [ "$DRY_RUN" = true ]; then
            log "INFO" "DRY RUN: would download $url to $dest (attempt $tries)"
            return 0
        fi
        log "INFO" "Downloading $url (attempt $tries/$max)"
        curl --fail -L --retry 5 --retry-delay 2 --connect-timeout 15 --max-time 300 --progress-bar "$url" -o "$dest" 2>&1 | tee -a "$LOG_FILE"
        if [ ${PIPESTATUS[0]:-0} -eq 0 ]; then
            return 0
        fi
        sleep $((tries * 2))
    done
    return 1
}

# spinner for background operations
spinner(){
    local pid=$1
    local delay=0.1
    local spinstr='|/-\\'
    while ps -p $pid > /dev/null 2>&1; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        spinstr=$temp${spinstr%$temp}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
}

detect_gpu(){
    detected_gpu="none"
    if command -v nvidia-smi >/dev/null 2>&1 && nvidia-smi >/dev/null 2>&1; then
        detected_gpu="nvidia"
        return 0
    fi

    local pci=""
    if command -v lspci >/dev/null 2>&1; then
        pci="$(lspci 2>/dev/null | grep -Ei 'VGA|3D|Display' || true)"
    elif command -v pciconf >/dev/null 2>&1; then
        pci="$(pciconf -lv 2>/dev/null || true)"
    fi

    if printf '%s' "$pci" | grep -iq nvidia; then
        detected_gpu="nvidia"
    elif printf '%s' "$pci" | grep -Eiq 'AMD|ATI'; then
        detected_gpu="amd"
    elif printf '%s' "$pci" | grep -iq intel; then
        detected_gpu="intel"
    fi
}

# preflight checks
preflight(){
    log "INFO" "Running preflight checks on $HOST_OS"
    local cmds
    if [ "$HOST_OS" = "FreeBSD" ]; then
        cmds=(curl pkg)
    else
        cmds=(distrobox podman curl lspci)
    fi
    for cmd in "${cmds[@]}"; do
        if ! command -v "$cmd" &>/dev/null; then
            log "WARN" "Command $cmd not found. Installer may attempt to install it or fail."
            case $cmd in
                distrobox|podman)
                    echo "Install via your package manager (apt/pacman/dnf) or see https://github.com/89luca89/distrobox"
                    ;;
                curl)
                    echo "Install curl (pkg install curl, or apt install curl)"
                    ;;
                pkg)
                    echo "FreeBSD pkg is required to install Wine."
                    ;;
                lspci)
                    echo "Install pciutils (apt install pciutils)"
                    ;;
            esac
        fi
    done
    # network check
    if ! ping -c 1 github.com &>/dev/null; then
        log "WARN" "Network appears unreachable; downloads will fail."
        echo "WARNING: network check failed"
    fi
    if [ "$HOST_OS" != "FreeBSD" ] && command -v nvidia-smi &>/dev/null && nvidia-smi &>/dev/null && ! has_nvidia_container_support; then
        log "WARN" "Nvidia GPU detected but Podman CDI support is not configured. Install nvidia-container-toolkit and generate a CDI spec before using the Nvidia path."
        echo "WARNING: Nvidia container support is not configured for Podman."
        echo "Install nvidia-container-toolkit and generate /etc/cdi/nvidia.yaml, or use Generic rendering."
    fi
    # disk space (POSIX df -kP: avail is column 4)
    avail=$(df -kP . | awk 'NR==2 {print $4}')
    if [ -n "$avail" ] && [ "$avail" -lt 1048576 ]; then
        log "WARN" "Less than 1GB free; installation may fail."
    fi
    echo "preflight complete"
}


# Distrobox 1.7 (Ubuntu/Zorin) eval's the enter command with /bin/sh (dash).
# Never pass multiline scripts or paths with parentheses through this helper.
enter_container(){
    if [ "$DRY_RUN" = true ]; then
        log "INFO" "DRY RUN: would run in container: distrobox enter --no-workdir $CONTAINER_NAME -- $*"
        return 0
    fi
    distrobox enter --no-workdir "$CONTAINER_NAME" -- "$@" 2>&1 | tee -a "$LOG_FILE"
    return ${PIPESTATUS[0]:-0}
}

verify_container_setup(){
    enter_container /usr/bin/test -x /usr/local/bin/xToolStudio || return 1
    enter_container /usr/bin/test -f /usr/share/applications/xToolStudio.desktop || return 1
    log "INFO" "Verified launcher and desktop entry inside container $CONTAINER_NAME"
}

write_setup_env(){
    {
        printf 'XTOOL_URL=%q\n' "$XTOOL_URL"
        printf 'XTOOL_FORCE_SOFTWARE_RENDERING=%q\n' "$XTOOL_FORCE_SOFTWARE_RENDERING"
        printf 'XTOOL_LAUNCHER_SRC=%q\n' "$SETUP_DIR/xtool-studio-launcher.sh"
        printf 'XTOOL_SETUP_DIR=%q\n' "$SETUP_DIR"
        printf 'XTOOL_PAYLOAD_LIB=%q\n' "$SETUP_DIR/install-payload.sh"
        printf 'XTOOL_DRY_RUN=%q\n' "$DRY_RUN"
    } > "$SETUP_DIR/container-setup.env"
}

prepare_container_setup(){
    if [ ! -f "$CONTAINER_SETUP_SRC" ] || [ ! -f "$LAUNCHER_SRC" ] || [ ! -f "$PAYLOAD_SRC" ]; then
        fail "Missing installer scripts in $SCRIPT_DIR/scripts. Re-clone the repository and retry."
    fi

    mkdir -p "$SETUP_DIR"
    cp -f "$CONTAINER_SETUP_SRC" "$SETUP_DIR/container-setup.sh"
    cp -f "$LAUNCHER_SRC" "$SETUP_DIR/xtool-studio-launcher.sh"
    cp -f "$PAYLOAD_SRC" "$SETUP_DIR/install-payload.sh"
    chmod 0755 "$SETUP_DIR/container-setup.sh" "$SETUP_DIR/xtool-studio-launcher.sh" "$SETUP_DIR/install-payload.sh"
    write_setup_env
}

prepare_freebsd_setup(){
    if [ ! -f "$FREEBSD_SETUP_SRC" ] || [ ! -f "$LAUNCHER_SRC" ] || [ ! -f "$PAYLOAD_SRC" ]; then
        fail "Missing FreeBSD installer scripts in $SCRIPT_DIR/scripts. Re-clone the repository and retry."
    fi

    mkdir -p "$SETUP_DIR"
    cp -f "$FREEBSD_SETUP_SRC" "$SETUP_DIR/install-freebsd.sh"
    cp -f "$LAUNCHER_SRC" "$SETUP_DIR/xtool-studio-launcher.sh"
    cp -f "$PAYLOAD_SRC" "$SETUP_DIR/install-payload.sh"
    chmod 0755 "$SETUP_DIR/install-freebsd.sh" "$SETUP_DIR/xtool-studio-launcher.sh" "$SETUP_DIR/install-payload.sh"
    write_setup_env
}


# --- Download URL for the latest Windows installer ---
# (may be overridden with --url)

# if --check was given, run preflight and exit
if [ "$PRECHECK" = true ]; then
    preflight
    exit 0
fi

resolve_latest_xtool_url


# --- GPU Selection ---
# detect hardware and ask the user to choose a driver stack

echo -e "\n${YELLOW}--- GPU Selection ---${NC}"

# allow overriding via CLI
if [ -n "$gpu_choice" ]; then
    log "INFO" "Using GPU selection from CLI: $gpu_choice"
fi
detect_gpu

echo -e "Detected Hardware: ${GREEN}$detected_gpu${NC}"

gpu_default="4"
case $detected_gpu in
    "nvidia") gpu_default="1" ;;
    "amd")    gpu_default="2" ;;
    "intel")  gpu_default="3" ;;
esac

if [ "$HOST_OS" = "FreeBSD" ]; then
    echo "1) Nvidia (host nvidia-driver)"
    echo "2) AMD (host drm-kmod / graphics/gpu-firmware-*)"
    echo "3) Intel (host drm-kmod)"
    echo "4) Generic / None / Software Rendering"
else
    echo "1) Nvidia (uses --nvidia flag)"
    echo "2) AMD (uses DRI pass-through)"
    echo "3) Intel (uses DRI pass-through)"
    echo "4) Generic / None / Software Rendering"
fi
if [ -n "$gpu_choice" ]; then
    log "INFO" "Using GPU from CLI: $gpu_choice"
elif [ "$NON_INTERACTIVE" = true ]; then
    gpu_choice=$gpu_default
    log "INFO" "Non-interactive: selecting GPU stack $gpu_choice"
else
    read -p "Select Driver Stack [$gpu_default]: " gpu_choice
    gpu_choice=${gpu_choice:-$gpu_default}
fi

if [ "$gpu_choice" = "1" ] && [ "$HOST_OS" != "FreeBSD" ] && ! has_nvidia_container_support; then
    echo -e "${YELLOW}Nvidia GPU detected, but Podman GPU support is not configured.${NC}"
    echo "Install nvidia-container-toolkit and generate /etc/cdi/nvidia.yaml to use the Nvidia path."
    if [ "$NON_INTERACTIVE" = true ]; then
        log "WARN" "Nvidia container support is unavailable; falling back to Generic / software rendering."
        gpu_choice=4
    else
        echo "1) Fall back to Generic / None / Software Rendering"
        echo "2) Abort and configure Nvidia container support first"
        read -p "Selection [1]: " nvidia_fallback_choice
        nvidia_fallback_choice=${nvidia_fallback_choice:-1}
        if [ "$nvidia_fallback_choice" = "2" ]; then
            fail "Aborted so Nvidia container support can be configured first."
        fi
        log "WARN" "Nvidia container support is unavailable; falling back to Generic / software rendering."
        gpu_choice=4
    fi
fi

GPU_FLAG=""
ADD_FLAGS=""
GPU_TYPE="generic"
CONTAINERFILE="containerfile.amd"
XTOOL_FORCE_SOFTWARE_RENDERING=1

case $gpu_choice in
    1) GPU_FLAG="--nvidia"; GPU_TYPE="nvidia"; CONTAINERFILE="containerfile.nvidia"; XTOOL_FORCE_SOFTWARE_RENDERING=0 ;;
    2) ADD_FLAGS="--device /dev/dri:/dev/dri"; GPU_TYPE="amd"; CONTAINERFILE="containerfile.amd"; XTOOL_FORCE_SOFTWARE_RENDERING=0 ;;
    3) ADD_FLAGS="--device /dev/dri:/dev/dri"; GPU_TYPE="intel"; CONTAINERFILE="containerfile.intel"; XTOOL_FORCE_SOFTWARE_RENDERING=0 ;;
    *) GPU_TYPE="generic"; CONTAINERFILE="containerfile.amd" ;;
esac

if [ "$HOST_OS" = "FreeBSD" ]; then
    echo -e "\n${YELLOW}FreeBSD host detected. Distrobox is Linux-only; installing native Wine.${NC}"
    LAST_STEP="freebsd:packages"
    log "INFO" "Starting FreeBSD native Wine install. Logs: $LOG_FILE"
    prepare_freebsd_setup
    if [ "$DRY_RUN" = true ]; then
        log "INFO" "DRY RUN: would run $SETUP_DIR/install-freebsd.sh"
        echo -e "${GREEN}DRY RUN complete (FreeBSD native Wine path).${NC}"
        exit 0
    fi
    bash "$SETUP_DIR/install-freebsd.sh" 2>&1 | tee -a "$LOG_FILE"
    freebsd_rc=${PIPESTATUS[0]:-0}
    if [ "$freebsd_rc" -ne 0 ]; then
        fail "FreeBSD Wine setup failed. See $LOG_FILE for details."
    fi
    if [ ! -f "$HOME/.local/share/applications/xToolStudio.desktop" ]; then
        fail "Desktop file was not created. See $LOG_FILE for details."
    fi
    echo -e "${GREEN}Installation successful!${NC}"
    echo -e "Launch from the app menu, or run: $HOME/.local/bin/xToolStudio"
    echo -e "If the menu entry is missing, add ~/.local/bin to PATH and log out/in."
    exit 0
fi

# --- Step 2: Image Source ---
echo -e "\n${YELLOW}--- Step 2: Image Source ---${NC}"
echo "1) Standard Ubuntu 24.04 from DockerHub (Default)"
echo "2) Custom Local Containerfile (Build locally)"
if [ -n "$img_choice" ]; then
    log "INFO" "Using image source from CLI: $img_choice"
elif [ "$NON_INTERACTIVE" = true ]; then
    img_choice=1
    log "INFO" "Non-interactive: selecting image source $img_choice"
else
    read -p "Selection [1]: " img_choice
    img_choice=${img_choice:-1}
fi

# Inform user what's next and where logs will go
LAST_STEP="start"
log "INFO" "Starting installation loop. Output will stream to console and $LOG_FILE"
echo -e "\nStarting installation — streaming output to console and log: $LOG_FILE\n"

# --- Step 3: Installation Loop with DNS Retry ---
SUCCESS=false
USE_DNS=false

while [ "$SUCCESS" = false ]; do
    # Cleanup old container if exists
    if distrobox list | grep -q "$CONTAINER_NAME"; then
        if [ "$DRY_RUN" = true ]; then
            log "INFO" "DRY RUN: would remove existing container $CONTAINER_NAME"
        else
            distrobox rm -f "$CONTAINER_NAME"
        fi
    fi

    CURRENT_ADD_FLAGS="$ADD_FLAGS"
    if [ "$USE_DNS" = true ]; then
        echo -e "${YELLOW}DNS/Network issues detected. Re-creating container with explicit DNS (1.1.1.1)...${NC}"
        CURRENT_ADD_FLAGS="$CURRENT_ADD_FLAGS --dns 1.1.1.1 --dns 8.8.8.8"
    fi

    # Host Dependencies
    LAST_STEP="host:deps"
    missing_host_deps=()
    for host_dep in distrobox podman; do
        if ! command -v "$host_dep" &>/dev/null; then
            missing_host_deps+=("$host_dep")
        fi
    done

    if [ ${#missing_host_deps[@]} -eq 0 ]; then
        log "INFO" "Host dependencies already present: distrobox, podman"
    elif [ "$DRY_RUN" = true ]; then
        log "INFO" "DRY RUN: would install missing host dependencies via system package manager: ${missing_host_deps[*]}"
    else
        log "INFO" "Installing missing host dependencies: ${missing_host_deps[*]}"
        if command -v pacman &> /dev/null; then
            run_logged sudo pacman -S --needed --noconfirm "${missing_host_deps[@]}" || fail "Failed to install host dependencies. See $LOG_FILE for details."
        elif command -v apt &> /dev/null; then
            run_logged sudo apt update || fail "Failed to update apt metadata. See $LOG_FILE for details."
            run_logged sudo apt install -y "${missing_host_deps[@]}" || fail "Failed to install host dependencies. See $LOG_FILE for details."
        elif command -v dnf &> /dev/null; then
            run_logged sudo dnf install -y "${missing_host_deps[@]}" || fail "Failed to install host dependencies. See $LOG_FILE for details."
        else
            fail "Unknown package manager. Please install these dependencies manually: ${missing_host_deps[*]}"
        fi
    fi

    # Image Preparation
    IMAGE_NAME="ubuntu:24.04"
    if [ "$img_choice" == "2" ]; then
        if [ -f "$CONTAINERFILE" ]; then
            log "INFO" "Building local image from $CONTAINERFILE"
            if [ "$DRY_RUN" = true ]; then
                log "INFO" "DRY RUN: would run podman build -t xtool-custom-$GPU_TYPE -f $CONTAINERFILE ."
            else
                run_logged podman build -t "xtool-custom-$GPU_TYPE" -f "$CONTAINERFILE" . || fail "Image build failed. See $LOG_FILE for details."
            fi
            IMAGE_NAME="xtool-custom-$GPU_TYPE"
        else
            echo -e "${RED}Warning: $CONTAINERFILE not found, using standard image.${NC}"
        fi
    fi

    echo -e "${BLUE}Creating Distrobox container...${NC}"
    LAST_STEP="container:create"
    build_distrobox_create_cmd "$IMAGE_NAME" "$GPU_FLAG" "$CURRENT_ADD_FLAGS"
    if [ "$DRY_RUN" = true ]; then
        log "INFO" "DRY RUN: would run: ${DBX_CREATE_CMD[*]}"
    else
        run_logged "${DBX_CREATE_CMD[@]}" || fail "Container creation failed. See $LOG_FILE for details."
    fi

    echo -e "\n${YELLOW}Installing basic packages. This might take a few minutes...${NC}"

    LAST_STEP="install:packages"
    log "INFO" "Installing packages and downloading application inside container"
    prepare_container_setup

    if [ "$DRY_RUN" = true ]; then
        log "INFO" "DRY RUN: would run $SETUP_DIR/container-setup.sh inside container"
        SUCCESS=true
    else
        enter_container /bin/bash "$SETUP_DIR/container-setup.sh"
        install_rc=$?
        if [ $install_rc -eq 0 ] && verify_container_setup; then
            SUCCESS=true
        else
            if [ $install_rc -eq 0 ]; then
                install_rc=1
                log "ERROR" "Container setup returned success, but /usr/local/bin/xToolStudio or its desktop entry is missing inside $CONTAINER_NAME"
            fi
            if [ "$USE_DNS" = false ]; then
                log "WARN" "Installation inside container failed (rc=$install_rc). Retrying with DNS fix..."
                USE_DNS=true
            else
                fail "Installation failed twice. See $LOG_FILE for details."
            fi
        fi
    fi
done

# --- Step 4: Export & Final Fixes ---
echo -e "\n${BLUE}🔗 Exporting application and applying fixes...${NC}"
LAST_STEP="export:app"
log "INFO" "Exporting application"
if [ "$DRY_RUN" = true ]; then
    log "INFO" "DRY RUN: would run distrobox-export for xToolStudio"
else
    enter_container distrobox-export --app xToolStudio || fail "Application export failed. See $LOG_FILE for details."
fi

D_FILES=()
if [ -d "$HOME/.local/share/applications" ]; then
    while IFS= read -r desktop_file; do
        D_FILES+=("$desktop_file")
    done < <(find "$HOME/.local/share/applications" -maxdepth 1 -iname "*xToolStudio*.desktop" | sort)

    if [ ${#D_FILES[@]} -eq 0 ]; then
        while IFS= read -r desktop_file; do
            D_FILES+=("$desktop_file")
        done < <(find "$HOME/.local/share/applications" -maxdepth 1 -iname "*xtool*.desktop" | sort)
    fi
fi

if [ ${#D_FILES[@]} -gt 0 ]; then
    for D_FILE in "${D_FILES[@]}"; do
        sed -i 's|/run/host||' "$D_FILE"
    done

    [ -x "$(command -v update-desktop-database)" ] && update-desktop-database ~/.local/share/applications
    echo -e "${GREEN}Installation successful!${NC}"
    echo -e "You can now find 'xTool Studio' in your app menu."
    echo "The launcher is inside the '$CONTAINER_NAME' container; the host's /usr/local/bin is not used."
    echo "Runtime log: $HOME/.cache/xtool-studio-cachy-box/launch.log"
else
    if [ "$DRY_RUN" = true ]; then
        log "INFO" "DRY RUN: desktop file would be created at ~/.local/share/applications/*xtool*.desktop"
        exit 0
    fi
    echo -e "${RED}Export failed. Desktop file not found.${NC}"
    echo "See $LOG_FILE for details"
    exit 1
fi
