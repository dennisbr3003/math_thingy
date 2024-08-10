/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{html,js,ejs}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
        'Atma-Medium': ['Atma-Medium', 'system-ui'],
        'Atma-Regular': ['Atma-Regular', 'system-ui'],
        'PermanentMarker-Regular' : ['PermanentMarker-Regular', 'cursive'],
        'Frijole-Regular': ['Frijole-Regular', 'system-ui'],
        'IndieFlower-Regular' : ['IndieFlower-Regular', 'cursive'],
        'Margarine-Regular' : ['Margarine-Regular', 'sans-serif']
      }
    },
  },
  plugins: [],
}
