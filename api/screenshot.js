// api/screenshot.js
// Vercel Serverless Function - Puppeteer Screenshot API

const chromium = require('chrome-aws-lambda');

module.exports = async (req, res) => {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { html, viewport_width = 1920, viewport_height = 1080, device_scale = 2 } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    console.log('Starting Puppeteer...');

    // Puppeteer 실행
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: parseInt(viewport_width),
        height: parseInt(viewport_height),
        deviceScaleFactor: parseInt(device_scale)
      },
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    console.log('Browser launched');

    const page = await browser.newPage();

    // HTML 컨텐츠 설정
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'load']
    });

    console.log('Page loaded, taking screenshot...');

    // 스크린샷 촬영
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      omitBackground: false
    });

    await browser.close();

    console.log('Screenshot complete');

    // Base64로 인코딩
    const base64Image = screenshot.toString('base64');

    // 응답
    return res.status(200).json({
      success: true,
      image: base64Image,
      mimeType: 'image/png',
      width: viewport_width,
      height: viewport_height
    });

  } catch (error) {
    console.error('Screenshot error:', error);
    return res.status(500).json({
      error: 'Screenshot generation failed',
      message: error.message
    });
  }
};
