'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BODY_SHAPES } from '@/data/styleData';
import { detectBodyShape, type BodyShapeId } from '@/lib/bodyShapeAlgorithm';
import BodyAvatarFigure, { SHAPE_PRESETS } from '@/components/body-avatar-3d';

const SHAPES: { id: BodyShapeId; label: string; labelEn: string }[] = [
  { id: 'hourglass',           label: 'שעון חול',   labelEn: 'Hourglass'          },
  { id: 'pear',                label: 'אגס',         labelEn: 'Pear'               },
  { id: 'apple',               label: 'תפוח',        labelEn: 'Apple'              },
  { id: 'rectangle',           label: 'מלבן',        labelEn: 'Rectangle'          },
  { id: 'inverted-triangle',   label: 'משולש הפוך', labelEn: 'Inverted Triangle'  },
];

const SLIDER_CFG = [
  { key: 'bust',  label: 'חזה',     labelEn: 'Bust',  min: 70,  max: 130, color: 'bg-rose-400',   dot: 'bg-rose-400'  },
  { key: 'waist', label: 'מותן',    labelEn: 'Waist', min: 58,  max: 112, color: 'bg-sky-400',    dot: 'bg-sky-400'   },
  { key: 'hips',  label: 'ירכיים',  labelEn: 'Hips',  min: 78,  max: 130, color: 'bg-purple-400', dot: 'bg-purple-400'},
] as const;

type MeasKey = 'bust' | 'waist' | 'hips';

export default function BodyShapePage() {
  const [bust,  setBust]  = useState(92);
  const [waist, setWaist] = useState(74);
  const [hips,  setHips]  = useState(96);

  const setters: Record<MeasKey, (v: number) => void> = {
    bust:  setBust,
    waist: setWaist,
    hips:  setHips,
  };
  const values: Record<MeasKey, number> = { bust, waist, hips };

  const detected = useMemo(
    () => detectBodyShape({ bust, waist, hips }),
    [bust, waist, hips]
  );

  const shape = BODY_SHAPES.find((b) => b.id === detected.shape)!;
  const topShapes = useMemo(
    () => [...SHAPES].sort((a, b) => detected.scores[b.id] - detected.scores[a.id]),
    [detected]
  );

  function applyPreset(id: BodyShapeId) {
    const p = SHAPE_PRESETS[id];
    setBust(p.bust); setWaist(p.waist); setHips(p.hips);
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col lg:flex-row bg-neutral-50">

      {/* ── Left: Avatar panel ──────────────────────────────────────────────── */}
      <div className="lg:w-[44%] bg-neutral-900 flex flex-col items-center justify-between py-8 px-4 min-h-[520px] lg:min-h-screen sticky lg:top-0 lg:h-screen">
        {/* Title */}
        <div className="text-center w-full">
          <p className="text-[9px] tracking-[0.3em] uppercase text-stone-500 mb-1">Body Shape</p>
          <p className="text-xl font-light tracking-widest text-stone-200">
            {topShapes[0] && SHAPES.find(s => s.id === detected.shape)?.label}
          </p>
        </div>

        {/* Figure */}
        <div className="flex-1 w-full flex items-center justify-center" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <BodyAvatarFigure
            bust={bust} waist={waist} hips={hips}
            showAnnotations
            className="h-full w-full"
            style={{ maxHeight: '100%', maxWidth: '240px' }}
          />
        </div>

        {/* Measurement legend at bottom */}
        <div className="w-full grid grid-cols-3 gap-2 mt-4">
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

      {/* ── Right: Controls + Results ───────────────────────────────────────── */}
      <div className="lg:w-[56%] overflow-y-auto">

        {/* Header */}
        <div className="px-8 pt-10 pb-6 border-b border-stone-200">
          <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">
            Interactive Body Analysis
          </p>
          <h1 className="text-3xl font-light text-neutral-900 mb-1">מדריך מבנה גוף</h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            הזיזי את הסליידרים לפי מידותייך — הדמות מתעדכנת בזמן אמת.
          </p>
        </div>

        <div className="px-8 py-7 space-y-8">

          {/* ── Sliders ────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400">מידות בס&quot;מ</p>
            {SLIDER_CFG.map(({ key, label, labelEn, min, max, color }) => (
              <div key={key}>
                <div className="flex items-baseline justify-between mb-2.5">
                  <span className="text-sm font-medium text-neutral-700">
                    {label}
                    <span className="text-[10px] text-stone-400 ms-1.5 tracking-wider">{labelEn}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={min} max={max}
                      value={values[key]}
                      onChange={(e) => {
                        const v = Math.min(max, Math.max(min, Number(e.target.value)));
                        setters[key](v);
                      }}
                      className="w-16 border border-stone-200 text-center py-1 text-sm text-neutral-800 bg-white focus:outline-none focus:border-neutral-600"
                    />
                    <span className="text-xs text-stone-400">cm</span>
                  </div>
                </div>
                <div className="relative h-2 bg-stone-100 rounded-full">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full ${color} opacity-60 transition-none`}
                    style={{ width: `${((values[key] - min) / (max - min)) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={min} max={max}
                  value={values[key]}
                  onChange={(e) => setters[key](Number(e.target.value))}
                  className="w-full mt-1 accent-neutral-700 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-stone-300 -mt-1">
                  <span>{min}</span><span>{max}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Quick presets ──────────────────────────────────────────────── */}
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

          {/* ── Detected shape ─────────────────────────────────────────────── */}
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

            {/* Match bars */}
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

          {/* ── Recommendations ────────────────────────────────────────────── */}
          {shape && (
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400">המלצות לבוש</p>
              <p className="text-sm text-stone-600 leading-relaxed">{shape.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-stone-200 p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3">
                    מה מומלץ ללבוש
                  </p>
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
                  <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3">
                    כדאי להימנע
                  </p>
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
