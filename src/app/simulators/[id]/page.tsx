import { notFound } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { simulators } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { getProgress } from '@/lib/progress';
import { PageHero } from '@/components/ui';
import { SimulatorClient } from '@/components/SimulatorClient';

export const metadata = { title: 'Baholash simulyatori' };

export default async function SimulatorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: raw } = await params;
    const user = await requireUser(`/simulators/${raw}`);
    const db = await getDb();
    const [S] = await db.select().from(simulators).where(and(eq(simulators.id, Number(raw) || 0), eq(simulators.published, true)));
    if (!S) notFound();
    const all = await db.select({ id: simulators.id }).from(simulators).where(eq(simulators.published, true)).orderBy(asc(simulators.position), asc(simulators.id));
    const next = all[all.findIndex(x => x.id === S.id) + 1];
    const best = (await getProgress(user.id)).sims[S.id];
    return (
        <>
            <PageHero title={S.title} crumbs={[{ label: 'Simulyatorlar', href: '/simulators' }, { label: S.subject }]} lead={S.summary}>
                <div className="hero-meta" style={{ justifyContent: 'flex-start', marginTop: 18 }}>
                    <span><i className="fas fa-book" />{S.subject}</span><span><i className="fas fa-school" />{S.grade}</span><span><i className="fas fa-children" />{S.students.length} ta o‘quvchi</span>
                </div>
            </PageHero>
            <section className="section">
                <div className="container">
                    <SimulatorClient id={S.id} task={S.task} grade={S.grade} criteria={S.criteria} students={S.students} best={best ?? null}
                        nextHref={next ? `/simulators/${next.id}` : '/tests/final'} nextLabel={next ? 'Keyingi simulyator' : 'Yakuniy testga o‘tish'} />
                </div>
            </section>
        </>
    );
}
