"""Procedural mesh primitives — zero dependencies (pure Python + math).

Every builder returns a dict shaped like:

    {
        "positions": [[x, y, z], ...],   # one entry per vertex
        "normals":   [[x, y, z], ...],   # unit normals, same length as positions
        "indices":   [i0, i1, i2, ...],  # flat triangle list (multiple of 3)
    }

Coordinate system is right-handed, Y-up, matching glTF. Triangles wind
counter-clockwise when viewed from the front (outside) face.
"""

from __future__ import annotations

import math


def box(size=(1.0, 1.0, 1.0)):
    """Axis-aligned box centred on the origin. `size` is full extent (x, y, z)."""
    hx, hy, hz = size[0] / 2.0, size[1] / 2.0, size[2] / 2.0

    # Each face gets its own 4 vertices so normals stay flat/hard-edged.
    faces = [
        # (normal, [four corners CCW from outside])
        ((0, 0, 1), [(-hx, -hy, hz), (hx, -hy, hz), (hx, hy, hz), (-hx, hy, hz)]),   # +Z
        ((0, 0, -1), [(hx, -hy, -hz), (-hx, -hy, -hz), (-hx, hy, -hz), (hx, hy, -hz)]),  # -Z
        ((1, 0, 0), [(hx, -hy, hz), (hx, -hy, -hz), (hx, hy, -hz), (hx, hy, hz)]),   # +X
        ((-1, 0, 0), [(-hx, -hy, -hz), (-hx, -hy, hz), (-hx, hy, hz), (-hx, hy, -hz)]),  # -X
        ((0, 1, 0), [(-hx, hy, hz), (hx, hy, hz), (hx, hy, -hz), (-hx, hy, -hz)]),   # +Y
        ((0, -1, 0), [(-hx, -hy, -hz), (hx, -hy, -hz), (hx, -hy, hz), (-hx, -hy, hz)]),  # -Y
    ]

    positions, normals, indices = [], [], []
    for normal, corners in faces:
        base = len(positions)
        for c in corners:
            positions.append(list(c))
            normals.append(list(normal))
        indices += [base, base + 1, base + 2, base, base + 2, base + 3]
    return {"positions": positions, "normals": normals, "indices": indices}


def plane(size=(1.0, 1.0)):
    """Flat quad on the XZ plane, facing +Y. `size` is (x, z) extent."""
    hx, hz = size[0] / 2.0, size[1] / 2.0
    positions = [[-hx, 0, hz], [hx, 0, hz], [hx, 0, -hz], [-hx, 0, -hz]]
    normals = [[0, 1, 0]] * 4
    indices = [0, 1, 2, 0, 2, 3]
    return {"positions": positions, "normals": [list(n) for n in normals], "indices": indices}


def sphere(radius=0.5, segments=32, rings=16):
    """UV sphere centred on the origin."""
    segments = max(3, int(segments))
    rings = max(2, int(rings))
    positions, normals, indices = [], [], []

    for r in range(rings + 1):
        v = r / rings
        phi = v * math.pi          # 0..pi from +Y pole to -Y pole
        y = math.cos(phi)
        rad = math.sin(phi)
        for s in range(segments + 1):
            u = s / segments
            theta = u * 2.0 * math.pi
            x = rad * math.cos(theta)
            z = rad * math.sin(theta)
            positions.append([x * radius, y * radius, z * radius])
            normals.append([x, y, z])

    stride = segments + 1
    for r in range(rings):
        for s in range(segments):
            a = r * stride + s
            b = a + stride
            indices += [a, b, a + 1, a + 1, b, b + 1]
    return {"positions": positions, "normals": normals, "indices": indices}


def cylinder(radius=0.5, height=1.0, segments=32, caps=True):
    """Cylinder aligned to the Y axis, centred on the origin."""
    segments = max(3, int(segments))
    hy = height / 2.0
    positions, normals, indices = [], [], []

    # Side wall — duplicate the seam vertex so UVs/normals stay clean.
    for s in range(segments + 1):
        theta = (s / segments) * 2.0 * math.pi
        x, z = math.cos(theta), math.sin(theta)
        positions.append([x * radius, hy, z * radius])
        normals.append([x, 0, z])
        positions.append([x * radius, -hy, z * radius])
        normals.append([x, 0, z])
    for s in range(segments):
        a = s * 2
        indices += [a, a + 1, a + 2, a + 2, a + 1, a + 3]

    if caps:
        for sign, ny in ((1, hy), (-1, -hy)):
            center = len(positions)
            positions.append([0, ny, 0])
            normals.append([0, sign, 0])
            ring_start = len(positions)
            for s in range(segments + 1):
                theta = (s / segments) * 2.0 * math.pi
                x, z = math.cos(theta), math.sin(theta)
                positions.append([x * radius, ny, z * radius])
                normals.append([0, sign, 0])
            for s in range(segments):
                a = ring_start + s
                if sign > 0:  # top cap, CCW seen from above
                    indices += [center, a + 1, a]
                else:         # bottom cap, CCW seen from below
                    indices += [center, a, a + 1]
    return {"positions": positions, "normals": normals, "indices": indices}


def cone(radius=0.5, height=1.0, segments=32, cap=True):
    """Cone with base on -Y and apex on +Y, centred on the origin."""
    segments = max(3, int(segments))
    hy = height / 2.0
    positions, normals, indices = [], [], []

    # Slant normal tilt so lighting reads as a cone rather than a cylinder.
    slant = math.sqrt(radius * radius + height * height)
    ny = radius / slant
    nr = height / slant

    for s in range(segments):
        theta = (s / segments) * 2.0 * math.pi
        theta_next = ((s + 1) / segments) * 2.0 * math.pi
        theta_mid = (theta + theta_next) / 2.0

        base_a = [math.cos(theta) * radius, -hy, math.sin(theta) * radius]
        base_b = [math.cos(theta_next) * radius, -hy, math.sin(theta_next) * radius]
        apex = [0, hy, 0]

        base = len(positions)
        positions += [base_a, base_b, apex]
        normals.append([math.cos(theta) * nr, ny, math.sin(theta) * nr])
        normals.append([math.cos(theta_next) * nr, ny, math.sin(theta_next) * nr])
        normals.append([math.cos(theta_mid) * nr, ny, math.sin(theta_mid) * nr])
        indices += [base, base + 1, base + 2]

    if cap:
        center = len(positions)
        positions.append([0, -hy, 0])
        normals.append([0, -1, 0])
        ring_start = len(positions)
        for s in range(segments + 1):
            theta = (s / segments) * 2.0 * math.pi
            positions.append([math.cos(theta) * radius, -hy, math.sin(theta) * radius])
            normals.append([0, -1, 0])
        for s in range(segments):
            a = ring_start + s
            indices += [center, a, a + 1]
    return {"positions": positions, "normals": normals, "indices": indices}


def torus(radius=0.5, tube=0.2, segments=32, sides=16):
    """Torus in the XZ plane, tube swept around the Y axis."""
    segments = max(3, int(segments))
    sides = max(3, int(sides))
    positions, normals, indices = [], [], []

    for i in range(segments + 1):
        u = (i / segments) * 2.0 * math.pi
        cu, su = math.cos(u), math.sin(u)
        for j in range(sides + 1):
            v = (j / sides) * 2.0 * math.pi
            cv, sv = math.cos(v), math.sin(v)
            # Ring centre + offset along the local tube frame.
            x = (radius + tube * cv) * cu
            z = (radius + tube * cv) * su
            y = tube * sv
            positions.append([x, y, z])
            nx = cv * cu
            nz = cv * su
            ny = sv
            normals.append([nx, ny, nz])

    stride = sides + 1
    for i in range(segments):
        for j in range(sides):
            a = i * stride + j
            b = a + stride
            indices += [a, b, a + 1, a + 1, b, b + 1]
    return {"positions": positions, "normals": normals, "indices": indices}


BUILDERS = {
    "box": box,
    "plane": plane,
    "sphere": sphere,
    "cylinder": cylinder,
    "cone": cone,
    "torus": torus,
}


def build(primitive, params):
    """Dispatch by name, passing only the params the builder accepts."""
    if primitive not in BUILDERS:
        raise ValueError(
            f"Unknown primitive '{primitive}'. Choose one of: {', '.join(sorted(BUILDERS))}"
        )
    fn = BUILDERS[primitive]
    accepted = fn.__code__.co_varnames[: fn.__code__.co_argcount]
    kwargs = {k: v for k, v in (params or {}).items() if k in accepted}
    return fn(**kwargs)
