import Link from 'next/link';
import { and, asc, desc, eq, ilike, or } from 'drizzle-orm';
import { getDb } from '@/db';
import { groups, users } from '@/db/schema';
import { requireRole } from '@/lib/auth';
import { progressForUsers } from '@/lib/progress';
import { UserRow } from '@/components/admin/UserRow';
import { Empty } from '@/components/ui';

export const metadata = { title: 'Foydalanuvchilar' };
const PER = 50;

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; page?: string }> }) {
    const me = await requireRole(['admin'], '/admin/users');
    const { q = '', role = '', page = '1' } = await searchParams;
    const pg = Math.max(1, Number(page) || 1);
    const db = await getDb();
    const conds = [];
    if (q.trim()) conds.push(or(ilike(users.fullName, `%${q.trim()}%`), ilike(users.email, `%${q.trim()}%`)));
    if (['student', 'teacher', 'admin'].includes(role)) conds.push(eq(users.role, role as 'student'));
    const rows = await db.select({ id: users.id, name: users.fullName, email: users.email, role: users.role, groupId: users.groupId, createdAt: users.createdAt, lastSeen: users.lastSeenAt })
        .from(users).where(conds.length ? and(...conds) : undefined).orderBy(desc(users.createdAt)).limit(PER + 1).offset((pg - 1) * PER);
    const more = rows.length > PER;
    const list = rows.slice(0, PER);
    const [gl, prog] = await Promise.all([
        db.select({ id: groups.id, name: groups.name }).from(groups).orderBy(asc(groups.name)),
        progressForUsers(list.map(u => u.id))
    ]);
    const qs = (o: Record<string, string>) => '?' + new URLSearchParams({ ...(q && { q }), ...(role && { role }), ...o }).toString();

    return (
        <>
            <div className="panel-head"><div><h1>Foydalanuvchilar</h1><p>Rollar, guruhlar va parolni tiklash</p></div></div>
            <form className="card mb-3" style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', alignItems: 'center', padding: 16 }}>
                <div className="search-input" style={{ flex: 1, minWidth: 220 }}><i className="fas fa-magnifying-glass" /><input className="input" name="q" defaultValue={q} placeholder="Ism yoki e-pochta…" aria-label="Qidirish" /></div>
                <select className="select" name="role" defaultValue={role} style={{ width: 180 }} aria-label="Rol">
                    <option value="">Barcha rollar</option><option value="student">Talabalar</option><option value="teacher">O‘qituvchilar</option><option value="admin">Administratorlar</option>
                </select>
                <button className="btn btn-primary btn-sm" type="submit">Qidirish</button>
            </form>
            <div className="table-card">
                {list.length === 0 ? <Empty icon="fa-user">Foydalanuvchi topilmadi.</Empty> : (
                    <table className="data-table">
                        <thead><tr><th>Foydalanuvchi</th><th>Rol</th><th>Guruh</th><th>Progress</th><th /></tr></thead>
                        <tbody>{list.map(u => <UserRow key={u.id} u={{ ...u, createdAt: u.createdAt.toISOString(), lastSeen: u.lastSeen?.toISOString() ?? null, overall: prog.get(u.id)?.overall ?? 0 }} groups={gl} self={u.id === me.id} />)}</tbody>
                    </table>
                )}
            </div>
            <div className="flex between mt-2">
                {pg > 1 ? <Link className="btn btn-outline btn-sm" href={qs({ page: String(pg - 1) })}><i className="fas fa-arrow-left" />Oldingi</Link> : <span />}
                {more && <Link className="btn btn-outline btn-sm" href={qs({ page: String(pg + 1) })}>Keyingi<i className="fas fa-arrow-right" /></Link>}
            </div>
        </>
    );
}
