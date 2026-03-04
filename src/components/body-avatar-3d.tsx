'use client';
import { useRef, useEffect, useState } from 'react';
import type { BodyShapeId } from '@/lib/bodyShapeAlgorithm';

// ─── Shape profiles ────────────────────────────────────────────────────────────
// 10 right-side X values at fixed Y levels. Left side = 100 - x (mirror).
// Y levels: neck, shoulderTop, shoulder, bust, waist, hip, thigh, knee, ankle, foot

const BODY_Y = [32, 38, 46, 66, 88, 110, 138, 160, 202, 218];

const PROFILES: Record<BodyShapeId, number[]> = {
  //                    neck  shTop  shld  bust  waist  hip  thigh  knee  ankle  foot
  hourglass:          [ 55,   74,    76,   73,   59,    76,  68,    63,   57,    62 ],
  pear:               [ 55,   65,    67,   64,   60,    80,  74,    65,   57,    62 ],
  apple:              [ 55,   74,    77,   78,   79,    75,  66,    62,   56,    61 ],
  rectangle:          [ 55,   68,    69,   68,   66,    68,  64,    61,   56,    61 ],
  'inverted-triangle':[ 55,   82,    85,   80,   63,    62,  57,    54,   51,    56 ],
};

// ─── Path builder ──────────────────────────────────────────────────────────────
function buildBodyPath(xs: number[]): string {
  // Right side: top→bottom, mirror left side: bottom→top
  const ys = BODY_Y;
  const n  = xs.length;

  // Helper: cubic bezier segment with vertical control points
  function seg(
    x1: number, y1: number, x2: number, y2: number,
    tension = 0.42
  ): string {
    const dy = y2 - y1;
    return `C ${x1},${y1 + dy * tension} ${x2},${y2 - dy * tension} ${x2},${y2}`;
  }

  // Start at neck centre, descend right side
  let d = `M 50,${ys[0]}`;
  d += ` L ${xs[0]},${ys[0]}`;                         // neck → right neck
  for (let i = 1; i < n; i++) {
    d += ` ${seg(xs[i - 1], ys[i - 1], xs[i], ys[i])}`;
  }
  // Feet bar
  const lxs = xs.map((x) => 100 - x);
  d += ` L ${100 - xs[n - 1]},${ys[n - 1]}`;           // right foot → left foot (mirror)
  // Ascend left side
  for (let i = n - 2; i >= 0; i--) {
    d += ` ${seg(lxs[i + 1], ys[i + 1], lxs[i], ys[i])}`;
  }
  d += ' Z';
  return d;
}

// ─── Lerp helpers ──────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function lerpProfiles(from: number[], to: number[], t: number): number[] {
  return from.map((v, i) => lerp(v, to[i], t));
}

// ─── Labels ───────────────────────────────────────────────────────────────────
const SHAPE_LABEL: Record<BodyShapeId, string> = {
  hourglass:           'שעון חול',
  pear:                'אגס',
  apple:               'תפוח',
  rectangle:           'מלבן',
  'inverted-triangle': 'משולש הפוך',
};
const SHAPE_DESC: Record<BodyShapeId, string> = {
  hourglass:           'Bust ≈ Hips · Defined Waist',
  pear:                'Hips > Bust · Narrow Shoulders',
  apple:               'Fuller Middle · Undefined Waist',
  rectangle:           'Uniform Silhouette · Minimal Curve',
  'inverted-triangle': 'Wide Shoulders · Narrow Hips',
};

// ─── Main component ────────────────────────────────────────────────────────────
interface Props {
  shapeId: BodyShapeId;
  className?: string;
}

export default function BodyAvatar3D({ shapeId, className }: Props) {
  const pathRef    = useRef<SVGPathElement>(null);
  const currentRef = useRef<number[]>([...PROFILES.hourglass]);
  const rafRef     = useRef<number>(0);
  const [label, setLabel] = useState<BodyShapeId>(shapeId);

  useEffect(() => {
    const target = PROFILES[shapeId];
    const SPEED  = 0.08;

    function tick() {
      const cur = currentRef.current;
      let done  = true;
      for (let i = 0; i < cur.length; i++) {
        const diff = target[i] - cur[i];
        if (Math.abs(diff) > 0.05) {
          cur[i] += diff * SPEED;
          done = false;
        } else {
          cur[i] = target[i];
        }
      }
      if (pathRef.current) {
        pathRef.current.setAttribute('d', buildBodyPath(cur));
      }
      if (!done) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setLabel(shapeId);
      }
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shapeId]);

  // Auto-rotate (CSS animation on the inner group via translate trick)
  const initialPath = buildBodyPath(currentRef.current);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className ?? ''}`}>
      {/* Rotating glow disc */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-stone-700/30 blur-md" />

      <svg
        viewBox="0 0 100 240"
        className="w-full h-full"
        style={{ maxHeight: '100%' }}
        aria-hidden
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#D6C9BC" />
            <stop offset="50%"  stopColor="#C4B5A5" />
            <stop offset="100%" stopColor="#B8A898" />
          </linearGradient>
          <linearGradient id="bodyGradHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#DDD1C6" />
            <stop offset="100%" stopColor="#C4B5A5" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00000030" />
          </filter>
        </defs>

        {/* Platform */}
        <ellipse cx="50" cy="222" rx="22" ry="4" fill="#4a4540" opacity="0.25" />

        {/* Body silhouette */}
        <path
          ref={pathRef}
          d={initialPath}
          fill="url(#bodyGrad)"
          filter="url(#softShadow)"
          style={{ transition: 'fill 0.4s ease' }}
        />

        {/* Subtle body highlight */}
        <path
          ref={undefined}
          d={initialPath}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.8"
        />

        {/* Head */}
        <circle cx="50" cy="18" r="11" fill="url(#bodyGrad)" filter="url(#softShadow)" />
        {/* Hair suggestion */}
        <ellipse cx="50" cy="10" rx="8" ry="5" fill="#9C8472" opacity="0.7" />
        {/* Face features — minimal dots */}
        <circle cx="47" cy="19" r="1.0" fill="#8B7461" opacity="0.6" />
        <circle cx="53" cy="19" r="1.0" fill="#8B7461" opacity="0.6" />
        <path d="M 47.5,23 Q 50,25 52.5,23" stroke="#8B7461" strokeWidth="0.8"
              fill="none" strokeLinecap="round" opacity="0.55" />
      </svg>

      {/* Labels */}
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center pointer-events-none">
        <p className="text-[9px] tracking-[0.25em] uppercase text-stone-500 mb-0.5">
          {SHAPE_DESC[label]}
        </p>
        <p className="text-base font-light tracking-wider text-stone-700">
          {SHAPE_LABEL[label]}
        </p>
      </div>
    </div>
  );
}
