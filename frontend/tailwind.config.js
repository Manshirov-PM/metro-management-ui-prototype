/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bgMain: 'rgb(var(--color-bgMain, 10 8 18) / <alpha-value>)',
                bgCard: 'rgb(var(--color-bgCard, 22 19 36) / <alpha-value>)',
                bgInput: 'rgb(var(--color-bgInput, 35 31 56) / <alpha-value>)',
                borderC: 'rgb(var(--color-borderC, 55 47 84) / <alpha-value>)',
                textMain: '#f8fafc',
                textMuted: '#94a3b8',
                primary: 'rgb(var(--color-primary, 139 92 246) / <alpha-value>)',
                primaryHover: 'rgb(var(--color-primaryHover, 124 58 237) / <alpha-value>)',
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
