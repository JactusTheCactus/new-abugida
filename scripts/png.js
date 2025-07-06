import fs from 'fs-extra';
const path = require('path');
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
pdfjsLib.GlobalWorkerOptions.workerSrc = null;
async function convertPdfToPng(pdfPath, outputDir) {
	const data = new Uint8Array(await fs.readFile(pdfPath));
	const loadingTask = pdfjsLib.getDocument({ data });
	const pdf = await loadingTask.promise;
	const baseName = path.basename(pdfPath, path.extname(pdfPath));
	const pdfOutputDir = path.join(outputDir, baseName);
	await fs.ensureDir(pdfOutputDir);
	for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
		const page = await pdf.getPage(pageNum);
		const viewport = page.getViewport({ scale: 2 });
		const canvas = createCanvas(viewport.width, viewport.height);
		const context = canvas.getContext('2d');
		await page.render({ canvasContext: context, viewport }).promise;
		const outputFile = path.join(pdfOutputDir, `page-${pageNum}.png`);
		const buffer = canvas.toBuffer('image/png');
		await fs.writeFile(outputFile, buffer);
		console.log(`Saved ${outputFile}`);
	}
}
async function convertAllPdfsInDir(inputDir, outputDir) {
	await fs.ensureDir(outputDir);
	const files = await fs.readdir(inputDir);
	const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
	for (const pdfFile of pdfFiles) {
		const pdfPath = path.join(inputDir, pdfFile);
		console.log(`Converting ${pdfFile}...`);
		await convertPdfToPng(pdfPath, outputDir);
	}
	console.log('All done!');
}
const inputDir = path.resolve("site","pdf");
const outputDir = path.resolve("site","png");
convertAllPdfsInDir(inputDir, outputDir).catch(console.error);
