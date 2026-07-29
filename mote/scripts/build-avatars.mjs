/**
 * Regenerates public/team/* from the original character renders.
 *
 * Not part of the build — the outputs are committed. Run it only when a render
 * changes or a new character joins:
 *
 *   npm i -D sharp && SOURCES=/path/to/renders node scripts/build-avatars.mjs
 *
 * SOURCES must contain the group shot and the five solo renders under the
 * filenames below.
 */
import sharp from 'sharp';

const UP = (process.env.SOURCES ?? './renders').replace(/\/?$/, '/');
const LINEUP = UP + '24ffd8dd-IMG_5668.png';
const OUT = new URL('../public/team/', import.meta.url).pathname;

// 4:5 head-and-torso portraits. The clothing is the identity — the crown, the
// headset, the glasses, the tool belt — so a tight face crop loses the character.
// In the group shot the figures sit ~175px apart, so the box is sized to land just
// inside each neighbour.
const LINEUP_HEADS = [
  { id: 'wren', cx: 145 },
  { id: 'vance', cx: 320 },
  { id: 'marlow', cx: 492 },
  { id: 'tally', cx: 1057 },
].map((c) => ({ id: c.id, left: Math.max(0, c.cx - 76), top: 288, width: 152, height: 190 }));

const SOLO = [
  { id: 'mote', src: '01861694-IMG_5673.png', left: 218, top: 45, width: 588, height: 735 },
  { id: 'ash', src: '71058213-IMG_5669.png', left: 232, top: 150, width: 576, height: 720 },
  { id: 'sage', src: '4d70b504-IMG_5670.png', left: 243, top: 150, width: 544, height: 680 },
  { id: 'juno', src: '41a73fb1-IMG_5671.png', left: 240, top: 140, width: 544, height: 680 },
  { id: 'rig', src: 'a26a4ad9-IMG_5672.png', left: 223, top: 140, width: 584, height: 730 },
];

for (const c of LINEUP_HEADS) {
  await sharp(LINEUP)
    .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
    .resize(400, 500)
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}${c.id}.png`);
}

for (const c of SOLO) {
  await sharp(UP + c.src)
    .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
    .resize(400, 500)
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}${c.id}.png`);
}

console.log('avatars written to', OUT);

/**
 * The renders sit on white. On a dark UI that reads as a glowing white tile, so
 * the background is flood-filled to transparent from the edges inward — the
 * flood stops at the character, which keeps Sage's white shirt and Juno's
 * clapperboard intact where a plain "white = transparent" threshold would eat
 * them.
 */
async function cutout(file) {
  const img = sharp(file).ensureAlpha();
  const { width, height } = await img.metadata();
  const buf = await img.raw().toBuffer();
  const n = width * height;
  const clear = new Uint8Array(n);
  const stack = [];

  const isBg = (i) => {
    const p = i * 4;
    return buf[p] >= 228 && buf[p + 1] >= 228 && buf[p + 2] >= 228;
  };
  const push = (i) => {
    if (!clear[i] && isBg(i)) {
      clear[i] = 1;
      stack.push(i);
    }
  };

  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) push(i - 1);
    if (x < width - 1) push(i + 1);
    if (y > 0) push(i - width);
    if (y < height - 1) push(i + width);
  }

  // Soften the cut so the edge does not alias against a dark background.
  for (let i = 0; i < n; i++) {
    if (clear[i]) {
      buf[i * 4 + 3] = 0;
      continue;
    }
    const p = i * 4;
    const lum = (buf[p] + buf[p + 1] + buf[p + 2]) / 3;
    if (lum > 232) {
      const x = i % width;
      const y = (i / width) | 0;
      const touchesCleared =
        (x > 0 && clear[i - 1]) ||
        (x < width - 1 && clear[i + 1]) ||
        (y > 0 && clear[i - width]) ||
        (y < height - 1 && clear[i + width]);
      if (touchesCleared) buf[p + 3] = Math.round(255 * Math.max(0, (250 - lum) / 18));
    }
  }

  await sharp(buf, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(file);
}

for (const id of [...LINEUP_HEADS.map((c) => c.id), ...SOLO.map((c) => c.id)]) {
  await cutout(`${OUT}${id}.png`);
}
console.log('backgrounds cut out');
