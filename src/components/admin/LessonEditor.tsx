'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteLessonAction, saveLessonAction, saveQuestionsAction, type LessonInput, type QuestionInput } from '@/actions/admin';
import { Field, IconField, MarkdownEditor, Repeater, SaveBar, StringList, Switch } from './fields';

export function LessonEditor({ id, initial }: { id: number | null; initial: LessonInput }) {
    const [d, setD] = useState(initial);
    const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
    const [pending, start] = useTransition();
    const router = useRouter();
    const set = <K extends keyof LessonInput>(k: K, v: LessonInput[K]) => setD(x => ({ ...x, [k]: v }));
    const save = () => start(async () => {
        const r = await saveLessonAction(id, d);
        if (r.error) return setMsg({ t: r.error, ok: false });
        setMsg({ t: 'Saqlandi', ok: true });
        if (!id && r.id) router.replace(`/admin/lessons/${r.id}`);
        else router.refresh();
    });
    const del = () => { if (id && confirm('Dars va uning barcha test savollari o‘chirilsinmi? Talabalar natijalari ham o‘chadi.')) start(async () => { await deleteLessonAction(id); router.push('/admin/lessons'); }); };

    return (
        <div>
            <div className="card mb-3">
                <h3 className="upper" style={{ fontSize: 16 }}>Asosiy ma’lumotlar</h3>
                <div className="form-grid">
                    <Field label="Dars nomi" full><input className="input" value={d.title} onChange={e => set('title', e.target.value)} /></Field>
                    <Field label="Qisqa tavsif" full hint="Darslar ro‘yxatidagi kartochkada ko‘rinadi."><textarea className="textarea" style={{ minHeight: 70 }} value={d.summary} onChange={e => set('summary', e.target.value)} /></Field>
                    <Field label="Bob"><select className="select" value={d.chapter} onChange={e => set('chapter', e.target.value)}><option>I bob</option><option>II bob</option><option>III bob</option></select></Field>
                    <Field label="Davomiyligi (daqiqa)"><input type="number" className="input" min={1} value={d.duration} onChange={e => set('duration', Number(e.target.value))} /></Field>
                    <Field label="Tartib raqami" hint="Kichik raqam — ro‘yxatda yuqorida."><input type="number" className="input" value={d.position} onChange={e => set('position', Number(e.target.value))} /></Field>
                    <Field label="Holati"><div style={{ paddingTop: 8 }}><Switch checked={d.published} onChange={v => set('published', v)} label={d.published ? 'E’lon qilingan (talabalarga ko‘rinadi)' : 'Qoralama (yashirin)'} /></div></Field>
                    <Field label="Belgi (ikonka)" full><IconField value={d.icon} onChange={v => set('icon', v)} /></Field>
                    <Field label="Videodars havolasi (ixtiyoriy)" hint="YouTube havolasi yoki .mp4 fayl manzili"><input className="input" value={d.videoUrl} placeholder="https://www.youtube.com/watch?v=…" onChange={e => set('videoUrl', e.target.value)} /></Field>
                    <Field label="PDF material havolasi (ixtiyoriy)" hint="Google Drive yoki boshqa ochiq havola"><input className="input" value={d.pdfUrl} placeholder="https://…" onChange={e => set('pdfUrl', e.target.value)} /></Field>
                </div>
            </div>
            <div className="card mb-3">
                <h3 className="upper" style={{ fontSize: 16 }}>Dars maqsadlari</h3>
                <StringList value={d.goals} onChange={v => set('goals', v)} placeholder="Masalan: Formativ va summativ baholashni farqlash" addLabel="Maqsad qo‘shish" />
            </div>
            <div className="card mb-3">
                <h3 className="upper" style={{ fontSize: 16 }}>Dars matni</h3>
                <MarkdownEditor value={d.content} onChange={v => set('content', v)} />
            </div>
            <div className="grid grid-2 mb-3" style={{ alignItems: 'start' }}>
                <div className="card"><h3 className="upper" style={{ fontSize: 16 }}>Tayanch tushunchalar</h3><StringList value={d.terms} onChange={v => set('terms', v)} placeholder="Atama" addLabel="Atama qo‘shish" /></div>
                <div className="card"><h3 className="upper" style={{ fontSize: 16 }}>“O‘zingizni tekshiring” savollari</h3><StringList value={d.reviewQuestions} onChange={v => set('reviewQuestions', v)} placeholder="Savol" addLabel="Savol qo‘shish" /></div>
            </div>
            <SaveBar pending={pending} msg={msg} onSave={save} backHref="/admin/lessons"
                extra={<>{id && <a href={`/lessons/${id}`} target="_blank" className="btn btn-outline"><i className="fas fa-eye" />Saytda ko‘rish</a>}{id && <button type="button" className="btn btn-danger" onClick={del} disabled={pending}><i className="fas fa-trash" />O‘chirish</button>}</>} />
        </div>
    );
}

export function QuestionsEditor({ lessonId, initial }: { lessonId: number; initial: QuestionInput[] }) {
    const [qs, setQs] = useState(initial);
    const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
    const [pending, start] = useTransition();
    const save = () => start(async () => { const r = await saveQuestionsAction(lessonId, qs); setMsg(r.error ? { t: r.error, ok: false } : { t: 'Savollar saqlandi', ok: true }); });
    return (
        <>
            <Repeater items={qs} onChange={setQs} label={i => `${i + 1}-savol`} addLabel="Savol qo‘shish"
                make={() => ({ text: '', options: ['', '', '', ''], correct: 0, explanation: '' })}
                render={(q, set) => (
                    <>
                        <Field label="Savol matni"><textarea className="textarea" style={{ minHeight: 60 }} value={q.text} onChange={e => set({ ...q, text: e.target.value })} /></Field>
                        <label className="small" style={{ fontWeight: 500, color: 'var(--navy)' }}>Variantlar <span className="muted">(to‘g‘ri javobni belgilang)</span></label>
                        {q.options.map((o, k) => (
                            <div key={k} className="inline-row">
                                <label className="radio-correct"><input type="radio" checked={q.correct === k} onChange={() => set({ ...q, correct: k })} />{'ABCDEF'[k]}</label>
                                <input className="input" value={o} onChange={e => set({ ...q, options: q.options.map((x, j) => (j === k ? e.target.value : x)) })} style={q.correct === k ? { borderColor: 'var(--success)' } : undefined} />
                                <button type="button" className="icon-action danger" aria-label="Variantni o‘chirish" disabled={q.options.length <= 2}
                                    onClick={() => set({ ...q, options: q.options.filter((_, j) => j !== k), correct: q.correct === k ? 0 : q.correct > k ? q.correct - 1 : q.correct })}><i className="fas fa-xmark" /></button>
                            </div>
                        ))}
                        {q.options.length < 6 && <button type="button" className="btn btn-outline btn-sm mb-2" onClick={() => set({ ...q, options: [...q.options, ''] })}><i className="fas fa-plus" />Variant</button>}
                        <Field label="Izoh (natijada ko‘rsatiladi)"><input className="input" value={q.explanation} onChange={e => set({ ...q, explanation: e.target.value })} /></Field>
                    </>
                )} />
            <SaveBar pending={pending} msg={msg} onSave={save} />
        </>
    );
}
