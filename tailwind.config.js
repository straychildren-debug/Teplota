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
          DEFAULT: '#f36e21',
          hover: '#d95d18',
          blue: '#00e5ff',
          light: '#FFCC80',
          text: '#e2e8f0',
          muted: '#94a3b8',
          gray: '#1a1b26',
          grayLight: '#2a2c3a',
        },
        dark: {
          bg: '#050508',
          surface: '#1a1b26',
          surfaceLight: '#2a2c3a',
          text: '#e2e8f0',
          muted: '#94a3b8',
          border: '#2C2C2E',
        }
      },
      backgroundImage: {
        'hero-pattern': "url('/assets/hero_engineering.png')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
