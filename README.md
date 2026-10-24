# xTool Studio Cachy Box
### xTool Studio: Windows runtime for Linux (Distrobox) and FreeBSD (native Wine)

This repository installs the official xTool Studio Windows build through Wine. On Linux it uses an Ubuntu 24.04 Distrobox/Podman container. On FreeBSD it installs native Wine with `pkg` and skips Distrobox, which is Linux-only. The goal is a repeatable way to run xTool Studio on CachyOS, Fedora, and FreeBSD even though xTool does not publish a Linux or FreeBSD build.

---

## What Changed

This project no longer installs a Linux AppImage. It now:

- resolves the latest xTool Studio Windows installer from xTool support pages,
- downloads the official `.exe` into a persistent per-user cache,
- initializes a Wine prefix inside the container,
- launches the xTool Studio installer on first run,
- exports a desktop launcher through Distrobox so the app behaves like a native entry.

The project name is now **xTool Studio Cachy Box**.

---

## Features

- Automatic latest-release lookup from xTool release notes, with `--url` and `XTOOL_URL` overrides.
- GPU-aware setup for Nvidia, AMD, Intel, or software rendering.
- Linux hosts such as CachyOS and Fedora isolate Wine in an Ubuntu Distrobox container.
- FreeBSD hosts use native Wine from `pkg` (`emulators/wine`) with the same Wine prefix layout.
- Persistent Wine prefix and installer cache under `~/.local/share/xtool-studio/`.
- Desktop integration through `distrobox-export` on Linux, or a user desktop entry on FreeBSD.
- Optional local image builds through `containerfile.amd`, `containerfile.intel`, and `containerfile.nvidia`.
- DNS retry path for container creation when upstream downloads fail due to name resolution.

---

## Important Notes

- xTool officially supports Windows and macOS. This repository is an unofficial compatibility layer for Linux and FreeBSD.
- The first launch may open the Windows installer inside Wine. Complete the installer, then relaunch from the exported desktop entry if the app does not start automatically.
- Device connectivity, camera features, and hardware-specific workflows may still have Wine limitations.

---

## Prerequisites

**Linux**

- `podman`
- `distrobox`
- `curl`
- `bash`
- `nvidia-container-toolkit` plus a CDI spec such as `/etc/cdi/nvidia.yaml` if you want the Nvidia path

**FreeBSD 14.3+ / 15+**

- `bash` (`pkg install bash`)
- `curl`
- `pkg` (base)
- `doas` or `sudo` for package installs
- Graphics drivers on the host (`nvidia-driver` or `drm-kmod`) if you want hardware rendering

The installer will install `wine` and extract tools with `pkg` when they are missing. Distrobox and Podman are not used on FreeBSD.

---

## Installation

1. Clone the repository.

```bash
git clone https://github.com/sh4un-dot-com/xTool-Studio-CachyBox.git
cd xTool-Studio-CachyBox
```

2. Run the Bash installer.

```bash
chmod +x install.sh
./install.sh
```

3. If you prefer calling the Fish entrypoint, it delegates to the same Bash installer.

```fish
chmod +x install.fish
./install.fish
```

4. Answer the prompts for GPU stack and, on Linux, image source.

On Linux the installer will:

- detect your GPU,
- optionally build a local image,
- resolve the latest xTool Studio Windows installer,
- create the Distrobox container,
- install Wine and runtime dependencies in the container,
- export `xToolStudio` to your desktop menu.

On FreeBSD it skips Distrobox and the image-source prompt, installs native Wine with `pkg`, extracts the Windows payload into `~/.local/share/xtool-studio/`, and writes `~/.local/bin/xToolStudio` plus a desktop entry.

---

## Command-Line Options

| Flag | Scope | Description |
| :--- | :--- | :--- |
| `--check` | Bash / Fish | Run prerequisite checks and exit. |
| `--dry-run` | Bash / Fish | Print what would happen without changing the system. |
| `--non-interactive`, `--yes`, `-y` | Bash / Fish | Accept defaults automatically. |
| `--uninstall` | Bash / Fish | Delegate to the matching uninstaller. |
| `--url URL` | Bash / Fish | Use a specific xTool Studio Windows installer URL instead of auto-resolving the latest one. |
| `--container-name NAME` | Bash / Fish | Override the default container name, `xtool-studio`. |
| `--gpu 1-4` | Bash / Fish | Preselect the driver stack: `1` Nvidia, `2` AMD, `3` Intel, `4` software rendering. |
| `--image-source 1-2` | Bash / Fish | Choose `1` for the stock Ubuntu image or `2` for a local image build. |
| `--log-file PATH` | Bash / Fish | Write logs to a custom path. |

### Examples

```bash
./install.sh --check
./install.sh --non-interactive --gpu 2 --image-source 2
./install.sh --dry-run --container-name xtool-studio-test
./install.sh --url https://storage.atomm.com/.../xTool-Studio-x64-1.6.6.exe
```

---

## Runtime Layout

The installer uses these locations:

- Host cache, logs, and copied setup scripts: `~/.cache/xtool-studio-cachy-box/`
- Host Wine data and downloaded installer: `~/.local/share/xtool-studio/`
- Linux launcher inside the container: `/usr/local/bin/xToolStudio`
- Linux desktop entry inside the container: `/usr/share/applications/xToolStudio.desktop`
- FreeBSD launcher: `~/.local/bin/xToolStudio`
- FreeBSD desktop entry: `~/.local/share/applications/xToolStudio.desktop`

---

## Podman Compose

Linux only. You can also run the compose setup directly.

1. Optionally select a local image and containerfile.

```bash
export XTOOL_IMAGE=xtool-custom-amd
export XTOOL_CONTAINERFILE=containerfile.amd
```

2. Optionally pin a specific upstream Windows installer.

```bash
export XTOOL_URL=https://storage.atomm.com/.../xTool-Studio-x64-1.6.6.exe
```

3. Launch.

```bash
podman compose up
```

The compose service follows the same pattern as the installer: download the Windows `.exe`, initialize a Wine prefix, and launch xTool Studio from inside the container.

---

## Uninstallation

Run:

```bash
./uninstall.sh
```

Or use the Fish wrapper:

```fish
./uninstall.fish
```

The uninstaller removes:

- the Distrobox export,
- the Distrobox container,
- local custom Podman images matching `xtool-custom-*`,
- exported desktop entries and launchers.

It can also remove `~/.local/share/xtool-studio/`, which contains the Wine prefix and cached installer.

---

## Troubleshooting

- After cloning, enter the GitHub directory name `xTool-Studio-CachyBox`.
- `distrobox-enter: eval: Syntax error: "(" unexpected`: Distrobox 1.7 on Ubuntu, Zorin, and other Debian-based hosts evaluates `distrobox enter` with `/bin/sh` (dash). This installer now copies `scripts/container-setup.sh` into `~/.cache/xtool-studio-cachy-box/` and runs that file. Update the repository and rerun `./install.sh`.
- DNS failures: the installer retries container creation with explicit DNS servers.
- Nvidia failures during container creation: configure Podman CDI support first.
- Blank or unstable rendering: retry with `--gpu 4` to force software rendering.
- Installer opens but no app launches afterward: finish the xTool Studio installer in Wine, then relaunch the exported desktop entry.
- FreeBSD: Distrobox is not used. Install `bash` first (`pkg install bash`), then `./install.sh`. Launch with `~/.local/bin/xToolStudio` if the desktop menu does not pick up `~/.local/bin`.
- FreeBSD GPU: install host drivers yourself (`nvidia-driver` or `drm-kmod`). `--gpu 4` forces software rendering in the launcher.
- Unsupported host expectation: xTool does not support Linux or FreeBSD officially, so some features may still require a Windows machine.

---

## Upgrade Flow

Rerun the installer:

```bash
git pull
./install.sh
```

By default, the script resolves the newest Windows installer it can detect from xTool support pages. If you need a known-good version, rerun with `--url`.

---

## License

The automation code in this repository is provided under the MIT License.

xTool Studio itself is proprietary software owned by xTool and is not redistributed under the repository license.

See `LICENSE.md` for details.
