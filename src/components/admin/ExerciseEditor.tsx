'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteExerciseAction, saveExerciseAction, type ExerciseInput } from '@/actions/admin';
import type { ChoiceData, ClassifyData, FeedbackData, MatchData, OrderData } from '@/db/schema';
import { EXERCISE_TYPES } from '@/lib/content';
import { Field, IconField, Repeater, SaveBar, StringList, Switch } from './fields';

type T = ExerciseInput['type'];
const EMPTY: Record<T, ExerciseInput['data']> = {
    classify: { categories: ['Birinchi toifa', 'Ikkinchi toifa'], items: [{ t: '', c: 0 }] },
    match: { pairs: [{ l: '', r: '' }, { l: '', r: '' }] },
    order: { items: ['', '', ''] },
    choice: { cases: [{ t: '', o: ['', '', '', ''], a: 0, e: '' }] },
    feedback: { work: '', rubric: [''], checklist: ['Kamida ikkita aniq yutuqni ko‘rsatdim', 'Bitta aniq keyingi qadamni taklif qildim'], praise: ['yaxshi', 'to‘g‘ri', 'aniq'], next: ['keyingi', 'tavsiya', 'qo‘sh'], model: '' }
};
const HELP: Record<T, string> = {
    classify: 'Talaba har bir bandni toifalardan biriga ajratadi (masalan: formativ / summativ).',
    match: 'Talaba chap ustundagi tushunchaga o‘ng ustundagi ta’rifni tanlaydi. Bu yerda to‘g‘ri juftlarni yozing — saytda ular aralashtiriladi.',
    order: 'Bosqichlarni TO‘G‘RI tartibda yozing — saytda ular aralashtirib beriladi.',
    choice: 'Har bir vaziyat uchun variantlar va to‘g‘ri javob. Javob tanlangach izoh ko‘rsatiladi.',
    feedback: 'Talaba o‘quvchi ishiga teskari aloqa yozadi. Kalit so‘zlar avtomatik taxminiy baholash uchun ishlatiladi.'
};

export function ExerciseEditor({ id, initial, lessons }: { id: number | null; initial: ExerciseInput; lessons: { id: number; title: string }[] }) {
    const [d, setD] = useState(initial);
    const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
    const [pending, start] = useTransition();
    const router = useRouter();
    const set = <K extends keyof ExerciseInput>(k: K, v: ExerciseInput[K]) => setD(x => ({ ...x, [k]: v }));
    const setData = (v: ExerciseInput['data']) => set('data', v);
    const save = () => start(async () => {
        const r = await saveExerciseAction(id, d);
        if (r.error) return setMsg({ t: r.error, ok: false });
        setMsg({ t: 'Saqlandi', ok: true });
        if (!id && r.id) router.replace(`/admin/exercises/${r.id}`); else router.refresh();
    });
    const del = () => { if (id && confirm('Mashq va unga oid natijalar o‘chirilsinmi?')) start(async () => { await deleteExerciseAction(id); router.push('/admin/exercises'); }); };

    return (
        <div>
            <div className="card mb-3">
                <h3 className="upper" style={{ fontSize: 16 }}>Asosiy ma’lumotlar</h3>
                <div className="form-grid">
                    <Field label="Mashq turi" hint={id ? 'Saqlangan mashq turini o‘zgartirib bo‘lmaydi.' : 'Turni tanlang — pastdagi forma o‘zgaradi.'}>
                        <select className="select" value={d.type} disabled={!!id} onChange={e => { const t = e.target.value as T; setD(x => ({ ...x, type: t, data: structuredClone(EMPTY[t]) })); }}>
                            {Object.entries(EXERCISE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </Field>
                    <Field label="Tegishli dars"><select className="select" value={d.lessonId ?? ''} onChange={e => set('lessonId', e.target.value ? Number(e.target.value) : null)}><option value="">— yo‘q —</option>{lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select></Field>
                    <Field label="Nomi" full><input className="input" value={d.title} onChange={e => set('title', e.target.value)} /></Field>
                    <Field label="Qisqa tavsif" full><input className="input" value={d.summary} onChange={e => set('summary', e.target.value)} /></Field>
                    <Field label="Topshiriq (talabaga ko‘rsatma)" full><textarea className="textarea" style={{ minHeight: 70 }} value={d.task} onChange={e => set('task', e.target.value)} /></Field>
                    <Field label="Qiyinlik"><select className="select" value={d.level} onChange={e => set('level', e.target.value)}><option value="easy">Oson</option><option value="medium">O‘rta</option><option value="hard">Qiyin</option></select></Field>
                    <Field label="Vaqt (daqiqa)"><input type="number" className="input" value={d.duration} onChange={e => set('duration', Number(e.target.value))} /></Field>
                    <Field label="Tartib raqami"><input type="number" className="input" value={d.position} onChange={e => set('position', Number(e.target.value))} /></Field>
                    <Field label="Holati"><div style={{ paddingTop: 8 }}><Switch checked={d.published} onChange={v => set('published', v)} label={d.published ? 'E’lon qilingan' : 'Qoralama'} /></div></Field>
                    <Field label="Belgi" full><IconField value={d.icon} onChange={v => set('icon', v)} /></Field>
                </div>
            </div>
            <div className="card mb-3">
                <h3 className="upper" style={{ fontSize: 16 }}>Mashq mazmuni: {EXERCISE_TYPES[d.type]}</h3>
                <div className="hint"><i className="fas fa-lightbulb" /><div>{HELP[d.type]}</div></div>
                {d.type === 'classify' && <ClassifyEd v={d.data as ClassifyData} on={setData} />}
                {d.type === 'match' && <Repeater items={(d.data as MatchData).pairs} onChange={pairs => setData({ pairs })} label={i => `${i + 1}-juft`} addLabel="Juft qo‘shish"
                    make={() => ({ l: '', r: '' })} render={(p, s) => <div className="form-grid"><Field label="Tushuncha"><input className="input" value={p.l} onChange={e => s({ ...p, l: e.target.value })} /></Field><Field label="Ta’rif"><input className="input" value={p.r} onChange={e => s({ ...p, r: e.target.value })} /></Field></div>} />}
                {d.type === 'order' && <StringList value={(d.data as OrderData).items} onChange={items => setData({ items })} placeholder="Bosqich" addLabel="Bosqich qo‘shish" />}
                {d.type === 'choice' && <ChoiceEd v={d.data as ChoiceData} on={setData} />}
                {d.type === 'feedback' && <FeedbackEd v={d.data as FeedbackData} on={setData} />}
            </div>
            <SaveBar pending={pending} msg={msg} onSave={save} backHref="/admin/exercises"
                extra={<>{id && <a href={`/exercises/${id}`} target="_blank" className="btn btn-outline"><i className="fas fa-eye" />Sinab ko‘rish</a>}{id && <button type="button" className="btn btn-danger" onClick={del} disabled={pending}><i className="fas fa-trash" />O‘chirish</button>}</>} />
        </div>
    );
}

function ClassifyEd({ v, on }: { v: ClassifyData; on: (x: ClassifyData) => void }) {
    return (
        <>
            <Field label="Toifalar"><StringList value={v.categories} onChange={categories => on({ categories, items: v.items.map(it => ({ ...it, c: Math.min(it.c, Math.max(0, categories.length - 1)) })) })} placeholder="Toifa nomi" addLabel="Toifa qo‘shish" /></Field>
            <label className="small" style={{ fontWeight: 500, color: 'var(--navy)' }}>Bandlar va to‘g‘ri toifasi</label>
            {v.items.map((it, i) => (
                <div key={i} className="inline-row">
                    <span className="muted small" style={{ width: 20 }}>{i + 1}.</span>
                    <input className="input" value={it.t} placeholder="Vaziyat yoki band matni" onChange={e => on({ ...v, items: v.items.map((x, k) => (k === i ? { ...x, t: e.target.value } : x)) })} />
                    <select className="select" style={{ maxWidth: 200 }} value={it.c} onChange={e => on({ ...v, items: v.items.map((x, k) => (k === i ? { ...x, c: Number(e.target.value) } : x)) })}>
                        {v.categories.map((c, ci) => <option key={ci} value={ci}>{c || `Toifa ${ci + 1}`}</option>)}
                    </select>
                    <button type="button" className="icon-action danger" aria-label="O‘chirish" onClick={() => on({ ...v, items: v.items.filter((_, k) => k !== i) })}><i className="fas fa-xmark" /></button>
                </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={() => on({ ...v, items: [...v.items, { t: '', c: 0 }] })}><i className="fas fa-plus" />Band qo‘shish</button>
        </>
    );
}

function ChoiceEd({ v, on }: { v: ChoiceData; on: (x: ChoiceData) => void }) {
    return (
        <Repeater items={v.cases} onChange={cases => on({ cases })} label={i => `${i + 1}-vaziyat`} addLabel="Vaziyat qo‘shish"
            make={() => ({ t: '', o: ['', '', '', ''], a: 0, e: '' })}
            render={(c, s) => (
                <>
                    <Field label="Vaziyat matni"><textarea className="textarea" style={{ minHeight: 60 }} value={c.t} onChange={e => s({ ...c, t: e.target.value })} /></Field>
                    <label className="small" style={{ fontWeight: 500, color: 'var(--navy)' }}>Variantlar <span className="muted">(eng to‘g‘risini belgilang)</span></label>
                    {c.o.map((o, k) => (
                        <div key={k} className="inline-row">
                            <label className="radio-correct"><input type="radio" checked={c.a === k} onChange={() => s({ ...c, a: k })} />{'ABCDEF'[k]}</label>
                            <input className="input" value={o} onChange={e => s({ ...c, o: c.o.map((x, j) => (j === k ? e.target.value : x)) })} style={c.a === k ? { borderColor: 'var(--success)' } : undefined} />
                            <button type="button" className="icon-action danger" aria-label="O‘chirish" disabled={c.o.length <= 2} onClick={() => s({ ...c, o: c.o.filter((_, j) => j !== k), a: c.a === k ? 0 : c.a > k ? c.a - 1 : c.a })}><i className="fas fa-xmark" /></button>
                        </div>
                    ))}
                    {c.o.length < 6 && <button type="button" className="btn btn-outline btn-sm mb-2" onClick={() => s({ ...c, o: [...c.o, ''] })}><i className="fas fa-plus" />Variant</button>}
                    <Field label="Izoh"><textarea className="textarea" style={{ minHeight: 50 }} value={c.e} onChange={e => s({ ...c, e: e.target.value })} /></Field>
                </>
            )} />
    );
}

function FeedbackEd({ v, on }: { v: FeedbackData; on: (x: FeedbackData) => void }) {
    const set = <K extends keyof FeedbackData>(k: K, x: FeedbackData[K]) => on({ ...v, [k]: x });
    return (
        <>
            <Field label="O‘quvchi ishi (talaba baholaydigan matn)"><textarea className="textarea" value={v.work} onChange={e => set('work', e.target.value)} /></Field>
            <Field label="Rubrika bo‘yicha kuzatuvlar"><StringList value={v.rubric} onChange={x => set('rubric', x)} placeholder="Masalan: Imlo: 2 ta xato" /></Field>
            <Field label="O‘z-o‘zini tekshirish bandlari"><StringList value={v.checklist} onChange={x => set('checklist', x)} placeholder="Masalan: Bitta aniq keyingi qadamni taklif qildim" /></Field>
            <div className="form-grid">
                <Field label="Yutuq kalit so‘zlari" hint="Avtomatik tahlil uchun"><StringList value={v.praise} onChange={x => set('praise', x)} placeholder="yaxshi" /></Field>
                <Field label="Keyingi qadam kalit so‘zlari" hint="Avtomatik tahlil uchun"><StringList value={v.next} onChange={x => set('next', x)} placeholder="tavsiya" /></Field>
            </div>
            <Field label="Namunaviy javob (tekshirgandan keyin ko‘rsatiladi)"><textarea className="textarea" value={v.model} onChange={e => set('model', e.target.value)} /></Field>
        </>
    );
}
