import fs from 'fs-extra';
import path from 'path';
import { createCanvas } from 'canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext('2d') };
  }
  reset(canvasAndCtx, width, height) {
    canvasAndCtx.canvas.width  = width;
    canvasAndCtx.canvas.height = height;
  }
  destroy(canvasAndCtx) {
    canvasAndCtx.canvas.width  = 0;
    canvasAndCtx.canvas.height = 0;
    canvasAndCtx.canvas = null;
    canvasAndCtx.context = null;
  }
}

async function convertPdfToPng(pdfPath, outputDir) {
  const data = new Uint8Array(await fs.readFile(pdfPath));
  // Disable worker and load the PDF
  const loadingTask = pdfjsLib.getDocument({ data, disableWorker: true });
  const pdf = await loadingTask.promise;

  const baseName = path.basename(pdfPath, '.pdf');
  const pdfOut = path.join(outputDir, baseName);
  await fs.ensureDir(pdfOut);

  const canvasFactory = new NodeCanvasFactory();
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    // Create and clear a new canvas
    const { canvas, context } = canvasFactory.create(
      viewport.width,
      viewport.height
    );
    const renderContext = { canvasContext: context, viewport, canvasFactory };
    await page.render(renderContext).promise;

    const imgBuf = canvas.toBuffer('image/png');
    await fs.writeFile(path.join(pdfOut, `page-${i}.png`), imgBuf);
    canvasFactory.destroy({ canvas, context });
  }
}