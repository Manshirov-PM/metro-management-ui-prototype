import React from 'react';
import { LucideX } from 'lucide-react';

export default function TeamModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative bg-bgCard rounded-xl shadow-2xl max-w-[800px] w-full" onClick={e => e.stopPropagation()}>

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition-colors border-none cursor-pointer"
                >
                    <LucideX size={18} />
                </button>

                <img
                    src="/team.png"
                    alt="Developer Team"
                    className="w-full block rounded-xl"
                />

            </div>
        </div>
    );
}
