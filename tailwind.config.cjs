/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,json}'],
	safelist: [],
	theme: {
		screens: {
			'laptop': { max: '1316px' },
			'mobile': { max: '600px' },
		},
		extend: {},
	},
	plugins: [],
}
