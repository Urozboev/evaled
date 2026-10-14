import { requireRole } from '@/lib/auth';
import { panelGroups } from '@/lib/panel-links';
import { PanelNav } from '@/components/Panel';

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
    const me = await requireRole(['teacher', 'admin'], '/teacher');
    return (
        <div className="panel">
            <PanelNav groups={panelGroups(me.role)} />
            <div className="panel-main">{children}</div>
        </div>
    );
}
