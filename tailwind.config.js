const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(200px, 1fr))',
      },
      height: {
        '50vw': '50vw'
      }
    },
    fontFamily: {
      'sans': ['Oswald'],
    },
    colors: {
      black: '#111111',
      white: colors.white,
    }
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
