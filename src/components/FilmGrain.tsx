/**
 * Site-wide film grain. Fixed, non-interactive, ~5% opacity, overlay blend.
 * The noise is an inline SVG data URI — no network request, no asset to ship.
 * Rendered once in the root layout, above everything (z-9999).
 */
export function FilmGrain() {
  return <div className="film-grain" aria-hidden />;
}

export default FilmGrain;
