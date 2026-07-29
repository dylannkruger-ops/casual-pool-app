import { byId } from '../data/roster';
import { Crown } from './Crown';

/**
 * Employee portraits. Rounded-square rather than circular — the models are
 * figurines and the clothing is what tells them apart, so cropping to a face
 * throws away the identity.
 */
export function Avatar({
  id,
  size = 40,
  ring = false,
  className = '',
  /**
   * Decorative by default: an avatar almost always sits next to the name, and
   * repeating it makes every control read "Marlow Marlow". Pass a label only
   * where the portrait stands alone.
   */
  alt = '',
}: {
  id: string;
  size?: number;
  ring?: boolean;
  className?: string;
  alt?: string;
}) {
  const e = byId(id);
  if (!e) return null;
  // Below ~28px the portraits read as identical dark squares — the shell colour
  // is only a thin rim at that scale. The eye tint comes back as a ring so the
  // team stays tellable apart in list rows and the sidebar.
  const tintRing = ring || size <= 28;
  return (
    <span
      title={e.name}
      className={`relative inline-block shrink-0 overflow-hidden bg-sunk ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        boxShadow: tintRing ? `0 0 0 ${size <= 28 ? 1.5 : 2}px ${e.tint}` : undefined,
      }}
    >
      <img src={e.avatar} alt={alt} width={size} height={size} className="h-full w-full object-cover" />
    </span>
  );
}

/** A collaborator — a person, so initials rather than a portrait. */
export function PersonAvatar({
  initials,
  size = 28,
  pending = false,
  title,
}: {
  initials: string;
  size?: number;
  pending?: boolean;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${
        pending ? 'border border-dashed border-line bg-surface text-ink/45' : 'bg-btn text-btn-ink'
      }`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials}
    </span>
  );
}

/** Overlapping stack used in task headers and list rows. */
export function AvatarStack({
  people,
  size = 26,
}: {
  people: { id: string; initials: string; name: string; pending?: boolean }[];
  size?: number;
}) {
  if (people.length === 0) return null;
  return (
    <span className="flex items-center">
      {people.slice(0, 4).map((p, i) => (
        <span key={p.id} className="rounded-full ring-2 ring-surface" style={{ marginLeft: i === 0 ? 0 : -8 }}>
          <PersonAvatar initials={p.initials} size={size} pending={p.pending} title={p.name} />
        </span>
      ))}
      {people.length > 4 && (
        <span className="ml-1 text-[11.5px] muted">+{people.length - 4}</span>
      )}
    </span>
  );
}

/** MOTE's mark — used where the leader is speaking or holding a decision. */
export function LeaderBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-crown-soft px-2 py-0.5 text-[10.5px] font-medium text-[#8a6a12]">
      <Crown size={10} />
      Leads
    </span>
  );
}
