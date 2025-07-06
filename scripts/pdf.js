import path from "path";
import puppeteer from "puppeteer-core";  // explicitly puppeteer-core

(async () => {
  // 1) Turn ensureBrowser into an async function:
  async function ensureBrowser() {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revision = puppeteer._preferredRevision;
    const local = await browserFetcher.localRevisions();

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
    console.log("=".repeat(30) + `\n${text}\n` + "=".repeat(30));
  }
  function percent(num) {
    return Math.round((num + Number.EPSILON) * 100) + "%";
  }

  // 2) Download (if needed) and grab the path:
  const executablePath = await ensureBrowser();

  // 3) Launch Puppeteer with that path:
  const browser = await puppeteer.launch({ executablePath });
  log("Browser launched!");

  const pages = [
    "https://jactusthecactus.github.io/new-abugida/site/html/ipa.html",
    "https://jactusthecactus.github.io/new-abugida/site/html/example.html"
  ];
  log(`Generating ${pages.length} PDFs`);

  let index = 1;
  for (const url of pages) {
    const pdfName = url
      .replace(/.+\/(.*)/g, "$1.pdf")
      .replace(/\.html$/, "") || "index";

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");
    await page.pdf({
      path: path.join("site", "pdf", `${pdfName}.pdf`),
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    await page.close();

    console.log(`${pdfName}.pdf; ${percent(index / pages.length)} Complete`);
    index++;
  }

  log(`${pages.length} PDFs Generated`);
  await browser.close();
})();