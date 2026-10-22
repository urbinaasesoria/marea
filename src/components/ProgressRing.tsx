import type { ReactNode } from "react";

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  tone?: "sea" | "coral" | "gold" | "light";
  children?: ReactNode;
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 5,
  label,
  tone = "sea",
  children,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = circumference * (1 - clamped);

  return (
    <div
      className={`progress-ring progress-ring--${tone}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `${Math.round(clamped * 100)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="progress-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="progress-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="progress-ring__content">{children}</div>
    </div>
  );
}
