import React, { useState } from 'react';

export default function PodConfigModal({ isOpen, onClose, pod, pipeline, clusterStats }) {
    if (!isOpen || !pod) return null;

    const [cpu, setCpu] = useState(pod.cpuLimit || 2);
    const [mem, setMem] = useState(pod.memLimit || 8);

    const handleApply = () => {
        // Note: Here you would normally dispatch an API call
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={onClose}>
            <div className="bg-bgCard border border-borderC rounded-xl w-full max-w-[600px] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

                <div className="bg-bgInput px-5 py-4 border-b border-borderC flex items-center justify-between">
                    <h3 className="font-bold m-0 text-lg">Configure Pod Resources: <span className="text-primary uppercase">{pod.name}</span></h3>
                    <button onClick={onClose} className="text-textMuted hover:text-white transition-colors bg-transparent border-none cursor-pointer">✕</button>
                </div>

                <div className="p-6">
                    <p className="text-textMuted text-sm mb-4">Scale up or limit resources for this microservice inside the cluster.</p>

                    <div className="flex justify-between mb-4 mt-2 bg-black/15 p-3 rounded-md border-l-4 border-primary">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-textMuted font-bold uppercase">Cluster Capacity</span>
                            <span className="text-sm font-bold"><span className="text-success">{clusterStats.used}</span> / {clusterStats.total} Cores Used</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-xs text-textMuted font-bold uppercase">Pipeline Assignment</span>
                            <span className="text-sm font-bold text-primary">{pipeline?.name || 'Unknown'}</span>
                        </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg">
                        <div className="mb-4">
                            <label className="flex justify-between items-center text-sm text-textMuted mb-2">
                                <span>CPU Cores Allocated</span>
                                <input type="number" className="bg-transparent border-none text-right font-bold text-lg text-textMain outline-none border-b border-dashed border-textMuted w-16"
                                    value={cpu} onChange={e => setCpu(Number(e.target.value))} />
                            </label>
                            <input type="range" min="1" max="32" value={cpu} onChange={e => setCpu(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-borderC accent-primary" />
                        </div>

                        <div>
                            <label className="flex justify-between items-center text-sm text-textMuted mb-2">
                                <span>Memory (GB)</span>
                                <input type="number" className="bg-transparent border-none text-right font-bold text-lg text-textMain outline-none border-b border-dashed border-textMuted w-16"
                                    value={mem} onChange={e => setMem(Number(e.target.value))} />
                            </label>
                            <input type="range" min="1" max="128" step="1" value={mem} onChange={e => setMem(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-borderC accent-primary" />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-borderC bg-bgInput text-primary accent-primary" />
                            <span className="text-sm font-bold">Enable Auto-Scaling</span>
                        </label>
                    </div>
                </div>

                <div className="p-4 border-t border-borderC bg-bgInput flex justify-end gap-3">
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn bg-warning text-black hover:bg-warning/80 shadow-lg shadow-warning/20 font-bold" onClick={handleApply}>🚀 Apply Resources</button>
                </div>
            </div>
        </div>
    );
}
