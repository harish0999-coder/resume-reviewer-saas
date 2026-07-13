/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f6ff",
          100: "#e0e9ff",
          400: "#6d8bff",
          500: "#4a6bff",
          600: "#3450e0",
          700: "#283db3",
        },
      },
    },
  },
  plugins: [],
};
