"""Small vector / matrix / quaternion helpers — pure Python, no numpy."""

from __future__ import annotations

import math


def euler_deg_to_quat(rx, ry, rz):
    """Euler angles in degrees (XYZ intrinsic order) -> glTF quaternion [x, y, z, w]."""
    hx, hy, hz = (math.radians(a) / 2.0 for a in (rx, ry, rz))
    cx, sx = math.cos(hx), math.sin(hx)
    cy, sy = math.cos(hy), math.sin(hy)
    cz, sz = math.cos(hz), math.sin(hz)
    # R = Rz * Ry * Rx
    w = cx * cy * cz + sx * sy * sz
    x = sx * cy * cz - cx * sy * sz
    y = cx * sy * cz + sx * cy * sz
    z = cx * cy * sz - sx * sy * cz
    return [x, y, z, w]


def quat_to_matrix(q):
    """glTF quaternion [x, y, z, w] -> 3x3 row-major rotation matrix."""
    x, y, z, w = q
    xx, yy, zz = x * x, y * y, z * z
    xy, xz, yz = x * y, x * z, y * z
    wx, wy, wz = w * x, w * y, w * z
    return [
        [1 - 2 * (yy + zz), 2 * (xy - wz), 2 * (xz + wy)],
        [2 * (xy + wz), 1 - 2 * (xx + zz), 2 * (yz - wx)],
        [2 * (xz - wy), 2 * (yz + wx), 1 - 2 * (xx + yy)],
    ]


def apply_trs(mesh, translation, rotation_quat, scale):
    """Bake a translation/rotation/scale onto a mesh, returning new positions+normals.

    Used by exporters (OBJ) that have no node hierarchy. glTF keeps TRS on nodes
    instead, so it does not call this.
    """
    m = quat_to_matrix(rotation_quat)
    sx, sy, sz = scale
    tx, ty, tz = translation

    out_pos, out_norm = [], []
    for px, py, pz in mesh["positions"]:
        # scale, then rotate, then translate
        vx, vy, vz = px * sx, py * sy, pz * sz
        rx = m[0][0] * vx + m[0][1] * vy + m[0][2] * vz
        ry = m[1][0] * vx + m[1][1] * vy + m[1][2] * vz
        rz = m[2][0] * vx + m[2][1] * vy + m[2][2] * vz
        out_pos.append([rx + tx, ry + ty, rz + tz])

    # Normals: rotate and renormalise (non-uniform scale corrected via inverse-scale).
    inv = [1.0 / s if s != 0 else 0.0 for s in (sx, sy, sz)]
    for nx, ny, nz in mesh["normals"]:
        vx, vy, vz = nx * inv[0], ny * inv[1], nz * inv[2]
        rx = m[0][0] * vx + m[0][1] * vy + m[0][2] * vz
        ry = m[1][0] * vx + m[1][1] * vy + m[1][2] * vz
        rz = m[2][0] * vx + m[2][1] * vy + m[2][2] * vz
        length = math.sqrt(rx * rx + ry * ry + rz * rz) or 1.0
        out_norm.append([rx / length, ry / length, rz / length])

    return {"positions": out_pos, "normals": out_norm, "indices": list(mesh["indices"])}
