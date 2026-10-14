import { requireRole } from '@/lib/auth';
import { panelGroups } from '@/lib/panel-links';
import { PanelNav } from '@/components/Panel';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireRole(['admin'], '/admin');
    return (
        <div className="panel">
            <PanelNav groups={panelGroups('admin')} />
            <div className="panel-main">{children}</div>
        </div>
    );
}
