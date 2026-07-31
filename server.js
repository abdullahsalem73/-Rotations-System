const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for large JSON context

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = 'llama3'; // Default to llama3, easily changeable

app.post('/api/chat', async (req, res) => {
    const { question, contextData } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    // Prepare the system prompt with context data
    const systemPrompt = `أنت مساعد ذكي ونظام خبير لمساعدة موظفي الموارد البشرية.
ستجيب على أسئلة المستخدم بناءً على البيانات التالية بصيغة JSON فقط.
إذا لم تجد الإجابة في البيانات، اعتذر وقل أنك لا تملك معلومات كافية. لا تخترع إجابات من خارج هذه البيانات أبداً.
أجب باللغة العربية الواضحة والاحترافية.

البيانات الحالية:
${JSON.stringify(contextData)}`;

    const requestBody = {
        model: MODEL_NAME,
        prompt: question,
        system: systemPrompt,
        stream: true
    };

    try {
        console.log(`Sending question to Ollama: "${question}"`);
        
        // Use native fetch to call Ollama
        const ollamaResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!ollamaResponse.ok) {
            console.error('Ollama Error:', ollamaResponse.statusText);
            return res.status(ollamaResponse.status).json({ error: 'Failed to communicate with Ollama' });
        }

        // Setup SSE (Server-Sent Events) to stream the response to the browser
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = ollamaResponse.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Ollama returns NDJSON (Newline Delimited JSON)
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.response) {
                        // Send the token text to the frontend
                        res.write(`data: ${JSON.stringify({ text: parsed.response })}\n\n`);
                    }
                } catch (e) {
                    console.error('Error parsing JSON line from Ollama:', e);
                }
            }
        }
        
        // Signal the end of the stream
        res.write(`data: [DONE]\n\n`);
        res.end();
        console.log('Stream completed successfully.');
    } catch (error) {
        console.error('Error contacting Ollama:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Ollama RAG Backend server listening at http://localhost:${port}`);
    console.log(`Make sure Ollama is running and has the '${MODEL_NAME}' model installed.`);
});
