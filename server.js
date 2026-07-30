const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// ═══════════════════════════════════════════════════════════════
//  ГЛАВНАЯ СТРАНИЦА
// ═══════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Атом Билдер AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#07070d; display:flex; height:100vh; color:#fff; overflow:hidden; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:#111; }
    ::-webkit-scrollbar-thumb { background:linear-gradient(180deg,#00d4ff,#7b2ffc); border-radius:4px; }
    
    #palette { width:260px; background:linear-gradient(145deg,#0d0d1a,#07070d); padding:20px 14px; border-right:1px solid rgba(255,255,255,0.04); overflow-y:auto; flex-shrink:0; }
    #palette h3 { font-size:10px; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,0.2); margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.04); }
    .block-item { background:rgba(255,255,255,0.03); padding:10px 14px; border-radius:10px; margin:4px 0; cursor:grab; border:1px solid rgba(255,255,255,0.04); transition:all 0.2s; user-select:none; display:flex; align-items:center; gap:10px; font-size:13px; font-weight:500; color:rgba(255,255,255,0.7); }
    .block-item:hover { background:rgba(255,255,255,0.07); border-color:rgba(0,212,255,0.2); transform:translateX(4px); }
    .block-item:active { cursor:grabbing; transform:scale(0.96); }
    .block-item .icon { font-size:16px; width:24px; text-align:center; }
    
    #workspace { flex:1; display:flex; flex-direction:column; padding:16px; background:#07070d; min-width:0; }
    #preview-container { flex:1; background:#ffffff; border-radius:14px; overflow:hidden; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.6); }
    #preview-container iframe { width:100%; height:100%; border:none; background:#fff; }
    
    #script-area { background:rgba(255,255,255,0.02); padding:12px 16px; border-radius:10px; margin-top:10px; min-height:56px; display:flex; flex-wrap:wrap; align-items:center; gap:8px; border:1px solid rgba(255,255,255,0.04); }
    #script-area .empty-hint { color:rgba(255,255,255,0.12); font-size:12px; }
    .script-block { background:linear-gradient(135deg,#00d4ff,#7b2ffc); color:#fff; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:600; display:flex; align-items:center; gap:8px; animation:appear 0.25s; }
    @keyframes appear { 0%{opacity:0;transform:scale(0.9);} 100%{opacity:1;transform:scale(1);} }
    .script-block .remove { cursor:pointer; background:rgba(255,255,255,0.15); border-radius:50%; width:18px;height:18px; display:flex; align-items:center; justify-content:center; font-size:10px; transition:0.2s; }
    .script-block .remove:hover { background:rgba(255,71,87,0.8); }
    
    #controls { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
    #controls button { font-family:'Inter',sans-serif; font-weight:600; font-size:12px; padding:8px 20px; border:none; border-radius:20px; cursor:pointer; transition:all 0.2s; background:linear-gradient(135deg,#00d4ff,#7b2ffc); color:#fff; }
    #controls button:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(0,212,255,0.2); }
    #controls button.secondary { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.06); }
    #controls button.secondary:hover { background:rgba(255,255,255,0.1); color:#fff; }
    #controls button.danger { background:linear-gradient(135deg,#ff4757,#ff2d55); }
    #controls button.ai { background:linear-gradient(135deg,#7b2ffc,#00d4ff); }
    
    #status { color:rgba(255,255,255,0.12); font-size:10px; margin-top:8px; letter-spacing:0.3px; }
    #code-output { background:#0d0d1a; padding:12px; border-radius:10px; margin-top:8px; display:none; max-height:160px; overflow-y:auto; font-family:monospace; font-size:10px; color:#00ff88; border:1px solid rgba(255,255,255,0.03); white-space:pre-wrap; word-break:break-all; }
    
    #ai-toggle { position:fixed; bottom:16px; right:16px; width:48px;height:48px; border-radius:50%; background:linear-gradient(135deg,#00d4ff,#7b2ffc); border:none; color:#fff; font-size:20px; cursor:pointer; box-shadow:0 8px 25px rgba(0,212,255,0.25); z-index:999; transition:0.3s; }
    #ai-toggle:hover { transform:scale(1.05); }
    #ai-chat { position:fixed; bottom:72px; right:16px; width:340px; max-height:440px; background:rgba(13,13,26,0.96); backdrop-filter:blur(20px); border-radius:16px; border:1px solid rgba(255,255,255,0.06); box-shadow:0 20px 60px rgba(0,0,0,0.8); display:none; flex-direction:column; z-index:1000; overflow:hidden; }
    #ai-chat.active { display:flex; }
    #ai-header { padding:12px 16px; background:linear-gradient(135deg,#00d4ff,#7b2ffc); display:flex; justify-content:space-between; align-items:center; font-weight:600; font-size:13px; }
    #ai-header button { background:none; border:none; color:#fff; font-size:16px; cursor:pointer; }
    #ai-messages { padding:12px; overflow-y:auto; flex:1; max-height:240px; min-height:160px; }
    #ai-messages .msg { margin-bottom:8px; padding:8px 12px; border-radius:10px; font-size:12px; line-height:1.4; max-width:85%; }
    #ai-messages .user { background:rgba(0,212,255,0.1); margin-left:auto; color:#fff; }
    #ai-messages .bot { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.75); }
    #ai-input-area { display:flex; gap:6px; padding:8px 12px; border-top:1px solid rgba(255,255,255,0.04); }
    #ai-input-area input { flex:1; padding:8px 12px; border-radius:20px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.04); color:#fff; font-size:12px; outline:none; }
    #ai-input-area input:focus { border-color:#00d4ff; }
    #ai-input-area button { padding:8px 16px; border:none; border-radius:20px; background:linear-gradient(135deg,#00d4ff,#7b2ffc); color:#fff; font-weight:600; cursor:pointer; font-size:12px; }
  </style>
</head>
<body>

<div id="palette">
  <h3>БЛОКИ</h3>
  <div class="block-item" draggable="true" data-block="button"><span class="icon">◈</span> Кнопка</div>
  <div class="block-item" draggable="true" data-block="text"><span class="icon">◉</span> Текст</div>
  <div class="block-item" draggable="true" data-block="image"><span class="icon">◇</span> Картинка</div>
  <div class="block-item" draggable="true" data-block="input"><span class="icon">⊚</span> Поле ввода</div>
  <div class="block-item" draggable="true" data-block="container"><span class="icon">⊞</span> Контейнер</div>
  <div class="block-item" draggable="true" data-block="card"><span class="icon">▣</span> Карточка</div>
  <div class="block-item" draggable="true" data-block="grid"><span class="icon">▤</span> Сетка</div>
  <div class="block-item" draggable="true" data-block="form"><span class="icon">◫</span> Форма</div>
  <div class="block-item" draggable="true" data-block="table"><span class="icon">⊞</span> Таблица</div>
  <div class="block-item" draggable="true" data-block="chart"><span class="icon">◊</span> График</div>
  <div class="block-item" draggable="true" data-block="game"><span class="icon">✦</span> Игра</div>
  <div style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.04);padding-top:12px;color:rgba(255,255,255,0.06);font-size:9px;">перетащи блок в область снизу</div>
</div>

<div id="workspace">
  <div id="preview-container">
    <iframe id="preview" srcdoc="<html><head><style>body{font-family:'Inter',sans-serif;background:linear-gradient(145deg,#f5f7fa,#eef2f7);display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#1a1a2e;}</style></head><body><div style='text-align:center;'><div style='font-size:40px;font-weight:800;background:linear-gradient(135deg,#00d4ff,#7b2ffc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'>✦</div><h1 style='font-size:24px;font-weight:700;margin:8px 0 4px;'>Атом Билдер AI</h1><p style='color:#888;font-size:13px;'>собирай свои приложения из блоков</p></div></body></html>"></iframe>
  </div>

  <div id="script-area">
    <span class="empty-hint">бросьте блок сюда</span>
  </div>

  <div id="controls">
    <button id="run-btn">▶ Опубликовать</button>
    <button id="export-btn" class="secondary">⬇ Экспорт</button>
    <button id="clear-btn" class="danger">✕ Очистить</button>
    <button id="ai-btn" class="ai">🤖 AI</button>
  </div>

  <div id="status">готово</div>
  <div id="code-output"></div>
</div>

<button id="ai-toggle">🤖</button>
<div id="ai-chat">
  <div id="ai-header"><span>🤖 AI-помощник</span><button id="ai-close">✕</button></div>
  <div id="ai-messages"><div class="msg bot">Привет! Напиши, что хочешь создать.</div></div>
  <div id="ai-input-area"><input id="ai-input" placeholder="Напиши..." /><button id="ai-send">→</button></div>
</div>

<script>
const scriptArea = document.getElementById('script-area');
const scriptBlocks = [];
let idCounter = 0;

document.querySelectorAll('.block-item').forEach(b => {
  b.addEventListener('dragstart', e => e.dataTransfer.setData('blockType', b.dataset.block));
});
scriptArea.addEventListener('dragover', e => e.preventDefault());
scriptArea.addEventListener('drop', e => {
  e.preventDefault();
  const type = e.dataTransfer.getData('blockType');
  if (!type) return;
  scriptBlocks.push({ type, id: ++idCounter, props: getProps(type) });
  renderAll();
});

function getProps(type) {
  const map = {
    button: { text: 'Кнопка' },
    text: { content: 'Мой текст', size: '16px' },
    image: { src: 'https://picsum.photos/seed/atom/300/200' },
    input: { placeholder: 'введите...' },
    container: { bg: 'rgba(255,255,255,0.04)', padding: '16px' },
    card: { title: 'Заголовок', content: 'Текст карточки' },
    grid: { cols: '3' },
    form: { action: '/' },
    table: { rows: '3', cols: '3' },
    chart: { type: 'bar' },
    game: { title: 'Моя игра' }
  };
  return map[type] || {};
}

function removeBlock(i) { scriptBlocks.splice(i,1); renderAll(); }

function renderScript() {
  scriptArea.innerHTML = '';
  if (!scriptBlocks.length) { scriptArea.innerHTML = '<span class="empty-hint">бросьте блок сюда</span>'; return; }
  scriptBlocks.forEach((b,i) => {
    const div = document.createElement('div');
    div.className = 'script-block';
    const labels = {
      button: '◈ ' + b.props.text,
      text: '◉ ' + b.props.content,
      image: '◇ Картинка',
      input: '⊚ ' + b.props.placeholder,
      container: '⊞ Контейнер',
      card: '▣ ' + b.props.title,
      grid: '▤ Сетка',
      form: '◫ Форма',
      table: '⊞ Таблица',
      chart: '◊ График',
      game: '✦ ' + b.props.title
    };
    div.innerHTML = (labels[b.type] || b.type) + ' <span class="remove" data-i="'+i+'">✕</span>';
    scriptArea.appendChild(div);
  });
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => removeBlock(parseInt(btn.dataset.i)));
  });
}

function generateHTML() {
  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Моё приложение</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Inter",sans-serif;background:#f5f7fa;min-height:100vh;padding:20px;color:#1a1a2e;}.container{max-width:1200px;margin:0 auto;}.glass{background:rgba(255,255,255,0.7);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3);border-radius:12px;padding:16px;}.btn{background:linear-gradient(135deg,#00d4ff,#7b2ffc);color:#fff;border:none;padding:10px 20px;border-radius:24px;font-weight:600;cursor:pointer;transition:0.2s;}.btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,212,255,0.2);}.input{padding:10px 14px;border:1px solid rgba(0,0,0,0.06);border-radius:24px;font-size:14px;width:100%;max-width:280px;outline:none;}.input:focus{border-color:#00d4ff;}.grid{display:grid;gap:12px;}.card{background:#fff;border-radius:12px;padding:16px;box-shadow:0 4px 16px rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.02);}.card h3{font-size:16px;margin-bottom:6px;}table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;}th,td{padding:10px 14px;text-align:left;border-bottom:1px solid rgba(0,0,0,0.04);}th{background:rgba(0,0,0,0.02);font-weight:600;}</style></head><body><div class="container">';
  
  scriptBlocks.forEach(b => {
    switch(b.type) {
      case 'button': html += '<button class="btn" style="margin:6px;" onclick="alert(123)">'+b.props.text+'</button>'; break;
      case 'text': html += '<div style="font-size:'+b.props.size+';padding:6px 0;">'+b.props.content+'</div>'; break;
      case 'image': html += '<img src="'+b.props.src+'" style="max-width:100%;border-radius:10px;margin:6px 0;" />'; break;
      case 'input': html += '<input class="input" type="text" placeholder="'+b.props.placeholder+'" style="margin:6px 0;" />'; break;
      case 'container': html += '<div class="glass" style="background:'+b.props.bg+';padding:'+b.props.padding+';margin:6px 0;">Контейнер</div>'; break;
      case 'card': html += '<div class="card"><h3>'+b.props.title+'</h3><p>'+b.props.content+'</p></div>'; break;
      case 'grid': html += '<div class="grid" style="grid-template-columns:repeat('+b.props.cols+',1fr);">'+Array.from({length:parseInt(b.props.cols)||3}, (_,i) => '<div class="card" style="min-height:60px;">'+(i+1)+'</div>').join('')+'</div>'; break;
      case 'form': html += '<form class="glass" style="padding:16px;display:flex;flex-direction:column;gap:10px;max-width:360px;margin:6px 0;"><input class="input" placeholder="Имя" /><input class="input" placeholder="Email" type="email" /><button class="btn" type="submit">Отправить</button></form>'; break;
      case 'table': const r=parseInt(b.props.rows)||3, c=parseInt(b.props.cols)||3; html += '<table><thead><tr>'+Array.from({length:c}, (_,i) => '<th>Заголовок '+(i+1)+'</th>').join('')+'</tr></thead><tbody>'+Array.from({length:r}, () => '<tr>'+Array.from({length:c}, () => '<td>Данные</td>').join('')+'</tr>').join('')+'</tbody></table>'; break;
      case 'chart': html += '<div class="glass" style="padding:16px;height:160px;display:flex;align-items:flex-end;gap:6px;margin:6px 0;">'+[35,48,22,68,54,72,40,90,55,70,45,85].map(v => '<div style="flex:1;background:linear-gradient(180deg,#00d4ff,#7b2ffc);border-radius:4px;height:'+v+'%;min-height:10px;"></div>').join('')+'</div>'; break;
      case 'game': html += '<div class="glass" style="text-align:center;padding:24px;"><h3>🎮 '+b.props.title+'</h3><div style="font-size:40px;margin:12px 0;" id="gs">0</div><button class="btn" onclick="let s=document.getElementById(\\'gs\\');s.textContent=parseInt(s.textContent)+1;">Кликни</button></div>'; break;
    }
  });
  
  html += '</div></body></html>';
  return html;
}

function renderPreview() {
  document.getElementById('preview').srcdoc = generateHTML();
}

function renderAll() { renderScript(); renderPreview(); }

document.getElementById('run-btn').addEventListener('click', () => { renderPreview(); status('опубликовано'); });
document.getElementById('export-btn').addEventListener('click', () => {
  const blob = new Blob([generateHTML()], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'app.html';
  a.click();
  status('экспортировано');
});
document.getElementById('clear-btn').addEventListener('click', () => {
  scriptBlocks.length = 0; idCounter = 0;
  renderAll();
  document.getElementById('code-output').style.display = 'none';
  status('очищено');
});

let codeVisible = false;
document.getElementById('preview-container').addEventListener('dblclick', () => {
  const out = document.getElementById('code-output');
  if (codeVisible) { out.style.display = 'none'; codeVisible = false; }
  else { out.textContent = generateHTML(); out.style.display = 'block'; codeVisible = true; }
});

function status(msg) { document.getElementById('status').textContent = msg; }

// AI
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

function addMsg(text, type) {
  const div = document.createElement('div');
  div.className = 'msg ' + type;
  div.textContent = text;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function aiResponse(q) {
  const blocks = scriptBlocks.map(b => b.type).join(', ') || 'пока пусто';
  const tips = [
    'Попробуй добавить карточки для контента.',
    'Используй сетку для расположения элементов.',
    'Форма поможет собирать данные от пользователей.',
    'График визуализирует данные.',
    'Игра — простой кликер для развлечения.',
    'Таблица подходит для структурированных данных.',
    'Контейнер группирует блоки.',
    'Собери лендинг из кнопки, текста и картинки.',
    'Сейчас у тебя: ' + blocks + '. Добавь что-то ещё!'
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

aiSend.addEventListener('click', () => {
  const t = aiInput.value.trim();
  if (!t) return;
  addMsg(t, 'user');
  aiInput.value = '';
  setTimeout(() => { addMsg(aiResponse(t), 'bot'); }, 300);
});
aiInput.addEventListener('keydown', e => { if (e.key === 'Enter') aiSend.click(); });

renderAll();
console.log('Атом Билдер AI загружен');
<\/script>
</body>
</html>`;
  res.send(html);
});

// ═══════════════════════════════════════════════════════════════
//  API
// ═══════════════════════════════════════════════════════════════
app.post('/api/generate', (req, res) => {
  const { blocks } = req.body;
  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Приложение</title><style>body{font-family:"Inter",sans-serif;padding:20px;background:#f5f7fa;}</style></head><body>';
  blocks.forEach(b => {
    if (b.type === 'button') html += '<button style="padding:10px 20px;background:#00d4ff;border:none;border-radius:24px;color:#fff;">'+b.props.text+'</button>';
    else if (b.type === 'text') html += '<p>'+b.props.content+'</p>';
    else if (b.type === 'image') html += '<img src="'+b.props.src+'" style="max-width:100%;" />';
    else if (b.type === 'input') html += '<input placeholder="'+b.props.placeholder+'" style="padding:10px;border-radius:24px;border:1px solid #ddd;" />';
    else if (b.type === 'container') html += '<div style="background:'+b.props.bg+';padding:'+b.props.padding+';border-radius:12px;">Контейнер</div>';
    else if (b.type === 'card') html += '<div style="background:#fff;padding:16px;border-radius:12px;"><h3>'+b.props.title+'</h3><p>'+b.props.content+'</p></div>';
    else if (b.type === 'game') html += '<div style="text-align:center;padding:20px;"><h3>'+b.props.title+'</h3><div id="s">0</div><button onclick="document.getElementById(\\'s\\').textContent++">Клик</button></div>';
    else html += '<div>'+b.type+'</div>';
  });
  html += '</body></html>';
  res.json({ html });
});

app.listen(PORT, () => {
  console.log('Атом Билдер AI запущен на http://localhost:' + PORT);
});
