/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,json}'],
	safelist: [],
	theme: {
		screens: {
			'desktop': { max: '1728px' },
			'tablet': { max: '768px' },
			'mobile': { max: '375px' },
		},
		extend: {},
	},
	plugins: [],
}
