'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-3">שגיאה</p>
          <h1 className="text-2xl font-light text-neutral-800 mb-2">משהו השתבש</h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            אירעה שגיאה בלתי צפויה. ניתן לנסות שוב או לחזור לדף הבית.
          </p>
        </div>

        {error?.message && (
          <div className="border border-stone-200 bg-stone-50 p-4 text-left">
            <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">פרטי שגיאה</p>
            <p className="text-xs text-stone-600 font-mono break-all">{error.message}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-medium tracking-[0.2em] uppercase hover:bg-neutral-700 transition-colors"
          >
            נסה שוב
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 border border-stone-300 text-stone-600 text-xs font-medium tracking-[0.2em] uppercase hover:border-neutral-700 hover:text-neutral-800 transition-colors"
          >
            דף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
