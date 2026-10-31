/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B10',
        coal: '#14141C',
        ash: '#22222E',
        peri: {
          DEFAULT: '#5C6CF2',
          light: '#8E9BFF',
          dark: '#3A47B8',
        },
        bone: '#F4F4F8',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        fang: ['UnifrakturCook', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.07' },
          '50%': { opacity: '0.11' },
        },
        halo: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.04)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        flicker: 'flicker 0.35s steps(2) infinite',
        halo: 'halo 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
