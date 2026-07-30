const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>🧩 Конструктор приложений</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0a0a1a;
      height: 100vh;
      display: flex;
      flex-direction: column;
      color: #fff;
      overflow: hidden;
    }

    /* Верхняя панель */
    #toolbar {
      background: #1a1a2e;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid #2a2a4a;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    #toolbar h1 { font-size: 18px; color: #00d2d3; }
    #toolbar button {
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
      font-size: 13px;
    }
    #toolbar .green { background: #00d2d3; color: #0a0a1a; }
    #toolbar .green:hover { transform: scale(1.05); }
    #toolbar .red { background: #ff4757; color: #fff; }
    #toolbar .red:hover { background: #ff6b81; }
    #toolbar .yellow { background: #ffd93d; color: #0a0a1a; }
    #toolbar .yellow:hover { background: #ffed4a; }
    #toolbar .status { color: #888; font-size: 13px; margin-left: auto; }

    /* Три вкладки */
    #tabs {
      display: flex;
      background: #1a1a2e;
      border-bottom: 2px solid #2a2a4a;
      flex-shrink: 0;
    }
    #tabs button {
      padding: 10px 24px;
      background: transparent;
      border: none;
      color: #888;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: 0.2s;
      border-bottom: 3px solid transparent;
    }
    #tabs button:hover { color: #fff; }
    #tabs button.active { color: #00d2d3; border-bottom-color: #00d2d3; }

    /* Основная область */
    #main {
      flex: 1;
      display: flex;
      min-height: 0;
    }

    /* ===== КОНСТРУКТОР ===== */
    #tab-builder {
      display: flex;
      flex: 1;
      padding: 10px;
      gap: 10px;
      min-height: 0;
    }
    
    /* Блоки */
    #blocks {
      width: 160px;
      background: #1a1a2e;
      border-radius: 12px;
      padding: 10px;
      border: 2px solid #2a2a4a;
      overflow-y: auto;
    }
    #blocks h4 { color: #00d2d3; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; }
    #blocks .b {
      background: #16213e;
      padding: 6px 10px;
      border-radius: 4px;
      margin: 3px 0;
      cursor: grab;
      font-size: 12px;
      border: 2px solid transparent;
      transition: 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    #blocks .b:hover { border-color: #00d2d3; }
    #blocks .b .dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }

    /* Скрипт */
    #script {
      flex: 1;
      background: #1a1a2e;
      border-radius: 12px;
      padding: 10px;
      border: 2px solid #2a2a4a;
      overflow-y: auto;
      min-height: 100px;
    }
    #script .empty { color: #666; text-align: center; padding: 30px; font-size: 14px; }
    #script .sb {
      background: #16213e;
      padding: 5px 12px;
      border-radius: 4px;
      margin: 3px 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      border: 2px solid #2a2a4a;
      cursor: pointer;
      transition: 0.2s;
    }
    #script .sb:hover { border-color: #ff4757; }
    #script .sb .del { color: #ff4757; font-weight: bold; margin-left: 4px; }

    /* Превью приложения */
    #preview {
      width: 320px;
      background: #1a1a2e;
      border-radius: 12px;
      padding: 10px;
      border: 2px solid #2a2a4a;
      display: flex;
      flex-direction: column;
    }
    #preview h4 { color: #00d2d3; margin-bottom: 6px; font-size: 12px; text-transform: uppercase; }
    #preview .phone {
      flex: 1;
      background: #f5f5f5;
      border-radius: 16px;
      padding: 15px;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
    }
    #preview .phone .el {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      color: #333;
      background: #fff;
      border: 1px solid #ddd;
      text-align: center;
    }
    #preview .phone .el.button {
      background: #00d2d3;
      color: #fff;
      border: none;
      cursor: pointer;
    }
    #preview .phone .el.button:hover { background: #01a3a4; }
    #preview .phone .el.input {
      text-align: left;
      background: #fff;
      border: 2px solid #ddd;
    }
    #preview .phone .el.input:focus { outline: none; border-color: #00d2d3; }
    #preview .phone .el.image { 
      background: #e8e8e8; 
      height: 60px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      color: #999;
    }
    #preview .phone .el.container {
      background: #e8e8e8;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    #preview .actions {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    #preview .actions button {
      flex: 1;
      padding: 6px;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      font-size: 12px;
    }

    /* ===== AI ===== */
    #tab-ai {
      display: none;
      flex: 1;
      padding: 20px;
      flex-direction: column;
      gap: 15px;
    }
    #tab-ai textarea {
      width: 100%;
      height: 120px;
      background: #1a1a2e;
      color: #fff;
      border: 2px solid #2a2a4a;
      border-radius: 10px;
      padding: 15px;
      font-size: 16px;
      resize: vertical;
      font-family: inherit;
    }
    #tab-ai textarea:focus { outline: none; border-color: #00d2d3; }
    #tab-ai .answer {
      background: #1a1a2e;
      border-radius: 10px;
      padding: 15px;
      border: 2px solid #2a2a4a;
      min-height: 100px;
      font-size: 15px;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    #tab-ai .answer .code {
      background: #0a0a1a;
      padding: 10px;
      border-radius: 6px;
      font-family: monospace;
      color: #00d2d3;
      display: block;
      margin: 5px 0;
    }

    /* ===== ЭКСПОРТ ===== */
    #tab-export {
      display: none;
      flex: 1;
      padding: 20px;
      flex-direction: column;
      gap: 15px;
    }
    #tab-export textarea {
      width: 100%;
      flex: 1;
      background: #1a1a2e;
      color: #00d2d3;
      border: 2px solid #2a2a4a;
      border-radius: 10px;
      padding: 15px;
      font-size: 13px;
      font-family: 'Courier New', monospace;
      resize: none;
    }
    #tab-export textarea:focus { outline: none; border-color: #00d2d3; }

    .hidden { display: none !important; }
  </style>
</head>
<body>

<!-- ===== ТУЛБАР ===== -->
<div id="toolbar">
  <h1>🧩 Конструктор приложений</h1>
  <button class="green" id="run-app">▶️ Запустить</button>
  <button class="red" id="clear-app">🗑️ Очистить</button>
  <button class="yellow" id="ai-btn">🤖 AI</button>
  <span class="status" id="status">✅ Готово</span>
</div>

<!-- ===== ВКЛАДКИ ===== -->
<div id="tabs">
  <button class="active" data-tab="builder">🧩 Конструктор</button>
  <button data-tab="ai">🤖 AI</button>
  <button data-tab="export">📦 Экспорт</button>
</div>

<!-- ===== ОСНОВНАЯ ОБЛАСТЬ ===== -->
<div id="main">

  <!-- КОНСТРУКТОР -->
  <div id="tab-builder">
    <div id="blocks">
      <h4>🧩 Элементы</h4>
      <div class="b" data-block='{"type":"button","text":"Кнопка"}'><span class="dot" style="background:#00d2d3;"></span> Кнопка</div>
      <div class="b" data-block='{"type":"text","text":"Привет!"}'><span class="dot" style="background:#9966FF;"></span> Текст</div>
      <div class="b" data-block='{"type":"input","placeholder":"Введите..."}'><span class="dot" style="background:#FF8C1A;"></span> Поле ввода</div>
      <div class="b" data-block='{"type":"image","src":"https://via.placeholder.com/100x60/00d2d3/fff?text=Image"}'><span class="dot" style="background:#4C97FF;"></span> Картинка</div>
      <div class="b" data-block='{"type":"container"}'><span class="dot" style="background:#FFAB19;"></span> Контейнер</div>
      <div class="b" data-block='{"type":"title","text":"Заголовок"}'><span class="dot" style="background:#ff4757;"></span> Заголовок</div>
    </div>

    <div id="script">
      <div class="empty">📋 Перетащи элементы сюда, чтобы собрать приложение</div>
    </div>

    <div id="preview">
      <h4>📱 Превью приложения</h4>
      <div class="phone" id="phone-preview">
        <div style="text-align:center;color:#999;padding:20px;">👆 Собери приложение</div>
      </div>
      <div class="actions">
        <button class="green" id="run-preview">▶️ Запустить</button>
        <button class="yellow" id="export-preview">📦 Экспорт</button>
      </div>
    </div>
  </div>

  <!-- AI -->
  <div id="tab-ai">
    <textarea id="ai-input" placeholder="Напиши, какое приложение хочешь создать...&#10;Например: приложение с кнопкой и текстом, калькулятор, TODO список"></textarea>
    <button class="green" style="align-self:flex-start;padding:10px 30px;" id="ai-send">🚀 Создать</button>
    <div class="answer" id="ai-answer">💡 Напиши, что хочешь создать, и AI соберёт приложение!</div>
  </div>

  <!-- ЭКСПОРТ -->
  <div id="tab-export">
    <textarea id="export-code" readonly>// Здесь будет код твоего приложения</textarea>
    <button class="green" style="align-self:flex-start;padding:10px 30px;" id="download-code">📥 Скачать HTML</button>
  </div>

</div>

<!-- ========================================== -->
<!-- ===== ВЕСЬ JS ===== -->
<!-- ========================================== -->
<script>
// ============================================
// 1. ВКЛАДКИ
// ============================================
document.querySelectorAll('#tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.getElementById('tab-builder').style.display = tab === 'builder' ? 'flex' : 'none';
    document.getElementById('tab-ai').style.display = tab === 'ai' ? 'flex' : 'none';
    document.getElementById('tab-export').style.display = tab === 'export' ? 'flex' : 'none';
    if (tab === 'export') updateExportCode();
  });
});

// ============================================
// 2. КОНСТРУКТОР
// ============================================
let appElements = [];
let elementId = 0;
let appRunning = false;

// Drag & Drop
document.querySelectorAll('#blocks .b').forEach(b => {
  b.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('block', b.dataset.block);
    e.dataTransfer.effectAllowed = 'copy';
  });
});

const scriptArea = document.getElementById('script');
scriptArea.addEventListener('dragover', (e) => e.preventDefault());
scriptArea.addEventListener('drop', (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('block');
  if (!data) return;
  try {
    const el = JSON.parse(data);
    el.id = ++elementId;
    appElements.push(el);
    renderScript();
    renderPreview();
    document.getElementById('status').textContent = '✅ Элемент добавлен';
  } catch(err) {}
});

function renderScript() {
  scriptArea.innerHTML = '';
  if (appElements.length === 0) {
    scriptArea.innerHTML = '<div class="empty">📋 Перетащи элементы сюда</div>';
    return;
  }
  appElements.forEach((el, i) => {
    const div = document.createElement('div');
    div.className = 'sb';
    const icons = { button: '🔘', text: '📝', input: '✏️', image: '🖼️', container: '📦', title: '📌' };
    div.innerHTML = \`\${icons[el.type] || '📦'} \${el.text || el.placeholder || el.type} <span class="del">✕</span>\`;
    div.onclick = () => { appElements.splice(i, 1); renderScript(); renderPreview(); };
    scriptArea.appendChild(div);
  });
}

function renderPreview() {
  const phone = document.getElementById('phone-preview');
  phone.innerHTML = '';
  
  if (appElements.length === 0) {
    phone.innerHTML = '<div style="text-align:center;color:#999;padding:20px;">👆 Собери приложение</div>';
    return;
  }
  
  appElements.forEach(el => {
    const div = document.createElement('div');
    div.className = 'el';
    
    switch(el.type) {
      case 'button':
        div.className = 'el button';
        div.textContent = el.text || 'Кнопка';
        div.onclick = () => alert('🔘 Нажата кнопка!');
        break;
      case 'text':
        div.className = 'el';
        div.textContent = el.text || 'Текст';
        break;
      case 'title':
        div.className = 'el';
        div.style.fontSize = '20px';
        div.style.fontWeight = 'bold';
        div.textContent = el.text || 'Заголовок';
        break;
      case 'input':
        div.className = 'el input';
        div.contentEditable = true;
        div.textContent = el.placeholder || 'Введите...';
        break;
      case 'image':
        div.className = 'el image';
        div.innerHTML = \`<img src="\${el.src}" style="max-width:100%;max-height:100%;border-radius:4px;" />\`;
        break;
      case 'container':
        div.className = 'el container';
        div.textContent = '📦 Контейнер';
        break;
      default:
        div.textContent = '📦 Элемент';
    }
    phone.appendChild(div);
  });
}

// ============================================
// 3. ЗАПУСК ПРИЛОЖЕНИЯ
// ============================================
document.getElementById('run-preview').addEventListener('click', () => {
  appRunning = !appRunning;
  document.getElementById('status').textContent = appRunning ? '▶️ Приложение запущено' : '⏹ Остановлено';
  if (appRunning) {
    // Эмуляция работы приложения
    let count = 0;
    const interval = setInterval(() => {
      if (!appRunning) { clearInterval(interval); return; }
      const phone = document.getElementById('phone-preview');
      const btns = phone.querySelectorAll('.button');
      btns.forEach(b => {
        b.textContent = \`Нажато \${++count} раз\`;
      });
    }, 2000);
  }
});

document.getElementById('run-app').addEventListener('click', () => {
  document.querySelector('[data-tab="builder"]').click();
  setTimeout(() => {
    document.getElementById('run-preview').click();
  }, 100);
});

document.getElementById('clear-app').addEventListener('click', () => {
  appElements = [];
  elementId = 0;
  appRunning = false;
  renderScript();
  renderPreview();
  document.getElementById('status').textContent = '🗑️ Очищено';
});

// ============================================
// 4. AI
// ============================================
const aiTemplates = {
  'кнопка': [{ type: 'title', text: 'Моё приложение' }, { type: 'button', text: 'Нажми меня!' }, { type: 'text', text: 'Привет, мир!' }],
  'калькулятор': [
    { type: 'title', text: '🧮 Калькулятор' },
    { type: 'text', text: 'Скоро здесь будет калькулятор' },
    { type: 'button', text: 'Сложить' },
    { type: 'button', text: 'Вычесть' }
  ],
  'todo': [
    { type: 'title', text: '📋 Список дел' },
    { type: 'input', placeholder: 'Новая задача...' },
    { type: 'button', text: '➕ Добавить' },
    { type: 'container' }
  ],
  'чат': [
    { type: 'title', text: '💬 Чат' },
    { type: 'container' },
    { type: 'input', placeholder: 'Сообщение...' },
    { type: 'button', text: '📤 Отправить' }
  ],
  'профиль': [
    { type: 'title', text: '👤 Профиль' },
    { type: 'image', src: 'https://via.placeholder.com/100x100/00d2d3/fff?text=Avatar' },
    { type: 'text', text: 'Имя: Пользователь' },
    { type: 'button', text: '✏️ Редактировать' }
  ]
};

document.getElementById('ai-send').addEventListener('click', () => {
  const input = document.getElementById('ai-input').value.toLowerCase();
  const answer = document.getElementById('ai-answer');
  
  let found = false;
  for (let key in aiTemplates) {
    if (input.includes(key)) {
      appElements = aiTemplates[key].map(el => ({ ...el, id: ++elementId }));
      renderScript();
      renderPreview();
      answer.innerHTML = \`✅ Создано приложение: "\${key}"\n\n\${JSON.stringify(appElements, null, 2)}\`;
      found = true;
      document.getElementById('status').textContent = \`🤖 Создано приложение: \${key}\`;
      break;
    }
  }
  
  if (!found) {
    // Если не нашли шаблон, создаём простое приложение
    appElements = [
      { id: ++elementId, type: 'title', text: '📱 Моё приложение' },
      { id: ++elementId, type: 'text', text: 'Создано с помощью AI' },
      { id: ++elementId, type: 'button', text: '👆 Нажми' }
    ];
    renderScript();
    renderPreview();
    answer.innerHTML = '🤖 Создано приложение по умолчанию\n\nПопробуй: "кнопка", "калькулятор", "todo", "чат", "профиль"';
    document.getElementById('status').textContent = '🤖 Создано приложение по умолчанию';
  }
});

document.getElementById('ai-btn').addEventListener('click', () => {
  document.querySelector('[data-tab="ai"]').click();
});

// ============================================
// 5. ЭКСПОРТ
// ============================================
function updateExportCode() {
  const code = document.getElementById('export-code');
  let html = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Моё приложение</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
    .app { background: #fff; border-radius: 20px; padding: 20px; max-width: 400px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 10px; }
    .el { padding: 10px 16px; border-radius: 8px; font-size: 14px; }
    .button { background: #00d2d3; color: #fff; border: none; cursor: pointer; text-align: center; font-weight: 600; }
    .button:hover { background: #01a3a4; }
    .input { border: 2px solid #ddd; background: #fff; }
    .input:focus { outline: none; border-color: #00d2d3; }
    .title { font-size: 24px; font-weight: bold; text-align: center; }
    .container { background: #f5f5f5; padding: 10px; border-radius: 8px; display: flex; flex-direction: column; gap: 6px; min-height: 60px; }
    .image { display: flex; justify-content: center; }
    .image img { max-width: 100%; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="app">\`;

  appElements.forEach(el => {
    switch(el.type) {
      case 'button':
        html += \`<div class="el button" onclick="alert('🔘 Нажата кнопка!')">\${el.text || 'Кнопка'}</div>\`;
        break;
      case 'text':
        html += \`<div class="el">\${el.text || 'Текст'}</div>\`;
        break;
      case 'title':
        html += \`<div class="el title">\${el.text || 'Заголовок'}</div>\`;
        break;
      case 'input':
        html += \`<input class="el input" placeholder="\${el.placeholder || 'Введите...'}" />\`;
        break;
      case 'image':
        html += \`<div class="el image"><img src="\${el.src}" /></div>\`;
        break;
      case 'container':
        html += \`<div class="el container">📦 Контейнер</div>\`;
        break;
      default:
        html += \`<div class="el">📦 Элемент</div>\`;
    }
  });

  html += \`</div>
</body>
</html>\`;

  code.value = html;
}

document.getElementById('export-preview').addEventListener('click', () => {
  document.querySelector('[data-tab="export"]').click();
  setTimeout(updateExportCode, 100);
});

document.getElementById('download-code').addEventListener('click', () => {
  const code = document.getElementById('export-code');
  const blob = new Blob([code.value], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'app.html';
  a.click();
  URL.revokeObjectURL(url);
  document.getElementById('status').textContent = '📦 Скачано!';
});

// ============================================
// 6. ИНИЦИАЛИЗАЦИЯ
// ============================================
renderScript();
renderPreview();
document.getElementById('status').textContent = '✅ Конструктор готов! Перетаскивай элементы!';

console.log('🧩 Конструктор приложений загружен!');
console.log('📌 Перетаскивай элементы, чтобы создать приложение');
</script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🧩 Конструктор приложений запущен на http://localhost:${PORT}`);
  console.log(`📌 Перетаскивай элементы → создавай приложения → экспортируй!`);
});
