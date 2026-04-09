import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Nav from '@/components/nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StyleAI — הסגנון האישי שלך',
  description: 'ניתוח סגנון מבוסס AI — פלטת צבעים, מבנה גוף והמלצות אישיות',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.className} bg-gray-50`}>
        <Nav />
        <main>{children}</main>
        <footer className="mt-20 border-t border-rose-100 bg-white py-10 text-center text-sm text-gray-400">
          <p className="font-semibold text-rose-400 text-base mb-1">✦ StyleAI</p>
          <p>הסגנון האישי שלך מבוסס בינה מלאכותית</p>
          <p className="mt-2 text-xs">© {new Date().getFullYear()} StyleAI. כל הזכויות שמורות.</p>          <p className="mt-3 text-xs text-gray-400">
            <a
              href="https://elad-s-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              פותח ע&quot;י{' '}
              <span style={{ fontFamily: 'Glamora, serif' }}>E.S</span>
            </a>
          </p>        </footer>
      </body>
    </html>
  );
}
