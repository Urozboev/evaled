import Link from 'next/link';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { simulators } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { getProgress } from '@/lib/progress';
import { Hint, LevelTag, PageHero } from '@/components/ui';

export const metadata = { title: 'Baholash simulyatorlari' };

export default async function SimulatorsPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
    const user = await requireUser('/simulators');
    const { s: subj } = await searchParams;
    const db = await getDb();
    const [list, p] = await Promise.all([
        db.select().from(simulators).where(eq(simulators.published, true)).orderBy(asc(simulators.position), asc(simulators.id)),
        getProgress(user.id)
    ]);
    const subjects = [...new Set(list.map(x => x.subject))];
    return (
        <>
            <PageHero title="Baholash simulyatorlari" crumbs={[{ label: 'Simulyatorlar' }]} lead="Virtual boshlang‘ich sinf o‘quvchilarining ishlarini rubrika asosida baholang va natijangizni ekspert bahosi bilan solishtiring." />
            <section className="section">
                <div className="container">
                    <Hint>Sertifikat uchun kamida <b>{p.reqSim} ta</b> simulyatorni yakunlang. Natija — sizning bahoingiz ekspert bahosiga qanchalik yaqinligi (moslik foizi).</Hint>
                    <div className="filters">
                        <Link href="/simulators" className={`chip ${!subj ? 'on' : ''}`}>Barchasi</Link>
                        {subjects.map(x => <Link key={x} href={`/simulators?s=${encodeURIComponent(x)}`} className={`chip ${subj === x ? 'on' : ''}`}>{x}</Link>)}
                    </div>
                    <div className="grid grid-3">
                        {list.filter(x => !subj || x.subject === subj).map(x => {
                            const r = p.sims[x.id];
                            return (
                                <Link key={x.id} className="card hover" href={`/simulators/${x.id}`} style={{ color: 'inherit' }}>
                                    <div className="card-top"><span className="card-icon"><i className={`fas ${x.icon}`} /></span><span className="tag">{x.subject} · {x.grade}</span></div>
                                    <h3>{x.title}</h3>
                                    <p className="desc">{x.summary}</p>
                                    <div className="card-meta"><span><i className="fas fa-children" />{x.students.length} ta o‘quvchi</span><span><i className="fas fa-table-cells" />{x.criteria.length} ta mezon</span>{r !== undefined && <span><i className="fas fa-bullseye" />Moslik: <b>{r}%</b></span>}</div>
                                    <div className="card-foot"><LevelTag level={x.level} /><span className="link-arrow">{r !== undefined ? 'Qayta baholash' : 'Boshlash'} <i className="fas fa-arrow-right" /></span></div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
            <section className="section soft">
                <div className="container">
                    <h2 className="sec-title">Simulyator qanday ishlaydi?</h2>
                    <p className="sec-lead">Simulyatsiya texnologiyasi real sinf vaziyatini xavfsiz muhitda modellashtiradi</p>
                    <div className="grid grid-4">
                        {[['fa-hand-pointer', '1. Tanlang', 'Fan va sinf bo‘yicha virtual darsni tanlang.'], ['fa-file-pen', '2. O‘qing', 'Topshiriq va har bir o‘quvchi ishini diqqat bilan o‘rganing.'], ['fa-table-cells', '3. Baholang', 'Rubrika mezonlari bo‘yicha daraja tanlang va izoh yozing.'], ['fa-scale-balanced', '4. Solishtiring', 'Ekspert bahosi va teskari aloqasi bilan moslikni ko‘ring.']].map(([i, t, d]) => (
                            <div key={t} className="card center"><span className="card-icon" style={{ margin: '0 auto 12px' }}><i className={`fas ${i}`} /></span><h3 style={{ fontSize: 17 }}>{t}</h3><p className="desc small mb-0">{d}</p></div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
