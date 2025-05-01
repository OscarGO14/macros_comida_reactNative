/* eslint-disable */

const { MyColors } = require('@/types/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          black: MyColors.BLACK,
          white: MyColors.WHITE,
          yellow: MyColors.YELLOW,
        },
      },
    },
  },
  plugins: [],
};
