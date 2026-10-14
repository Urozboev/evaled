import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { FINAL_COUNT, FINAL_MINUTES, LESSON_TEST_MINUTES, PASS_SCORE } from '@/lib/content';
import { catalog, getProgress } from '@/lib/progress';
import { Hint, PageHero, ScoreTag } from '@/components/ui';

export const metadata = { title: 'Testlar va diagnostika' };

export default async function TestsPage() {
    const user = await requireUser('/tests');
    const [p, cat] = await Promise.all([getProgress(user.id), catalog()]);
    const fin = p.tests.final;
    return (
        <>
            <PageHero title="Testlar va diagnostika" crumbs={[{ label: 'Testlar' }]} lead="Mavzu testlari bilimingizni tekshiradi, diagnostika esa kompetensiyangiz darajasini ko‘rsatadi. Testlarni cheklovsiz qayta topshirish mumkin — eng yaxshi natija hisobga olinadi." />
            <section className="section">
                <div className="container">
                    <Hint>Har bir darsni o‘qib bo‘lgach, o‘sha mavzu testini topshiring. <b>Yakuniy test</b> barcha mavzulardan iborat va sertifikat uchun kamida <b>{PASS_SCORE}%</b> talab qilinadi.</Hint>
                    <div className="grid grid-2 mb-3">
                        <div className="card" style={{ background: 'linear-gradient(135deg,#eef4ff,#fff)' }}>
                            <div className="card-top"><span className="card-icon"><i className="fas fa-stethoscope" /></span><span className="tag">12 ta mulohaza · 3 daqiqa</span></div>
                            <h3>Kompetensiya diagnostikasi</h3>
                            <p className="desc">Baholash kompetensiyangizning 4 ta komponenti bo‘yicha o‘z-o‘zini baholash. Kurs boshida va oxirida to‘ldiring — o‘sishingizni ko‘rasiz.</p>
                            <div className="card-foot"><span className="small muted">{p.diag.post ? 'Dastlabki va yakuniy bajarilgan' : p.diag.pre ? 'Dastlabki bajarilgan' : 'Hali to‘ldirilmagan'}</span><Link href="/diagnostics" className="btn btn-primary btn-sm">Diagnostika <i className="fas fa-arrow-right" /></Link></div>
                        </div>
                        <div className="card" style={{ background: 'linear-gradient(135deg,#0b1430,#0055c6)', color: '#fff', border: 0 }}>
                            <div className="card-top"><span className="card-icon" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}><i className="fas fa-flag-checkered" /></span><span className="tag" style={{ background: '#ffb400', color: '#141d38' }}>Sertifikat uchun</span></div>
                            <h3 style={{ color: '#fff' }}>Yakuniy test</h3>
                            <p className="desc" style={{ color: 'rgba(255,255,255,.85)' }}>Barcha mavzular bo‘yicha savollar bankidan tasodifiy tanlangan {FINAL_COUNT} ta savol, {FINAL_MINUTES} daqiqa.</p>
                            <div className="card-foot" style={{ borderColor: 'rgba(255,255,255,.15)' }}><span className="small" style={{ opacity: .85 }}>{fin ? `Eng yaxshi natija: ${fin.best}% · ${fin.tries} urinish` : 'Hali topshirilmagan'}</span><Link href="/tests/final" className="btn btn-white btn-sm">Boshlash <i className="fas fa-arrow-right" /></Link></div>
                        </div>
                    </div>
                    <div className="sec-head-left mt-4"><h2>Mavzu testlari</h2><span className="muted small">Har bir test — {LESSON_TEST_MINUTES} daqiqa</span></div>
                    <div className="grid grid-4">
                        {cat.lessons.map((l, i) => {
                            const r = p.tests[`lesson:${l.id}`];
                            return (
                                <Link key={l.id} className="card hover" href={`/tests/${l.id}`} style={{ color: 'inherit' }}>
                                    <div className="card-top"><span className="card-icon"><i className={`fas ${l.icon}`} /></span>{r ? <ScoreTag score={r.best} /> : <span className="tag gray">Yangi</span>}</div>
                                    <span className="num-badge">{i + 1}-mavzu</span>
                                    <h3 className="mt-1" style={{ fontSize: 17 }}>{l.title}</h3>
                                    <div className="card-foot"><span className="small muted">{p.done.has(l.id) ? <><i className="fas fa-check" style={{ color: 'var(--success)' }} /> Dars o‘qilgan</> : 'Dars o‘qilmagan'}</span><span className="link-arrow">{r ? 'Qayta' : 'Boshlash'} <i className="fas fa-arrow-right" /></span></div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
