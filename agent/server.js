const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const API_TARGET = 'https://api.minimaxi.com';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const ROOT_DIR = path.join(__dirname, '..');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (
    req.method === 'OPTIONS' &&
    (parsedUrl.pathname.startsWith('/minimax-anthropic') || parsedUrl.pathname.startsWith('/anthropic'))
  ) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
    });
    res.end();
    return;
  }

  // Proxy AI requests from either /minimax-anthropic/* or /anthropic/*.
  if (parsedUrl.pathname.startsWith('/minimax-anthropic') || parsedUrl.pathname.startsWith('/anthropic')) {
    const targetPath = parsedUrl.pathname.startsWith('/minimax-anthropic')
      ? parsedUrl.pathname.replace('/minimax-anthropic', '/anthropic')
      : parsedUrl.pathname;
    const targetUrl = `${API_TARGET}${targetPath}`;
    const apiKey = req.headers['x-api-key'] || parsedUrl.query.key || '';

    const proxyReq = https.request(
      targetUrl,
      {
        method: req.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, {
          ...proxyRes.headers,
          'Access-Control-Allow-Origin': '*'
        });
        proxyRes.pipe(res);
      }
    );

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      proxyReq.write(body);
      proxyReq.end();
    });

    proxyReq.on('error', (e) => {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ error: e.message }));
    });
    return;
  }

  // Serve static files
  let filePath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  filePath = path.join(ROOT_DIR, filePath);

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('');
  console.log('API proxy: /minimax-anthropic/* will be forwarded to MiniMax API');
  console.log('Press Ctrl+C to stop');
});
