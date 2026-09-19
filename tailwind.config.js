/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nasa: {
          dark: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          blue: '#1E40AF',
          cyan: '#06B6D4',
          orange: '#F97316',
          red: '#EF4444',
          flame: '#FF4500'
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
