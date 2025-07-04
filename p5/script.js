import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";
function deepClean(value) {
	if (Array.isArray(value)) {
		const cleaned = value
			.map(deepClean)
			.filter(v => v !== null && v !== undefined && v !== false && v !== '' && !Number.isNaN(v));
		return cleaned.length ? cleaned : null;
	}
	if (value && typeof value === "object" && !Array.isArray(value)) {
		const entries = Object.entries(value)
			.map(([k, v]) => [k, deepClean(v)])
			.filter(([, v]) =>
				v !== null && v !== undefined && v !== false && v !== '' && !Number.isNaN(v)
			);
		return entries.length ? Object.fromEntries(entries) : null;
	}
	// For primitive values, return them only if not one of the disallowed falsy ones
	if (
		value === null ||
		value === undefined ||
		value === false ||
		value === '' ||
		Number.isNaN(value)
	) {
		return null;
	}
	return value;
}
function filePath(...args) {
	const root = path.join(".", "p5")
	return path.join(root, ...args);
}
const maxX = 700;
const maxY = 1000;
const canvas = createCanvas(maxX, maxY);
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, maxX, maxY);
ctx.lineWidth = 2;
function drawShape(points) {
	const pointV = points.map(p => ({
		x: p[0],
		y: maxY - p[1],
	}));
	// Fill polygon
	ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.moveTo(pointV[0].x, pointV[0].y);
	for (let pt of pointV.slice(1)) {
		ctx.lineTo(pt.x, pt.y);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	// Red circles
	ctx.fillStyle = 'red';
	for (let pt of pointV) {
		ctx.beginPath();
		ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
		ctx.fill();
	}
	// Black lines
	ctx.strokeStyle = 'black';
	for (let i = 0; i < pointV.length; i++) {
		let next = (i + 1) % pointV.length;
		ctx.beginPath();
		ctx.moveTo(pointV[i].x, pointV[i].y);
		ctx.lineTo(pointV[next].x, pointV[next].y);
		ctx.stroke();
	}
}
const shapes = [
	[
		[200, 0],
		[200, 1000],
		[300, 1000],
		[300, 0]
	],
	[
		[400, 0],
		[400, 1000],
		[500, 1000],
		[500, 0]
	],
	[
		[300, 450],
		[300, 550],
		[400, 550],
		[400, 450]
	]
];
const symbols = deepClean({
	space: [
		[
			[300, 0],
			[400, 0],
			[400, 1000],
			[300, 1000]
		]
	],
	fullStop: [
		[
			[200, 0],
			[200, 1000],
			[300, 1000],
			[300, 0]
		],
		[
			[400, 0],
			[400, 1000],
			[500, 1000],
			[500, 0]
		]
	],
	comma: [
		[
			[200, 0],
			[200, 1000],
			[300, 1000],
			[300, 0]
		],
		[
			[400, 0],
			[400, 1000],
			[500, 1000],
			[500, 0]
		],
		[
			[500, 0],
			[500, 100],
			[700, 300],
			[700, 200]
		]
	],
	question: [
		[
			[200, 0],
			[200, 1000],
			[300, 1000],
			[300, 0]
		],
		[
			[400, 0],
			[400, 1000],
			[500, 1000],
			[500, 0]
		],
		[
			[500, 1000],
			[500, 900],
			[700, 700],
			[700, 800]
		]
	],
	ellipsis: [
		[
			[300, 0],
			[400, 0],
			[400, 1000],
			[300, 1000]
		],
		[
			[100, 0],
			[200, 0],
			[200, 1000],
			[100, 1000]
		],
		[
			[500, 0],
			[600, 0],
			[600, 1000],
			[500, 1000]
		]
	],
	hyphen: [
		[
			[200, 0],
			[200, 1000],
			[300, 1000],
			[300, 0]
		],
		[
			[400, 0],
			[400, 1000],
			[500, 1000],
			[500, 0]
		],
		[
			[300, 450],
			[300, 550],
			[400, 550],
			[400, 450]
		]
	]
});
let log = JSON.stringify(symbols, null, 4)
log = log
	.replace(/ {4}/g, "\t")
	.replace(/\[\n\t+(\d+),\n\t+(\d+)\n\t+\]/g, "[$1, $2]")
	.replace(/\t+"(\w)(\w+)"/g, (_, g1, g2) => `${g1.toUpperCase()}${g2.toLowerCase()}`)
	.replace(/\{|\}/g, "")
	.replace(/: \[/g, "")
	.replace(/^\t\],?/gm, "")
	.replace(/^\t{2}/gm, "")
	.trim()
	.replace(/\n+/g, "\n")
	.replace(/\t/g, " ".repeat(4))
console.log(log)
shapes.forEach(drawShape);
const out = fs.createWriteStream(filePath("output.png"));
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
	console.log('Saved output.png');
});