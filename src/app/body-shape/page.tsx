'use client';
import { useState, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { BODY_SHAPES } from '@/data/styleData';
import { detectBodyShape, type BodyShapeId } from '@/lib/bodyShapeAlgorithm';
import BodyAvatarFigure, { SHAPE_PRESETS } from '@/components/body-avatar-3d';

// ─── Skin tone presets ─────────────────────────────────────────────────────────
const SKIN_TONES = [
  { label: 'Porcelain',  hex: '#FDEBD0' },
  { label: 'Ivory',      hex: '#F5CFA2' },
  { label: 'Sand',       hex: '#E8B882' },
  { label: 'Beige',      hex: '#D4956A' },
  { label: 'Caramel',    hex: '#B8744A' },
  { label: 'Chestnut',   hex: '#8C4E28' },
  { label: 'Espresso',   hex: '#4E2410' },
];

// ─── Color helpers ─────────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : { r:200,g:170,b:148 };
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(x => Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const q = l < 0.5 ? l*(1+s) : l+s-l*s;
  const p = 2*l - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q-p)*6*t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q-p)*(2/3-t)*6;
    return p;
  };
  return rgbToHex(hue2rgb(h/360+1/3)*255, hue2rgb(h/360)*255, hue2rgb(h/360-1/3)*255);
}
/** Interpolate color at position t (0..1) across the skin-tone gradient */
function skinGradientColor(t: number): string {
  const stops = SKIN_TONES.map(s => hexToRgb(s.hex));
  const idx = t * (stops.length - 1);
  const lo  = stops[Math.floor(Math.min(idx, stops.length-2))];
  const hi  = stops[Math.ceil(Math.min(idx, stops.length-1))];
  const frac = idx - Math.floor(idx);
  return rgbToHex(
    lo.r + (hi.r - lo.r) * frac,
    lo.g + (hi.g - lo.g) * frac,
    lo.b + (hi.b - lo.b) * frac,
  );
}

// ─── Shape data ────────────────────────────────────────────────────────────────
const SHAPES: { id: BodyShapeId; label: string; labelEn: string }[] = [
  { id: 'hourglass',           label: 'שעון חול',   labelEn: 'Hourglass'         },
  { id: 'pear',                label: 'אגס',         labelEn: 'Pear'              },
  { id: 'apple',               label: 'תפוח',        labelEn: 'Apple'             },
  { id: 'rectangle',           label: 'מלבן',        labelEn: 'Rectangle'         },
  { id: 'inverted-triangle',   label: 'משולש הפוך', labelEn: 'Inverted Triangle' },
];

const SLIDER_CFG = [
  { key: 'bust',  label: 'חזה',    labelEn: 'Bust',  min: 70,  max: 130, accent: '#C4A882', dot: 'bg-[#C4A882]'  },
  { key: 'waist', label: 'מותן',   labelEn: 'Waist', min: 58,  max: 112, accent: '#88B8C8', dot: 'bg-[#88B8C8]'   },
  { key: 'hips',  label: 'ירכיים', labelEn: 'Hips',  min: 78,  max: 130, accent: '#B8A8D4', dot: 'bg-[#B8A8D4]'  },
] as const;

type MeasKey = 'bust' | 'waist' | 'hips';

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function BodyShapePage() {
  const [bust,  setBust]  = useState(92);
  const [waist, setWaist] = useState(74);
  const [hips,  setHips]  = useState(96);
  const [skinColor, setSkinColor] = useState('#C8A882');
  const [spectrumMode, setSpectrumMode] = useState<'skin' | 'rainbow'>('skin');
  const [thumbPos, setThumbPos] = useState(0.40);

  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setters: Record<MeasKey, (v: number) => void> = {
    bust: setBust, waist: setWaist, hips: setHips,
  };
  const values: Record<MeasKey, number> = { bust, waist, hips };

  const detected = useMemo(
    () => detectBodyShape({ bust, waist, hips }),
    [bust, waist, hips]
  );
  const shape = BODY_SHAPES.find((b) => b.id === detected.shape)!;
  const topShapes = useMemo(
    () => [...SHAPES].sort((a,b) => detected.scores[b.id] - detected.scores[a.id]),
    [detected]
  );

  function applyPreset(id: BodyShapeId) {
    const p = SHAPE_PRESETS[id];
    setBust(p.bust); setWaist(p.waist); setHips(p.hips);
  }

  // ── Color bar interaction ──────────────────────────────────────────────────
  const pickFromBar = useCallback((clientX: number) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setThumbPos(t);
    if (spectrumMode === 'rainbow') {
      setSkinColor(hslToHex(Math.round(t * 360), 65, 60));
    } else {
      setSkinColor(skinGradientColor(t));
    }
  }, [spectrumMode]);

  const onBarMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    pickFromBar(e.clientX);
  };
  const onBarMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) pickFromBar(e.clientX);
  };
  const onBarMouseUp = () => { dragging.current = false; };
  const onBarTouch = (e: React.TouchEvent) => {
    pickFromBar(e.touches[0].clientX);
  };

  // Skin gradient CSS
  const skinGradientCSS = `linear-gradient(to right, ${SKIN_TONES.map(s => s.hex).join(', ')})`;
  const rainbowGradientCSS = 'linear-gradient(to right, hsl(0,65%,60%),hsl(30,65%,60%),hsl(60,65%,60%),hsl(90,65%,60%),hsl(120,65%,60%),hsl(150,65%,60%),hsl(180,65%,60%),hsl(210,65%,60%),hsl(240,65%,60%),hsl(270,65%,60%),hsl(300,65%,60%),hsl(330,65%,60%),hsl(360,65%,60%))';

  return (
    <div dir="rtl" className="min-h-screen flex flex-col lg:flex-row bg-neutral-50"
         onMouseMove={onBarMouseMove} onMouseUp={onBarMouseUp}>

      {/* ── Left: Avatar panel ────────────────────────────────────────────────── */}
      <div className="lg:w-[44%] bg-neutral-900 flex flex-col items-center justify-between py-8 px-6 min-h-[520px] lg:min-h-screen sticky lg:top-0 lg:h-screen">

        {/* Title */}
        <div className="text-center w-full">
          <p className="text-[9px] tracking-[0.3em] uppercase text-stone-500 mb-1">Body Shape</p>
          <p className="text-xl font-light tracking-widest text-stone-200">
            {SHAPES.find(s => s.id === detected.shape)?.label}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex-1 w-full flex items-center justify-center" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          <BodyAvatarFigure
            bust={bust} waist={waist} hips={hips}
            skinColor={skinColor}
            showAnnotations
            className="h-full w-full"
            style={{ maxHeight: '100%', maxWidth: '260px' }}
          />
        </div>

        {/* Color swatch + measurement legend */}
        <div className="w-full space-y-3">
          {/* Current skin color swatch */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 rounded-full ring-1 ring-stone-600 flex-shrink-0"
                 style={{ backgroundColor: skinColor }} />
            <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">
              {skinColor}
            </span>
          </div>
          {/* Measurement legend */}
          <div className="grid grid-cols-3 gap-2">
            {SLIDER_CFG.map(({ key, label, dot }) => (
              <div key={key} className="text-center">
                <div className={`w-2 h-2 ${dot} rounded-full mx-auto mb-1`} />
                <p className="text-[9px] text-stone-500 uppercase tracking-widest">{label}</p>
                <p className="text-lg font-light text-stone-200">{values[key]}</p>
                <p className="text-[9px] text-stone-600">cm</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Controls ────────────────────────────────────────────────────── */}
      <div className="lg:w-[56%] overflow-y-auto">

        {/* Header */}
        <div className="px-8 pt-10 pb-6 border-b border-stone-200">
          <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">Interactive Body Analysis</p>
          <h1 className="text-3xl font-light text-neutral-900 mb-1">מדריך מבנה גוף</h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            הזיזי את הסליידרים לפי מידותייך — הדמות מתעדכנת בזמן אמת.
          </p>
        </div>

        <div className="px-8 py-7 space-y-10">

          {/* ── Measurements ──────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400">מידות בס&quot;מ</p>
            {SLIDER_CFG.map(({ key, label, labelEn, min, max, accent }) => (
              <div key={key}>
                <div className="flex items-baseline justify-between mb-2.5">
                  <span className="text-sm font-medium text-neutral-700">
                    {label}
                    <span className="text-[10px] text-stone-400 ms-1.5 tracking-wider">{labelEn}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={min} max={max} value={values[key]}
                      onChange={(e) => setters[key](Math.min(max, Math.max(min, Number(e.target.value))))}
                      className="w-16 border border-stone-200 text-center py-1 text-sm text-neutral-800 bg-white focus:outline-none focus:border-neutral-600"
                    />
                    <span className="text-xs text-stone-400">cm</span>
                  </div>
                </div>
                <div className="relative h-2 bg-stone-100 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-none"
                    style={{
                      width: `${((values[key] - min) / (max - min)) * 100}%`,
                      backgroundColor: accent,
                      opacity: 0.55,
                    }}
                  />
                </div>
                <input
                  type="range" min={min} max={max} value={values[key]}
                  onChange={(e) => setters[key](Number(e.target.value))}
                  className="w-full mt-1 cursor-pointer"
                  style={{ accentColor: accent }}
                />
                <div className="flex justify-between text-[9px] text-stone-300 -mt-1">
                  <span>{min}</span><span>{max}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Skin colour picker ────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400">גוון עור האווטר</p>
              {/* Toggle skin ↔ rainbow */}
              <div className="flex rounded-sm overflow-hidden border border-stone-200 text-[9px]">
                <button
                  onClick={() => { setSpectrumMode('skin'); setThumbPos(0.40); setSkinColor(skinGradientColor(0.40)); }}
                  className={`px-3 py-1.5 tracking-wider uppercase transition-colors ${
                    spectrumMode === 'skin'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-stone-500 hover:bg-stone-50'
                  }`}
                >גוון עור</button>
                <button
                  onClick={() => { setSpectrumMode('rainbow'); setThumbPos(0.10); setSkinColor(hslToHex(36,65,60)); }}
                  className={`px-3 py-1.5 tracking-wider uppercase transition-colors ${
                    spectrumMode === 'rainbow'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-stone-500 hover:bg-stone-50'
                  }`}
                >קשת צבעים</button>
              </div>
            </div>

            {/* Preset skin swatches (visible in skin mode) */}
            {spectrumMode === 'skin' && (
              <div className="flex gap-2 flex-wrap">
                {SKIN_TONES.map((st) => (
                  <button
                    key={st.hex}
                    title={st.label}
                    onClick={() => { setSkinColor(st.hex); setThumbPos(SKIN_TONES.indexOf(st) / (SKIN_TONES.length-1)); }}
                    className="w-8 h-8 rounded-full ring-1 ring-stone-100 transition-transform hover:scale-110 focus:outline-none"
                    style={{
                      backgroundColor: st.hex,
                      boxShadow: skinColor === st.hex ? `0 0 0 2px white, 0 0 0 4px ${st.hex}` : undefined,
                    }}
                  />
                ))}
              </div>
            )}

            {/* ── Gradient bar with draggable thumb ── */}
            <div className="space-y-1.5">
              <div
                ref={barRef}
                className="relative h-7 rounded-full cursor-crosshair select-none"
                style={{ background: spectrumMode === 'skin' ? skinGradientCSS : rainbowGradientCSS }}
                onMouseDown={onBarMouseDown}
                onMouseMove={onBarMouseMove}
                onMouseUp={onBarMouseUp}
                onTouchStart={onBarTouch}
                onTouchMove={(e) => pickFromBar(e.touches[0].clientX)}
              >
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none transition-none"
                  style={{ left: `calc(${thumbPos*100}% - 10px)`, backgroundColor: skinColor }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-stone-300 px-1">
                {spectrumMode === 'skin'
                  ? SKIN_TONES.map(s => <span key={s.hex}>{s.label.split(' ')[0]}</span>)
                  : ['0°','60°','120°','180°','240°','300°','360°'].map(l => <span key={l}>{l}</span>)
                }
              </div>
            </div>

            {/* Selected color display */}
            <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-100">
              <div className="w-10 h-10 rounded-sm ring-1 ring-stone-100 flex-shrink-0"
                   style={{ backgroundColor: skinColor }} />
              <div>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest mb-0.5">צבע נבחר</p>
                <p className="text-xs font-mono text-neutral-700">{skinColor.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* ── Quick presets ─────────────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-3">
              או בחרי גזרה מוכנה
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {SHAPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => applyPreset(s.id)}
                  className={`py-2.5 px-1 text-center text-xs font-medium tracking-wide transition-all border ${
                    detected.shape === s.id
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Detected shape ────────────────────────────────────────────────── */}
          <div className="border border-stone-200 bg-stone-50">
            <div className="px-5 py-4 border-b border-stone-200 flex items-baseline gap-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400">גזרה שזוהתה</p>
              <span className="text-2xl font-light text-neutral-800">
                {SHAPES.find(s => s.id === detected.shape)?.label}
              </span>
              <span className="text-xs text-stone-400 tracking-wider">
                {SHAPES.find(s => s.id === detected.shape)?.labelEn}
              </span>
            </div>
            <div className="px-5 py-4 space-y-2">
              {topShapes.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 w-20 text-right">{s.label}</span>
                  <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-700 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(detected.scores[s.id])}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 w-6 text-left">
                    {Math.round(detected.scores[s.id])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recommendations ───────────────────────────────────────────────── */}
          {shape && (
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400">המלצות לבוש</p>
              <p className="text-sm text-stone-600 leading-relaxed">{shape.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-stone-200 p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3">מה מומלץ ללבוש</p>
                  <ul className="space-y-2">
                    {shape.ideal.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700">
                        <span className="mt-1.5 w-1.5 h-1.5 flex-shrink-0 bg-stone-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-stone-200 p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3">כדאי להימנע</p>
                  <ul className="space-y-2">
                    {shape.avoid.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-stone-500">
                        <span className="mt-1.5 w-1.5 h-1.5 flex-shrink-0 border border-stone-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Colour dots */}
              <div className="flex gap-3 pt-1">
                {shape.colors.map((c) => (
                  <div key={c} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 ring-1 ring-stone-100 shadow-sm" style={{ backgroundColor: c }} />
                    <span className="text-[9px] text-stone-400 font-mono">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-2 pb-8">
            <Link
              href={`/quiz/results?seasonId=soft-autumn&skinTone=medium-warm&bodyShape=${detected.shape}&styles=`}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-neutral-900 text-white text-xs font-medium tracking-[0.18em] uppercase hover:bg-neutral-700 transition-colors"
            >
              קבל המלצות סגנון מלאות ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
