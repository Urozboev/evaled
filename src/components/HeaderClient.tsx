'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { logoutAction } from '@/actions/auth';
import { ROLES } from '@/lib/content';

type HUser = { name: string; email: string; role: 'student' | 'teacher' | 'admin' } | null;

const NAV_IN = [
    { href: '/dashboard', label: 'Mening sahifam' },
    { href: '/lessons', label: 'Darslar' },
    { href: '/tests', label: 'Testlar' },
    { href: '/exercises', label: 'Mashqlar' },
    { href: '/simulators', label: 'Simulyatorlar' },
    { href: '/resources', label: 'Resurslar' },
    { href: '/help', label: 'Yordam' }
];
const NAV_OUT = [
    { href: '/', label: 'Bosh sahifa' },
    { href: '/about', label: 'Tadqiqot' },
    { href: '/resources', label: 'Resurslar' },
    { href: '/tools', label: 'Vositalar' },
    { href: '/help', label: 'Yordam' }
];

const A11Y_KEY = 'rbk_a11y';
type A11y = { fs?: string; mode?: string };

function applyA11y(st: A11y) {
    document.documentElement.style.setProperty('--fs', st.fs || '16px');
    document.body.classList.toggle('a11y-gray', st.mode === 'gray');
    document.body.classList.toggle('a11y-contrast', st.mode === 'contrast');
}

export function HeaderClient({ user }: { user: HUser }) {
    const path = usePathname() || '/';
    const [menu, setMenu] = useState(false);
    const [a11yOpen, setA11yOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [a11y, setA11y] = useState<A11y>({});
    const [top, setTop] = useState(false);
    const a11yRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let st: A11y = {};
        try { st = JSON.parse(localStorage.getItem(A11Y_KEY) || '{}'); } catch { /* xotira yopiq */ }
        setA11y(st); applyA11y(st);
        const onScroll = () => setTop(window.scrollY > 600);
        const onClick = (e: MouseEvent) => {
            if (a11yRef.current && !a11yRef.current.contains(e.target as Node)) setA11yOpen(false);
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('click', onClick);
        return () => { window.removeEventListener('scroll', onScroll); document.removeEventListener('click', onClick); };
    }, []);
    useEffect(() => { setMenu(false); setUserOpen(false); }, [path]);

    const setA = (k: keyof A11y, v: string) => {
        const st = { ...a11y, [k]: v };
        setA11y(st); applyA11y(st);
        try { localStorage.setItem(A11Y_KEY, JSON.stringify(st)); } catch { /* */ }
    };

    const nav = user ? NAV_IN : NAV_OUT;
    const isActive = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));
    const first = user?.name.split(/\s+/)[0] || '';

    return (
        <>
            <div className="topbar" />
            <header className="site-header">
                <div className="header-inner">
                    <Link href={user ? '/dashboard' : '/'} className="brand" aria-label="Bosh sahifa">
                        <span className="brand-mark"><i className="fas fa-user-graduate" /></span>
                        <span className="brand-text">Raqamli baholash kompetensiyasi</span>
                    </Link>
                    <div className="nav-band">
                        <nav className="main-nav" aria-label="Asosiy menyu">
                            {nav.map(n => <Link key={n.href} href={n.href} className={isActive(n.href) ? 'active' : ''} aria-current={isActive(n.href) ? 'page' : undefined}>{n.label}</Link>)}
                        </nav>
                        <div className="header-actions">
                            <div ref={a11yRef} style={{ position: 'relative' }}>
                                <button className="icon-btn" title="Maxsus imkoniyatlar" aria-label="Maxsus imkoniyatlar" aria-expanded={a11yOpen} onClick={() => setA11yOpen(o => !o)}><i className="far fa-eye" /></button>
                                {a11yOpen && (
                                    <div className="a11y-panel" role="dialog" aria-label="Maxsus imkoniyatlar" style={{ right: 0 }}>
                                        <h4><i className="far fa-eye" /> Maxsus imkoniyatlar</h4>
                                        <div className="a11y-row"><span>Shrift o‘lchami</span>
                                            <div className="seg">{[['15px', 'A−'], ['16px', 'A'], ['18px', 'A+'], ['20px', 'A++']].map(([v, l]) => <button key={v} className={(a11y.fs || '16px') === v ? 'on' : ''} onClick={() => setA('fs', v)}>{l}</button>)}</div>
                                        </div>
                                        <div className="a11y-row mb-0"><span>Ko‘rinish</span>
                                            <div className="seg">{[['normal', 'Oddiy'], ['gray', 'Oq-qora'], ['contrast', 'Kontrast']].map(([v, l]) => <button key={v} className={(a11y.mode || 'normal') === v ? 'on' : ''} onClick={() => setA('mode', v)}>{l}</button>)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {user ? (
                                <div className="user-menu" ref={userRef}>
                                    <button className="user-btn" aria-expanded={userOpen} aria-label="Foydalanuvchi menyusi" onClick={() => setUserOpen(o => !o)}>
                                        <span className="ava">{first[0]?.toUpperCase() || '?'}</span><span className="nm">{first}</span><i className="fas fa-chevron-down" style={{ fontSize: 11 }} />
                                    </button>
                                    {userOpen && (
                                        <div className="dropdown">
                                            <div className="who"><b>{user.name}</b><span>{user.email} · {ROLES[user.role]}</span></div>
                                            <Link href="/dashboard"><i className="fas fa-house-user" />Mening sahifam</Link>
                                            <Link href="/profile"><i className="fas fa-user-gear" />Profil va guruh</Link>
                                            <Link href="/certificate"><i className="fas fa-award" />Sertifikat</Link>
                                            {(user.role === 'teacher' || user.role === 'admin') && <Link href="/teacher"><i className="fas fa-chalkboard-user" />O‘qituvchi paneli</Link>}
                                            {user.role === 'admin' && <Link href="/admin"><i className="fas fa-screwdriver-wrench" />Boshqaruv paneli</Link>}
                                            <form action={logoutAction}><button type="submit"><i className="fas fa-right-from-bracket" />Chiqish</button></form>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className="nav-ghost">Kirish</Link>
                                    <Link href="/register" className="nav-cta" aria-label="Ro‘yxatdan o‘tish"><i className="fas fa-user-plus" /><span className="cta-txt">Ro‘yxatdan o‘tish</span></Link>
                                </>
                            )}
                            <button className="icon-btn menu-toggle" aria-label={menu ? 'Menyuni yopish' : 'Menyuni ochish'} aria-expanded={menu} onClick={() => setMenu(m => !m)}><i className={`fas ${menu ? 'fa-xmark' : 'fa-bars'}`} /></button>
                        </div>
                    </div>
                </div>
                <nav className={`mobile-nav ${menu ? 'open' : ''}`} aria-label="Mobil menyu">
                    {nav.map(n => <Link key={n.href} href={n.href} className={isActive(n.href) ? 'active' : ''}>{n.label}</Link>)}
                    {user ? <Link href="/profile">Profil</Link> : <Link href="/login">Kirish</Link>}
                </nav>
            </header>
            <button className={`to-top ${top ? 'show' : ''}`} aria-label="Yuqoriga" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><i className="fas fa-arrow-up" /></button>
        </>
    );
}
