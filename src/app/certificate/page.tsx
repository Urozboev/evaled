import Link from 'next/link';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { certificates } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { PASS_SCORE } from '@/lib/content';
import { getProgress } from '@/lib/progress';
import { Alert, PageHero } from '@/components/ui';
import { CertificateView } from '@/components/CertificateView';
import { CertificateActions } from '@/components/CertificateActions';

export const metadata = { title: 'Sertifikat' };

export default async function CertificatePage() {
    const me = await requireUser('/certificate');
    const p = await getProgress(me.id);
    const db = await getDb();
    const [cert] = await db.select().from(certificates).where(eq(certificates.userId, me.id));
    const h = await headers();
    const origin = process.env.APP_URL || `${h.get('x-forwarded-proto') || 'http'}://${h.get('host')}`;
    const reqs = [
        ['lessons', 'Barcha darslar o‘qilgan', `${p.lessonsDone}/${p.lessonsTotal}`, '/lessons'],
        ['final', `Yakuniy test ≥ ${PASS_SCORE}%`, `${p.finalBest}%`, '/tests/final'],
        ['exercises', `Kamida ${p.reqEx} ta mashq`, `${p.exDone}/${p.reqEx}`, '/exercises'],
        ['sims', `Kamida ${p.reqSim} ta simulyator`, `${p.simDone}/${p.reqSim}`, '/simulators']
    ] as const;

    return (
        <>
            <PageHero title="Sertifikat" crumbs={[{ label: 'Sertifikat' }]} lead="Kursni to‘liq tamomlaganlik sertifikati. Har bir sertifikatning raqami bor va uni istalgan kishi onlayn tekshira oladi." />
            <section className="section">
                <div className="container with-aside">
                    <div>
                        {!p.eligible && <Alert kind="info"><b>Sertifikat hali yopiq.</b> O‘ng tomondagi talablarni bajaring — har biri ustiga bosib, kerakli bo‘limga o‘tishingiz mumkin. Pastda namunaviy ko‘rinish.</Alert>}
                        {cert && <Alert kind="ok">Sertifikat berilgan. Tekshirish havolasi: <Link href={`/verify/${cert.number}`}>{origin}/verify/{cert.number}</Link></Alert>}
                        <CertificateView name={cert?.fullName || me.fullName} number={cert?.number || 'RBK-0000-000000'} date={cert?.issuedAt || new Date()}
                            finalScore={cert?.finalScore ?? p.finalBest} overall={cert?.overall ?? p.overall} sample={!cert} verifyUrl={cert ? `${origin.replace(/^https?:\/\//, '')}/verify/${cert.number}` : undefined} />
                    </div>
                    <aside className="aside-sticky">
                        <div className="card">
                            <h4 className="upper" style={{ fontSize: 15 }}>Talablar</h4>
                            {reqs.map(([k, t, v, href]) => (
                                <Link key={k} className="req" href={href} style={{ color: 'inherit' }}>
                                    <i className={`fas ${p.req[k] ? 'fa-circle-check' : 'fa-circle-xmark'}`} style={{ color: p.req[k] ? 'var(--success)' : 'var(--danger)' }} />{t}<span className="val">{v}</span>
                                </Link>
                            ))}
                        </div>
                        <CertificateActions eligible={p.eligible} issued={!!cert} fullName={cert?.fullName || me.fullName} />
                    </aside>
                </div>
            </section>
        </>
    );
}
