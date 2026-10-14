import type { Metadata, Viewport } from 'next';
import { Barlow, Caveat, Roboto } from 'next/font/google';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './globals.css';
import './app.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE } from '@/lib/content';

const barlow = Barlow({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700'], variable: '--f-barlow', display: 'swap' });
const roboto = Roboto({ subsets: ['latin', 'latin-ext', 'cyrillic'], weight: ['400', '500', '700'], variable: '--f-roboto', display: 'swap' });
const caveat = Caveat({ subsets: ['latin', 'latin-ext'], weight: ['500'], variable: '--f-caveat', display: 'swap' });

export const metadata: Metadata = {
    title: { default: 'Raqamli baholash kompetensiyasi', template: '%s — Raqamli baholash kompetensiyasi' },
    description: 'Raqamli ta’limda bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirish: darslar, testlar, mashqlar va baholash simulyatorlari.',
    authors: [{ name: SITE.author }]
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0055c6' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uz" className={`${barlow.variable} ${roboto.variable} ${caveat.variable}`}>
            <body>
                <Header />
                <main id="main">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
