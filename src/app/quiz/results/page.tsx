'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import {
  COLOR_SEASONS,
  BODY_SHAPES,
  SKIN_TONES,
  OUTFITS,
  STYLE_CATEGORIES,
} from '@/data/styleData';

function Results() {
  const params = useSearchParams();
  const seasonId  = params.get('seasonId')  ?? 'soft-autumn';
  const skinToneId = params.get('skinTone') ?? 'medium-warm';
  const bodyShapeId = params.get('bodyShape') ?? 'hourglass';
  const styleIds  = params.get('styles')?.split(',') ?? [];

  const season    = COLOR_SEASONS.find((s) => s.id === seasonId) ?? COLOR_SEASONS[8];
  const bodyShape = BODY_SHAPES.find((b) => b.id === bodyShapeId) ?? BODY_SHAPES[0];
  const skinTone  = SKIN_TONES.find((t) => t.id === skinToneId) ?? SKIN_TONES[0];

  // Filter outfits by body shape and season relevance
  const relevantOutfits = OUTFITS.filter(
    (o) =>
      o.bodyShapes.includes(bodyShapeId) ||
      o.seasons.includes(seasonId) ||
      styleIds.some((s) => o.category === s)
  ).slice(0, 4);

  const SEASON_BG: Record<string, string> = {
    spring: 'from-pink-400 to-rose-400',
    summer: 'from-sky-400 to-blue-400',
    autumn: 'from-amber-500 to-orange-500',
    winter: 'from-slate-600 to-blue-700',
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${SEASON_BG[season.season]} rounded-3xl p-8 text-white mb-8 shadow-xl`}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm opacity-80 font-medium mb-1">הפרופיל הצבעוני שלך</p>
              <h1 className="text-4xl font-bold mb-2">{season.label}</h1>
              <p className="opacity-90 max-w-md leading-relaxed">{season.description}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
              <p className="text-xs opacity-70 mb-2">לוח הצבעים שלך</p>
              <div className="flex gap-2 flex-wrap">
                {season.palette.slice(0, 6).map((c) => (
                  <div key={c} className="w-8 h-8 rounded-full shadow-md ring-2 ring-white/50" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Skin tone card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full shadow-md ring-2 ring-gray-100" style={{ backgroundColor: skinTone.hex }} />
              <div>
                <p className="text-xs text-gray-400 font-medium">גוון עור</p>
                <p className="font-bold text-gray-800">{skinTone.label}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{skinTone.description}</p>
            <div className="mt-3 p-2.5 bg-rose-50 rounded-xl">
              <p className="text-xs text-rose-600 font-medium">מתכת מומלצת</p>
              <p className="text-sm font-bold text-rose-700">{season.metals.join(' · ')}</p>
            </div>
          </div>

          {/* Body shape card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{bodyShape.emoji}</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">מבנה גוף</p>
                <p className="font-bold text-gray-800">{bodyShape.label}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{bodyShape.description}</p>
            <div className="p-2.5 bg-violet-50 rounded-xl">
              <p className="text-xs text-violet-600 font-medium mb-1">מומלץ במיוחד</p>
              {bodyShape.ideal.slice(0, 2).map((item) => (
                <p key={item} className="text-xs text-violet-700">• {item}</p>
              ))}
            </div>
          </div>

          {/* Season extras */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium mb-3">איפור ואקססוריז</p>
            <div className="space-y-2">
              {season.makeup.slice(0, 3).map((m) => (
                <div key={m} className="flex items-center gap-2">
                  <span className="text-rose-400">✦</span>
                  <p className="text-sm text-gray-700">{m}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-2.5 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-600 font-medium mb-1">להימנע</p>
              {season.avoid.slice(0, 2).map((a) => (
                <p key={a} className="text-xs text-amber-700">✗ {a}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Best colors */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h2 className="font-bold text-gray-800 text-lg mb-4">הצבעים הכי מחמיאים לך</h2>
          <div className="flex flex-wrap gap-3">
            {season.bestColors.map((color) => (
              <span
                key={color}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200 shadow-sm"
              >
                {color}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            {season.palette.map((c) => (
              <div key={c} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl shadow-sm ring-2 ring-gray-100" style={{ backgroundColor: c }} />
                <p className="text-xs text-gray-400">{c}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body shape recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <span className="text-green-500">✓</span> מומלץ עבורך
            </h2>
            <ul className="space-y-2">
              {bodyShape.ideal.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-400 mt-0.5">●</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <span className="text-red-400">✗</span> כדאי להימנע
            </h2>
            <ul className="space-y-2">
              {bodyShape.avoid.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-300 mt-0.5">●</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outfit recommendations */}
        {relevantOutfits.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
            <h2 className="font-bold text-gray-800 text-lg mb-4">אאוטפיטים מומלצים עבורך</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relevantOutfits.map((outfit) => (
                <div key={outfit.id} className="border border-gray-100 rounded-xl p-4 hover:border-rose-200 hover:bg-rose-50/30 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {outfit.colors.map((c) => (
                        <div key={c} className="w-5 h-5 rounded-full ring-1 ring-gray-200" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                      {STYLE_CATEGORIES.find((s) => s.id === outfit.category)?.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{outfit.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{outfit.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/outfits"
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            ✦ עוד השראת אאוטפיטים
          </Link>
          <Link
            href="/color-seasons"
            className="px-6 py-3 bg-white text-rose-600 border-2 border-rose-200 rounded-xl font-semibold hover:bg-rose-50 transition-all"
          >
            גלי עוד על עונת הצבע שלך
          </Link>
          <Link
            href="/quiz"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            חזרה לשאלון
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-300 border-t-rose-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">טוענת תוצאות...</p>
        </div>
      </div>
    }>
      <Results />
    </Suspense>
  );
}
