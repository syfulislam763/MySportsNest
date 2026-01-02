/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        "oswald-bold": ["Oswald-Bold"],
        "oswald-extraLight": ["Oswald-ExtraLight"],
        "oswald-light": [ "Oswald-Light"],
        "oswald-medium": ["Oswald-Medium"],
        "oswald-regular": ["Oswald-Regular"],
        "oswald-semiBold": ["Oswald-SemiBold"]
      }


      
    },
  },
  plugins: [],
};
