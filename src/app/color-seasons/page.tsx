'use client';
import { useState } from 'react';
import { COLOR_SEASONS } from '@/data/styleData';
import SeasonCard from '@/components/season-card';

const SEASON_LABELS: Record<string, { label: string; icon: string; desc: string; gradient: string }> = {
  spring: { label: 'אביב', icon: '🌸', desc: 'גוונים חמים, בהירים ועזים', gradient: 'from-pink-400 to-rose-400' },
  summer: { label: 'קיץ', icon: '☀️', desc: 'גוונים קרירים, מעושנים ועדינים', gradient: 'from-sky-400 to-blue-400' },
  autumn: { label: 'סתיו', icon: '🍂', desc: 'גוונים עשירים, עמוקים ואדמתיים', gradient: 'from-amber-500 to-orange-500' },
  winter: { label: 'חורף', icon: '❄️', desc: 'גוונים קרירים, נועזים ומנוגדים', gradient: 'from-slate-600 to-blue-700' },
};

const SEASONS_ORDER = ['spring', 'summer', 'autumn', 'winter'];

export default function ColorSeasonsPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const displayed = filter
    ? COLOR_SEASONS.filter((s) => s.season === filter)
    : COLOR_SEASONS;

  const selectedSeason = selected ? COLOR_SEASONS.find((s) => s.id === selected) : null;

  const SEASON_BG: Record<string, string> = {
    spring: 'from-pink-400 to-rose-400',
    summer: 'from-sky-400 to-blue-400',
    autumn: 'from-amber-500 to-orange-500',
    winter: 'from-slate-600 to-blue-700',
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">12 עונות הצבע</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          כל אדם שייך לאחת מ-12 עונות. גלי את שלך ותגלי אילו צבעים מחמיאים לך באמת
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Season filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setFilter(null)}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              !filter ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            כל העונות
          </button>
          {SEASONS_ORDER.map((s) => {
            const meta = SEASON_LABELS[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(filter === s ? null : s)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                  filter === s
                    ? `bg-gradient-to-r ${meta.gradient} text-white shadow-md`
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                }`}
              >
                {meta.icon} {meta.label}
              </button>
            );
          })}
        </div>

        {/* Season family headers */}
        {!filter ? (
          SEASONS_ORDER.map((seasonKey) => {
            const meta = SEASON_LABELS[seasonKey];
            const group = COLOR_SEASONS.filter((s) => s.season === seasonKey);
            return (
              <div key={seasonKey} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-xl shadow-md`}>
                    {meta.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{meta.label}</h2>
                    <p className="text-sm text-gray-500">{meta.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.map((season) => (
                    <button
                      key={season.id}
                      onClick={() => setSelected(selected === season.id ? null : season.id)}
                      className="text-right"
                    >
                      <SeasonCard seasonId={season.id} compact={selected !== season.id} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((season) => (
              <button
                key={season.id}
                onClick={() => setSelected(selected === season.id ? null : season.id)}
                className="text-right"
              >
                <SeasonCard seasonId={season.id} compact={selected !== season.id} />
              </button>
            ))}
          </div>
        )}

        {/* How to find your season */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">איך מוצאים את העונה שלך?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'גוון עור', desc: 'קרר לעומת חם — הגוון הבסיסי של העור שלך' },
              { icon: '✨', title: 'ניגודיות', desc: 'הפרש בין עור לשיער — גבוה, בינוני או נמוך' },
              { icon: '🌈', title: 'עצמת צבע', desc: 'האם הצבעים שלך בהירים ורכים, עמוקים וכהים?' },
            ].map((item) => (
              <div key={item.title} className="text-center p-4">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="font-bold text-gray-800 mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              ✦ גלי את העונה שלך עכשיו
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
