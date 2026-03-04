'use client';
import { useState } from 'react';

interface Recommendation {
  title: string;
  items: string[];
}

const SHAPES = [
  { id: 'pear', label: 'אגס' },
  { id: 'apple', label: 'תפוח' },
  { id: 'rectangle', label: 'מלבן' },
  { id: 'hourglass', label: 'שעון חול' },
];

const RECOMMENDATIONS: Record<string, Recommendation> = {
  pear: {
    title: 'המלצות לגוף בצורת אגס',
    items: [
      'חולצות עם מחשוף פתוח כדי לאזן את המותניים',
      'ג׳קטים קצרים המדגישים את החלק העליון',
      'מכנסיים מחויטים בגזרה ישרה או מתרחבת',
    ],
  },
  apple: {
    title: 'המלצות לגוף בצורת תפוח',
    items: [
      'שמלות עם קו מותן גבוה המדגישות את הרגליים',
      'חצאיות באורך ברך או מעט מעל כדי למשוך את העין למטה',
      'בדים זורמים שאינם צמודים מדי',
    ],
  },
  rectangle: {
    title: 'המלצות לגוף בצורת מלבן',
    items: [
      'חגורות ליצירת קו מותן מודגש',
      'שמלות עם קפלים או שכבות להוספת נפח',
      'ג׳קטים עם כתפיים מודגשות ומותן צרה',
    ],
  },
  hourglass: {
    title: 'המלצות לגוף בצורת שעון חול',
    items: [
      'בגדים המדגישים את קו המותן כמו שמלות עיפרון',
      'חולצות וג׳קטים מותאמים ומחויטים',
      'בד רך וגמיש שנצמד לגוף בצורה מחמיאה',
    ],
  },
};

export default function BodyShapePage() {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShape(e.target.value);
  };

  return (
    <div className="min-h-screen p-8 bg-orange-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">מדריך מבנה גוף</h1>
      {!selectedShape && (
        <div className="max-w-md w-full">
          <label className="block mb-2 font-medium">בחרי את מבנה הגוף שלך:</label>
          <select
            className="w-full p-2 border rounded"
            defaultValue=""
            onChange={handleSelect}
          >
            <option value="" disabled>
              בחרי...
            </option>
            {SHAPES.map((shape) => (
              <option key={shape.id} value={shape.id}>
                {shape.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedShape && (
        <div className="max-w-md mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            {RECOMMENDATIONS[selectedShape].title}
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {RECOMMENDATIONS[selectedShape].items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button
            onClick={() => setSelectedShape(null)}
            className="mt-4 px-3 py-1 bg-orange-400 hover:bg-orange-500 text-white rounded"
          >
            בחרי מחדש
          </button>
        </div>
      )}
    </div>
  );
}
