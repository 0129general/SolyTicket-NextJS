import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        EventCardShadow: "0px 2px 10px 0px rgba(78, 67, 241, 0.15)",
        defaultShadow: "0px 2px 10px 0px rgba(78, 67, 241, 0.15)",
        NavShadow: "0px 4px 10px 0px rgba(78, 67, 241, 0.1)",
        ProfileShadow: "0px 3px 13px 0px rgba(58, 53, 65, 0.1)",
      },
    },
    colors: {
      primary: "#4E43F1",
      dodgerBlue: "#16A8FF",
      body: {
        DEFAULT: "#323232",
        gray: "#848484",
      },
      heading: "#17161A",
    },
  },
  plugins: [require("flowbite/plugin")],
};
export default config;
