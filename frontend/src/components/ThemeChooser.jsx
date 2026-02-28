import React from 'react';

export default function ThemeChooser() {
    const handleThemeChange = (primary, primaryHover, bgMain, bgCard, bgInput, borderC) => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', primary);
        root.style.setProperty('--color-primaryHover', primaryHover);
        root.style.setProperty('--color-bgMain', bgMain);
        root.style.setProperty('--color-bgCard', bgCard);
        root.style.setProperty('--color-bgInput', bgInput);
        root.style.setProperty('--color-borderC', borderC);
    };

    return (
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-borderC">
            <span className="text-xs text-textMuted font-bold mr-1">Theme:</span>
            <button
                onClick={() => handleThemeChange('#8b5cf6', '#7c3aed', '#0a0812', '#161324', '#231f38', '#372f54')}
                className="w-5 h-5 rounded-full bg-[#8b5cf6] border-2 border-transparent hover:scale-125 transition-transform cursor-pointer"
                title="Metro Purple">
            </button>
            <button
                onClick={() => handleThemeChange('#0ea5e9', '#0284c7', '#0f172a', '#1e293b', '#334155', '#475569')}
                className="w-5 h-5 rounded-full bg-[#0ea5e9] border-2 border-transparent hover:scale-125 transition-transform cursor-pointer"
                title="Ocean Blue">
            </button>
            <button
                onClick={() => handleThemeChange('#10b981', '#059669', '#022c22', '#064e3b', '#065f46', '#047857')}
                className="w-5 h-5 rounded-full bg-[#10b981] border-2 border-transparent hover:scale-125 transition-transform cursor-pointer"
                title="Emerald Green">
            </button>
            <button
                onClick={() => handleThemeChange('#f43f5e', '#e11d48', '#2a0a18', '#4c1130', '#63173e', '#831843')}
                className="w-5 h-5 rounded-full bg-[#f43f5e] border-2 border-transparent hover:scale-125 transition-transform cursor-pointer"
                title="Crimson Rose">
            </button>
        </div>
    );
}
