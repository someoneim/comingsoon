/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            transitionTimingFunction: {
                'apple-ease': 'cubic-bezier(0.25, 1, 0.5, 1)',
                'spring-bouncy': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            animation: {
                'fade-in': 'fadeIn 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                'fade-in-up': 'fadeInUp 1.0s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                'scale-in': 'scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px) scale(0.98)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            },
        },
    },
    plugins: [],
}
