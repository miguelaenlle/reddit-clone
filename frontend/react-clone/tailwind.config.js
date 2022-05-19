module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {},
    extend: {
      animation: {
        
        fade: "fadeIn 0.3s ease-in-out 1 forwards"
      },
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
