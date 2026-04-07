class UsokyunAgent {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.model = options.model || 'MiniMax-M2.7';
    this.conversationHistory = [];
    this.useProxy = options.useProxy;
    this.proxyUrl = options.proxyUrl;
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
        const apiUrl = this.proxyUrl || 'https://api.minimaxi.com/anthropic/v1/messages';
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: this.model,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: this.conversationHistory,
            tools: TOOLS,
            tool_choice: { type: "auto" }
          })
        });

        if (!response.ok) {
          const error = await response.text();
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
