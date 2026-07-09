#!/usr/bin/env python3
"""3D asset generator CLI — turns a declarative JSON scene spec into a 3D model.

Usage:
    python generate.py <scene.json> [-o out.glb] [-f glb|gltf|obj]
    python generate.py <scene.json> --stdout-json      # inspect the spec + stats
    echo '<json>' | python generate.py - -o out.glb    # read spec from stdin

Scene spec (see references/scene-spec.md for the full reference):

    {
      "name": "eight_ball",
      "nodes": [
        {
          "name": "ball",
          "primitive": "sphere",
          "params": { "radius": 0.5, "segments": 48, "rings": 24 },
          "translation": [0, 0.5, 0],
          "rotation": [0, 0, 0],          # Euler degrees, XYZ
          "scale": [1, 1, 1],
          "color": [0.05, 0.05, 0.05, 1], # RGBA 0..1 (alpha optional)
          "metallic": 0.0,
          "roughness": 0.25
        }
      ]
    }

Output format is inferred from the -o extension when -f is omitted.
The script is zero-dependency: primitives, transforms, and file writers are all
pure Python in this same directory.
"""

from __future__ import annotations

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import primitives
from transforms import euler_deg_to_quat
import gltf_writer
import obj_writer


def _resolve_nodes(spec):
    """Turn spec nodes into exporter-ready node descriptors with real geometry."""
    if not isinstance(spec, dict) or "nodes" not in spec:
        raise ValueError("Scene spec must be an object with a top-level 'nodes' array.")

    resolved = []
    for i, node in enumerate(spec["nodes"]):
        primitive = node.get("primitive")
        if not primitive:
            raise ValueError(f"nodes[{i}] is missing 'primitive'.")

        mesh = primitives.build(primitive, node.get("params", {}))

        rotation = node.get("rotation", [0, 0, 0])
        if len(rotation) == 4:
            quat = rotation  # already a quaternion
        else:
            quat = euler_deg_to_quat(*(list(rotation) + [0, 0, 0])[:3])

        resolved.append(
            {
                "name": node.get("name", f"{primitive}_{i}"),
                "mesh": mesh,
                "material": {
                    "color": node.get("color", [0.8, 0.8, 0.8, 1.0]),
                    "metallic": node.get("metallic", 0.0),
                    "roughness": node.get("roughness", 0.8),
                    "double_sided": node.get("double_sided", False),
                },
                "translation": node.get("translation", [0, 0, 0]),
                "rotation": quat,
                "scale": node.get("scale", [1, 1, 1]),
            }
        )
    return resolved


def _stats(resolved):
    verts = sum(len(n["mesh"]["positions"]) for n in resolved)
    tris = sum(len(n["mesh"]["indices"]) // 3 for n in resolved)
    return verts, tris


WRITERS = {
    "glb": gltf_writer.write_glb,
    "gltf": gltf_writer.write_gltf,
    "obj": obj_writer.write_obj,
}


def main(argv=None):
    ap = argparse.ArgumentParser(description="Generate a 3D asset from a JSON scene spec.")
    ap.add_argument("spec", help="Path to scene JSON, or '-' for stdin.")
    ap.add_argument("-o", "--output", help="Output file path (extension picks format).")
    ap.add_argument("-f", "--format", choices=sorted(WRITERS), help="Force output format.")
    ap.add_argument(
        "--stdout-json",
        action="store_true",
        help="Print the parsed spec + geometry stats and exit (no file written).",
    )
    args = ap.parse_args(argv)

    try:
        raw = sys.stdin.read() if args.spec == "-" else open(args.spec, encoding="utf-8").read()
    except OSError as exc:
        ap.error(f"Cannot read spec: {exc}")
    try:
        spec = json.loads(raw)
    except json.JSONDecodeError as exc:
        ap.error(f"Invalid JSON in scene spec: {exc}")
    try:
        resolved = _resolve_nodes(spec)
    except ValueError as exc:
        ap.error(str(exc))
    verts, tris = _stats(resolved)

    if args.stdout_json:
        json.dump(
            {"name": spec.get("name"), "nodes": len(resolved), "vertices": verts, "triangles": tris},
            sys.stdout,
            indent=2,
        )
        sys.stdout.write("\n")
        return 0

    fmt = args.format
    output = args.output
    if not output:
        name = spec.get("name", "asset")
        output = f"{name}.{fmt or 'glb'}"
    if not fmt:
        fmt = os.path.splitext(output)[1].lstrip(".").lower() or "glb"
    if fmt not in WRITERS:
        ap.error(f"Unsupported format '{fmt}'. Choose from: {', '.join(sorted(WRITERS))}")

    out_dir = os.path.dirname(os.path.abspath(output))
    os.makedirs(out_dir, exist_ok=True)
    WRITERS[fmt](resolved, output)

    size = os.path.getsize(output)
    print(
        f"Wrote {output}  ({fmt.upper()}, {len(resolved)} nodes, "
        f"{verts} verts, {tris} tris, {size} bytes)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
