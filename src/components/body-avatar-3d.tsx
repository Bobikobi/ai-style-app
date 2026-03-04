'use client';
import { useRef, useEffect, type CSSProperties } from 'react';
import type { BodyShapeId } from '@/lib/bodyShapeAlgorithm';

// ─── Presets ───────────────────────────────────────────────────────────────────
const SHAPE_PRESETS: Record<BodyShapeId, { bust: number; waist: number; hips: number }> = {
  hourglass:           { bust: 95,  waist: 68,  hips: 97  },
  pear:                { bust: 85,  waist: 70,  hips: 102 },
  apple:               { bust: 100, waist: 94,  hips: 98  },
  rectangle:           { bust: 88,  waist: 80,  hips: 89  },
  'inverted-triangle': { bust: 100, waist: 72,  hips: 90  },
};

// ─── Color utilities ───────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 200, g: 170, b: 148 };
}
const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
const mx = (a: number, b: number, t: number) => a + (b - a) * t;
const rc = (r: number, g: number, b: number, a = 1) =>
  a < 1 ? `rgba(${cl(r)},${cl(g)},${cl(b)},${a})` : `rgb(${cl(r)},${cl(g)},${cl(b)})`;

function skinShades(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return {
    base:          rc(r, g, b),
    light:         rc(mx(r,255,.28), mx(g,255,.26), mx(b,255,.22)),
    lighter:       rc(mx(r,255,.52), mx(g,255,.48), mx(b,255,.40)),
    dark:          rc(mx(r,0,.30),   mx(g,0,.28),   mx(b,0,.24)),
    darker:        rc(mx(r,0,.56),   mx(g,0,.52),   mx(b,0,.46)),
    shadow:        rc(mx(r,0,.65),   mx(g,0,.60),   mx(b,0,.54), .55),
    rimLight:      rc(mx(r,255,.65), mx(g,255,.60), mx(b,255,.52), .36),
    hlSpot:        rc(mx(r,255,.82), mx(g,255,.78), mx(b,255,.68), .62),
  };
}

// ─── Measurement → half-width pixels ──────────────────────────────────────────
function toHalf(cm: number, lo: number, hi: number, pxLo: number, pxHi: number) {
  return pxLo + Math.max(0, Math.min(1, (cm - lo) / (hi - lo))) * (pxHi - pxLo);
}
function computeWidths(bust: number, waist: number, hips: number) {
  const bH  = toHalf(bust,  72, 128, 34, 60);
  const wH  = toHalf(waist, 58, 112, 22, 52);
  const hH  = toHalf(hips,  78, 130, 36, 65);
  const shH = Math.max(bH + 5, bH * 1.08);
  return { bH, wH, hH, shH };
}

// ─── SVG paths — viewBox 0 0 270 520, cx = 135 ────────────────────────────────
const CX = 135;

function buildBodyPath(bH: number, wH: number, hH: number, shH: number): string {
  const nH  = 10;
  const yN  = 86;  const ySh = 102;
  const yAx = 132; const yBt = 172;
  const yUb = 192; const yW  = 232;
  const yAb = 256; const yH  = 290;
  const yTJ = 328; const yK  = 408;
  const yCa = 454; const yAn = 492;
  const yF  = 510;
  const thH = hH * 0.86;
  const knH = 23; const caH = 19; const anH = 14;

  let d = `M ${CX},${yN} L ${CX+nH},${yN}`;
  d += ` C ${CX+nH},${yN+12} ${CX+shH-10},${ySh+2} ${CX+shH},${ySh}`;
  d += ` C ${CX+shH+5},${ySh+14} ${CX+bH+9},${yAx-7} ${CX+bH+2},${yAx}`;
  d += ` C ${CX+bH+3},${yAx+20} ${CX+bH+2},${yBt-14} ${CX+bH},${yBt}`;
  d += ` C ${CX+bH},${yBt+16} ${CX+bH-3},${yUb+2} ${CX+bH-7},${yUb}`;
  d += ` C ${CX+bH-9},${yUb+16} ${CX+wH+5},${yW-14} ${CX+wH},${yW}`;
  d += ` C ${CX+wH-1},${yW+16} ${CX+hH-10},${yAb+10} ${CX+hH-5},${yAb+14}`;
  d += ` C ${CX+hH-2},${yAb+28} ${CX+hH+2},${yH-12} ${CX+hH},${yH}`;
  d += ` C ${CX+hH},${yH+22} ${CX+thH+3},${yTJ-12} ${CX+thH},${yTJ}`;
  d += ` C ${CX+thH-1},${yTJ+28} ${CX+knH+3},${yK-28} ${CX+knH},${yK}`;
  d += ` C ${CX+knH},${yK+18} ${CX+caH+2},${yCa-16} ${CX+caH},${yCa}`;
  d += ` C ${CX+caH-1},${yCa+26} ${CX+anH+2},${yAn-12} ${CX+anH},${yAn}`;
  d += ` L ${CX+anH+7},${yF}`;
  d += ` L ${CX+6},${yF}`;
  d += ` C ${CX+6},${yF-16} ${CX+4},${yTJ+28} ${CX+2},${yTJ+12}`;
  d += ` C ${CX+1},${yTJ+3} ${CX-1},${yTJ+3} ${CX-2},${yTJ+12}`;
  d += ` C ${CX-4},${yTJ+28} ${CX-6},${yF-16} ${CX-6},${yF}`;
  d += ` L ${CX-anH-7},${yF}`;
  d += ` L ${CX-anH},${yAn}`;
  d += ` C ${CX-caH+1},${yCa+26} ${CX-caH},${yCa-16} ${CX-caH},${yCa}`;
  d += ` C ${CX-caH-2},${yK+18} ${CX-knH-3},${yK-28} ${CX-knH},${yK}`;
  d += ` C ${CX-thH-3},${yTJ+28} ${CX-thH},${yH+22} ${CX-thH},${yTJ}`;
  d += ` C ${CX-hH-2},${yH+22} ${CX-hH},${yH-12} ${CX-hH},${yH}`;
  d += ` C ${CX-hH+2},${yAb+28} ${CX-hH+5},${yAb+14} ${CX-hH+5},${yAb+14}`;
  d += ` C ${CX-hH+10},${yAb+10} ${CX-wH+1},${yW+16} ${CX-wH},${yW}`;
  d += ` C ${CX-wH-5},${yW-14} ${CX-bH+9},${yUb+16} ${CX-bH+7},${yUb}`;
  d += ` C ${CX-bH+3},${yUb+2} ${CX-bH},${yBt+16} ${CX-bH},${yBt}`;
  d += ` C ${CX-bH-2},${yBt-14} ${CX-bH-3},${yAx+20} ${CX-bH-2},${yAx}`;
  d += ` C ${CX-bH-9},${yAx-7} ${CX-shH-5},${ySh+14} ${CX-shH},${ySh}`;
  d += ` C ${CX-shH+10},${ySh+2} ${CX-nH},${yN+12} ${CX-nH},${yN} Z`;
  return d;
}

function buildRightArm(shH: number): string {
  const sx = CX + shH; const sy = 108;
  const ex = CX + shH + 46; const ey = 218;
  const wx = CX + shH + 38; const wy = 308;
  const hw = 8;
  return (
    `M ${sx-hw},${sy}` +
    ` C ${sx},${sy+22} ${ex+hw},${ey-36} ${ex+hw},${ey}` +
    ` C ${ex+hw},${ey+22} ${wx+6},${wy-22} ${wx+6},${wy}` +
    ` C ${wx+4},${wy+10} ${wx-7},${wy+8} ${wx-9},${wy-2}` +
    ` C ${wx-9},${wy-20} ${ex-hw},${ey+20} ${ex-hw},${ey}` +
    ` C ${ex-hw},${ey-38} ${sx-hw-4},${sy+20} ${sx-hw},${sy} Z`
  );
}

function buildLeftArm(shH: number): string {
  const sx = CX - shH; const sy = 108;
  const ex = CX - shH - 46; const ey = 218;
  const wx = CX - shH - 38; const wy = 308;
  const hw = 8;
  return (
    `M ${sx+hw},${sy}` +
    ` C ${sx},${sy+22} ${ex-hw},${ey-36} ${ex-hw},${ey}` +
    ` C ${ex-hw},${ey+22} ${wx-6},${wy-22} ${wx-6},${wy}` +
    ` C ${wx-4},${wy+10} ${wx+7},${wy+8} ${wx+9},${wy-2}` +
    ` C ${wx+9},${wy-20} ${ex+hw},${ey+20} ${ex+hw},${ey}` +
    ` C ${ex+hw},${ey-38} ${sx+hw+4},${sy+20} ${sx+hw},${sy} Z`
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  bust:    number;
  waist:   number;
  hips:    number;
  skinColor?: string;
  showAnnotations?: boolean;
  className?: string;
  style?: CSSProperties;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function BodyAvatarFigure({
  bust, waist, hips,
  skinColor = '#C8A882',
  showAnnotations = false,
  className, style,
}: Props) {
  const cur = useRef({ bust, waist, hips });
  const tgt = useRef({ bust, waist, hips });
  const rafId = useRef(0);

  const bodyRef   = useRef<SVGPathElement>(null);
  const hlRef     = useRef<SVGPathElement>(null);
  const edgeRef   = useRef<SVGPathElement>(null);
  const rArmRef   = useRef<SVGPathElement>(null);
  const lArmRef   = useRef<SVGPathElement>(null);
  const rHlRef    = useRef<SVGPathElement>(null);
  const lHlRef    = useRef<SVGPathElement>(null);

  // Update target on every prop change (no re-render needed)
  tgt.current = { bust, waist, hips };

  useEffect(() => {
    const SPEED = 0.10;
    function tick() {
      const c = cur.current;
      const t = tgt.current;
      let dirty = false;
      (['bust', 'waist', 'hips'] as const).forEach((k) => {
        const d = t[k] - c[k];
        if (Math.abs(d) > 0.06) { c[k] += d * SPEED; dirty = true; }
        else c[k] = t[k];
      });
      if (dirty) {
        const { bH, wH, hH, shH } = computeWidths(c.bust, c.waist, c.hips);
        const bd = buildBodyPath(bH, wH, hH, shH);
        const ra = buildRightArm(shH);
        const la = buildLeftArm(shH);
        [bodyRef, hlRef, edgeRef].forEach(r => r.current?.setAttribute('d', bd));
        [rArmRef, rHlRef].forEach(r => r.current?.setAttribute('d', ra));
        [lArmRef, lHlRef].forEach(r => r.current?.setAttribute('d', la));
      }
      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { bH, wH, hH, shH } = computeWidths(bust, waist, hips);
  const initBody = buildBodyPath(bH, wH, hH, shH);
  const initRA   = buildRightArm(shH);
  const initLA   = buildLeftArm(shH);

  const sh = skinShades(skinColor);

  const annBust  = 172;
  const annWaist = 232;
  const annHip   = 290;

  return (
    <div className={`relative flex items-center justify-center ${className ?? ''}`} style={style}>
      <svg viewBox="0 0 270 520" className="w-full h-full" style={{ maxHeight: '100%' }} aria-hidden>
        <defs>
          {/* ── Body gradients ── */}
          <linearGradient id="gBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={sh.light}  />
            <stop offset="32%"  stopColor={sh.base}   />
            <stop offset="72%"  stopColor={sh.dark}   />
            <stop offset="100%" stopColor={sh.darker} />
          </linearGradient>
          <radialGradient id="gHl" cx="48%" cy="35%" r="48%">
            <stop offset="0%"   stopColor={sh.hlSpot} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="gEdge" cx="50%" cy="50%" r="54%">
            <stop offset="62%"  stopColor="transparent" />
            <stop offset="100%" stopColor={sh.shadow} />
          </radialGradient>

          {/* ── Arm gradients ── */}
          <linearGradient id="gArmR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={sh.light}  />
            <stop offset="55%"  stopColor={sh.base}   />
            <stop offset="100%" stopColor={sh.darker} />
          </linearGradient>
          <linearGradient id="gArmL" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor={sh.light}  />
            <stop offset="55%"  stopColor={sh.base}   />
            <stop offset="100%" stopColor={sh.darker} />
          </linearGradient>

          {/* ── Head gradient ── */}
          <radialGradient id="gHead" cx="38%" cy="32%" r="62%">
            <stop offset="0%"   stopColor={sh.lighter} />
            <stop offset="58%"  stopColor={sh.base}    />
            <stop offset="100%" stopColor={sh.dark}    />
          </radialGradient>

          {/* ── Hair gradient ── */}
          <linearGradient id="gHair" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#8A6644" />
            <stop offset="100%" stopColor="#3A2416" />
          </linearGradient>

          <filter id="fDrop" x="-20%" y="-8%" width="140%" height="130%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#00000028" />
          </filter>
          <filter id="fSoft">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
          </filter>
          <filter id="fSoft2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx={CX} cy="516" rx="36" ry="6" fill="#00000018" />

        {/* ── Arms (behind body) ── */}
        <path ref={rArmRef} d={initRA} fill="url(#gArmR)" filter="url(#fDrop)" />
        <path ref={lArmRef} d={initLA} fill="url(#gArmL)" filter="url(#fDrop)" />
        <path ref={rHlRef}  d={initRA} fill="none" stroke={sh.rimLight} strokeWidth="0.9" />
        <path ref={lHlRef}  d={initLA} fill="none" stroke={sh.rimLight} strokeWidth="0.9" />

        {/* ── Body ── */}
        <path ref={bodyRef} d={initBody} fill="url(#gBody)" filter="url(#fDrop)" />
        {/* Center highlight */}
        <path                d={initBody} fill="url(#gHl)"   opacity="0.85" style={{ pointerEvents:'none' }} />
        {/* Edge depth */}
        <path ref={edgeRef} d={initBody} fill="url(#gEdge)" opacity="0.90" style={{ pointerEvents:'none' }} />
        {/* Rim stroke */}
        <path ref={hlRef}   d={initBody} fill="none"         stroke={sh.rimLight} strokeWidth="0.8" />

        {/* ── Muscle / body details ── */}
        {/* Navel */}
        <ellipse cx={CX} cy={250} rx="2.2" ry="2.8" fill={sh.dark} opacity="0.50" filter="url(#fSoft)" />
        {/* Waist crease */}
        <path d={`M ${CX-wH*0.6},${232} Q ${CX},${228} ${CX+wH*0.6},${232}`}
              stroke={sh.dark} strokeWidth="0.7" fill="none" opacity="0.30" strokeLinecap="round" />

        {/* ── Bust ── */}
        <ellipse cx={CX - bH*0.30} cy={annBust - 2} rx={bH*0.28} ry={bH*0.22}
                 fill={sh.shadow} opacity="0.28" filter="url(#fSoft2)" />
        <ellipse cx={CX + bH*0.30} cy={annBust - 2} rx={bH*0.28} ry={bH*0.22}
                 fill={sh.shadow} opacity="0.28" filter="url(#fSoft2)" />
        <ellipse cx={CX - bH*0.27} cy={annBust - 8} rx={bH*0.12} ry={bH*0.09}
                 fill={sh.hlSpot} opacity="0.72" filter="url(#fSoft)" />
        <ellipse cx={CX + bH*0.27} cy={annBust - 8} rx={bH*0.12} ry={bH*0.09}
                 fill={sh.hlSpot} opacity="0.72" filter="url(#fSoft)" />

        {/* ── Collarbone ── */}
        <path
          d={`M ${CX-shH*0.54},${104} Q ${CX-shH*0.22},${100} ${CX},${101} Q ${CX+shH*0.22},${100} ${CX+shH*0.54},${104}`}
          stroke={sh.dark} strokeWidth="1.0" fill="none" opacity="0.40" strokeLinecap="round"
        />

        {/* ── Neck ── */}
        <path d={`M ${CX-10},${68} C ${CX-10},${84} ${CX+10},${84} ${CX+10},${68} L ${CX+10},${75} C ${CX+10},${87} ${CX-10},${87} ${CX-10},${75} Z`}
              fill="url(#gHead)" />

        {/* ── Head ── */}
        {/* Ears */}
        <ellipse cx={CX-23} cy={50} rx="4" ry="5.5" fill="url(#gHead)" />
        <ellipse cx={CX+23} cy={50} rx="4" ry="5.5" fill="url(#gHead)" />
        {/* Head shape */}
        <ellipse cx={CX} cy={48} rx={22} ry={26} fill="url(#gHead)" filter="url(#fDrop)" />

        {/* ── Hair ── */}
        <ellipse cx={CX} cy={30} rx={23} ry={17} fill="url(#gHair)" />
        <ellipse cx={CX} cy={44} rx={24} ry={10} fill="url(#gHair)" />
        {/* Side strands */}
        <path d={`M ${CX-20},42 C ${CX-24},60 ${CX-23},78 ${CX-21},92`}
              stroke="#5A4028" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.80" />
        <path d={`M ${CX+20},42 C ${CX+24},60 ${CX+23},78 ${CX+21},92`}
              stroke="#5A4028" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.80" />
        {/* Hair shine */}
        <ellipse cx={CX-4} cy={26} rx={8} ry={4} fill="rgba(255,255,255,0.14)" />

        {/* ── Face ── */}
        {/* Brows */}
        <path d={`M ${CX-14},43 Q ${CX-8},40.5 ${CX-3.5},42.2`}
              stroke={sh.darker} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.78" />
        <path d={`M ${CX+3.5},42.2 Q ${CX+8},40.5 ${CX+14},43`}
              stroke={sh.darker} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.78" />
        {/* Eyes */}
        <ellipse cx={CX-8} cy={49} rx="2.5" ry="2.8" fill={sh.darker} />
        <ellipse cx={CX+8} cy={49} rx="2.5" ry="2.8" fill={sh.darker} />
        {/* Iris */}
        <circle cx={CX-8} cy={49} r="1.4" fill="#2A1A0E" />
        <circle cx={CX+8} cy={49} r="1.4" fill="#2A1A0E" />
        {/* Eye highlight */}
        <circle cx={CX-6.8} cy={47.8} r="0.8" fill="white" opacity="0.85" />
        <circle cx={CX+9.2} cy={47.8} r="0.8" fill="white" opacity="0.85" />
        {/* Nose */}
        <path d={`M ${CX},52 L ${CX-2.5},58 Q ${CX},60 ${CX+2.5},58`}
              stroke={sh.dark} strokeWidth="0.9" fill="none" opacity="0.42" strokeLinecap="round" />
        {/* Lips */}
        <path d={`M ${CX-5.5},63 Q ${CX-2},65.5 ${CX},65 Q ${CX+2},65.5 ${CX+5.5},63`}
              fill="#B86870" opacity="0.80" />
        <path d={`M ${CX-5},63 Q ${CX},61 ${CX+5},63`}
              stroke="#C08090" strokeWidth="0.8" fill="none" opacity="0.60" strokeLinecap="round" />
        {/* Cheek blush */}
        <ellipse cx={CX-14} cy={54} rx="5" ry="3" fill="#D08080" opacity="0.14" filter="url(#fSoft2)" />
        <ellipse cx={CX+14} cy={54} rx="5" ry="3" fill="#D08080" opacity="0.14" filter="url(#fSoft2)" />

        {/* ── Annotation lines ── */}
        {showAnnotations && (
          <g opacity="0.80">
            {/* Bust */}
            <line x1={CX-bH-16} y1={annBust}  x2={CX+bH+16} y2={annBust}
                  stroke="#C4A882" strokeWidth="0.9" strokeDasharray="3,2.5" />
            <circle cx={CX-bH-18} cy={annBust}  r="2.4" fill="#C4A882" />
            <circle cx={CX+bH+18} cy={annBust}  r="2.4" fill="#C4A882" />
            {/* Waist */}
            <line x1={CX-wH-16} y1={annWaist} x2={CX+wH+16} y2={annWaist}
                  stroke="#88B8C8" strokeWidth="0.9" strokeDasharray="3,2.5" />
            <circle cx={CX-wH-18} cy={annWaist} r="2.4" fill="#88B8C8" />
            <circle cx={CX+wH+18} cy={annWaist} r="2.4" fill="#88B8C8" />
            {/* Hips */}
            <line x1={CX-hH-16} y1={annHip}   x2={CX+hH+16} y2={annHip}
                  stroke="#B8A8D4" strokeWidth="0.9" strokeDasharray="3,2.5" />
            <circle cx={CX-hH-18} cy={annHip}   r="2.4" fill="#B8A8D4" />
            <circle cx={CX+hH+18} cy={annHip}   r="2.4" fill="#B8A8D4" />
            {/* Labels */}
            <text x="4" y={annBust +4} fontSize="7.5" fill="#C4A882" fontFamily="sans-serif">חזה</text>
            <text x="4" y={annWaist+4} fontSize="7.5" fill="#88B8C8" fontFamily="sans-serif">מותן</text>
            <text x="4" y={annHip  +4} fontSize="7.5" fill="#B8A8D4" fontFamily="sans-serif">ירכיים</text>
          </g>
        )}
      </svg>
    </div>
  );
}

export { SHAPE_PRESETS };
