-- ============================================================================
-- Lucen — optional seed for live mode. Inserts the six demo items and starter
-- secrets so a fresh database mirrors seed mode. Idempotent (ON CONFLICT).
--
-- The prompt_text here is a condensed starter. The full 800+ word reference
-- prompts ship in src/lib/data/seed-secrets.ts — paste/expand them via /admin,
-- or replace these entirely with your own. Dollar-quoting ($p$…$p$) lets the
-- prose contain any characters without escaping.
-- ============================================================================

insert into public.items
  (id, slug, title, tagline, description, category, tags, tier,
   tech_stack, is_new, drop_week, sort_order, published)
values
  ('00000000-0000-4000-8000-000000000001','meridian','Meridian',
   'A calm, credible landing page for developer tools.',
   'A single-screen SaaS landing built for developer-facing products. Restrained typography, one luminous hero moment, a feature triptych, a code-forward proof block and a quiet pricing teaser.',
   'template', array['saas','landing','developer','minimal'], 'free',
   array['Next.js','Tailwind','TypeScript'], false, '2026-06-12', 10, true),

  ('00000000-0000-4000-8000-000000000002','halcyon','Halcyon',
   'A pricing section that answers the objection before it forms.',
   'A drop-in pricing section: three tiers, a highlighted plan, an annual toggle with honest savings maths, and an FAQ that closes the loop.',
   'section', array['pricing','section','conversion','faq'], 'free',
   array['React','Tailwind'], false, '2026-06-19', 20, true),

  ('00000000-0000-4000-8000-000000000003','obsidian-studio','Obsidian Studio',
   'A design-studio site with the confidence of a monograph.',
   'A full multi-section studio/agency site: an editorial hero, a selected-works grid with case-study depth, a services ledger, a manifesto block and a contact close.',
   'template', array['agency','studio','portfolio','editorial'], 'premium',
   array['Next.js','Tailwind','Framer Motion','TypeScript'], false, '2026-06-26', 30, true),

  ('00000000-0000-4000-8000-000000000004','starfield','Starfield',
   'A GPU-cheap particle hero that feels expensive.',
   'A WebGL hero scene: ten thousand instanced points drifting on a curl-noise field, parallaxing to the pointer, with a depth-of-field falloff and an accent light that breathes.',
   'scene', array['webgl','three','hero','particles'], 'premium',
   array['Three.js','React Three Fiber','GLSL'], false, '2026-07-03', 40, true),

  ('00000000-0000-4000-8000-000000000005','vellichor','Vellichor',
   'Six living backgrounds that never fight the foreground.',
   'A pack of six animated background layers — aurora drift, mesh gradient, grain-lit beam, slow starfield, noise fog and a caustic shimmer. Each with a static fallback and a strict paint budget.',
   'background', array['background','gradient','aurora','canvas'], 'premium',
   array['CSS','Canvas','TypeScript'], true, '2026-07-03', 50, true),

  ('00000000-0000-4000-8000-000000000006','cascade','Cascade',
   'A bento feature grid that explains a product at a glance.',
   'An asymmetric bento section: six cells of varying weight, each a self-contained feature story, that reflows from a 4-column desktop mosaic to a single column on mobile.',
   'section', array['bento','features','section','grid'], 'premium',
   array['React','Tailwind','TypeScript'], true, '2026-07-03', 60, true)
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, tagline = excluded.tagline,
  description = excluded.description, category = excluded.category,
  tags = excluded.tags, tier = excluded.tier, tech_stack = excluded.tech_stack,
  is_new = excluded.is_new, drop_week = excluded.drop_week,
  sort_order = excluded.sort_order, published = excluded.published;

-- Starter secrets. Expand prompt_text to the full 800+ word prompts via /admin.
insert into public.item_secrets (item_id, prompt_text, iteration_notes, asset_bundle_path)
values
  ('00000000-0000-4000-8000-000000000001',
   $p$ROLE & STACK: Build a developer-tool landing page in Next.js + Tailwind + TypeScript. DESIGN THESIS: one calm, credible screen — restraint reads as confidence. TOKENS: near-black base, a single indigo accent, a four-step spacing scale, one display face at three weights. SIGNATURE: a single luminous hero gradient that resolves as the fold loads. LAYOUT: nav, hero, feature triptych, code-proof block, quiet pricing teaser, footer. MOTION: 200ms ease, fades only. PERFORMANCE: <=110kB First Load JS, LCP under 2s, zero CLS. BUILD ORDER: scaffold+tokens, hero, features, proof, pricing, polish — stop after each. (Starter — expand to the full prompt.)$p$,
   'Keep the hero to one idea; resist adding a second accent. Watch the code block for horizontal overflow on mobile.',
   'seed/meridian.zip'),

  ('00000000-0000-4000-8000-000000000002',
   $p$ROLE & STACK: Build a drop-in pricing section in React + Tailwind. DESIGN THESIS: answer the objection before it forms. TOKENS: cobalt/teal accent, hairline borders, generous cell padding. SIGNATURE: an annual/monthly toggle that animates the savings figure. LAYOUT: three tiers, highlighted middle plan, FAQ accordion. MOTION: 180ms toggle, height-animated FAQ. PERFORMANCE: no layout shift on toggle. BUILD ORDER: tokens, tier cards, toggle logic, FAQ, responsive pass. (Starter — expand to the full prompt.)$p$,
   'Do not hardcode the savings number — derive it from the prices so it never drifts.',
   'seed/halcyon.zip'),

  ('00000000-0000-4000-8000-000000000003',
   $p$ROLE & STACK: Build a design-studio site in Next.js + Tailwind + Framer Motion + TypeScript. DESIGN THESIS: the confidence of a monograph. TOKENS: warm clay accent, an editorial serif for display. SIGNATURE: a selected-works grid where each tile expands to a case study. LAYOUT: editorial hero, works grid, services ledger, manifesto, contact. MOTION: staggered reveals, 300ms. PERFORMANCE: image-heavy — use next/image, budget LCP. BUILD ORDER: hero, works, services, manifesto, contact. (Starter — expand to the full prompt.)$p$,
   'The works grid carries the site — invest there first. Keep the serif for display only, never body.',
   'seed/obsidian-studio.zip'),

  ('00000000-0000-4000-8000-000000000004',
   $p$ROLE & STACK: Build a WebGL particle hero in Three.js + React Three Fiber + GLSL. DESIGN THESIS: GPU-cheap, feels expensive. TOKENS: cyan accent light, deep base. SIGNATURE: ten thousand instanced points on a curl-noise field with pointer parallax and DOF falloff. LAYOUT: full-bleed canvas behind a glass headline. MOTION: continuous drift; reduced-motion renders a still poster. PERFORMANCE: single draw call, <=1 instanced mesh, 60fps on integrated GPUs. BUILD ORDER: canvas, points, curl noise, parallax, DOF, fallback. (Starter — expand to the full prompt.)$p$,
   'Add post-processing last and measure — bloom is where the frame budget goes. Always ship the reduced-motion still.',
   'seed/starfield.zip'),

  ('00000000-0000-4000-8000-000000000005',
   $p$ROLE & STACK: Build a pack of six animated backgrounds in CSS + Canvas + TypeScript. DESIGN THESIS: living backgrounds that never fight the foreground. TOKENS: per-layer low-saturation palettes. SIGNATURE: an aurora drift built from layered radial gradients. LAYOUT: each background is a self-contained component with a static fallback. MOTION: slow, sub-0.1Hz. PERFORMANCE: strict paint budget, CSS-first, canvas only where needed. BUILD ORDER: aurora, mesh gradient, beam, starfield, fog, caustic — one at a time. (Starter — expand to the full prompt.)$p$,
   'Keep contrast with the foreground low — test each layer under real body copy before shipping.',
   'seed/vellichor.zip'),

  ('00000000-0000-4000-8000-000000000006',
   $p$ROLE & STACK: Build a bento feature grid in React + Tailwind + TypeScript. DESIGN THESIS: explain a product at a glance. TOKENS: amber-gold accent, varied cell weights. SIGNATURE: an asymmetric six-cell mosaic that reflows to one column. LAYOUT: hero cell, two mediums, three supports, each with a micro-illustration slot. MOTION: hover elevation only, 160ms. PERFORMANCE: no re-render on pointer move. BUILD ORDER: grid skeleton, cell variants, illustration slots, responsive reflow. (Starter — expand to the full prompt.)$p$,
   'Guard against re-rendering the whole grid on mousemove — isolate hover state per cell.',
   'seed/cascade.zip')
on conflict (item_id) do update set
  prompt_text = excluded.prompt_text,
  iteration_notes = excluded.iteration_notes,
  asset_bundle_path = excluded.asset_bundle_path;
