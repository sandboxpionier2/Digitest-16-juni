import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kampen: {
          blue: "#1e3a8a",
          "blue-dark": "#1e40af",
          teal: "#0d9488",
          "teal-dark": "#0f766e",
        },
      },
      backgroundImage: {
        "kampen-gradient": "linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)",
        "kampen-hero": "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 45%, #0d9488 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
