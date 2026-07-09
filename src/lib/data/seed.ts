import type { Item } from "@/lib/types";

/**
 * Seed library — six placeholder items (2 free, 4 premium) with real
 * structure. These power the site in seed mode and double as the reference
 * payload for the SQL seed (supabase/seed.sql).
 *
 * Preview media is intentionally absent (previewImageUrl / previewVideoUrl are
 * null): the item cards draw a branded solid-colour placeholder from the
 * item's `accent` below, clearly marked for replacement. Swap in real looping
 * video + poster via the admin upload flow.
 *
 * The gated build prompts + asset bundles for these items live in
 * `seed-secrets.ts` (server-only) — never imported into a client bundle.
 */

// Placeholder tint per item, used by the card to draw a solid-colour preview.
export const SEED_TINTS: Record<string, string> = {
  meridian: "#1c2b3a",
  halcyon: "#25313a",
  "obsidian-studio": "#171a22",
  starfield: "#111d2e",
  vellichor: "#241f2e",
  cascade: "#1a2530",
};

export const SEED_ITEMS: Item[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "meridian",
    title: "Meridian",
    tagline: "A calm, credible landing page for developer tools.",
    description:
      "A single-screen SaaS landing built for developer-facing products. Restrained typography, one luminous hero moment, a feature triptych, a code-forward proof block and a quiet pricing teaser. Ships fast, reads honest, converts without shouting.",
    category: "template",
    tags: ["saas", "landing", "developer", "minimal"],
    tier: "free",
    previewVideoUrl: null,
    previewImageUrl: null,
    liveDemoUrl: null,
    techStack: ["Next.js", "Tailwind", "TypeScript"],
    isNew: false,
    dropWeek: "2026-06-12",
    sortOrder: 10,
    published: true,
    createdAt: "2026-06-12T00:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    slug: "halcyon",
    title: "Halcyon",
    tagline: "A pricing section that answers the objection before it forms.",
    description:
      "A drop-in pricing section: three tiers, a highlighted plan, an annual toggle with honest savings maths, and an FAQ that closes the loop. Designed to slot into any dark landing page and carry its own weight.",
    category: "section",
    tags: ["pricing", "section", "conversion", "faq"],
    tier: "free",
    previewVideoUrl: null,
    previewImageUrl: null,
    liveDemoUrl: null,
    techStack: ["React", "Tailwind"],
    isNew: false,
    dropWeek: "2026-06-19",
    sortOrder: 20,
    published: true,
    createdAt: "2026-06-19T00:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    slug: "obsidian-studio",
    title: "Obsidian Studio",
    tagline: "A design-studio site with the confidence of a monograph.",
    description:
      "A full multi-section studio/agency site: an editorial hero, a selected-works grid with case-study depth, a services ledger, a manifesto block and a contact close. Built to make a small studio look inevitable.",
    category: "template",
    tags: ["agency", "studio", "portfolio", "editorial"],
    tier: "premium",
    previewVideoUrl: null,
    previewImageUrl: null,
    liveDemoUrl: null,
    techStack: ["Next.js", "Tailwind", "Framer Motion", "TypeScript"],
    isNew: false,
    dropWeek: "2026-06-26",
    sortOrder: 30,
    published: true,
    createdAt: "2026-06-26T00:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    slug: "starfield",
    title: "Starfield",
    tagline: "A GPU-cheap particle hero that feels expensive.",
    description:
      "A WebGL hero scene: ten thousand instanced points drifting on a curl-noise field, parallaxing to the pointer, with a depth-of-field falloff and an accent light that breathes. A poster-image fallback and a reduced-motion still keep it honest on every device.",
    category: "scene",
    tags: ["webgl", "three", "hero", "particles"],
    tier: "premium",
    previewVideoUrl: null,
    previewImageUrl: null,
    liveDemoUrl: null,
    techStack: ["Three.js", "React Three Fiber", "GLSL"],
    isNew: false,
    dropWeek: "2026-07-03",
    sortOrder: 40,
    published: true,
    createdAt: "2026-07-03T00:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    slug: "vellichor",
    title: "Vellichor",
    tagline: "Six living backgrounds that never fight the foreground.",
    description:
      "A pack of six animated background layers — aurora drift, mesh gradient, grain-lit beam, slow starfield, noise fog and a caustic shimmer. CSS-first where possible, canvas where needed, each with a static fallback and a strict paint budget.",
    category: "background",
    tags: ["background", "gradient", "aurora", "canvas"],
    tier: "premium",
    previewVideoUrl: null,
    previewImageUrl: null,
    liveDemoUrl: null,
    techStack: ["CSS", "Canvas", "TypeScript"],
    isNew: true,
    dropWeek: "2026-07-03",
    sortOrder: 50,
    published: true,
    createdAt: "2026-07-03T00:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    slug: "cascade",
    title: "Cascade",
    tagline: "A bento feature grid that explains a product at a glance.",
    description:
      "An asymmetric bento section: six cells of varying weight, each a self-contained feature story with its own micro-illustration slot, that reflows gracefully from a 4-column desktop mosaic down to a single honest column on mobile.",
    category: "section",
    tags: ["bento", "features", "section", "grid"],
    tier: "premium",
    previewVideoUrl: null,
    previewImageUrl: null,
    liveDemoUrl: null,
    techStack: ["React", "Tailwind", "TypeScript"],
    isNew: true,
    dropWeek: "2026-07-03",
    sortOrder: 60,
    published: true,
    createdAt: "2026-07-03T00:00:00.000Z",
  },
];

export const SEED_SLUGS = SEED_ITEMS.map((i) => i.slug);
