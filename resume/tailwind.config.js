/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        resumebg: "#0a0e1a",
        resumecard: "#0f1524",
        resumepanel: "#111827",
        accent: "#7c5cff",
        accent2: "#4f8cff",
        accentgreen: "#22c55e",
      },
    },
  },
  plugins: [],
};
