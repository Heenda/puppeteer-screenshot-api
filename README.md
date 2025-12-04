# Puppeteer Screenshot API (Updated)

Serverless Puppeteer screenshot API on Vercel with support for both HTML and URL.

## Features

✅ **HTML screenshots** - Send HTML content directly
✅ **URL screenshots** - Provide URL to screenshot
✅ **Customizable viewport** - Set width, height, and scale
✅ **Base64 output** - Returns image as base64 string
✅ **CORS enabled** - Works from any origin
✅ **Free forever** - Vercel Hobby plan

## API Endpoint

**URL:** `https://YOUR-PROJECT.vercel.app/api/screenshot`

**Method:** `POST`

**Content-Type:** `application/json`

## Parameters

### Option 1: HTML Content

```json
{
  "html": "<html><body><h1>Hello World</h1></body></html>",
  "viewport_width": 1920,
  "viewport_height": 1080,
  "device_scale": 2
}
```

### Option 2: URL

```json
{
  "url": "https://example.com",
  "viewport_width": 1920,
  "viewport_height": 1080,
  "device_scale": 2
}
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `html` | string | * | - | HTML content to screenshot |
| `url` | string | * | - | URL to screenshot |
| `viewport_width` | number | No | 1920 | Viewport width in pixels |
| `viewport_height` | number | No | 1080 | Viewport height in pixels |
| `device_scale` | number | No | 2 | Device pixel ratio |

*Either `html` or `url` must be provided

## Response

```json
{
  "image": "iVBORw0KGgoAAAANSUhEUgAA...",
  "success": true,
  "source": "html"
}
```

- `image`: Base64-encoded PNG image
- `success`: Boolean indicating success
- `source`: Either "html" or "url"

## Usage Examples

### cURL - HTML

```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<html><body><h1>Hello World</h1></body></html>",
    "viewport_width": 1920,
    "viewport_height": 1080
  }'
```

### cURL - URL

```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "viewport_width": 1920,
    "viewport_height": 1080
  }'
```

### n8n - HTML

**HTTP Request Node:**
- Method: `POST`
- URL: `https://YOUR-PROJECT.vercel.app/api/screenshot`
- Body:
```json
={{
  {
    "html": $json.htmlContent,
    "viewport_width": 1920,
    "viewport_height": 1080,
    "device_scale": 2
  }
}}
```

### n8n - URL

**HTTP Request Node:**
- Method: `POST`
- URL: `https://YOUR-PROJECT.vercel.app/api/screenshot`
- Body:
```json
={{
  {
    "url": $json.url,
    "viewport_width": 540,
    "viewport_height": 690,
    "device_scale": 2
  }
}}
```

## Deployment

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### 2. Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Deploy"
4. Done! Your API is live

## Common Use Cases

### Meta Ads Preview Screenshots

```json
{
  "url": "https://business.facebook.com/ads/api/preview_iframe.php?d=...",
  "viewport_width": 540,
  "viewport_height": 690,
  "device_scale": 2
}
```

### Slide Screenshots

```json
{
  "html": "<html>...slide content...</html>",
  "viewport_width": 1920,
  "viewport_height": 1080,
  "device_scale": 2
}
```

## Limits (Vercel Hobby)

- Memory: 1024 MB
- Duration: 10 seconds per request
- Requests: 100 million per month (free)

## Troubleshooting

### "Screenshot generation failed"
- Check if URL is accessible
- Increase timeout in code if needed
- Verify HTML is valid

### "Memory limit exceeded"
- Complex pages may need more memory
- Upgrade to Pro plan for 3008 MB

### "Timeout"
- Some pages load slowly
- Adjust `waitUntil` options
- Consider Pro plan for longer duration

## License

MIT
