import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <--- Isso aqui é o mais importante
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          light: '#FFEDD5',
          DEFAULT: '#F97316',
          dark: '#C2410C',
        },
        background: '#FAFAFA',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
};
export default config;