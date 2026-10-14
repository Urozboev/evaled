'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Markdown } from '../Markdown';

/* Admin tahrirlovchilari uchun umumiy maydonlar. */

export function Field({ label, hint, children, full }: { label: string; hint?: string; children: ReactNode; full?: boolean }) {
    return <div className={`form-group ${full ? 'full' : ''}`}><label>{label}</label>{children}{hint && <div className="field-hint">{hint}</div>}</div>;
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return <label className="switch"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />{label}</label>;
}

export function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const SUG = ['fa-book-open', 'fa-compass', 'fa-layer-group', 'fa-table-cells', 'fa-comments', 'fa-lightbulb', 'fa-laptop-code', 'fa-chart-column', 'fa-puzzle-piece', 'fa-shuffle', 'fa-link', 'fa-list-check', 'fa-calculator', 'fa-spell-check', 'fa-seedling', 'fa-children', 'fa-people-group', 'fa-star'];
    return (
        <div>
            <div className="inline-row">
                <span className="card-icon" style={{ width: 42, height: 42, fontSize: 18 }}><i className={`fas ${value}`} /></span>
                <input className="input" value={value} onChange={e => onChange(e.target.value.trim())} placeholder="fa-book-open" />
            </div>
            <div className="flex wrap" style={{ gap: 4 }}>
                {SUG.map(s => <button type="button" key={s} className="icon-action" style={{ width: 30, height: 30 }} title={s} onClick={() => onChange(s)}><i className={`fas ${s}`} /></button>)}
            </div>
        </div>
    );
}

/** Satrlar ro‘yxati: qo‘shish, o‘chirish, tartibini o‘zgartirish. */
export function StringList({ value, onChange, placeholder, multiline, addLabel = 'Qo‘shish' }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; multiline?: boolean; addLabel?: string }) {
    const set = (i: number, v: string) => onChange(value.map((x, k) => (k === i ? v : x)));
    const move = (i: number, d: number) => { const n = value.slice(); [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); };
    return (
        <div>
            {value.map((v, i) => (
                <div key={i} className="inline-row">
                    <span className="muted small" style={{ width: 20 }}>{i + 1}.</span>
                    {multiline ? <textarea className="textarea" style={{ minHeight: 60 }} value={v} placeholder={placeholder} onChange={e => set(i, e.target.value)} />
                        : <input className="input" value={v} placeholder={placeholder} onChange={e => set(i, e.target.value)} />}
                    <button type="button" className="icon-action" aria-label="Yuqoriga" disabled={i === 0} onClick={() => move(i, -1)}><i className="fas fa-chevron-up" /></button>
                    <button type="button" className="icon-action" aria-label="Pastga" disabled={i === value.length - 1} onClick={() => move(i, 1)}><i className="fas fa-chevron-down" /></button>
                    <button type="button" className="icon-action danger" aria-label="O‘chirish" onClick={() => onChange(value.filter((_, k) => k !== i))}><i className="fas fa-xmark" /></button>
                </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...value, ''])}><i className="fas fa-plus" />{addLabel}</button>
        </div>
    );
}

/** Ro‘yxat elementlari uchun umumiy “repeater”. */
export function Repeater<T>({ items, onChange, make, render, label, addLabel = 'Qo‘shish' }: {
    items: T[]; onChange: (v: T[]) => void; make: () => T; render: (item: T, set: (v: T) => void, i: number) => ReactNode; label: (i: number) => string; addLabel?: string;
}) {
    const move = (i: number, d: number) => { const n = items.slice(); [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); };
    return (
        <div>
            {items.map((it, i) => (
                <div key={i} className="repeater-item">
                    <div className="rm flex" style={{ gap: 4 }}>
                        <button type="button" className="icon-action" aria-label="Yuqoriga" disabled={i === 0} onClick={() => move(i, -1)}><i className="fas fa-chevron-up" /></button>
                        <button type="button" className="icon-action" aria-label="Pastga" disabled={i === items.length - 1} onClick={() => move(i, 1)}><i className="fas fa-chevron-down" /></button>
                        <button type="button" className="icon-action danger" aria-label="O‘chirish" onClick={() => { if (confirm('O‘chirilsinmi?')) onChange(items.filter((_, k) => k !== i)); }}><i className="fas fa-trash" /></button>
                    </div>
                    <div className="num">{label(i)}</div>
                    {render(it, v => onChange(items.map((x, k) => (k === i ? v : x))), i)}
                </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...items, make()])}><i className="fas fa-plus" />{addLabel}</button>
        </div>
    );
}

/** Markdown tahrirlovchi: asboblar paneli + jonli ko‘rinish. */
export function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');
    const wrap = (before: string, after = '', ph = 'matn') => {
        const ta = ref.current; if (!ta) return;
        const { selectionStart: a, selectionEnd: b } = ta;
        const sel = value.slice(a, b) || ph;
        const next = value.slice(0, a) + before + sel + after + value.slice(b);
        onChange(next);
        requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(a + before.length, a + before.length + sel.length); });
    };
    const block = (text: string) => {
        const ta = ref.current; if (!ta) return;
        const a = ta.selectionStart;
        const pre = value.slice(0, a);
        const nl = pre && !pre.endsWith('\n\n') ? (pre.endsWith('\n') ? '\n' : '\n\n') : '';
        onChange(pre + nl + text + '\n\n' + value.slice(a));
    };
    const tools: [string, string, () => void][] = [
        ['fa-heading', 'Bo‘lim sarlavhasi', () => block('## Yangi bo‘lim')],
        ['fa-bold', 'Qalin', () => wrap('**', '**')],
        ['fa-italic', 'Kursiv', () => wrap('*', '*')],
        ['fa-list-ul', 'Ro‘yxat', () => block('- birinchi band\n- ikkinchi band')],
        ['fa-list-ol', 'Raqamli ro‘yxat', () => block('1. birinchi qadam\n2. ikkinchi qadam')],
        ['fa-table', 'Jadval', () => block('| Ustun 1 | Ustun 2 |\n|---|---|\n| matn | matn |')],
        ['fa-circle-info', 'Ko‘k eslatma', () => block('> [!NOTE] Sarlavha\n> Eslatma matni')],
        ['fa-circle-check', 'Yashil eslatma', () => block('> [!TIP] Sarlavha\n> Maslahat matni')],
        ['fa-triangle-exclamation', 'Sariq ogohlantirish', () => block('> [!WARNING] Sarlavha\n> Ogohlantirish matni')],
        ['fa-link', 'Havola', () => wrap('[', '](https://)', 'havola matni')]
    ];
    return (
        <div>
            <div className="md-toolbar">
                {tools.map(([i, t, fn]) => <button key={t} type="button" title={t} aria-label={t} onClick={fn}><i className={`fas ${i}`} /></button>)}
                <span style={{ marginLeft: 'auto' }} />
                {(['edit', 'split', 'preview'] as const).map(v => <button key={v} type="button" onClick={() => setView(v)} style={view === v ? { background: '#fff', borderColor: 'var(--line)', fontWeight: 600 } : undefined}>{v === 'edit' ? 'Matn' : v === 'split' ? 'Ikkalasi' : 'Ko‘rinish'}</button>)}
            </div>
            <div className={view === 'split' ? 'md-split' : ''}>
                {view !== 'preview' && <textarea ref={ref} className="textarea md-editor" value={value} onChange={e => onChange(e.target.value)} spellCheck={false} />}
                {view !== 'edit' && <div className="md-preview article"><Markdown>{value || '*Bo‘sh*'}</Markdown></div>}
            </div>
            <div className="field-hint">Sarlavha: <code>## Matn</code> · qalin: <code>**matn**</code> · ro‘yxat: <code>- band</code> · eslatma: <code>&gt; [!NOTE] Sarlavha</code>. Tugmalar buni avtomatik qo‘shadi.</div>
        </div>
    );
}

export function SaveBar({ pending, msg, onSave, extra, backHref }: { pending: boolean; msg: { t: string; ok: boolean } | null; onSave: () => void; extra?: ReactNode; backHref?: string }) {
    return (
        <div className="sticky-save">
            <button type="button" className="btn btn-success" disabled={pending} onClick={onSave}>{pending ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-floppy-disk" />}Saqlash</button>
            {backHref && <a href={backHref} className="btn btn-outline">Ro‘yxatga qaytish</a>}
            {extra}
            {msg && <span className="small" style={{ color: msg.ok ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}><i className={`fas ${msg.ok ? 'fa-circle-check' : 'fa-circle-exclamation'}`} /> {msg.t}</span>}
        </div>
    );
}
