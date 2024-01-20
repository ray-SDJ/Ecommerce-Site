/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#f400d9",
          secondary: "#006f00",
          accent: "#5068ff",
          neutral: "#1b1813",
          "base-100": "#2f2433",
          info: "#00daff",
          success: "#6a9f00",
          warning: "#ff9300",
          error: "#ff003e",
          body: {
            "background-color": "#ff9300",
          }
        },
      },
    ],
  },
}

