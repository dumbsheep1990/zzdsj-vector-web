/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 你可以在这里添加自定义颜色
      },
      animation: {
        'in': 'in 0.3s ease-out',
        'out': 'out 0.3s ease-in',
      },
      keyframes: {
        in: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        out: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}
