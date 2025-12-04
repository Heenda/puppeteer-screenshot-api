const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { html, url, viewport_width = 1920, viewport_height = 1080, device_scale = 2 } = req.body;

    if (!html && !url) {
      return res.status(400).json({ error: 'Either html or url is required' });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: viewport_width,
      height: viewport_height,
      deviceScaleFactor: device_scale,
    });

    if (url) {
      await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'], timeout: 30000 });
    } else {
      await page.setContent(html, { waitUntil: ['networkidle0', 'domcontentloaded'], timeout: 30000 });
    }

    const screenshot = await page.screenshot({ type: 'png', encoding: 'base64' });
    await browser.close();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ image: screenshot, success: true });

  } catch (error) {
    console.error('Screenshot error:', error);
    return res.status(500).json({ error: error.message, success: false });
  }
};