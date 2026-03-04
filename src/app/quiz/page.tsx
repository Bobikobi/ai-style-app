'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StepIndicator from '@/components/step-indicator';
import SkinTonePicker from '@/components/skin-tone-picker';
import BodyShapeSelector from '@/components/body-shape-selector';
import { STYLE_CATEGORIES, SKIN_TO_SEASONS, COLOR_SEASONS } from '@/data/styleData';

const STEPS = ['שיטת ניתוח', 'גוון עור', 'מבנה גוף', 'סגנון', 'תוצאות'];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [skinTone, setSkinTone] = useState<string | null>(null);
  const [bodyShape, setBodyShape] = useState<string | null>(null);
  const [styles, setStyles] = useState<string[]>([]);

  const toggleStyle = (id: string) =>
    setStyles((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const canNext = () => {
    if (step === 1) return !!skinTone;
    if (step === 2) return !!bodyShape;
    if (step === 3) return styles.length > 0;
    return true;
  };

  const handleFinish = () => {
    if (!skinTone || !bodyShape) return;
    const seasonId = SKIN_TO_SEASONS[skinTone]?.[0] ?? 'soft-autumn';
    const params = new URLSearchParams({
      seasonId,
      skinTone,
      bodyShape,
      styles: styles.join(','),
    });
    router.push(`/quiz/results?${params.toString()}`);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-2">Personal Style Quiz</p>
          <h1 className="text-3xl font-light text-neutral-900 tracking-wide">שאלון הסגנון האישי</h1>
        </div>

        <StepIndicator steps={STEPS} current={step} />

        <div className="bg-white border border-stone-200 p-8">
          {/* Step 0: Method */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-light text-neutral-800 mb-6 text-center tracking-wide">איך תרצה להתחיל?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/analyze"
                  className="flex flex-col gap-3 p-6 border border-stone-200 hover:border-neutral-700 hover:bg-stone-50 transition-all"
                >
                  <p className="text-xs tracking-[0.2em] uppercase text-stone-400">מומלץ</p>
                  <p className="font-medium text-neutral-800">ניתוח מתמונה</p>
                  <p className="text-sm text-stone-500">העלה תמונה ואנחנו ננתח</p>
                </Link>
                <button
                  onClick={() => setStep(1)}
                  className="flex flex-col gap-3 p-6 border border-stone-200 hover:border-neutral-700 hover:bg-stone-50 transition-all text-right"
                >
                  <p className="text-xs tracking-[0.2em] uppercase text-stone-400">מדויק</p>
                  <p className="font-medium text-neutral-800">בחירה ידנית</p>
                  <p className="text-sm text-stone-500">בחר בעצמך את הנתונים</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Skin Tone */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-light text-neutral-800 mb-4 tracking-wide">מה גוון העור שלך?</h2>
              <SkinTonePicker selected={skinTone} onSelect={setSkinTone} />
            </div>
          )}

          {/* Step 2: Body Shape */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-light text-neutral-800 mb-4 tracking-wide">מה מבנה גופך?</h2>
              <BodyShapeSelector selected={bodyShape} onSelect={setBodyShape} />
            </div>
          )}

          {/* Step 3: Style Preferences */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-light text-neutral-800 mb-1 tracking-wide">אילו סגנונות אתה אוהב?</h2>
              <p className="text-stone-400 text-xs mb-5 tracking-wide">אפשר לבחור מספר סגנונות</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleStyle(cat.id)}
                    className={`flex flex-col gap-1.5 p-4 border transition-all text-right ${
                      styles.includes(cat.id)
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-500'
                    }`}
                  >
                    <p className="font-medium text-sm">{cat.label}</p>
                    <p className={`text-xs ${ styles.includes(cat.id) ? 'text-stone-300' : 'text-stone-400'}`}>{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 text-sm text-stone-600 border border-stone-200 hover:border-stone-400 transition-colors"
              >
                ← חזרה
              </button>
            ) : <div />}

            {step < 3 && step > 0 && (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="px-8 py-2.5 bg-neutral-900 text-white text-sm font-medium tracking-wider hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                הבא →
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleFinish}
                disabled={!canNext()}
                className="px-8 py-2.5 bg-neutral-900 text-white text-sm font-medium tracking-wider hover:bg-neutral-700 disabled:opacity-30 transition-colors"
              >
                קבל תוצאות →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
