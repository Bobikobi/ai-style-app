'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SKIN_TONES, SKIN_TO_SEASONS, COLOR_SEASONS } from '@/data/styleData';
import SeasonCard from '@/components/season-card';

export default function SkinGuidePage() {
  const [selected, setSelected] = useState<string | null>(null);

  const skinTone = SKIN_TONES.find((t) => t.id === selected);
  const relatedSeasonIds = selected ? SKIN_TO_SEASONS[selected] ?? [] : [];
  const relatedSeasons = relatedSeasonIds.map((id) => COLOR_SEASONS.find((s) => s.id === id)).filter(Boolean);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">מדריך גוון עור</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          גוון העור שלך הוא המפתח לעונת הצבע ולצבעים שמחמיאים לך.
          בחרי את הגוון הקרוב ביותר אלייך
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Undertone explainer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { type: 'חם', icon: '🌞', desc: 'גוון זהבהב, אפרסקי או כתמתם. הצבעים שעושים לך טוב הם גוונים כתומים, צהובים וחומים.', colors: ['#FFD700', '#FF8C00', '#CD853F', '#8B4513'] },
            { type: 'קריר', icon: '🌙', desc: 'גוון ורדרד, כחלחל או אפרפר. גוונים כחולים, ורודים וסגולים מחמיאים לך.', colors: ['#B0C4DE', '#DDA0DD', '#8B008B', '#4169E1'] },
            { type: 'ניטרלי', icon: '⚖️', desc: 'שילוב של חם וקריר — גמישות מלאה. הרוב הגדול של הצבעים יתאים לך.', colors: ['#C19A6B', '#BC8F8F', '#778899', '#8FBC8F'] },
          ].map((u) => (
            <div key={u.type} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{u.icon}</span>
                <h3 className="font-bold text-gray-800 text-lg">גוון {u.type}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{u.desc}</p>
              <div className="flex gap-2">
                {u.colors.map((c) => (
                  <div key={c} className="w-7 h-7 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skin tone picker */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">בחרי את גוון העור שלך</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setSelected(selected === tone.id ? null : tone.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                selected === tone.id
                  ? 'border-rose-500 bg-rose-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-rose-300'
              }`}
            >
              <div
                className="w-14 h-14 rounded-full shadow-md ring-4 ring-white"
                style={{ backgroundColor: tone.hex }}
              />
              <p className="font-semibold text-gray-800 text-xs text-center">{tone.label}</p>
              {selected === tone.id && (
                <span className="text-xs text-rose-500 font-bold">✓ נבחר</span>
              )}
            </button>
          ))}
        </div>

        {/* Related seasons */}
        {skinTone && (
          <div>
            <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm mb-8">
              <h3 className="font-bold text-gray-900 text-xl mb-2">
                גוון עור: <span className="text-rose-500">{skinTone.label}</span>
              </h3>
              <p className="text-gray-600">{skinTone.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                גוון {skinTone.undertone === 'warm' ? 'חם 🌞' : 'קריר 🌙'}
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">עונות הצבע שלך</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {relatedSeasons.map((s) =>
                s ? <SeasonCard key={s.id} seasonId={s.id} /> : null
              )}
            </div>

            <div className="text-center">
              <Link
                href={`/quiz`}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                ✦ קבלי פרופיל מלא עם המלצות
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
