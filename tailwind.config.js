/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#2F80ED', // adapts to screenshot blue
        offwhite: '#F6F7FB',
        cardWhite: '#FFFFFF',
        inputBorder: '#D1D5DB',
        admin: '#1B4332',
        errorRed: '#FF3B30',
      },
      fontFamily: {
        poppins: ['Poppins_400Regular','Poppins_600SemiBold','Poppins_700Bold'],
      },
      borderRadius: {
        xl: '12px',
        full: '999px'
      },
      boxShadow: {
        soft: '0 6px 20px rgba(47,128,237,0.08)'
      }
    },
  },
  plugins: [],

}