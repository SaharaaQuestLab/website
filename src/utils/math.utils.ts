const PI = Math.PI;
const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;
const QUARTER_PI = Math.PI / 4;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const clamp = (num: number, min: number, max: number) => {
	if (max < min) {
		const tmax = min;
		min = max;
		max = tmax;
	}

	if (num < min) return min;
	else if (num > max) return max;

	return num;
};

const lerp = (min: number, max: number, amount: number) => {
	return min + amount * (max - min);
};

const map = (num: number, min1: number, max1: number, min2: number, max2: number, round = false, constrainMin = true, constrainMax = true) => {
	if (constrainMin && num < min1) return min2;
	if (constrainMax && num > max1) return max2;

	const num1 = (num - min1) / (max1 - min1);
	const num2 = (num1 * (max2 - min2)) + min2;
	if (round) return Math.round(num2);
	return num2;
};

const mod = (n: number, m: number) => {
	return ((n % m) + m) % m;
};

const random = (min: number | Array<number>, max: number) => {
	if (Array.isArray(min)) return min[~~(Math.random() * min.length)];

	if (typeof max !== 'number') {
		max = min || 1;
		min = 0;
	}

	return min + Math.random() * (max - min);
};


export { PI, HALF_PI, QUARTER_PI, TWO_PI, DEG_TO_RAD, RAD_TO_DEG, clamp, lerp, map, mod, random };
