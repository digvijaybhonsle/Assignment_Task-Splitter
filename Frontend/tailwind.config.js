/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // if you need custom fonts, add here:
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          light: '#D6BCFA',
          DEFAULT: '#9F7AEA',
          dark: '#6B46C1',
        },
      },
    },
  },
  plugins: [],
};
