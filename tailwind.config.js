/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d97706',
        secondary: '#b45309',
        accent: '#fbbf24',
        dark: {
          900: '#1c1917', // Stone 950 - Softer than pure black
          800: '#292524', // Stone 800
          700: '#44403c', // Stone 700
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d97706 0%, #fbbf24 50%, #d97706 100%)',
      }
    },
  },
  plugins: [],
}
