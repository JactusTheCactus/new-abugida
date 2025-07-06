import path from "path";
import puppeteer from "puppeteer";
(
	async () => {
function ensureBrowser() {
  const browserFetcher = puppeteer.createBrowserFetcher();
  const revision = puppeteer._preferredRevision;
  const local = browserFetcher.localRevisions();
  if (!local.includes(revision)) {
    console.log(`📥 Downloading Chromium r${revision}…`);
    const { executablePath } = await browserFetcher.download(revision);
    return executablePath;
  } else {
    const info = await browserFetcher.revisionInfo(revision);
    return info.executablePath;
  }
}
		function log(text) {
			const line = "=".repeat(30)
			console.log(`${line}\n${text}\n${line}`)
		}
		function percent(num) {
			const out = Math.round((num + Number.EPSILON) * 100)
			return out + "%"
		}
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.emulateMediaType('print');
		const pages = [
			"https://jactusthecactus.github.io/new-abugida/site/html/ipa.html",
			"https://jactusthecactus.github.io/new-abugida/site/html/example.html"
		];
		log(`Generating ${pages.length} PDFs`)
		let index = 1
		for (const url of pages) {
			let pdf = url
				.replace(/.+\/(.*)/g, "$1.pdf")
				.replace(/\.html/g, "")
			pdf = pdf && pdf !== ".pdf" ? pdf : "index.pdf"
			const page = await browser.newPage();
			await page.goto(url, {
				waitUntil: "networkidle0"
			});
			await page.emulateMediaType('print');
			await page.pdf({
				path: path.join("site", "pdf", pdf),
				format: "A4",
				printBackground: true,
				preferCSSPageSize: true,
			});
			await page.close();
			console.log(`${pdf}; ${percent(index / pages.length)} Complete`)
			index++
		}
		log(`${pages.length} PDFs Generated`)
		await browser.close();
	}
)();
