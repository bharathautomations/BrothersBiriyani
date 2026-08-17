/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '390px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        brand: {
          gold: '#EAB308',
          'gold-light': '#F59E0B',
          'gold-lighter': '#FDE68A',
          red: '#DC2626',
          'red-dark': '#991B1B',
          green: '#22C55E',
          'green-dark': '#16A34A',
          charcoal: '#1F2937',
          'charcoal-dark': '#111827',
          orange: '#F97316',
          'orange-dark': '#EA580C',
          cream: '#FFFBEB',
          'cream-dark': '#FEF3C7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
