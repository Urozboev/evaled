'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { deleteUserAction, resetUserPasswordAction, setUserGroupAction, setUserRoleAction } from '@/actions/admin';
import { fmtDate } from '../ui';

type U = { id: number; name: string; email: string; role: 'student' | 'teacher' | 'admin'; groupId: number | null; createdAt: string; lastSeen: string | null; overall: number };

export function UserRow({ u, groups, self }: { u: U; groups: { id: number; name: string }[]; self: boolean }) {
    const [role, setRole] = useState(u.role);
    const [groupId, setGroupId] = useState(u.groupId);
    const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
    const [gone, setGone] = useState(false);
    const [pending, start] = useTransition();
    if (gone) return null;
    const run = (fn: () => Promise<{ error?: string; ok?: boolean }>, ok: string) => start(async () => { const r = await fn(); setMsg(r.error ? { t: r.error, ok: false } : { t: ok, ok: true }); });

    return (
        <tr>
            <td>
                <Link href={`/teacher/students/${u.id}`}><b>{u.name}</b></Link>{self && <span className="tag" style={{ marginLeft: 6 }}>siz</span>}
                <div className="small muted">{u.email} · {fmtDate(u.createdAt)}</div>
                {msg && <div className="small" style={{ color: msg.ok ? 'var(--success)' : 'var(--danger)', marginTop: 4 }}>{msg.t}</div>}
            </td>
            <td>
                <select className="select" style={{ padding: '6px 10px', minWidth: 140 }} value={role} disabled={pending || self} aria-label="Rol"
                    onChange={e => { const r = e.target.value as U['role']; setRole(r); run(() => setUserRoleAction(u.id, r), 'Rol saqlandi'); }}>
                    <option value="student">Talaba</option><option value="teacher">O‘qituvchi</option><option value="admin">Administrator</option>
                </select>
            </td>
            <td>
                <select className="select" style={{ padding: '6px 10px', minWidth: 150 }} value={groupId ?? ''} disabled={pending} aria-label="Guruh"
                    onChange={e => { const g = e.target.value ? Number(e.target.value) : null; setGroupId(g); run(() => setUserGroupAction(u.id, g), 'Guruh saqlandi'); }}>
                    <option value="">— yo‘q —</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
            </td>
            <td style={{ minWidth: 90 }}><div className="small">{u.overall}%</div><div className="mini-bar"><span style={{ width: `${u.overall}%` }} /></div></td>
            <td className="actions">
                <button className="icon-action" title="Vaqtinchalik parol berish" aria-label="Parolni tiklash" disabled={pending}
                    onClick={() => { if (confirm(`${u.name} uchun yangi vaqtinchalik parol yaratilsinmi? Eski parol ishlamay qoladi.`)) start(async () => { const r = await resetUserPasswordAction(u.id); setMsg(r.password ? { t: `Yangi parol: ${r.password} — foydalanuvchiga yetkazing, u Profil’da o‘zgartirsin.`, ok: true } : { t: r.error || 'Xato', ok: false }); }); }}>
                    <i className="fas fa-key" />
                </button>
                {!self && <button className="icon-action danger" title="O‘chirish" aria-label="Foydalanuvchini o‘chirish" disabled={pending}
                    onClick={() => { if (confirm(`${u.name} va uning barcha natijalari butunlay o‘chirilsinmi?`)) start(async () => { const r = await deleteUserAction(u.id); if (r.ok) setGone(true); else setMsg({ t: r.error || 'Xato', ok: false }); }); }}>
                    <i className="fas fa-trash" />
                </button>}
            </td>
        </tr>
    );
}
