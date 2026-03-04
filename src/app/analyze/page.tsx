'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeImage } from '@/lib/analyzeImage';

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag]       = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await analyzeImage(file);
      router.push(`/results/${result.id}`);
    } catch (err) {
      console.error(err);
      alert('אירעה שגיאה בניתוח התמונה. נסי שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-5xl">📸</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">ניתוח סגנון מתמונה</h1>
          <p className="text-gray-500 leading-relaxed">
            העלי תמונת פנים ברורה — ה-AI ינתח את גוון העור, שיער ועיניים ויחשב את עונת הצבע שלך
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-rose-100 p-8">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onClick={() => document.getElementById('fileInput')?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              drag ? 'border-rose-400 bg-rose-50 scale-105' : preview ? 'border-rose-300 bg-rose-50' : 'border-gray-300 hover:border-rose-400 hover:bg-rose-50'
            }`}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {preview ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="תצוגה מקדימה" className="max-h-64 rounded-xl mx-auto object-cover shadow-md" />
                <p className="text-rose-500 font-medium mt-3 text-sm">לחצי להחלפת תמונה</p>
              </div>
            ) : (
              <div>
                <span className="text-6xl">🖼️</span>
                <p className="text-gray-700 font-semibold mt-3">גרור תמונה לכאן</p>
                <p className="text-gray-400 text-sm mt-1">או לחצי לבחירת קובץ</p>
                <p className="text-xs text-gray-300 mt-2">JPG, PNG, WEBP עד 10MB</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-6 bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-amber-700 font-semibold text-sm mb-2">💡 טיפים לתמונה טובה</p>
            <ul className="space-y-1">
              {[
                'תמונת פנים ברורה ובאיכות טובה',
                'תאורה טבעית — ללא פילטרים',
                'ללא איפור כבד',
              ].map((tip) => (
                <li key={tip} className="text-xs text-amber-600 flex items-center gap-1.5">
                  <span>✓</span>{tip}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                מנתח...
              </span>
            ) : (
              '✦ נתחי תמונה עכשיו'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
