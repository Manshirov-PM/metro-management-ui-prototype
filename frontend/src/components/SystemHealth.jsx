import React from 'react';
import { LucideActivity, LucideCheckCircle, LucideAlertTriangle, LucideServer } from 'lucide-react';

export default function SystemHealth() {
    return (
        <div className="mb-4 flex items-center gap-5 bg-black/25 px-5 py-4 rounded-md border border-borderC">
            <strong className="text-primary flex items-center gap-2">
                <LucideActivity size={18} /> System Health
            </strong>

            <div className="flex items-center gap-2">
                <div className="badge-status online flex items-center gap-1.5 bg-success/10 text-success px-2 py-1 rounded text-xs font-bold border border-success/20">
                    <LucideCheckCircle size={14} /> Schema Registry
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="badge-status warning flex items-center gap-1.5 bg-warning/10 text-warning px-2 py-1 rounded text-xs font-bold border border-warning/20">
                    <LucideAlertTriangle size={14} /> Kafka Lag: 4,020 msg
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="badge-status online flex items-center gap-1.5 bg-success/10 text-success px-2 py-1 rounded text-xs font-bold border border-success/20">
                    <LucideCheckCircle size={14} /> PG Connections: 142/400
                    <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden ml-2">
                        <div className="h-full bg-success" style={{ width: '35.5%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
