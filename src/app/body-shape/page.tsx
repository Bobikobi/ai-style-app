'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BODY_SHAPES } from '@/data/styleData';
import { detectBodyShape, type BodyShapeId, type Measurements } from '@/lib/bodyShapeAlgorithm';

const BodyAvatar3D = dynamic(() => import('@/components/body-avatar-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  ),
});

const SHAPES: { id: BodyShapeId; label: string; ratio: string }[] = [
  { id: 'hourglass',           label: 'שעון חול',    ratio: 'Bust = Hips, Narrow Waist' },
  { id: 'pear',                label: 'אגס',          ratio: 'Hips > Bust' },
  { id: 'apple',               label: 'תפוח',         ratio: 'Fuller Middle' },
  { id: 'rectangle',           label: 'מלבן',         ratio: 'Uniform Silhouette' },
  { id: 'inverted-triangle',   label: 'משולש הפוך',  ratio: 'Shoulders > Hips' },
];

interface MeasureForm { bust: string; waist: string; hips: string; shoulders: string; }

export default function BodyShapePage() {
  const [shapeId,  setShapeId]  = useState<BodyShapeId>('hourglass');
  const [mode,     setMode]     = useState<'browse' | 'measure'>('browse');
  const [form,     setForm]     = useState<MeasureForm>({ bust: '', waist: '', hips: '', shoulders: '' });
  const [detected, setDetected] = useState<ReturnType<typeof detectBodyShape> | null>(null);
  const shape = useMemo(() => BODY_SHAPES.find((b) => b.id === shapeId)!, [shapeId]);

  function handleDetect() {
    const b = parseFloat(form.bust), w = parseFloat(form.waist), h = parseFloat(form.hips);
    if (!b || !w || !h) return;
    const m: Measurements = { bust: b, waist: w, hips: h, shoulders: parseFloat(form.shoulders) || undefined };
    const result = detectBodyShape(m);
    setDetected(result);
    setShapeId(result.shape);
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col lg:flex-row bg-neutral-50">
      <div className="lg:w-[42%] bg-neutral-900 flex flex-col">
        <div className="flex-1 min-h-[480px] lg:min-h-0">
          <BodyAvatar3D shapeId={shapeId} className="w-full h-full" />
        </div>
        <div className="flex gap-px bg-neutral-700 border-t border-neutral-700">
          {SHAPES.map((s) => (
            <button key={s.id} onClick={() => { setShapeId(s.id); setDetected(null); }}
              className={`flex-1 py-3 text-xs font-medium tracking-wide transition-colors ${shapeId === s.id ? 'bg-stone-100 text-neutral-900' : 'bg-neutral-800 text-stone-400 hover:bg-neutral-700 hover:text-stone-200'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:w-[58%] flex flex-col overflow-y-auto">
        <div className="px-8 pt-10 pb-6 border-b border-stone-200">
          <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-2">Body Shape Analysis</p>
          <h1 className="text-3xl font-light text-neutral-900 tracking-wide mb-1">מדריך מבנה גוף</h1>
          <p className="text-sm text-stone-500">כל מבנה גוף הוא ייחודי. למד מה מחמיא לך ואיך ללבוש נכון.</p>
          <div className="flex gap-0 mt-6 border border-stone-200 w-fit">
            <button onClick={() => setMode('browse')} className={`px-5 py-2 text-xs font-medium tracking-wider uppercase transition-colors ${mode === 'browse' ? 'bg-neutral-900 text-white' : 'text-stone-500 hover:bg-stone-50'}`}>עיון</button>
            <button onClick={() => setMode('measure')} className={`px-5 py-2 text-xs font-medium tracking-wider uppercase transition-colors ${mode === 'measure' ? 'bg-neutral-900 text-white' : 'text-stone-500 hover:bg-stone-50'}`}>זיהוי לפי מידות</button>
          </div>
        </div>
        <div className="flex-1 px-8 py-7">
          {mode === 'browse' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <h2 className="text-2xl font-light text-neutral-800">{shape.label}</h2>
                  <span className="text-xs text-stone-400 tracking-widest uppercase">{SHAPES.find(s => s.id === shapeId)?.ratio}</span>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">{shape.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-stone-200 p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3">מה מומלץ ללבוש</p>
                  <ul className="space-y-2.5">
                    {shape.ideal.map((item) => (<li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700"><span className="mt-1.5 w-1.5 h-1.5 flex-shrink-0 bg-stone-600 rounded-full"/>{item}</li>))}
                  </ul>
                </div>
                <div className="border border-stone-200 p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3">כדאי להימנע</p>
                  <ul className="space-y-2.5">
                    {shape.avoid.map((item) => (<li key={item} className="flex items-start gap-2.5 text-sm text-stone-500"><span className="mt-1.5 w-1.5 h-1.5 flex-shrink-0 border border-stone-300 rounded-full"/>{item}</li>))}
                  </ul>
                </div>
              </div>
              <div className="border border-stone-200 p-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3">גוונים משלימים</p>
                <div className="flex gap-3 flex-wrap">
                  {shape.colors.map((c) => (<div key={c} className="flex flex-col items-center gap-1.5"><div className="w-10 h-10 shadow-sm ring-1 ring-stone-100" style={{ backgroundColor: c }}/><p className="text-[10px] text-stone-400 font-mono">{c}</p></div>))}
                </div>
              </div>
            </div>
          )}
          {mode === 'measure' && (
            <div className="space-y-6">
              <p className="text-sm text-stone-500 leading-relaxed">הזיני את מידותיך בסנטימטרים. האלגוריתם יזהה את מבנה גופך ויתאים את האווטר.</p>
              <div className="grid grid-cols-2 gap-4">
                {[{key:'bust',label:'חזה (Bust)',hint:'המקסימום מסביב לחזה'},{key:'waist',label:'מותן (Waist)',hint:'החלק הצר ביותר'},{key:'hips',label:'ירכיים (Hips)',hint:'המקסימום מסביב לירכיים'},{key:'shoulders',label:'כתפיים (opt.)',hint:'בין קצה כתף לכתף'}].map(({key,label,hint}) => (
                  <div key={key}>
                    <label className="block text-xs font-medium tracking-wide text-stone-600 mb-1.5">{label}</label>
                    <input type="number" placeholder="cm" value={form[key as keyof MeasureForm]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="w-full border border-stone-200 px-3 py-2.5 text-sm text-neutral-800 bg-white focus:outline-none focus:border-neutral-600 transition-colors placeholder:text-stone-300"/>
                    <p className="text-[10px] text-stone-400 mt-1">{hint}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleDetect} disabled={!form.bust || !form.waist || !form.hips} className="w-full py-3 bg-neutral-900 text-white text-xs font-medium tracking-[0.2em] uppercase hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">זהה מבנה גוף ←</button>
              {detected && (
                <div className="border border-stone-200 p-5 space-y-4">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1">זוהה</p>
                    <p className="text-2xl font-light text-neutral-800">{SHAPES.find(s => s.id === detected.shape)?.label}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400">ציוני התאמה</p>
                    {([...SHAPES].sort((a, b) => detected.scores[b.id] - detected.scores[a.id])).map((s) => (
                      <div key={s.id} className="flex items-center gap-3">
                        <span className="text-xs text-stone-500 w-24">{s.label}</span>
                        <div className="flex-1 h-1.5 bg-stone-100"><div className="h-full bg-neutral-700 transition-all duration-700" style={{ width: `${Math.round(detected.scores[s.id])}%` }}/></div>
                        <span className="text-[10px] text-stone-400 w-8 text-right">{Math.round(detected.scores[s.id])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="px-8 py-6 border-t border-stone-200">
          <Link href="/quiz" className="inline-flex items-center gap-3 px-8 py-3 bg-neutral-900 text-white text-xs font-medium tracking-[0.18em] uppercase hover:bg-neutral-700 transition-colors">קבל המלצות סגנון מלאות ←</Link>
        </div>
      </div>
    </div>
  );
}
