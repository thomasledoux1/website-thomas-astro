const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{astro,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,astro}",
    "./src/components/**/*.{js,ts,jsx,tsx,astro}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "3rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "12rem",
      },
    },
    extend: {
      screens: {
        xs: "420px",
        ...defaultTheme.screens,
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
      },
      fontFamily: {
        body: ["Inter", ...defaultTheme.fontFamily.sans],
        heading: ["Cal Sans", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "skeleton-loading": {
          "0%": {
            "background-color": "hsl(200, 20%, 80%)",
          },
          "100%": {
            "background-color": "hsl(200, 20%, 95%)",
          },
        },
      },
      animation: {
        loading: "skeleton-loading 1s linear infinite alternate",
      },
    },
  },
};
