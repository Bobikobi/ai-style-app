import Link from 'next/link';
import ColorPalette from '@/components/color-palette';

export default function Page() {
  // Example palette for landing demonstration
  const samplePalette = ['#F4D3B2', '#D9A57B', '#B66D3C', '#8C4F2A', '#5D2E15'];
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-orange-50">
      <h1 className="text-4xl font-bold mb-4">ברוכים הבאים ל‑AI סטיילינג אישי</h1>
      <p className="text-center max-w-2xl mb-8">
        העלו תמונת פורטרט וקבלו לוח צבעים מותאם אישית והמלצות לביגוד ואיפור.
      </p>
      <ColorPalette colors={samplePalette} />
      <div className="flex flex-col space-y-4 mt-8">
        <Link
          href="/analyze"
          className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg shadow transition text-center"
        >
          העלו תמונה לניתוח
        </Link>
        <Link
          href="/body-shape"
          className="px-4 py-2 bg-orange-300 hover:bg-orange-400 text-white rounded-lg shadow transition text-center"
        >
          מדריך מבנה גוף
        </Link>
        <Link
          href="/outfits"
          className="px-4 py-2 bg-orange-200 hover:bg-orange-300 text-white rounded-lg shadow transition text-center"
        >
          השראה לאאוטפיטים
        </Link>
      </div>
    </main>
  );
}
