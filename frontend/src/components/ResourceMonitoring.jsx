import React from 'react';
import { LucideRefreshCw, LucideAlertTriangle } from 'lucide-react';

export default function ResourceMonitoring({ onScaleUp }) {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="font-bold m-0">Resource Monitoring</h3>
                <button className="text-textMuted hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center">
                    <LucideRefreshCw size={14} />
                </button>
            </div>
            <div className="card-body flex flex-col gap-4">

                {/* Pod 1 */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">Pod-Alpha-01 (Rokak)</span>
                        <span className="text-warning font-bold">85% Utilized</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-warning" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-textMuted font-medium">Memory hitting threshold</span>
                        <button
                            onClick={() => onScaleUp && onScaleUp({ id: 'Pod-Alpha-01', label: 'Pod-Alpha-01', type: 'metro-service' })}
                            className="bg-primary/20 hover:bg-primary/40 text-primary px-3 py-1 rounded text-xs font-bold transition-colors border-none cursor-pointer"
                        >
                            Scale Up
                        </button>
                    </div>
                </div>

                {/* Pod 2 */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">Pod-Beta-04 (Air)</span>
                        <span className="text-danger font-bold">98% Utilized</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-danger" style={{ width: '98%' }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-danger flex items-center gap-1 font-bold">
                            <LucideAlertTriangle size={12} /> High CPU Usage
                        </span>
                        <button
                            onClick={() => onScaleUp && onScaleUp({ id: 'Pod-Beta-04', label: 'Pod-Beta-04', type: 'metro-service' })}
                            className="bg-primary/20 hover:bg-primary/40 text-primary px-3 py-1 rounded text-xs font-bold transition-colors border-none cursor-pointer"
                        >
                            Scale Up
                        </button>
                    </div>
                </div>

                {/* Pod 3 */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">Pod-Gamma-02 (Navy)</span>
                        <span className="text-success font-bold">42% Utilized</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: '42%' }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-textMuted font-medium">Stable</span>
                        <button
                            disabled
                            className="bg-bgInput/50 text-textMuted px-3 py-1 rounded text-xs font-bold border-none cursor-not-allowed"
                        >
                            Scale Up
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
