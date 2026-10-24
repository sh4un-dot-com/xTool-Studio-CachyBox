# xTool Studio Cachy Box
### xTool Studio: Containerized Windows Runtime for CachyOS and Fedora

This repository installs xTool Studio inside an Ubuntu 24.04 container using Distrobox and Podman, then runs the official Windows build through Wine. The goal is to give CachyOS and Fedora users a repeatable way to run xTool Studio even though xTool does not publish a Linux build.

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
- GPU-aware container setup for Nvidia, AMD, Intel, or software rendering.
- Works on host systems such as CachyOS and Fedora by isolating Wine and Ubuntu dependencies in the container.
- Persistent Wine prefix and installer cache under `~/.local/share/xtool-studio/`.
- Desktop integration through `distrobox-export`.
- Optional local image builds through `containerfile.amd`, `containerfile.intel`, and `containerfile.nvidia`.
- DNS retry path for container creation when upstream downloads fail due to name resolution.

---

## Important Notes

- xTool officially supports Windows and macOS, not Linux. This repository is an unofficial compatibility layer.
- The first launch may open the Windows installer inside Wine. Complete the installer, then relaunch from the exported desktop entry if the app does not start automatically.
- Device connectivity, camera features, and hardware-specific workflows may still have Wine limitations.

---

## Prerequisites

Install these on the host:

- `podman`
- `distrobox`
- `curl`
- `bash`
- `nvidia-container-toolkit` plus a CDI spec such as `/etc/cdi/nvidia.yaml` if you want the Nvidia path

---

## Installation

1. Clone the repository.

```bash
git clone https://github.com/AkitaEngineering/xTool-Studio-CachyBox.git
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

4. Answer the prompts for GPU stack and image source.

The installer will:

- detect your GPU,
- optionally build a local image,
- resolve the latest xTool Studio Windows installer,
- create the Distrobox container,
- install Wine and runtime dependencies in the container,
- export `xToolStudio` to your desktop menu.

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

- Host cache, logs, and copied container setup scripts: `~/.cache/xtool-studio-cachy-box/`
- Host Wine data and downloaded installer: `~/.local/share/xtool-studio/`
- Exported launcher inside the container: `/usr/local/bin/xToolStudio`
- Exported desktop entry inside the container: `/usr/share/applications/xToolStudio.desktop`

---

## Podman Compose

You can also run the compose setup directly.

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
- Unsupported host expectation: xTool does not support Linux officially, so some features may still require a Windows machine.

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
