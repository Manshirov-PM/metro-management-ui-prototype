/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bgMain: 'var(--color-bgMain, #0a0812)',
                bgCard: 'var(--color-bgCard, #161324)',
                bgInput: 'var(--color-bgInput, #231f38)',
                borderC: 'var(--color-borderC, #372f54)',
                textMain: '#f8fafc',
                textMuted: '#94a3b8',
                primary: 'var(--color-primary, #8b5cf6)',
                primaryHover: 'var(--color-primaryHover, #7c3aed)',
                secondary: '#3b82f6',
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                info: '#0ea5e9'
            }
        },
    },
    plugins: [],
}
