import path from "path";
import puppeteer from "puppeteer";
(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const pages = [
		[
			"https://jactusthecactus.github.io/new-abugida/",
			"index.pdf"
		],
		[
			"https://jactusthecactus.github.io/new-abugida/ipa.html",
			"ipa.pdf"
		],
		[
			"https://jactusthecactus.github.io/new-abugida/example.html",
			"example.pdf"
		],
	];
	for (const [url, pdf] of pages) {
		await page.goto(url, {
			waitUntil: 'networkidle0'
		});
		await page.pdf({
			path: path.join("site","pdf",pdf),
			format: 'A4'
		});
	}
	await browser.close();
})();
