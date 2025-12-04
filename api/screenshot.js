const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get parameters from request body
    const { 
      html,
      url,
      viewport_width = 1920, 
      viewport_height = 1080, 
      device_scale = 2 
    } = req.body;

    // Validate - either html or url must be provided
    if (!html && !url) {
      return res.status(400).json({ 
        error: 'Either html or url parameter is required' 
      });
    }

    // Launch browser
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: viewport_width,
      height: viewport_height,
      deviceScaleFactor: device_scale,
    });

    // Load content - either from URL or HTML
    if (url) {
      console.log('Loading URL:', url);
      await page.goto(url, { 
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000 
      });
    } else {
      console.log('Setting HTML content');
      await page.setContent(html, { 
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000 
      });
    }

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64',
      fullPage: false
    });

    await browser.close();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Return base64 image
    return res.status(200).json({
      image: screenshot,
      success: true,
      source: url ? 'url' : 'html'
    });

  } catch (error) {
    console.error('Screenshot error:', error);
    return res.status(500).json({
      error: error.message,
      success: false
    });
  }
};
