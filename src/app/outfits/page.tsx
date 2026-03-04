'use client';
import { useState } from 'react';
import Link from 'next/link';
import { OUTFITS, STYLE_CATEGORIES, BODY_SHAPES } from '@/data/styleData';
import { getOutfitImageUrl } from '@/lib/imageService';

export default function OutfitsPage() {
  const [catFilter,   setCatFilter]   = useState<string | null>(null);
  const [shapeFilter, setShapeFilter] = useState<string | null>(null);
  const [imgErrors,  setImgErrors]   = useState<Record<number, boolean>>({});

  const displayed = OUTFITS.filter(
    (o) =>
      (!catFilter   || o.category === catFilter) &&
      (!shapeFilter || o.bodyShapes.includes(shapeFilter))
  );

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-neutral-900 py-20 px-4 text-center">
        <p className="text-stone-400 text-xs tracking-[0.25em] uppercase mb-4">Style Gallery</p>
        <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-wide">גלריית הלוקים</h1>
        <p className="text-stone-400 max-w-xl mx-auto text-base leading-relaxed">
          לוקים מקצועיים לכל אירוע וסגנון, ממוינים לפי מבנה גוף ועונת צבע
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <button
            onClick={() => setCatFilter(null)}
            className={`px-5 py-2 text-sm font-medium tracking-wide transition-all border ${
              !catFilter
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
          >
            הכל
          </button>
          {STYLE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCatFilter(catFilter === c.id ? null : c.id)}
              className={`px-5 py-2 text-sm font-medium tracking-wide transition-all border ${
                catFilter === c.id
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Body shape filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button
            onClick={() => setShapeFilter(null)}
            className={`px-4 py-1.5 text-xs font-medium tracking-wide transition-all border ${
              !shapeFilter ? 'bg-stone-700 text-white border-stone-700' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
            }`}
          >
            כל מבני הגוף
          </button>
          {BODY_SHAPES.map((b) => (
            <button
              key={b.id}
              onClick={() => setShapeFilter(shapeFilter === b.id ? null : b.id)}
              className={`px-4 py-1.5 text-xs font-medium tracking-wide transition-all border ${
                shapeFilter === b.id
                  ? 'bg-stone-700 text-white border-stone-700'
                  : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {displayed.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-sm tracking-widest uppercase">לא נמצאו תוצאות</p>
            <p className="text-stone-300 text-xs mt-2">נסה סינון אחר</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((outfit) => {
              const cat = STYLE_CATEGORIES.find((c) => c.id === outfit.category);
              const imgUrl = getOutfitImageUrl(outfit.id, outfit.category);
              const hasError = imgErrors[outfit.id];
              return (
                <article
                  key={outfit.id}
                  className="bg-white overflow-hidden group cursor-default shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-stone-100 overflow-hidden">
                    {!hasError ? (
                      <img
                        src={imgUrl}
                        alt={outfit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={() => setImgErrors((prev) => ({ ...prev, [outfit.id]: true }))}
                      />
                    ) : (
                      /* Fallback — color palette when image fails */
                      <div className="w-full h-full flex">
                        {outfit.colors.map((c) => (
                          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    )}
                    {/* Category badge */}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-3 py-1 tracking-wider uppercase">
                      {cat?.label}
                    </span>
                  </div>

                  <div className="p-5">
                    {/* Color swatches */}
                    <div className="flex gap-1.5 mb-3">
                      {outfit.colors.map((c) => (
                        <div
                          key={c}
                          className="w-5 h-5 rounded-full ring-1 ring-stone-200"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    <h3 className="font-semibold text-neutral-900 text-base mb-1.5 tracking-wide">{outfit.title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">{outfit.description}</p>

                    {/* Body shapes */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {outfit.bodyShapes.map((shapeId) => {
                        const s = BODY_SHAPES.find((b) => b.id === shapeId);
                        return s ? (
                          <span key={shapeId} className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 border border-stone-200 font-medium">
                            {s.label}
                          </span>
                        ) : null;
                      })}
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {outfit.tags.map((tag) => (
                        <span key={tag} className="text-xs text-stone-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-3 px-10 py-4 bg-neutral-900 text-white text-sm font-medium tracking-[0.15em] uppercase hover:bg-neutral-700 transition-colors"
          >
            קבל המלצות מותאמות אישית
          </Link>
        </div>
      </div>
    </div>
  );
}

