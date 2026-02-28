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
                onClick={() => handleThemeChange('139 92 246', '124 58 237', '10 8 18', '22 19 36', '35 31 56', '55 47 84')}
                className="w-5 h-5 rounded-full bg-[#8b5cf6] border-2 border-transparent hover:scale-125 transition-transform cursor-pointer"
                title="Metro Purple">
            </button>
            <button
                onClick={() => handleThemeChange('14 165 233', '2 132 199', '15 23 42', '30 41 59', '51 65 85', '71 85 105')}
                className="w-5 h-5 rounded-full bg-[#0ea5e9] border-2 border-transparent hover:scale-125 transition-transform cursor-pointer"
                title="Ocean Blue">
            </button>
            <button
                onClick={() => handleThemeChange('16 185 129', '5 150 105', '2 44 34', '6 78 59', '6 95 70', '4 120 87')}
                className="w-5 h-5 rounded-full bg-[#10b981] border-2 border-transparent hover:scale-125 transition-transform cursor-pointer"
                title="Emerald Green">
            </button>
            <button
                onClick={() => handleThemeChange('244 63 94', '225 29 72', '42 10 24', '76 17 48', '99 23 62', '131 24 67')}
                className="w-5 h-5 rounded-full bg-[#f43f5e] border-2 border-transparent hover:scale-125 transition-transform cursor-pointer"
                title="Crimson Rose">
            </button>
        </div>
    );
}
