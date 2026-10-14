import { asc } from 'drizzle-orm';
import { getDb } from '@/db';
import { tools } from '@/db/schema';
import { ToolsManager } from '@/components/admin/SimpleManagers';

export const metadata = { title: 'Vositalar — boshqaruv' };

export default async function AdminTools() {
    const db = await getDb();
    const list = await db.select().from(tools).orderBy(asc(tools.position), asc(tools.id));
    return (
        <>
            <div className="panel-head"><div><h1>Raqamli vositalar</h1><p>“Vositalar” sahifasidagi kartochkalar</p></div></div>
            <ToolsManager items={list} />
        </>
    );
}
