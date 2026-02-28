import React, { useState, useEffect } from 'react';
import { LucideX } from 'lucide-react';
import { assignGroupToPipeline } from '../../lib/api';

export default function AddClientModal({ isOpen, onClose, pipelines, onSuccess }) {
    if (!isOpen) return null;

    const [selectedPipeline, setSelectedPipeline] = useState('');
    const [selectedGroups, setSelectedGroups] = useState(['Marketing']);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pipelines && pipelines.length > 0 && !selectedPipeline) {
            setSelectedPipeline(pipelines[0].id);
        }
    }, [pipelines, selectedPipeline]);

    const availableGroups = ['Finance', 'Sales', 'Data_Scientists'];

    const handleApply = async () => {
        if (!selectedPipeline || selectedGroups.length === 0) return;
        setLoading(true);
        try {
            // Run all group assignments concurrently
            await Promise.all(
                selectedGroups.map(group =>
                    assignGroupToPipeline(selectedPipeline, { groupName: group, ownerName: "API Assigned Owner" })
                )
            );
            if (onSuccess) onSuccess();
            onClose();
        } catch (e) {
            console.error("Failed to assign groups", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={onClose}>
            <div className="bg-bgCard border border-borderC rounded-xl w-full max-w-[500px] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

                <div className="bg-bgInput px-5 py-4 border-b border-borderC flex items-center justify-between">
                    <h3 className="font-bold m-0 text-lg">Assign Group to Pipeline</h3>
                    <button onClick={onClose} className="text-textMuted hover:text-white transition-colors bg-transparent border-none cursor-pointer"><LucideX size={20} /></button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label className="font-bold mb-2 block text-sm">Select Pipeline</label>
                        <select
                            className="w-full bg-bgInput border border-borderC text-textMain rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={selectedPipeline}
                            onChange={(e) => setSelectedPipeline(e.target.value)}
                        >
                            {pipelines?.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="font-bold mb-2 block text-sm">Select Groups (Multi-select)</label>
                        <div className="border border-borderC rounded-md p-2 bg-black/10">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedGroups.map(group => (
                                    <div key={group} className="bg-primary px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold text-white shadow-md">
                                        {group}
                                        <button className="hover:text-black/50" onClick={() => setSelectedGroups(selectedGroups.filter(g => g !== group))}><LucideX size={14} /></button>
                                    </div>
                                ))}
                            </div>
                            <select
                                className="w-full bg-bgInput border-none text-textMain rounded-md px-2 py-1 outline-none text-sm"
                                onChange={(e) => {
                                    if (e.target.value && !selectedGroups.includes(e.target.value)) {
                                        setSelectedGroups([...selectedGroups, e.target.value]);
                                    }
                                    e.target.value = "";
                                }}
                            >
                                <option value="">+ Add Group from DB...</option>
                                {availableGroups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-borderC bg-bgInput flex justify-end gap-3">
                    <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn btn-primary min-w-[124px]" onClick={handleApply} disabled={loading}>
                        {loading ? 'Adding...' : 'Add to Pipeline'}
                    </button>
                </div>

            </div>
        </div>
    );
}
