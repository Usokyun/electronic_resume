const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_projects",
      description: "获取所有项目列表及链接，用于回答用户关于李志宇项目经验的问题",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "get_project_detail",
      description: "获取指定项目的详细信息",
      parameters: {
        type: "object",
        properties: {
          project_id: { type: "string", enum: ["gallery", "face_generation", "mygo", "ui_design", "digitalrock"] }
        },
        required: ["project_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_gallery_images",
      description: "获取画廊所有图片资源",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "get_works_by_category",
      description: "按分类获取美术作品",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["素描", "摄影", "海报", "脸谱", "其他"] }
        },
        required: ["category"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_timeline",
      description: "获取个人经历时间线",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "get_contact",
      description: "获取社交联系信息",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "get_skills",
      description: "获取技能列表",
      parameters: { type: "object", properties: {}, required: [] }
    }
  }
];

function normalizeTools(tools) {
  return tools.map((tool) => {
    if (tool && tool.name && tool.input_schema) {
      return tool;
    }

    if (tool && tool.type === 'function' && tool.function) {
      return {
        name: tool.function.name,
        description: tool.function.description || tool.function.name,
        input_schema: tool.function.parameters || {
          type: 'object',
          properties: {},
          required: []
        }
      };
    }

    return tool;
  });
}

const PROJECT_URLS = {
  home: 'index.html',
  gallery: 'view/gallery_page.html',
  face_generation: 'view/project_face_generation.html',
  mygo: 'view/project_mygo.html',
  digitalrock: 'view/project_digitalrock.html',
  ui_design: 'view/project_UI.html'
};

const PROJECTS = [
  { id: 'gallery', name: '画廊', description: '大学以来的美术作品，包含绘画、海报、页面设计以及荣誉等等', tags: ['绘画', '海报', 'UI设计', '荣誉'] },
  { id: 'face_generation', name: '脸谱生成', description: '大三时期的脸谱文化项目，使用HTML+CSS+JS实现的Web应用', tags: ['编程', '美术', '传统文化'] },
  { id: 'mygo', name: '迷星叫PV', description: 'AE大作业，BangDream Its MyGO!!!!的歌曲《迷星叫》剪辑', tags: ['视频剪辑', 'AE', '二次元'] },
  { id: 'ui_design', name: '小泉题库', description: '大二PS大作业，负责程序UI设计的一部分内容', tags: ['UI设计', '图标设计', 'Figma'] },
  { id: 'digitalrock', name: '数字岩芯', description: '大一参加的数字岩芯项目组的3D建模项目，使用C4D制作', tags: ['3D建模', 'C4D', '海报'] }
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
    { name: 'KFC海报', url: 'image/work/精致KFC.png' },
    { name: 'PS设计', url: 'image/work/peacekeeper.jpg' }
  ],
  '脸谱': [
    { name: '脸谱文化1', url: 'image/work/脸谱1.png' },
    { name: '脸谱文化2', url: 'image/work/脸谱2.png' }
  ],
  '其他': [
    { name: '临摹', url: 'image/work/临摹1.jpg' },
    { name: '原创设计', url: 'image/work/原创1.jpg' },
    { name: '头像', url: 'image/work/头像.png' }
  ]
};

const TIMELINE = [
  { year: '2021-2025', title: '成都理工大学', description: '数字媒体本科' },
  { year: '2021', title: '数字岩芯项目', description: '负责3D建模和海报制作' },
  { year: '2022', title: '"互联网+"大赛', description: '第八届四川省铜奖' },
  { year: '2023', title: '脸谱文化项目', description: '脸谱生成Web应用开发' },
  { year: '2024', title: 'OEP对战平台', description: 'Java后端开发' },
  { year: '2025', title: '北京航空航天大学', description: '软件工程全日制硕士' }
];

const CONTACT = { bilibili: 'https://space.bilibili.com/38488151' };
const SKILLS = ['Java', 'C++', 'Python', 'JavaScript', 'C4D', 'AE', 'PS', '数据结构与算法', '前端开发', '后端开发', '3D建模'];

async function executeTool(name, input) {
  switch (name) {
    case 'get_projects': return { projects: PROJECTS };
    case 'get_project_detail':
      const project = PROJECTS.find(p => p.id === input.project_id);
      return project ? { project } : { error: '项目不存在' };
    case 'get_gallery_images': return { gallery: GALLERY_CATEGORIES };
    case 'get_works_by_category':
      const images = GALLERY_CATEGORIES[input.category];
      return images ? { category: input.category, images } : { error: '分类不存在', available: Object.keys(GALLERY_CATEGORIES) };
    case 'get_timeline': return { timeline: TIMELINE };
    case 'get_contact': return { contact: CONTACT };
    case 'get_skills': return { skills: SKILLS };
    default: return { error: `Unknown tool: ${name}` };
  }
}

const SYSTEM_PROMPT = `你是李志宇（Usokyun），一个现于北京航空航天大学攻读软件工程全日制硕士的学生。

## 基本信息
- 本科毕业于成都理工大学数字媒体专业
- 擅长Java、C++，有良好的数据结构知识和算法能力
- 蓝桥杯省级一等奖获得者（第14届、第16届）、国家优秀奖、国家三等奖
- 有很强的实践能力，主导过在线对战平台OEP的开发，全栈开发过电子商务网站

## 项目列表
${PROJECTS.map(p => `- ${p.name}：${p.description}`).join('\n')}

## 画廊分类
${Object.keys(GALLERY_CATEGORIES).map(cat => `${cat}：${GALLERY_CATEGORIES[cat].length}张作品`).join('\n')}

## 个人经历
${TIMELINE.map(t => `${t.year} ${t.title}：${t.description}`).join('\n')}

## 技能
${SKILLS.join('、')}

## 交互规则
1. 当用户询问项目时，使用 get_projects 工具
2. 当用户想看美术作品时，使用 get_gallery_images 或 get_works_by_category 工具
3. 当用户询问经历时，使用 get_timeline 工具
4. 当用户询问技能时，使用 get_skills 工具
5. 保持友好、热情的态度
6. 在提供项目链接时使用 <a href="URL" class="project-link">项目名称</a> 格式`;

function formatResponse(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/<a href="([^"]+\.html)" class="project-link">([^<]+)<\/a>/g,
      '<a href="$1" class="project-link" target="_blank">$2</a>');
}

class UsokyunAgent {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.model = options.model || 'MiniMax-M2.7';
    this.conversationHistory = [];
    this.proxyUrl = options.proxyUrl || window.CHAT_PROXY_URL || '';
    this.transport = options.transport || 'auto';
  }

  getRequestConfig() {
    const isLocalProxyHost = window.location.hostname === 'localhost' && window.location.port === '8080';
    const shouldUseLocalProxy = this.transport === 'proxy' || (!this.proxyUrl && (isLocalProxyHost || this.transport === 'same-origin'));
    const apiUrl = this.proxyUrl || (shouldUseLocalProxy
      ? `/anthropic/v1/messages?key=${encodeURIComponent(this.apiKey)}`
      : 'https://api.minimaxi.com/anthropic/v1/messages');

    const headers = {
      'Content-Type': 'application/json'
    };

    if (!shouldUseLocalProxy || this.proxyUrl) {
      headers['x-api-key'] = this.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    }

    return { apiUrl, headers, shouldUseLocalProxy };
  }

  async send(userMessage) {
    this.conversationHistory.push({
      role: 'user',
      content: [{ type: 'text', text: userMessage }]
    });

    let turnCount = 0;
    const maxTurns = 10;

    while (turnCount < maxTurns) {
      turnCount++;

      try {
        // 通过 Service Worker 同源代理
        const { apiUrl, headers, shouldUseLocalProxy } = this.getRequestConfig();

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: this.model,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: this.conversationHistory,
            tools: normalizeTools(TOOLS),
            tool_choice: { type: "auto" }
          })
        });

        if (!response.ok) {
          const error = await response.text();
          if ((response.status === 404 || response.status === 405) && shouldUseLocalProxy) {
            throw new Error('当前运行在静态服务器下，本地 /anthropic 代理不可用。已切换需求为直连或自定义 proxyUrl。');
          }
          throw new Error(`API Error: ${response.status} - ${error}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || 'API Error');
        }

        let responseText = '';

        for (const block of data.content) {
          if (block.type === 'text') {
            responseText += block.text;
          } else if (block.type === 'tool_use') {
            const toolName = block.name;
            const toolInput = block.input;
            const toolId = block.id;

            window.chatWidgetCallback?.(`使用工具: ${toolName}`, 'thinking');

            const result = await executeTool(toolName, toolInput);

            this.conversationHistory.push({ role: 'assistant', content: [block] });
            this.conversationHistory.push({
              role: 'user',
              content: [{ type: 'tool_result', tool_use_id: toolId, content: JSON.stringify(result) }]
            });

            if (result.projects) {
              const links = result.projects.map(p =>
                `<a href="${PROJECT_URLS[p.id]}" class="project-link" target="_blank">${p.name}</a>`
              ).join(' ');
              window.chatWidgetCallback?.(links, 'assistant');
            } else if (result.gallery) {
              let html = '<div>';
              for (const [cat, imgs] of Object.entries(result.gallery)) {
                html += `<p><strong>${cat}:</strong></p>`;
                for (const img of imgs) {
                  html += `<img src="${img.url}" class="gallery-image" alt="${img.name}">`;
                }
              }
              html += '</div>';
              window.chatWidgetCallback?.(html, 'assistant');
            } else if (result.timeline) {
              let html = '<div>';
              for (const item of result.timeline) {
                html += `<p><strong>${item.year}</strong> ${item.title}: ${item.description}</p>`;
              }
              html += '</div>';
              window.chatWidgetCallback?.(html, 'assistant');
            } else if (result.skills) {
              window.chatWidgetCallback?.(`技能：${result.skills.join('、')}`, 'assistant');
            } else if (result.contact) {
              let html = '<div>';
              if (result.contact.bilibili) {
                html += `<p>Bilibili：<a href="${result.contact.bilibili}" class="project-link" target="_blank">点击访问</a></p>`;
              }
              html += '</div>';
              window.chatWidgetCallback?.(html, 'assistant');
            }

            responseText = null;
          }
        }

        if (responseText) {
          const formatted = formatResponse(responseText);
          window.chatWidgetCallback?.(formatted, 'assistant');
          this.conversationHistory.push({ role: 'assistant', content: [{ type: 'text', text: responseText }] });
          break;
        }

      } catch (error) {
        console.error('Agent error:', error);
        window.chatWidgetCallback?.(`错误: ${error.message}`, 'error');
        break;
      }
    }
  }
}

window.UsokyunAgent = UsokyunAgent;

function createChatWidget() {
  const widgetHTML = `
    <div id="chat-widget">
      <button id="chat-toggle">AI</button>
      <div id="chat-window">
        <div id="chat-header">
          <h3>Usokyun AI 助手</h3>
          <button id="close-chat">×</button>
        </div>
        <div id="chat-messages">
          <div class="message assistant">
            你好！我是李志宇的 AI 助手，有什么关于我的项目、技能或经历想了解的吗？
          </div>
        </div>
        <div id="chat-input-area">
          <input type="text" id="chat-input" placeholder="问我任何关于李志宇的问题..." />
          <button id="send-button">发送</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  const toggle = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('close-chat');
  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const chatMessages = document.getElementById('chat-messages');

  let isOpen = false;
  let isLoading = false;

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      toggle.classList.add('expanded');
      toggle.textContent = '×';
      chatWindow.classList.add('visible');
    } else {
      toggle.classList.remove('expanded');
      toggle.textContent = 'AI';
      chatWindow.classList.remove('visible');
    }
  }

  function addMessage(content, type = 'assistant') {
    const msg = document.createElement('div');
    msg.className = 'message ' + type;
    msg.innerHTML = content;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  function setLoading(loading) {
    isLoading = loading;
    sendButton.disabled = loading;
    chatInput.disabled = loading;
    sendButton.textContent = loading ? '发送中...' : '发送';
  }

  async function sendMessage() {
    if (isLoading) return;
    const message = chatInput.value.trim();
    if (!message) return;
    if (!window.chatAgent) {
      addMessage('请先配置 API Key', 'error');
      return;
    }

    addMessage(message, 'user');
    chatInput.value = '';
    setLoading(true);

    const thinkingMsg = addMessage('思考中...', 'thinking');

    try {
      await window.chatAgent.send(message);
    } catch (error) {
      addMessage('错误: ' + error.message, 'error');
    } finally {
      setLoading(false);
      if (thinkingMsg) thinkingMsg.remove();
    }
  }

  toggle.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  window.chatWidgetCallback = function(content, type) {
    const lastMsg = chatMessages.lastElementChild;
    if (type === 'thinking' && lastMsg?.classList.contains('thinking')) {
      lastMsg.innerHTML = content;
    } else {
      addMessage(content, type);
    }
  };
}

window.initChatWidget = function(apiKey, options = {}) {
  if (!apiKey) {
    window.chatWidgetCallback?.('请提供 API Key', 'error');
    return;
  }
  window.chatAgent = new window.UsokyunAgent(apiKey, options);
  createChatWidget();
};
