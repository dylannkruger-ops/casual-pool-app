# Authoring Tips

Practical guidance for turning "make me a 3D X" into a good scene spec.

## Decompose before you write JSON

Sketch the object as a handful of primitives first. A stool = 1 cylinder seat +
3–4 cylinder legs. A rocket = cone nose + cylinder body + 3 fin boxes. A pin =
sphere head + cone body. Aim for the fewest primitives that read as the object;
5–15 nodes covers most props.

## Coordinate conventions

- **Y is up.** The ground is the XZ plane. To sit an object "on the floor,"
  translate it up by half its height so its base lands at `y = 0`.
- Primitives are **centred on the origin** before their transform. A `box` of
  `size [1,2,1]` spans `y ∈ [-1, 1]`; translate `+1` on Y to rest on the floor.
- **Rotation is Euler degrees, XYZ order.** `[90, 0, 0]` tips a Y-up cylinder to
  lie along the Z axis. `[0, 0, 180]` flips a cone to point down (used for the
  teardrop pin in `examples/map_pin.json`).

## Placement workflow

1. Model each part around the origin at its natural size via `params`.
2. Rotate it into orientation.
3. Translate it into place.
   (glTF applies scale → rotate → translate, in that order, per node.)

Keep a running mental picture of each part's bounding extent so neighbouring
parts touch instead of floating or intersecting badly. A little overlap at
joints is fine and usually looks better than a visible seam.

## Materials that read well

- **Matte plastic / fabric:** `metallic 0`, `roughness 0.7–0.95`.
- **Glossy plastic / billiard ball:** `metallic 0`, `roughness 0.1–0.3`.
- **Metal:** `metallic 1`, `roughness 0.2–0.5`. Metals get their colour from
  `baseColorFactor`, so tint gold/copper with the colour, not just metalness.
- **Emissive-looking bright colour:** this generator writes no emissive channel;
  approximate with a saturated `color` and low `roughness`.

Colours are 0–1 per channel. Convert an 8-bit hex like `#0F7B6C` by dividing
each byte by 255 → `[0.059, 0.482, 0.424]`.

## Tessellation vs file size

`segments`/`rings`/`sides` trade smoothness for size. Guidance:

- Hero object viewed up close: `segments 48`, `rings 24`.
- Background/placeholder prop: `segments 16–24`.
- Boxes and planes are already minimal — no tessellation knob needed.

Check the printed triangle count after generating; a few thousand triangles is
plenty for a single prop.

## Common recipes

- **Sit on floor:** `translation[1] = height / 2`.
- **Flatten a sphere into a disc/dome:** `scale [1, 0.3, 1]`.
- **Lay a cylinder on its side (a bar/rail):** `rotation [90, 0, 0]`, then
  translate.
- **Ring/hoop:** `torus` with small `tube` relative to `radius`.
- **Tapered peg or spike:** `cone`.

## Validate before handing off

After generating a `.glb`, run
`python3 scripts/validate_glb.py <file>` to confirm the binary is well-formed
and all indices are in range. Then, if the user wants to *see* it, suggest
dragging the file onto <https://gltf-viewer.donmccurdy.com> or
`<model-viewer>`, or loading it in this repo via `expo-three`.
