import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { simulators } from '@/db/schema';
import { SimulatorEditor } from '@/components/admin/SimulatorEditor';

export const metadata = { title: 'Simulyatorni tahrirlash' };

export default async function EditSimulator({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isNew = id === 'new';
    const db = await getDb();
    const S = isNew ? null : (await db.select().from(simulators).where(eq(simulators.id, Number(id) || 0)))[0];
    if (!isNew && !S) notFound();
    const maxPos = (await db.select({ p: simulators.position }).from(simulators)).reduce((a, r) => Math.max(a, r.p), 0) + 1;
    return (
        <>
            <div className="panel-head"><div><Link href="/admin/simulators" className="small"><i className="fas fa-arrow-left" /> Simulyatorlar</Link><h1 className="mt-1">{S ? S.title : 'Yangi simulyator'}</h1></div></div>
            <SimulatorEditor id={S?.id ?? null} initial={S ? {
                subject: S.subject, grade: S.grade, icon: S.icon, level: S.level, title: S.title, summary: S.summary, task: S.task, position: S.position, published: S.published, criteria: S.criteria, students: S.students
            } : {
                subject: '', grade: '', icon: 'fa-children', level: 'medium', title: '', summary: '', task: '', position: maxPos, published: false,
                criteria: [{ n: '', d: ['', '', ''] }], students: [{ name: '', color: '#e8590c', work: '', expert: [2], fb: '' }]
            }} />
        </>
    );
}
