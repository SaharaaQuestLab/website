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
		fontSize: {
			h1: ['6.875rem', {
				lineHeight: '6.375rem'
			}],
			h2: ['5.625rem', {
				lineHeight: '5.125rem'
			}],
			h3: ['4.375rem', {
				lineHeight: '4rem'
			}],
			h4: ['2.25rem', {
				lineHeight: '2.25rem'
			}]

		},
		colors: {
			dark: {
				400: '#121315',
				300: '#1B1D1F',
				200: '#242629',
				100: '#404347'
			},
			light: {
				300: '#62666D',
				200: '#979EA8',
				100: '#E1E4E7'
			}
		},
		extend: {},
	},
	plugins: [],
}
