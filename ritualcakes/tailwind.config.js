
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      fontFamily: {
        dosis: ['Dosis', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },

      colors: { 
        customGray: 'rgb(77, 77, 77)',
        darkcustomGray: 'rgb(44, 44, 44)',
        darkcustombg:'rgb(255, 228, 208)',
        darkcustombg1:'rgb(72, 37, 11)',
        darkcustombg2:'rgb(255, 192, 143)',
        darkcustombg3:'rgb(255, 170, 105)',
       },

    },
  },
  plugins: [],
}