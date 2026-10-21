/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spike: {
          yellow: '#FFD500',
          magenta: '#E3008C',
          purple: '#7B2CBF',
          cyan: '#00A8E8',
          blue: '#0077B6',
          orange: '#FF7900',
          green: '#2EC4B6'
        }
      }
    },
  },
  plugins: [],
}
