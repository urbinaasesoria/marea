import { useId } from "react";
import { cn } from "../lib/utils";

interface RangeFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  hint?: string;
  className?: string;
  tone?: "ink" | "light";
  disabled?: boolean;
}

export function RangeField({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  format,
  hint,
  className,
  tone = "ink",
  disabled,
}: RangeFieldProps) {
  const id = useId();
  const progress = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div className={cn("range-field", `range-field--${tone}`, className)}>
      <div className="range-field__head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{format ? format(value) : Math.round(value * 100) + "%"}</output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ ["--range-progress" as string]: `${progress}%` }}
      />
      {hint && <p className="range-field__hint">{hint}</p>}
    </div>
  );
}
