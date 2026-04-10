/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./admin.html",
    "./main.js",
    "./cms.js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#E65100', // Orange primary
          dark: '#BF360C',
          light: '#FFCC80',
          bg: '#F5F5F5',
          text: '#333333',
          gray: '#757575',
          border: '#E0E0E0'
        }
      },
      backgroundImage: {
        'hero-pattern': "url('assets/hero_bg_1775505447491.png')",
        'pipes-pattern': "url('https://placehold.co/800x600/f5f5f5/e0e0e0?text=Pipes+Graphic')",
        'map-bg': "url('https://placehold.co/1920x600/e0e0e0/ffffff?text=Map+Background')"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
