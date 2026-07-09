"""Pure-Python glTF 2.0 writer — emits .glb (binary) or .gltf (JSON + .bin).

Supports triangle meshes with POSITION + NORMAL attributes, indexed geometry,
and PBR metallic-roughness materials (base colour, metallic, roughness). Each
node carries its own translation / rotation / scale so the scene stays editable
in Blender, three.js, model-viewer, Expo GL, etc.

No external dependencies — geometry is packed with the stdlib `struct` module.
"""

from __future__ import annotations

import json
import struct

# glTF component + type constants
_FLOAT = 5126
_UINT32 = 5125
_ARRAY_BUFFER = 34962
_ELEMENT_ARRAY_BUFFER = 34963
_TRIANGLES = 4


def _pad4(data: bytes, fill: bytes = b"\x00") -> bytes:
    """Pad a byte string up to a 4-byte boundary (glTF alignment requirement)."""
    remainder = len(data) % 4
    return data if remainder == 0 else data + fill * (4 - remainder)


class _BufferBuilder:
    def __init__(self):
        self.blob = bytearray()
        self.buffer_views = []
        self.accessors = []

    def _add_view(self, data: bytes, target: int) -> int:
        data = _pad4(data)
        offset = len(self.blob)
        self.blob += data
        self.buffer_views.append(
            {"buffer": 0, "byteOffset": offset, "byteLength": len(data), "target": target}
        )
        return len(self.buffer_views) - 1

    def add_positions(self, positions) -> int:
        flat = []
        for p in positions:
            flat.extend(p)
        data = struct.pack(f"<{len(flat)}f", *flat)
        view = self._add_view(data, _ARRAY_BUFFER)
        xs = [p[0] for p in positions]
        ys = [p[1] for p in positions]
        zs = [p[2] for p in positions]
        self.accessors.append(
            {
                "bufferView": view,
                "componentType": _FLOAT,
                "count": len(positions),
                "type": "VEC3",
                "min": [min(xs), min(ys), min(zs)],
                "max": [max(xs), max(ys), max(zs)],
            }
        )
        return len(self.accessors) - 1

    def add_normals(self, normals) -> int:
        flat = []
        for n in normals:
            flat.extend(n)
        data = struct.pack(f"<{len(flat)}f", *flat)
        view = self._add_view(data, _ARRAY_BUFFER)
        self.accessors.append(
            {
                "bufferView": view,
                "componentType": _FLOAT,
                "count": len(normals),
                "type": "VEC3",
            }
        )
        return len(self.accessors) - 1

    def add_indices(self, indices) -> int:
        data = struct.pack(f"<{len(indices)}I", *indices)
        view = self._add_view(data, _ELEMENT_ARRAY_BUFFER)
        self.accessors.append(
            {
                "bufferView": view,
                "componentType": _UINT32,
                "count": len(indices),
                "type": "SCALAR",
            }
        )
        return len(self.accessors) - 1


def build_gltf(nodes, generator="3d-asset-generator"):
    """Assemble a glTF dict + packed binary blob from a list of node descriptors.

    Each node descriptor:
        {
            "name": str,
            "mesh": {"positions", "normals", "indices"},
            "material": {"color": [r,g,b,a], "metallic": float, "roughness": float},
            "translation": [x, y, z],
            "rotation": [x, y, z, w],   # quaternion
            "scale": [x, y, z],
        }
    Returns (gltf_dict, blob_bytes).
    """
    buf = _BufferBuilder()
    gltf_nodes, gltf_meshes, gltf_materials = [], [], []

    for nd in nodes:
        mesh = nd["mesh"]
        pos_acc = buf.add_positions(mesh["positions"])
        norm_acc = buf.add_normals(mesh["normals"])
        idx_acc = buf.add_indices(mesh["indices"])

        mat = nd.get("material") or {}
        color = mat.get("color", [0.8, 0.8, 0.8, 1.0])
        if len(color) == 3:
            color = list(color) + [1.0]
        material_index = len(gltf_materials)
        gltf_materials.append(
            {
                "name": nd.get("name", f"material_{material_index}") + "_mat",
                "pbrMetallicRoughness": {
                    "baseColorFactor": [float(c) for c in color],
                    "metallicFactor": float(mat.get("metallic", 0.0)),
                    "roughnessFactor": float(mat.get("roughness", 0.8)),
                },
                "doubleSided": bool(mat.get("double_sided", False)),
            }
        )

        mesh_index = len(gltf_meshes)
        gltf_meshes.append(
            {
                "name": nd.get("name", f"mesh_{mesh_index}"),
                "primitives": [
                    {
                        "attributes": {"POSITION": pos_acc, "NORMAL": norm_acc},
                        "indices": idx_acc,
                        "material": material_index,
                        "mode": _TRIANGLES,
                    }
                ],
            }
        )

        node = {"name": nd.get("name", f"node_{mesh_index}"), "mesh": mesh_index}
        t = nd.get("translation", [0, 0, 0])
        r = nd.get("rotation", [0, 0, 0, 1])
        s = nd.get("scale", [1, 1, 1])
        if list(t) != [0, 0, 0]:
            node["translation"] = [float(v) for v in t]
        if list(r) != [0, 0, 0, 1]:
            node["rotation"] = [float(v) for v in r]
        if list(s) != [1, 1, 1]:
            node["scale"] = [float(v) for v in s]
        gltf_nodes.append(node)

    gltf = {
        "asset": {"version": "2.0", "generator": generator},
        "scene": 0,
        "scenes": [{"nodes": list(range(len(gltf_nodes)))}],
        "nodes": gltf_nodes,
        "meshes": gltf_meshes,
        "materials": gltf_materials,
        "accessors": buf.accessors,
        "bufferViews": buf.buffer_views,
        "buffers": [{"byteLength": len(buf.blob)}],
    }
    return gltf, bytes(buf.blob)


def write_glb(nodes, path, generator="3d-asset-generator"):
    """Write a self-contained binary .glb file."""
    gltf, blob = build_gltf(nodes, generator)
    # Single-buffer GLB: buffer has no uri; data lives in the BIN chunk.
    json_bytes = _pad4(json.dumps(gltf, separators=(",", ":")).encode("utf-8"), b" ")
    bin_bytes = _pad4(blob, b"\x00")

    json_chunk = struct.pack("<II", len(json_bytes), 0x4E4F534A) + json_bytes  # "JSON"
    bin_chunk = struct.pack("<II", len(bin_bytes), 0x004E4942) + bin_bytes     # "BIN\0"
    total = 12 + len(json_chunk) + len(bin_chunk)
    header = struct.pack("<III", 0x46546C67, 2, total)  # magic "glTF", version 2

    with open(path, "wb") as fh:
        fh.write(header + json_chunk + bin_chunk)
    return path


def write_gltf(nodes, path, generator="3d-asset-generator"):
    """Write .gltf JSON alongside a sibling .bin file."""
    import os

    gltf, blob = build_gltf(nodes, generator)
    bin_name = os.path.splitext(os.path.basename(path))[0] + ".bin"
    gltf["buffers"][0]["uri"] = bin_name

    with open(path, "w", encoding="utf-8") as fh:
        json.dump(gltf, fh, indent=2)
    with open(os.path.join(os.path.dirname(path) or ".", bin_name), "wb") as fh:
        fh.write(blob)
    return path
