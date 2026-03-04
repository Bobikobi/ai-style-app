'use client';
import { useRef, useEffect, type CSSProperties } from 'react';
import type { BodyShapeId } from '@/lib/bodyShapeAlgorithm';

// ─── Preset measurements per shape ────────────────────────────────────────────
const SHAPE_PRESETS: Record<BodyShapeId, { bust: number; waist: number; hips: number }> = {
  hourglass:           { bust: 95,  waist: 68,  hips: 97  },
  pear:                { bust: 85,  waist: 70,  hips: 102 },
  apple:               { bust: 100, waist: 94,  hips: 98  },
  rectangle:           { bust: 88,  waist: 80,  hips: 89  },
  'inverted-triangle': { bust: 100, waist: 72,  hips: 90  },
};

// ─── Measurement → pixel halfwidth ────────────────────────────────────────────
function toHalf(cm: number, minCm: number, maxCm: number, minPx: number, maxPx: number) {
  const t = Math.max(0, Math.min(1, (cm - minCm) / (maxCm - minCm)));
  return minPx + t * (maxPx - minPx);
}

function computeWidths(bust: number, waist: number, hips: number) {
  const bH  = toHalf(bust,  72, 128, 32, 58);
  const wH  = toHalf(waist, 58, 112, 20, 50);
  const hH  = toHalf(hips,  78, 130, 34, 62);
  const shH = Math.max(bH + 3, bH * 1.04);
  return { bH, wH, hH, shH };
}

// ─── SVG body path ─────────────────────────────────────────────────────────────
function buildPath(bH: number, wH: number, hH: number, shH: number): string {
  const cx = 100;
  const nH = 9;

  // Y anchors
  const yN   = 74;  // neck
  const ySh  = 88;  // shoulder
  const yAx  = 114; // armpit
  const yBt  = 150; // bust fullest
  const yUb  = 172; // under-bust
  const yW   = 210; // waist
  const yAb  = 232; // lower abdomen
  const yH   = 264; // hip fullest
  const yTJ  = 298; // thigh / crotch
  const yK   = 372; // knee
  const yCa  = 422; // calf
  const yAn  = 464; // ankle
  const yF   = 482; // floor
  const thH  = hH   * 0.86;
  const knH  = 21;
  const caH  = 19;
  const anH  = 13;

  // Right side (top → bottom) ──────────────────────────────────────────────────
  let d = `M ${cx},${yN} L ${cx + nH},${yN}`;
  // neck → shoulder
  d += ` C ${cx+nH},${yN+10} ${cx+shH-10},${ySh} ${cx+shH},${ySh}`;
  // shoulder → armpit
  d += ` C ${cx+shH+3},${ySh+10} ${cx+bH+7},${yAx-6} ${cx+bH+1},${yAx}`;
  // armpit → bust
  d += ` C ${cx+bH+2},${yAx+16} ${cx+bH+1},${yBt-10} ${cx+bH},${yBt}`;
  // bust curve (breast roundness)
  d += ` C ${cx+bH},${yBt+12} ${cx+bH-2},${yUb} ${cx+bH-5},${yUb}`;
  // under-bust → waist (inward)
  d += ` C ${cx+bH-7},${yUb+12} ${cx+wH+3},${yW-10} ${cx+wH},${yW}`;
  // waist → abdomen (outward)
  d += ` C ${cx+wH-1},${yW+12} ${cx+hH-8},${yAb+6} ${cx+hH-5},${yAb+10}`;
  // abdomen curve → hip
  d += ` C ${cx+hH-2},${yAb+22} ${cx+hH+1},${yH-8} ${cx+hH},${yH}`;
  // hip → thigh junction
  d += ` C ${cx+hH},${yH+18} ${cx+thH+2},${yTJ-8} ${cx+thH},${yTJ}`;
  // thigh outer → knee
  d += ` C ${cx+thH-1},${yTJ+22} ${cx+knH+2},${yK-22} ${cx+knH},${yK}`;
  // knee → calf
  d += ` C ${cx+knH},${yK+14} ${cx+caH+1},${yCa-12} ${cx+caH},${yCa}`;
  // calf → ankle
  d += ` C ${cx+caH-1},${yCa+22} ${cx+anH+1},${yAn-8} ${cx+anH},${yAn}`;
  // ankle → right toe
  d += ` L ${cx+anH+5},${yF}`;

  // Inner leg gap (crotch) ─────────────────────────────────────────────────────
  d += ` L ${cx+5},${yF}`;
  // Right inner thigh up
  d += ` C ${cx+5},${yF-12} ${cx+3},${yTJ+24} ${cx+2},${yTJ+10}`;
  // Crotch curve
  d += ` C ${cx+1},${yTJ+2} ${cx-1},${yTJ+2} ${cx-2},${yTJ+10}`;
  // Left inner thigh down
  d += ` C ${cx-3},${yTJ+24} ${cx-5},${yF-12} ${cx-5},${yF}`;
  d += ` L ${cx-anH-5},${yF}`;

  // Left leg (mirror) ──────────────────────────────────────────────────────────
  d += ` L ${cx-anH},${yAn}`;
  d += ` C ${cx-caH+1},${yCa+22} ${cx-caH},${yCa-12} ${cx-caH},${yCa}`;
  d += ` C ${cx-caH-1},${yK+14} ${cx-knH-2},${yK-22} ${cx-knH},${yK}`;
  d += ` C ${cx-thH-2},${yTJ+22} ${cx-thH},${yH+18} ${cx-thH},${yTJ}`;
  d += ` C ${cx-hH-1},${yH+18} ${cx-hH},${yH-8} ${cx-hH},${yH}`;
  d += ` C ${cx-hH+2},${yAb+22} ${cx-hH+5},${yAb+10} ${cx-hH+5},${yAb+10}`;
  d += ` C ${cx-hH+8},${yAb+6} ${cx-wH+1},${yW+12} ${cx-wH},${yW}`;
  d += ` C ${cx-wH-3},${yW-10} ${cx-bH+7},${yUb+12} ${cx-bH+5},${yUb}`;
  d += ` C ${cx-bH+2},${yUb} ${cx-bH},${yBt+12} ${cx-bH},${yBt}`;
  d += ` C ${cx-bH-1},${yBt-10} ${cx-bH-2},${yAx+16} ${cx-bH-1},${yAx}`;
  d += ` C ${cx-bH-7},${yAx-6} ${cx-shH-3},${ySh+10} ${cx-shH},${ySh}`;
  d += ` C ${cx-shH+10},${ySh} ${cx-nH},${yN+10} ${cx-nH},${yN}`;
  d += ` Z`;

  return d;
}

// ─── Main component ────────────────────────────────────────────────────────────
interface Props {
  bust:    number;
  waist:   number;
  hips:    number;
  shapeId?: BodyShapeId;
  showAnnotations?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function BodyAvatarFigure({
  bust, waist, hips, showAnnotations = false, className, style,
}: Props) {
  // Lerp state in refs (no re-render needed for animation)
  const cur   = useRef({ bust, waist, hips });
  const tgt   = useRef({ bust, waist, hips });
  const rafId = useRef(0);
  const bodyRef = useRef<SVGPathElement>(null);
  const hlRef   = useRef<SVGPathElement>(null);

  // Update target whenever props change
  tgt.current = { bust, waist, hips };

  useEffect(() => {
    const SPEED = 0.10;
    function tick() {
      const c = cur.current;
      const t = tgt.current;
      let dirty = false;
      (['bust', 'waist', 'hips'] as const).forEach((k) => {
        const diff = t[k] - c[k];
        if (Math.abs(diff) > 0.06) { c[k] += diff * SPEED; dirty = true; }
        else c[k] = t[k];
      });
      if (bodyRef.current) {
        const { bH, wH, hH, shH } = computeWidths(c.bust, c.waist, c.hips);
        const d = buildPath(bH, wH, hH, shH);
        bodyRef.current.setAttribute('d', d);
        if (hlRef.current) hlRef.current.setAttribute('d', d);
      }
      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { bH, wH, hH, shH } = computeWidths(bust, waist, hips);
  const initialD = buildPath(bH, wH, hH, shH);

  // Annotation positions
  const cx = 100;
  const annBust  = 150;
  const annWaist = 210;
  const annHip   = 264;

  return (
    <div className={`relative flex items-center justify-center ${className ?? ''}`} style={style}>
      <svg
        viewBox="0 0 200 500"
        className="w-full h-full"
        style={{ maxHeight: '100%' }}
        aria-hidden
      >
        <defs>
          <linearGradient id="fg-body" x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%"  stopColor="#D8CBBC" />
            <stop offset="40%" stopColor="#C9BAA8" />
            <stop offset="100%"stopColor="#B8A898" />
          </linearGradient>
          <linearGradient id="fg-hair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#7A5C3E" />
            <stop offset="100%"stopColor="#4A3422" />
          </linearGradient>
          <filter id="fg-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00000028" />
          </filter>
          <filter id="fg-soft">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="490" rx="28" ry="5" fill="#00000018" />

        {/* Body silhouette */}
        <path
          ref={bodyRef}
          d={initialD}
          fill="url(#fg-body)"
          filter="url(#fg-shadow)"
        />
        {/* Edge highlight */}
        <path
          ref={hlRef}
          d={initialD}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.7"
        />

        {/* ── Bust shape overlay ── */}
        <ellipse
          cx={cx - bH * 0.32}
          cy={annBust - 4}
          rx={bH * 0.30}
          ry={bH * 0.22}
          fill="rgba(160,138,120,0.18)"
          filter="url(#fg-soft)"
        />
        <ellipse
          cx={cx + bH * 0.32}
          cy={annBust - 4}
          rx={bH * 0.30}
          ry={bH * 0.22}
          fill="rgba(160,138,120,0.18)"
          filter="url(#fg-soft)"
        />

        {/* Head */}
        <circle cx="100" cy="46" r="22" fill="url(#fg-body)" filter="url(#fg-shadow)" />

        {/* Hair */}
        <ellipse cx="100" cy="30" rx="22" ry="16" fill="url(#fg-hair)" />
        <ellipse cx="100" cy="42" rx="23" ry="8"  fill="url(#fg-hair)" />
        {/* Hair waves */}
        <path d="M 78,38 C 75,50 72,62 74,80 C 76,70 78,58 80,46 Z"
              fill="url(#fg-hair)" opacity="0.85" />
        <path d="M 122,38 C 125,50 128,62 126,80 C 124,70 122,58 120,46 Z"
              fill="url(#fg-hair)" opacity="0.85" />

        {/* Face */}
        <ellipse cx="94"  cy="50" rx="1.8" ry="2.2" fill="#7A5A44" opacity="0.7" />
        <ellipse cx="106" cy="50" rx="1.8" ry="2.2" fill="#7A5A44" opacity="0.7" />
        {/* Brows */}
        <path d="M 90,45 Q 94,43 97,44.5" stroke="#6B4C38" strokeWidth="1.2"
              fill="none" strokeLinecap="round" opacity="0.65" />
        <path d="M 103,44.5 Q 106,43 110,45" stroke="#6B4C38" strokeWidth="1.2"
              fill="none" strokeLinecap="round" opacity="0.65" />
        {/* Lips */}
        <path d="M 95,57 Q 100,60 105,57" stroke="#A87060" strokeWidth="1.4"
              fill="none" strokeLinecap="round" opacity="0.7" />

        {/* Annotation lines (only when showAnnotations=true) */}
        {showAnnotations && (
          <g opacity="0.7">
            {/* Bust line */}
            <line x1={cx - bH - 12} y1={annBust} x2={cx + bH + 12} y2={annBust}
                  stroke="#C4A882" strokeWidth="0.8" strokeDasharray="2,2" />
            <circle cx={cx - bH - 14} cy={annBust} r="2" fill="#C4A882" />
            <circle cx={cx + bH + 14} cy={annBust} r="2" fill="#C4A882" />
            {/* Waist line */}
            <line x1={cx - wH - 12} y1={annWaist} x2={cx + wH + 12} y2={annWaist}
                  stroke="#A0B8C0" strokeWidth="0.8" strokeDasharray="2,2" />
            <circle cx={cx - wH - 14} cy={annWaist} r="2" fill="#A0B8C0" />
            <circle cx={cx + wH + 14} cy={annWaist} r="2" fill="#A0B8C0" />
            {/* Hip line */}
            <line x1={cx - hH - 12} y1={annHip} x2={cx + hH + 12} y2={annHip}
                  stroke="#B8A8C8" strokeWidth="0.8" strokeDasharray="2,2" />
            <circle cx={cx - hH - 14} cy={annHip} r="2" fill="#B8A8C8" />
            <circle cx={cx + hH + 14} cy={annHip} r="2" fill="#B8A8C8" />

            {/* Labels */}
            <text x="2" y={annBust + 3.5} fontSize="6" fill="#C4A882" fontFamily="sans-serif">חזה</text>
            <text x="2" y={annWaist + 3.5} fontSize="6" fill="#A0B8C0" fontFamily="sans-serif">מותן</text>
            <text x="2" y={annHip + 3.5} fontSize="6" fill="#B8A8C8" fontFamily="sans-serif">ירכיים</text>
          </g>
        )}
      </svg>
    </div>
  );
}

// Re-export shape presets for external use
export { SHAPE_PRESETS };
