import Link from 'next/link';
import { headers } from 'next/headers';
import { asc, eq, inArray } from 'drizzle-orm';
import { getDb } from '@/db';
import { groups, users } from '@/db/schema';
import { requireRole } from '@/lib/auth';
import { progressForUsers } from '@/lib/progress';
import { CopyButton, CreateGroupForm } from '@/components/TeacherClient';
import { Empty, Hint, fmtDate } from '@/components/ui';

export const metadata = { title: 'O‘qituvchi paneli' };

export default async function TeacherHome() {
    const me = await requireRole(['teacher', 'admin'], '/teacher');
    const db = await getDb();
    const list = await db.select({ id: groups.id, name: groups.name, code: groups.code, createdAt: groups.createdAt, teacher: users.fullName })
        .from(groups).leftJoin(users, eq(users.id, groups.teacherId))
        .where(me.role === 'admin' ? undefined : eq(groups.teacherId, me.id)).orderBy(asc(groups.name));
    const members = list.length ? await db.select({ id: users.id, groupId: users.groupId }).from(users).where(inArray(users.groupId, list.map(g => g.id))) : [];
    const prog = await progressForUsers(members.map(m => m.id));
    const h = await headers();
    const origin = process.env.APP_URL || `${h.get('x-forwarded-proto') || 'http'}://${h.get('host')}`;

    return (
        <>
            <div className="panel-head">
                <div><h1>Guruhlarim</h1><p>{me.role === 'admin' ? 'Barcha o‘qituvchilarning guruhlari' : 'Talabalaringiz natijalarini kuzating'}</p></div>
            </div>
            <Hint><b>Qanday ishlaydi:</b> guruh yarating → kod yoki havolani talabalarga yuboring → ular ro‘yxatdan o‘tganda guruhingizga avtomatik qo‘shiladi va natijalari shu yerda ko‘rinadi.</Hint>
            <CreateGroupForm />
            {list.length === 0 ? <div className="card"><Empty icon="fa-users">Hali guruh yo‘q. Yuqoridagi forma orqali birinchi guruhni yarating.</Empty></div> : (
                <div className="grid grid-2">
                    {list.map(g => {
                        const ms = members.filter(m => m.groupId === g.id);
                        const avg = ms.length ? Math.round(ms.reduce((a, m) => a + (prog.get(m.id)?.overall || 0), 0) / ms.length) : 0;
                        const certs = ms.filter(m => prog.get(m.id)?.certificate).length;
                        const link = `${origin}/register?code=${g.code}`;
                        return (
                            <div key={g.id} className="card">
                                <div className="card-top">
                                    <div><h3 className="mb-0"><Link href={`/teacher/groups/${g.id}`} style={{ color: 'inherit' }}>{g.name}</Link></h3>
                                        <span className="small muted">{me.role === 'admin' && g.teacher ? `${g.teacher} · ` : ''}yaratilgan {fmtDate(g.createdAt)}</span></div>
                                    <span className="code-badge" title="Guruh kodi">{g.code}</span>
                                </div>
                                <div className="grid grid-3" style={{ gap: 10 }}>
                                    <div><b style={{ fontFamily: 'var(--font-head)', fontSize: 24, color: 'var(--navy)' }}>{ms.length}</b><div className="small muted">talaba</div></div>
                                    <div><b style={{ fontFamily: 'var(--font-head)', fontSize: 24, color: 'var(--navy)' }}>{avg}%</b><div className="small muted">o‘rtacha progress</div></div>
                                    <div><b style={{ fontFamily: 'var(--font-head)', fontSize: 24, color: 'var(--navy)' }}>{certs}</b><div className="small muted">sertifikat</div></div>
                                </div>
                                <div className="card-foot mt-2">
                                    <CopyButton text={link} label="Taklif havolasi" />
                                    <Link href={`/teacher/groups/${g.id}`} className="btn btn-primary btn-sm">Natijalar<i className="fas fa-arrow-right" /></Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
