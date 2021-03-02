module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.vue',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
      },
    },
    extend: {
      minHeight: {
        0: '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%',
        400: '500px',
      },
      zIndex: {
        0: 0,
        1: 1,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
        25: 25,
        75: 75,
        100: 100,
        auto: 'auto',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
