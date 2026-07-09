/**
 * The luminous layer that lives behind the glass — the glass rule made
 * literal. Soft accent-cyan gradient blobs over the near-black base, plus a
 * faint beam. Purely decorative, fixed, non-interactive, sits at z -10 so
 * every frosted surface has something luminous behind it.
 *
 * Static (no animation) — the moving light on the homepage is the kinetic
 * signature; this is the quiet ambient wash for every page.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      {/* Top-left cyan blob */}
      <div
        className="absolute -left-40 -top-40 size-[42rem] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(79,227,232,0.35), transparent 60%)",
        }}
      />
      {/* Lower-right deep teal blob */}
      <div
        className="absolute -bottom-52 right-[-10rem] size-[46rem] rounded-full opacity-30 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(43,166,171,0.4), transparent 60%)",
        }}
      />
      {/* Faint vertical beam through the centre */}
      <div
        className="absolute left-1/2 top-0 h-full w-[36rem] -translate-x-1/2 opacity-[0.12] blur-[80px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(125,238,241,0.5), transparent 70%)",
        }}
      />
      {/* Vignette to keep edges deep */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(5,6,8,0.85) 100%)",
        }}
      />
    </div>
  );
}

export default Backdrop;
