import type { Config } from "tailwindcss";

const config = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/streamdown/dist/**/*.js",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;

export default config;
