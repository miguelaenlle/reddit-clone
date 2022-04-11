module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {},
    animation: {
      
      fade: "fadeIn 0.3s ease-in-out 1 forwards"
    },
    extend: {
      keyframes: (theme) => ({
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 100 },
        }
      }),
    },
  },
  plugins: [],
};
