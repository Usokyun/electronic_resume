const API_TARGET = 'https://api.minimaxi.com';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 拦截所有到 /minimax-anthropic/v1/messages 的 POST 请求
  if ((url.pathname.endsWith('/minimax-anthropic/v1/messages') || url.pathname.endsWith('/anthropic/v1/messages')) && event.request.method === 'POST') {
    event.respondWith(handleAnthropicRequest(event.request, url));
    return;
  }
  
  // 其他请求正常处理
  event.respondWith(fetch(event.request));
});

async function handleAnthropicRequest(request, url) {
  try {
    console.log('[SW] handleAnthropicRequest called');
    
    // 从 URL searchParams 获取 apiKey
    const apiKey = url.searchParams.get('key');
    console.log('[SW] API Key present:', !!apiKey);

    if (!apiKey) {
      return jsonResponse({ error: 'API key required' }, 400);
    }

    const body = await request.json();
    console.log('[SW] Request body parsed, model:', body.model);

    const response = await fetch(`${API_TARGET}/anthropic/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: body.model || 'MiniMax-M2.7',
        max_tokens: body.max_tokens || 4096,
        system: body.system,
        messages: body.messages,
        tools: body.tools,
        tool_choice: body.tool_choice
      })
    });

    console.log('[SW] API response status:', response.status);
    const data = await response.json();
    console.log('[SW] API response data:', JSON.stringify(data).substring(0, 200));
    
    return jsonResponse(data, response.status);
    
  } catch (error) {
    console.error('[SW] Error:', error);
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
