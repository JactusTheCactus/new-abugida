import fs from "fs-extra";
import path from "path";
import { execFile } from "child_process";
const inputDir = path.join(".", "site", "pdf");
const outputDir = path.join(".", "site", "png");
async function convertPDF(pdfFile) {
    const pdfPath = path.join(inputDir, pdfFile);
    const baseName = path.basename(pdfFile, ".pdf");
    const outputSubdir = path.join(outputDir, baseName);
    await fs.ensureDir(outputSubdir);
    return new Promise((resolve, reject) => {
        execFile(
            "pdftoppm",
            [
                "-png",
                "-r",
                "150",
                pdfPath,
                path.join(
                    outputSubdir,
                    "page"
                )
            ],
            (error, stdout, stderr) => {
                if (error) {
                    reject(`Error converting ${pdfFile}: ${stderr || error.message}`);
                    return;
                }
                fs.readdir(outputSubdir)
                    .then(files => {
                        const pngFiles = files.filter(f => f.match(/^page-\d+\.png$/));
                        if (pngFiles.length === 1) {
                            const oldPath = path.join(outputSubdir, pngFiles[0]);
                            const newPath = path.join(outputSubdir, "page.png");
                            fs.rename(oldPath, newPath)
                                .then(resolve)
                                .catch(reject);
                        } else {
                            resolve();
                        }
                    })
                    .catch(reject);
            }
        );
    });
}
async function convertAll() {
    try {
        const files = await fs.readdir(inputDir);
        const pdfFiles = files.filter(f => f.endsWith(".pdf"));
        if (!pdfFiles.length) {
            console.log("No PDFs found in", inputDir);
            return;
        }
        for (const pdfFile of pdfFiles) {
            console.log(`Converting ${pdfFile}...`);
            await convertPDF(pdfFile);
            console.log(`Done: ${pdfFile}`);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}
convertAll();