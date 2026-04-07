# GitHub Pages + Cloudflare Worker

MiniMax 的 `https://api.minimaxi.com/anthropic/v1/messages` 当前不能被纯静态网页直接跨域调用。

因此下面两种方式都不够：

- 只用 VS Code Live Server
- 只用 GitHub Pages

可行方案是：

- `GitHub Pages` 托管页面
- `Cloudflare Worker` 作为 API 代理

## 步骤

1. 把 `agent/cors-proxy-worker.js` 部署到 Cloudflare Worker。
2. 得到 Worker 地址，例如：

```txt
https://your-worker.your-subdomain.workers.dev
```

3. 在 `index.html` 中设置：

```html
<script>
    document.addEventListener('DOMContentLoaded', function() {
        window.CHAT_PROXY_URL = 'https://your-worker.your-subdomain.workers.dev/anthropic/v1/messages';
        initChatWidget('你的 MiniMax API Key', {
            transport: 'auto'
        });
    });
</script>
```

## 原因

浏览器从静态页面请求 MiniMax 时，会先发 `OPTIONS` 预检。
MiniMax 当前的跨域响应头不允许这个前端所需的请求头，所以请求会在浏览器里被拦截，根本到不了模型接口。

加上 Worker 之后，调用路径会变成：

```txt
Browser -> Cloudflare Worker -> MiniMax API
```

这样浏览器只和你自己的 Worker 通信，就能正常工作。
