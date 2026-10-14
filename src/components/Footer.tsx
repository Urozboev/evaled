import Link from 'next/link';
import { SITE } from '@/lib/content';

export function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-main">
                <div>
                    <h4>Loyiha haqida</h4>
                    <p>“{SITE.title.charAt(0) + SITE.title.slice(1).toLowerCase()}” mavzusidagi dissertatsiya tadqiqoti asosida yaratilgan o‘quv-metodik platforma.</p>
                    <p className="small mb-0">Muallif: {SITE.author}<br />Ilmiy rahbar: {SITE.supervisor}</p>
                </div>
                <div>
                    <h4>O‘quv bo‘limlari</h4>
                    <ul>
                        <li><Link href="/lessons">Nazariy darslar</Link></li>
                        <li><Link href="/tests">Testlar va diagnostika</Link></li>
                        <li><Link href="/exercises">Amaliy mashqlar</Link></li>
                        <li><Link href="/simulators">Baholash simulyatorlari</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>Resurslar</h4>
                    <ul>
                        <li><Link href="/tools">Raqamli vositalar</Link></li>
                        <li><Link href="/resources">Glossariy va hujjatlar</Link></li>
                        <li><Link href="/about">Tadqiqot natijalari</Link></li>
                        <li><Link href="/help">Yordam va FAQ</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>Aloqa</h4>
                    <ul>
                        <li><i className="fas fa-building-columns" />&nbsp; {SITE.org}</li>
                        <li><i className="fas fa-users" />&nbsp; {SITE.dept}</li>
                        <li><Link href="/help#contact"><i className="fas fa-envelope" />&nbsp; Savol yuborish</Link></li>
                    </ul>
                </div>
            </div>
            <div className="container footer-bottom">
                <span>© {SITE.year}–{Math.max(SITE.year, new Date().getFullYear())}. {SITE.author}. Barcha huquqlar himoyalangan.</span>
                <span>{SITE.specialty}</span>
            </div>
        </footer>
    );
}
