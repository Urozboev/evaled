'use client';

import { useActionState, useState, useTransition } from 'react';
import { createGroupAction, deleteGroupAction, removeStudentAction, renameGroupAction } from '@/actions/teacher';
import { FormMessage, Submit } from './AuthForms';

export function CreateGroupForm() {
    const [state, action] = useActionState(createGroupAction, undefined);
    return (
        <form action={action} className="card mb-3">
            <h3 className="upper" style={{ fontSize: 16 }}><i className="fas fa-plus" style={{ color: 'var(--primary)' }} /> Yangi guruh</h3>
            <FormMessage state={state} />
            <div className="flex wrap gap-2 items-center">
                <input name="name" className="input" placeholder="Guruh nomi, masalan: Boshlang‘ich ta’lim 21-1" style={{ flex: 1, minWidth: 220 }} required />
                <Submit full={false} icon="fa-users">Guruh yaratish</Submit>
            </div>
            <p className="field-hint mb-0">Tizim 6 belgili kod yaratadi. Talabalar shu kod bilan guruhingizga qo‘shiladi.</p>
        </form>
    );
}

export function CopyButton({ text, label = 'Nusxalash' }: { text: string; label?: string }) {
    const [done, setDone] = useState(false);
    return (
        <button type="button" className="btn btn-outline btn-sm" onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1800); } catch { /* */ } }}>
            <i className={`fas ${done ? 'fa-check' : 'fa-copy'}`} />{done ? 'Nusxalandi' : label}
        </button>
    );
}

export function GroupSettings({ id, name }: { id: number; name: string }) {
    const [n, setN] = useState(name);
    const [msg, setMsg] = useState('');
    const [pending, start] = useTransition();
    return (
        <div className="card">
            <h4 className="upper" style={{ fontSize: 15 }}>Guruh sozlamalari</h4>
            <div className="form-group"><label htmlFor="gname">Nomi</label><input id="gname" className="input" value={n} onChange={e => setN(e.target.value)} /></div>
            {msg && <p className="small" style={{ color: 'var(--success)' }}>{msg}</p>}
            <div className="flex wrap gap-2">
                <button className="btn btn-primary btn-sm" disabled={pending || n.trim() === name} onClick={() => start(async () => { const r = await renameGroupAction(id, n); setMsg(r.error || 'Saqlandi'); })}><i className="fas fa-floppy-disk" />Saqlash</button>
                <button className="btn btn-sm btn-danger" disabled={pending} onClick={() => { if (confirm('Guruh o‘chirilsinmi? Talabalar akkauntlari va natijalari saqlanib qoladi, faqat guruhdan chiqariladi.')) start(() => deleteGroupAction(id)); }}><i className="fas fa-trash" />O‘chirish</button>
            </div>
        </div>
    );
}

export function RemoveStudent({ groupId, userId, name }: { groupId: number; userId: number; name: string }) {
    const [pending, start] = useTransition();
    return (
        <button className="icon-action danger" title="Guruhdan chiqarish" aria-label={`${name}ni guruhdan chiqarish`} disabled={pending}
            onClick={() => { if (confirm(`${name} guruhdan chiqarilsinmi? Natijalari o‘chmaydi.`)) start(async () => { await removeStudentAction(groupId, userId); }); }}>
            <i className="fas fa-user-minus" />
        </button>
    );
}
