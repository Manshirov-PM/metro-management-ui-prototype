/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bgMain: '#0f111a',
                bgCard: '#1a1d2d',
                bgInput: '#2a2d42',
                borderC: '#3b405e',
                textMain: '#f8fafc',
                textMuted: '#94a3b8',
                primary: '#8b5cf6',
                primaryHover: '#7c3aed',
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
