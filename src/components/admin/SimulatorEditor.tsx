'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteSimulatorAction, saveSimulatorAction, type SimulatorInput } from '@/actions/admin';
import type { SimCriterion, SimStudent } from '@/db/schema';
import { Field, IconField, Repeater, SaveBar, Switch } from './fields';

const COLORS = ['#e8590c', '#1971c2', '#2f9e44', '#c2255c', '#5f3dc4', '#0c8599', '#e67700', '#364fc7'];
const LV = ['1 — Quyi', '2 — O‘rta', '3 — Yuqori'];

export function SimulatorEditor({ id, initial }: { id: number | null; initial: SimulatorInput }) {
    const [d, setD] = useState(initial);
    const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
    const [pending, start] = useTransition();
    const router = useRouter();
    const set = <K extends keyof SimulatorInput>(k: K, v: SimulatorInput[K]) => setD(x => ({ ...x, [k]: v }));
    const setCriteria = (criteria: SimCriterion[]) => setD(x => ({ ...x, criteria, students: x.students.map(s => ({ ...s, expert: criteria.map((_, i) => s.expert[i] || 2) })) }));
    const save = () => start(async () => {
        const r = await saveSimulatorAction(id, d);
        if (r.error) return setMsg({ t: r.error, ok: false });
        setMsg({ t: 'Saqlandi', ok: true });
        if (!id && r.id) router.replace(`/admin/simulators/${r.id}`); else router.refresh();
    });
    const del = () => { if (id && confirm('Simulyator va unga oid natijalar o‘chirilsinmi?')) start(async () => { await deleteSimulatorAction(id); router.push('/admin/simulators'); }); };

    return (
        <div>
            <div className="card mb-3">
                <h3 className="upper" style={{ fontSize: 16 }}>Asosiy ma’lumotlar</h3>
                <div className="form-grid">
                    <Field label="Nomi" full><input className="input" value={d.title} onChange={e => set('title', e.target.value)} /></Field>
                    <Field label="Fan"><input className="input" value={d.subject} onChange={e => set('subject', e.target.value)} placeholder="Matematika" /></Field>
                    <Field label="Sinf"><input className="input" value={d.grade} onChange={e => set('grade', e.target.value)} placeholder="2-sinf" /></Field>
                    <Field label="Qisqa tavsif" full><input className="input" value={d.summary} onChange={e => set('summary', e.target.value)} /></Field>
                    <Field label="Topshiriq (o‘quvchilarga berilgan vazifa)" full><textarea className="textarea" value={d.task} onChange={e => set('task', e.target.value)} /></Field>
                    <Field label="Qiyinlik"><select className="select" value={d.level} onChange={e => set('level', e.target.value)}><option value="easy">Oson</option><option value="medium">O‘rta</option><option value="hard">Qiyin</option></select></Field>
                    <Field label="Tartib raqami"><input type="number" className="input" value={d.position} onChange={e => set('position', Number(e.target.value))} /></Field>
                    <Field label="Holati"><div style={{ paddingTop: 8 }}><Switch checked={d.published} onChange={v => set('published', v)} label={d.published ? 'E’lon qilingan' : 'Qoralama'} /></div></Field>
                    <Field label="Belgi"><IconField value={d.icon} onChange={v => set('icon', v)} /></Field>
                </div>
            </div>
            <div className="card mb-3">
                <h3 className="upper" style={{ fontSize: 16 }}>Rubrika mezonlari</h3>
                <div className="hint"><i className="fas fa-lightbulb" /><div>Har bir mezon uchun 3 daraja tavsifi (quyi, o‘rta, yuqori). Talaba har bir o‘quvchi ishini shu darajalar bo‘yicha baholaydi.</div></div>
                <Repeater items={d.criteria} onChange={setCriteria} label={i => `${i + 1}-mezon`} addLabel="Mezon qo‘shish"
                    make={(): SimCriterion => ({ n: '', d: ['', '', ''] })}
                    render={(c, s) => (
                        <>
                            <Field label="Mezon nomi"><input className="input" value={c.n} onChange={e => s({ ...c, n: e.target.value })} /></Field>
                            <div className="grid grid-3" style={{ gap: 10 }}>
                                {LV.map((l, k) => <Field key={k} label={l}><textarea className="textarea" style={{ minHeight: 60 }} value={c.d[k]} onChange={e => { const dd = [...c.d] as [string, string, string]; dd[k] = e.target.value; s({ ...c, d: dd }); }} /></Field>)}
                            </div>
                        </>
                    )} />
            </div>
            <div className="card mb-3">
                <h3 className="upper" style={{ fontSize: 16 }}>Virtual o‘quvchilar</h3>
                <Repeater items={d.students} onChange={v => set('students', v)} label={i => `${i + 1}-o‘quvchi`} addLabel="O‘quvchi qo‘shish"
                    make={(): SimStudent => ({ name: '', color: COLORS[d.students.length % COLORS.length], work: '', expert: d.criteria.map(() => 2), fb: '' })}
                    render={(st, s) => (
                        <>
                            <div className="form-grid">
                                <Field label="Ismi"><input className="input" value={st.name} onChange={e => s({ ...st, name: e.target.value })} /></Field>
                                <Field label="Rang"><div className="flex" style={{ gap: 6 }}>{COLORS.map(c => <button key={c} type="button" aria-label={c} onClick={() => s({ ...st, color: c })} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: st.color === c ? '3px solid var(--navy)' : '2px solid #fff', boxShadow: '0 0 0 1px var(--line)' }} />)}</div></Field>
                            </div>
                            <Field label="O‘quvchi ishi (javobi)"><textarea className="textarea" value={st.work} onChange={e => s({ ...st, work: e.target.value })} /></Field>
                            <label className="small" style={{ fontWeight: 500, color: 'var(--navy)' }}>Ekspert bahosi</label>
                            <div className="grid grid-3 mb-2" style={{ gap: 10 }}>
                                {d.criteria.map((c, ci) => (
                                    <div key={ci}><div className="small muted">{c.n || `${ci + 1}-mezon`}</div>
                                        <select className="select" value={st.expert[ci] || 2} onChange={e => s({ ...st, expert: d.criteria.map((_, k) => (k === ci ? Number(e.target.value) : st.expert[k] || 2)) })}>{LV.map((l, k) => <option key={k} value={k + 1}>{l}</option>)}</select>
                                    </div>
                                ))}
                            </div>
                            <Field label="Ekspert teskari aloqasi"><textarea className="textarea" style={{ minHeight: 70 }} value={st.fb} onChange={e => s({ ...st, fb: e.target.value })} /></Field>
                        </>
                    )} />
            </div>
            <SaveBar pending={pending} msg={msg} onSave={save} backHref="/admin/simulators"
                extra={<>{id && <a href={`/simulators/${id}`} target="_blank" className="btn btn-outline"><i className="fas fa-eye" />Sinab ko‘rish</a>}{id && <button type="button" className="btn btn-danger" onClick={del} disabled={pending}><i className="fas fa-trash" />O‘chirish</button>}</>} />
        </div>
    );
}
