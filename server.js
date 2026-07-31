const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============================================
// ГЛАВНАЯ СТРАНИЦА — ПОЛНЫЙ КОНСТРУКТОР
// ============================================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>App Builder Pro — Полный конструктор приложений</title>
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

    /* ===== ТУЛБАР ===== */
    #toolbar {
      background: #1a1a2e;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid #2a2a4a;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    #toolbar h1 {
      font-size: 16px;
      color: #00d2d3;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    #toolbar h1 span { background: #00d2d3; color: #0a0a1a; font-size: 9px; padding: 1px 8px; border-radius: 8px; }
    #toolbar button {
      background: #00d2d3;
      border: none;
      padding: 4px 14px;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
      color: #0a0a1a;
      font-size: 12px;
    }
    #toolbar button:hover { transform: scale(1.05); background: #01a3a4; }
    #toolbar button.danger { background: #ff4757; color: #fff; }
    #toolbar button.danger:hover { background: #ff6b81; }
    #toolbar button.success { background: #2ed573; color: #0a0a1a; }
    #toolbar button.success:hover { background: #7bed9f; }
    #toolbar button.export { background: #ffd93d; color: #0a0a1a; }
    #toolbar button.export:hover { background: #ffed4a; }
    #status-bar { margin-left: auto; color: #888; font-size: 11px; display: flex; align-items: center; gap: 8px; }
    #status-bar .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    #status-bar .dot.green { background: #2ed573; }

    /* ===== ОСНОВНАЯ ОБЛАСТЬ ===== */
    #main { display: flex; flex: 1; min-height: 0; }

    /* ===== ЛЕВАЯ ПАНЕЛЬ — БЛОКИ ===== */
    #left-panel {
      width: 170px;
      background: #1a1a2e;
      padding: 8px;
      overflow-y: auto;
      border-right: 2px solid #2a2a4a;
      flex-shrink: 0;
    }
    #left-panel h3 {
      color: #00d2d3;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 6px 0 3px 0;
    }
    #left-panel h3:first-child { margin-top: 0; }
    .block-item {
      background: #16213e;
      padding: 4px 8px;
      border-radius: 4px;
      margin: 2px 0;
      cursor: grab;
      border: 2px solid transparent;
      transition: 0.2s;
      font-size: 10px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .block-item:hover { border-color: #00d2d3; transform: translateX(3px); }
    .block-item:active { cursor: grabbing; opacity: 0.6; }
    .block-item .icon { font-size: 12px; }

    /* ===== ЦЕНТР ===== */
    #workspace {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 8px;
      background: #0a0a1a;
      min-width: 0;
    }

    /* Превью */
    #preview-container {
      background: #1a1a3e;
      border-radius: 8px;
      overflow: hidden;
      flex: 1;
      min-height: 200px;
      border: 2px solid #2a2a4a;
      position: relative;
    }
    #preview-container iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #fff;
    }

    /* Скрипты */
    #script-area {
      background: #1a1a2e;
      border-radius: 6px;
      padding: 8px;
      margin-top: 6px;
      min-height: 50px;
      max-height: 120px;
      overflow-y: auto;
      border: 2px dashed #2a2a4a;
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      align-content: flex-start;
    }
    #script-area .empty-hint {
      color: #666;
      font-size: 11px;
      width: 100%;
      text-align: center;
      padding: 8px 0;
    }
    .script-block {
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: 2px solid rgba(255,255,255,0.1);
    }
    .script-block .remove {
      cursor: pointer;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: bold;
      color: #fff;
      transition: 0.2s;
    }
    .script-block .remove:hover { background: #ff4757; transform: scale(1.2); }
    .script-block .arg-input {
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 3px;
      color: #fff;
      padding: 1px 4px;
      width: 35px;
      font-size: 10px;
      text-align: center;
    }
    .script-block .arg-input:focus { outline: 2px solid #00d2d3; }

    /* ===== ПРАВАЯ ПАНЕЛЬ ===== */
    #right-panel {
      width: 200px;
      background: #1a1a2e;
      padding: 8px;
      border-left: 2px solid #2a2a4a;
      overflow-y: auto;
      flex-shrink: 0;
      font-size: 11px;
    }
    #right-panel h3 {
      color: #00d2d3;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 6px 0 3px 0;
    }
    #right-panel h3:first-child { margin-top: 0; }
    #code-output {
      background: #0a0a1a;
      border-radius: 4px;
      padding: 6px;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      color: #00ff88;
      overflow-x: auto;
      white-space: pre-wrap;
      max-height: 150px;
      overflow-y: auto;
      border: 1px solid #2a2a4a;
    }
    #code-output .comment { color: #888; }
    #code-output .keyword { color: #ff6b6b; }
    #code-output .string { color: #ffd93d; }
    #code-output .number { color: #00d2d3; }
    .var-item {
      background: #16213e;
      padding: 2px 6px;
      border-radius: 3px;
      margin: 2px 0;
      display: flex;
      justify-content: space-between;
      font-family: monospace;
      font-size: 10px;
    }
    .var-item .val { color: #00d2d3; }
    .var-item .type { color: #888; font-size: 8px; }

    /* ===== МОДАЛКА ===== */
    #modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    #modal.show { display: flex; }
    #modal .box {
      background: #1a1a2e;
      padding: 20px;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      border: 2px solid #00d2d3;
    }
    #modal .box h2 { color: #00d2d3; margin-bottom: 10px; font-size: 16px; }
    #modal .box label { display: block; margin: 6px 0 2px 0; color: #888; font-size: 11px; }
    #modal .box input, #modal .box select {
      width: 100%;
      padding: 5px 8px;
      background: #0a0a1a;
      border: 1px solid #2a2a4a;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
    }
    #modal .box input:focus, #modal .box select:focus { outline: none; border-color: #00d2d3; }
    #modal .box .actions { display: flex; gap: 8px; margin-top: 10px; }
    #modal .box .actions button {
      padding: 5px 16px;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
      font-size: 12px;
    }
    #modal .box .actions button.primary { background: #00d2d3; color: #0a0a1a; }
    #modal .box .actions button.primary:hover { transform: scale(1.05); }
    #modal .box .actions button.danger { background: #ff4757; color: #fff; }
    #modal .box .actions button.danger:hover { background: #ff6b81; }
  </style>
</head>
<body>

<!-- ===== ТУЛБАР ===== -->
<div id="toolbar">
  <h1>📱 App Builder <span>Pro</span></h1>
  <button id="run-btn">▶️ Запустить</button>
  <button id="export-btn" class="export">📦 Экспорт</button>
  <button id="clear-btn" class="danger">🗑️ Очистить</button>
  <button id="var-btn" class="success">➕ Переменная</button>
  <button id="add-screen-btn" class="success">📱 + Экран</button>
  <div id="status-bar">
    <span class="dot green"></span>
    <span id="status-text">Готов</span>
  </div>
</div>

<!-- ===== ОСНОВНАЯ ОБЛАСТЬ ===== -->
<div id="main">
  <!-- Левая панель -->
  <div id="left-panel">
    <h3>🎯 Действия</h3>
    <div class="block-item" data-block='{"type":"show_message"}'><span class="icon">💬</span> Сообщение</div>
    <div class="block-item" data-block='{"type":"set_var"}'><span class="icon">📦</span> Переменная =</div>
    <div class="block-item" data-block='{"type":"if_var"}'><span class="icon">❓</span> Если</div>
    <div class="block-item" data-block='{"type":"input_dialog"}'><span class="icon">✏️</span> Ввод</div>

    <h3>📱 UI</h3>
    <div class="block-item" data-block='{"type":"button"}'><span class="icon">🔘</span> Кнопка</div>
    <div class="block-item" data-block='{"type":"text"}'><span class="icon">📝</span> Текст</div>
    <div class="block-item" data-block='{"type":"input"}'><span class="icon">📥</span> Поле ввода</div>
    <div class="block-item" data-block='{"type":"image"}'><span class="icon">🖼️</span> Картинка</div>
    <div class="block-item" data-block='{"type":"container"}'><span class="icon">📦</span> Контейнер</div>

    <h3>🔄 Управление</h3>
    <div class="block-item" data-block='{"type":"loop"}'><span class="icon">🔄</span> Цикл</div>
    <div class="block-item" data-block='{"type":"delay"}'><span class="icon">⏳</span> Задержка</div>
    <div class="block-item" data-block='{"type":"goto"}'><span class="icon">🚀</span> Перейти на экран</div>

    <h3>📊 Данные</h3>
    <div class="block-item" data-block='{"type":"list_add"}'><span class="icon">📋</span> Добавить в список</div>
    <div class="block-item" data-block='{"type":"list_get"}'><span class="icon">📋</span> Взять из списка</div>

    <div style="margin-top:10px;padding-top:8px;border-top:1px solid #2a2a4a;color:#666;font-size:9px;">
      💡 Перетащи блок
    </div>
  </div>

  <!-- Центр -->
  <div id="workspace">
    <div id="preview-container">
      <iframe id="preview" srcdoc="<html><body style='font-family:sans-serif;padding:20px;background:#f5f5f5;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;'><div style='text-align:center;color:#888;'><h2>📱 App Builder</h2><p>Собери приложение из блоков</p></div></body></html>"></iframe>
    </div>
    <div id="script-area">
      <span class="empty-hint">📋 Перетащи блок сюда, чтобы собрать приложение</span>
    </div>
  </div>

  <!-- Правая панель -->
  <div id="right-panel">
    <h3>📄 Код</h3>
    <div id="code-output"><span class="comment">// Код появится здесь</span></div>

    <h3>📊 Переменные</h3>
    <div id="var-list">
      <div class="var-item"><span>asd</span> <span class="val">0</span> <span class="type">int</span></div>
    </div>

    <h3>📱 Экраны</h3>
    <div id="screen-list">
      <div class="var-item" style="border-left:3px solid #00d2d3;"><span>Главный</span> <span class="val">✅</span></div>
    </div>
  </div>
</div>

<!-- ===== МОДАЛКА ===== -->
<div id="modal">
  <div class="box">
    <h2 id="modal-title">✏️ Настройка</h2>
    <div id="modal-body"></div>
    <div class="actions">
      <button class="primary" id="modal-ok">✅ OK</button>
      <button class="danger" id="modal-close">✕ Отмена</button>
    </div>
  </div>
</div>

<!-- ========================================== -->
<!-- ===== ВЕСЬ JS ===== -->
<!-- ========================================== -->
<script>
  // ============================================
  // 1. СОСТОЯНИЕ
  // ============================================
  let scriptBlocks = [];
  let blockIdCounter = 0;
  let variables = { asd: { value: 0, type: 'int' } };
  let screens = [{ id: 'main', name: 'Главный' }];
  let currentScreen = 'main';
  let appState = {};

  // ============================================
  // 2. БЛОКИ
  // ============================================
  const scriptArea = document.getElementById('script-area');
  const preview = document.getElementById('preview');

  document.querySelectorAll('.block-item').forEach(block => {
    block.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('blockData', block.dataset.block);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });

  scriptArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  scriptArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('blockData');
    if (!data) return;

    try {
      const block = JSON.parse(data);
      const newBlock = {
        id: ++blockIdCounter,
        type: block.type,
        args: getDefaultArgs(block.type),
        children: []
      };
      scriptBlocks.push(newBlock);
      renderScript();
      generateApp();
      document.getElementById('status-text').textContent = '✅ Блок добавлен';
    } catch (err) {
      console.error('Ошибка:', err);
    }
  });

  function getDefaultArgs(type) {
    const defaults = {
      show_message: { text: 'Привет, мир!' },
      set_var: { name: 'asd', value: 0 },
      if_var: { name: 'asd', operator: '==', value: 49 },
      input_dialog: { prompt: 'Введите значение', variable: 'asd' },
      button: { label: 'Нажми меня', action: 'alert("Привет!")', style: 'primary' },
      text: { content: 'Текст', size: '16px', color: '#333' },
      input: { placeholder: 'Введите текст...', value: '' },
      image: { src: 'https://via.placeholder.com/150x100/00d2d3/fff?text=Image', alt: 'Картинка' },
      container: { bg: '#f5f5f5', padding: '16px', gap: '8px' },
      loop: { times: 5 },
      delay: { ms: 1000 },
      goto: { screen: 'main' },
      list_add: { list: 'myList', value: 'item' },
      list_get: { list: 'myList', index: 0, variable: 'item' }
    };
    return defaults[type] || {};
  }

  function removeBlock(index) {
    scriptBlocks.splice(index, 1);
    renderScript();
    generateApp();
  }

  function renderScript() {
    scriptArea.innerHTML = '';
    if (scriptBlocks.length === 0) {
      scriptArea.innerHTML = '<span class="empty-hint">📋 Перетащи блок сюда, чтобы собрать приложение</span>';
      return;
    }
    scriptBlocks.forEach((block, index) => {
      const div = document.createElement('div');
      div.className = 'script-block';
      div.style.background = getBlockColor(block.type);
      const label = getBlockLabel(block);
      div.innerHTML = \`\${label}<span class="remove" data-index="\${index}">✕</span>\`;
      scriptArea.appendChild(div);
    });
    document.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        removeBlock(idx);
      });
    });
  }

  function getBlockColor(type) {
    const colors = {
      show_message: '#4C97FF', set_var: '#FF8C1A', if_var: '#FFAB19',
      input_dialog: '#4C97FF', button: '#00b894', text: '#9966FF',
      input: '#FF8C1A', image: '#00b894', container: '#6c5ce7',
      loop: '#FFAB19', delay: '#FFAB19', goto: '#fd79a8',
      list_add: '#fdcb6e', list_get: '#fdcb6e'
    };
    return colors[type] || '#666';
  }

  function getBlockLabel(block) {
    const labels = {
      show_message: \`💬 "\${block.args.text}"\`,
      set_var: \`📦 \${block.args.name} = \${block.args.value}\`,
      if_var: \`❓ \${block.args.name} \${block.args.operator} \${block.args.value}\`,
      input_dialog: \`✏️ "\${block.args.prompt}" → \${block.args.variable}\`,
      button: \`🔘 "\${block.args.label}"\`,
      text: \`📝 "\${block.args.content}"\`,
      input: \`📥 "\${block.args.placeholder}"\`,
      image: \`🖼️ Картинка\`,
      container: \`📦 Контейнер\`,
      loop: \`🔄 \${block.args.times} раз\`,
      delay: \`⏳ \${block.args.ms}мс\`,
      goto: \`🚀 → \${block.args.screen}\`,
      list_add: \`📋 + \${block.args.value} → \${block.args.list}\`,
      list_get: \`📋 \${block.args.list}[\${block.args.index}] → \${block.args.variable}\`
    };
    return labels[block.type] || block.type;
  }

  // ============================================
  // 3. ГЕНЕРАЦИЯ ПОЛНОГО ПРИЛОЖЕНИЯ
  // ============================================
  function generateApp() {
    let html = \`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Моё приложение</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .app-container {
          max-width: 420px;
          width: 100%;
          margin: 10px;
          background: #fff;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.1);
          min-height: 600px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .app-header {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }
        .app-btn {
          background: #00d2d3;
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
          width: 100%;
        }
        .app-btn:hover { transform: scale(1.02); box-shadow: 0 4px 15px rgba(0,210,211,0.3); }
        .app-btn.secondary { background: #6c5ce7; }
        .app-btn.success { background: #2ed573; }
        .app-btn.danger { background: #ff4757; }
        .app-text { font-size: 16px; color: #333; line-height: 1.6; padding: 4px 0; }
        .app-input {
          padding: 10px 16px;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          font-size: 16px;
          width: 100%;
          transition: 0.2s;
          background: #fafafa;
        }
        .app-input:focus { outline: none; border-color: #00d2d3; background: #fff; }
        .app-image { max-width: 100%; border-radius: 12px; }
        .app-container-box {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .app-message {
          background: #00d2d3;
          color: #fff;
          padding: 12px 16px;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
          animation: slideIn 0.3s ease;
        }
        .app-message.error { background: #ff4757; }
        .app-message.success { background: #2ed573; }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .app-list {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 8px;
        }
        .app-list-item {
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }
        .app-list-item:last-child { border-bottom: none; }
      </style>
    </head>
    <body>
      <div class="app-container">
        <div class="app-header">📱 Моё приложение</div>
    \`;

    // Генерируем JS
    let jsCode = \`
    <script>
      const state = {};
      const lists = {};
      let output = '';
      let messageTimeout = null;

      function showMessage(text, type = 'info') {
        const el = document.createElement('div');
        el.className = \`app-message \${type}\`;
        el.textContent = text;
        document.querySelector('.app-container').appendChild(el);
        if (messageTimeout) clearTimeout(messageTimeout);
        messageTimeout = setTimeout(() => el.remove(), 3000);
      }

      function setVar(name, value) { state[name] = value; }
      function getVar(name) { return state[name] || 0; }

      function inputDialog(prompt, variable) {
        const val = prompt(prompt);
        if (val !== null) {
          state[variable] = val;
          showMessage(\`\${variable} = \${val}\`, 'success');
        }
      }

      function addToList(list, value) {
        if (!lists[list]) lists[list] = [];
        lists[list].push(value);
        renderList(list);
      }

      function getFromList(list, index, variable) {
        if (lists[list] && lists[list][index] !== undefined) {
          state[variable] = lists[list][index];
          showMessage(\`\${variable} = \${lists[list][index]}\`, 'success');
        }
      }

      function renderList(name) {
        const old = document.querySelector(\`.app-list[data-list="\${name}"]\`);
        if (old) old.remove();
        if (!lists[name] || lists[name].length === 0) return;
        const div = document.createElement('div');
        div.className = 'app-list';
        div.dataset.list = name;
        lists[name].forEach((item, i) => {
          const el = document.createElement('div');
          el.className = 'app-list-item';
          el.textContent = \`\${i+1}. \${item}\`;
          div.appendChild(el);
        });
        document.querySelector('.app-container').appendChild(div);
      }

      function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

      function goToScreen(screen) {
        document.querySelector('.app-header').textContent = \`📱 \${screen}\`;
        document.querySelector('.app-container').innerHTML = \`
          <div class="app-header">📱 \${screen}</div>
        \`;
        runApp();
      }

      // ===== ВЫПОЛНЕНИЕ ПРОГРАММЫ =====
      async function runApp() {
        const container = document.querySelector('.app-container');
    \`;

    // Добавляем блоки
    let buttonActions = '';
    scriptBlocks.forEach(block => {
      switch (block.type) {
        case 'show_message':
          jsCode += `        showMessage(\`${block.args.text}\`);\\n`;
          break;
        case 'set_var':
          jsCode += `        setVar('${block.args.name}', ${block.args.value});\\n`;
          break;
        case 'if_var':
          jsCode += `        if (getVar('${block.args.name}') ${block.args.operator} ${block.args.value}) {\\n`;
          jsCode += `          showMessage('Условие выполнено!', 'success');\\n`;
          jsCode += `        }\\n`;
          break;
        case 'input_dialog':
          jsCode += `        inputDialog('${block.args.prompt}', '${block.args.variable}');\\n`;
          break;
        case 'button':
          const action = block.args.action || 'showMessage("Нажата кнопка!")';
          jsCode += `        const btn = document.createElement('button');\\n`;
          jsCode += `        btn.className = 'app-btn ${block.args.style || 'primary'}';\\n`;
          jsCode += `        btn.textContent = '${block.args.label}';\\n`;
          jsCode += `        btn.onclick = () => { ${action} };\\n`;
          jsCode += `        container.appendChild(btn);\\n`;
          break;
        case 'text':
          jsCode += `        const txt = document.createElement('div');\\n`;
          jsCode += `        txt.className = 'app-text';\\n`;
          jsCode += `        txt.style.fontSize = '${block.args.size || '16px'}';\\n`;
          jsCode += `        txt.style.color = '${block.args.color || '#333'}';\\n`;
          jsCode += `        txt.textContent = '${block.args.content}';\\n`;
          jsCode += `        container.appendChild(txt);\\n`;
          break;
        case 'input':
          jsCode += `        const inp = document.createElement('input');\\n`;
          jsCode += `        inp.className = 'app-input';\\n`;
          jsCode += `        inp.placeholder = '${block.args.placeholder}';\\n`;
          jsCode += `        inp.value = '${block.args.value || ''}';\\n`;
          jsCode += `        container.appendChild(inp);\\n`;
          break;
        case 'image':
          jsCode += `        const img = document.createElement('img');\\n`;
          jsCode += `        img.className = 'app-image';\\n`;
          jsCode += `        img.src = '${block.args.src || 'https://via.placeholder.com/150x100'}';\\n`;
          jsCode += `        img.alt = '${block.args.alt || 'image'}';\\n`;
          jsCode += `        container.appendChild(img);\\n`;
          break;
        case 'container':
          jsCode += `        const cont = document.createElement('div');\\n`;
          jsCode += `        cont.className = 'app-container-box';\\n`;
          jsCode += `        cont.style.background = '${block.args.bg || '#f8f9fa'}';\\n`;
          jsCode += `        cont.style.padding = '${block.args.padding || '16px'}';\\n`;
          jsCode += `        cont.style.gap = '${block.args.gap || '8px'}';\\n`;
          jsCode += `        container.appendChild(cont);\\n`;
          break;
        case 'loop':
          jsCode += `        for (let i = 0; i < ${block.args.times}; i++) {\\n`;
          break;
        case 'delay':
          jsCode += `        await delay(${block.args.ms});\\n`;
          break;
        case 'goto':
          jsCode += `        goToScreen('${block.args.screen}');\\n`;
          jsCode += `        return;\\n`;
          break;
        case 'list_add':
          jsCode += `        addToList('${block.args.list}', '${block.args.value}');\\n`;
          break;
        case 'list_get':
          jsCode += `        getFromList('${block.args.list}', ${block.args.index}, '${block.args.variable}');\\n`;
          break;
      }
    });

    jsCode += `
      }
      runApp();
    <\/script>
    `;

    html += jsCode;
    html += `
      </div>
    </body>
    </html>
    `;

    preview.srcdoc = html;
    generateCode();
    updateVariables();
  }

  // ============================================
  // 4. ГЕНЕРАЦИЯ КОДА
  // ============================================
  function generateCode() {
    const output = document.getElementById('code-output');
    let code = '';
    let vars = '';

    scriptBlocks.forEach(block => {
      if (block.type === 'set_var') {
        vars += `let ${block.args.name} = ${block.args.value};\n`;
      }
    });
    if (!vars.includes('asd')) vars += 'let asd = 0;\n';

    let loopCode = '';
    scriptBlocks.forEach(block => {
      switch (block.type) {
        case 'show_message': loopCode += `showMessage("${block.args.text}");\n`; break;
        case 'set_var': loopCode += `${block.args.name} = ${block.args.value};\n`; break;
        case 'if_var': loopCode += `if (${block.args.name} ${block.args.operator} ${block.args.value}) {\n`; break;
        case 'input_dialog': loopCode += `${block.args.variable} = prompt("${block.args.prompt}");\n`; break;
        case 'button': loopCode += `createButton("${block.args.label}", () => { ${block.args.action} });\n`; break;
        case 'text': loopCode += `createText("${block.args.content}");\n`; break;
        case 'input': loopCode += `createInput("${block.args.placeholder}");\n`; break;
        case 'image': loopCode += `createImage("${block.args.src}");\n`; break;
        case 'container': loopCode += `createContainer();\n`; break;
        case 'loop': loopCode += `for (let i = 0; i < ${block.args.times}; i++) {\n`; break;
        case 'delay': loopCode += `await delay(${block.args.ms});\n`; break;
        case 'goto': loopCode += `goToScreen("${block.args.screen}");\n`; break;
        case 'list_add': loopCode += `addToList("${block.args.list}", "${block.args.value}");\n`; break;
        case 'list_get': loopCode += `getFromList("${block.args.list}", ${block.args.index}, "${block.args.variable}");\n`; break;
      }
    });

    let fullCode = `
// ==========================================
// App Builder Pro — сгенерированный код
// ==========================================

${vars}

// Функции UI
function showMessage(text) { /* ... */ }
function createButton(label, action) { /* ... */ }
function createText(content) { /* ... */ }
function createInput(placeholder) { /* ... */ }
function createImage(src) { /* ... */ }
function createContainer() { /* ... */ }
function addToList(list, value) { /* ... */ }
function getFromList(list, index, variable) { /* ... */ }
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function goToScreen(screen) { /* ... */ }

// Основная программа
async function main() {
${loopCode}
}

main();
`;

    let highlighted = fullCode
      .replace(/\/\/.*/g, match => `<span class="comment">${match}</span>`)
      .replace(/\b(let|const|var|function|if|for|await|async|return|new)\b/g, match => `<span class="keyword">${match}</span>`)
      .replace(/"([^"]*)"/g, (match, p1) => `<span class="string">"${p1}"</span>`)
      .replace(/\b(\d+)\b/g, match => `<span class="number">${match}</span>`);

    output.innerHTML = highlighted;
  }

  // ============================================
  // 5. ПЕРЕМЕННЫЕ
  // ============================================
  function updateVariables() {
    const list = document.getElementById('var-list');
    list.innerHTML = '';
    for (let key in variables) {
      const v = variables[key];
      list.innerHTML += `<div class="var-item"><span>${key}</span><span class="val">${v.value}</span><span class="type">${v.type}</span></div>`;
    }
    const screenList = document.getElementById('screen-list');
    screenList.innerHTML = '';
    screens.forEach(s => {
      screenList.innerHTML += `<div class="var-item" style="border-left:3px solid ${s.id === currentScreen ? '#00d2d3' : 'transparent'};"><span>${s.name}</span><span class="val">${s.id === currentScreen ? '✅' : ''}</span></div>`;
    });
  }

  // ============================================
  // 6. УПРАВЛЕНИЕ
  // ============================================
  document.getElementById('run-btn').addEventListener('click', () => {
    generateApp();
    document.getElementById('status-text').textContent = '▶️ Запущено';
    setTimeout(() => document.getElementById('status-text').textContent = '✅ Готово', 1000);
  });

  document.getElementById('clear-btn').addEventListener('click', () => {
    scriptBlocks = [];
    blockIdCounter = 0;
    renderScript();
    generateApp();
    document.getElementById('status-text').textContent = '🗑️ Очищено';
  });

  document.getElementById('export-btn').addEventListener('click', () => {
    const html = preview.srcdoc;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-app.html';
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById('status-text').textContent = '📦 Экспортировано!';
  });

  // ============================================
  // 7. ПЕРЕМЕННАЯ (модалка)
  // ============================================
  document.getElementById('var-btn').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = '➕ Новая переменная';
    body.innerHTML = `
      <label>Имя переменной</label>
      <input id="var-name" value="myVar" />
      <label>Тип</label>
      <select id="var-type">
        <option value="int">int</option>
        <option value="string">string</option>
        <option value="boolean">boolean</option>
      </select>
      <label>Начальное значение</label>
      <input id="var-value" value="0" />
    `;
    modal.classList.add('show');
    document.getElementById('modal-ok').onclick = () => {
      const name = document.getElementById('var-name').value;
      const type = document.getElementById('var-type').value;
      const value = document.getElementById('var-value').value;
      if (name && !variables[name]) {
        variables[name] = { value: type === 'int' ? parseInt(value) : value, type };
        updateVariables();
        document.getElementById('status-text').textContent = `✅ Переменная ${name} создана`;
      } else if (variables[name]) {
        alert('❌ Переменная с таким именем уже существует!');
      }
      modal.classList.remove('show');
    };
    document.getElementById('modal-close').onclick = () => modal.classList.remove('show');
  });

  // ============================================
  // 8. ДОБАВЛЕНИЕ ЭКРАНА
  // ============================================
  document.getElementById('add-screen-btn').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    document.getElementById('modal-title').textContent = '📱 Новый экран';
    body.innerHTML = `
      <label>Название экрана</label>
      <input id="screen-name" value="Экран ${screens.length + 1}" />
    `;
    modal.classList.add('show');
    document.getElementById('modal-ok').onclick = () => {
      const name = document.getElementById('screen-name').value || `Экран ${screens.length + 1}`;
      const id = 'screen_' + Date.now();
      screens.push({ id, name });
      currentScreen = id;
      updateVariables();
      document.getElementById('status-text').textContent = `📱 Экран "${name}" создан`;
      // Добавляем блок перехода на этот экран
      scriptBlocks.push({
        id: ++blockIdCounter,
        type: 'goto',
        args: { screen: id },
        children: []
      });
      renderScript();
      generateApp();
      modal.classList.remove('show');
    };
    document.getElementById('modal-close').onclick = () => modal.classList.remove('show');
  });

  // ============================================
  // 9. ИНИЦИАЛИЗАЦИЯ
  // ============================================
  renderScript();
  generateApp();
  document.getElementById('status-text').textContent = '✅ Готово! Перетащи блоки';

  console.log('📱 App Builder Pro загружен!');
  console.log('🧩 Перетащи блоки для создания приложения');
  console.log('📦 Нажми "Экспорт" для скачивания');
</script>
</body>
</html>
  `);
});

// ============================================
// ЗАПУСК СЕРВЕРА
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 App Builder Pro запущен на http://localhost:${PORT}`);
  console.log(`📱 Создавай ЛЮБЫЕ приложения из блоков!`);
  console.log(`🔘 Добавляй кнопки, экраны, переменные, списки`);
});
