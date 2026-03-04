'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BODY_SHAPES } from '@/data/styleData';

export default function BodyShapePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const shape = BODY_SHAPES.find((b) => b.id === selected);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-violet-50 via-purple-50 to-rose-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">מדריך מבנה גוף</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          כל מבנה גוף הוא יפה. הטריק הוא ללמוד מה מחמיא לך ואיך ללבוש נכון
        </p>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {BODY_SHAPES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelected(selected === b.id ? null : b.id)}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all hover:scale-105 ${
                selected === b.id
                  ? 'border-violet-500 bg-violet-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-violet-300'
              }`}
            >
              <span className="text-4xl">{b.emoji}</span>
              <span className="font-bold text-gray-800 text-sm">{b.label}</span>
            </button>
          ))}
        </div>
        {shape ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-8 text-white">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{shape.emoji}</span>
                <div>
                  <h2 className="text-3xl font-bold mb-1">גוף {shape.label}</h2>
                  <p className="opacity-90 text-lg">{shape.description}</p>
                </div>
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <h3 className="font-bold text-green-800 text-lg mb-4">✓ מה מומלץ</h3>
                <ul className="space-y-3">
                  {shape.ideal.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-green-900">
                      <span className="text-green-400">●</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <h3 className="font-bold text-red-800 text-lg mb-4">✗ כדאי להימנע</h3>
                <ul className="space-y-3">
                  {shape.avoid.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-red-900">
                      <span className="text-red-300">●</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-violet-50 rounded-2xl p-5 border border-violet-100 md:col-span-2">
                <h3 className="font-bold text-violet-800 text-lg mb-3">גוונים משלימים</h3>
                <div className="flex gap-3">
                  {shape.colors.map((c) => (
                    <div key={c} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl shadow-sm ring-2 ring-white" style={{ backgroundColor: c }} />
                      <p className="text-xs text-gray-400">{c}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-8 pb-8">
              <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all">
                ✦ קבלי המלצות מלאות
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BODY_SHAPES.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all cursor-pointer" onClick={() => setSelected(b.id)}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{b.emoji}</span>
                  <h3 className="font-bold text-gray-800 text-lg">{b.label}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">{b.description}</p>
                <div className="flex gap-1.5 mb-3">
                  {b.colors.map((c) => (
                    <div key={c} className="w-6 h-6 rounded-full ring-1 ring-gray-200" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-xs text-violet-600 font-medium">לחצי לפרטים ←</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
