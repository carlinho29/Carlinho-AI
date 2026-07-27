# 🤖 Carlinho Ai

Assistente de Inteligência Artificial interativo para programação, com suporte a múltiplas linguagens.

## 🚀 Deploy na Vercel

1. **Crie uma conta** em [vercel.com](https://vercel.com) (gratuito)
2. **Instale a CLI** (opcional):
   ```bash
   npm i -g vercel
   ```
3. **Deploy via CLI**:
   ```bash
   cd carlinho-ai
   vercel
   ```
   Ou faça upload do projeto via interface web da Vercel (drag & drop).

## 🛠️ Tecnologias

- **Backend:** Node.js + Express (serverless na Vercel)
- **Frontend:** HTML5 + Tailwind CSS (CDN) + JavaScript vanilla
- **Deploy:** Vercel (serverless functions)

## 🧠 Funcionalidades

-  Interface moderna e responsiva com Tailwind CSS
- Seletor de linguagens (C++, Python, C, C#, JavaScript, HTML, CSS, PHP, SQL, Portugol)
-  Base de conhecimento completa para **C++**
-  Respostas dinâmicas e contextualizadas
-  Personalização com nome do usuário
-  Fallback offline (funciona sem backend)
-  Código formatado com highlight
-  Persistência de conversa no localStorage 

## 📝 Como Adicionar Nova Linguagem

1. Edite `data/knowledge.json`
2. Adicione um novo objeto no mesmo formato de `cpp`
3. Defina `topics` com palavras-chave e respostas variadas
4. A linguagem aparecerá automaticamente no seletor

## ⚡ Comandos

```bash
# Desenvolvimento local 
npm install
npm start

```
