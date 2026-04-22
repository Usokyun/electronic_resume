const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const API_TARGET = 'https://openrouter.ai';

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

function isProxyPath(pathname) {
  return pathname.startsWith('/minimax-anthropic')
    || pathname.startsWith('/anthropic')
    || pathname.startsWith('/openrouter');
}

function mapProxyPath(pathname) {
  if (pathname.startsWith('/minimax-anthropic')) {
    return `/api${pathname.slice('/minimax-anthropic'.length)}`;
  }
  if (pathname.startsWith('/anthropic')) {
    return `/api${pathname.slice('/anthropic'.length)}`;
  }
  if (pathname.startsWith('/openrouter')) {
    return `/api${pathname.slice('/openrouter'.length)}`;
  }
  return pathname;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'OPTIONS' && isProxyPath(parsedUrl.pathname)) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, HTTP-Referer, X-OpenRouter-Title'
    });
    res.end();
    return;
  }

  if (isProxyPath(parsedUrl.pathname)) {
    const targetUrl = `${API_TARGET}${mapProxyPath(parsedUrl.pathname)}`;
    const authorization = req.headers.authorization || (parsedUrl.query.key ? `Bearer ${parsedUrl.query.key}` : '');

    if (!authorization) {
      res.writeHead(400, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ error: 'OpenRouter API key required' }));
      return;
    }

    const proxyHeaders = {
      'Content-Type': 'application/json',
      Authorization: authorization
    };

    if (req.headers['http-referer']) {
      proxyHeaders['HTTP-Referer'] = req.headers['http-referer'];
    }
    if (req.headers['x-openrouter-title']) {
      proxyHeaders['X-OpenRouter-Title'] = req.headers['x-openrouter-title'];
    }

    const proxyReq = https.request(
      targetUrl,
      {
        method: req.method || 'POST',
        headers: proxyHeaders,
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
  console.log('API proxy: /anthropic/* and /openrouter/* will be forwarded to OpenRouter');
  console.log('Press Ctrl+C to stop');
});
