'use client';
import { BODY_SHAPES } from '@/data/styleData';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function BodyShapeSelector({ selected, onSelect }: Props) {
  return (
    <div className="w-full">
      <p className="text-sm text-gray-500 mb-4 text-center">בחרי את מבנה הגוף שהכי מתאר אותך</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BODY_SHAPES.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onSelect(shape.id)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
              selected === shape.id
                ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-200'
                : 'border-gray-200 bg-white hover:border-rose-300'
            }`}
          >
            <span className="text-4xl">{shape.emoji}</span>
            <p className="font-semibold text-gray-800 text-sm">{shape.label}</p>
            <p className="text-xs text-gray-500 text-center leading-relaxed">{shape.description}</p>
            {selected === shape.id && (
              <span className="absolute top-2 left-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
