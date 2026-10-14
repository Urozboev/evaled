'use client';

import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import { saveDiagnosticAction } from '@/actions/learning';
import { DIAGNOSTIC, diagLevel } from '@/lib/content';
import { Bar, Ring, fmtDate } from './ui';

type D = { result: Record<string, number>; values: number[]; at: string } | null;
type Comp = keyof typeof DIAGNOSTIC.components;
const COMPS = Object.keys(DIAGNOSTIC.components) as Comp[];
const ADVICE: Record<Comp, string> = { mot: '/lessons', cog: '/lessons', met: '/exercises', ref: '/simulators' };

export function DiagnosticClient({ initialStage, pre: pre0, post: post0 }: { initialStage: 'pre' | 'post'; pre: D; post: D }) {
    const [stage, setStage] = useState<'pre' | 'post'>(initialStage);
    const [pre, setPre] = useState(pre0);
    const [post, setPost] = useState(post0);
    const cur = stage === 'pre' ? pre : post;
    const [vals, setVals] = useState<number[]>(() => cur?.values.slice() || DIAGNOSTIC.items.map(() => 0));
    const [msg, setMsg] = useState('');
    const [pending, start] = useTransition();
    const itemsRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const switchStage = (s: 'pre' | 'post') => {
        setStage(s);
        const d = s === 'pre' ? pre : post;
        setVals(d?.values.slice() || DIAGNOSTIC.items.map(() => 0));
        setMsg('');
    };
    const submit = () => {
        const miss = vals.findIndex(v => !v);
        if (miss >= 0) {
            setMsg(`${miss + 1}-mulohazaga javob bering.`);
            itemsRef.current?.querySelectorAll('.diag-item')[miss]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        start(async () => {
            const res = await saveDiagnosticAction(stage, vals);
            const d = { result: res, values: vals.slice(), at: new Date().toISOString() };
            if (stage === 'pre') setPre(d); else setPost(d);
            setMsg('');
            if (window.innerWidth < 1024) resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
    };
    const last = post || pre;
    const lv = last ? diagLevel(last.result.total) : null;
    const weak = last ? COMPS.slice().sort((a, b) => last.result[a] - last.result[b])[0] : null;
    const n = vals.filter(Boolean).length;

    return (
        <div className="with-aside">
            <div>
                <div className="card mb-3">
                    <h3 className="upper" style={{ fontSize: 16 }}>Diagnostika bosqichi</h3>
                    <div className="filters mb-0">
                        <button className={`chip ${stage === 'pre' ? 'on' : ''}`} onClick={() => switchStage('pre')}><i className="fas fa-magnifying-glass-chart" /> Dastlabki (kurs boshida){pre && ' ✓'}</button>
                        <button className={`chip ${stage === 'post' ? 'on' : ''}`} onClick={() => switchStage('post')}><i className="fas fa-flag-checkered" /> Yakuniy (kurs oxirida){post && ' ✓'}</button>
                    </div>
                </div>
                <div className="card" ref={itemsRef}>
                    <p className="muted">Har bir mulohazani o‘qing va o‘zingizga qanchalik mos kelishini <b>1 dan 5 gacha</b> belgilang. To‘g‘ri yoki noto‘g‘ri javob yo‘q — samimiy javob bering.</p>
                    {DIAGNOSTIC.items.map((it, i) => (
                        <div key={i} className="diag-item">
                            <span className="tag">{DIAGNOSTIC.components[it.c].name}</span>
                            <div className="mt-1"><b>{i + 1}.</b> {it.t}</div>
                            <div className="likert" role="radiogroup" aria-label={`${i + 1}-mulohaza`}>
                                {DIAGNOSTIC.scale.map((s, v) => (
                                    <button key={v} className={vals[i] === v + 1 ? 'on' : ''} role="radio" aria-checked={vals[i] === v + 1} title={s}
                                        onClick={() => setVals(a => { const x = a.slice(); x[i] = v + 1; return x; })}><b>{v + 1}</b>{s}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {msg && <div className="alert error mt-2"><i className="fas fa-circle-exclamation" /><div>{msg}</div></div>}
                    <div className="flex between items-center wrap gap-2 mt-3">
                        <span className="muted small">Belgilangan: {n} / {DIAGNOSTIC.items.length}</span>
                        <button className="btn btn-primary" onClick={submit} disabled={pending}>{pending ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-chart-simple" />}Natijani saqlash</button>
                    </div>
                </div>
            </div>
            <aside className="aside-sticky" ref={resultRef}>
                <div className="card">
                    <h4 className="upper" style={{ fontSize: 15 }}>Natijalar</h4>
                    {!last ? <p className="muted small mb-0">So‘rovnomani to‘ldirganingizdan so‘ng bu yerda komponentlar bo‘yicha natijangiz ko‘rinadi.</p> : (
                        <>
                            <div className="flex items-center gap-2">
                                <Ring pct={last.result.total} size={96} />
                                <div><span className={`tag ${lv!.tone}`}>{lv!.name} daraja</span><p className="small muted mt-1 mb-0">{post ? 'Yakuniy' : 'Dastlabki'} · {fmtDate(last.at)}<br />Kompetensiya {lv!.kind} darajada.</p></div>
                            </div>
                            {COMPS.map(c => (
                                <div key={c} className="mt-2">
                                    <div className="progress-label"><span><i className={`fas ${DIAGNOSTIC.components[c].icon}`} /> {DIAGNOSTIC.components[c].name}</span><b>{pre ? `${pre.result[c]}%` : '—'}{post ? ` → ${post.result[c]}%` : ''}</b></div>
                                    {pre && <div className="progress" style={{ height: 6 }}><span style={{ width: `${pre.result[c]}%`, background: '#9bbcf0' }} /></div>}
                                    {post && <div className="mt-1"><Bar pct={post.result[c]} tone="green" height={6} /></div>}
                                </div>
                            ))}
                            <div className="legend"><span><i style={{ background: '#9bbcf0' }} />Dastlabki</span><span><i style={{ background: '#24c06a' }} />Yakuniy</span></div>
                            {pre && post && <div className="callout green" style={{ margin: '12px 0 0' }}><b>O‘sish</b>Umumiy ko‘rsatkich {pre.result.total}% → {post.result.total}% ({post.result.total - pre.result.total >= 0 ? '+' : ''}{post.result.total - pre.result.total}%).</div>}
                            {weak && <div className="callout" style={{ margin: '12px 0 0' }}><b>Tavsiya</b>Eng past komponent — “{DIAGNOSTIC.components[weak].name}”. <Link href={ADVICE[weak]}>Shu yo‘nalishda mashq qiling →</Link></div>}
                        </>
                    )}
                </div>
                <div className="card" style={{ background: 'var(--soft)' }}>
                    <h4 className="upper" style={{ fontSize: 15 }}>Darajalar</h4>
                    <div className="small">
                        <p className="mb-0"><span className="tag green">Yuqori</span> 76–100% — ijodiy</p>
                        <p className="mt-1 mb-0"><span className="tag amber">O‘rta</span> 51–75% — samarali (produktiv)</p>
                        <p className="mt-1 mb-0"><span className="tag red">Quyi</span> 0–50% — reproduktiv</p>
                    </div>
                </div>
                {pre && <Link href="/dashboard" className="btn btn-primary">Mening sahifamga qaytish<i className="fas fa-arrow-right" /></Link>}
            </aside>
        </div>
    );
}
