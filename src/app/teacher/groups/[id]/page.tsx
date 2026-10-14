import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { requireRole } from '@/lib/auth';
import { manageableGroup } from '@/lib/groups';
import { progressForUsers } from '@/lib/progress';
import { CopyButton, GroupSettings, RemoveStudent } from '@/components/TeacherClient';
import { Empty, ScoreTag, fmtDate } from '@/components/ui';

export const metadata = { title: 'Guruh natijalari' };

export default async function GroupPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ sort?: string }> }) {
    const { id } = await params;
    const { sort = 'name' } = await searchParams;
    const me = await requireRole(['teacher', 'admin'], `/teacher/groups/${id}`);
    const g = await manageableGroup(me, Number(id) || 0);
    if (!g) notFound();
    const db = await getDb();
    const st = await db.select({ id: users.id, name: users.fullName, email: users.email, lastSeen: users.lastSeenAt }).from(users).where(eq(users.groupId, g.id)).orderBy(asc(users.fullName));
    const prog = await progressForUsers(st.map(s => s.id));
    const rows = st.map(s => ({ ...s, p: prog.get(s.id)! }));
    if (sort === 'progress') rows.sort((a, b) => b.p.overall - a.p.overall);
    if (sort === 'final') rows.sort((a, b) => b.p.finalBest - a.p.finalBest);
    const n = rows.length;
    const avg = (f: (r: typeof rows[number]) => number) => (n ? Math.round(rows.reduce((a, r) => a + f(r), 0) / n) : 0);
    const diagRows = rows.filter(r => r.p.diag.pre && r.p.diag.post);
    const growth = diagRows.length ? Math.round(diagRows.reduce((a, r) => a + (r.p.diag.post!.result.total - r.p.diag.pre!.result.total), 0) / diagRows.length) : null;
    const h = await headers();
    const origin = process.env.APP_URL || `${h.get('x-forwarded-proto') || 'http'}://${h.get('host')}`;

    return (
        <>
            <div className="panel-head">
                <div><Link href="/teacher" className="small"><i className="fas fa-arrow-left" /> Guruhlarim</Link><h1 className="mt-1">{g.name}</h1><p>Kod: <span className="code-badge">{g.code}</span> · {n} ta talaba</p></div>
                <div className="btn-row">
                    <CopyButton text={`${origin}/register?code=${g.code}`} label="Taklif havolasi" />
                    <a href={`/teacher/groups/${g.id}/export`} className="btn btn-outline btn-sm"><i className="fas fa-file-csv" />CSV yuklab olish</a>
                </div>
            </div>

            <div className="grid grid-4 mb-3">
                {[['fa-users', n, 'Talabalar'], ['fa-chart-line', `${avg(r => r.p.overall)}%`, 'O‘rtacha progress'], ['fa-flag-checkered', `${avg(r => r.p.finalBest)}%`, 'Yakuniy test o‘rtachasi'], ['fa-arrow-trend-up', growth === null ? '—' : `${growth >= 0 ? '+' : ''}${growth}%`, 'Diagnostika o‘sishi']].map(([i, v, l]) => (
                    <div key={l as string} className="card kpi"><span className="card-icon"><i className={`fas ${i}`} /></span><div><b>{v}</b><span>{l}</span></div></div>
                ))}
            </div>

            <div className="with-aside">
                <div className="table-card">
                    {n === 0 ? <Empty icon="fa-user-plus">Guruhda hali talaba yo‘q. Taklif havolasini yoki <b>{g.code}</b> kodini talabalarga yuboring.</Empty> : (
                        <table className="data-table">
                            <thead><tr>
                                <th><Link href="?sort=name">Talaba</Link></th>
                                <th>Darslar</th><th>Testlar</th><th>Mashq</th><th>Simulyator</th>
                                <th><Link href="?sort=final">Yakuniy</Link></th>
                                <th>Diagnostika</th>
                                <th><Link href="?sort=progress">Progress</Link></th><th />
                            </tr></thead>
                            <tbody>
                                {rows.map(r => (
                                    <tr key={r.id}>
                                        <td><Link href={`/teacher/students/${r.id}`}><b>{r.name}</b></Link><div className="small muted">{r.lastSeen ? `oxirgi kirish: ${fmtDate(r.lastSeen)}` : r.email}</div></td>
                                        <td>{r.p.lessonsDone}/{r.p.lessonsTotal}</td>
                                        <td><ScoreTag score={r.p.testsDone ? r.p.testsTakenAvg : null} /><div className="small muted">{r.p.testsDone}/{r.p.testsTotal}</div></td>
                                        <td>{r.p.exDone}/{r.p.exTotal}</td>
                                        <td>{r.p.simDone}/{r.p.simTotal}</td>
                                        <td><ScoreTag score={r.p.tests.final ? r.p.finalBest : null} /></td>
                                        <td className="small">{r.p.diag.pre ? `${r.p.diag.pre.result.total}%` : '—'}{r.p.diag.post ? ` → ${r.p.diag.post.result.total}%` : ''}</td>
                                        <td style={{ minWidth: 110 }}><div className="small mb-0">{r.p.overall}%{r.p.certificate && <i className="fas fa-award" style={{ color: 'var(--warning)', marginLeft: 6 }} title="Sertifikat olingan" />}</div><div className="mini-bar"><span style={{ width: `${r.p.overall}%` }} /></div></td>
                                        <td className="actions"><RemoveStudent groupId={g.id} userId={r.id} name={r.name} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <aside className="aside-sticky"><GroupSettings id={g.id} name={g.name} /></aside>
            </div>
        </>
    );
}
