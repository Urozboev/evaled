'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteTermAction, deleteToolAction, saveTermAction, saveToolAction, type ToolInput } from '@/actions/admin';
import { Field, IconField, StringList } from './fields';

type Tool = ToolInput & { id: number };
const blankTool = (pos: number): ToolInput => ({ name: '', category: '', icon: 'fa-laptop', url: 'https://', use: '', tip: '', kinds: ['Formativ'], position: pos });

export function ToolsManager({ items }: { items: Tool[] }) {
    const [edit, setEdit] = useState<{ id: number | null; v: ToolInput } | null>(null);
    const [msg, setMsg] = useState('');
    const [pending, start] = useTransition();
    const router = useRouter();
    const save = () => edit && start(async () => {
        const r = await saveToolAction(edit.id, edit.v);
        if (r.error) return setMsg(r.error);
        setMsg(''); setEdit(null); router.refresh();
    });
    const set = <K extends keyof ToolInput>(k: K, v: ToolInput[K]) => setEdit(e => (e ? { ...e, v: { ...e.v, [k]: v } } : e));

    return (
        <>
            {!edit && <button className="btn btn-primary mb-3" onClick={() => setEdit({ id: null, v: blankTool(items.length + 1) })}><i className="fas fa-plus" />Yangi vosita</button>}
            {edit && (
                <div className="card mb-3" style={{ border: '2px solid var(--primary)' }}>
                    <h3 className="upper" style={{ fontSize: 16 }}>{edit.id ? 'Vositani tahrirlash' : 'Yangi vosita'}</h3>
                    <div className="form-grid">
                        <Field label="Nomi"><input className="input" value={edit.v.name} onChange={e => set('name', e.target.value)} /></Field>
                        <Field label="Turi (toifa)" hint="Masalan: Onlayn so‘rov, Interaktiv resurs, LMS platforma"><input className="input" value={edit.v.category} onChange={e => set('category', e.target.value)} /></Field>
                        <Field label="Sayt manzili" full><input className="input" value={edit.v.url} onChange={e => set('url', e.target.value)} /></Field>
                        <Field label="Baholashda qo‘llanilishi" full><textarea className="textarea" style={{ minHeight: 60 }} value={edit.v.use} onChange={e => set('use', e.target.value)} /></Field>
                        <Field label="Amaliy maslahat" full><textarea className="textarea" style={{ minHeight: 60 }} value={edit.v.tip} onChange={e => set('tip', e.target.value)} /></Field>
                        <Field label="Baholash turlari"><StringList value={edit.v.kinds} onChange={v => set('kinds', v)} placeholder="Formativ" /></Field>
                        <Field label="Tartib raqami"><input type="number" className="input" value={edit.v.position} onChange={e => set('position', Number(e.target.value))} /></Field>
                        <Field label="Belgi" full><IconField value={edit.v.icon} onChange={v => set('icon', v)} /></Field>
                    </div>
                    {msg && <div className="alert error"><i className="fas fa-circle-exclamation" /><div>{msg}</div></div>}
                    <div className="btn-row"><button className="btn btn-success" disabled={pending} onClick={save}><i className="fas fa-floppy-disk" />Saqlash</button><button className="btn btn-outline" onClick={() => { setEdit(null); setMsg(''); }}>Bekor qilish</button></div>
                </div>
            )}
            <div className="table-card">
                <table className="data-table">
                    <thead><tr><th>#</th><th>Vosita</th><th>Turi</th><th>Baholash</th><th /></tr></thead>
                    <tbody>{items.map(t => (
                        <tr key={t.id}>
                            <td className="muted">{t.position}</td>
                            <td><i className={`fas ${t.icon}`} style={{ color: 'var(--primary)', width: 20 }} /> <b>{t.name}</b><div className="small muted">{t.url}</div></td>
                            <td className="small">{t.category}</td>
                            <td className="small">{t.kinds.join(', ')}</td>
                            <td className="actions">
                                <button className="icon-action" aria-label="Tahrirlash" onClick={() => { const { id, ...v } = t; setEdit({ id, v }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fas fa-pen" /></button>
                                <button className="icon-action danger" aria-label="O‘chirish" disabled={pending} onClick={() => { if (confirm(`“${t.name}” o‘chirilsinmi?`)) start(async () => { await deleteToolAction(t.id); router.refresh(); }); }}><i className="fas fa-trash" /></button>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </>
    );
}

export function GlossaryManager({ items }: { items: { id: number; term: string; definition: string }[] }) {
    const [edit, setEdit] = useState<{ id: number | null; term: string; definition: string } | null>(null);
    const [q, setQ] = useState('');
    const [msg, setMsg] = useState('');
    const [pending, start] = useTransition();
    const router = useRouter();
    const save = () => edit && start(async () => {
        const r = await saveTermAction(edit.id, edit.term, edit.definition);
        if (r.error) return setMsg(r.error);
        setMsg(''); setEdit(null); router.refresh();
    });
    const shown = items.filter(i => !q || (i.term + ' ' + i.definition).toLowerCase().includes(q.toLowerCase()));
    return (
        <>
            <div className="flex wrap gap-2 mb-3 items-center">
                {!edit && <button className="btn btn-primary" onClick={() => setEdit({ id: null, term: '', definition: '' })}><i className="fas fa-plus" />Yangi atama</button>}
                <div className="search-input" style={{ marginLeft: 'auto', minWidth: 240 }}><i className="fas fa-magnifying-glass" /><input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Qidirish…" aria-label="Qidirish" /></div>
            </div>
            {edit && (
                <div className="card mb-3" style={{ border: '2px solid var(--primary)' }}>
                    <Field label="Atama"><input className="input" value={edit.term} onChange={e => setEdit({ ...edit, term: e.target.value })} /></Field>
                    <Field label="Izoh"><textarea className="textarea" style={{ minHeight: 80 }} value={edit.definition} onChange={e => setEdit({ ...edit, definition: e.target.value })} /></Field>
                    {msg && <div className="alert error"><i className="fas fa-circle-exclamation" /><div>{msg}</div></div>}
                    <div className="btn-row"><button className="btn btn-success" disabled={pending} onClick={save}><i className="fas fa-floppy-disk" />Saqlash</button><button className="btn btn-outline" onClick={() => { setEdit(null); setMsg(''); }}>Bekor qilish</button></div>
                </div>
            )}
            <div className="table-card">
                <table className="data-table">
                    <thead><tr><th>Atama</th><th>Izoh</th><th /></tr></thead>
                    <tbody>{shown.map(t => (
                        <tr key={t.id}>
                            <td style={{ whiteSpace: 'nowrap' }}><b>{t.term}</b></td>
                            <td className="small">{t.definition}</td>
                            <td className="actions">
                                <button className="icon-action" aria-label="Tahrirlash" onClick={() => { setEdit({ ...t }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fas fa-pen" /></button>
                                <button className="icon-action danger" aria-label="O‘chirish" disabled={pending} onClick={() => { if (confirm(`“${t.term}” o‘chirilsinmi?`)) start(async () => { await deleteTermAction(t.id); router.refresh(); }); }}><i className="fas fa-trash" /></button>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </>
    );
}
