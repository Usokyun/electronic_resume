/**
 * MiniMax CORS Proxy - Cloudflare Worker
 * 
 * 部署步骤：
 * 1. 登录 https://dash.cloudflare.com/workers
 * 2. 创建 Worker，粘贴此代码
 * 3. 部署后获得 URL
 * 4. 在 index.html 中配置 proxyUrl
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\//, '');
    const targetUrl = `https://api.minimaxi.com/${path}`;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version, anthropic-dangerous-direct-browser-access',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    const headers = {
      'Content-Type': 'application/json',
      'Origin': 'https://api.minimaxi.com',
    };

    // Forward relevant headers
    const forwardHeaders = ['x-api-key', 'anthropic-version', 'anthropic-dangerous-direct-browser-access'];
    for (const h of forwardHeaders) {
      const value = request.headers.get(h);
      if (value) headers[h] = value;
    }

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: request.body
      });

      const responseHeaders = new Headers();
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version, anthropic-dangerous-direct-browser-access');

      // Copy relevant response headers
      const copyHeaders = ['content-type', 'anthropic-version'];
      for (const h of copyHeaders) {
        const value = response.headers.get(h);
        if (value) responseHeaders.set(h, value);
      }

      const body = await response.text();
      return new Response(body, {
        status: response.status,
        headers: responseHeaders
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }
};
