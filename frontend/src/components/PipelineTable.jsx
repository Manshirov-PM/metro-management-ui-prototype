import React from 'react';

export default function PipelineTable({ pipelines }) {
    if (!pipelines || pipelines.length === 0) return <p className="text-textMuted text-sm">No Pipelines Found.</p>;

    return (
        <div className="card col-span-2">
            <div className="card-header">
                <h3>Pipelines & Resources Overview</h3>
            </div>
            <div className="card-body p-0">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-borderC bg-black/20 text-textMuted">
                            <th className="p-3 font-semibold text-xs tracking-wider">Pipeline Name</th>
                            <th className="p-3 font-semibold text-xs tracking-wider">Status</th>
                            <th className="p-3 font-semibold text-xs tracking-wider">Pods Allocated</th>
                            <th className="p-3 font-semibold text-xs tracking-wider">Push Limit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipelines.map(pipe => (
                            <tr key={pipe.id} className="border-b border-borderC hover:bg-white/5 transition-colors">
                                <td className="p-3 text-textMain font-bold">{pipe.name}</td>
                                <td className="p-3"><span className="badge-status online">Running</span></td>
                                <td className="p-3 text-textMuted">{pipe.pods?.length || 0}</td>
                                <td className="p-3 text-success font-bold">{pipe.pushLimit} rq/s</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
