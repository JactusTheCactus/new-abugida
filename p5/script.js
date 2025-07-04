import {createCanvas} from "canvas";
import fs from "fs";
import path from "path";
function filePath(...args) {
	const root = path.join(".", "p5")
	return path.join(root, ...args);
}

const maxX = 700;
const maxY = 600;
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
		[0,600],
		[700,600],
		[700,500],
		[150,500],
		[550,400],
		[700,250],
		[550,100],
		[100,0],
		[0,0],
		[0,100],
		[550,200],
		[600,250],
		[550,300],
		[0,450]
	]
];

shapes.forEach(drawShape);

// Save to file
const out = fs.createWriteStream(filePath("output.png"));
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
	console.log('✅ Saved output.png');
});