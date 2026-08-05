document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject CSS for the Chatbot
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: height 0.3s ease;
            height: 450px;
            border: 1px solid #e0e0e0;
        }
        #ai-chat-container.ai-chat-closed {
            height: 50px;
        }
        .ai-chat-header {
            background: #0056b3;
            color: white;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-weight: bold;
        }
        .ai-chat-header button {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }
        .ai-chat-body {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .ai-message {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 15px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }
        .ai-message.system {
            align-self: flex-start;
            background: #e9ecef;
            color: #333;
            border-bottom-left-radius: 2px;
        }
        .ai-message.user {
            align-self: flex-end;
            background: #0056b3;
            color: white;
            border-bottom-right-radius: 2px;
        }
        .ai-chat-input-area {
            display: flex;
            padding: 10px;
            background: #fff;
            border-top: 1px solid #ddd;
        }
        .ai-chat-input-area input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 20px;
            outline: none;
            direction: rtl;
        }
        .ai-chat-input-area button {
            background: #0056b3;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 0 15px;
            margin-left: 10px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
        }
        .ai-chat-input-area button:hover {
            background: #004494;
        }
        .ai-chat-input-area button:disabled {
            background: #aaa;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML for the Chatbot (if not already there)
    if (!document.getElementById('ai-chat-container')) {
        const chatHTML = \`
            <div id="ai-chat-container" class="ai-chat-closed">
                <div class="ai-chat-header" id="ai-chat-header">
                    <span>المساعد الذكي (Ollama)</span>
                    <button id="ai-chat-toggle">^</button>
                </div>
                <div class="ai-chat-body" id="ai-chat-body">
                    <div class="ai-message system">مرحباً! أنا مساعدك الذكي. اسألني عن أي بيانات معروضة في الجداول أمامك وسيتم الإجابة بناءً عليها.</div>
                </div>
                <div class="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="اسأل هنا..." autocomplete="off" />
                    <button id="ai-chat-send">إرسال</button>
                </div>
            </div>
        \`;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    // 3. Logic and Interactivity
    const container = document.getElementById('ai-chat-container');
    const header = document.getElementById('ai-chat-header');
    const toggleBtn = document.getElementById('ai-chat-toggle');
    const body = document.getElementById('ai-chat-body');
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');

    // Toggle Chat
    header.addEventListener('click', () => {
        container.classList.toggle('ai-chat-closed');
        toggleBtn.textContent = container.classList.contains('ai-chat-closed') ? '^' : '_';
    });

    // Helper to get Context Data from the visible tables
    function getContextData() {
        const data = {};
        // Get all tables
        const tables = document.querySelectorAll('table');
        tables.forEach((table, index) => {
            // Only parse if table is somewhat visible
            if (table.offsetParent === null) return; 

            const tableId = table.id || \`table_\${index + 1}\`;
            data[tableId] = [];

            const rows = table.querySelectorAll('tr');
            let headers = [];

            rows.forEach((row, rowIndex) => {
                const isHidden = row.style.display === 'none' || row.classList.contains('hidden');
                if (isHidden) return;

                const cells = row.querySelectorAll('th, td');
                if (rowIndex === 0 || row.querySelector('th')) {
                    // It's a header row
                    if (headers.length === 0) {
                        cells.forEach(cell => headers.push(cell.innerText.trim()));
                    }
                } else {
                    // Data row
                    let rowData = {};
                    cells.forEach((cell, cellIndex) => {
                        const headerText = headers[cellIndex] || \`Column_\${cellIndex}\`;
                        rowData[headerText] = cell.innerText.trim();
                    });
                    data[tableId].push(rowData);
                }
            });
        });

        // Add some global info if available
        if (window.employees && Array.isArray(window.employees) && window.employees.length < 500) {
            // Only attach if it's not too huge to avoid overloading context
            // data.allEmployees = window.employees;
        }

        return data;
    }

    function appendMessage(text, sender, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${sender}`;
        if (id) msgDiv.id = id;
        
        // Handle markdown-like line breaks
        msgDiv.innerHTML = text.replace(/\n/g, '<br/>');
        
        if (/[\u0600-\u06FF]/.test(text)) {
            msgDiv.style.direction = 'rtl';
            msgDiv.style.textAlign = 'right';
        } else {
            msgDiv.style.direction = 'ltr';
            msgDiv.style.textAlign = 'left';
        }

        body.appendChild(msgDiv);
        body.scrollTop = body.scrollHeight;
        return msgDiv;
    }

    async function sendMessage() {
        const question = input.value.trim();
        if (!question) return;

        appendMessage(question, 'user');
        input.value = '';
        sendBtn.disabled = true;

        const contextData = getContextData();
        
        // Create a placeholder for the AI response
        const responseId = 'msg-' + Date.now();
        const responseDiv = appendMessage('...', 'system', responseId);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, contextData })
            });

            if (!response.ok) {
                throw new Error('فشل الاتصال بالخادم. تأكد من تشغيل server.js');
            }

            // Clear the placeholder
            responseDiv.innerHTML = '';
            
            // Read the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let aiFullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\\n\\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6);
                        if (dataStr === '[DONE]') break;
                        
                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.text) {
                                aiFullText += parsed.text;
                                
                                aiFullText = aiFullText.replace(/عظون/g, 'ازهون');

                                if (/[\u0600-\u06FF]/.test(aiFullText)) {
                                    responseDiv.style.direction = 'rtl';
                                    responseDiv.style.textAlign = 'right';
                                } else {
                                    responseDiv.style.direction = 'ltr';
                                    responseDiv.style.textAlign = 'left';
                                }

                                responseDiv.innerHTML = aiFullText.replace(/\n/g, '<br/>');
                                body.scrollTop = body.scrollHeight;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat Error:', error);
            responseDiv.innerHTML = '<span style="color:red">عذراً، حدث خطأ. تأكد من تشغيل Node.js server و Ollama.</span>';
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    }

    sendBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sendMessage();
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
