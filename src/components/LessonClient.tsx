'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { setLessonDoneAction } from '@/actions/learning';

export function Toc({ items }: { items: { id: string; text: string }[] }) {
    const [active, setActive] = useState(items[0]?.id);
    useEffect(() => {
        const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-100px 0px -70% 0px' });
        items.forEach(i => { const el = document.getElementById(i.id); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, [items]);
    return (
        <nav className="toc" aria-label="Dars mundarijasi">
            {items.map((h, i) => <a key={h.id} href={`#${h.id}`} className={active === h.id ? 'active' : ''}><span className="n">{i + 1}</span>{h.text}</a>)}
        </nav>
    );
}

export function DoneBox({ lessonId, initial, testHref, testScore }: { lessonId: number; initial: boolean; testHref: string; testScore: number | null }) {
    const [done, setDone] = useState(initial);
    const [pending, start] = useTransition();
    const toggle = () => start(async () => { const r = await setLessonDoneAction(lessonId, !done); setDone(r.done); });
    return (
        <div className="score-banner mt-4" style={done ? { background: 'var(--success-soft)' } : undefined}>
            <i className={`fas ${done ? 'fa-circle-check' : 'fa-flag-checkered'}`} style={{ fontSize: 28, color: done ? 'var(--success)' : 'var(--primary)' }} />
            <div style={{ flex: 1, minWidth: 200 }}>
                <b>{done ? 'Dars o‘qildi!' : 'Darsni tugatdingizmi?'}</b>
                <div className="muted small">{done ? (testScore === null ? 'Endi mavzu testini topshiring — 6 ta savol, 8 daqiqa.' : `Mavzu testidagi eng yaxshi natijangiz: ${testScore}%.`) : 'Matnni oxirigacha o‘qib chiqqach, “O‘qildi” tugmasini bosing.'}</div>
            </div>
            <div className="btn-row">
                {done && <Link href={testHref} className="btn btn-primary"><i className="fas fa-list-check" />{testScore === null ? 'Testni boshlash' : 'Testni qayta topshirish'}</Link>}
                <button className={done ? 'btn btn-outline' : 'btn btn-success'} onClick={toggle} disabled={pending}>
                    {pending ? <i className="fas fa-spinner fa-spin" /> : <i className={`fas ${done ? 'fa-rotate-left' : 'fa-check'}`} />}{done ? 'Belgini olib tashlash' : 'O‘qildi deb belgilash'}
                </button>
            </div>
        </div>
    );
}
