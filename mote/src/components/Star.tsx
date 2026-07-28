export function Star({
  on,
  onClick,
  size = 16,
}: {
  on: boolean;
  onClick: () => void;
  size?: number;
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-pressed={on}
      aria-label={on ? 'Remove from favourites' : 'Add to favourites'}
      title={on ? 'Remove from favourites' : 'Add to favourites'}
      className={`inline-flex items-center justify-center rounded-lg p-1 transition ${
        on ? 'text-crown' : 'text-shell-ink/25 hover:text-shell-ink/50'
      }`}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
        <path
          d="M12 3.2l2.6 5.5 6 .85-4.35 4.2 1.05 5.95L12 16.9l-5.3 2.8 1.05-5.95L3.4 9.55l6-.85z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
