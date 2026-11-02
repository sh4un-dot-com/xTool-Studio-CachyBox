#!/usr/bin/env python3
"""Map xTool Studio first-run windows on X11/XWayland if the compositor hides them.

xTool 1.9.11 country/privacy/plan dialogs are patched to show:true with a normal
frame so Wine maps a real HWND. This helper is a safety net: GNOME/Mutter may
still unmap a Distrobox X11 client. Remap those dialogs, rewrite
WM_CLIENT_MACHINE to the host name so GNOME does not treat them as remote,
grow the client if GNOME CSD clipped Confirm, and leave IME/ANGLE surfaces
alone.

On GNOME-family compositors, also drop WM decorations (Mutter stacks CSD on
Wine's framed HWND and clips the Start Page menu) and clear always-on-top on
the Start Page. KWin replaces the caption instead of stacking, so KDE is left
decorated.

Frameless show:true native-crashes under Wine; do not strip the window frame.
"""
from __future__ import annotations

import os
import signal
import sys
import time
from ctypes import (
    CFUNCTYPE,
    POINTER,
    Structure,
    Union,
    byref,
    c_char,
    c_char_p,
    c_int,
    c_long,
    c_short,
    c_uint,
    c_ulong,
    c_void_p,
    cast,
    cdll,
    string_at,
)
from ctypes.util import find_library

MIN_W, MIN_H = 400, 300
MAX_W, MAX_H = 1600, 1200
SKIP_NAMES = ("ime", "angle intermediate", "start page")
KEEP_NAMES = (
    "please select",
    "country or region",
    "privacy",
    "improvement",
    "join xtool",
)
# GNOME CSD eats the framed Electron client. Grow these so Confirm is visible.
GROW_COUNTRY = (800, 560)
GROW_IMPROVE = (1100, 720)

IsViewable = 2
ClientMessage = 33
PropModeReplace = 0
XA_STRING = 31
StructureNotifyMask = 1 << 17
SubstructureNotifyMask = 1 << 20
SubstructureRedirectMask = 1 << 19
RootEventMask = SubstructureNotifyMask | SubstructureRedirectMask
NetWmStateRemove = 0
NormalState = 1
MWM_HINTS_DECORATIONS = 2

_running = True


class XWindowAttributes(Structure):
    _fields_ = [
        ("x", c_int),
        ("y", c_int),
        ("width", c_int),
        ("height", c_int),
        ("border_width", c_int),
        ("depth", c_int),
        ("visual", c_void_p),
        ("root", c_ulong),
        ("c_class", c_int),
        ("bit_gravity", c_int),
        ("win_gravity", c_int),
        ("backing_store", c_int),
        ("backing_planes", c_ulong),
        ("backing_pixel", c_ulong),
        ("save_under", c_int),
        ("colormap", c_ulong),
        ("map_installed", c_int),
        ("map_state", c_int),
        ("all_event_masks", c_long),
        ("your_event_mask", c_long),
        ("do_not_propagate_mask", c_long),
        ("override_redirect", c_int),
        ("screen", c_void_p),
    ]


class XClassHint(Structure):
    # c_void_p so XFree() receives the real Xlib pointer, not a ctypes string copy.
    _fields_ = [("res_name", c_void_p), ("res_class", c_void_p)]


class XClientMessageData(Union):
    _fields_ = [("b", c_char * 20), ("s", c_short * 10), ("l", c_long * 5)]


class XClientMessageEvent(Structure):
    _fields_ = [
        ("type", c_int),
        ("serial", c_ulong),
        ("send_event", c_int),
        ("display", c_void_p),
        ("window", c_ulong),
        ("message_type", c_ulong),
        ("format", c_int),
        ("data", XClientMessageData),
    ]


class XEvent(Union):
    _fields_ = [
        ("type", c_int),
        ("xclient", XClientMessageEvent),
        ("pad", c_long * 24),
    ]


ErrorHandler = CFUNCTYPE(c_int, c_void_p, c_void_p)


def _load_x11():
    name = find_library("X11") or "libX11.so.6"
    lib = cdll.LoadLibrary(name)
    lib.XOpenDisplay.argtypes = [c_char_p]
    lib.XOpenDisplay.restype = c_void_p
    lib.XDefaultRootWindow.argtypes = [c_void_p]
    lib.XDefaultRootWindow.restype = c_ulong
    lib.XQueryTree.argtypes = [
        c_void_p,
        c_ulong,
        POINTER(c_ulong),
        POINTER(c_ulong),
        POINTER(POINTER(c_ulong)),
        POINTER(c_uint),
    ]
    lib.XQueryTree.restype = c_int
    lib.XGetWindowAttributes.argtypes = [c_void_p, c_ulong, POINTER(XWindowAttributes)]
    lib.XGetWindowAttributes.restype = c_int
    lib.XFetchName.argtypes = [c_void_p, c_ulong, POINTER(POINTER(c_char))]
    lib.XFetchName.restype = c_int
    lib.XGetClassHint.argtypes = [c_void_p, c_ulong, POINTER(XClassHint)]
    lib.XGetClassHint.restype = c_int
    lib.XMapRaised.argtypes = [c_void_p, c_ulong]
    lib.XMapRaised.restype = c_int
    lib.XResizeWindow.argtypes = [c_void_p, c_ulong, c_uint, c_uint]
    lib.XResizeWindow.restype = c_int
    lib.XFlush.argtypes = [c_void_p]
    lib.XFlush.restype = c_int
    lib.XFree.argtypes = [c_void_p]
    lib.XFree.restype = c_int
    lib.XSync.argtypes = [c_void_p, c_int]
    lib.XSync.restype = c_int
    lib.XSetErrorHandler.argtypes = [c_void_p]
    lib.XSetErrorHandler.restype = c_void_p
    lib.XInternAtom.argtypes = [c_void_p, c_char_p, c_int]
    lib.XInternAtom.restype = c_ulong
    lib.XChangeProperty.argtypes = [
        c_void_p,
        c_ulong,
        c_ulong,
        c_ulong,
        c_int,
        c_int,
        c_void_p,
        c_int,
    ]
    lib.XChangeProperty.restype = c_int
    lib.XSendEvent.argtypes = [c_void_p, c_ulong, c_int, c_long, c_void_p]
    lib.XSendEvent.restype = c_int
    lib.XSelectInput.argtypes = [c_void_p, c_ulong, c_long]
    lib.XSelectInput.restype = c_int
    lib.XCreateSimpleWindow.argtypes = [
        c_void_p,
        c_ulong,
        c_int,
        c_int,
        c_uint,
        c_uint,
        c_uint,
        c_ulong,
        c_ulong,
    ]
    lib.XCreateSimpleWindow.restype = c_ulong
    lib.XStoreName.argtypes = [c_void_p, c_ulong, c_char_p]
    lib.XStoreName.restype = c_int
    lib.XSetClassHint.argtypes = [c_void_p, c_ulong, POINTER(XClassHint)]
    lib.XSetClassHint.restype = c_int
    lib.XUnmapWindow.argtypes = [c_void_p, c_ulong]
    lib.XUnmapWindow.restype = c_int
    lib.XDestroyWindow.argtypes = [c_void_p, c_ulong]
    lib.XDestroyWindow.restype = c_int
    lib.XCloseDisplay.argtypes = [c_void_p]
    lib.XCloseDisplay.restype = c_int
    return lib


def _ignore_xerror(_dpy, _event):
    return 0


def _decode_xstr(ptr):
    if not ptr:
        return ""
    try:
        return string_at(ptr).decode("utf-8", "replace")
    except (ValueError, OSError):
        return ""


def window_name(lib, dpy, win):
    name = POINTER(c_char)()
    if lib.XFetchName(dpy, win, byref(name)) and name:
        title = _decode_xstr(name)
        lib.XFree(name)
        return title
    return ""


def window_class(lib, dpy, win):
    hint = XClassHint()
    if not lib.XGetClassHint(dpy, win, byref(hint)):
        return ""
    blob = f"{_decode_xstr(hint.res_name)} {_decode_xstr(hint.res_class)}".strip()
    if hint.res_name:
        lib.XFree(hint.res_name)
    if hint.res_class:
        lib.XFree(hint.res_class)
    return blob


def walk(lib, dpy, win, rows):
    attrs = XWindowAttributes()
    if not lib.XGetWindowAttributes(dpy, win, byref(attrs)):
        return
    name = window_name(lib, dpy, win)
    cls = window_class(lib, dpy, win)
    blob = f"{name} {cls}".lower()
    if "xtool" in blob or "atomm" in blob:
        rows.append((win, name, cls, attrs))
    root = c_ulong()
    parent = c_ulong()
    children = POINTER(c_ulong)()
    nchildren = c_uint()
    if not lib.XQueryTree(dpy, win, byref(root), byref(parent), byref(children), byref(nchildren)):
        return
    try:
        for i in range(nchildren.value):
            walk(lib, dpy, children[i], rows)
    finally:
        if children:
            lib.XFree(children)


def is_gnome_family():
    blob = " ".join(
        [
            os.environ.get("XDG_CURRENT_DESKTOP", ""),
            os.environ.get("DESKTOP_SESSION", ""),
            os.environ.get("XDG_SESSION_DESKTOP", ""),
        ]
    ).lower()
    if any(token in blob for token in ("gnome", "zorin", "budgie", "cinnamon", "unity")):
        return True
    return bool(os.environ.get("GNOME_SHELL_SESSION_MODE") or os.environ.get("GNOME_SETUP_DISPLAY"))


def is_start_page(name):
    return "start page" in (name or "").lower()


def is_first_run_dialog(name, cls, attrs):
    blob = f"{name} {cls}".lower()
    if any(skip in blob for skip in SKIP_NAMES):
        return False
    if attrs.width < MIN_W or attrs.height < MIN_H:
        return False
    if attrs.width > MAX_W or attrs.height > MAX_H:
        return False
    return any(keep in blob for keep in KEEP_NAMES)


def should_undecorate(name, cls, attrs):
    blob = f"{name} {cls}".lower()
    if any(skip in blob for skip in SKIP_NAMES) and "start page" not in blob:
        return False
    if is_start_page(name) or is_first_run_dialog(name, cls, attrs):
        return True
    if attrs.width < MIN_W or attrs.height < MIN_H:
        return False
    if "ime" in blob or "angle intermediate" in blob:
        return False
    return "xtool studio" in blob


def grow_target(name):
    blob = name.lower()
    if "improvement" in blob or "privacy" in blob or "join xtool" in blob:
        return GROW_IMPROVE
    if "please select" in blob or "country or region" in blob:
        return GROW_COUNTRY
    return None


def host_machine_name():
    for path in ("/run/host/etc/hostname", "/etc/hostname"):
        try:
            with open(path, encoding="utf-8", errors="replace") as fh:
                name = fh.readline().strip()
            if name:
                return name
        except OSError:
            continue
    return os.uname().nodename.split(".")[0]


def intern(lib, dpy, name):
    return lib.XInternAtom(dpy, name, 0)


def send_client_message(lib, dpy, dest, win, message_type, mask, values):
    ev = XEvent()
    ev.xclient.type = ClientMessage
    ev.xclient.serial = 0
    ev.xclient.send_event = 1
    ev.xclient.display = dpy
    ev.xclient.window = win
    ev.xclient.message_type = message_type
    ev.xclient.format = 32
    for i, value in enumerate(values[:5]):
        ev.xclient.data.l[i] = value
    lib.XSendEvent(dpy, dest, 0, mask, byref(ev))


def set_client_machine(lib, dpy, win, atom, hostname):
    payload = hostname.encode("utf-8")
    lib.XChangeProperty(
        dpy, win, atom, XA_STRING, 8, PropModeReplace, payload, len(payload)
    )


def set_normal_state(lib, dpy, win, wm_state_atom):
    data = (c_uint * 2)(NormalState, 0)
    lib.XChangeProperty(
        dpy, win, wm_state_atom, wm_state_atom, 32, PropModeReplace, data, 2
    )


def set_motif_undecorated(lib, dpy, win, motif_atom):
    # flags=MWM_HINTS_DECORATIONS, decorations=0. Mutter then skips CSD.
    data = (c_long * 5)(MWM_HINTS_DECORATIONS, 0, 0, 0, 0)
    lib.XChangeProperty(dpy, win, motif_atom, motif_atom, 32, PropModeReplace, data, 5)


def drop_above_state(lib, dpy, win, atoms):
    send_client_message(
        lib,
        dpy,
        lib.XDefaultRootWindow(dpy),
        win,
        atoms["_NET_WM_STATE"],
        RootEventMask,
        (NetWmStateRemove, atoms["_NET_WM_STATE_ABOVE"], 0, 1, 0),
    )


def maybe_grow_window(lib, dpy, win, name, attrs, grown):
    if win in grown:
        return False
    target = grow_target(name)
    if target is None:
        grown.add(win)
        return False
    tw, th = target
    if attrs.width >= tw and attrs.height >= th:
        grown.add(win)
        return False
    nw, nh = max(attrs.width, tw), max(attrs.height, th)
    lib.XResizeWindow(dpy, win, nw, nh)
    grown.add(win)
    print(
        f"xtool-map-windows: grew 0x{win:x} {attrs.width}x{attrs.height} -> {nw}x{nh} name={name!r}",
        flush=True,
    )
    return True


def reveal_window(lib, dpy, win, atoms, hostname, selected):
    root = lib.XDefaultRootWindow(dpy)
    if win not in selected:
        lib.XSelectInput(dpy, win, StructureNotifyMask)
        selected.add(win)
    set_client_machine(lib, dpy, win, atoms["WM_CLIENT_MACHINE"], hostname)
    lib.XMapRaised(dpy, win)
    set_normal_state(lib, dpy, win, atoms["WM_STATE"])
    send_client_message(
        lib,
        dpy,
        root,
        win,
        atoms["_NET_WM_STATE"],
        RootEventMask,
        (NetWmStateRemove, atoms["_NET_WM_STATE_HIDDEN"], 0, 1, 0),
    )


def map_candidates(
    lib,
    dpy,
    atoms,
    hostname,
    seen,
    selected,
    remap_counts,
    retitled=None,
    grown=None,
    undecorated=None,
    unpinned=None,
    gnome=None,
):
    if retitled is None:
        retitled = set()
    if grown is None:
        grown = set()
    if undecorated is None:
        undecorated = set()
    if unpinned is None:
        unpinned = set()
    if gnome is None:
        gnome = is_gnome_family()
    rows = []
    walk(lib, dpy, lib.XDefaultRootWindow(dpy), rows)
    newly = []
    remapped = []
    tuned = False
    for win, name, cls, attrs in rows:
        if gnome and win not in undecorated and should_undecorate(name, cls, attrs):
            set_motif_undecorated(lib, dpy, win, atoms["_MOTIF_WM_HINTS"])
            undecorated.add(win)
            tuned = True
            print(
                f"xtool-map-windows: undecorated 0x{win:x} name={name!r}",
                flush=True,
            )
        if gnome and is_start_page(name) and win not in unpinned:
            drop_above_state(lib, dpy, win, atoms)
            unpinned.add(win)
            tuned = True
            print(
                f"xtool-map-windows: dropped always-on-top on 0x{win:x} name={name!r}",
                flush=True,
            )
        if not is_first_run_dialog(name, cls, attrs):
            continue
        if win not in retitled:
            set_client_machine(lib, dpy, win, atoms["WM_CLIENT_MACHINE"], hostname)
            retitled.add(win)
            tuned = True
        if maybe_grow_window(lib, dpy, win, name, attrs, grown):
            tuned = True
        if attrs.map_state == IsViewable:
            seen[win] = "viewable"
            continue
        was = seen.get(win)
        reveal_window(lib, dpy, win, atoms, hostname, selected)
        info = (win, name, attrs)
        if was == "viewable":
            remapped.append(info)
            remap_counts[win] = remap_counts.get(win, 0) + 1
        elif was is None:
            newly.append(info)
        else:
            remap_counts[win] = remap_counts.get(win, 0) + 1
            remapped.append(info)
        if was != "hidden":
            send_client_message(
                lib,
                dpy,
                lib.XDefaultRootWindow(dpy),
                win,
                atoms["_NET_ACTIVE_WINDOW"],
                RootEventMask,
                (1, 0, 0, 0, 0),
            )
        seen[win] = "hidden"
    if newly or remapped or tuned:
        lib.XFlush(dpy)
        lib.XSync(dpy, 0)
    return newly, remapped


def _stop(_signum, _frame):
    global _running
    _running = False


def _open_display(lib):
    handler = ErrorHandler(_ignore_xerror)
    lib.XSetErrorHandler(handler)
    return lib.XOpenDisplay(None), handler


def _atoms(lib, dpy):
    return {
        "WM_CLIENT_MACHINE": intern(lib, dpy, b"WM_CLIENT_MACHINE"),
        "WM_STATE": intern(lib, dpy, b"WM_STATE"),
        "_NET_WM_STATE": intern(lib, dpy, b"_NET_WM_STATE"),
        "_NET_WM_STATE_HIDDEN": intern(lib, dpy, b"_NET_WM_STATE_HIDDEN"),
        "_NET_WM_STATE_ABOVE": intern(lib, dpy, b"_NET_WM_STATE_ABOVE"),
        "_NET_ACTIVE_WINDOW": intern(lib, dpy, b"_NET_ACTIVE_WINDOW"),
        "_MOTIF_WM_HINTS": intern(lib, dpy, b"_MOTIF_WM_HINTS"),
    }


def main():
    signal.signal(signal.SIGTERM, _stop)
    signal.signal(signal.SIGINT, _stop)

    timeout = float(os.environ.get("XTOOL_MAP_TIMEOUT", "0"))
    interval = float(os.environ.get("XTOOL_MAP_INTERVAL", "0.15"))
    display_name = os.environ.get("DISPLAY")
    if not display_name:
        print("xtool-map-windows: DISPLAY is not set; skipping", flush=True)
        return 0

    try:
        lib = _load_x11()
    except OSError as exc:
        print(f"xtool-map-windows: cannot load libX11: {exc}", flush=True)
        return 0

    dpy, _handler = _open_display(lib)
    if not dpy:
        print(f"xtool-map-windows: cannot open display {display_name}", flush=True)
        return 0

    hostname = host_machine_name()
    atoms = _atoms(lib, dpy)
    gnome = is_gnome_family()
    print(
        "xtool-map-windows: watching for hidden first-run windows "
        f"host={hostname!r} display={display_name} gnome_family={gnome}",
        flush=True,
    )
    deadline = time.time() + timeout if timeout > 0 else None
    seen = {}
    selected = set()
    remap_counts = {}
    retitled = set()
    grown = set()
    undecorated = set()
    unpinned = set()
    while _running:
        if deadline is not None and time.time() >= deadline:
            break
        newly, remapped = map_candidates(
            lib,
            dpy,
            atoms,
            hostname,
            seen,
            selected,
            remap_counts,
            retitled,
            grown,
            undecorated,
            unpinned,
            gnome,
        )
        for win, name, attrs in newly:
            print(
                "xtool-map-windows: mapped "
                f"0x{win:x} {attrs.width}x{attrs.height}+{attrs.x}+{attrs.y} "
                f"name={name!r}",
                flush=True,
            )
        for win, name, attrs in remapped:
            n = remap_counts.get(win, 1)
            if n == 1 or n % 20 == 0:
                print(
                    "xtool-map-windows: remapped "
                    f"0x{win:x} {attrs.width}x{attrs.height}+{attrs.x}+{attrs.y} "
                    f"name={name!r} (#{n})",
                    flush=True,
                )
        time.sleep(interval)
    return 0


def selftest():
    class Fake:
        def __init__(self, width, height):
            self.width = width
            self.height = height

    assert is_first_run_dialog(
        "Please select your country or region.", "xtool studio.exe", Fake(712, 453)
    )
    assert is_first_run_dialog(
        "Join xTool's Improvement Plan", "xtool studio.exe", Fake(1000, 600)
    )
    assert not is_first_run_dialog("xTool Studio", "xtool studio.exe", Fake(712, 446))
    assert not is_first_run_dialog("Start Page - xTool Studio", "xtool studio.exe", Fake(800, 600))
    assert not is_first_run_dialog("Default IME", "xtool studio.exe", Fake(712, 446))
    assert not is_first_run_dialog("ANGLE Intermediate Window", "xtool studio.exe", Fake(1200, 800))
    assert not is_first_run_dialog("xTool Studio", "xtool studio.exe", Fake(110, 2))
    assert is_start_page("Start Page - xTool Studio")
    assert not is_start_page("Please select your country or region.")
    assert should_undecorate("Start Page - xTool Studio", "xtool studio.exe", Fake(1920, 1080))
    assert should_undecorate(
        "Please select your country or region.", "xtool studio.exe", Fake(712, 453)
    )
    assert not should_undecorate("Default IME", "xtool studio.exe", Fake(712, 446))
    assert not should_undecorate("ANGLE Intermediate Window", "xtool studio.exe", Fake(1200, 800))

    saved_env = {
        key: os.environ.get(key)
        for key in (
            "XDG_CURRENT_DESKTOP",
            "DESKTOP_SESSION",
            "XDG_SESSION_DESKTOP",
            "GNOME_SHELL_SESSION_MODE",
            "GNOME_SETUP_DISPLAY",
        )
    }
    try:
        for key in saved_env:
            os.environ.pop(key, None)
        os.environ["XDG_CURRENT_DESKTOP"] = "KDE"
        os.environ["DESKTOP_SESSION"] = "plasma"
        assert not is_gnome_family()
        os.environ["XDG_CURRENT_DESKTOP"] = "zorin:GNOME"
        os.environ["DESKTOP_SESSION"] = "zorin"
        assert is_gnome_family()
        os.environ["XDG_CURRENT_DESKTOP"] = "ubuntu:GNOME"
        os.environ["DESKTOP_SESSION"] = "ubuntu"
        assert is_gnome_family()
    finally:
        for key, value in saved_env.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value

    if not os.environ.get("DISPLAY"):
        print("xtool-map-windows selftest: logical checks passed (no DISPLAY)", flush=True)
        return 0

    lib = _load_x11()
    dpy, _handler = _open_display(lib)
    if not dpy:
        print("xtool-map-windows selftest: cannot open DISPLAY", flush=True)
        return 1

    root = lib.XDefaultRootWindow(dpy)
    win = lib.XCreateSimpleWindow(dpy, root, -4000, -4000, 712, 446, 0, 0, 0)
    lib.XStoreName(dpy, win, b"Please select your country or region.")
    name_b = b"xtool studio.exe"
    cls_b = b"xtool studio.exe"
    hint = XClassHint(cast(c_char_p(name_b), c_void_p), cast(c_char_p(cls_b), c_void_p))
    lib.XSetClassHint(dpy, win, byref(hint))
    lib.XUnmapWindow(dpy, win)
    lib.XSync(dpy, 0)

    hostname = host_machine_name()
    atoms = _atoms(lib, dpy)
    seen = {}
    selected = set()
    remap_counts = {}
    newly, remapped = map_candidates(lib, dpy, atoms, hostname, seen, selected, remap_counts)
    if not any(item[0] == win for item in newly) or remapped:
        lib.XDestroyWindow(dpy, win)
        lib.XCloseDisplay(dpy)
        print("xtool-map-windows selftest: first map did not target the test window", flush=True)
        return 1

    lib.XUnmapWindow(dpy, win)
    lib.XSync(dpy, 0)
    seen[win] = "viewable"
    newly, remapped = map_candidates(lib, dpy, atoms, hostname, seen, selected, remap_counts)
    ok = any(item[0] == win for item in remapped)
    lib.XDestroyWindow(dpy, win)
    lib.XSync(dpy, 0)
    lib.XCloseDisplay(dpy)
    if not ok:
        print("xtool-map-windows selftest: unmapped window was not remapped", flush=True)
        return 1
    print("xtool-map-windows selftest: passed", flush=True)
    return 0


if __name__ == "__main__":
    if os.environ.get("XTOOL_MAP_SELFTEST") == "1":
        sys.exit(selftest())
    sys.exit(main())
