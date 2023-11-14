/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/tailwind/native");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.js"],
  theme: {
    extend: {},
  },
  plugins: [nativewind()],
};
