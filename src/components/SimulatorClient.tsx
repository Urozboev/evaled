'use client';

import Link from 'next/link';
import { useRef, useState, useTransition } from 'react';
import { submitSimulatorAction } from '@/actions/learning';
import type { SimCriterion, SimStudent } from '@/db/schema';
import { simAgreement } from '@/lib/grading';
import { Ring } from './ui';

type G = { scores: number[]; fb: string; saved: boolean };
const LV = ['Quyi', 'O‘rta', 'Yuqori'];

export function SimulatorClient({ id, task, grade, criteria, students, best, nextHref, nextLabel }: {
    id: number; task: string; grade: string; criteria: SimCriterion[]; students: SimStudent[]; best: number | null; nextHref: string; nextLabel: string;
}) {
    const fresh = () => students.map(() => ({ scores: criteria.map(() => 0), fb: '', saved: false }));
    const [grades, setGrades] = useState<G[]>(fresh);
    const [cur, setCur] = useState(0);
    const [msg, setMsg] = useState('');
    const [final, setFinal] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [pending, start] = useTransition();
    const tabsRef = useRef<HTMLDivElement>(null);

    const st = students[cur], g = grades[cur];
    const agree = (i: number) => simAgreement(grades[i].scores, students[i].expert);
    const done = grades.filter(x => x.saved);
    const avg = done.length ? Math.round(done.reduce((a, _, k) => a + agree(grades.indexOf(done[k])), 0) / done.length) : null;
    const upd = (fn: (x: G) => G) => setGrades(gs => gs.map((x, i) => (i === cur ? fn(x) : x)));

    const save = () => {
        if (g.scores.some(v => !v)) return setMsg('Barcha mezonlar bo‘yicha daraja tanlang.');
        if (g.fb.trim().length < 20) return setMsg('O‘quvchiga qisqa teskari aloqa yozing (kamida 20 belgi).');
        setMsg('');
        const next = grades.map((x, i) => (i === cur ? { ...x, saved: true } : x));
        setGrades(next);
        if (next.every(x => x.saved)) {
            start(async () => {
                try {
                    const r = await submitSimulatorAction(id, next.map(x => x.scores), next.map(x => x.fb));
                    setFinal(r.score);
                } catch { setError('Natija serverga saqlanmadi. Qayta urinib ko‘ring.'); }
            });
        }
    };
    const reset = () => { setGrades(fresh()); setCur(0); setFinal(null); setError(''); setMsg(''); };

    return (
        <div className="with-aside">
            <div style={{ minWidth: 0 }}>
                <div className="callout" style={{ marginTop: 0 }}><b>Topshiriq</b><span style={{ whiteSpace: 'pre-line' }}>{task}</span></div>
                <div className="student-tabs" role="tablist" ref={tabsRef}>
                    {students.map((s, i) => (
                        <button key={i} className={`student-tab ${i === cur ? 'on' : ''}`} role="tab" aria-selected={i === cur} onClick={() => { setCur(i); setMsg(''); }}>
                            <span className="ava" style={{ background: s.color }}>{s.name[0]}</span>
                            <span style={{ textAlign: 'left' }}>{s.name}<br /><span className="st" style={{ color: grades[i].saved ? 'var(--success)' : 'var(--muted)' }}>{grades[i].saved ? '✓ baholandi' : 'baholanmagan'}</span></span>
                        </button>
                    ))}
                </div>

                <div className="card mb-2">
                    <div className="flex between items-center wrap gap-2 mb-2"><h3 className="mb-0" style={{ fontSize: 19 }}>{st.name}ning ishi</h3><span className="tag">{grade}</span></div>
                    <div className="work">{st.work}</div>
                </div>

                <div className="card mb-2">
                    <div className="flex between items-center wrap gap-2 mb-2">
                        <h4 className="upper mb-0" style={{ fontSize: 15 }}>Rubrika bo‘yicha baholash</h4>
                        <b style={{ fontFamily: 'var(--font-head)', color: 'var(--primary)' }}>{g.scores.reduce((a, b) => a + b, 0)} / {criteria.length * 3} ball</b>
                    </div>
                    {criteria.map((c, ci) => (
                        <div key={ci} className="crit">
                            <div className="crit-head"><b>{c.n}</b>{g.saved && <span className="small" style={{ color: g.scores[ci] === st.expert[ci] ? 'var(--success)' : 'var(--danger)' }}>Siz: {g.scores[ci]} · Ekspert: {st.expert[ci]}</span>}</div>
                            <div className="lvl-btns" style={{ gridTemplateColumns: 'repeat(3,1fr)' }} role="radiogroup" aria-label={c.n}>
                                {c.d.map((d, li) => (
                                    <button key={li} disabled={g.saved} role="radio" aria-checked={g.scores[ci] === li + 1}
                                        className={`${g.scores[ci] === li + 1 ? 'on' : ''} ${g.saved && st.expert[ci] === li + 1 ? 'expert' : ''}`}
                                        onClick={() => upd(x => ({ ...x, scores: x.scores.map((v, k) => (k === ci ? li + 1 : v)) }))}>
                                        <b>{li + 1} — {LV[li]}</b>{d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card mb-2">
                    <label htmlFor="fb"><h4 className="upper" style={{ fontSize: 15 }}>Teskari aloqa (o‘quvchiga)</h4></label>
                    <textarea id="fb" className="textarea" placeholder="Yutuq: … Keyingi qadam: …" readOnly={g.saved} value={g.fb} onChange={e => upd(x => ({ ...x, fb: e.target.value }))} />
                    {msg && <div className="alert error mt-2"><i className="fas fa-circle-exclamation" /><div>{msg}</div></div>}
                    {g.saved && <>
                        <div className="callout green" style={{ margin: '12px 0 0' }}><b>Ekspert teskari aloqasi</b>{st.fb}</div>
                        <div className="score-banner"><span className="big">{agree(cur)}%</span><div><b>Ekspert bahosi bilan moslik</b><div className="small muted">{agree(cur) >= 85 ? 'Baholashingiz ekspertnikiga juda yaqin.' : agree(cur) >= 60 ? 'Ayrim mezonlarda farq bor — deskriptorlarni qayta o‘qing.' : 'Sezilarli farq bor. Deskriptorlarni ish bilan sinchiklab solishtiring.'}</div></div></div>
                    </>}
                    <div className="flex wrap gap-2 mt-2">
                        {!g.saved && <button className="btn btn-success" onClick={save}><i className="fas fa-floppy-disk" />Baholashni saqlash</button>}
                        {g.saved && cur < students.length - 1 && <button className="btn btn-primary" onClick={() => { setCur(cur + 1); tabsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}>Keyingi o‘quvchi<i className="fas fa-arrow-right" /></button>}
                    </div>
                </div>

                {done.length === students.length && (
                    <div className="card mt-3" style={{ border: '2px solid var(--primary)' }}>
                        <h3 className="upper" style={{ fontSize: 19 }}><i className="fas fa-flag-checkered" style={{ color: 'var(--primary)' }} /> Simulyator yakunlandi</h3>
                        <div className="table-wrap">
                            <table className="tbl">
                                <thead><tr><th>O‘quvchi</th>{criteria.map((c, i) => <th key={i}>{c.n}</th>)}<th>Moslik</th></tr></thead>
                                <tbody>{students.map((s, i) => (
                                    <tr key={i}><td><b>{s.name}</b></td>{criteria.map((_, ci) => <td key={ci} style={{ color: grades[i].scores[ci] === s.expert[ci] ? 'var(--success)' : 'var(--danger)' }}>{grades[i].scores[ci]} <span className="muted">/ {s.expert[ci]}</span></td>)}<td><b>{agree(i)}%</b></td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                        <p className="small muted">Jadvalda: sizning bahoingiz / ekspert bahosi. Natija: <b>{final ?? avg}%</b>. {pending ? 'Saqlanmoqda…' : final !== null ? 'Natija saqlandi.' : ''}</p>
                        {error && <div className="alert error"><i className="fas fa-circle-exclamation" /><div>{error}</div></div>}
                        <div className="btn-row"><Link href={nextHref} className="btn btn-primary">{nextLabel}<i className="fas fa-arrow-right" /></Link><Link href="/simulators" className="btn btn-outline">Barcha simulyatorlar</Link></div>
                    </div>
                )}
            </div>
            <aside className="aside-sticky">
                <div className="card">
                    <h4 className="upper" style={{ fontSize: 15 }}>Baholash holati</h4>
                    <div className="progress-label"><span>Baholangan</span><b>{done.length} / {students.length}</b></div>
                    <div className="progress"><span style={{ width: `${done.length / students.length * 100}%` }} /></div>
                    <div className="mt-2">
                        {avg === null ? <p className="small muted mb-0">Ekspert bilan moslik baholashdan so‘ng hisoblanadi.</p>
                            : <div className="flex items-center gap-2"><Ring pct={avg} size={76} /><span className="small muted">O‘rtacha moslik<br />({done.length} ta o‘quvchi)</span></div>}
                    </div>
                    {best !== null && <p className="small muted mt-2 mb-0">Oldingi eng yaxshi natijangiz: <b>{best}%</b></p>}
                    <button className="btn btn-outline btn-sm mt-2" style={{ width: '100%' }} onClick={reset}><i className="fas fa-rotate" />Qaytadan boshlash</button>
                </div>
                <div className="card" style={{ background: 'var(--soft)' }}>
                    <h4 className="upper" style={{ fontSize: 15 }}>Eslatma</h4>
                    <ul className="small mb-0" style={{ paddingLeft: 18 }}>
                        <li>Har bir mezon uchun deskriptorni o‘qib, ishga eng mos darajani tanlang.</li>
                        <li>Teskari aloqada kamida bitta yutuq va bitta keyingi qadamni yozing.</li>
                        <li>Saqlangandan so‘ng ekspert bahosi <span style={{ boxShadow: '0 0 0 2px var(--success)', borderRadius: 4, padding: '0 4px' }}>yashil hoshiya</span> bilan ko‘rsatiladi.</li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}
