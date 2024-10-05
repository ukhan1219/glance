import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/**/*.tsx", 
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        'site-background': '#292464',
        'site-foreground': '#2e3058',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
  }),
  ],
} satisfies Config;
