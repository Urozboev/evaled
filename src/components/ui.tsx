import type { CSSProperties, ReactNode } from 'react';
import { LEVELS } from '@/lib/content';
import { scoreTone } from '@/lib/grading';

/* Kichik, qayta ishlatiladigan UI bo‘laklari (server va client’da ishlaydi). */

export function NetBg({ seed = 7 }: { seed?: number }) {
    let x = seed;
    const rnd = () => (x = (x * 9301 + 49297) % 233280) / 233280;
    const pts = Array.from({ length: 34 }, () => [rnd() * 1440, rnd() * 600]);
    const lines: ReactNode[] = [];
    const dots: ReactNode[] = [];
    pts.forEach((p, i) => {
        pts.forEach((q, j) => {
            if (j <= i) return;
            const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
            if (d < 230) lines.push(<line key={`l${i}-${j}`} x1={p[0] | 0} y1={p[1] | 0} x2={q[0] | 0} y2={q[1] | 0} stroke="#fff" strokeOpacity={+((1 - d / 230) * .6).toFixed(2)} strokeWidth={1} />);
        });
        dots.push(<circle key={`c${i}`} cx={p[0] | 0} cy={p[1] | 0} r={+(2 + rnd() * 4).toFixed(1)} fill="#fff" fillOpacity={+(.3 + rnd() * .5).toFixed(2)} />);
    });
    return <svg className="hero-net" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{lines}{dots}</svg>;
}

export type Crumb = { label: string; href?: string };

export function PageHero({ title, lead, crumbs = [], children, seed = 3 }: { title: string; lead?: ReactNode; crumbs?: Crumb[]; children?: ReactNode; seed?: number }) {
    return (
        <section className="page-hero">
            <NetBg seed={seed} />
            <div className="container">
                {crumbs.length > 0 && (
                    <nav className="crumbs" aria-label="Yo‘l">
                        <a href="/dashboard" aria-label="Mening sahifam"><i className="fas fa-house" /></a>
                        {crumbs.map((c, i) => (
                            <span key={i} style={{ display: 'contents' }}>
                                <i className="fas fa-chevron-right" />
                                {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
                            </span>
                        ))}
                    </nav>
                )}
                <h1>{title}</h1>
                {lead && <p>{lead}</p>}
                {children}
            </div>
        </section>
    );
}

export function LevelTag({ level }: { level: keyof typeof LEVELS }) {
    const tone = level === 'easy' ? 'green' : level === 'medium' ? 'amber' : 'red';
    return <span className={`tag ${tone}`}><i className="fas fa-signal" />{LEVELS[level]}</span>;
}

export function StatusTag({ done, started }: { done?: boolean; started?: boolean }) {
    if (done) return <span className="tag green"><i className="fas fa-check" />Bajarildi</span>;
    if (started) return <span className="tag amber"><i className="fas fa-spinner" />Jarayonda</span>;
    return <span className="tag gray"><i className="far fa-circle" />Boshlanmagan</span>;
}

export function ScoreTag({ score }: { score?: number | null }) {
    if (score === undefined || score === null) return <span className="muted">—</span>;
    return <span className={`tag ${scoreTone(score)}`}>{score}%</span>;
}

export function Ring({ pct, size = 120, label }: { pct: number; size?: number; label?: string }) {
    const inner = Math.round(size * .78);
    return (
        <div className="ring" style={{ '--p': pct, width: size, height: size } as CSSProperties} role="img" aria-label={`${label || 'Natija'}: ${pct}%`}>
            <div style={{ width: inner, height: inner, fontSize: Math.round(size * .22) }}>{pct}%</div>
        </div>
    );
}

export function Bar({ pct, tone, height }: { pct: number; tone?: 'green'; height?: number }) {
    return <div className={`progress ${tone || ''}`} style={height ? { height } : undefined}><span style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} /></div>;
}

export function Hint({ children }: { children: ReactNode }) {
    return <div className="hint"><i className="fas fa-lightbulb" /><div>{children}</div></div>;
}

export function Alert({ kind = 'info', children }: { kind?: 'info' | 'error' | 'ok'; children: ReactNode }) {
    const icon = kind === 'error' ? 'fa-circle-exclamation' : kind === 'ok' ? 'fa-circle-check' : 'fa-circle-info';
    return <div className={`alert ${kind}`} role={kind === 'error' ? 'alert' : 'status'}><i className={`fas ${icon}`} /><div>{children}</div></div>;
}

export function Empty({ icon = 'fa-inbox', children }: { icon?: string; children: ReactNode }) {
    return <div className="empty"><i className={`fas ${icon}`} />{children}</div>;
}

export function fmtDate(d: Date | string | null | undefined) {
    if (!d) return '—';
    const x = new Date(d);
    return `${String(x.getDate()).padStart(2, '0')}.${String(x.getMonth() + 1).padStart(2, '0')}.${x.getFullYear()}`;
}

export function initials(name: string) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || '?';
}
