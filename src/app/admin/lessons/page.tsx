import Link from 'next/link';
import { asc, count, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { lessons, questions } from '@/db/schema';

export const metadata = { title: 'Darslar — boshqaruv' };

export default async function AdminLessons() {
    const db = await getDb();
    const [list, qc] = await Promise.all([
        db.select().from(lessons).orderBy(asc(lessons.position), asc(lessons.id)),
        db.select({ lessonId: questions.lessonId, c: count() }).from(questions).groupBy(questions.lessonId)
    ]);
    return (
        <>
            <div className="panel-head">
                <div><h1>Darslar va testlar</h1><p>Dars matni, maqsadlar, video/PDF va mavzu testi savollari</p></div>
                <Link href="/admin/lessons/new" className="btn btn-primary"><i className="fas fa-plus" />Yangi dars</Link>
            </div>
            <div className="table-card">
                <table className="data-table">
                    <thead><tr><th>#</th><th>Dars</th><th>Bob</th><th>Savollar</th><th>Holat</th><th /></tr></thead>
                    <tbody>
                        {list.map(l => {
                            const n = Number(qc.find(q => q.lessonId === l.id)?.c || 0);
                            return (
                                <tr key={l.id}>
                                    <td className="muted">{l.position}</td>
                                    <td><Link href={`/admin/lessons/${l.id}`}><i className={`fas ${l.icon}`} style={{ color: 'var(--primary)', width: 20 }} /> <b>{l.title}</b></Link></td>
                                    <td className="small">{l.chapter}</td>
                                    <td>{n < 4 ? <span className="tag amber">{n} ta</span> : <span className="tag">{n} ta</span>}</td>
                                    <td>{l.published ? <span className="tag green">E’lon qilingan</span> : <span className="tag gray">Qoralama</span>}</td>
                                    <td className="actions"><Link href={`/admin/lessons/${l.id}`} className="icon-action" aria-label="Tahrirlash"><i className="fas fa-pen" /></Link></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="small muted mt-2">Har bir mavzu testi uchun kamida 6 ta savol tavsiya etiladi (testda tasodifiy tartibda, ko‘pi bilan 10 tasi beriladi). Yakuniy test barcha e’lon qilingan darslar savollaridan tuziladi.</p>
        </>
    );
}
