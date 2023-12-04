import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		screens: {
			lg: { min: "901px" },
			sm: { max: "900px" },
		},
		fontFamily: {
			HelveticaBold: ["HelveticaBold"],
			Helvetica: ["Helvetica"],
			HelveticaNowDisplayXBlk: ["HelveticaNowDisplayXBlk"],
			LeagueSpartan: ["LeagueSpartan"],
			LeagueSpartanBold: ["LeagueSpartanBold"],
			LeagueSpartanBlack: ["LeagueSpartanBlack"]
		}
	},
	plugins: [],
} satisfies Config;
