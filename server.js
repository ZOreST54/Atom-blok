const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============================================
// ГЛАВНАЯ СТРАНИЦА (весь фронтенд здесь)
// ============================================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Атом Билдер PRO</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0f0f1a; display: flex; height: 100vh; color: #fff; overflow: hidden; }
    #palette { width: 220px; background: #1a1a2e; padding: 20px; border-right: 2px solid #2a2a4a; overflow-y: auto; flex-shrink: 0; }
    #palette h3 { margin-bottom: 20px; color: #00d2d3; font-size: 18px; }
    .block-item { background: #16213e; padding: 14px 18px; border-radius: 10px; margin: 8px 0; cursor: grab; border: 2px solid #2a2a4a; transition: 0.2s; user-select: none; display: flex; align-items: center; gap: 10px; font-size: 14px; }
    .block-item:hover { border-color: #00d2d3; transform: translateX(4px); }
    .block-item:active { cursor: grabbing; opacity: 0.7; }
    #workspace { flex: 1; display: flex; flex-direction: column; padding: 20px; background: #0a0a1a; min-width: 0; }
    #preview-container { flex: 1; background: #ffffff; border-radius: 12px; overflow: hidden; min-height: 300px; position: relative; }
    #preview-container iframe { width: 100%; height: 100%; border: none; background: #fff; }
    #script-area { background: #1a1a2e; padding: 15px; border-radius: 10px; margin-top: 15px; min-height: 70px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; border: 2px dashed #2a2a4a; }
    #script-area .empty-hint { color: #666; font-size: 13px; }
    .script-block { background: #00d2d3; color: #0f0f1a; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
    .script-block .remove { cursor: pointer; background: #ff4757; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #fff; transition: 0.2s; }
    .script-block .remove:hover { transform: scale(1.2); }
    #controls { display: flex; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
    #controls button { background: #00d2d3; border: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 16px; cursor: pointer; transition: 0.2s; color: #0f0f1a; }
    #controls button:hover { transform: scale(1.05); background: #01a3a4; }
    #controls button.secondary { background: #2a2a4a; color: #fff; }
    #controls button.secondary:hover { background: #3a3a5a; }
    #controls button.danger { background: #ff4757; color: #fff; }
    #controls button.danger:hover { background: #ff6b81; }
    #controls button.game { background: #ff6b6b; color: #fff; }
    #controls button.game:hover { background: #ee5a24; }
    #code-output { background: #1a1a2e; padding: 15px; border-radius: 10px; margin-top: 10px; display: none; max-height: 250px; overflow-y: auto; font-family: 'Courier New', monospace; font-size: 12px; color: #00ff88; border: 1px solid #2a2a4a; white-space: pre-wrap; word-break: break-all; }
    #status { color: #888; font-size: 13px; margin-top: 8px; }
    @media (max-width: 768px) { #palette { width: 160px; padding: 12px; } .block-item { font-size: 12px; padding: 10px 12px; } }
  </style>
</head>
<body>

<!-- Палитра блоков -->
<div id="palette">
  <h3>🧩 Блоки</h3>
  <div class="block-item" draggable="true" data-block="button">
    <span class="icon">🔘</span> Кнопка
  </div>
  <div class="block-item" draggable="true" data-block="text">
    <span class="icon">📝</span> Текст
  </div>
  <div class="block-item" draggable="true" data-block="image">
    <span class="icon">🖼️</span> Картинка
  </div>
  <div class="block-item" draggable="true" data-block="input">
    <span class="icon">✏️</span> Поле ввода
  </div>
  <div class="block-item" draggable="true" data-block="container">
    <span class="icon">📦</span> Контейнер
  </div>
  <div class="block-item" draggable="true" data-block="game">
    <span class="icon">🎮</span> Игра (кликер)
  </div>
  <div style="margin-top:30px; border-top:1px solid #2a2a4a; padding-top:20px; color:#666; font-size:12px;">
    💡 Перетащи блок<br>в область ниже
  </div>
</div>

<!-- Рабочая область -->
<div id="workspace">
  <div id="preview-container">
    <iframe id="preview" srcdoc="<html><body style='font-family:sans-serif;padding:20px;color:#333;'><h2>👋 Собери сайт!</h2><p style='color:#888;'>Перетащи блоки из панели слева</p></body></html>"></iframe>
  </div>
  
  <div id="script-area">
    <span class="empty-hint">📋 Брось блок сюда, чтобы добавить на сайт</span>
  </div>
  
  <div id="controls">
    <button id="run-btn">🚀 Опубликовать</button>
    <button id="export-btn" class="secondary">📦 Экспорт HTML</button>
    <button id="clear-btn" class="danger">🗑️ Очистить</button>
  </div>
  
  <div id="status">✅ Готово</div>
  <div id="code-output"></div>
</div>

<script>
// ============================================
// ВСЯ ЛОГИКА ФРОНТЕНДА
// ============================================
const scriptArea = document.getElementById('script-area');
const scriptBlocks = [];
let elementIdCounter = 0;

// Блоки из палитры
document.querySelectorAll('.block-item').forEach(block => {
  block.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('blockType', block.dataset.block);
  });
});

scriptArea.addEventListener('dragover', (e) => e.preventDefault());

scriptArea.addEventListener('drop', (e) => {
  e.preventDefault();
  const blockType = e.dataTransfer.getData('blockType');
  if (!blockType) return;
  
  scriptBlocks.push({ 
    type: blockType, 
    id: ++elementIdCounter,
    props: getDefaultProps(blockType)
  });
  
  renderScript();
  renderPreview();
  document.getElementById('status').textContent = '✅ Блок добавлен!';
});

function getDefaultProps(type) {
  switch(type) {
    case 'button': return { text: 'Нажми меня!', color: '#00d2d3' };
    case 'text': return { content: 'Привет, мир!', size: '18px' };
    case 'image': return { src: 'https://via.placeholder.com/200x150/00d2d3/fff?text=Image' };
    case 'input': return { placeholder: 'Введите текст...' };
    case 'container': return { bg: '#f5f5f5', padding: '20px' };
    case 'game': return { title: 'Кликер', target: 10 };
    default: return {};
  }
}

function removeBlock(index) {
  scriptBlocks.splice(index, 1);
  renderScript();
  renderPreview();
  document.getElementById('status').textContent = '🗑️ Блок удалён';
}

function renderScript() {
  scriptArea.innerHTML = '';
  
  if (scriptBlocks.length === 0) {
    scriptArea.innerHTML = '<span class="empty-hint">📋 Брось блок сюда, чтобы добавить на сайт</span>';
    return;
  }
  
  scriptBlocks.forEach((block, index) => {
    const div = document.createElement('div');
    div.className = 'script-block';
    const labels = {
      button: \`🔘 \${block.props.text || 'Кнопка'}\`,
      text: \`📝 \${block.props.content || 'Текст'}\`,
      image: '🖼️ Картинка',
      input: \`✏️ \${block.props.placeholder || 'Поле ввода'}\`,
      container: '📦 Контейнер',
      game: '🎮 Игра'
    };
    div.innerHTML = \`
      \${labels[block.type] || block.type}
      <span class="remove" data-index="\${index}">✕</span>
    \`;
    scriptArea.appendChild(div);
  });
  
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      removeBlock(idx);
    });
  });
}

// ============================================
// ГЕНЕРАЦИЯ HTML (сайты, игры, приложения)
// ============================================
function generateHTML() {
  let html = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сайт от Атом Билдер</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #f8f9fa; display: flex; flex-direction: column; gap: 16px; max-width: 800px; margin: 0 auto; }
    .atom-btn { background: #00d2d3; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.2s; }
    .atom-btn:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(0,210,211,0.3); }
    .atom-text { font-size: 18px; color: #333; line-height: 1.6; }
    .atom-image { max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .atom-input { padding: 10px 16px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; transition: 0.2s; }
    .atom-input:focus { border-color: #00d2d3; outline: none; box-shadow: 0 0 0 3px rgba(0,210,211,0.2); }
    .atom-container { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 12px; }
    .game-container { text-align: center; padding: 40px; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .game-btn { background: #ff6b6b; color: #fff; border: none; padding: 20px 40px; border-radius: 12px; font-size: 24px; cursor: pointer; transition: 0.2s; }
    .game-btn:hover { transform: scale(1.1); }
    .game-score { font-size: 48px; font-weight: bold; color: #333; margin: 20px 0; }
  </style>
</head>
<body>\`;
  
  scriptBlocks.forEach(block => {
    switch(block.type) {
      case 'button':
        html += \`<button class="atom-btn" onclick="alert('Привет от Атом Билдер!')">\${block.props.text}</button>\`;
        break;
      case 'text':
        html += \`<div class="atom-text">\${block.props.content}</div>\`;
        break;
      case 'image':
        html += \`<img class="atom-image" src="\${block.props.src}" alt="image" />\`;
        break;
      case 'input':
        html += \`<input class="atom-input" type="text" placeholder="\${block.props.placeholder}" />\`;
        break;
      case 'container':
        html += \`<div class="atom-container">📦 Контейнер (блоки внутри)</div>\`;
        break;
      case 'game':
        html += \`
          <div class="game-container">
            <h2>🎮 \${block.props.title}</h2>
            <div class="game-score" id="scoreDisplay">0</div>
            <button class="game-btn" onclick="clickGame()">👆 Нажми меня!</button>
            <p style="margin-top: 15px; color: #888;">Цель: \${block.props.target} кликов</p>
          </div>
          <script>
            let score = 0;
            const target = \${block.props.target};
            function clickGame() {
              score++;
              document.getElementById('scoreDisplay').textContent = score;
              if (score >= target) {
                alert('🎉 Победа! Ты набрал ' + score + ' кликов!');
                score = 0;
                document.getElementById('scoreDisplay').textContent = '0';
              }
            }
          <\/script>
        \`;
        break;
    }
  });
  
  html += \`</body></html>\`;
  return html;
}

function renderPreview() {
  const html = generateHTML();
  document.getElementById('preview').srcdoc = html;
}

// ============================================
// КНОПКИ УПРАВЛЕНИЯ
// ============================================
document.getElementById('run-btn').addEventListener('click', () => {
  renderPreview();
  document.getElementById('status').textContent = '🚀 Сайт опубликован!';
  showCode();
});

document.getElementById('export-btn').addEventListener('click', () => {
  const html = generateHTML();
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'atom-site.html';
  a.click();
  URL.revokeObjectURL(url);
  document.getElementById('status').textContent = '📦 Файл скачан!';
});

document.getElementById('clear-btn').addEventListener('click', () => {
  scriptBlocks.length = 0;
  elementIdCounter = 0;
  renderScript();
  renderPreview();
  document.getElementById('code-output').style.display = 'none';
  document.getElementById('status').textContent = '🗑️ Всё очищено';
});

function showCode() {
  const output = document.getElementById('code-output');
  const html = generateHTML();
  output.textContent = html;
  output.style.display = 'block';
}

// Инициализация
renderScript();
renderPreview();
console.log('✅ Атом Билдер PRO загружен!');
</script>
</body>
</html>
  `);
});

// ============================================
// API ДЛЯ ГЕНЕРАЦИИ (для внешних запросов)
// ============================================
app.post('/api/generate', (req, res) => {
  const { blocks } = req.body;
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Атом сайт</title><style>body{font-family:sans-serif;padding:20px;background:#f8f9fa;}</style></head><body>`;
  blocks.forEach(b => {
    if (b.type === 'button') html += `<button style="background:#00d2d3;color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;">${b.props.text}</button>`;
    else if (b.type === 'text') html += `<p>${b.props.content}</p>`;
    else if (b.type === 'image') html += `<img src="${b.props.src}" style="max-width:100%;border-radius:8px;" />`;
    else if (b.type === 'input') html += `<input placeholder="${b.props.placeholder}" style="padding:10px 16px;border:2px solid #ddd;border-radius:8px;" />`;
    else if (b.type === 'container') html += `<div style="background:#f5f5f5;padding:20px;border-radius:12px;">Контейнер</div>`;
    else if (b.type === 'game') html += `<div style="text-align:center;padding:40px;"><h2>🎮 ${b.props.title}</h2><button onclick="let s=0;this.onclick=()=>{s++;this.textContent='Кликов: '+s;if(s>=${b.props.target})alert('Победа!');}">Кликер</button></div>`;
  });
  html += `</body></html>`;
  res.json({ html });
});

// ============================================
// ЗАПУСК
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Атом Билдер PRO запущен на http://localhost:${PORT}`);
  console.log(`📦 Теперь можно создавать сайты, игры и приложения!`);
});
