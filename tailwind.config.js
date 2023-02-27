/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/app/**/*.ts", "./src/app/**/*.html"],
  theme: {
    extend: {
      zIndex: {
        100: "100",
        1000: "1000",
        10000: "10000",
        100000: "100000",
      },
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
