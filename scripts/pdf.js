import path from "path";
import puppeteer from "puppeteer";
(async () => {
	const browser = await puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox'
		]
	});
	const pages = [
		"https://jactusthecactus.github.io/new-abugida/site/html/ipa.html",
		"https://jactusthecactus.github.io/new-abugida/site/html/ivlivs-caesar.html"
	];
	for (const url of pages) {
		let pdf = url
			.replace(/.+\/(.*)/g, "$1.pdf")
			.replace(/\.html/g, "");
		pdf = pdf && pdf !== ".pdf" ? pdf : "index.pdf";
		const page = await browser.newPage();
		await page.goto(url, {
			waitUntil: "networkidle0"
		});
		await page.emulateMediaType("print");
		await page.pdf({
			path: path.join("site", "pdf", pdf),
			format: "A4",
			printBackground: true,
			preferCSSPageSize: true
		});
		await page.close();
	}
	await browser.close();
})();
