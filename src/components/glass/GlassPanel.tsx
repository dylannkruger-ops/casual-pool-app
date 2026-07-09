import { cn } from "@/lib/utils";
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

type GlassPanelProps<T extends ElementType> = {
  as?: T;
  /** `strong` uses a denser fill + wider blur for foreground surfaces. */
  variant?: "default" | "strong";
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * The base frosted surface. Dark-tinted, hairline accent border, inner top
 * highlight, soft deep shadow. Always place something luminous behind it —
 * preview media, a gradient blob, giant background type, or beam light.
 * Never flat glass on flat black.
 */
export function GlassPanel<T extends ElementType = "div">({
  as,
  variant = "default",
  className,
  children,
  ...rest
}: GlassPanelProps<T>) {
  const Comp = (as ?? "div") as ElementType;
  return (
    <Comp
      className={cn(
        variant === "strong" ? "glass-strong" : "glass",
        "rounded-panel",
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export default GlassPanel;
