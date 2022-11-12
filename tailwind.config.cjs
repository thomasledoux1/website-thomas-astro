const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{astro,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,astro}',
    './src/components/**/*.{js,ts,jsx,tsx,astro}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '12rem',
      },
    },
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
      inset: {
        timelineCircle: 'calc(50% - 0.5em)',
      },
      boxShadow: {
        case: '0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24)',
        'case-hover': '0 10px 28px rgba(0,0,0,.25), 0 8px 10px rgba(0,0,0,.22)',
      },
      rotate: {
        135: '135deg',
        '-135': '-135deg',
      },
      zIndex: {
        '-1': '-1',
      },
      fontFamily: {
        heading: ['Inter', ...defaultTheme.fontFamily.sans],
        body: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
