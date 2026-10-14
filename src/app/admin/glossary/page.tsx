import { asc } from 'drizzle-orm';
import { getDb } from '@/db';
import { glossary } from '@/db/schema';
import { GlossaryManager } from '@/components/admin/SimpleManagers';

export const metadata = { title: 'Glossariy — boshqaruv' };

export default async function AdminGlossary() {
    const db = await getDb();
    const list = await db.select().from(glossary).orderBy(asc(glossary.term));
    return (
        <>
            <div className="panel-head"><div><h1>Glossariy</h1><p>{list.length} ta atama · “Resurslar” sahifasida ko‘rinadi</p></div></div>
            <GlossaryManager items={list} />
        </>
    );
}
