'use client';
import { SKIN_TONES } from '@/data/styleData';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function SkinTonePicker({ selected, onSelect }: Props) {
  return (
    <div className="w-full">
      <p className="text-sm text-gray-500 mb-4 text-center">בחרי את הגוון הקרוב ביותר לגוון העור שלך</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SKIN_TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onSelect(tone.id)}
            className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
              selected === tone.id
                ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-200'
                : 'border-gray-200 bg-white hover:border-rose-300'
            }`}
          >
            {/* Swatch */}
            <div
              className="w-14 h-14 rounded-full shadow-md ring-4 ring-white transition-transform group-hover:scale-110"
              style={{ backgroundColor: tone.hex }}
            />
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-sm">{tone.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tone.description}</p>
            </div>
            {selected === tone.id && (
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
