module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
      },
      height: {
        480: '480px',
        250: '250px',
        380: '380px',
        550: '550px',
        '2rem': '2rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },
      maxHeight: {
        modal: 'calc(100vh - 4rem)',
      },
      width: {
        300: '300px',
        360: '360px',
      },
      colors: {
        grayish: '#F3F6FA',
        blueish: '#3EACDB',
        blackish: '#333333',
        deepblue: '#1455B6',
        itemgray: '#E5E4E4',
        itemname: '#4F4F4F',
        itemlabel: '#979797',
        categoryBg: '#F4F6FB',
        thingray: '#777777',
        darkblueish: '#1455B6',
      },
      zIndex: {
        1: '1',
      },
    },
  },
  variants: {},
  plugins: [],
};
