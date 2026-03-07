/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:    { 500: '#C9972A', 600: '#b07d1c' },
        rouge:   { 700: '#8B1A35', 800: '#7a1830' },
        cream:   { 50: '#FDFAF5', 300: '#EBDAB9', 400: '#DFC89E' },
        charcoal:'#1C1917',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: { shimmer: 'shimmer 1.5s linear infinite' },
    },
  },
  plugins: [],
};