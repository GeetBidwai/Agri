/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50:  "#EAF3DE",
          100: "#C0DD97",
          200: "#97C459",
          400: "#639922",
          600: "#3B6D11",
          800: "#27500A",
        },
        amber: {
          100: "#FAC775",
          400: "#BA7517",
        },
        teal: {
          400: "#1D9E75",
          600: "#0F6E56",
        },
        gray: {
          50:  "#F7F6F2",
          400: "#888780",
          600: "#5F5E5A",
        },
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
}