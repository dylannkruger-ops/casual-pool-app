/**
 * Lucen design tokens — the single source of truth.
 *
 * These values are mirrored into the Tailwind v4 theme via CSS custom
 * properties in `src/app/globals.css` (the `@theme` block reads the same
 * numbers). Change a value here, update the matching CSS variable, and it
 * flows everywhere. No scattered hex values anywhere else in the codebase.
 *
 * Design language: dark base (never pure black), one luminous accent
 * (signal cyan) that always lives *behind* frosted glass, hairline light
 * borders, inner top highlight, soft deep shadows. Never milky-white glass.
 */

export const colors = {
  // Dark base — a near-black with a cool cast, never #000.
  void: "#050608", // deepest layer, page backdrop behind everything
  base: "#090B10", // default page background
  raised: "#0E1117", // raised surfaces sitting on base
  panel: "#12151C", // solid (non-glass) panels

  // Signal cyan — the single accent. Luminous, refracts through glass.
  accent: "#4FE3E8",
  accentBright: "#7DEEF1", // hover / active lift
  accentDim: "#2BA6AB", // pressed / muted accent text on light-on-dark

  // Ink — bone-toned off-whites and greys for text.
  bone: "#ECEAE3", // primary text (warm off-white, the "bone" highlight tone)
  muted: "#9AA1AD", // secondary text
  faint: "#5B6270", // tertiary / disabled text
  line: "#1B2029", // solid hairline where glass borders aren't used

  // Semantic
  success: "#5FD08A",
  warning: "#F5B14C",
  danger: "#F26D6D",
} as const;

/**
 * Glass recipe. The core visual language. Values are consumed by the
 * `.glass` utility layer in globals.css; documented here so intent is legible.
 */
export const glass = {
  blur: "18px", // backdrop-blur, spec range 16–20px
  saturate: "1.3", // backdrop-saturate
  // Dark-tinted fill — never milky white.
  fill: "rgba(10, 13, 18, 0.55)",
  fillStrong: "rgba(10, 13, 18, 0.72)",
  // Hairline border ≈ 14% accent opacity.
  border: "rgba(79, 227, 232, 0.14)",
  borderStrong: "rgba(79, 227, 232, 0.22)",
  // Inner top highlight — a 1px bone line catching light at the top edge.
  innerHighlight: "inset 0 1px 0 rgba(236, 234, 227, 0.09)",
  // Soft deep shadow.
  shadow: "0 24px 60px -20px rgba(0, 0, 0, 0.7)",
  // Accent glow for primary actions / focus.
  glow: "0 0 0 1px rgba(79, 227, 232, 0.5), 0 8px 30px -6px rgba(79, 227, 232, 0.35)",
} as const;

export const radius = {
  pill: "100px", // buttons & nav
  card: "20px",
  panel: "16px",
  chip: "8px",
} as const;

export const font = {
  display: '"Clash Display", ui-sans-serif, system-ui, sans-serif',
  body: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  mono: 'var(--font-jetbrains-mono), ui-monospace, "SF Mono", monospace',
} as const;

export const motion = {
  // Durations respected by every interactive element; disabled under
  // prefers-reduced-motion globally.
  fast: "120ms",
  base: "220ms",
  slow: "420ms",
  ease: "cubic-bezier(0.22, 1, 0.36, 1)", // gentle overshoot for lifts
  liftPx: "2px", // hover lift distance for pills / cards
} as const;

export const grain = {
  opacity: 0.05, // film grain overlay, site-wide
} as const;

export const tokens = { colors, glass, radius, font, motion, grain } as const;
export default tokens;
