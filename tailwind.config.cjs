/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,json}'],
	safelist: [],
	theme: {
		screens: {
			'desktop': { max: '1728px' },
			'tablet': { max: '1280px' },
			'mobile': { max: '768px' },
		},
		fontSize: {
			h1: ['100px', {
				lineHeight: '92px'
			}],
			h2: ['80px', {
				lineHeight: '73.6px'
			}],
			h3: ['70px', {
				lineHeight: '64.4px'
			}],
			h4: ['55px', {
				lineHeight: '50.6px'
			}],
			h5: ['35px', {
				lineHeight: '36px'
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
				lineHeight: '24px'
			}],
			xs: ['13px', {
				lineHeight: '20.54px'
			}],
			m1: ['64px', {
				lineHeight: '58.88px'
			}],
			m2: ['45px', {
				lineHeight: '42px'
			}],
			mx: ['12px', {
				lineHeight: '18px'
			}],
			min: ['10px', {
				lineHeight: '16px'
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
