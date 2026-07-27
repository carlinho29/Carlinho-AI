const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const knowledgePath = path.join(__dirname, 'data', 'knowledge.json');
let knowledge = {};
try {
    knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
} catch (e) {
    console.error('Erro ao carregar knowledge.json:', e.message);
}

function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function findBestTopic(langData, message) {
    if (!langData || !langData.topics) return null;
    const normalized = normalizeText(message);
    const words = normalized.split(' ');

    let bestTopic = null;
    let bestScore = 0;

    for (const [topicKey, topicData] of Object.entries(langData.topics)) {
        let score = 0;
        for (const keyword of topicData.keywords) {
            const normKeyword = normalizeText(keyword);
            if (normalized.includes(normKeyword)) {
                score += normKeyword.length; 
            }

            for (const word of words) {
                if (word.length > 2 && normKeyword.includes(word)) {
                    score += word.length * 0.5;
                }
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestTopic = topicData;
        }
    }

    return bestTopic && bestScore > 0 ? bestTopic : null;
}

function isGreeting(message) {
    const greetings = ['oi', 'ola', 'olá', 'eae', 'eai', 'hey', 'hi', 'hello', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'como vai', 'beleza', 'fala', 'opa', 'salve'];
    const normalized = normalizeText(message);
    return greetings.some(g => normalized.includes(g));
}

function isFarewell(message) {
    const farewells = ['tchau', 'adeus', 'ate logo', 'até logo', 'ate mais', 'até mais', 'valeu', 'flw', 'falou', 'xau', 'bye', 'goodbye'];
    const normalized = normalizeText(message);
    return farewells.some(f => normalized.includes(f));
}

function getRandomResponse(responses, userName) {
    const idx = Math.floor(Math.random() * responses.length);
    return responses[idx].replace(/{name}/g, userName);
}

function generateResponse(langKey, message, userName) {
    const langData = knowledge[langKey];

    if (!langData) {
        return `E aí, ${userName}! Essa linguagem ainda não está no meu repertório. Mas estou aprendendo cada vez mais! 🚀`;
    }

    if (isFarewell(message)) {
        const farewells = [
            `Até mais, ${userName}! Foi um prazer ajudar! Volte sempre que precisar! 👋`,
            `Tchau, ${userName}! Bons códigos e até a próxima! 💻✨`,
            `Falou, ${userName}! Se surgir mais alguma dúvida, é só chamar! 🚀`
        ];
        return getRandomResponse(farewells, userName);
    }

    if (isGreeting(message)) {
        if (langData.greetings && langData.greetings.length > 0) {
            return getRandomResponse(langData.greetings, userName);
        }
        return `E aí, ${userName}! Sou o Carlinho Ai! Como posso te ajudar hoje? 💻`;
    }

    if (!langData.topics || Object.keys(langData.topics).length === 0) {
        if (langData.fallback && langData.fallback.length > 0) {
            return getRandomResponse(langData.fallback, userName);
        }
        return `E aí, ${userName}! A base de dados para ${langData.name} ainda está sendo alimentada. Em breve vou ter conteúdo completo! 📚`;
    }

    const topic = findBestTopic(langData, message);

    if (topic && topic.responses && topic.responses.length > 0) {
        return getRandomResponse(topic.responses, userName);
    }

    if (langData.fallback && langData.fallback.length > 0) {
        return getRandomResponse(langData.fallback, userName);
    }

    return `E aí, ${userName}! Essa é uma boa pergunta sobre ${langData.name}. Ainda estou expandindo meu conhecimento nesse tópico específico. Quer falar sobre outro assunto? 🤔`;
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Carlinho Ai', timestamp: new Date().toISOString() });
});

app.get('/api/languages', (req, res) => {
    const languages = Object.entries(knowledge).map(([key, data]) => ({
        id: key,
        name: data.name,
        description: data.description,
        hasContent: data.topics && Object.keys(data.topics).length > 0
    }));
    res.json({ languages });
});

app.post('/api/chat', (req, res) => {
    const { message, language, userName } = req.body;

    if (!message || !language) {
        return res.status(400).json({ 
            error: 'Mensagem e linguagem são obrigatórios',
            response: 'Ei! Preciso saber o que você quer perguntar e em qual linguagem! 😅'
        });
    }

    const name = userName || 'amigo';
    const response = generateResponse(language, message, name);

    res.json({
        response,
        language,
        timestamp: new Date().toISOString()
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
