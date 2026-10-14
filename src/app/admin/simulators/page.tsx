import Link from 'next/link';
import { asc } from 'drizzle-orm';
import { getDb } from '@/db';
import { simulators } from '@/db/schema';
import { LevelTag } from '@/components/ui';

export const metadata = { title: 'Simulyatorlar — boshqaruv' };

export default async function AdminSimulators() {
    const db = await getDb();
    const list = await db.select().from(simulators).orderBy(asc(simulators.position), asc(simulators.id));
    return (
        <>
            <div className="panel-head">
                <div><h1>Simulyatorlar</h1><p>Virtual sinf: topshiriq, rubrika, o‘quvchilar ishlari va ekspert baholari</p></div>
                <Link href="/admin/simulators/new" className="btn btn-primary"><i className="fas fa-plus" />Yangi simulyator</Link>
            </div>
            <div className="table-card">
                <table className="data-table">
                    <thead><tr><th>#</th><th>Simulyator</th><th>Fan · sinf</th><th>O‘quvchilar</th><th>Qiyinlik</th><th>Holat</th><th /></tr></thead>
                    <tbody>{list.map(x => (
                        <tr key={x.id}>
                            <td className="muted">{x.position}</td>
                            <td><Link href={`/admin/simulators/${x.id}`}><i className={`fas ${x.icon}`} style={{ color: 'var(--primary)', width: 20 }} /> <b>{x.title}</b></Link></td>
                            <td className="small">{x.subject} · {x.grade}</td>
                            <td>{x.students.length}</td>
                            <td><LevelTag level={x.level} /></td>
                            <td>{x.published ? <span className="tag green">E’lon qilingan</span> : <span className="tag gray">Qoralama</span>}</td>
                            <td className="actions"><Link href={`/admin/simulators/${x.id}`} className="icon-action" aria-label="Tahrirlash"><i className="fas fa-pen" /></Link></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </>
    );
}
