/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Cormorant Garamond"', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        body: ['"Lato"', 'sans-serif'],
      },
      colors: {
        blush: { 50: '#fff0f3', 100: '#ffe0e9', 200: '#ffc8d9', 300: '#ffa0be', 400: '#ff6b99', 500: '#f53d75', 600: '#e2175a', 700: '#be1049', 800: '#9d1041', 900: '#870f3c' },
        rose: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337' },
        sakura: '#ffb7c5',
        petal: '#ffd0dd',
        mist: 'rgba(255,183,197,0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'petal-fall': 'petalFall linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'typewriter': 'typewriter 3s steps(40) 1s forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        petalFall: { '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0' }, '10%': { opacity: '1' }, '90%': { opacity: '0.8' }, '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 20px rgba(255,183,197,0.3)' }, '50%': { boxShadow: '0 0 60px rgba(255,183,197,0.8), 0 0 100px rgba(244,63,94,0.3)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
