'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadPhoto from '@/components/upload-photo';
import { analyzeImage } from '@/lib/analyzeImage';

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await analyzeImage(file);
      // Assuming result.id identifies the saved analysis
      router.push(`/results/${result.id}`);
    } catch (err) {
      console.error(err);
      alert('אירעה שגיאה בניתוח התמונה. נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-orange-50">
      <h1 className="text-3xl font-bold mb-4">העלאת תמונה</h1>
      <UploadPhoto onUpload={(f) => setFile(f)} />
      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="mt-4 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg shadow disabled:opacity-50 transition"
      >
        {loading ? 'מנתח...' : 'נתח תמונה'}
      </button>
    </div>
  );
}
