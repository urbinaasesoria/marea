import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

interface LogoProps {
  to?: string;
  tone?: "ink" | "light";
  compact?: boolean;
  className?: string;
}

export function Logo({ to = "/", tone = "ink", compact = false, className }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn("logo", `logo--${tone}`, compact && "logo--compact", className)}
      aria-label="Marea — home"
    >
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1.1" opacity="0.4" />
          <path
            d="M6 23.5c3.6 0 3.6-3.2 7.2-3.2s3.6 3.2 7.2 3.2 3.6-3.2 7.2-3.2 3.6 3.2 7.2 3.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 28c3.6 0 3.6-3.2 7.2-3.2s3.6 3.2 7.2 3.2 3.6-3.2 7.2-3.2 3.6 3.2 7.2 3.2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="20" cy="13" r="3.2" fill="currentColor" opacity="0.9" />
        </svg>
      </span>
      {!compact && (
        <span className="logo__word">
          marea
          <span className="logo__dot">.</span>
        </span>
      )}
    </Link>
  );
}
