import { useId } from "react";
import type { ArtVariant } from "../data/types";
import { cn } from "../lib/utils";

type SceneKind = "hills" | "water" | "forest" | "dunes" | "cosmos" | "clouds";

interface Palette {
  sky: [string, string, string];
  glow: string;
  sun: string;
  back: string;
  mid: string;
  front: string;
  accent: string;
  kind: SceneKind;
  horizon: number;
  sunX: number;
  sunY: number;
  sunR: number;
}

const palettes: Record<ArtVariant, Palette> = {
  dawn: {
    sky: ["#f7ddc9", "#efb49b", "#d98c79"],
    glow: "#ffe8c8",
    sun: "#fff7e3",
    back: "#a6a99a",
    mid: "#71877c",
    front: "#3f5a54",
    accent: "#f3bd77",
    kind: "hills",
    horizon: 300,
    sunX: 268,
    sunY: 186,
    sunR: 54,
  },
  ocean: {
    sky: ["#d3e9ee", "#97c5cf", "#4f8c96"],
    glow: "#eaf7f4",
    sun: "#fff6dd",
    back: "#7fb3b7",
    mid: "#3d7d81",
    front: "#12414b",
    accent: "#d9efea",
    kind: "water",
    horizon: 258,
    sunX: 128,
    sunY: 158,
    sunR: 43,
  },
  forest: {
    sky: ["#e7ebd4", "#bccca6", "#829b7b"],
    glow: "#f5f2cf",
    sun: "#fbf4d6",
    back: "#7d9879",
    mid: "#4c6e5d",
    front: "#233f35",
    accent: "#a9c08f",
    kind: "forest",
    horizon: 290,
    sunX: 300,
    sunY: 142,
    sunR: 40,
  },
  ember: {
    sky: ["#f6d0ab", "#dc9273", "#a9544b"],
    glow: "#ffe0b2",
    sun: "#ffe8c1",
    back: "#9c6c5e",
    mid: "#6c4441",
    front: "#371f26",
    accent: "#f0a066",
    kind: "hills",
    horizon: 320,
    sunX: 210,
    sunY: 250,
    sunR: 62,
  },
  night: {
    sky: ["#2c4262", "#182c46", "#081522"],
    glow: "#c9d9e2",
    sun: "#f4ecd4",
    back: "#233849",
    mid: "#13273a",
    front: "#071523",
    accent: "#dce8ef",
    kind: "hills",
    horizon: 310,
    sunX: 288,
    sunY: 122,
    sunR: 34,
  },
  rain: {
    sky: ["#aabbbd", "#7b9298", "#4b656d"],
    glow: "#dbe7e7",
    sun: "#e8efec",
    back: "#6f868b",
    mid: "#4f696f",
    front: "#294349",
    accent: "#cfe0df",
    kind: "water",
    horizon: 270,
    sunX: 300,
    sunY: 118,
    sunR: 30,
  },
  meadow: {
    sky: ["#eef0cf", "#cfdaa8", "#9cb37e"],
    glow: "#fbf7d8",
    sun: "#fffbe4",
    back: "#a9bd85",
    mid: "#77945f",
    front: "#405e3e",
    accent: "#e4d98d",
    kind: "hills",
    horizon: 320,
    sunX: 116,
    sunY: 154,
    sunR: 46,
  },
  mountain: {
    sky: ["#e9e4d7", "#c3cfcd", "#8ba3a4"],
    glow: "#f4f7f0",
    sun: "#fdf9ec",
    back: "#9fb0ad",
    mid: "#6a8384",
    front: "#344f52",
    accent: "#eef0e5",
    kind: "hills",
    horizon: 286,
    sunX: 300,
    sunY: 130,
    sunR: 34,
  },
  cosmos: {
    sky: ["#3a3352", "#211d35", "#0b0a16"],
    glow: "#8f87b8",
    sun: "#e8ddc4",
    back: "#2a2440",
    mid: "#1a1730",
    front: "#0c0a18",
    accent: "#cfc5e6",
    kind: "cosmos",
    horizon: 380,
    sunX: 286,
    sunY: 152,
    sunR: 56,
  },
  sand: {
    sky: ["#f5e5c9", "#e7ceaa", "#c9a87c"],
    glow: "#fdf1d8",
    sun: "#fff8e8",
    back: "#d9be97",
    mid: "#c4a273",
    front: "#92734f",
    accent: "#f0ddb7",
    kind: "dunes",
    horizon: 300,
    sunX: 290,
    sunY: 140,
    sunR: 42,
  },
  dusk: {
    sky: ["#f2cdb2", "#c08b8b", "#5a4a63"],
    glow: "#ffd8b0",
    sun: "#ffe3b8",
    back: "#857070",
    mid: "#5c5268",
    front: "#2f2b42",
    accent: "#e7a085",
    kind: "water",
    horizon: 302,
    sunX: 190,
    sunY: 262,
    sunR: 52,
  },
  sky: {
    sky: ["#eaf4f7", "#c5e0e8", "#93bcc9"],
    glow: "#ffffff",
    sun: "#fffdf4",
    back: "#d5e7eb",
    mid: "#b5d4dc",
    front: "#88b2be",
    accent: "#f7fbfc",
    kind: "clouds",
    horizon: 340,
    sunX: 300,
    sunY: 110,
    sunR: 40,
  },
};

const stars = Array.from({ length: 30 }, (_, index) => ({
  x: (index * 97 + 13) % 400,
  y: (index * 53 + 17) % 260,
  r: index % 4 === 0 ? 1.5 : index % 3 === 0 ? 1.1 : 0.75,
  o: 0.28 + (index % 5) * 0.13,
}));

function waves(horizon: number, color: string, accent: string, id: string) {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const y = horizon + 16 + index * 24;
        return (
          <path
            key={index}
            d={`M-20 ${y} C 40 ${y - 7} 90 ${y + 7} 150 ${y} S 260 ${y - 7} 320 ${y} S 390 ${y + 7} 430 ${y}`}
            fill="none"
            stroke={index % 2 === 0 ? accent : color}
            strokeWidth={index === 0 ? 1.6 : 1}
            opacity={0.5 - index * 0.06}
            strokeLinecap="round"
          />
        );
      })}
      <rect x="0" y={horizon + 138} width="400" height="80" fill={`url(#${id}-deep)`} />
    </g>
  );
}

function trees(front: string, mid: string) {
  return (
    <g>
      {[42, 74, 102, 286, 318, 350, 376].map((x, index) => {
        const height = 54 + ((index * 23) % 46);
        const width = 16 + ((index * 7) % 12);
        const base = 398 + (index % 3) * 8;
        const color = index % 2 === 0 ? front : mid;
        return (
          <g key={x} opacity={index % 2 === 0 ? 0.92 : 0.6}>
            <path
              d={`M${x} ${base - height} L${x + width} ${base} L${x - width} ${base} Z`}
              fill={color}
            />
            <rect x={x - 1.5} y={base - 6} width="3" height="24" fill={color} />
          </g>
        );
      })}
    </g>
  );
}

function clouds(accent: string) {
  return (
    <g opacity="0.72">
      {[
        { x: 86, y: 146, w: 116, h: 24 },
        { x: 248, y: 196, w: 92, h: 18 },
        { x: 160, y: 248, w: 140, h: 20 },
        { x: 40, y: 296, w: 80, h: 14 },
      ].map((cloud, index) => (
        <g key={index} fill={accent} opacity={0.55 - index * 0.07}>
          <ellipse cx={cloud.x} cy={cloud.y} rx={cloud.w / 2} ry={cloud.h / 2} />
          <ellipse cx={cloud.x - cloud.w * 0.18} cy={cloud.y - 8} rx={cloud.w * 0.28} ry={cloud.h / 1.5} />
          <ellipse cx={cloud.x + cloud.w * 0.2} cy={cloud.y - 6} rx={cloud.w * 0.24} ry={cloud.h / 1.7} />
        </g>
      ))}
    </g>
  );
}

interface SceneArtProps {
  variant: ArtVariant;
  className?: string;
  label?: string;
}

/**
 * Original, generated scene art. Every practice gets a palette and horizon
 * rather than a stock photograph, so the visual language stays coherent and
 * fully owned by Marea.
 */
export function SceneArt({ variant, className, label }: SceneArtProps) {
  const rawId = useId();
  const id = `scene${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const palette = palettes[variant] ?? palettes.dawn;
  const { sky, glow, sun, back, mid, front, accent, kind, horizon, sunX, sunY, sunR } = palette;

  return (
    <div className={cn("scene-art", `scene-art--${variant}`, className)} aria-hidden={label ? undefined : "true"}>
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        role={label ? "img" : undefined}
        aria-label={label}
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor={sky[0]} />
            <stop offset="56%" stopColor={sky[1]} />
            <stop offset="100%" stopColor={sky[2]} />
          </linearGradient>
          <linearGradient id={`${id}-deep`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={front} stopOpacity="0" />
            <stop offset="100%" stopColor={front} stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0%" stopColor={glow} stopOpacity="0.9" />
            <stop offset="100%" stopColor={glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-vignette`} cx="0.5" cy="0.4" r="0.78">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.26" />
          </radialGradient>
        </defs>

        <rect width="400" height="500" fill={`url(#${id}-sky)`} />

        {(kind === "cosmos" || variant === "night") && (
          <g>
            {stars.map((star, index) => (
              <circle
                key={index}
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill={accent}
                opacity={star.o}
              />
            ))}
          </g>
        )}

        <ellipse cx={sunX} cy={sunY} rx={sunR * 3.4} ry={sunR * 3.4} fill={`url(#${id}-glow)`} />

        {variant !== "rain" && variant !== "sky" && (
          <circle cx={sunX} cy={sunY} r={sunR} fill={sun} opacity={variant === "night" ? 0.92 : 0.85} />
        )}

        {variant === "night" && (
          <circle cx={sunX} cy={sunY} r={sunR + 16} fill="none" stroke={accent} strokeWidth="0.8" opacity="0.25" />
        )}

        {kind === "cosmos" && (
          <g>
            <circle cx="112" cy="300" r="66" fill={mid} opacity="0.55" />
            <circle cx="112" cy="300" r="66" fill="none" stroke={accent} strokeWidth="1" opacity="0.28" />
            <ellipse
              cx="112"
              cy="300"
              rx="104"
              ry="22"
              fill="none"
              stroke={accent}
              strokeWidth="1.4"
              opacity="0.3"
              transform="rotate(-16 112 300)"
            />
          </g>
        )}

        {kind === "clouds" && clouds(accent)}

        {kind === "hills" && (
          <g>
            <path
              d={`M-20 ${horizon + 18} C 60 ${horizon - 34} 110 ${horizon - 8} 168 ${horizon - 26} S 272 ${horizon - 58} 330 ${horizon - 20} S 386 ${horizon - 6} 430 ${horizon - 30} L430 500 L-20 500 Z`}
              fill={back}
              opacity="0.68"
            />
            <path
              d={`M-20 ${horizon + 78} C 54 ${horizon + 30} 122 ${horizon + 62} 184 ${horizon + 34} S 300 ${horizon + 8} 360 ${horizon + 42} S 410 ${horizon + 58} 430 ${horizon + 44} L430 500 L-20 500 Z`}
              fill={mid}
              opacity="0.9"
            />
            <path
              d={`M-20 ${horizon + 154} C 60 ${horizon + 112} 128 ${horizon + 140} 196 ${horizon + 118} S 330 ${horizon + 96} 430 ${horizon + 128} L430 500 L-20 500 Z`}
              fill={front}
            />
            {variant === "mountain" && (
              <path
                d={`M40 ${horizon + 40} L140 ${horizon - 52} L206 ${horizon + 16} L268 ${horizon - 30} L360 ${horizon + 48} L360 ${horizon + 80} L40 ${horizon + 80} Z`}
                fill={front}
                opacity="0.68"
              />
            )}
            {variant === "meadow" && (
              <g stroke={accent} strokeWidth="1" opacity="0.5">
                {[24, 58, 92, 124, 330, 362].map((x) => (
                  <path key={x} d={`M${x} ${horizon + 168} q 4 -18 8 -26 M${x + 4} ${horizon + 166} q -8 -10 -12 -14`} fill="none" />
                ))}
              </g>
            )}
          </g>
        )}

        {kind === "forest" && (
          <g>
            <path
              d={`M-20 ${horizon + 30} C 80 ${horizon - 10} 160 ${horizon + 20} 240 ${horizon - 4} S 350 ${horizon - 18} 430 ${horizon + 10} L430 500 L-20 500 Z`}
              fill={back}
              opacity="0.55"
            />
            <path
              d={`M-20 ${horizon + 116} C 80 ${horizon + 72} 170 ${horizon + 96} 260 ${horizon + 70} S 380 ${horizon + 56} 430 ${horizon + 82} L430 500 L-20 500 Z`}
              fill={mid}
            />
            <path
              d={`M-20 ${horizon + 196} C 70 ${horizon + 156} 160 ${horizon + 180} 250 ${horizon + 158} S 370 ${horizon + 146} 430 ${horizon + 170} L430 500 L-20 500 Z`}
              fill={front}
            />
            {trees(front, mid)}
            <g opacity="0.35" fill={accent}>
              <circle cx="120" cy="332" r="2" />
              <circle cx="146" cy="352" r="1.4" />
              <circle cx="86" cy="368" r="1.7" />
              <circle cx="236" cy="326" r="1.5" />
            </g>
          </g>
        )}

        {kind === "water" && (
          <g>
            <rect x="0" y={horizon} width="400" height={500 - horizon} fill={front} opacity="0.92" />
            <path
              d={`M-20 ${horizon} C 60 ${horizon - 10} 140 ${horizon + 8} 210 ${horizon} S 340 ${horizon - 8} 430 ${horizon} L430 ${horizon + 24} L-20 ${horizon + 24} Z`}
              fill={accent}
              opacity="0.2"
            />
            <g opacity="0.55">
              <rect x={sunX - 18} y={horizon} width="36" height="140" fill={sun} opacity="0.25" />
              <rect x={sunX - 8} y={horizon} width="16" height="140" fill={sun} opacity="0.3" />
            </g>
            {waves(horizon, front, accent, id)}
            {variant === "rain" && (
              <g stroke={accent} strokeWidth="0.8" opacity="0.4">
                {Array.from({ length: 34 }, (_, index) => {
                  const x = (index * 37) % 400;
                  const y = (index * 61) % 320;
                  return <path key={index} d={`M${x} ${y} l-7 24`} />;
                })}
              </g>
            )}
          </g>
        )}

        {kind === "dunes" && (
          <g>
            <path
              d={`M-20 ${horizon + 22} C 70 ${horizon - 26} 160 ${horizon + 20} 250 ${horizon - 12} S 370 ${horizon - 30} 430 ${horizon - 4} L430 500 L-20 500 Z`}
              fill={back}
              opacity="0.7"
            />
            <path
              d={`M-20 ${horizon + 92} C 80 ${horizon + 40} 170 ${horizon + 100} 260 ${horizon + 62} S 360 ${horizon + 54} 430 ${horizon + 82} L430 500 L-20 500 Z`}
              fill={mid}
            />
            <path
              d={`M-20 ${horizon + 168} C 70 ${horizon + 128} 150 ${horizon + 176} 250 ${horizon + 144} S 360 ${horizon + 136} 430 ${horizon + 162} L430 500 L-20 500 Z`}
              fill={front}
            />
            <path
              d={`M-20 ${horizon + 216} C 90 ${horizon + 190} 190 ${horizon + 226} 280 ${horizon + 206} S 380 ${horizon + 200} 430 ${horizon + 210} L430 500 L-20 500 Z`}
              fill={front}
              opacity="0.55"
            />
          </g>
        )}

        <rect width="400" height="500" fill={`url(#${id}-vignette)`} />
      </svg>
      <span className="scene-art__grain" aria-hidden="true" />
    </div>
  );
}
