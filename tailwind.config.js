module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './app/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8',
        secondary: '#9333ea',
      },
    },
  },
  plugins: [],
  safelist: [
    'shadow-custom-initial',
    'shadow-custom'
  ],
};