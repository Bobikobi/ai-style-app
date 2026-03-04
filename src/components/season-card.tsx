'use client';
import { useState } from 'react';
import { COLOR_SEASONS } from '@/data/styleData';
import { getSeasonMoodUrl } from '@/lib/imageService';

const SEASON_STYLE: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  spring: { bg: 'bg-stone-50',  text: 'text-amber-800',  border: 'border-amber-100', accent: 'bg-amber-50 text-amber-700' },
  summer: { bg: 'bg-slate-50',  text: 'text-slate-700',  border: 'border-slate-200', accent: 'bg-slate-100 text-slate-600' },
  autumn: { bg: 'bg-stone-50',  text: 'text-stone-700',  border: 'border-stone-200', accent: 'bg-stone-100 text-stone-600' },
  winter: { bg: 'bg-neutral-50',text: 'text-neutral-700',border: 'border-neutral-200',accent: 'bg-neutral-100 text-neutral-600' },
};

const SEASON_LABEL_EN: Record<string, string> = {
  spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter',
};

interface Props {
  seasonId: string;
  compact?: boolean;
}

export default function SeasonCard({ seasonId, compact = false }: Props) {
  const season = COLOR_SEASONS.find((s) => s.id === seasonId);
  const [imgError, setImgError] = useState(false);
  if (!season) return null;
  const style = SEASON_STYLE[season.season];
  const seed = COLOR_SEASONS.findIndex((s) => s.id === seasonId) * 199 + 1;
  const moodUrl = getSeasonMoodUrl(season.season, seed);

  return (
    <div className={`${style.bg} border ${style.border} overflow-hidden hover:shadow-md transition-shadow duration-300`}>
      {/* Mood image */}
      {!compact && (
        <div className="relative h-44 bg-stone-100 overflow-hidden">
          {!imgError ? (
            <img
              src={moodUrl}
              alt={`${season.label} mood board`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex">
              {season.palette.slice(0, 6).map((c) => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 right-4 text-white">
            <p className="text-[10px] tracking-[0.2em] uppercase opacity-70">{season.labelEn}</p>
            <h3 className="text-lg font-light tracking-wide">{season.label}</h3>
          </div>
        </div>
      )}

      <div className="p-4">
        {compact && (
          <div className="mb-3">
            <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-0.5">{season.labelEn}</p>
            <h3 className="text-sm font-semibold text-neutral-800">{season.label}</h3>
          </div>
        )}

        {!compact && (
          <p className="text-xs text-stone-500 leading-relaxed mb-4">{season.description}</p>
        )}

        {/* Palette swatches */}
        <div className="flex gap-1 flex-wrap mb-4">
          {season.palette.slice(0, compact ? 5 : 8).map((color) => (
            <div
              key={color}
              className="w-6 h-6 ring-1 ring-white shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {!compact && (
          <>
            <div className="mb-3">
              <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5">צבעים מומלצים</p>
              <div className="flex flex-wrap gap-1">
                {season.bestColors.map((c) => (
                  <span key={c} className={`text-xs px-2.5 py-0.5 border ${style.border} ${style.accent}`}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1">מתכות</p>
              <p className={`text-xs font-medium ${style.text}`}>{season.metals.join(' · ')}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1">איפור</p>
              <p className="text-xs text-stone-500 leading-relaxed">{season.makeup.join(' · ')}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
