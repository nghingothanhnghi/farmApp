export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
      },
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        text: 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'border-default': 'var(--border-default)',
      },
    },
  },
  plugins: [],
}