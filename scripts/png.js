import fs from 'fs';
import path from 'path';
import pkg from 'pdf-poppler';
const { Converter } = pkg;
const inputDir = path.join("site", 'pdf');
const outputDir = path.join("site", 'png');
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, {
		recursive: true
	})
};
fs.readdirSync(inputDir).forEach(file => {
	const ext = path.extname(file).toLowerCase();
	if (ext === '.pdf') {
		const baseName = path.basename(file, '.pdf');
		const pdfPath = path.join(inputDir, file);
		const pdfOutputDir = path.join(outputDir, baseName);
		if (!fs.existsSync(pdfOutputDir)) {
			fs.mkdirSync(pdfOutputDir, {
				recursive: true
			})
		};
		const converter = new Converter(pdfPath, {
			format: 'png',
			out_dir: pdfOutputDir,
			out_prefix: 'page',
			page: null
		});
		console.log(`Converting "${file}"...`);
		converter
			.convert()
			.then(() => console.log(`Done: ${file}`))
			.catch(error => console.error(`Error converting ${file}:`, error))

	}
})