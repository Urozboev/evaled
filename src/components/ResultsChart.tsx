'use client';

import { useState } from 'react';
import { RESEARCH } from '@/lib/content';

const pct = (v: number) => String(v).replace('.', ',') + '%';

function BarRow({ label, d }: { label: string; d: number[] }) {
    return (
        <div className="bar-row">
            <span>{label}</span>
            <div className="bar-track" role="img" aria-label={`${label}: yuqori ${pct(d[0])}, o‘rta ${pct(d[1])}, past ${pct(d[2])}`}>
                <span className="c-high" style={{ width: `${d[0]}%` }} title={`Yuqori ${pct(d[0])}`} />
                <span className="c-mid" style={{ width: `${d[1]}%` }} title={`O‘rta ${pct(d[1])}`} />
                <span className="c-low" style={{ width: `${d[2]}%` }} title={`Past ${pct(d[2])}`} />
            </div>
            <b>{pct(d[0])}</b>
        </div>
    );
}

export function ResultsChart() {
    const [phase, setPhase] = useState<'before' | 'after'>('after');
    const P = RESEARCH.results[phase];
    return (
        <>
            <div className="card mt-4">
                <div className="flex between items-center wrap gap-2 mb-3">
                    <h3 className="upper mb-0" style={{ fontSize: 19 }}>Daraja bo‘yicha taqsimot</h3>
                    <div className="filters mb-0">
                        <button className={`chip ${phase === 'before' ? 'on' : ''}`} onClick={() => setPhase('before')}>Tajriba boshida</button>
                        <button className={`chip ${phase === 'after' ? 'on' : ''}`} onClick={() => setPhase('after')}>Tajriba oxirida</button>
                    </div>
                </div>
                <div className="bars">
                    <BarRow label="Tajriba (218)" d={P.total.exp} />
                    <BarRow label="Nazorat (217)" d={P.total.ctl} />
                    {P.groups.map(g => (
                        <div key={g.uni} style={{ display: 'contents' }}>
                            <BarRow label={`${g.uni} · T`} d={g.exp} />
                            <BarRow label={`${g.uni} · N`} d={g.ctl} />
                        </div>
                    ))}
                </div>
                <div className="legend"><span><i className="c-high" />Yuqori</span><span><i className="c-mid" />O‘rta</span><span><i className="c-low" />Past</span><span>T — tajriba, N — nazorat guruhi</span></div>
            </div>
            <div className="table-wrap mt-3">
                <table className="tbl">
                    <thead><tr><th>OTM</th><th>Guruh</th><th>Talabalar</th><th>Yuqori</th><th>O‘rta</th><th>Past</th></tr></thead>
                    <tbody>
                        {P.groups.flatMap(g => [
                            <tr key={g.uni + 'T'}><td rowSpan={2}><b>{g.uni}</b></td><td>Tajriba</td><td>{g.n[0]}</td><td>{pct(g.exp[0])}</td><td>{pct(g.exp[1])}</td><td>{pct(g.exp[2])}</td></tr>,
                            <tr key={g.uni + 'N'}><td>Nazorat</td><td>{g.n[1]}</td><td>{pct(g.ctl[0])}</td><td>{pct(g.ctl[1])}</td><td>{pct(g.ctl[2])}</td></tr>
                        ])}
                        <tr><td rowSpan={2}><b>Jami</b></td><td><b>Tajriba</b></td><td><b>218</b></td><td><b>{pct(P.total.exp[0])}</b></td><td><b>{pct(P.total.exp[1])}</b></td><td><b>{pct(P.total.exp[2])}</b></td></tr>
                        <tr><td><b>Nazorat</b></td><td><b>217</b></td><td><b>{pct(P.total.ctl[0])}</b></td><td><b>{pct(P.total.ctl[1])}</b></td><td><b>{pct(P.total.ctl[2])}</b></td></tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
