import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { groups, users } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { DIAGNOSTIC, PASS_SCORE } from '@/lib/content';
import { catalog, getProgress, nextStep } from '@/lib/progress';
import { Alert, Bar, NetBg, Ring, ScoreTag } from '@/components/ui';

export const metadata = { title: 'Mening sahifam' };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
    const user = await requireUser('/dashboard');
    const { welcome } = await searchParams;
    const [p, step, cat] = await Promise.all([getProgress(user.id), nextStep(user.id), catalog()]);
    const db = await getDb();
    const group = user.groupId
        ? (await db.select({ name: groups.name, teacher: users.fullName }).from(groups).leftJoin(users, eq(users.id, groups.teacherId)).where(eq(groups.id, user.groupId)))[0]
        : null;

    const steps = [
        { k: 'diag', icon: 'fa-stethoscope', t: 'Diagnostika', s: p.diag.pre ? 'Bajarildi' : '3 daqiqa', done: !!p.diag.pre, href: '/diagnostics' },
        { k: 'lesson', icon: 'fa-book-open', t: 'Darslar', s: `${p.lessonsDone}/${p.lessonsTotal}`, done: p.req.lessons, href: '/lessons' },
        { k: 'exercise', icon: 'fa-puzzle-piece', t: 'Mashqlar', s: `${p.exDone}/${p.reqEx} kerak`, done: p.req.exercises, href: '/exercises' },
        { k: 'sim', icon: 'fa-children', t: 'Simulyator', s: `${p.simDone}/${p.reqSim} kerak`, done: p.req.sims, href: '/simulators' },
        { k: 'final', icon: 'fa-flag-checkered', t: 'Yakuniy test', s: p.tests.final ? `${p.finalBest}%` : `≥ ${PASS_SCORE}%`, done: p.req.final, href: '/tests/final' },
        { k: 'cert', icon: 'fa-award', t: 'Sertifikat', s: p.certificate ? 'Olingan' : p.eligible ? 'Tayyor!' : 'Yopiq', done: !!p.certificate, href: '/certificate' }
    ];
    const curKey = ({ test: 'lesson', 'diag-post': 'cert' } as Record<string, string>)[step.key] || step.key;
    const first = user.fullName.split(' ').slice(-1)[0];

    return (
        <section className="section" style={{ paddingTop: 36 }}>
            <div className="container">
                {welcome && <Alert kind="ok"><b>Xush kelibsiz, {first}!</b> Akkauntingiz yaratildi. Quyidagi ko‘k blokdagi tugma sizni har doim keyingi qadamga olib boradi.</Alert>}

                <div className="flex between items-center wrap gap-2 mb-3">
                    <div>
                        <span className="muted small upper">Mening sahifam</span>
                        <h1 style={{ fontSize: 30, margin: '2px 0 0' }}>Salom, {first}!</h1>
                    </div>
                    {user.role !== 'student' ? <Link href="/teacher" className="tag"><i className="fas fa-chalkboard-user" />O‘qituvchi paneli</Link> : group ? <span className="tag"><i className="fas fa-users" />Guruh: {group.name}{group.teacher ? ` · ${group.teacher}` : ''}</span>
                        : <Link href="/profile" className="tag amber"><i className="fas fa-users" />Guruhga qo‘shilish</Link>}
                </div>

                <div className="next-card mb-3">
                    <NetBg seed={9} />
                    <span className="ic"><i className={`fas ${step.icon}`} /></span>
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <p className="eyebrow">Keyingi qadam</p>
                        <h2>{step.title}</h2>
                        <p>{step.text}</p>
                    </div>
                    <Link href={step.href} className="btn btn-white" style={{ height: 52, padding: '0 26px' }}>{step.cta}<i className="fas fa-arrow-right" /></Link>
                </div>

                <h2 className="upper" style={{ fontSize: 18 }}>Sertifikat sari yo‘l</h2>
                <div className="stepper mb-3">
                    {steps.map((s, i) => (
                        <Link key={s.k} href={s.href} className={`st ${s.done ? 'done' : ''} ${s.k === curKey && !s.done ? 'current' : ''}`}>
                            <span className="dot">{s.done ? <i className="fas fa-check" /> : <i className={`fas ${s.icon}`} />}</span>
                            <b>{i + 1}. {s.t}</b><span>{s.s}</span>
                        </Link>
                    ))}
                </div>

                <div className="with-aside">
                    <div className="card">
                        <div className="flex between items-center mb-2"><h3 className="upper mb-0" style={{ fontSize: 17 }}>Darslar</h3><Link href="/lessons" className="link-arrow">Barchasi <i className="fas fa-arrow-right" /></Link></div>
                        <div className="table-card" style={{ border: 0 }}>
                            <table className="data-table">
                                <thead><tr><th>#</th><th>Dars</th><th>O‘qildi</th><th>Test</th></tr></thead>
                                <tbody>
                                    {cat.lessons.map((l, i) => (
                                        <tr key={l.id}>
                                            <td className="muted">{i + 1}</td>
                                            <td><Link href={`/lessons/${l.id}`}>{l.title}</Link></td>
                                            <td>{p.done.has(l.id) ? <i className="fas fa-circle-check" style={{ color: 'var(--success)' }} aria-label="O‘qildi" /> : <i className="far fa-circle muted" aria-label="O‘qilmagan" />}</td>
                                            <td>{p.tests[`lesson:${l.id}`] ? <ScoreTag score={p.tests[`lesson:${l.id}`].best} /> : <Link href={`/tests/${l.id}`} className="small">Topshirish</Link>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex" style={{ flexDirection: 'column', gap: 20 }}>
                        <div className="card center" style={{ alignItems: 'center' }}>
                            <Ring pct={p.overall} size={130} label="Umumiy progress" />
                            <h3 className="upper mt-2 mb-0" style={{ fontSize: 16 }}>Umumiy progress</h3>
                            <p className="small muted mb-0">Darslar 30% · testlar 30% · mashqlar 20% · simulyatorlar 20%</p>
                        </div>
                        <div className="card">
                            <h3 className="upper" style={{ fontSize: 16 }}>Ko‘rsatkichlar</h3>
                            {[['Testlar o‘rtachasi', p.testsAvg], ['Mashqlar o‘rtachasi', p.exAvg], ['Simulyatorlar (ekspert bilan moslik)', p.simAvg]].map(([t, v]) => (
                                <div key={t as string} className="mb-2"><div className="progress-label"><span>{t}</span><b>{v}%</b></div><Bar pct={v as number} /></div>
                            ))}
                        </div>
                        <div className="card">
                            <h3 className="upper" style={{ fontSize: 16 }}>Diagnostika</h3>
                            {p.diag.pre ? (
                                <>
                                    {(Object.keys(DIAGNOSTIC.components) as (keyof typeof DIAGNOSTIC.components)[]).map(c => (
                                        <div key={c} className="mb-2">
                                            <div className="progress-label"><span>{DIAGNOSTIC.components[c].name}</span><b>{p.diag.pre!.result[c]}%{p.diag.post ? ` → ${p.diag.post.result[c]}%` : ''}</b></div>
                                            <Bar pct={(p.diag.post || p.diag.pre)!.result[c]} tone={p.diag.post ? 'green' : undefined} height={6} />
                                        </div>
                                    ))}
                                    <Link href="/diagnostics" className="link-arrow small">Batafsil <i className="fas fa-arrow-right" /></Link>
                                </>
                            ) : <p className="small muted mb-0">Hali o‘tilmagan. <Link href="/diagnostics">Diagnostikani boshlang</Link> — u sizga qaysi yo‘nalishga e’tibor berishni ko‘rsatadi.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
