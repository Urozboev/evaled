import Link from 'next/link';
import { count, desc, eq, gte, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { certificates, exerciseAttempts, exercises, groups, lessons, questions, simulatorAttempts, simulators, testAttempts, users } from '@/db/schema';
import { ROLES } from '@/lib/content';
import { fmtDate } from '@/components/ui';

export const metadata = { title: 'Boshqaruv paneli' };

export default async function AdminHome() {
    const db = await getDb();
    const one = async (q: Promise<{ c: number }[]>) => Number((await q)[0]?.c || 0);
    const week = new Date(Date.now() - 7 * 864e5);
    const [students, teachers, grp, les, qs, ex, sims, certs, active, attempts, recent, finals] = await Promise.all([
        one(db.select({ c: count() }).from(users).where(eq(users.role, 'student'))),
        one(db.select({ c: count() }).from(users).where(eq(users.role, 'teacher'))),
        one(db.select({ c: count() }).from(groups)),
        one(db.select({ c: count() }).from(lessons)),
        one(db.select({ c: count() }).from(questions)),
        one(db.select({ c: count() }).from(exercises)),
        one(db.select({ c: count() }).from(simulators)),
        one(db.select({ c: count() }).from(certificates)),
        one(db.select({ c: count() }).from(users).where(gte(users.lastSeenAt, week))),
        Promise.all([one(db.select({ c: count() }).from(testAttempts)), one(db.select({ c: count() }).from(exerciseAttempts)), one(db.select({ c: count() }).from(simulatorAttempts))]).then(a => a.reduce((x, y) => x + y, 0)),
        db.select({ id: users.id, name: users.fullName, email: users.email, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(8),
        db.select({ avg: sql<number>`coalesce(round(avg(${testAttempts.score})), 0)` }).from(testAttempts).where(eq(testAttempts.testKey, 'final'))
    ]);

    const kpis = [
        ['fa-user-graduate', students, 'Talabalar', '/admin/users?role=student'], ['fa-chalkboard-user', teachers, 'O‘qituvchilar', '/admin/users?role=teacher'],
        ['fa-users', grp, 'Guruhlar', '/teacher'], ['fa-signal', active, 'Faol (7 kun)', '/admin/users'],
        ['fa-pen-to-square', attempts, 'Topshirilgan ishlar', '/admin/users'], ['fa-flag-checkered', `${finals[0]?.avg || 0}%`, 'Yakuniy test o‘rtachasi', '/admin/users'],
        ['fa-award', certs, 'Berilgan sertifikatlar', '/admin/users'], ['fa-book-open', `${les} / ${qs}`, 'Darslar / savollar', '/admin/lessons']
    ] as const;

    return (
        <>
            <div className="panel-head"><div><h1>Boshqaruv paneli</h1><p>Platforma bo‘yicha umumiy ko‘rsatkichlar</p></div></div>
            <div className="grid grid-4 mb-3">
                {kpis.map(([i, v, l, h]) => <Link key={l} href={h} className="card kpi hover" style={{ color: 'inherit' }}><span className="card-icon"><i className={`fas ${i}`} /></span><div><b>{v}</b><span>{l}</span></div></Link>)}
            </div>
            <div className="with-aside">
                <div className="card">
                    <div className="flex between items-center mb-2"><h3 className="upper mb-0" style={{ fontSize: 16 }}>Yangi foydalanuvchilar</h3><Link href="/admin/users" className="link-arrow">Barchasi <i className="fas fa-arrow-right" /></Link></div>
                    <div className="table-card" style={{ border: 0 }}>
                        <table className="data-table">
                            <thead><tr><th>Ism</th><th>E-pochta</th><th>Rol</th><th>Sana</th></tr></thead>
                            <tbody>{recent.map(u => <tr key={u.id}><td><Link href={`/teacher/students/${u.id}`}>{u.name}</Link></td><td className="small">{u.email}</td><td><span className="tag gray">{ROLES[u.role]}</span></td><td className="small">{fmtDate(u.createdAt)}</td></tr>)}</tbody>
                        </table>
                    </div>
                </div>
                <aside className="aside-sticky">
                    <div className="card">
                        <h4 className="upper" style={{ fontSize: 15 }}>Kontent</h4>
                        <Link className="req" href="/admin/lessons" style={{ color: 'inherit' }}><i className="fas fa-book-open" style={{ color: 'var(--primary)' }} />Darslar<span className="val">{les}</span></Link>
                        <Link className="req" href="/admin/exercises" style={{ color: 'inherit' }}><i className="fas fa-puzzle-piece" style={{ color: 'var(--primary)' }} />Mashqlar<span className="val">{ex}</span></Link>
                        <Link className="req" href="/admin/simulators" style={{ color: 'inherit' }}><i className="fas fa-children" style={{ color: 'var(--primary)' }} />Simulyatorlar<span className="val">{sims}</span></Link>
                    </div>
                    <div className="hint" style={{ marginBottom: 0 }}><i className="fas fa-lightbulb" /><div>O‘qituvchi huquqini berish: <b>Foydalanuvchilar</b> → kerakli odam → rolni “O‘qituvchi” qiling.</div></div>
                </aside>
            </div>
        </>
    );
}
