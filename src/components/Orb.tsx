import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import type { BreathPattern } from "../data/types";

interface OrbProps {
  scale?: number;
  duration?: number;
  accent?: BreathPattern["accent"];
  active?: boolean;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Orb({
  scale = 0.72,
  duration = 1000,
  accent = "sea",
  active = false,
  children,
  className,
  size = "md",
}: OrbProps) {
  return (
    <div className={cn("orb", `orb--${accent}`, `orb--${size}`, active && "is-active", className)}>
      <span className="orb__halo orb__halo--outer" aria-hidden="true" />
      <span className="orb__halo orb__halo--mid" aria-hidden="true" />
      <span
        className="orb__core"
        aria-hidden="true"
        style={{
          transform: `scale(${scale})`,
          transitionDuration: `${Math.max(120, duration)}ms`,
        }}
      />
      {children && <div className="orb__content">{children}</div>}
    </div>
  );
}
