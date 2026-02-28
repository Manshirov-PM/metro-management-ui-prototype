import React from 'react';

export default function SlaPerformance() {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="font-bold m-0">SLA & Performance</h3>
            </div>
            <div className="card-body p-0">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-borderC bg-black/20 text-textMuted uppercase text-[10px] tracking-wider font-bold">
                            <th className="p-3">Client / Pipeline</th>
                            <th className="p-3">Avg Flow Time</th>
                            <th className="p-3">Full Flow SLA</th>
                            <th className="p-3">Var</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-borderC hover:bg-white/5 transition-colors">
                            <td className="p-3 leading-tight font-bold text-textMain">Finance<br /><span className="text-textMuted font-normal text-xs">Rokak</span></td>
                            <td className="p-3 text-textMain">14.2s</td>
                            <td className="p-3 text-textMuted">15.0s</td>
                            <td className="p-3 text-success font-bold">-0.8s</td>
                        </tr>
                        <tr className="border-b border-borderC hover:bg-white/5 transition-colors">
                            <td className="p-3 leading-tight font-bold text-textMain">Marketing<br /><span className="text-textMuted font-normal text-xs">Air</span></td>
                            <td className="p-3 text-textMain">2.1s</td>
                            <td className="p-3 text-textMuted">2.0s</td>
                            <td className="p-3 text-warning font-bold">+0.1s</td>
                        </tr>
                        <tr className="border-b border-borderC hover:bg-white/5 transition-colors">
                            <td className="p-3 leading-tight font-bold text-textMain">Sales<br /><span className="text-textMuted font-normal text-xs">Navy</span></td>
                            <td className="p-3 text-danger font-bold">124s</td>
                            <td className="p-3 text-textMuted">60.0s</td>
                            <td className="p-3 text-danger font-bold">+64s</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
