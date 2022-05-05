module.exports = {
  important: true,
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
    // ...
  ],
  variants: {
    scrollbar: ["rounded"],
  },
}
