import type { PanelLink } from '@/components/Panel';

export function panelGroups(role: 'student' | 'teacher' | 'admin') {
    const teacher: PanelLink[] = [
        { href: '/teacher', label: 'Guruhlarim', icon: 'fa-users', exact: true }
    ];
    const admin: PanelLink[] = [
        { href: '/admin', label: 'Umumiy ko‘rinish', icon: 'fa-gauge', exact: true },
        { href: '/admin/users', label: 'Foydalanuvchilar', icon: 'fa-user-group' },
        { href: '/admin/lessons', label: 'Darslar va testlar', icon: 'fa-book-open' },
        { href: '/admin/exercises', label: 'Mashqlar', icon: 'fa-puzzle-piece' },
        { href: '/admin/simulators', label: 'Simulyatorlar', icon: 'fa-children' },
        { href: '/admin/tools', label: 'Raqamli vositalar', icon: 'fa-laptop-code' },
        { href: '/admin/glossary', label: 'Glossariy', icon: 'fa-book' }
    ];
    const groups = [{ title: 'O‘qituvchi', links: teacher }];
    if (role === 'admin') groups.push({ title: 'Boshqaruv', links: admin });
    groups.push({ title: 'Sayt', links: [{ href: '/dashboard', label: 'Saytga qaytish', icon: 'fa-arrow-left', exact: true }] });
    return groups;
}
