const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let browser = null;

  try {
    const { 
      html, 
      url, 
      viewport_width = 1920, 
      viewport_height = 1080, 
      device_scale = 2 
    } = req.body;

    if (!html && !url) {
      return res.status(400).json({ 
        error: 'Either html or url parameter is required' 
      });
    }

    // Configure chromium for serverless
    chromium.setGraphicsMode = false;

    // Launch browser with proper configuration
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
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
        waitUntil: ['domcontentloaded', 'networkidle2'],
        timeout: 30000 
      });
    } else {
      console.log('Setting HTML content');
      await page.setContent(html, { 
        waitUntil: ['domcontentloaded', 'networkidle2'],
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
    browser = null;

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
    
    // Make sure browser is closed on error
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
    
    return res.status(500).json({
      error: error.message,
      success: false
    });
  }
};