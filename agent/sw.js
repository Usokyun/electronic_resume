const API_TARGET = 'https://openrouter.ai';
const DEFAULT_OPENROUTER_MODEL = 'anthropic/claude-3.5-haiku';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if ((url.pathname.endsWith('/minimax-anthropic/v1/messages') || url.pathname.endsWith('/anthropic/v1/messages') || url.pathname.endsWith('/openrouter/v1/messages')) && event.request.method === 'POST') {
    event.respondWith(handleAnthropicRequest(event.request, url));
    return;
  }

  event.respondWith(fetch(event.request));
});

async function handleAnthropicRequest(request, url) {
  try {
    const authorization = request.headers.get('Authorization') || (url.searchParams.get('key') ? `Bearer ${url.searchParams.get('key')}` : '');
    if (!authorization) {
      return jsonResponse({ error: 'OpenRouter API key required' }, 400);
    }

    const body = await request.json();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: authorization
    };

    const siteUrl = request.headers.get('HTTP-Referer');
    const siteName = request.headers.get('X-OpenRouter-Title');
    if (siteUrl) {
      headers['HTTP-Referer'] = siteUrl;
    }
    if (siteName) {
      headers['X-OpenRouter-Title'] = siteName;
    }

    const response = await fetch(`${API_TARGET}/api/v1/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: body.model || DEFAULT_OPENROUTER_MODEL,
        max_tokens: body.max_tokens || 4096,
        system: body.system,
        messages: body.messages,
        tools: body.tools,
        tool_choice: body.tool_choice
      })
    });

    const data = await response.json();
    return jsonResponse(data, response.status);
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
