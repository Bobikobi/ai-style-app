import Link from 'next/link';

const FEATURES = [
  {
    icon: '🎨',
    title: 'ניתוח פלטת צבעים',
    desc: 'גלי את העונה הצבעונית שלך — 12 עונות מבוססות על גוון העור, עיניים ושיער',
    href: '/color-seasons',
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    icon: '👗',
    title: 'מדריך מבנה גוף',
    desc: 'המלצות ביגוד מותאמות אישית ל-5 סוגי גוף שונים עם דגשים על מה להדגיש',
    href: '/body-shape',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    icon: '📸',
    title: 'ניתוח AI מתמונה',
    desc: 'העלי תמונה ותקבלי ניתוח צבעוני מיידי באמצעות בינה מלאכותית',
    href: '/analyze',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    icon: '✨',
    title: 'מטריצת המלצות',
    desc: 'שלבי גוון עור + מבנה גוף + עונת צבע לקבלת המלצות מדויקות ואישיות',
    href: '/quiz',
    gradient: 'from-teal-400 to-cyan-500',
  },
  {
    icon: '👔',
    title: 'השראת אאוטפיטים',
    desc: 'גלריה עשירה של אאוטפיטים ממוינים לפי קטגוריה, עונה ומבנה גוף',
    href: '/outfits',
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    icon: '🌸',
    title: 'פרופיל סגנון אישי',
    desc: 'ענו על שאלון קצר וקבלו פרופיל סגנון מלא עם כל ההמלצות שלכם במקום אחד',
    href: '/quiz',
    gradient: 'from-pink-400 to-rose-500',
  },
];

const SEASONS_PREVIEW = [
  { label: 'אביב', icon: '🌸', colors: ['#FFB6C1', '#FFA07A', '#90EE90', '#FFD700'], bg: 'bg-pink-50 border-pink-200' },
  { label: 'קיץ', icon: '☀️', colors: ['#B0C4DE', '#DDA0DD', '#E6E6FA', '#C0C0C0'], bg: 'bg-sky-50 border-sky-200' },
  { label: 'סתיו', icon: '🍂', colors: ['#CD853F', '#8B4513', '#DAA520', '#556B2F'], bg: 'bg-amber-50 border-amber-200' },
  { label: 'חורף', icon: '❄️', colors: ['#000080', '#DC143C', '#8B008B', '#2F4F4F'], bg: 'bg-slate-50 border-slate-200' },
];

const STEPS = [
  { step: '01', title: 'בחרי שיטת ניתוח', desc: 'תמונה או בחירה ידנית' },
  { step: '02', title: 'גוון עור ומבנה גוף', desc: 'בחרי מתוך האפשרויות הויזואליות' },
  { step: '03', title: 'קבלי פרופיל מלא', desc: 'המלצות, צבעים ואאוטפיטים מותאמים' },
];

export default function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 pt-16 pb-24">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-200 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-rose-200 rounded-full px-4 py-1.5 text-sm text-rose-600 font-medium mb-6 shadow-sm">
            <span>✦</span> פלטפורמת הסטיילינג החכמה של ישראל
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            גלי את{' '}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
              הסגנון
            </span>
            <br />
            שמחמיא לך
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            ניתוח צבעוני מבוסס AI, המלצות לפי מבנה גוף וגוון עור — הכל במקום אחד,
            מותאם לך בלבד
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-105 transition-all"
            >
              ✦ התחילי עכשיו — חינם
            </Link>
            <Link
              href="/color-seasons"
              className="px-8 py-4 bg-white text-rose-600 rounded-2xl text-lg font-semibold border-2 border-rose-200 hover:bg-rose-50 hover:scale-105 transition-all shadow-sm"
            >
              גלי את עונת הצבע שלך
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[['12', 'עונות צבע'], ['5', 'סוגי גוף'], ['9', 'קטגוריות סגנון']].map(([n, l]) => (
              <div key={l} className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-white shadow-sm">
                <p className="text-3xl font-bold text-rose-500">{n}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">הכלים שלנו</h2>
          <p className="text-gray-500 max-w-xl mx-auto">כל מה שצריכה כדי להבין את הסגנון שמחמיא לך באמת</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-rose-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              <span className="mt-4 inline-flex items-center text-rose-500 text-sm font-semibold group-hover:gap-2 transition-all gap-1">
                למידע נוסף ←
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Seasons Preview ── */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">4 עונות × 3 תת-עונות = 12 פרופילים</h2>
            <p className="text-gray-500">כל אחת היא קומבינציה ייחודית של עומק, גוון ורוויות</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SEASONS_PREVIEW.map((s) => (
              <Link
                key={s.label}
                href="/color-seasons"
                className={`${s.bg} border-2 rounded-2xl p-5 hover:scale-105 transition-all shadow-sm hover:shadow-md`}
              >
                <p className="text-3xl mb-2">{s.icon}</p>
                <p className="font-bold text-gray-800 mb-3">{s.label}</p>
                <div className="flex gap-1.5">
                  {s.colors.map((c) => (
                    <div key={c} className="w-7 h-7 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/color-seasons"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-600 border-2 border-rose-200 rounded-xl font-semibold hover:bg-rose-50 transition-all shadow-sm"
            >
              גלי את כל 12 העונות ←
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">איך זה עובד?</h2>
          <p className="text-gray-500">שלוש שלבים פשוטים לפרופיל הסגנון שלך</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg shadow-rose-200">
                {s.step}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/quiz"
            className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-105 transition-all inline-block"
          >
            ✦ התחילי עכשיו
          </Link>
        </div>
      </section>
    </div>
  );
}


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
