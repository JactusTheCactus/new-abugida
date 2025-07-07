import fs from 'fs-extra';
import path from 'path';
import { createCanvas } from 'canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// A little factory to bridge PDF.js to node-canvas
class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  }
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

async function convertPdfToPng(pdfPath, outputDir) {
  const data = new Uint8Array(await fs.readFile(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const baseName = path.basename(pdfPath, path.extname(pdfPath));
  const pdfOutputDir = path.join(outputDir, baseName);
  await fs.ensureDir(pdfOutputDir);

  const canvasFactory = new NodeCanvasFactory();

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });

    // Ask the factory for a fresh canvas
    const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

    // Render into our node-canvas via the factory
    await page.render({
      canvasContext: context,
      viewport,
      canvasFactory,
    }).promise;

    const outputFile = path.join(pdfOutputDir, `page-${pageNum}.png`);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outputFile, buffer);

    // Clean up
    canvasFactory.destroy({ canvas, context });
  }
}

async function convertAllPdfsInDir(inputDir, outputDir) {
  await fs.ensureDir(outputDir);
  const files = await fs.readdir(inputDir);
  const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(inputDir, pdfFile);
    await convertPdfToPng(pdfPath, outputDir);
  }
}

const inputDir = path.resolve("site", "pdf");
const outputDir = path.resolve("site", "png");
convertAllPdfsInDir(inputDir, outputDir).catch(console.error);