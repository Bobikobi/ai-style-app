'use client';
import { BODY_SHAPES } from '@/data/styleData';
import type { BodyShapeId } from '@/lib/bodyShapeAlgorithm';
import BodyAvatarFigure, { SHAPE_PRESETS } from '@/components/body-avatar-3d';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

const SHAPES: { id: BodyShapeId; label: string }[] = [
  { id: 'hourglass',           label: 'שעון חול'   },
  { id: 'pear',                label: 'אגס'         },
  { id: 'apple',               label: 'תפוח'        },
  { id: 'rectangle',           label: 'מלבן'        },
  { id: 'inverted-triangle',   label: 'משולש הפוך' },
];

export default function BodyShapeSelector({ selected, onSelect }: Props) {
  const activeId = (selected ?? 'hourglass') as BodyShapeId;
  const shape    = BODY_SHAPES.find((b) => b.id === activeId)!;
  const preset   = SHAPE_PRESETS[activeId];

  return (
    <div className="w-full space-y-4">
      {/* Avatar */}
      <div className="bg-neutral-900 w-full flex items-center justify-center" style={{ height: 300 }}>
        <BodyAvatarFigure
          bust={preset.bust}
          waist={preset.waist}
          hips={preset.hips}
          showAnnotations={false}
          style={{ maxWidth: 160, height: '100%' }}
        />
      </div>

      {/* Shape buttons */}
      <div className="grid grid-cols-5 gap-1">
        {SHAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`py-2.5 px-1 text-center text-xs font-medium tracking-wide transition-all border ${
              activeId === s.id
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Description */}
      {shape && (
        <div className="border border-stone-200 p-4 bg-stone-50">
          <p className="text-xs text-stone-500 leading-relaxed">{shape.description}</p>
        </div>
      )}
    </div>
  );
}