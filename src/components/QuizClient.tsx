'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { submitTestAction, type TestReview } from '@/actions/learning';
import { PASS_SCORE } from '@/lib/content';
import { Ring } from './ui';

export type ClientQuestion = { id: number; text: string; options: { i: number; t: string }[] };

const KEYS = 'ABCDEFGH';
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function QuizClient({ testKey, title, kind, minutes, questions, prev, lessonId, nextHref }: {
    testKey: string; title: string; kind: string; minutes: number; questions: ClientQuestion[];
    prev: { best: number; tries: number } | null; lessonId: number | null; nextHref: string;
}) {
    const [phase, setPhase] = useState<'start' | 'run' | 'done'>('start');
    const [cur, setCur] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
    const [left, setLeft] = useState(minutes * 60);
    const [review, setReview] = useState<TestReview | null>(null);
    const [error, setError] = useState('');
    const [pending, start] = useTransition();
    const submitted = useRef(false);

    const finish = useCallback(() => {
        if (submitted.current) return;
        submitted.current = true;
        start(async () => {
            try {
                const r = await submitTestAction(testKey, questions.map(q => q.id), answers);
                setReview(r); setPhase('done'); window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch {
                submitted.current = false;
                setError('Natijani yuborib bo‘lmadi. Internet aloqasini tekshirib, qayta urinib ko‘ring.');
            }
        });
    }, [answers, questions, testKey]);

    useEffect(() => {
        if (phase !== 'run') return;
        const h = setInterval(() => setLeft(l => l - 1), 1000);
        return () => clearInterval(h);
    }, [phase]);
    useEffect(() => { if (phase === 'run' && left <= 0) finish(); }, [left, phase, finish]);

    useEffect(() => {
        if (phase !== 'run') return;
        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
            const k = e.key.toUpperCase();
            const idx = KEYS.indexOf(k) >= 0 && k.length === 1 ? KEYS.indexOf(k) : /^[1-8]$/.test(k) ? Number(k) - 1 : -1;
            if (idx >= 0 && idx < questions[cur].options.length) choose(questions[cur].options[idx].i);
            if (e.key === 'ArrowRight') setCur(c => Math.min(questions.length - 1, c + 1));
            if (e.key === 'ArrowLeft') setCur(c => Math.max(0, c - 1));
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    const choose = (orig: number) => {
        setAnswers(a => { const n = a.slice(); n[cur] = orig; return n; });
        if (cur < questions.length - 1) setTimeout(() => setCur(c => Math.min(questions.length - 1, c + 1)), 250);
    };
    const answered = answers.filter(a => a !== null).length;

    if (phase === 'start') return (
        <div className="card" style={{ maxWidth: 760, margin: '0 auto' }}>
            <div className="card-top"><span className="card-icon"><i className="fas fa-list-check" /></span><span className="tag">{kind}</span></div>
            <h2 style={{ fontSize: 26 }}>{title}</h2>
            <div className="grid grid-3 mt-2 mb-3">
                {[[questions.length, 'savol'], [minutes, 'daqiqa'], [`${PASS_SCORE}%`, 'o‘tish chegarasi']].map(([v, l]) => (
                    <div key={l as string} className="center"><b style={{ fontSize: 28, fontFamily: 'var(--font-head)', color: 'var(--primary)' }}>{v}</b><div className="muted small">{l}</div></div>
                ))}
            </div>
            <div className="callout"><b>Qanday ishlaydi?</b>Har bir savolda bitta to‘g‘ri javob bor. Javobni bosing — keyingi savol avtomatik ochiladi. O‘ng tomondagi raqamlar orqali istalgan savolga qaytishingiz mumkin. Vaqt tugasa, test avtomatik yakunlanadi.</div>
            {prev && <p className="muted small"><i className="fas fa-clock-rotate-left" /> Eng yaxshi natijangiz: <b>{prev.best}%</b> · urinishlar: {prev.tries}</p>}
            <div className="btn-row"><button className="btn btn-primary" onClick={() => setPhase('run')}><i className="fas fa-play" />Testni boshlash</button><Link href="/tests" className="btn btn-outline">Barcha testlar</Link></div>
        </div>
    );

    if (phase === 'done' && review) {
        const pass = review.score >= PASS_SCORE;
        return (
            <>
                <div className="card result-box" style={{ maxWidth: 760, margin: '0 auto', alignItems: 'center' }}>
                    <Ring pct={review.score} />
                    <h2 className="mt-2">{review.score >= 90 ? 'A’lo natija!' : pass ? 'Test muvaffaqiyatli topshirildi' : 'Yana bir bor urinib ko‘ring'}</h2>
                    <p className="muted">{review.total} ta savoldan {review.correct} tasiga to‘g‘ri javob berdingiz. {pass ? 'Natija saqlandi.' : `O‘tish uchun kamida ${PASS_SCORE}% kerak.`} Quyida har bir savol bo‘yicha izohlar berilgan.</p>
                    <div className="btn-row" style={{ justifyContent: 'center' }}>
                        <button className="btn btn-outline" onClick={() => location.reload()}><i className="fas fa-rotate" />Qayta topshirish</button>
                        {!pass && lessonId && <Link className="btn btn-outline" href={`/lessons/${lessonId}`}><i className="fas fa-book-open" />Darsni takrorlash</Link>}
                        <Link className="btn btn-primary" href={pass ? nextHref : '/dashboard'}>{pass ? 'Davom etish' : 'Mening sahifam'}<i className="fas fa-arrow-right" /></Link>
                    </div>
                </div>
                <h3 className="upper mt-4" style={{ fontSize: 20 }}>Javoblar tahlili</h3>
                {review.items.map((q, i) => {
                    const ok = q.answer === q.correct;
                    return (
                        <div key={q.id} className="card mt-2" style={{ borderLeft: `4px solid ${ok ? 'var(--success)' : 'var(--danger)'}` }}>
                            <div className="flex between gap-2"><b>{i + 1}. {q.text}</b><span className={`tag ${ok ? 'green' : 'red'}`}>{ok ? 'To‘g‘ri' : q.answer === null ? 'Javobsiz' : 'Xato'}</span></div>
                            <div className="mt-2">
                                {q.options.map((o, j) => (
                                    <div key={j} className={`opt ${j === q.correct ? 'correct' : j === q.answer ? 'wrong' : ''}`} style={{ marginBottom: 6, padding: '8px 12px' }}>
                                        <span className="key" style={{ width: 26, height: 26 }}>{KEYS[j]}</span><span>{o}</span>
                                        {j === q.answer && <span className="small muted" style={{ marginLeft: 'auto' }}>sizning javobingiz</span>}
                                    </div>
                                ))}
                            </div>
                            {q.explanation && <div className="callout" style={{ margin: '8px 0 0' }}><b>Izoh</b>{q.explanation}</div>}
                        </div>
                    );
                })}
            </>
        );
    }

    const q = questions[cur];
    return (
        <div className="with-aside">
            <div className="card">
                <div className="quiz-head">
                    <span className="num-badge">Savol {cur + 1} / {questions.length}</span>
                    <span className={`timer ${left <= 60 ? 'low' : ''}`} aria-live="off"><i className="far fa-clock" /> {fmt(Math.max(0, left))}</span>
                </div>
                <div className="progress mb-3"><span style={{ width: `${(cur + 1) / questions.length * 100}%` }} /></div>
                <div className="q-text">{q.text}</div>
                <div role="radiogroup" aria-label="Javob variantlari">
                    {q.options.map((o, k) => (
                        <button key={o.i} className={`opt ${answers[cur] === o.i ? 'sel' : ''}`} role="radio" aria-checked={answers[cur] === o.i} onClick={() => choose(o.i)}>
                            <span className="key">{KEYS[k]}</span><span>{o.t}</span>
                        </button>
                    ))}
                </div>
                {error && <div className="alert error mt-2"><i className="fas fa-circle-exclamation" /><div>{error}</div></div>}
                <div className="flex between wrap gap-2 mt-3">
                    <button className="btn btn-outline" disabled={cur === 0} onClick={() => setCur(c => c - 1)}><i className="fas fa-arrow-left" />Oldingi</button>
                    {cur < questions.length - 1
                        ? <button className="btn btn-primary" onClick={() => setCur(c => c + 1)}>Keyingi<i className="fas fa-arrow-right" /></button>
                        : <button className="btn btn-success" disabled={pending} onClick={() => { if (answered < questions.length && !confirm(`${questions.length - answered} ta savolga javob berilmagan. Yakunlaysizmi?`)) return; finish(); }}>{pending ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-flag-checkered" />}Yakunlash</button>}
                </div>
                <p className="small muted mt-2 mb-0"><i className="far fa-keyboard" /> Klaviatura: A–D yoki 1–4 javob, ← → savollar orasida.</p>
            </div>
            <aside className="aside-sticky">
                <div className="card">
                    <h4 className="upper" style={{ fontSize: 15 }}>Savollar</h4>
                    <div className="qnav">
                        {questions.map((_, i) => <button key={i} className={i === cur ? 'current' : answers[i] !== null ? 'answered' : ''} onClick={() => setCur(i)} aria-label={`${i + 1}-savol`}>{i + 1}</button>)}
                    </div>
                    <p className="small muted mt-2 mb-0">Javob berilgan: {answered} / {questions.length}</p>
                    <button className="btn btn-success mt-2" style={{ width: '100%' }} disabled={pending}
                        onClick={() => { if (answered < questions.length && !confirm(`${questions.length - answered} ta savolga javob berilmagan. Yakunlaysizmi?`)) return; finish(); }}>
                        {pending ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-flag-checkered" />}Testni yakunlash
                    </button>
                </div>
            </aside>
        </div>
    );
}
