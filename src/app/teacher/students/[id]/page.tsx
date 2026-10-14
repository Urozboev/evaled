import Link from 'next/link';
import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { exerciseAttempts, exercises, lessons, simulatorAttempts, simulators, testAttempts, users } from '@/db/schema';
import { requireRole } from '@/lib/auth';
import { DIAGNOSTIC } from '@/lib/content';
import { manageableGroup } from '@/lib/groups';
import { catalog, getProgress } from '@/lib/progress';
import { Bar, Ring, ScoreTag, fmtDate } from '@/components/ui';

export const metadata = { title: 'Talaba natijalari' };

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const me = await requireRole(['teacher', 'admin'], `/teacher/students/${id}`);
    const db = await getDb();
    const [s] = await db.select().from(users).where(eq(users.id, Number(id) || 0));
    if (!s) notFound();
    const g = s.groupId ? await manageableGroup(me, s.groupId) : null;
    if (me.role !== 'admin' && !g) notFound();

    const [p, cat, tests, exs, sims, lessonRows] = await Promise.all([
        getProgress(s.id), catalog(),
        db.select().from(testAttempts).where(eq(testAttempts.userId, s.id)).orderBy(desc(testAttempts.createdAt)).limit(40),
        db.select({ score: exerciseAttempts.score, at: exerciseAttempts.createdAt, title: exercises.title }).from(exerciseAttempts).innerJoin(exercises, eq(exercises.id, exerciseAttempts.exerciseId)).where(eq(exerciseAttempts.userId, s.id)).orderBy(desc(exerciseAttempts.createdAt)).limit(40),
        db.select({ score: simulatorAttempts.score, at: simulatorAttempts.createdAt, title: simulators.title }).from(simulatorAttempts).innerJoin(simulators, eq(simulators.id, simulatorAttempts.simulatorId)).where(eq(simulatorAttempts.userId, s.id)).orderBy(desc(simulatorAttempts.createdAt)).limit(40),
        db.select({ id: lessons.id, title: lessons.title }).from(lessons)
    ]);
    const lessonTitle = (key: string) => key === 'final' ? 'Yakuniy test' : lessonRows.find(l => `lesson:${l.id}` === key)?.title || key;
    const comps = Object.keys(DIAGNOSTIC.components) as (keyof typeof DIAGNOSTIC.components)[];

    return (
        <>
            <div className="panel-head">
                <div>
                    {g ? <Link href={`/teacher/groups/${g.id}`} className="small"><i className="fas fa-arrow-left" /> {g.name}</Link> : <Link href="/admin/users" className="small"><i className="fas fa-arrow-left" /> Foydalanuvchilar</Link>}
                    <h1 className="mt-1">{s.fullName}</h1><p>{s.email} · ro‘yxatdan o‘tgan {fmtDate(s.createdAt)} · oxirgi kirish {fmtDate(s.lastSeenAt)}</p>
                </div>
                {p.certificate && <span className="tag green"><i className="fas fa-award" />Sertifikat: {p.certificate.number}</span>}
            </div>
            <div className="grid grid-4 mb-3">
                <div className="card kpi" style={{ gridRow: 'span 1' }}><Ring pct={p.overall} size={70} /><div><b>Umumiy</b><span>progress</span></div></div>
                {[['fa-book-open', `${p.lessonsDone}/${p.lessonsTotal}`, 'Darslar'], ['fa-puzzle-piece', `${p.exDone}/${p.exTotal}`, `Mashqlar · ${p.exAvg}%`], ['fa-children', `${p.simDone}/${p.simTotal}`, `Simulyator · ${p.simAvg}%`]].map(([i, v, l]) => (
                    <div key={l} className="card kpi"><span className="card-icon"><i className={`fas ${i}`} /></span><div><b>{v}</b><span>{l}</span></div></div>
                ))}
            </div>
            <div className="grid grid-2 mb-3" style={{ alignItems: 'start' }}>
                <div className="card">
                    <h3 className="upper" style={{ fontSize: 16 }}>Mavzu testlari (eng yaxshi)</h3>
                    {cat.lessons.map((l, i) => {
                        const t = p.tests[`lesson:${l.id}`];
                        return <div key={l.id} className="req"><span className="muted" style={{ width: 22 }}>{i + 1}</span><span style={{ flex: 1 }}>{l.title}</span>{p.done.has(l.id) && <i className="fas fa-book-open" style={{ color: 'var(--success)' }} title="Dars o‘qilgan" />}<span className="val"><ScoreTag score={t ? t.best : null} /></span></div>;
                    })}
                    <div className="req" style={{ border: 0 }}><b style={{ flex: 1 }}>Yakuniy test</b><span className="val"><ScoreTag score={p.tests.final ? p.finalBest : null} /></span></div>
                </div>
                <div className="card">
                    <h3 className="upper" style={{ fontSize: 16 }}>Diagnostika</h3>
                    {!p.diag.pre ? <p className="muted small mb-0">Hali o‘tilmagan.</p> : comps.map(c => (
                        <div key={c} className="mb-2">
                            <div className="progress-label"><span>{DIAGNOSTIC.components[c].name}</span><b>{p.diag.pre!.result[c]}%{p.diag.post ? ` → ${p.diag.post.result[c]}%` : ''}</b></div>
                            <Bar pct={(p.diag.post || p.diag.pre)!.result[c]} tone={p.diag.post ? 'green' : undefined} height={6} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="card">
                <h3 className="upper" style={{ fontSize: 16 }}>Faollik tarixi</h3>
                <div className="table-card" style={{ border: 0 }}>
                    <table className="data-table">
                        <thead><tr><th>Sana</th><th>Tur</th><th>Nomi</th><th>Natija</th></tr></thead>
                        <tbody>
                            {[...tests.map(t => ({ at: t.createdAt, kind: 'Test', title: lessonTitle(t.testKey), score: t.score, extra: `${t.correct}/${t.total}` })),
                              ...exs.map(e => ({ at: e.at, kind: 'Mashq', title: e.title, score: e.score, extra: '' })),
                              ...sims.map(x => ({ at: x.at, kind: 'Simulyator', title: x.title, score: x.score, extra: 'moslik' }))]
                                .sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 50)
                                .map((r, i) => <tr key={i}><td className="small">{fmtDate(r.at)}</td><td><span className="tag gray">{r.kind}</span></td><td>{r.title}</td><td><ScoreTag score={r.score} /> <span className="small muted">{r.extra}</span></td></tr>)}
                        </tbody>
                    </table>
                    {tests.length + exs.length + sims.length === 0 && <p className="muted small" style={{ padding: 14 }}>Hali faollik yo‘q.</p>}
                </div>
            </div>
        </>
    );
}
