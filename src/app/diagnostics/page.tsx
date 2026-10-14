import { requireUser } from '@/lib/auth';
import { getProgress } from '@/lib/progress';
import { PageHero } from '@/components/ui';
import { DiagnosticClient } from '@/components/DiagnosticClient';

export const metadata = { title: 'Kompetensiya diagnostikasi' };

export default async function DiagnosticsPage({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
    const user = await requireUser('/diagnostics');
    const { stage } = await searchParams;
    const p = await getProgress(user.id);
    const initialStage = stage === 'post' || stage === 'pre' ? stage : p.diag.pre ? 'post' : 'pre';
    const ser = (d?: { result: Record<string, number>; values: number[]; at: Date }) => (d ? { result: d.result, values: d.values, at: d.at.toISOString() } : null);
    return (
        <>
            <PageHero title="Kompetensiya diagnostikasi" crumbs={[{ label: 'Testlar', href: '/tests' }, { label: 'Diagnostika' }]}
                lead="Baholash kompetensiyasining motivatsion-qadriyat, kognitiv-faollik, amaliy-metodik va refleksiv-baholash komponentlari bo‘yicha o‘z-o‘zini baholash so‘rovnomasi." />
            <section className="section">
                <div className="container">
                    <DiagnosticClient initialStage={initialStage} pre={ser(p.diag.pre)} post={ser(p.diag.post)} />
                </div>
            </section>
        </>
    );
}
