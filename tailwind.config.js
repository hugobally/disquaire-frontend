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
      },
      width: {
        '450px': '450px'
      }
    },
    fontFamily: {
      'sans': ['Oswald'],
    },
    colors: {
      black: '#111111',
      white: colors.white,
      gray: colors.neutral
    }
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
