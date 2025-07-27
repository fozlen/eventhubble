/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#473B73', // Koyu mor/indigo
          light: '#6FB5D3',   // Mavi
          accent: '#EF88AE',  // Pembe
          cream: '#EDE9D8',   // Krem
        },
        background: {
          DEFAULT: '#EDE9D8', // Krem arka plan
          secondary: '#F8F6F0', // Açık krem
        },
        text: {
          DEFAULT: '#473B73', // Koyu mor metin
          secondary: '#6FB5D3', // Mavi metin
          accent: '#EF88AE',  // Pembe metin
        },
        vanilla: '#F5F5DC', // Vanilya rengi
      },
    },
  },
  plugins: [],
} 