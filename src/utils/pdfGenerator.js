const puppeteer = require("puppeteer")

const generatePdfBuffer = async (html) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: "networkidle0" })

  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
  })

  await browser.close()

  return buffer
}

module.exports = { generatePdfBuffer }