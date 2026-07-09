# Scene Spec Reference

A scene spec is a JSON object describing one 3D asset. It has an optional name
and a required `nodes` array. Each node is one primitive with a transform and a
material. Coordinates are **right-handed, Y-up, metres by convention** (matching
glTF).

## Top level

```json
{
  "name": "my_asset",          // optional; used for default output filename
  "description": "...",         // optional; ignored by the generator
  "nodes": [ /* Node, ... */ ]  // required, at least one
}
```

## Node

| Field         | Type                     | Default         | Meaning |
|---------------|--------------------------|-----------------|---------|
| `primitive`   | string                   | **required**    | One of `box`, `plane`, `sphere`, `cylinder`, `cone`, `torus`. |
| `name`        | string                   | `"<prim>_<i>"`  | Node/mesh/material name in the output. |
| `params`      | object                   | `{}`            | Primitive-specific shape parameters (see below). |
| `translation` | `[x, y, z]`              | `[0, 0, 0]`     | Position. |
| `rotation`    | `[x, y, z]` **degrees**  | `[0, 0, 0]`     | Euler XYZ. A 4-element value is treated as a raw quaternion `[x,y,z,w]`. |
| `scale`       | `[x, y, z]`              | `[1, 1, 1]`     | Per-axis scale. |
| `color`       | `[r, g, b]` or `[r,g,b,a]` | `[0.8,0.8,0.8,1]` | Base colour, each channel 0–1. Alpha optional. |
| `metallic`    | number 0–1               | `0.0`           | PBR metalness. |
| `roughness`   | number 0–1               | `0.8`           | PBR roughness (0 = mirror, 1 = matte). |
| `double_sided`| boolean                  | `false`         | Render both faces (glTF only). |

## Primitive parameters

All `segments`/`rings`/`sides` control tessellation (higher = smoother, bigger
file). Sensible ranges are 16–64.

### `box`
| param  | default        | meaning |
|--------|----------------|---------|
| `size` | `[1, 1, 1]`    | Full extent along x, y, z. Centred on origin. |

### `plane`
| param  | default   | meaning |
|--------|-----------|---------|
| `size` | `[1, 1]`  | Extent along x and z. Lies on XZ plane, faces +Y. |

### `sphere`
| param      | default | meaning |
|------------|---------|---------|
| `radius`   | `0.5`   | Sphere radius. |
| `segments` | `32`    | Longitude divisions. |
| `rings`    | `16`    | Latitude divisions. |

### `cylinder`
| param      | default | meaning |
|------------|---------|---------|
| `radius`   | `0.5`   | Radius. |
| `height`   | `1.0`   | Height along Y. Centred on origin. |
| `segments` | `32`    | Radial divisions. |
| `caps`     | `true`  | Whether to close the top/bottom. |

### `cone`
| param      | default | meaning |
|------------|---------|---------|
| `radius`   | `0.5`   | Base radius. |
| `height`   | `1.0`   | Height (apex at +Y, base at −Y). |
| `segments` | `32`    | Radial divisions. |
| `cap`      | `true`  | Whether to close the base. |

### `torus`
| param      | default | meaning |
|------------|---------|---------|
| `radius`   | `0.5`   | Distance from centre to tube centre. |
| `tube`     | `0.2`   | Tube (thickness) radius. |
| `segments` | `32`    | Divisions around the main ring. |
| `sides`    | `16`    | Divisions around the tube. |

## Minimal example

```json
{
  "name": "ball",
  "nodes": [
    { "primitive": "sphere", "params": { "radius": 1 }, "color": [1, 0, 0] }
  ]
}
```

## Multi-part example

```json
{
  "name": "mushroom",
  "nodes": [
    {
      "name": "stem",
      "primitive": "cylinder",
      "params": { "radius": 0.2, "height": 1.0 },
      "translation": [0, 0.5, 0],
      "color": [0.95, 0.93, 0.88]
    },
    {
      "name": "cap",
      "primitive": "sphere",
      "params": { "radius": 0.6, "rings": 12 },
      "translation": [0, 1.0, 0],
      "scale": [1, 0.6, 1],
      "color": [0.85, 0.15, 0.12],
      "roughness": 0.6
    }
  ]
}
```

## Notes on units and colour

- There is no fixed unit; keep an asset internally consistent. Most engines
  treat 1 glTF unit = 1 metre.
- Colours are **linear-ish sRGB factors** in `baseColorFactor`. If a colour
  looks too bright/dark in a viewer, nudge the values rather than expecting a
  colour-management pipeline — this generator writes flat PBR factors only (no
  textures).
