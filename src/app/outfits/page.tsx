'use client';
import { useState } from 'react';
import Link from 'next/link';
import { OUTFITS, STYLE_CATEGORIES, BODY_SHAPES } from '@/data/styleData';

export default function OutfitsPage() {
  const [catFilter,   setCatFilter]   = useState<string | null>(null);
  const [shapeFilter, setShapeFilter] = useState<string | null>(null);

  const displayed = OUTFITS.filter(
    (o) =>
      (!catFilter   || o.category === catFilter) &&
      (!shapeFilter || o.bodyShapes.includes(shapeFilter))
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">השראת אאוטפיטים</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          גלריה של לוקים מקצועיים, ממוינים לפי סגנון ומבנה גוף
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <button
            onClick={() => setCatFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              !catFilter ? 'bg-gray-900 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            כל הסגנונות
          </button>
          {STYLE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCatFilter(catFilter === c.id ? null : c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                catFilter === c.id
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Body shape filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setShapeFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !shapeFilter ? 'bg-violet-600 text-white shadow' : 'bg-white text-gray-500 border border-gray-200 hover:border-violet-300'
            }`}
          >
            כל מבני הגוף
          </button>
          {BODY_SHAPES.map((b) => (
            <button
              key={b.id}
              onClick={() => setShapeFilter(shapeFilter === b.id ? null : b.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                shapeFilter === b.id
                  ? 'bg-violet-600 text-white shadow'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-violet-300'
              }`}
            >
              {b.emoji} {b.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500">לא נמצאו תוצאות — נסי סינון אחר</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((outfit) => {
              const cat = STYLE_CATEGORIES.find((c) => c.id === outfit.category);
              return (
                <div
                  key={outfit.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group"
                >
                  {/* Color bar */}
                  <div className="h-3 flex">
                    {outfit.colors.map((c) => (
                      <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>

                  <div className="p-5">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium">
                        {cat?.icon} {cat?.label}
                      </span>
                      {outfit.bodyShapes.slice(0, 2).map((shapeId) => {
                        const s = BODY_SHAPES.find((b) => b.id === shapeId);
                        return s ? (
                          <span key={shapeId} className="px-2.5 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-medium">
                            {s.emoji} {s.label}
                          </span>
                        ) : null;
                      })}
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-2">{outfit.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{outfit.description}</p>

                    <div className="mt-4 flex gap-1.5">
                      {outfit.colors.map((c) => (
                        <div key={c} className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {outfit.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            ✦ קבלי המלצות מותאמות אישית
          </Link>
        </div>
      </div>
    </div>
  );
}

