// Record preview posters + looping videos for each demo UI.
//
// Loads public/demos/<slug>.html offline, captures a JPEG poster and a short
// scripted screen recording (webm), then transcodes to a web-friendly MP4
// (h264, yuv420p, faststart) so it autoplays muted-and-looping everywhere.
//
// Run: node scripts/record-previews.mjs
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DEMOS = join(ROOT, "public", "demos");
const OUT = join(ROOT, "public", "previews");
const TMP = "/tmp/lucen-rec";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const FFMPEG = "/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux";

const SLUGS = [
  "meridian",
  "halcyon",
  "obsidian-studio",
  "starfield",
  "vellichor",
  "cascade",
];

const VIEWPORT = { width: 1280, height: 800 };

mkdirSync(OUT, { recursive: true });
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

// In-page scroll + pointer choreography so the recording tours the UI.
async function choreograph(page) {
  await page.waitForTimeout(700);
  await page.mouse.move(VIEWPORT.width * 0.35, VIEWPORT.height * 0.4);
  // Smoothly scroll to the bottom and back over ~4.5s.
  await page.evaluate(async () => {
    const max = Math.max(
      0,
      document.body.scrollHeight - window.innerHeight,
    );
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const run = (from, to, ms) =>
      new Promise((res) => {
        if (to === from) return setTimeout(res, ms);
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / ms);
          window.scrollTo(0, from + (to - from) * ease(t));
          if (t < 1) requestAnimationFrame(step);
          else res();
        };
        requestAnimationFrame(step);
      });
    await run(0, max, 3000);
    await new Promise((r) => setTimeout(r, 500));
    await run(max, 0, 1600);
  });
  await page.mouse.move(VIEWPORT.width * 0.65, VIEWPORT.height * 0.55);
  await page.waitForTimeout(500);
}

async function record(slug, browser) {
  const url = "file://" + join(DEMOS, `${slug}.html`);
  const vidDir = join(TMP, slug);
  mkdirSync(vidDir, { recursive: true });

  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: { dir: vidDir, size: VIEWPORT },
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });

  // Poster: taken ~1.1s in so looping animations are mid-motion (feels alive).
  await page.waitForTimeout(1100);
  await page.screenshot({
    path: join(OUT, `${slug}.jpg`),
    type: "jpeg",
    quality: 82,
  });

  await choreograph(page);
  await ctx.close(); // finalises the webm

  const webm = readdirSync(vidDir).find((f) => f.endsWith(".webm"));
  if (!webm) throw new Error(`no video captured for ${slug}`);

  // Re-encode → clean VP8 WebM, scaled to 1024x640, muted. (The bundled
  // ffmpeg only ships libvpx; VP8 WebM autoplays-and-loops in Chrome/Firefox/
  // Edge. Safari falls back to the poster still + the live-demo iframe.)
  execFileSync(
    FFMPEG,
    [
      "-y",
      "-i", join(vidDir, webm),
      "-an",
      "-vf", "scale=1024:640",
      "-c:v", "libvpx",
      "-b:v", "900k",
      "-crf", "33",
      "-deadline", "good",
      "-cpu-used", "2",
      join(OUT, `${slug}.webm`),
    ],
    { stdio: "ignore" },
  );

  const kb = (p) =>
    Math.round(execFileSync("stat", ["-c", "%s", p]).toString() / 1024);
  console.log(
    `✓ ${slug}  poster ${kb(join(OUT, slug + ".jpg"))}kB  video ${kb(
      join(OUT, slug + ".webm"),
    )}kB`,
  );
}

const missing = SLUGS.filter((s) => !existsSync(join(DEMOS, `${s}.html`)));
if (missing.length) {
  console.error("Missing demo files:", missing.join(", "));
  process.exit(1);
}

const browser = await chromium.launch({ executablePath: CHROME });
for (const slug of SLUGS) {
  await record(slug, browser);
}
await browser.close();
console.log("All previews recorded to public/previews/");
