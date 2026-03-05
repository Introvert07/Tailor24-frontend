/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#C9972A',
          600: '#b07d1c',
          700: '#92600e',
          800: '#78500c',
          900: '#633f0a',
        },
        rouge: {
          50:  '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d0d7',
          300: '#f3a8b5',
          400: '#eb7588',
          500: '#dc3d58',
          600: '#c02040',
          700: '#8B1A35',
          800: '#7a1830',
          900: '#5c1226',
          950: '#3a0a18',
        },
        cream: {
          50:  '#FDFAF5',
          100: '#F9F3E8',
          200: '#F3E9D2',
          300: '#EBDAB9',
          400: '#DFC89E',
        },
        charcoal: '#1C1917',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-pattern.svg')",
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float':   'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
