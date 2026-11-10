/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Hover chỉ bật trên thiết bị có chuột (tránh "hover dính" trên cảm ứng).
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF3FB',
          100: '#DCE6F7',
          200: '#B9CCEE',
          300: '#8CA9DD',
          400: '#5B80C6',
          500: '#2F5CA8',
          600: '#1F4A96',
          700: '#173A7A',
          800: '#0F2A5E',
          900: '#0A1F44',
          950: '#06142D',
        },
        gold: {
          50: '#FDF9EC',
          100: '#FAF1D6',
          200: '#F3E1AE',
          300: '#E8C77A',
          400: '#D9AE4A',
          500: '#C9972B',
          600: '#A87B1D',
          700: '#85600F',
          800: '#5E440B',
        },
        ivory: '#FBF8F1',
        ink: '#161B26',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Anton', '"Noto Sans KR"', 'Impact', '"Arial Narrow Bold"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,31,68,.06), 0 8px 24px -12px rgba(10,31,68,.18)',
        lift: '0 2px 4px rgba(10,31,68,.08), 0 18px 40px -18px rgba(10,31,68,.35)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 48s linear infinite',
      },
    },
  },
  plugins: [],
}
