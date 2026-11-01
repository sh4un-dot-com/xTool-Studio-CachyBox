#!/usr/bin/env python3
"""Map hidden xTool Studio first-run windows on X11/XWayland.

xTool 1.9.11 creates the country, privacy, and plan windows hidden. Under Wine
the renderer never reaches did-finish-load, so the app never calls show().
Mapping those dialogs from X11 gives Chromium a drawable. BrowserWindow.show()
at construction native-crashes under Wine, so this helper maps after the HWND
exists.

Only first-run sized dialogs are mapped. Tiny IME windows and the large ANGLE
intermediate surface are left alone.
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
    byref,
    c_char,
    c_char_p,
    c_int,
    c_long,
    c_uint,
    c_ulong,
    c_void_p,
    cdll,
    string_at,
)
from ctypes.util import find_library

MIN_W, MIN_H = 400, 300
MAX_W, MAX_H = 1400, 1000
SKIP_NAMES = ("ime", "angle intermediate")
KEEP_NAMES = (
    "xtool studio",
    "please select",
    "country",
    "region",
    "privacy",
    "improvement",
    "start page",
)


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


IsUnmapped = 0
IsViewable = 2

_running = True


def _load_x11():
    name = find_library("X11") or "libX11.so.6"
    lib = cdll.LoadLibrary(name)
    lib.XOpenDisplay.argtypes = [c_char_p]
    lib.XOpenDisplay.restype = c_void_p
    lib.XDefaultRootWindow.argtypes = [c_void_p]
    lib.XDefaultRootWindow.restype = c_ulong
    lib.XDisplayWidth.argtypes = [c_void_p, c_int]
    lib.XDisplayWidth.restype = c_int
    lib.XDisplayHeight.argtypes = [c_void_p, c_int]
    lib.XDisplayHeight.restype = c_int
    lib.XDefaultScreen.argtypes = [c_void_p]
    lib.XDefaultScreen.restype = c_int
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
    lib.XFlush.argtypes = [c_void_p]
    lib.XFlush.restype = c_int
    lib.XFree.argtypes = [c_void_p]
    lib.XFree.restype = c_int
    lib.XSync.argtypes = [c_void_p, c_int]
    lib.XSync.restype = c_int
    lib.XSetErrorHandler.argtypes = [c_void_p]
    lib.XSetErrorHandler.restype = c_void_p
    return lib


ErrorHandler = CFUNCTYPE(c_int, c_void_p, c_void_p)


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


def is_first_run_dialog(name, cls, attrs):
    blob = f"{name} {cls}".lower()
    if any(skip in blob for skip in SKIP_NAMES):
        return False
    if attrs.width < MIN_W or attrs.height < MIN_H:
        return False
    if attrs.width > MAX_W or attrs.height > MAX_H:
        return False
    return any(keep in blob for keep in KEEP_NAMES)


def map_candidates(lib, dpy, mapped_ids):
    rows = []
    walk(lib, dpy, lib.XDefaultRootWindow(dpy), rows)
    newly = []
    for win, name, cls, attrs in rows:
        if not is_first_run_dialog(name, cls, attrs):
            continue
        if attrs.map_state == IsViewable:
            mapped_ids.add(win)
            continue
        lib.XMapRaised(dpy, win)
        newly.append((win, name, attrs))
        mapped_ids.add(win)
    if newly:
        lib.XFlush(dpy)
        lib.XSync(dpy, 0)
    return newly


def _stop(_signum, _frame):
    global _running
    _running = False


def main():
    signal.signal(signal.SIGTERM, _stop)
    signal.signal(signal.SIGINT, _stop)

    timeout = float(os.environ.get("XTOOL_MAP_TIMEOUT", "0"))
    interval = float(os.environ.get("XTOOL_MAP_INTERVAL", "0.4"))
    display_name = os.environ.get("DISPLAY")
    if not display_name:
        print("xtool-map-windows: DISPLAY is not set; skipping", flush=True)
        return 0

    try:
        lib = _load_x11()
    except OSError as exc:
        print(f"xtool-map-windows: cannot load libX11: {exc}", flush=True)
        return 0

    handler = ErrorHandler(_ignore_xerror)
    lib.XSetErrorHandler(handler)

    dpy = lib.XOpenDisplay(None)
    if not dpy:
        print(f"xtool-map-windows: cannot open display {display_name}", flush=True)
        return 0

    print("xtool-map-windows: watching for hidden first-run windows", flush=True)
    deadline = time.time() + timeout if timeout > 0 else None
    mapped_ids = set()
    while _running:
        if deadline is not None and time.time() >= deadline:
            break
        for win, name, attrs in map_candidates(lib, dpy, mapped_ids):
            print(
                "xtool-map-windows: mapped "
                f"0x{win:x} {attrs.width}x{attrs.height}+{attrs.x}+{attrs.y} "
                f"name={name!r}",
                flush=True,
            )
        time.sleep(interval)
    return 0


if __name__ == "__main__":
    sys.exit(main())
