---
name: 3d-asset-generator
description: >-
  Generate 3D model files (.glb, .gltf, .obj) procedurally from a simple JSON
  scene description. Composes primitives (box, sphere, cylinder, cone, torus,
  plane) with transforms and PBR materials into a single exported asset. Use
  when the user wants to create, build, or export a 3D asset, model, mesh, or
  glTF/GLB/OBJ file — e.g. for a game, an AR/VR scene, a react-three-fiber /
  Expo GL / model-viewer preview, a 3D icon, or a placeholder prop. Pure Python,
  no dependencies or API keys.
---

# 3D Asset Generator

Turn a declarative JSON **scene spec** into a ready-to-use 3D model file. Every
asset is a set of **nodes**, and each node is a **primitive** with a transform
and a material. The tools are zero-dependency pure Python (`struct` + `math`),
so nothing needs installing.

## When to use this

Reach for this skill whenever the user wants a 3D asset produced from code:
game props, 3D UI icons, AR markers, low-poly placeholders, or anything that
should end up as a `.glb` / `.gltf` / `.obj` file. It builds shapes by
**composing primitives** — it is not a text-to-3D neural generator and does not
sculpt organic detail. For anything expressible as combined primitives (tables,
balls, pins, crates, signs, robots, furniture, simple characters) it produces a
correct, viewer-ready file.

## The workflow

1. **Design the scene as JSON.** Break the object into primitives. Decide each
   one's size (via `params`), position (`translation`), orientation
   (`rotation`, Euler degrees), `scale`, and material (`color`, `metallic`,
   `roughness`). Write it to a `.json` file. Read
   `references/scene-spec.md` for the full field reference and
   `references/authoring-tips.md` for how to reason about placement and units.

2. **Generate the file.** Run the CLI from the skill directory:

   ```bash
   python3 scripts/generate.py path/to/scene.json -o output.glb
   ```

   - Format is inferred from the `-o` extension (`.glb`, `.gltf`, `.obj`), or
     force it with `-f glb|gltf|obj`. Default is `.glb`.
   - Pass `-` as the spec path to read JSON from stdin.
   - Add `--stdout-json` to print node/vertex/triangle stats without writing a
     file (a fast sanity check while iterating).

3. **Verify it.** Confirm the command printed a sane vertex/triangle count and
   the file exists. To structurally validate a `.glb`, run
   `python3 scripts/validate_glb.py output.glb` — it parses the binary, checks
   chunk lengths, and confirms every index is within its mesh's vertex count.

4. **Iterate.** Adjust the JSON and re-run. Keep primitive `segments`/`rings`
   modest (24–48) unless the user needs high fidelity — it keeps files small.

## Prefer `.glb` for apps and the web

`.glb` is a single self-contained binary file and is the right default for
three.js / react-three-fiber, `<model-viewer>`, Expo GL, Babylon, Unity, and
Blender import. Use `.gltf` (JSON + sibling `.bin`) when the user wants a
human-readable/editable scene, and `.obj` (+ `.mtl`) for classic DCC tools or
when a viewer lacks glTF support. In **this** repo (Expo / React Native), a
`.glb` can be loaded with `expo-gl` + `expo-three` or `expo-asset`.

## Primitives available

`box`, `plane`, `sphere`, `cylinder`, `cone`, `torus`. Each accepts its own
`params` (radius, height, size, segments, …). See `references/scene-spec.md`
for every primitive's parameters and defaults.

## Worked examples

The `examples/` directory has three ready-to-run specs, themed to this repo:

```bash
python3 scripts/generate.py examples/eight_ball.json  -o eight_ball.glb
python3 scripts/generate.py examples/pool_table.json  -o pool_table.glb
python3 scripts/generate.py examples/map_pin.json     -o map_pin.glb   # teal location pin
```

Copy one as a starting point and edit it rather than authoring from scratch.

## Files in this skill

- `scripts/generate.py` — CLI entry point (spec → model file).
- `scripts/primitives.py` — procedural mesh builders.
- `scripts/transforms.py` — Euler→quaternion + TRS baking helpers.
- `scripts/gltf_writer.py` — pure-Python glTF/GLB exporter (PBR materials).
- `scripts/obj_writer.py` — Wavefront OBJ + MTL exporter.
- `scripts/validate_glb.py` — structural GLB validator.
- `examples/*.json` — sample scene specs.
- `references/scene-spec.md` — complete scene-spec reference.
- `references/authoring-tips.md` — practical modelling guidance.
