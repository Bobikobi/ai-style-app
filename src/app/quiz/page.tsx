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
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-violet-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">שאלון הסגנון האישי</h1>
          <p className="text-gray-500 mt-2">ענו על כמה שאלות וקבלו פרופיל סגנון מותאם אישית</p>
        </div>

        <StepIndicator steps={STEPS} current={step} />

        <div className="bg-white rounded-3xl shadow-lg border border-rose-100 p-8">
          {/* Step 0: Method */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">איך תרצי להתחיל?</h2>
              <p className="text-gray-500 text-center text-sm mb-8">בחרי את השיטה המועדפת עליך</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/analyze"
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-rose-400 hover:bg-rose-50 transition-all hover:scale-105"
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform">📸</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-800">ניתוח מתמונה</p>
                    <p className="text-sm text-gray-500 mt-1">העלי תמונה ואנחנו ננתח</p>
                  </div>
                  <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-medium">מומלץ</span>
                </Link>
                <button
                  onClick={() => setStep(1)}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all hover:scale-105"
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform">✍️</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-800">בחירה ידנית</p>
                    <p className="text-sm text-gray-500 mt-1">בחרי בעצמך את הנתונים</p>
                  </div>
                  <span className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-xs font-medium">מדויק</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Skin Tone */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">מה גוון העור שלך?</h2>
              <SkinTonePicker selected={skinTone} onSelect={setSkinTone} />
            </div>
          )}

          {/* Step 2: Body Shape */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">מה מבנה הגוף שלך?</h2>
              <BodyShapeSelector selected={bodyShape} onSelect={setBodyShape} />
            </div>
          )}

          {/* Step 3: Style Preferences */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">אילו סגנונות את אוהבת?</h2>
              <p className="text-gray-500 text-center text-sm mb-6">ניתן לבחור מספר סגנונות</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleStyle(cat.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                      styles.includes(cat.id)
                        ? 'border-rose-500 bg-rose-50 shadow-md shadow-rose-100'
                        : 'border-gray-200 bg-white hover:border-rose-300'
                    }`}
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <p className="font-semibold text-sm text-gray-800">{cat.label}</p>
                    <p className="text-xs text-gray-500 text-center">{cat.description}</p>
                    {styles.includes(cat.id) && (
                      <span className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    )}
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
                className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all"
              >
                ← חזרה
              </button>
            ) : (
              <div />
            )}

            {step < 3 && step > 0 && (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              >
                הבא →
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleFinish}
                disabled={!canNext()}
                className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-40"
              >
                ✦ קבלי תוצאות
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
