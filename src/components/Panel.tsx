'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type PanelLink = { href: string; label: string; icon: string; exact?: boolean };

export function PanelNav({ groups }: { groups: { title: string; links: PanelLink[] }[] }) {
    const path = usePathname() || '';
    return (
        <nav className="panel-side" aria-label="Panel menyusi">
            {groups.map(g => (
                <div key={g.title} style={{ display: 'contents' }}>
                    <h4>{g.title}</h4>
                    {g.links.map(l => {
                        const active = l.exact ? path === l.href : path === l.href || path.startsWith(l.href + '/');
                        return <Link key={l.href} href={l.href} className={active ? 'active' : ''}><i className={`fas ${l.icon}`} />{l.label}</Link>;
                    })}
                </div>
            ))}
        </nav>
    );
}
