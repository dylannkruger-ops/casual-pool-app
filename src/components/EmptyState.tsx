import type { ReactNode } from "react";
import { GlassPanel } from "@/components/glass/GlassPanel";

/**
 * Designed empty state. Always tells the user what happened and what to do
 * next — never a bare "nothing here". Used for no-results, no-downloads, etc.
 */
export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <GlassPanel className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon && (
        <div className="grid size-12 place-items-center rounded-full bg-accent/10 text-accent">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-bone">{title}</h3>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </GlassPanel>
  );
}

export default EmptyState;
