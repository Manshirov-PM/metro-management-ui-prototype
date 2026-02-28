import React from 'react';
import { LucideMessageCircle } from 'lucide-react';

export default function GroupOwners({ activePipeline }) {
    // Mock data representing database relationship
    const groups = [
        { name: 'Finance Group', owner: 'Sarah Jenkins', avatar: 'F', pipelines: ['Rokak', 'Budget_Sync'] },
        { name: 'Marketing Group', owner: 'David Miller', avatar: 'M', pipelines: ['Air'] },
        { name: 'Sales Group', owner: 'Amanda Roberts', avatar: 'S', pipelines: ['Navy', 'Lead_Gen_API'] }
    ];

    // Filter groups if they belong to the active pipeline
    const filteredGroups = activePipeline
        ? groups.filter(g => g.pipelines.includes(activePipeline.name))
        : groups;

    return (
        <div className="card col-span-2 mt-8">
            <div className="card-header border-b border-borderC pb-3 mb-4">
                <h3 className="text-lg font-bold">Group Owners ({activePipeline ? activePipeline.name : 'All'})</h3>
            </div>
            <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGroups.map((group, idx) => (
                        <div key={idx} className="bg-bgInput border border-borderC p-4 rounded-xl flex flex-col hover:border-textMuted transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
                                    {group.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm tracking-tight m-0">{group.name}</h4>
                                    <p className="text-xs text-textMuted m-0">Client/Owner: {group.owner}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {group.pipelines.map(p => (
                                    <span key={p} className="bg-primary hover:bg-primaryHover text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider cursor-pointer transition-colors shadow-md">{p}</span>
                                ))}
                            </div>
                            <button className="mt-auto flex items-center justify-center gap-2 bg-transparent border border-borderC text-textMain py-1.5 rounded-md text-xs font-bold hover:bg-bgCard hover:text-white transition-colors">
                                <LucideMessageCircle size={14} /> Send Message
                            </button>
                        </div>
                    ))}
                    {filteredGroups.length === 0 && (
                        <div className="col-span-3 text-center py-8 text-textMuted text-sm font-bold">
                            No Group Owners assigned to this pipeline yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
