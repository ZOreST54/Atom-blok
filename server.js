const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// ═══════════════════════════════════════════════════════════════
//  ГЛАВНАЯ СТРАНИЦА — КОНСТРУКТОР С AI
// ═══════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Атом Билдер AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
  <style>
    /* ── RESET ── */
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#07070d; display:flex; height:100vh; color:#fff; overflow:hidden; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:#111; }
    ::-webkit-scrollbar-thumb { background:linear-gradient(180deg,#00d4ff,#7b2ffc); border-radius:4px; }

    /* ── ПАЛИТРА ── */
    #palette {
      width:280px;
      background:linear-gradient(145deg,#0d0d1a,#07070d);
      padding:24px 16px;
      border-right:1px solid rgba(255,255,255,0.04);
      overflow-y:auto;
      flex-shrink:0;
    }
    #palette h3 {
      font-size:11px;
      text-transform:uppercase;
      letter-spacing:2px;
      color:rgba(255,255,255,0.2);
      margin-bottom:20px;
      padding-bottom:12px;
      border-bottom:1px solid rgba(255,255,255,0.04);
    }
    .block-item {
      background:rgba(255,255,255,0.03);
      padding:12px 16px;
      border-radius:12px;
      margin:4px 0;
      cursor:grab;
      border:1px solid rgba(255,255,255,0.04);
      transition:all 0.25s;
      user-select:none;
      display:flex;
      align-items:center;
      gap:12px;
      font-size:13px;
      font-weight:500;
      color:rgba(255,255,255,0.7);
    }
    .block-item:hover {
      background:rgba(255,255,255,0.07);
      border-color:rgba(0,212,255,0.2);
      transform:translateX(4px);
    }
    .block-item:active { cursor:grabbing; transform:scale(0.96); }
    .block-item .icon { font-size:18px; width:28px; text-align:center; }
    .block-item .badge {
      margin-left:auto;
      font-size:8px;
      text-transform:uppercase;
      letter-spacing:0.5px;
      padding:2px 10px;
      border-radius:20px;
      background:rgba(0,212,255,0.1);
      color:#00d4ff;
      border:1px solid rgba(0,212,255,0.05);
    }

    /* ── РАБОЧАЯ ОБЛАСТЬ ── */
    #workspace {
      flex:1;
      display:flex;
      flex-direction:column;
      padding:20px;
      background:#07070d;
      min-width:0;
    }
    #preview-container {
      flex:1;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      position:relative;
      box-shadow:0 20px 80px rgba(0,0,0,0.6);
    }
    #preview-container iframe {
      width:100%;
      height:100%;
      border:none;
      background:#fff;
    }

    /* ── СКРИПТЫ ── */
    #script-area {
      background:rgba(255,255,255,0.02);
      padding:14px 18px;
      border-radius:12px;
      margin-top:12px;
      min-height:64px;
      display:flex;
      flex-wrap:wrap;
      align-items:center;
      gap:8px;
      border:1px solid rgba(255,255,255,0.04);
    }
    #script-area .empty-hint { color:rgba(255,255,255,0.12); font-size:12px; }
    .script-block {
      background:linear-gradient(135deg,#00d4ff,#7b2ffc);
      color:#fff;
      padding:6px 16px;
      border-radius:30px;
      font-size:12px;
      font-weight:600;
      display:flex;
      align-items:center;
      gap:10px;
      animation:appear 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes appear { 0%{opacity:0;transform:scale(0.9);} 100%{opacity:1;transform:scale(1);} }
    .script-block .remove {
      cursor:pointer;
      background:rgba(255,255,255,0.15);
      border-radius:50%;
      width:20px;height:20px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:11px;
      transition:0.2s;
    }
    .script-block .remove:hover { background:rgba(255,71,87,0.8); }

    /* ── КНОПКИ ── */
    #controls {
      display:flex;
      gap:10px;
      margin-top:12px;
      flex-wrap:wrap;
    }
    #controls button {
      font-family:'Inter',sans-serif;
      font-weight:600;
      font-size:13px;
      padding:10px 24px;
      border:none;
      border-radius:30px;
      cursor:pointer;
      transition:all 0.25s;
      background:linear-gradient(135deg,#00d4ff,#7b2ffc);
      color:#fff;
    }
    #controls button:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,212,255,0.25); }
    #controls button.secondary { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.06); }
    #controls button.secondary:hover { background:rgba(255,255,255,0.1); color:#fff; }
    #controls button.danger { background:linear-gradient(135deg,#ff4757,#ff2d55); }
    #controls button.ai { background:linear-gradient(135deg,#7b2ffc,#00d4ff); position:relative; overflow:hidden; }
    #controls button.ai::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transform:translateX(-100%); animation:shimmer 2s infinite; }
    @keyframes shimmer { 100%{transform:translateX(100%);} }

    #status { color:rgba(255,255,255,0.15); font-size:11px; margin-top:10px; letter-spacing:0.3px; }
    #code-output {
      background:#0d0d1a;
      padding:14px;
      border-radius:12px;
      margin-top:10px;
      display:none;
      max-height:200px;
      overflow-y:auto;
      font-family:'Monaco',monospace;
      font-size:10px;
      color:#00ff88;
      border:1px solid rgba(255,255,255,0.03);
      white-space:pre-wrap;
      word-break:break-all;
    }

    /* ── AI-ЧАТ ── */
    #ai-chat {
      position:fixed;
      bottom:20px;
      right:20px;
      width:380px;
      max-height:500px;
      background:rgba(13,13,26,0.95);
      backdrop-filter:blur(20px);
      border-radius:20px;
      border:1px solid rgba(255,255,255,0.06);
      box-shadow:0 20px 60px rgba(0,0,0,0.8);
      display:none;
      flex-direction:column;
      z-index:1000;
      overflow:hidden;
    }
    #ai-chat.active { display:flex; }
    #ai-header {
      padding:16px 20px;
      background:linear-gradient(135deg,#00d4ff,#7b2ffc);
      display:flex;
      justify-content:space-between;
      align-items:center;
      font-weight:600;
      font-size:14px;
    }
    #ai-header button { background:none; border:none; color:#fff; font-size:18px; cursor:pointer; }
    #ai-messages {
      padding:16px;
      overflow-y:auto;
      flex:1;
      max-height:300px;
      min-height:200px;
    }
    #ai-messages .msg {
      margin-bottom:12px;
      padding:10px 14px;
      border-radius:12px;
      font-size:13px;
      line-height:1.5;
      max-width:85%;
    }
    #ai-messages .user { background:rgba(0,212,255,0.1); margin-left:auto; color:#fff; }
    #ai-messages .bot { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.8); }
    #ai-input-area {
      display:flex;
      gap:8px;
      padding:12px 16px;
      border-top:1px solid rgba(255,255,255,0.04);
    }
    #ai-input-area input {
      flex:1;
      padding:10px 14px;
      border-radius:30px;
      border:1px solid rgba(255,255,255,0.06);
      background:rgba(255,255,255,0.04);
      color:#fff;
      font-size:13px;
      outline:none;
    }
    #ai-input-area input:focus { border-color:#00d4ff; }
    #ai-input-area button {
      padding:10px 20px;
      border:none;
      border-radius:30px;
      background:linear-gradient(135deg,#00d4ff,#7b2ffc);
      color:#fff;
      font-weight:600;
      cursor:pointer;
    }
    #ai-toggle {
      position:fixed;
      bottom:20px;
      right:20px;
      width:56px;height:56px;
      border-radius:50%;
      background:linear-gradient(135deg,#00d4ff,#7b2ffc);
      border:none;
      color:#fff;
      font-size:24px;
      cursor:pointer;
      box-shadow:0 8px 30px rgba(0,212,255,0.3);
      z-index:999;
      transition:0.3s;
    }
    #ai-toggle:hover { transform:scale(1.05); }
  </style>
</head>
<body>

<!-- ═══ ПАЛИТРА ═══ -->
<div id="palette">
  <h3>🧩 БЛОКИ</h3>
  <div class="block-item" draggable="true" data-block="button"><span class="icon">◈</span> Кнопка</div>
  <div class="block-item" draggable="true" data-block="text"><span class="icon">◉</span> Текст</div>
  <div class="block-item" draggable="true" data-block="image"><span class="icon">◇</span> Изображение</div>
  <div class="block-item" draggable="true" data-block="input"><span class="icon">⊚</span> Поле ввода</div>
  <div class="block-item" draggable="true" data-block="container"><span class="icon">⊞</span> Контейнер</div>
  <div class="block-item" draggable="true" data-block="card"><span class="icon">▣</span> Карточка</div>
  <div class="block-item" draggable="true" data-block="grid"><span class="icon">▤</span> Сетка</div>
  <div class="block-item" draggable="true" data-block="form"><span class="icon">◫</span> Форма</div>
  <div class="block-item" draggable="true" data-block="table"><span class="icon">⊞</span> Таблица</div>
  <div class="block-item" draggable="true" data-block="chart"><span class="icon">◊</span> График</div>
  <div class="block-item" draggable="true" data-block="game"><span class="icon">✦</span> Игра</div>
  <div style="margin-top:20px;border-top:1px solid rgba(255,255,255,0.04);padding-top:16px;color:rgba(255,255,255,0.08);font-size:10px;letter-spacing:0.5px;">⟡ перетащи блок</div>
</div>

<!-- ═══ РАБОЧАЯ ОБЛАСТЬ ═══ -->
<div id="workspace">
  <div id="preview-container">
    <iframe id="preview" srcdoc="<!DOCTYPE html><html><head><style>body{font-family:'Inter',sans-serif;background:linear-gradient(145deg,#f5f7fa,#eef2f7);display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#1a1a2e;}</style></head><body><div style='text-align:center;'><div style='font-size:48px;font-weight:800;background:linear-gradient(135deg,#00d4ff,#7b2ffc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'>✦</div><h1 style='font-size:28px;font-weight:700;margin:12px 0 6px;'>Атом Билдер AI</h1><p style='color:#888;font-size:14px;'>собирай свои приложения из блоков</p><p style='color:#aaa;font-size:12px;margin-top:16px;'>перетащи блоки из панели слева</p></div></body></html>"></iframe>
  </div>

  <div id="script-area">
    <span class="empty-hint">⟡ бросьте блок сюда</span>
  </div>

  <div id="controls">
    <button id="run-btn">🚀 Опубликовать</button>
    <button id="export-btn" class="secondary">⬇ Экспорт</button>
    <button id="clear-btn" class="danger">✕ Очистить</button>
    <button id="ai-btn" class="ai">🤖 AI-помощник</button>
  </div>

  <div id="status">⟡ готово</div>
  <div id="code-output"></div>
</div>

<!-- ═══ AI-ЧАТ ═══ -->
<button id="ai-toggle">🤖</button>
<div id="ai-chat">
  <div id="ai-header">
    <span>🤖 AI-помощник</span>
    <button id="ai-close">✕</button>
  </div>
  <div id="ai-messages">
    <div class="msg bot">Привет! Я помогу тебе собрать приложение. Напиши, что хочешь создать.</div>
  </div>
  <div id="ai-input-area">
    <input id="ai-input" placeholder="Напиши, что создать..." />
    <button id="ai-send">→</button>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════════════
//  ЯДРО КОНСТРУКТОРА
// ═══════════════════════════════════════════════════════════════

const scriptArea = document.getElementById('script-area');
const scriptBlocks = [];
let idCounter = 0;
const preview = document.getElementById('preview');

// ── БЛОКИ ──
document.querySelectorAll('.block-item').forEach(b => {
  b.addEventListener('dragstart', e => e.dataTransfer.setData('blockType', b.dataset.block));
});
scriptArea.addEventListener('dragover', e => e.preventDefault());
scriptArea.addEventListener('drop', e => {
  e.preventDefault();
  const type = e.dataTransfer.getData('blockType');
  if (!type) return;
  scriptBlocks.push({ type, id: ++idCounter, props: defaultProps(type) });
  render();
  status('блок добавлен');
});

function defaultProps(type) {
  const map = {
    button: { text: 'Кнопка', color: '#00d4ff' },
    text: { content: 'Текст', size: '16px' },
    image: { src: 'https://picsum.photos/seed/atom/300/200' },
    input: { placeholder: 'введите...' },
    container: { bg: 'rgba(255,255,255,0.04)', padding: '20px' },
    card: { title: 'Карточка', content: 'Контент' },
    grid: { cols: '3' },
    form: { action: '/submit' },
    table: { rows: '3', cols: '3' },
    chart: { type: 'bar' },
    game: { title: 'Игра' }
  };
  return map[type] || {};
}

function removeBlock(i) { scriptBlocks.splice(i,1); render(); status('блок удалён'); }

function renderScript() {
  scriptArea.innerHTML = '';
  if (!scriptBlocks.length) {
    scriptArea.innerHTML = '<span class="empty-hint">⟡ бросьте блок сюда</span>';
    return;
  }
  scriptBlocks.forEach((b,i) => {
    const div = document.createElement('div');
    div.className = 'script-block';
    const labels = {
      button: `◈ ${b.props.text}`,
      text: `◉ ${b.props.content}`,
      image: '◇ Изображение',
      input: `⊚ ${b.props.placeholder}`,
      container: '⊞ Контейнер',
      card: `▣ ${b.props.title}`,
      grid: '▤ Сетка',
      form: '◫ Форма',
      table: '⊞ Таблица',
      chart: '◊ График',
      game: '✦ Игра'
    };
    div.innerHTML = `${labels[b.type] || b.type} <span class="remove" data-i="${i}">✕</span>`;
    scriptArea.appendChild(div);
  });
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => removeBlock(parseInt(btn.dataset.i)));
  });
}

function status(msg) {
  document.getElementById('status').textContent = `⟡ ${msg}`;
}

// ── ГЕНЕРАЦИЯ КОДА ──
function generateHTML() {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Моё приложение</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#f5f7fa; min-height:100vh; padding:20px; color:#1a1a2e; }
    .container { max-width:1200px; margin:0 auto; }
    .glass { background:rgba(255,255,255,0.7); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.3); border-radius:16px; padding:20px; }
    .btn { background:linear-gradient(135deg,#00d4ff,#7b2ffc); color:#fff; border:none; padding:12px 24px; border-radius:30px; font-weight:600; cursor:pointer; transition:0.25s; }
    .btn:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,212,255,0.25); }
    .input { padding:12px 16px; border:1px solid rgba(0,0,0,0.06); border-radius:30px; font-size:14px; width:100%; max-width:300px; outline:none; transition:0.2s; }
    .input:focus { border-color:#00d4ff; box-shadow:0 0 0 4px rgba(0,212,255,0.05); }
    .grid { display:grid; gap:16px; }
    .card { background:#fff; border-radius:16px; padding:20px; box-shadow:0 4px 20px rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.02); }
    .card h3 { font-size:18px; margin-bottom:8px; }
    table { width:100%; border-collapse:collapse; background:#fff; border-radius:12px; overflow:hidden; }
    th, td { padding:12px 16px; text-align:left; border-bottom:1px solid rgba(0,0,0,0.04); }
    th { background:rgba(0,0,0,0.02); font-weight:600; }
  </style>
</head>
<body>
<div class="container">`;

  scriptBlocks.forEach(block => {
    switch(block.type) {
      case 'button':
        html += `<button class="btn" style="margin:8px;" onclick="alert('Клик!')">${block.props.text}</button>`;
        break;
      case 'text':
        html += `<div style="font-size:${block.props.size};padding:8px 0;color:#1a1a2e;">${block.props.content}</div>`;
        break;
      case 'image':
        html += `<img src="${block.props.src}" style="max-width:100%;border-radius:12px;margin:8px 0;" />`;
        break;
      case 'input':
        html += `<input class="input" type="text" placeholder="${block.props.placeholder}" style="margin:8px 0;" />`;
        break;
      case 'container':
        html += `<div class="glass" style="margin:8px 0;background:${block.props.bg};padding:${block.props.padding};">Контейнер</div>`;
        break;
      case 'card':
        html += `<div class="card"><h3>${block.props.title}</h3><p>${block.props.content}</p></div>`;
        break;
      case 'grid':
        html += `<div class="grid" style="grid-template-columns:repeat(${block.props.cols},1fr);">
          ${Array.from({length: parseInt(block.props.cols)||3}, (_,i) => `<div class="card" style="min-height:80px;">${i+1}</div>`).join('')}
        </div>`;
        break;
      case 'form':
        html += `<form class="glass" style="padding:24px;display:flex;flex-direction:column;gap:12px;max-width:400px;margin:8px 0;">
          <input class="input" placeholder="Имя" /><input class="input" placeholder="Email" type="email" />
          <button class="btn" type="submit">Отправить</button>
        </form>`;
        break;
      case 'table':
        const rows = parseInt(block.props.rows)||3, cols = parseInt(block.props.cols)||3;
        html += `<table><thead><tr>${Array.from({length: cols}, (_,i) => `<th>Заголовок ${i+1}</th>`).join('')}</tr></thead><tbody>
          ${Array.from({length: rows}, () => `<tr>${Array.from({length: cols}, () => `<td>Данные</td>`).join('')}</tr>`).join('')}
        </tbody></table>`;
        break;
      case 'chart':
        html += `<div class="glass" style="padding:20px;height:200px;display:flex;align-items:flex-end;gap:8px;margin:8px 0;">
          ${[35,48,22,68,54,72,40,90,55,70,45,85].map(v => `<div style="flex:1;background:linear-gradient(180deg,#00d4ff,#7b2ffc);border-radius:4px;height:${v}%;min-height:12px;"></div>`).join('')}
        </div>`;
        break;
      case 'game':
        html += `
          <div class="glass" style="text-align:center;padding:30px;">
            <h3>🎮 ${block.props.title}</h3>
            <div style="font-size:48px;margin:16px 0;" id="gameScore">0</div>
            <button class="btn" onclick="gameClick()">Кликни меня!</button>
          </div>
          <script>
            let score = 0;
            function gameClick() {
              score++;
              document.getElementById('gameScore').textContent = score;
              if (score % 10 === 0) alert('🎉 Уровень ' + (score/10));
            }
          <\/script>
        `;
        break;
    }
  });

  html += `</div></body></html>`;
  return html;
}

function renderPreview() {
  preview.srcdoc = generateHTML();
}

// ── УПРАВЛЕНИЕ ──
document.getElementById('run-btn').addEventListener('click', () => {
  renderPreview();
  status('опубликовано');
  document.getElementById('code-output').style.display = 'none';
});

document.getElementById('export-btn').addEventListener('click', () => {
  const blob = new Blob([generateHTML()], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'app.html';
  a.click();
  status('экспортировано');
});

document.getElementById('clear-btn').addEventListener('click', () => {
  scriptBlocks.length = 0;
  idCounter = 0;
  render();
  document.getElementById('code-output').style.display = 'none';
  status('очищено');
});

// ── ПОКАЗ КОДА ──
let codeVisible = false;
document.getElementById('preview-container').addEventListener('dblclick', () => {
  const out = document.getElementById('code-output');
  if (codeVisible) { out.style.display = 'none'; codeVisible = false; }
  else { out.textContent = generateHTML(); out.style.display = 'block'; codeVisible = true; }
});

// ── AI-ПОМОЩНИК ──
const aiToggle = document.getElementById('ai-toggle');
const aiChat = document.getElementById('ai-chat');
const aiClose = document.getElementById('ai-close');
const aiInput = document.getElementById('ai-input');
const aiSend = document.getElementById('ai-send');
const aiMessages = document.getElementById('ai-messages');

aiToggle.addEventListener('click', () => {
  aiChat.classList.toggle('active');
  aiToggle.style.display = aiChat.classList.contains('active') ? 'none' : 'flex';
});

aiClose.addEventListener('click', () => {
  aiChat.classList.remove('active');
  aiToggle.style.display = 'flex';
});

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.textContent = text;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function aiResponse(query) {
  const blocks = scriptBlocks.map(b => b.type).join(', ') || 'пока нет блоков';
  const responses = [
    `У тебя сейчас блоки: ${blocks}. Добавь карточку для контента или форму для ввода.`,
    `Попробуй собрать страницу из карточек, кнопок и текста — получится отличный лендинг.`,
    `Чтобы сделать таблицу — перетащи блок "Таблица", настрой rows и cols.`,
    `Хочешь игру? Добавь блок "Игра" — получится простой кликер.`,
    `Для красивого дизайна используй "Контейнер" с фоном и "Карточки".`,
    `Ты можешь создавать: лендинги, дашборды, формы, таблицы, игры, презентации.`,
    `Блок "Сетка" помогает располагать элементы в несколько колонок.`,
    `Добавь "График" — он покажет визуализацию данных.`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

aiSend.addEventListener('click', () => {
  const text = aiInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  aiInput.value = '';
  setTimeout(() => {
    addMessage(aiResponse(text), 'bot');
  }, 400);
});

aiInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') aiSend.click();
});

// ── РЕНДЕР ──
function render() {
  renderScript();
  renderPreview();
}

render();
status('готово. Перетащи блоки или спроси AI');
console.log('✦ Атом Билдер AI загружен');
</script>
</body>
</html>`);
});

// ═══════════════════════════════════════════════════════════════
//  API
// ═══════════════════════════════════════════════════════════════
app.post('/api/generate', (req, res) => {
  const { blocks } = req.body;
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Приложение</title><style>body{font-family:'Inter',sans-serif;padding:20px;background:#f5f7fa;}</style></head><body>`;
  blocks.forEach(b => {
    if (b.type === 'button') html += `<button style="padding:12px 24px;background:#00d4ff;border:none;border-radius:30px;color:#fff;">${b.props.text}</button>`;
    else if (b.type === 'text') html += `<p>${b.props.content}</p>`;
    else if (b.type === 'image') html += `<img src="${b.props.src}" style="max-width:100%;" />`;
    else if (b.type === 'input') html += `<input placeholder="${b.props.placeholder}" style="padding:12px;border-radius:30px;border:1px solid #ddd;" />`;
    else if (b.type === 'container') html += `<div style="background:${b.props.bg};padding:${b.props.padding};border-radius:12px;">Контейнер</div>`;
    else if (b.type === 'card') html += `<div style="background:#fff;padding:20px;border-radius:12px;"><h3>${b.props.title}</h3><p>${b.props.content}</p></div>`;
    else if (b.type === 'game') html += `<div style="text-align:center;padding:30px;"><h3>${b.props.title}</h3><div id="s">0</div><button onclick="document.getElementById('s').textContent++">Клик</button></div>`;
    else html += `<div>${b.type}</div>`;
  });
  html += `</body></html>`;
  res.json({ html });
});

app.listen(PORT, () => {
  console.log(`✦ Атом Билдер AI запущен на http://localhost:${PORT}`);
  console.log(`⟡ Создавай свои приложения из блоков + AI-помощник`);
});
