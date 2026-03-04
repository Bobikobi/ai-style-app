'use client';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  {
    label: 'ניתוח סגנון',
    href: '/quiz',
    sub: [
      { label: 'ניתוח בתמונה',      href: '/analyze' },
      { label: 'בחירה ידנית',       href: '/quiz' },
    ],
  },
  {
    label: 'מדריכים',
    href: '#',
    sub: [
      { label: 'עונות צבע',          href: '/color-seasons' },
      { label: 'מבנה גוף',           href: '/body-shape' },
      { label: 'מדריך גוון עור',     href: '/skin-guide' },
    ],
  },
  { label: 'השראה',  href: '/outfits',  sub: [] },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-rose-600">
          <span className="text-2xl">✦</span>
          <span>StyleAI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.sub.length && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className="px-4 py-2 rounded-full text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-all text-sm font-medium flex items-center gap-1"
              >
                {item.label}
                {item.sub.length > 0 && <span className="text-xs opacity-60">▾</span>}
              </Link>

              {item.sub.length > 0 && activeDropdown === item.label && (
                <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-rose-50 py-2 z-50">
                  {item.sub.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/quiz"
            className="mr-2 px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            התחילי עכשיו ✦
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-rose-50"
          onClick={() => setOpen(!open)}
        >
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-rose-50 px-4 py-4 space-y-1">
          {NAV_LINKS.flatMap((item) =>
            item.sub.length
              ? [
                  <span key={item.label} className="block px-3 pt-2 pb-1 text-xs font-bold text-gray-400 uppercase">
                    {item.label}
                  </span>,
                  ...item.sub.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                    >
                      {s.label}
                    </Link>
                  )),
                ]
              : [
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                  >
                    {item.label}
                  </Link>,
                ]
          )}
          <Link
            href="/quiz"
            onClick={() => setOpen(false)}
            className="block mt-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-center font-semibold"
          >
            התחילי עכשיו ✦
          </Link>
        </div>
      )}
    </header>
  );
}
