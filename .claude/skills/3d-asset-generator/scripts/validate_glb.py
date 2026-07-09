#!/usr/bin/env python3
"""Structural validator for .glb files produced by this skill (or any glTF 2.0 GLB).

Checks: magic/version, total-length header, chunk framing, JSON parse, and that
every mesh's index accessor stays within its POSITION accessor's vertex count.
Exits non-zero on the first failure.

Usage:
    python3 validate_glb.py model.glb [more.glb ...]
"""

from __future__ import annotations

import json
import struct
import sys

_GLB_MAGIC = 0x46546C67
_CHUNK_JSON = 0x4E4F534A
_CHUNK_BIN = 0x004E4942


def validate(path: str) -> None:
    with open(path, "rb") as fh:
        data = fh.read()

    if len(data) < 12:
        raise ValueError("file too short to be a GLB")
    magic, version, total = struct.unpack("<III", data[:12])
    if magic != _GLB_MAGIC:
        raise ValueError("not a GLB (bad magic)")
    if version != 2:
        raise ValueError(f"unsupported GLB version {version}")
    if total != len(data):
        raise ValueError(f"header length {total} != actual {len(data)}")

    chunks = {}
    off = 12
    while off < len(data):
        clen, ctype = struct.unpack("<II", data[off : off + 8])
        chunks[ctype] = data[off + 8 : off + 8 + clen]
        off += 8 + clen
    if _CHUNK_JSON not in chunks:
        raise ValueError("missing JSON chunk")

    gltf = json.loads(chunks[_CHUNK_JSON])
    blob = chunks.get(_CHUNK_BIN, b"")

    for mesh in gltf.get("meshes", []):
        for prim in mesh["primitives"]:
            pos = gltf["accessors"][prim["attributes"]["POSITION"]]
            if "indices" not in prim:
                continue
            idx = gltf["accessors"][prim["indices"]]
            if idx["count"] % 3 != 0:
                raise ValueError(f"{mesh.get('name')}: index count not a multiple of 3")
            bv = gltf["bufferViews"][idx["bufferView"]]
            start = bv["byteOffset"] + idx.get("byteOffset", 0)
            vals = struct.unpack(f"<{idx['count']}I", blob[start : start + idx["count"] * 4])
            if vals and max(vals) >= pos["count"]:
                raise ValueError(
                    f"{mesh.get('name')}: index {max(vals)} out of range (verts={pos['count']})"
                )

    print(
        f"OK  {path}  "
        f"nodes={len(gltf.get('nodes', []))} "
        f"meshes={len(gltf.get('meshes', []))} "
        f"materials={len(gltf.get('materials', []))}"
    )


def main(argv=None) -> int:
    paths = (argv if argv is not None else sys.argv[1:])
    if not paths:
        print("usage: validate_glb.py model.glb [...]", file=sys.stderr)
        return 2
    for path in paths:
        try:
            validate(path)
        except (ValueError, KeyError, struct.error) as exc:
            print(f"FAIL {path}: {exc}", file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
