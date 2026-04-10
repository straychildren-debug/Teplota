/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./main.js",
    "./cms.js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#E65100',
          dark: '#BF360C',
          light: '#FFCC80',
          bg: '#F5F5F5',
          text: '#333333',
          gray: '#757575',
          border: '#E0E0E0'
        },
        dark: {
          bg: '#111111',
          surface: '#1C1C1E',
          text: '#D1D1D1',
          muted: '#8A8A8E',
          border: '#2C2C2E',
        }
      },
      backgroundImage: {
        'hero-pattern': "url('assets/hero_bg_1775505447491.png')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
