/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-teal': '#17B3C1',
        'light-mint': '#D9FFE8',
        'accent-green': '#58D0B5',
        'off-white': '#F4FFF8',
      },
      fontFamily: {
        'heading': ['Coiny', 'cursive'],
        'body': ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


