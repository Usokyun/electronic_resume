export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\//, '');
    const targetPath = path.startsWith('minimax-anthropic/')
      ? `api/${path.slice('minimax-anthropic/'.length)}`
      : path.startsWith('anthropic/')
        ? `api/${path.slice('anthropic/'.length)}`
        : path.startsWith('openrouter/')
          ? `api/${path.slice('openrouter/'.length)}`
          : path;
    const targetUrl = `https://openrouter.ai/${targetPath}`;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, HTTP-Referer, X-OpenRouter-Title',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    const authorization = request.headers.get('Authorization') || (url.searchParams.get('key') ? `Bearer ${url.searchParams.get('key')}` : '');
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'OpenRouter API key required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: authorization,
    };

    const siteUrl = request.headers.get('HTTP-Referer');
    const siteName = request.headers.get('X-OpenRouter-Title');
    if (siteUrl) {
      headers['HTTP-Referer'] = siteUrl;
    }
    if (siteName) {
      headers['X-OpenRouter-Title'] = siteName;
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
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, HTTP-Referer, X-OpenRouter-Title');

      const contentType = response.headers.get('content-type');
      if (contentType) {
        responseHeaders.set('content-type', contentType);
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
