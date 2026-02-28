import React, { useState } from 'react';
import { LucideX, LucideInfo, LucideSearch, LucideEdit } from 'lucide-react';
import { createPipeline } from '../../lib/api';

export default function CreatePipelineModal({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    const [isCustomResources, setIsCustomResources] = useState(true);
    const [cpuVal, setCpuVal] = useState(16);
    const [ramVal, setRamVal] = useState(64);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleApply = async () => {
        if (!name) return;
        setLoading(true);
        try {
            await createPipeline({
                name,
                description,
                pushLimit: 10000,
                pullLimit: 50000
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch (e) {
            console.error("Failed to create pipeline", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-bgCard border border-borderC rounded-xl w-full max-w-[900px] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]" onClick={e => e.stopPropagation()}>

                <div className="bg-bgInput px-5 py-4 border-b border-borderC flex items-center justify-between">
                    <h3 className="font-bold m-0 text-lg">Create / Edit Pipeline</h3>
                    <button onClick={onClose} className="text-textMuted hover:text-white transition-colors bg-transparent border-none cursor-pointer"><LucideX size={20} /></button>
                </div>

                <div className="flex flex-col md:flex-row overflow-y-auto w-full">
                    {/* Left Side */}
                    <div className="flex-1 p-6 border-r border-borderC">
                        <div className="mb-4">
                            <label className="font-bold mb-2 block text-sm">Pipeline Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-bgInput border border-borderC text-textMain rounded-md px-3 py-2 outline-none focus:border-primary text-sm" placeholder="e.g. Bronze_to_Silver_ETL" />
                        </div>

                        <div className="mb-4">
                            <label className="font-bold mb-2 block text-sm">Pipeline Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-bgInput border border-borderC text-textMain rounded-md px-3 py-2 outline-none focus:border-primary text-sm" rows="2" placeholder="Describe the pipeline purpose. You can edit this later."></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="font-bold mb-2 block text-sm">Pipeline Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                                    <input type="radio" name="pipe_type" defaultChecked className="accent-primary" /> Stream
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                                    <input type="radio" name="pipe_type" className="accent-primary" /> Batch
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer mt-6 mb-2">
                                <input type="checkbox" checked={isCustomResources} onChange={() => setIsCustomResources(!isCustomResources)} className="w-4 h-4 rounded border-borderC bg-bgInput text-primary accent-primary" />
                                <span className="text-sm font-bold">Configure Custom Resources on Creation</span>
                            </label>
                        </div>

                        {isCustomResources && (
                            <div className="bg-black/20 border border-borderC p-4 rounded-md">
                                <div className="mb-3">
                                    <label className="text-xs text-textMuted mb-2 block font-bold">Global CPU Limits (Cores)</label>
                                    <input type="range" min="1" max="64" value={cpuVal} onChange={e => setCpuVal(e.target.value)} className="w-full accent-primary h-1.5 bg-borderC rounded-lg appearance-none cursor-pointer" />
                                    <div className="text-right text-sm font-bold mt-1 text-primary">{cpuVal} Cores</div>
                                </div>
                                <div>
                                    <label className="text-xs text-textMuted mb-2 block font-bold">Global RAM Limits (GB)</label>
                                    <input type="range" min="2" max="256" value={ramVal} onChange={e => setRamVal(e.target.value)} className="w-full accent-primary h-1.5 bg-borderC rounded-lg appearance-none cursor-pointer" />
                                    <div className="text-right text-sm font-bold mt-1 text-primary">{ramVal} GB</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex-1 p-6 bg-black/15">
                        <h4 className="font-bold text-sm mb-3">Assigned Group Properties</h4>

                        <div className="relative mb-3">
                            <LucideSearch className="absolute left-3 top-2.5 text-textMuted" size={16} />
                            <input type="text" className="w-full bg-bgInput border border-borderC text-textMain rounded-md pl-9 pr-3 py-2 outline-none focus:border-primary text-sm" placeholder="Search group properties..." />
                        </div>

                        <div className="border border-borderC rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-textMuted uppercase bg-bgCard border-b border-borderC">
                                    <tr>
                                        <th className="px-4 py-2 font-bold">Group</th>
                                        <th className="px-4 py-2 font-bold">Push Limit</th>
                                        <th className="px-4 py-2 font-bold">Pull Limit</th>
                                        <th className="px-4 py-2 font-bold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-bgInput border-b border-borderC/50">
                                        <td className="px-4 py-3"><span className="border border-textMuted px-2 py-1 rounded inline-block text-xs font-bold text-textMuted">Marketing</span></td>
                                        <td className="px-4 py-3 font-bold text-xs">10K/s</td>
                                        <td className="px-4 py-3 font-bold text-xs">50K/s</td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-textMuted hover:text-primary transition-colors"><LucideEdit size={16} /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-textMuted mt-3">
                            <LucideInfo size={14} className="text-primary" /> You can edit these properties after adding a group.
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-borderC bg-bgInput flex justify-end gap-3 shrink-0">
                    <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn btn-primary min-w-[124px]" onClick={handleApply} disabled={loading || !name}>
                        {loading ? 'Saving...' : 'Save Pipeline'}
                    </button>
                </div>

            </div>
        </div>
    );
}
