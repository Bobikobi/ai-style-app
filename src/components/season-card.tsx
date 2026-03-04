import { COLOR_SEASONS } from '@/data/styleData';

const SEASON_META: Record<string,(typeof COLOR_SEASONS)[0] & {bg: string; text: string; border: string}> = {} as any;

const BG_MAP: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  spring: { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-200',  gradient: 'from-pink-400 to-rose-400' },
  summer: { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',   gradient: 'from-sky-400 to-blue-400' },
  autumn: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200', gradient: 'from-amber-400 to-orange-400' },
  winter: { bg: 'bg-slate-50',  text: 'text-slate-700',  border: 'border-slate-200', gradient: 'from-slate-500 to-blue-600' },
};

const SEASON_ICONS: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

interface Props {
  seasonId: string;
  compact?: boolean;
}

export default function SeasonCard({ seasonId, compact = false }: Props) {
  const season = COLOR_SEASONS.find((s) => s.id === seasonId);
  if (!season) return null;
  const meta = BG_MAP[season.season];

  return (
    <div className={`rounded-2xl border-2 ${meta.bg} ${meta.border} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${meta.gradient} p-4 text-white`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{SEASON_ICONS[season.season]}</span>
          <div>
            <p className="text-xs opacity-80 font-medium">{season.labelEn}</p>
            <h3 className="text-lg font-bold">{season.label}</h3>
          </div>
        </div>
        {!compact && <p className="mt-2 text-sm opacity-90 leading-relaxed">{season.description}</p>}
      </div>

      <div className="p-4">
        {/* Color swatches */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {season.palette.slice(0, compact ? 5 : 8).map((color) => (
            <div
              key={color}
              className="w-7 h-7 rounded-full shadow-sm ring-2 ring-white"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {!compact && (
          <>
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">צבעים מומלצים</p>
              <div className="flex flex-wrap gap-1">
                {season.bestColors.map((c) => (
                  <span key={c} className={`text-xs px-2 py-0.5 rounded-full ${meta.bg} ${meta.text} border ${meta.border} font-medium`}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">מתכות</p>
              <p className={`text-sm font-medium ${meta.text}`}>{season.metals.join(' · ')}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">איפור</p>
              <p className="text-xs text-gray-600 leading-relaxed">{season.makeup.join(' · ')}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
