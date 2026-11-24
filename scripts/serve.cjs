const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { parseArgs } = require('node:util');

const { values } = parseArgs({
  options: {
    port: { type: 'string', default: '8000' },
    base: { type: 'string', default: '/' },
  },
});
const root = path.resolve(__dirname, '../dist');
const prefix = values.base;
if (!prefix.startsWith('/') || !prefix.endsWith('/')) {
  throw new Error('--base must start and end with /');
}
const types = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.otf': 'font/otf', '.ttf': 'font/ttf',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname.slice(prefix.length));
    const file = path.resolve(root, relative || 'index.html');
    if (!url.pathname.startsWith(prefix) || !file.startsWith(root + path.sep)) {
      res.writeHead(404).end();
      return;
    }
    const body = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    res.writeHead(error instanceof URIError ? 400 : 404).end();
  }
}).listen(Number(values.port), '127.0.0.1', () => {
  console.log(`Serving dist/ at http://127.0.0.1:${values.port}${prefix}`);
});
