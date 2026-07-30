const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API для генерации кода
app.post('/api/generate', (req, res) => {
  const { blocks } = req.body;
  
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сайт от Атом Билдер</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 20px; background: #f8f9fa; display: flex; flex-direction: column; gap: 16px; }
    .btn { background: #00d2d3; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; }
    .btn:hover { transform: scale(1.05); }
    .text { font-size: 18px; color: #333; }
    .input { padding: 10px 16px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; }
    .input:focus { border-color: #00d2d3; outline: none; }
    .container { background: #f5f5f5; padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px; }
    .image { max-width: 100%; border-radius: 8px; }
  </style>
</head>
<body>`;

  blocks.forEach(block => {
    switch(block.type) {
      case 'button':
        html += `<button class="btn" onclick="alert('Привет!')">${block.props.text || 'Кнопка'}</button>`;
        break;
      case 'text':
        html += `<div class="text">${block.props.content || 'Текст'}</div>`;
        break;
      case 'image':
        html += `<img class="image" src="${block.props.src || 'https://via.placeholder.com/300x200'}" alt="image" />`;
        break;
      case 'input':
        html += `<input class="input" placeholder="${block.props.placeholder || 'Введите текст...'}" />`;
        break;
      case 'container':
        html += `<div class="container">📦 Контейнер</div>`;
        break;
    }
  });

  html += `</body></html>`;
  
  res.json({ html });
});

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Атом Билдер запущен на http://localhost:${PORT}`);
});
