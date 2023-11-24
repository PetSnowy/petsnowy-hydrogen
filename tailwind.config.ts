import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		screens: {
			lg: { min: "900px" },
			sm: { max: "901px" },
		},
	},
	plugins: [],
} satisfies Config;
