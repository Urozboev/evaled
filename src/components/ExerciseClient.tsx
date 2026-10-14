'use client';

import Link from 'next/link';
import { useMemo, useRef, useState, useTransition } from 'react';
import { submitExerciseAction } from '@/actions/learning';
import type { ChoiceData, ClassifyData, ExerciseData, FeedbackData, MatchData, OrderData } from '@/db/schema';
import { feedbackAuto, gradeExercise, seededShuffle, type ExercisePayload } from '@/lib/grading';

type T = 'classify' | 'match' | 'order' | 'choice' | 'feedback';
type Result = { score: number; note: string };

export function ExerciseClient({ id, type, data, nextHref, nextLabel, seed }: { id: number; type: T; data: ExerciseData; nextHref: string; nextLabel: string; seed: number }) {
    const [round, setRound] = useState(0);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState('');
    const [pending, start] = useTransition();
    const resRef = useRef<HTMLDivElement>(null);

    const save = (payload: ExercisePayload, note: string) => {
        const local = gradeExercise(data, payload);
        setResult({ score: local.score, note });
        setError('');
        start(async () => {
            try { await submitExerciseAction(id, payload); }
            catch { setError('Natija serverga saqlanmadi. Internet aloqasini tekshiring va qayta urinib ko‘ring.'); }
        });
        setTimeout(() => resRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    };
    const reset = () => { setResult(null); setError(''); setRound(r => r + 1); };
    const props = { done: !!result, onSubmit: save, seed: seed + round * 7919 };

    return (
        <>
            {type === 'classify' && <Classify key={round} {...props} d={data as ClassifyData} />}
            {type === 'match' && <Match key={round} {...props} d={data as MatchData} />}
            {type === 'order' && <Order key={round} {...props} d={data as OrderData} />}
            {type === 'choice' && <Choice key={round} {...props} d={data as ChoiceData} />}
            {type === 'feedback' && <Feedback key={round} {...props} d={data as FeedbackData} />}
            <div ref={resRef}>
                {result && (
                    <div className="score-banner" style={{ background: result.score >= 85 ? 'var(--success-soft)' : result.score >= 60 ? 'var(--warning-soft)' : 'var(--danger-soft)', flexWrap: 'wrap' }}>
                        <span className="big" style={{ color: result.score >= 85 ? 'var(--success)' : result.score >= 60 ? '#a26d00' : 'var(--danger)' }}>{result.score}%</span>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <b>{result.score >= 85 ? 'Ajoyib natija!' : result.score >= 60 ? 'Yaxshi, yana mashq qilish foydali' : 'Mavzuni takrorlab, qayta urinib ko‘ring'}</b>
                            <div className="small muted">{result.note} {pending ? 'Saqlanmoqda…' : !error ? 'Natija saqlandi.' : ''}</div>
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-outline btn-sm" onClick={reset}><i className="fas fa-rotate" />Qaytadan</button>
                            <Link className="btn btn-primary btn-sm" href={nextHref}>{nextLabel}<i className="fas fa-arrow-right" /></Link>
                        </div>
                    </div>
                )}
                {error && <div className="alert error mt-2"><i className="fas fa-circle-exclamation" /><div>{error}</div></div>}
            </div>
        </>
    );
}

type P<D> = { d: D; done: boolean; seed: number; onSubmit: (p: ExercisePayload, note: string) => void };

function CheckBtn({ onClick, done, label = 'Tekshirish' }: { onClick: () => void; done: boolean; label?: string }) {
    if (done) return null;
    return <div className="flex wrap gap-2 mt-3"><button className="btn btn-primary" onClick={onClick}><i className="fas fa-check-double" />{label}</button></div>;
}
function Warn({ msg }: { msg: string }) {
    return msg ? <div className="alert error mt-2"><i className="fas fa-circle-exclamation" /><div>{msg}</div></div> : null;
}

function Classify({ d, done, onSubmit, seed }: P<ClassifyData>) {
    const items = useMemo(() => seededShuffle(d.items.map((it, i) => ({ ...it, i })), seed), [d, seed]);
    const [ans, setAns] = useState<Record<number, number>>({});
    const [msg, setMsg] = useState('');
    const check = () => {
        const n = Object.keys(ans).length;
        if (n < d.items.length) return setMsg(`Barcha bandlarni belgilang (${n}/${d.items.length}).`);
        setMsg('');
        const ok = d.items.filter((it, i) => ans[i] === it.c).length;
        onSubmit({ type: 'classify', answers: ans }, `${d.items.length} ta banddan ${ok} tasi to‘g‘ri tasniflandi.`);
    };
    return (
        <>
            {items.map(it => {
                const a = ans[it.i];
                return (
                    <div key={it.i} className={`ex-item ${done ? (a === it.c ? 'ok' : 'bad') : ''}`}>
                        <div>{it.t}</div>
                        <div className="cat-btns" role="radiogroup">
                            {d.categories.map((c, ci) => <button key={ci} className={a === ci ? 'on' : ''} disabled={done} role="radio" aria-checked={a === ci} onClick={() => setAns(s => ({ ...s, [it.i]: ci }))}>{c}</button>)}
                        </div>
                        {done && a !== it.c && <div className="feedback-msg" style={{ color: 'var(--danger)' }}><i className="fas fa-circle-info" /> To‘g‘ri javob: <b>{d.categories[it.c]}</b></div>}
                    </div>
                );
            })}
            <Warn msg={msg} /><CheckBtn onClick={check} done={done} />
        </>
    );
}

function Match({ d, done, onSubmit, seed }: P<MatchData>) {
    const left = useMemo(() => seededShuffle(d.pairs.map((p, i) => ({ ...p, i })), seed), [d, seed]);
    const right = useMemo(() => seededShuffle(d.pairs.map((p, i) => ({ r: p.r, i })), seed + 1), [d, seed]);
    const [ans, setAns] = useState<Record<number, number>>({});
    const [msg, setMsg] = useState('');
    const check = () => {
        if (Object.keys(ans).length < d.pairs.length) return setMsg('Barcha tushunchalar uchun ta’rif tanlang.');
        setMsg('');
        const ok = d.pairs.filter((_, i) => ans[i] === i).length;
        onSubmit({ type: 'match', answers: ans }, `${d.pairs.length} ta juftdan ${ok} tasi to‘g‘ri.`);
    };
    return (
        <>
            {left.map(p => {
                const a = ans[p.i];
                return (
                    <div key={p.i} className={`ex-item ${done ? (a === p.i ? 'ok' : 'bad') : ''}`}>
                        <div className="ex-row">
                            <b style={{ color: 'var(--navy)' }}>{p.l}</b>
                            <select className="select" disabled={done} aria-label={`${p.l} uchun ta’rif`} value={a ?? ''} onChange={e => setAns(s => { const n = { ...s }; if (e.target.value === '') delete n[p.i]; else n[p.i] = Number(e.target.value); return n; })}>
                                <option value="">— Ta’rifni tanlang —</option>
                                {right.map(r => <option key={r.i} value={r.i}>{r.r}</option>)}
                            </select>
                        </div>
                        {done && a !== p.i && <div className="feedback-msg" style={{ color: 'var(--danger)' }}><i className="fas fa-circle-info" /> To‘g‘ri: {p.r}</div>}
                    </div>
                );
            })}
            <Warn msg={msg} /><CheckBtn onClick={check} done={done} />
        </>
    );
}

function Order({ d, done, onSubmit, seed }: P<OrderData>) {
    const [order, setOrder] = useState<number[]>(() => {
        let o: number[], k = 0;
        do { o = seededShuffle(d.items.map((_, i) => i), seed + k++); } while (d.items.length > 1 && o.every((v, i) => v === i) && k < 20);
        return o;
    });
    const move = (p: number, dir: number) => setOrder(o => { const n = o.slice(); [n[p], n[p + dir]] = [n[p + dir], n[p]]; return n; });
    const check = () => {
        const ok = order.filter((v, i) => v === i).length;
        onSubmit({ type: 'order', order }, `${d.items.length} ta bosqichdan ${ok} tasi to‘g‘ri o‘rinda.`);
    };
    return (
        <>
            {order.map((v, pos) => (
                <div key={v} className={`ex-item ${done ? (v === pos ? 'ok' : 'bad') : ''}`}>
                    <div className="order-item">
                        <span className="pos">{pos + 1}</span><span className="txt">{d.items[v]}</span>
                        {done ? (v === pos ? <i className="fas fa-check" style={{ color: 'var(--success)' }} /> : <span className="small" style={{ color: 'var(--danger)' }}>to‘g‘ri o‘rni: {v + 1}</span>) : (
                            <span className="mv">
                                <button aria-label="Yuqoriga" disabled={pos === 0} onClick={() => move(pos, -1)}><i className="fas fa-chevron-up" /></button>
                                <button aria-label="Pastga" disabled={pos === order.length - 1} onClick={() => move(pos, 1)}><i className="fas fa-chevron-down" /></button>
                            </span>
                        )}
                    </div>
                </div>
            ))}
            <CheckBtn onClick={check} done={done} />
        </>
    );
}

function Choice({ d, done, onSubmit, seed }: P<ChoiceData>) {
    const cases = useMemo(() => d.cases.map((c, ci) => ({ ...c, ord: seededShuffle(c.o.map((_, i) => i), seed + ci) })), [d, seed]);
    const [ans, setAns] = useState<Record<number, number>>({});
    const pick = (ci: number, orig: number) => {
        if (ans[ci] !== undefined) return;
        const n = { ...ans, [ci]: orig };
        setAns(n);
        if (Object.keys(n).length === d.cases.length) {
            const ok = d.cases.filter((c, i) => n[i] === c.a).length;
            onSubmit({ type: 'choice', answers: n }, `${d.cases.length} ta vaziyatdan ${ok} tasida eng maqbul yechim tanlandi.`);
        }
    };
    return (
        <>
            <p className="small muted"><i className="fas fa-circle-info" /> Javobni tanlashingiz bilan izoh chiqadi. Barcha vaziyatlar tugagach, natija avtomatik saqlanadi.</p>
            {cases.map((c, ci) => {
                const a = ans[ci];
                return (
                    <div key={ci} className="card mb-2">
                        <span className="num-badge">{ci + 1}-vaziyat</span>
                        <div className="case-text mt-1">{c.t}</div>
                        {c.ord.map((oi, k) => (
                            <button key={oi} className={`opt ${a === undefined ? '' : oi === c.a ? 'correct' : oi === a ? 'wrong' : ''}`} disabled={a !== undefined || done} onClick={() => pick(ci, oi)}>
                                <span className="key">{'ABCD'[k]}</span><span>{c.o[oi]}</span>
                            </button>
                        ))}
                        {a !== undefined && <div className={`callout ${a === c.a ? 'green' : 'amber'}`} style={{ margin: '6px 0 0' }}><b>{a === c.a ? 'To‘g‘ri!' : 'Unchalik emas'}</b>{c.e}</div>}
                    </div>
                );
            })}
        </>
    );
}

function Feedback({ d, done, onSubmit }: P<FeedbackData>) {
    const [text, setText] = useState('');
    const [checks, setChecks] = useState<boolean[]>(() => d.checklist.map(() => false));
    const [msg, setMsg] = useState('');
    const check = () => {
        if (text.trim().length < 40) return setMsg('Teskari aloqani to‘liqroq yozing (kamida 40 belgi).');
        setMsg('');
        const a = feedbackAuto(d, text);
        const self = Math.round(checks.filter(Boolean).length / (d.checklist.length || 1) * 50);
        const notes = [!a.praise && 'yutuqni aniq ko‘rsatuvchi so‘zlar topilmadi', !a.next && 'keyingi qadam (tilak) aniq ifodalanmagan', !a.long && 'izoh qisqa'].filter(Boolean);
        onSubmit({ type: 'feedback', text, checks }, `Avtomatik tahlil (taxminiy): ${a.auto}/50, o‘z-o‘zini tekshirish: ${self}/50.${notes.length ? ` E’tibor bering: ${notes.join('; ')}.` : ''} Namunaviy javob bilan solishtiring.`);
    };
    return (
        <>
            <div className="card mb-2"><h4 className="upper" style={{ fontSize: 15 }}><i className="fas fa-file-pen" style={{ color: 'var(--primary)' }} /> O‘quvchi ishi</h4><div className="work">{d.work}</div></div>
            <div className="card mb-2"><h4 className="upper" style={{ fontSize: 15 }}><i className="fas fa-table-cells" style={{ color: 'var(--primary)' }} /> Rubrika bo‘yicha kuzatuvlar</h4><ul className="mb-0" style={{ paddingLeft: 20 }}>{d.rubric.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
            <div className="card mb-2">
                <label htmlFor="fb"><h4 className="upper" style={{ fontSize: 15 }}><i className="fas fa-comment-dots" style={{ color: 'var(--primary)' }} /> Sizning teskari aloqangiz</h4></label>
                <textarea id="fb" className="textarea" style={{ minHeight: 160 }} readOnly={done} value={text} onChange={e => setText(e.target.value)} placeholder={'⭐ Birinchi yutuq…\n⭐ Ikkinchi yutuq…\n💡 Tilak (keyingi qadam)…'} />
                <div className="small muted mt-1">{text.trim().length} belgi · tavsiya: kamida 120 belgi</div>
            </div>
            <div className="card">
                <h4 className="upper" style={{ fontSize: 15 }}><i className="fas fa-list-check" style={{ color: 'var(--primary)' }} /> O‘z-o‘zini tekshirish</h4>
                <div className="check-list">
                    {d.checklist.map((c, i) => <label key={i}><input type="checkbox" disabled={done} checked={checks[i]} onChange={e => setChecks(s => { const n = s.slice(); n[i] = e.target.checked; return n; })} /><span>{c}</span></label>)}
                </div>
            </div>
            {done && <div className="card mt-2" style={{ borderColor: 'var(--success)' }}><h4 className="upper" style={{ fontSize: 15, color: 'var(--success)' }}><i className="fas fa-star" /> Namunaviy javob</h4><div style={{ whiteSpace: 'pre-line' }}>{d.model}</div></div>}
            <Warn msg={msg} /><CheckBtn onClick={check} done={done} />
        </>
    );
}
