/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#19b184',
          50: '#ecfdf7',
          100: '#d1faea',
          200: '#a6f4d7',
          300: '#6ee7c1',
          400: '#19b184',
          500: '#19b184',
          600: '#088266',
          700: '#0a6954',
          800: '#0c5444',
          900: '#0b4539',
        },
      },
    },
  },
  plugins: [],
};