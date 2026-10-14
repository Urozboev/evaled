import Link from 'next/link';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { exercises, lessons } from '@/db/schema';
import { EXERCISE_TYPES } from '@/lib/content';
import { LevelTag } from '@/components/ui';

export const metadata = { title: 'Mashqlar — boshqaruv' };

export default async function AdminExercises() {
    const db = await getDb();
    const list = await db.select({ e: exercises, lesson: lessons.title }).from(exercises).leftJoin(lessons, eq(lessons.id, exercises.lessonId)).orderBy(asc(exercises.position), asc(exercises.id));
    return (
        <>
            <div className="panel-head">
                <div><h1>Mashqlar</h1><p>Tasniflash, moslashtirish, tartiblash, vaziyat tahlili va teskari aloqa mashqlari</p></div>
                <Link href="/admin/exercises/new" className="btn btn-primary"><i className="fas fa-plus" />Yangi mashq</Link>
            </div>
            <div className="table-card">
                <table className="data-table">
                    <thead><tr><th>#</th><th>Mashq</th><th>Turi</th><th>Dars</th><th>Qiyinlik</th><th>Holat</th><th /></tr></thead>
                    <tbody>{list.map(({ e, lesson }) => (
                        <tr key={e.id}>
                            <td className="muted">{e.position}</td>
                            <td><Link href={`/admin/exercises/${e.id}`}><i className={`fas ${e.icon}`} style={{ color: 'var(--primary)', width: 20 }} /> <b>{e.title}</b></Link></td>
                            <td><span className="tag">{EXERCISE_TYPES[e.type]}</span></td>
                            <td className="small">{lesson || '—'}</td>
                            <td><LevelTag level={e.level} /></td>
                            <td>{e.published ? <span className="tag green">E’lon qilingan</span> : <span className="tag gray">Qoralama</span>}</td>
                            <td className="actions"><Link href={`/admin/exercises/${e.id}`} className="icon-action" aria-label="Tahrirlash"><i className="fas fa-pen" /></Link></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </>
    );
}
