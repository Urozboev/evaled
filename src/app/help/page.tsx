import Link from 'next/link';
import { PageHero } from '@/components/ui';
import { FAQ, PASS_SCORE, REQ_EXERCISES, REQ_SIMULATORS, SITE } from '@/lib/content';

export const metadata = { title: 'Yordam' };

const STUDENT = [
    ['fa-user-plus', 'Ro‘yxatdan o‘ting', 'Ism-familiya, e-pochta va parol kiriting. O‘qituvchingiz guruh kodini bergan bo‘lsa, uni ham yozing.'],
    ['fa-stethoscope', 'Diagnostikadan o‘ting', '12 ta mulohazaga 1–5 ball bering. Natija kompetensiyangizning kuchli va zaif tomonlarini ko‘rsatadi.'],
    ['fa-book-open', 'Darslarni o‘qing', 'Har bir dars oxirida “O‘qildi” tugmasini bosing va 6 savollik mavzu testini topshiring.'],
    ['fa-puzzle-piece', 'Mashqlarni bajaring', `Kamida ${REQ_EXERCISES} ta mashq. Har biridan so‘ng natija va izoh darhol ko‘rinadi.`],
    ['fa-children', 'Simulyatorda baholang', `Kamida ${REQ_SIMULATORS} ta virtual sinfda o‘quvchi ishlarini rubrika bo‘yicha baholang.`],
    ['fa-flag-checkered', 'Yakuniy test', `20 ta savol, 25 daqiqa. Kamida ${PASS_SCORE}% — sertifikat ochiladi.`],
    ['fa-award', 'Sertifikat oling', 'Ismingizni tekshiring va sertifikatni PDF qilib saqlang yoki chop eting. Sertifikat raqami orqali haqiqiyligini tekshirish mumkin.']
];

export default function HelpPage() {
    const email = process.env.CONTACT_EMAIL;
    return (
        <>
            <PageHero title="Yordam" crumbs={[{ label: 'Yordam' }]} lead="Platformadan foydalanish bo‘yicha qisqa yo‘riqnoma va ko‘p beriladigan savollar." />
            <section className="section">
                <div className="container">
                    <h2 className="upper" style={{ fontSize: 24 }}><i className="fas fa-user-graduate" style={{ color: 'var(--primary)' }} /> Talabalar uchun: 7 qadam</h2>
                    <div className="grid grid-2 mb-3">
                        {STUDENT.map(([i, t, d], k) => (
                            <div key={t} className="card" style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
                                <span className="card-icon"><i className={`fas ${i}`} /></span>
                                <div><span className="num-badge">{k + 1}-qadam</span><h3 style={{ fontSize: 18, margin: '2px 0 4px' }}>{t}</h3><p className="desc small mb-0">{d}</p></div>
                            </div>
                        ))}
                    </div>
                    <div className="hint"><i className="fas fa-lightbulb" /><div><b>Eng oddiy yo‘l:</b> “Mening sahifam”dagi ko‘k blokda doim <b>keyingi qadam</b> ko‘rsatiladi. Shu tugmani bosib borsangiz, kursni boshidan oxirigacha adashmasdan o‘tasiz.</div></div>

                    <h2 className="upper mt-4" style={{ fontSize: 24 }}><i className="fas fa-chalkboard-user" style={{ color: 'var(--primary)' }} /> O‘qituvchilar uchun</h2>
                    <div className="grid grid-3 mb-3">
                        <div className="card"><h3 style={{ fontSize: 18 }}>1. Guruh yarating</h3><p className="desc small mb-0">“O‘qituvchi paneli” → “Yangi guruh”. Tizim 6 belgili kod beradi.</p></div>
                        <div className="card"><h3 style={{ fontSize: 18 }}>2. Kodni ulashing</h3><p className="desc small mb-0">Talabalar ro‘yxatdan o‘tishda yoki “Profil”da kodni kiritadi. Tayyor havolani ham nusxalab yuborish mumkin.</p></div>
                        <div className="card"><h3 style={{ fontSize: 18 }}>3. Natijalarni kuzating</h3><p className="desc small mb-0">Guruh jadvalida har bir talabaning darslari, testlari, mashqlari va diagnostikasi ko‘rinadi; CSV’ga yuklab olish mumkin.</p></div>
                    </div>
                    <p className="small muted">O‘qituvchi huquqini administrator beradi. Agar sizda “O‘qituvchi paneli” ko‘rinmasa, administratorga murojaat qiling.</p>

                    <div className="grid grid-2 mt-4" style={{ gap: 36, alignItems: 'start' }}>
                        <div>
                            <h2 className="upper" style={{ fontSize: 24 }}>Ko‘p beriladigan savollar</h2>
                            {FAQ.map((f, i) => <details key={i} className="acc" open={i === 0}><summary>{f.q}</summary><div className="acc-body">{f.a}</div></details>)}
                        </div>
                        <div className="card" id="contact" style={{ scrollMarginTop: 100 }}>
                            <h2 className="upper" style={{ fontSize: 22 }}>Bog‘lanish</h2>
                            <div className="req"><i className="fas fa-building-columns" style={{ color: 'var(--primary)' }} />{SITE.org}</div>
                            <div className="req"><i className="fas fa-users" style={{ color: 'var(--primary)' }} />{SITE.dept}</div>
                            <div className="req"><i className="fas fa-user-pen" style={{ color: 'var(--primary)' }} />{SITE.author}</div>
                            {email
                                ? <a className="btn btn-primary mt-2" href={`mailto:${email}`}><i className="fas fa-envelope" />{email}</a>
                                : <p className="small muted mt-2 mb-0">Savollar bo‘yicha o‘qituvchingizga murojaat qiling.</p>}
                            <div className="mt-3"><Link href="/register" className="link-arrow">Hali ro‘yxatdan o‘tmaganmisiz? <i className="fas fa-arrow-right" /></Link></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
