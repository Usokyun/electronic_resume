const PROJECT_URLS = {
  home: 'index.html',
  gallery: 'view/gallery_page.html',
  face_generation: 'view/project_face_generation.html',
  mygo: 'view/project_mygo.html',
  digitalrock: 'view/project_digitalrock.html',
  ui_design: 'view/project_UI.html'
};

const PROJECTS = [
  { id: 'gallery', name: '画廊', description: '大学以来的绘画、摄影、海报和设计作品集合。', tags: ['绘画', '摄影', '海报', 'UI'] },
  { id: 'face_generation', name: '脸谱生成', description: '结合传统文化主题完成的 Web 交互项目。', tags: ['HTML', 'CSS', 'JavaScript'] },
  { id: 'mygo', name: '迷星叫 MV', description: '使用 AE 完成的音乐视频剪辑作品。', tags: ['AE', '视频剪辑'] },
  { id: 'ui_design', name: '小泉题库', description: '题库产品的 UI 设计与图标设计项目。', tags: ['UI 设计', 'Figma', '图标'] },
  { id: 'digitalrock', name: '数字岩芯', description: '以 C4D 为主完成的三维建模与海报展示项目。', tags: ['C4D', '3D', '海报'] }
];

const GALLERY_CATEGORIES = {
  '素描': [
    { name: '素描1', url: 'image/work/素描1.jpg' },
    { name: '素描2', url: 'image/work/素描2.jpg' },
    { name: '素描3', url: 'image/work/素描3.jpg' }
  ],
  '摄影': [
    { name: '摄影1', url: 'image/work/摄影1.jpg' },
    { name: '摄影2', url: 'image/work/摄影2.jpg' },
    { name: '摄影3', url: 'image/work/摄影3.jpg' },
    { name: '摄影4', url: 'image/work/摄影4.jpg' }
  ],
  '海报': [
    { name: 'KFC 海报', url: 'image/work/精致KFC.png' },
    { name: 'Peacekeeper', url: 'image/work/peacekeeper.jpg' }
  ],
  '脸谱': [
    { name: '脸谱1', url: 'image/work/脸谱1.png' },
    { name: '脸谱2', url: 'image/work/脸谱2.png' }
  ],
  '其他': [
    { name: '临摹', url: 'image/work/临摹1.jpg' },
    { name: '原创', url: 'image/work/原创1.jpg' },
    { name: '头像', url: 'image/work/头像.png' }
  ]
};

const TIMELINE = [
  { year: '2021-2025', title: '成都理工大学', description: '数字媒体技术本科' },
  { year: '2021', title: '数字岩芯项目', description: '负责 3D 建模与海报制作' },
  { year: '2022', title: '互联网+ 竞赛', description: '四川省铜奖' },
  { year: '2023', title: '脸谱文化项目', description: '完成脸谱生成 Web 应用' },
  { year: '2024', title: 'OEP 对战平台', description: '负责 Java 后端开发' },
  { year: '2025', title: '北京航空航天大学', description: '软件工程全日制硕士' }
];

const CONTACT = {
  bilibili: 'https://space.bilibili.com/38488151'
};

const SKILLS = ['Java', 'C++', 'Python', 'JavaScript', 'C4D', 'AE', 'PS', '数据结构与算法', '前端开发', '后端开发', '3D 建模'];

const TOOLS = [
  {
    name: 'get_projects',
    description: 'Get all portfolio projects and their summary information.',
    input_schema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_project_detail',
    description: 'Get details for one portfolio project.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', enum: ['gallery', 'face_generation', 'mygo', 'ui_design', 'digitalrock'] }
      },
      required: ['project_id']
    }
  },
  {
    name: 'get_gallery_images',
    description: 'Get all gallery images grouped by category.',
    input_schema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_works_by_category',
    description: 'Get gallery images for a specific category.',
    input_schema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: Object.keys(GALLERY_CATEGORIES) }
      },
      required: ['category']
    }
  },
  {
    name: 'get_timeline',
    description: 'Get timeline information about education and experience.',
    input_schema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_contact',
    description: 'Get contact links and social profiles.',
    input_schema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_skills',
    description: 'Get the list of skills.',
    input_schema: { type: 'object', properties: {}, required: [] }
  }
];

const SYSTEM_PROMPT = `
你是 Usokyun 的作品集 AI 助手。

你的任务：
- 回答用户关于项目、技能、经历、作品和联系方式的问题
- 语气友好、清晰、自然
- 如果适合，用工具获取结构化信息
- 回答支持 Markdown

项目信息：
${PROJECTS.map((project) => `- ${project.name}: ${project.description}`).join('\n')}

经历时间线：
${TIMELINE.map((item) => `- ${item.year} ${item.title}: ${item.description}`).join('\n')}

技能：
${SKILLS.join('、')}
`;

const DEFAULT_OPENROUTER_MODEL = window.OPENROUTER_MODEL || 'anthropic/claude-3.5-haiku';
const OPENROUTER_MESSAGES_API_URL = 'https://openrouter.ai/api/v1/messages';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeAssetUrl(path) {
  return new URL(path, window.location.href).href;
}

function renderInlineMarkdown(text) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img class="inline-markdown-image" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function renderMarkdown(text) {
  const escaped = escapeHtml(text).replace(/\r\n/g, '\n');
  const codeBlocks = [];
  let html = escaped.replace(/```([\s\S]*?)```/g, (_, code) => {
    const token = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
    return token;
  });

  const lines = html.split('\n');
  const output = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      if (inList) {
        output.push('</ul>');
        inList = false;
      }
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        output.push('<ul>');
        inList = true;
      }
      output.push(`<li>${renderInlineMarkdown(listMatch[1])}</li>`);
      continue;
    }

    if (inList) {
      output.push('</ul>');
      inList = false;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length + 2;
      output.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    output.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }

  if (inList) {
    output.push('</ul>');
  }

  html = output.join('');
  codeBlocks.forEach((block, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, block);
  });
  return html;
}

function renderProjectLinks(projects) {
  return `
    <div class="tool-result-grid">
      ${projects.map((project) => `
        <a href="${escapeHtml(PROJECT_URLS[project.id])}" class="project-link" target="_blank" rel="noopener noreferrer">
          <strong>${escapeHtml(project.name)}</strong>
          <span>${escapeHtml(project.description)}</span>
        </a>
      `).join('')}
    </div>
  `;
}

function renderGallery(gallery) {
  return `
    <div class="gallery-groups">
      ${Object.entries(gallery).map(([category, images]) => `
        <section class="gallery-group">
          <h4>${escapeHtml(category)}</h4>
          <div class="gallery-grid">
            ${images.map((image) => `
              <figure class="gallery-card" data-preview-src="${escapeHtml(normalizeAssetUrl(image.url))}" data-preview-alt="${escapeHtml(image.name)}" tabindex="0" role="button" aria-label="预览 ${escapeHtml(image.name)}">
                <img src="${escapeHtml(normalizeAssetUrl(image.url))}" class="gallery-image" alt="${escapeHtml(image.name)}" loading="lazy">
                <figcaption>${escapeHtml(image.name)}</figcaption>
              </figure>
            `).join('')}
          </div>
        </section>
      `).join('')}
    </div>
  `;
}

function renderTimeline(timeline) {
  return `
    <div class="timeline-list">
      ${timeline.map((item) => `
        <div class="timeline-entry">
          <strong>${escapeHtml(item.year)}</strong>
          <div>${escapeHtml(item.title)}</div>
          <span>${escapeHtml(item.description)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSkills(skills) {
  return `
    <div class="skill-chips">
      ${skills.map((skill) => `<span class="skill-chip">${escapeHtml(skill)}</span>`).join('')}
    </div>
  `;
}

function renderContact(contact) {
  return `
    <div class="tool-result-grid">
      ${contact.bilibili ? `<a href="${escapeHtml(contact.bilibili)}" class="project-link" target="_blank" rel="noopener noreferrer"><strong>Bilibili</strong><span>查看主页</span></a>` : ''}
    </div>
  `;
}

async function executeTool(name, input) {
  switch (name) {
    case 'get_projects':
      return { projects: PROJECTS };
    case 'get_project_detail': {
      const project = PROJECTS.find((item) => item.id === input.project_id);
      return project ? { project } : { error: '未找到对应项目。' };
    }
    case 'get_gallery_images':
      return { gallery: GALLERY_CATEGORIES };
    case 'get_works_by_category': {
      const images = GALLERY_CATEGORIES[input.category];
      return images ? { category: input.category, images } : { error: '未找到对应分类。', available: Object.keys(GALLERY_CATEGORIES) };
    }
    case 'get_timeline':
      return { timeline: TIMELINE };
    case 'get_contact':
      return { contact: CONTACT };
    case 'get_skills':
      return { skills: SKILLS };
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

function renderToolResult(result) {
  if (result.projects) {
    return renderProjectLinks(result.projects);
  }
  if (result.project) {
    return renderProjectLinks([result.project]);
  }
  if (result.gallery) {
    return renderGallery(result.gallery);
  }
  if (result.images) {
    return renderGallery({ [result.category || '作品']: result.images });
  }
  if (result.timeline) {
    return renderTimeline(result.timeline);
  }
  if (result.skills) {
    return renderSkills(result.skills);
  }
  if (result.contact) {
    return renderContact(result.contact);
  }
  if (result.error) {
    return `<p>${escapeHtml(result.error)}</p>`;
  }
  return `<pre><code>${escapeHtml(JSON.stringify(result, null, 2))}</code></pre>`;
}

function createToolSummary(toolName, result) {
  if (toolName === 'get_gallery_images' && result.gallery) {
    const total = Object.values(result.gallery).reduce((sum, items) => sum + items.length, 0);
    return `我把画廊作品按分类整理好了，共 ${total} 件，你可以直接查看下方图片。`;
  }

  if (toolName === 'get_works_by_category' && result.images) {
    return `我已经整理出“${result.category}”分类的作品，图片在下面。`;
  }

  if (toolName === 'get_projects' && result.projects) {
    return '我把相关项目整理好了，可以直接点下面的卡片查看。';
  }

  if (toolName === 'get_project_detail' && result.project) {
    return `我找到了 ${result.project.name} 的项目信息。`;
  }

  if (toolName === 'get_timeline' && result.timeline) {
    return '我整理好了经历时间线，重点信息在下面。';
  }

  if (toolName === 'get_skills' && result.skills) {
    return '我整理好了技能列表，方便你快速浏览。';
  }

  if (toolName === 'get_contact' && result.contact) {
    return '我把联系方式放在下面了。';
  }

  return '';
}

function looksLikeToolDump(text) {
  return /\|\s*名称\s*\|\s*文件\s*\|/.test(text)
    || /image\/work\//.test(text)
    || /共\s*\d+\s*件作品/.test(text);
}

class UsokyunAgentV2 {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.model = options.model || DEFAULT_OPENROUTER_MODEL;
    this.proxyUrl = options.proxyUrl || window.OPENROUTER_PROXY_URL || window.CHAT_PROXY_URL || '';
    this.transport = options.transport || window.OPENROUTER_TRANSPORT || 'auto';
    this.siteUrl = options.siteUrl || window.OPENROUTER_SITE_URL || window.location.origin;
    this.siteName = options.siteName || window.OPENROUTER_SITE_NAME || document.title;
    this.conversationHistory = [];
    this.maxTurns = options.maxTurns || 10;
  }

  getRequestConfig() {
    const isLocalProxyHost = window.location.hostname === 'localhost' && window.location.port === '8080';
    const useLocalProxy = this.transport === 'proxy' || (!this.proxyUrl && (isLocalProxyHost || this.transport === 'same-origin'));
    const apiUrl = this.proxyUrl || (useLocalProxy
      ? `/anthropic/v1/messages?key=${encodeURIComponent(this.apiKey)}`
      : OPENROUTER_MESSAGES_API_URL);

    const headers = { 'Content-Type': 'application/json' };
    if (this.siteUrl) {
      headers['HTTP-Referer'] = this.siteUrl;
    }
    if (this.siteName) {
      headers['X-OpenRouter-Title'] = this.siteName;
    }
    if (!useLocalProxy || this.proxyUrl) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }
    return { apiUrl, headers, useLocalProxy };
  }

  async send(userMessage) {
    this.conversationHistory.push({
      role: 'user',
      content: [{ type: 'text', text: userMessage }]
    });

    const traceId = window.chatWidgetApi.startTrace('分析问题');
    const pendingToolMessages = [];
    const toolSummaries = [];
    const liveStatus = window.chatWidgetApi.createLiveStatus('我先想一想你的问题。');
    window.chatWidgetApi.addTraceStep(traceId, '正在分析你的问题');

    for (let turn = 0; turn < this.maxTurns; turn += 1) {
      try {
        window.chatWidgetApi.addTraceStep(traceId, turn === 0 ? '正在组织回答' : '继续补充回答');
        window.chatWidgetApi.updateLiveStatus(liveStatus, turn === 0 ? '我正在整理回答思路。' : '我在补充剩余信息。');
        const { apiUrl, headers, useLocalProxy } = this.getRequestConfig();

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: this.model,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: this.conversationHistory,
            tools: TOOLS,
            tool_choice: { type: 'auto' }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          if ((response.status === 404 || response.status === 405) && useLocalProxy) {
            throw new Error('当前运行环境没有可用的本地 OpenRouter 代理，请改用 direct 或配置 proxyUrl。');
          }
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message || 'API Error');
        }

        let responseText = '';
        let handledToolUse = false;

        for (const block of data.content || []) {
          if (block.type === 'text') {
            responseText += block.text;
            continue;
          }

          if (block.type === 'tool_use') {
            handledToolUse = true;
            const toolName = block.name;
            const toolInput = block.input || {};
            window.chatWidgetApi.addTraceStep(traceId, `调用工具：${toolName}`);
            window.chatWidgetApi.addToolCall(traceId, toolName, toolInput);
            window.chatWidgetApi.updateLiveStatus(liveStatus, `我正在调用 ${toolName} 获取信息。`);

            const result = await executeTool(toolName, toolInput);
            window.chatWidgetApi.addToolResult(traceId, toolName, result);
            window.chatWidgetApi.updateLiveStatus(liveStatus, `我已经拿到 ${toolName} 的结果，正在整理给你。`);
            pendingToolMessages.push(renderToolResult(result));
            const toolSummary = createToolSummary(toolName, result);
            if (toolSummary) {
              toolSummaries.push(toolSummary);
            }

            this.conversationHistory.push({ role: 'assistant', content: [block] });
            this.conversationHistory.push({
              role: 'user',
              content: [{ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) }]
            });
          }
        }

        if (responseText) {
          window.chatWidgetApi.finishTrace(traceId, '完成');
          window.chatWidgetApi.removeLiveStatus(liveStatus);
          const finalResponse = (pendingToolMessages.length > 0 && looksLikeToolDump(responseText))
            ? toolSummaries.join('\n\n')
            : responseText;
          if (finalResponse && finalResponse.trim()) {
            window.chatWidgetApi.addMessage(finalResponse, 'assistant', { markdown: true });
          }
          pendingToolMessages.forEach((html) => {
            window.chatWidgetApi.addMessage(html, 'assistant', { html: true });
          });
          this.conversationHistory.push({ role: 'assistant', content: [{ type: 'text', text: finalResponse || responseText }] });
          return;
        }

        if (!handledToolUse) {
          window.chatWidgetApi.finishTrace(traceId, '完成');
          window.chatWidgetApi.removeLiveStatus(liveStatus);
          if (toolSummaries.length > 0) {
            window.chatWidgetApi.addMessage(toolSummaries.join('\n\n'), 'assistant', { markdown: true });
            pendingToolMessages.forEach((html) => {
              window.chatWidgetApi.addMessage(html, 'assistant', { html: true });
            });
          }
          return;
        }
      } catch (error) {
        console.error('Agent error:', error);
        const message = error && error.message === 'Failed to fetch'
          ? '网络请求失败。请检查 OpenRouter key、模型名，以及当前 transport 或 proxyUrl 配置。'
          : error.message;
        window.chatWidgetApi.removeLiveStatus(liveStatus);
        window.chatWidgetApi.failTrace(traceId, message);
        return;
      }
    }

    window.chatWidgetApi.removeLiveStatus(liveStatus);
    window.chatWidgetApi.failTrace(traceId, '达到最大轮数限制');
  }
}

window.UsokyunAgent = UsokyunAgentV2;

function createChatWidget() {
  const widgetHTML = `
    <div id="chat-widget">
      <div id="chat-window">
        <div id="chat-header">
          <div>
            <h3>Usokyun AI 助手</h3>
            <p>支持 Markdown、工具调用和图片预览</p>
          </div>
          <button id="close-chat" aria-label="关闭 AI 对话">×</button>
        </div>
        <div id="chat-messages"></div>
        <div id="chat-input-area">
          <input type="text" id="chat-input" placeholder="问我项目、技能、经历或作品..." />
          <button id="send-button">发送</button>
        </div>
      </div>
      <button id="chat-toggle" aria-label="打开 AI 对话">AI</button>
      <div id="chat-image-viewer" aria-hidden="true">
        <button id="chat-image-close" aria-label="关闭图片预览">×</button>
        <img id="chat-image-preview" alt="">
        <div id="chat-image-caption"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  const toggle = document.getElementById('chat-toggle');
  const closeButton = document.getElementById('close-chat');
  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const chatMessages = document.getElementById('chat-messages');
  const imageViewer = document.getElementById('chat-image-viewer');
  const imagePreview = document.getElementById('chat-image-preview');
  const imageCaption = document.getElementById('chat-image-caption');
  const imageClose = document.getElementById('chat-image-close');

  let isOpen = false;
  let isLoading = false;

  function preserveScrollPosition(mutator) {
    const previousTop = chatMessages.scrollTop;
    mutator();
    chatMessages.scrollTop = previousTop;
  }

  function openImagePreview(src, alt) {
    imagePreview.src = src;
    imagePreview.alt = alt || '';
    imageCaption.textContent = alt || '';
    imageViewer.classList.add('visible');
    imageViewer.setAttribute('aria-hidden', 'false');
  }

  function closeImagePreview() {
    imageViewer.classList.remove('visible');
    imageViewer.setAttribute('aria-hidden', 'true');
    imagePreview.src = '';
    imageCaption.textContent = '';
  }

  function createMessageElement(type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    return message;
  }

  function addMessage(content, type = 'assistant', options = {}) {
    const message = createMessageElement(type);
    if (options.html) {
      message.innerHTML = content;
    } else if (options.markdown) {
      message.innerHTML = renderMarkdown(content);
    } else {
      message.textContent = content;
    }
    preserveScrollPosition(() => {
      chatMessages.appendChild(message);
    });
    return message;
  }

  function createLiveStatus(text) {
    return addMessage(text, 'live-status');
  }

  function updateLiveStatus(messageEl, text) {
    if (!messageEl || !messageEl.isConnected) {
      return;
    }
    preserveScrollPosition(() => {
      messageEl.textContent = text;
    });
  }

  function removeLiveStatus(messageEl) {
    if (!messageEl || !messageEl.isConnected) {
      return;
    }
    messageEl.classList.add('is-leaving');
    window.setTimeout(() => {
      if (messageEl.isConnected) {
        preserveScrollPosition(() => {
          messageEl.remove();
        });
      }
    }, 180);
  }

  function setLoading(loading) {
    isLoading = loading;
    sendButton.disabled = loading;
    chatInput.disabled = loading;
    sendButton.textContent = loading ? '发送中...' : '发送';
  }

  function toggleChat(forceOpen) {
    isOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;
    chatWindow.classList.toggle('visible', isOpen);
    toggle.classList.toggle('expanded', isOpen);
    toggle.textContent = isOpen ? '×' : 'AI';
  }

  function startTrace(title) {
    return { title };
  }

  function addTraceStep(traceEl, text, kind) {
    const label = kind === 'tool-call' ? 'Tool' : kind === 'tool-result' ? 'Result' : '思考';
    addMessage(`${label}: ${text}`, 'process');
  }

  window.chatWidgetApi = {
    addMessage,
    createLiveStatus,
    updateLiveStatus,
    removeLiveStatus,
    startTrace(title) {
      return startTrace(title);
    },
    addTraceStep(traceEl, text) {
      addTraceStep(traceEl, text);
    },
    addToolCall(traceEl, toolName, input) {
      addTraceStep(traceEl, `调用 ${toolName}`, 'tool-call');
    },
    addToolResult(traceEl, toolName, result) {
      addTraceStep(traceEl, `${toolName} 已返回结果`, 'tool-result');
      if (result.error) {
        addMessage(`错误: ${result.error}`, 'error');
      }
    },
    finishTrace() {
      return;
    },
    failTrace(traceEl, statusText) {
      addMessage(`错误: ${statusText}`, 'error');
    }
  };

  async function sendMessage() {
    if (isLoading) {
      return;
    }

    const message = chatInput.value.trim();
    if (!message) {
      return;
    }

    if (!window.chatAgent) {
      addMessage('请先配置 API Key。', 'error');
      return;
    }

    addMessage(message, 'user');
    chatInput.value = '';
    setLoading(true);

    try {
      await window.chatAgent.send(message);
    } catch (error) {
      addMessage(`错误: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  toggle.addEventListener('click', () => toggleChat());
  closeButton.addEventListener('click', () => toggleChat(false));
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });
  chatMessages.addEventListener('click', (event) => {
    const card = event.target.closest('.gallery-card');
    if (card) {
      openImagePreview(card.dataset.previewSrc, card.dataset.previewAlt);
    }
  });
  chatMessages.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      const card = event.target.closest('.gallery-card');
      if (card) {
        event.preventDefault();
        openImagePreview(card.dataset.previewSrc, card.dataset.previewAlt);
      }
    }
  });
  imageClose.addEventListener('click', closeImagePreview);
  imageViewer.addEventListener('click', (event) => {
    if (event.target === imageViewer) {
      closeImagePreview();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeImagePreview();
    }
  });

  addMessage('你好，我是作品集 AI 助手。你可以问我项目经历、技能、作品细节，也可以让我展示图片和链接。', 'assistant');
}

window.initChatWidget = function initChatWidget(apiKey, options = {}) {
  if (!apiKey) {
    console.warn('OpenRouter API key is missing. Please update agent/openrouter.local.js.');
    return;
  }
  window.chatAgent = new window.UsokyunAgent(apiKey, options);
  createChatWidget();
};
