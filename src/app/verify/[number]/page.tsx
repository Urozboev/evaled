import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { certificates } from '@/db/schema';
import { Alert, PageHero, fmtDate } from '@/components/ui';
import { SITE } from '@/lib/content';

export const metadata = { title: 'Sertifikatni tekshirish' };

export default async function VerifyPage({ params }: { params: Promise<{ number: string }> }) {
    const { number } = await params;
    const db = await getDb();
    const [c] = await db.select().from(certificates).where(eq(certificates.number, decodeURIComponent(number).toUpperCase()));
    return (
        <>
            <PageHero title="Sertifikatni tekshirish" lead={`Raqam: ${decodeURIComponent(number)}`} />
            <section className="section">
                <div className="container" style={{ maxWidth: 720 }}>
                    {c ? (
                        <div className="card">
                            <Alert kind="ok"><b>Sertifikat haqiqiy.</b></Alert>
                            <div className="req"><i className="fas fa-user" style={{ color: 'var(--primary)' }} />Egasi<span className="val">{c.fullName}</span></div>
                            <div className="req"><i className="fas fa-hashtag" style={{ color: 'var(--primary)' }} />Raqam<span className="val">{c.number}</span></div>
                            <div className="req"><i className="fas fa-calendar" style={{ color: 'var(--primary)' }} />Berilgan sana<span className="val">{fmtDate(c.issuedAt)}</span></div>
                            <div className="req"><i className="fas fa-flag-checkered" style={{ color: 'var(--primary)' }} />Yakuniy test<span className="val">{c.finalScore}%</span></div>
                            <div className="req" style={{ border: 0 }}><i className="fas fa-book" style={{ color: 'var(--primary)' }} />Kurs<span className="val small" style={{ maxWidth: 380, textAlign: 'right' }}>{SITE.title}</span></div>
                        </div>
                    ) : <Alert kind="error">Bunday raqamli sertifikat topilmadi. Raqamni tekshirib qayta urinib ko‘ring.</Alert>}
                </div>
            </section>
        </>
    );
}
