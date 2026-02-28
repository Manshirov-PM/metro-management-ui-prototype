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
                        <tr className="border-b border-borderC bg-black/20 text-textMuted uppercase text-[10px] tracking-wider font-bold">
                            <th className="p-3">Pipeline Name</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Client Group</th>
                            <th className="p-3">Pods Allocated</th>
                            <th className="p-3">CPU (Cores)</th>
                            <th className="p-3">Memory (GB)</th>
                            <th className="p-3">Last Sync</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipelines.map(pipe => {
                            // Calculate hypothetical totals from relation (demo behavior)
                            const groupName = pipe.groups?.[0]?.name || 'Unassigned';
                            const podCount = pipe.pods?.length || 0;
                            const totalCpu = pipe.pods?.reduce((sum, p) => sum + p.cpuLimit, 0) || 0;
                            const totalMem = pipe.pods?.reduce((sum, p) => sum + p.memLimit, 0) || 0;
                            const status = podCount > 0 ? "Running" : "Degraded";
                            const statusColor = podCount > 0 ? "bg-success/10 text-success" : "bg-warning/10 text-warning";

                            return (
                                <tr key={pipe.id} className="border-b border-borderC hover:bg-white/5 transition-colors">
                                    <td className="p-3 text-textMain font-bold">{pipe.name}</td>
                                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor} flex items-center gap-1.5 w-max`}><div className={`w-1.5 h-1.5 rounded-full ${podCount > 0 ? 'bg-success' : 'bg-warning'}`}></div>{status}</span></td>
                                    <td className="p-3 text-textMain text-sm">{groupName}</td>
                                    <td className="p-3 text-textMuted font-bold">{podCount}</td>
                                    <td className="p-3 text-textMain">{totalCpu}</td>
                                    <td className="p-3 text-textMain">{totalMem}</td>
                                    <td className="p-3 text-textMuted text-sm">Just now</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
