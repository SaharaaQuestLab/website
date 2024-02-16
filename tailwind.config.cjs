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
			h1: ['110px', {
				lineHeight: '101.2px'
			}],
			h2: ['90px', {
				lineHeight: '82.8px'
			}],
			h3: ['70px', {
				lineHeight: '64.4px'
			}],
			h4: ['55px', {
				lineHeight: '50.6px'
			}],
			h5: ['35px', {
				lineHeight: '37.8px'
			}],
			s1: ['35px', {
				lineHeight: '50.4px'
			}],
			s2: ['30px', {
				lineHeight: '43.2px'
			}],
			s3: ['25px', {
				lineHeight: '36px'
			}],
			base: ['17px', {
				lineHeight: '26.86px'
			}],
			sm: ['15px', {
				lineHeight: '23.7px'
			}],
			xs: ['13px', {
				lineHeight: '20.54px'
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
