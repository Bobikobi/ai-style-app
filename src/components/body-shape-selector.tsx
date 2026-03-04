'use client';
import { BODY_SHAPES } from '@/data/styleData';
import type { BodyShapeId } from '@/lib/bodyShapeAlgorithm';
import BodyAvatar3D from '@/components/body-avatar-3d';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

const SHAPES: { id: BodyShapeId; label: string; sub: string }[] = [
  { id: 'hourglass',           label: 'שעון חול',    sub: 'Bust = Hips' },
  { id: 'pear',                label: 'אגס',          sub: 'Hips > Bust' },
  { id: 'apple',               label: 'תפוח',         sub: 'Fuller Middle' },
  { id: 'rectangle',           label: 'מלבן',         sub: 'Uniform' },
  { id: 'inverted-triangle',   label: 'משולש הפוך',  sub: 'Shoulders > Hips' },
];

export default function BodyShapeSelector({ selected, onSelect }: Props) {
  const activeId = (selected ?? 'hourglass') as BodyShapeId;
  const shape = BODY_SHAPES.find((b) => b.id === activeId)!;

  return (
    <div className="w-full space-y-4">
      {/* 3D Avatar */}
      <div className="bg-neutral-900 w-full" style={{ height: 280 }}>
        <BodyAvatar3D shapeId={activeId} className="w-full h-full" />
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

      {/* Info */}
      {shape && (
        <div className="border border-stone-200 p-4 bg-stone-50">
          <p className="text-xs text-stone-500 leading-relaxed">{shape.description}</p>
        </div>
      )}
    </div>
  );
}