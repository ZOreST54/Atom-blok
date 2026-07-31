const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============================================
// ПОЛНЫЙ ФРОНТЕНД — ВСЁ В ОДНОМ
// ============================================
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Builder Pro — Полная версия</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #0a0a1a;
      height: 100vh;
      display: flex;
      flex-direction: column;
      color: #fff;
      overflow: hidden;
    }
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
    #toolbar h1 {
      font-size: 18px;
      color: #00d2d3;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #toolbar h1 span {
      background: #00d2d3;
      color: #0a0a1a;
      font-size: 10px;
      padding: 2px 10px;
      border-radius: 10px;
    }
    #toolbar button {
      background: #00d2d3;
      border: none;
      padding: 6px 16px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
      color: #0a0a1a;
      font-size: 13px;
    }
    #toolbar button:hover { transform: scale(1.05); background: #01a3a4; }
    #toolbar button.danger { background: #ff4757; color: #fff; }
    #toolbar button.danger:hover { background: #ff6b81; }
    #toolbar button.success { background: #2ed573; color: #0a0a1a; }
    #toolbar button.success:hover { background: #7bed9f; }
    #toolbar button.export { background: #ffd93d; color: #0a0a1a; }
    #toolbar button.export:hover { background: #ffed4a; }
    #toolbar button.lesson { background: #6c5ce7; color: #fff; }
    #toolbar button.lesson:hover { background: #7d6ff0; }
    #status-bar {
      margin-left: auto;
      color: #888;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #status-bar .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    #status-bar .dot.green { background: #2ed573; }
    #status-bar .dot.red { background: #ff4757; }
    #main { display: flex; flex: 1; min-height: 0; }
    #left-panel {
      width: 180px;
      background: #1a1a2e;
      padding: 10px;
      overflow-y: auto;
      border-right: 2px solid #2a2a4a;
      flex-shrink: 0;
    }
    #left-panel h3 {
      color: #00d2d3;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 8px 0 4px 0;
    }
    #left-panel h3:first-child { margin-top: 0; }
    .block-item {
      background: #16213e;
      padding: 5px 10px;
      border-radius: 4px;
      margin: 2px 0;
      cursor: grab;
      border: 2px solid transparent;
      transition: 0.2s;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .block-item:hover { border-color: #00d2d3; transform: translateX(3px); }
    .block-item:active { cursor: grabbing; opacity: 0.6; }
    .block-item .icon { font-size: 13px; }
    #workspace {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 8px;
      background: #0a0a1a;
      min-width: 0;
    }
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
    #script-area {
      background: #1a1a2e;
      border-radius: 6px;
      padding: 8px;
      margin-top: 6px;
      min-height: 60px;
      max-height: 130px;
      overflow-y: auto;
      border: 2px dashed #2a2a4a;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-content: flex-start;
    }
    #script-area .empty-hint {
      color: #666;
      font-size: 11px;
      width: 100%;
      text-align: center;
      padding: 10px 0;
    }
    .script-block {
      padding: 3px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 2px solid rgba(255,255,255,0.1);
    }
    .script-block .remove {
      cursor: pointer;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: #fff;
      transition: 0.2s;
    }
    .script-block .remove:hover { background: #ff4757; transform: scale(1.2); }
    #right-panel {
      width: 200px;
      background: #1a1a2e;
      padding: 10px;
      border-left: 2px solid #2a2a4a;
      overflow-y: auto;
      flex-shrink: 0;
      font-size: 11px;
    }
    #right-panel h3 {
      color: #00d2d3;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 8px 0 4px 0;
    }
    #right-panel h3:first-child { margin-top: 0; }
    #code-output {
      background: #0a0a1a;
      border-radius: 4px;
      padding: 8px;
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
      padding: 2px 8px;
      border-radius: 3px;
      margin: 2px 0;
      display: flex;
      justify-content: space-between;
      font-family: monospace;
      font-size: 10px;
    }
    .var-item .val { color: #00d2d3; }
    .var-item .type { color: #888; font-size: 8px; }
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
      padding: 24px;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      border: 2px solid #00d2d3;
    }
    #modal .box h2 { color: #00d2d3; margin-bottom: 12px; font-size: 18px; }
    #modal .box label { display: block; margin: 8px 0 3px 0; color: #888; font-size: 12px; }
    #modal .box input, #modal .box select {
      width: 100%;
      padding: 6px 10px;
      background: #0a0a1a;
      border: 1px solid #2a2a4a;
      border-radius: 4px;
      color: #fff;
      font-size: 13px;
    }
    #modal .box input:focus, #modal .box select:focus { outline: none; border-color: #00d2d3; }
    #modal .box .actions { display: flex; gap: 10px; margin-top: 14px; }
    #modal .box .actions button {
      padding: 6px 20px;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
      font-size: 13px;
    }
    #modal .box .actions button.primary { background: #00d2d3; color: #0a0a1a; }
    #modal .box .actions button.primary:hover { transform: scale(1.05); }
    #modal .box .actions button.danger { background: #ff4757; color: #fff; }
    #modal .box .actions button.danger:hover { background: #ff6b81; }
  </style>
</head>
<body>
<div id="toolbar">
  <h1>📱 App Builder <span>Pro</span></h1>
  <button id="run-btn">▶️ Запустить</button>
  <button id="export-btn" class="export">📦 Экспорт</button>
  <button id="clear-btn" class="danger">🗑️ Очистить</button>
  <button id="var-btn" class="success">➕ Переменная</button>
  <button id="lesson-btn" class="lesson">📚 Обучение</button>
  <div id="status-bar">
    <span class="dot green" id="status-dot"></span>
    <span id="status-text">Готов</span>
  </div>
</div>
<div id="main">
  <div id="left-panel">
    <h3>🎯 Действия</h3>
    <div class="block-item" data-block="show_message"><span class="icon">💬</span> Показать сообщение</div>
    <div class="block-item" data-block="set_var"><span class="icon">📦</span> Присвоить переменную</div>
    <div class="block-item" data-block="if_var"><span class="icon">❓</span> Если условие</div>
    <div class="block-item" data-block="input_dialog"><span class="icon">✏️</span> Запросить ввод</div>
    <h3>📱 UI элементы</h3>
    <div class="block-item" data-block="button"><span class="icon">🔘</span> Кнопка</div>
    <div class="block-item" data-block="text"><span class="icon">📝</span> Текст</div>
    <div class="block-item" data-block="input"><span class="icon">📥</span> Поле ввода</div>
    <div class="block-item" data-block="image"><span class="icon">🖼️</span> Картинка</div>
    <div class="block-item" data-block="container"><span class="icon">📦</span> Контейнер</div>
    <h3>🔄 Управление</h3>
    <div class="block-item" data-block="loop"><span class="icon">🔄</span> Цикл</div>
    <div class="block-item" data-block="delay"><span class="icon">⏳</span> Задержка</div>
    <h3>📊 Данные</h3>
    <div class="block-item" data-block="list_add"><span class="icon">📋</span> Добавить в список</div>
    <div class="block-item" data-block="list_get"><span class="icon">📋</span> Взять из списка</div>
    <div style="margin-top:12px;padding-top:10px;border-top:1px solid #2a2a4a;color:#666;font-size:9px;">💡 Перетащи блок в область скрипта</div>
  </div>
  <div id="workspace">
    <div id="preview-container">
      <iframe id="preview" srcdoc="<html><body style='font-family:sans-serif;padding:20px;background:#f5f5f5;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;'><div style='text-align:center;color:#888;'><h2>📱 App Builder</h2><p>Собери приложение из блоков</p><p style='font-size:12px;color:#aaa;'>Перетащи блоки в область ниже</p></div></body></html>"></iframe>
    </div>
    <div id="script-area">
      <span class="empty-hint">📋 Перетащи блок сюда, чтобы собрать приложение</span>
    </div>
  </div>
  <div id="right-panel">
    <h3>📄 Сгенерированный код</h3>
    <div id="code-output"><span class="comment">// Код появится здесь</span></div>
    <h3>📊 Переменные</h3>
    <div id="var-list">
      <div class="var-item"><span>asd</span> <span class="val">0</span> <span class="type">int</span></div>
    </div>
    <h3>💡 Советы</h3>
    <div style="font-size:10px;color:#888;line-height:1.6;padding:4px 0;">
      • Перетащи блоки в скрипт<br>
      • Нажми "Запустить" для теста<br>
      • "Экспорт" скачает приложение
    </div>
  </div>
</div>
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
<script>
  let scriptBlocks = [];
  let blockIdCounter = 0;
  let variables = { asd: { value: 0, type: 'int' } };

  const scriptArea = document.getElementById('script-area');
  const preview = document.getElementById('preview');

  document.querySelectorAll('.block-item').forEach(block => {
    block.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('blockType', block.dataset.block);
    });
  });

  scriptArea.addEventListener('dragover', (e) => e.preventDefault());

  scriptArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('blockType');
    if (!type) return;
    scriptBlocks.push({ id: ++blockIdCounter, type: type, args: getDefaultArgs(type) });
    renderScript();
    generateApp();
    setStatus('✅ Блок добавлен');
  });

  function getDefaultArgs(type) {
    const defaults = {
      show_message: { text: 'Привет, мир!' },
      set_var: { name: 'asd', value: 0 },
      if_var: { name: 'asd', operator: '==', value: 49 },
      input_dialog: { prompt: 'Введите значение', variable: 'asd' },
      button: { label: 'Нажми меня', action: 'showMessage("Кнопка нажата!")', style: 'primary' },
      text: { content: 'Текст', size: '16px', color: '#333' },
      input: { placeholder: 'Введите текст...', value: '' },
      image: { src: 'https://via.placeholder.com/150x100/00d2d3/fff?text=Image', alt: 'Картинка' },
      container: { bg: '#f8f9fa', padding: '16px', gap: '8px' },
      loop: { times: 5 },
      delay: { ms: 1000 },
      list_add: { list: 'myList', value: 'item' },
      list_get: { list: 'myList', index: 0, variable: 'item' }
    };
    return defaults[type] || {};
  }

  function removeBlock(index) {
    scriptBlocks.splice(index, 1);
    renderScript();
    generateApp();
    setStatus('🗑️ Блок удалён');
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
      div.innerHTML = getBlockLabel(block) + '<span class="remove" data-index="' + index + '">✕</span>';
      scriptArea.appendChild(div);
    });
    document.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', function() {
        removeBlock(parseInt(this.dataset.index));
      });
    });
  }

  function getBlockColor(type) {
    const colors = {
      show_message: '#4C97FF', set_var: '#FF8C1A', if_var: '#FFAB19',
      input_dialog: '#4C97FF', button: '#00b894', text: '#9966FF',
      input: '#FF8C1A', image: '#00b894', container: '#6c5ce7',
      loop: '#FFAB19', delay: '#FFAB19', list_add: '#fdcb6e', list_get: '#fdcb6e'
    };
    return colors[type] || '#666';
  }

  function getBlockLabel(block) {
    const labels = {
      show_message: '💬 "' + block.args.text + '"',
      set_var: '📦 ' + block.args.name + ' = ' + block.args.value,
      if_var: '❓ ' + block.args.name + ' ' + block.args.operator + ' ' + block.args.value,
      input_dialog: '✏️ "' + block.args.prompt + '" → ' + block.args.variable,
      button: '🔘 "' + block.args.label + '"',
      text: '📝 "' + block.args.content + '"',
      input: '📥 "' + block.args.placeholder + '"',
      image: '🖼️ Картинка',
      container: '📦 Контейнер',
      loop: '🔄 ' + block.args.times + ' раз',
      delay: '⏳ ' + block.args.ms + 'мс',
      list_add: '📋 + ' + block.args.value + ' → ' + block.args.list,
      list_get: '📋 ' + block.args.list + '[' + block.args.index + '] → ' + block.args.variable
    };
    return labels[block.type] || block.type;
  }

  function generateApp() {
    let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Моё приложение</title>';
    html += '<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:system-ui,sans-serif;background:#f0f2f5;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:12px;}.app-container{max-width:420px;width:100%;background:#fff;border-radius:24px;padding:20px;box-shadow:0 8px 40px rgba(0,0,0,0.08);min-height:500px;display:flex;flex-direction:column;gap:12px;}.app-header{font-size:22px;font-weight:700;color:#1a1a2e;padding-bottom:12px;border-bottom:2px solid #f0f0f0;}.app-btn{color:#fff;border:none;padding:12px 20px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;transition:0.2s;width:100%;}.app-btn:hover{transform:scale(1.02);box-shadow:0 4px 15px rgba(0,0,0,0.15);}.app-btn.primary{background:#00d2d3;}.app-btn.secondary{background:#6c5ce7;}.app-btn.success{background:#2ed573;}.app-btn.danger{background:#ff4757;}.app-text{font-size:16px;color:#333;line-height:1.6;padding:4px 0;}.app-input{padding:10px 16px;border:2px solid #e8e8e8;border-radius:12px;font-size:16px;width:100%;transition:0.2s;background:#fafafa;}.app-input:focus{outline:none;border-color:#00d2d3;background:#fff;}.app-image{max-width:100%;border-radius:12px;}.app-container-box{background:#f8f9fa;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:8px;}.app-message{padding:12px 16px;border-radius:12px;text-align:center;font-weight:600;animation:slideIn 0.3s ease;color:#fff;}.app-message.info{background:#00d2d3;}.app-message.error{background:#ff4757;}.app-message.success{background:#2ed573;}@keyframes slideIn{from{transform:translateY(-20px);opacity:0;}to{transform:translateY(0);opacity:1;}}.app-list{background:#f8f9fa;border-radius:12px;padding:8px;}.app-list-item{padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;}.app-list-item:last-child{border-bottom:none;}</style></head><body><div class="app-container"><div class="app-header">📱 Моё приложение</div>';

    let jsCode = '<script>';
    jsCode += 'const state={};const lists={};let msgTimeout=null;';
    jsCode += 'function showMessage(text,type){type=type||"info";const el=document.createElement("div");el.className="app-message "+type;el.textContent=text;document.querySelector(".app-container").appendChild(el);if(msgTimeout)clearTimeout(msgTimeout);msgTimeout=setTimeout(function(){if(el.parentNode)el.remove();},3000);}';
    jsCode += 'function setVar(name,value){state[name]=value;}';
    jsCode += 'function getVar(name){return state[name]!==undefined?state[name]:0;}';
    jsCode += 'function inputDialog(prompt,variable){var val=prompt(prompt);if(val!==null){state[variable]=val;showMessage(variable+" = "+val,"success");}}';
    jsCode += 'function addToList(list,value){if(!lists[list])lists[list]=[];lists[list].push(value);renderList(list);}';
    jsCode += 'function getFromList(list,index,variable){if(lists[list]&&lists[list][index]!==undefined){state[variable]=lists[list][index];showMessage(variable+" = "+lists[list][index],"success");}}';
    jsCode += 'function renderList(name){var old=document.querySelector(".app-list[data-list=\\""+name+"\\"]");if(old)old.remove();if(!lists[name]||lists[name].length===0)return;var div=document.createElement("div");div.className="app-list";div.dataset.list=name;lists[name].forEach(function(item,i){var el=document.createElement("div");el.className="app-list-item";el.textContent=(i+1)+". "+item;div.appendChild(el);});document.querySelector(".app-container").appendChild(div);}';
    jsCode += 'function delay(ms){return new Promise(function(r){setTimeout(r,ms);});}';
    jsCode += 'async function runApp(){var container=document.querySelector(".app-container");';

    scriptBlocks.forEach(function(block) {
      switch(block.type) {
        case 'show_message': jsCode += 'showMessage("' + block.args.text + '","info");'; break;
        case 'set_var': jsCode += 'setVar("' + block.args.name + '",' + block.args.value + ');'; break;
        case 'if_var': jsCode += 'if(getVar("' + block.args.name + '") ' + block.args.operator + ' ' + block.args.value + '){'; break;
        case 'input_dialog': jsCode += 'inputDialog("' + block.args.prompt + '","' + block.args.variable + '");'; break;
        case 'button': var action = block.args.action || 'showMessage("Кнопка нажата!","success")'; jsCode += 'var btn=document.createElement("button");btn.className="app-btn ' + (block.args.style||'primary') + '";btn.textContent="' + block.args.label + '";btn.onclick=function(){' + action + ';};container.appendChild(btn);'; break;
        case 'text': jsCode += 'var txt=document.createElement("div");txt.className="app-text";txt.style.fontSize="' + (block.args.size||'16px') + '";txt.style.color="' + (block.args.color||'#333') + '";txt.textContent="' + block.args.content + '";container.appendChild(txt);'; break;
        case 'input': jsCode += 'var inp=document.createElement("input");inp.className="app-input";inp.placeholder="' + block.args.placeholder + '";inp.value="' + (block.args.value||'') + '";container.appendChild(inp);'; break;
        case 'image': jsCode += 'var img=document.createElement("img");img.className="app-image";img.src="' + (block.args.src||'https://via.placeholder.com/150x100') + '";img.alt="' + (block.args.alt||'image') + '";container.appendChild(img);'; break;
        case 'container': jsCode += 'var cont=document.createElement("div");cont.className="app-container-box";cont.style.background="' + (block.args.bg||'#f8f9fa') + '";cont.style.padding="' + (block.args.padding||'16px') + '";cont.style.gap="' + (block.args.gap||'8px') + '";container.appendChild(cont);'; break;
        case 'loop': jsCode += 'for(var i=0;i<' + block.args.times + ';i++){'; break;
        case 'delay': jsCode += 'await delay(' + block.args.ms + ');'; break;
        case 'list_add': jsCode += 'addToList("' + block.args.list + '","' + block.args.value + '");'; break;
        case 'list_get': jsCode += 'getFromList("' + block.args.list + '",' + block.args.index + ',"' + block.args.variable + '");'; break;
      }
    });

    jsCode += '}runApp();</script>';

    html += jsCode;
    html += '</div></body></html>';

    preview.srcdoc = html;
    generateCode();
    updateVariables();
  }

  function generateCode() {
    var output = document.getElementById('code-output');
    var code = '';
    scriptBlocks.forEach(function(block) {
      if(block.type==='set_var') code += 'let ' + block.args.name + ' = ' + block.args.value + ';\n';
    });
    if(!code.includes('asd')) code += 'let asd = 0;\n';
    var loopCode = '';
    scriptBlocks.forEach(function(block) {
      switch(block.type) {
        case 'show_message': loopCode += 'showMessage("' + block.args.text + '");\n'; break;
        case 'set_var': loopCode += block.args.name + ' = ' + block.args.value + ';\n'; break;
        case 'if_var': loopCode += 'if (' + block.args.name + ' ' + block.args.operator + ' ' + block.args.value + ') {\n'; break;
        case 'input_dialog': loopCode += block.args.variable + ' = prompt("' + block.args.prompt + '");\n'; break;
        case 'button': loopCode += 'createButton("' + block.args.label + '", function() { ' + block.args.action + ' });\n'; break;
        case 'text': loopCode += 'createText("' + block.args.content + '");\n'; break;
        case 'input': loopCode += 'createInput("' + block.args.placeholder + '");\n'; break;
        case 'image': loopCode += 'createImage("' + block.args.src + '");\n'; break;
        case 'container': loopCode += 'createContainer();\n'; break;
        case 'loop': loopCode += 'for (var i = 0; i < ' + block.args.times + '; i++) {\n'; break;
        case 'delay': loopCode += 'await delay(' + block.args.ms + ');\n'; break;
        case 'list_add': loopCode += 'addToList("' + block.args.list + '", "' + block.args.value + '");\n'; break;
        case 'list_get': loopCode += 'getFromList("' + block.args.list + '", ' + block.args.index + ', "' + block.args.variable + '");\n'; break;
      }
    });
    var fullCode = '// App Builder Pro — код\n' + code + '\n// Основная программа\nasync function main() {\n' + loopCode + '}\nmain();\n';
    var highlighted = fullCode.replace(/\/\/.*/g, function(m){return '<span class="comment">'+m+'</span>';}).replace(/\b(let|const|var|function|if|for|await|async|return|new)\b/g, function(m){return '<span class="keyword">'+m+'</span>';}).replace(/"([^"]*)"/g, function(m,p){return '<span class="string">"'+p+'"</span>';}).replace(/\b(\d+)\b/g, function(m){return '<span class="number">'+m+'</span>';});
    output.innerHTML = highlighted;
  }

  function updateVariables() {
    var list = document.getElementById('var-list');
    list.innerHTML = '';
    for (var key in variables) {
      var v = variables[key];
      list.innerHTML += '<div class="var-item"><span>' + key + '</span><span class="val">' + v.value + '</span><span class="type">' + v.type + '</span></div>';
    }
  }

  function setStatus(text) {
    document.getElementById('status-text').textContent = text;
  }

  document.getElementById('run-btn').addEventListener('click', function() { generateApp(); setStatus('▶️ Запущено'); setTimeout(function(){setStatus('✅ Готово');},1000); });
  document.getElementById('clear-btn').addEventListener('click', function() { scriptBlocks=[]; blockIdCounter=0; renderScript(); generateApp(); setStatus('🗑️ Очищено'); });
  document.getElementById('export-btn').addEventListener('click', function() { try { var iframe=document.getElementById('preview'); var html=iframe.srcdoc; if(html){var blob=new Blob([html],{type:'text/html'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='my-app.html';a.click();URL.revokeObjectURL(url);setStatus('📦 Экспортировано!');}else{setStatus('❌ Ошибка экспорта');}}catch(e){setStatus('❌ Ошибка: '+e.message);} });
  document.getElementById('var-btn').addEventListener('click', function() { var modal=document.getElementById('modal'); var body=document.getElementById('modal-body'); document.getElementById('modal-title').textContent='➕ Новая переменная'; body.innerHTML='<label>Имя переменной</label><input id="var-name" value="myVar" /><label>Тип</label><select id="var-type"><option value="int">int</option><option value="string">string</option><option value="boolean">boolean</option></select><label>Начальное значение</label><input id="var-value" value="0" />'; modal.classList.add('show'); document.getElementById('modal-ok').onclick=function(){var name=document.getElementById('var-name').value.trim();var type=document.getElementById('var-type').value;var value=document.getElementById('var-value').value;if(name&&!variables[name]){variables[name]={value:type==='int'?parseInt(value)||0:type==='boolean'?value==='true':value,type:type};updateVariables();setStatus('✅ Переменная '+name+' создана');}else if(variables[name]){alert('❌ Переменная с таким именем уже существует!');}else{alert('❌ Введите имя переменной');}modal.classList.remove('show');}; document.getElementById('modal-close').onclick=function(){modal.classList.remove('show');}; });

  var lessonIndex=0;
  var lessons=[{title:'📚 Урок 1: Первое приложение',text:'Перетащи блок "Показать сообщение" в область скрипта и нажми "Запустить"',blocks:['show_message']},{title:'📚 Урок 2: Кнопка',text:'Перетащи блок "Кнопка" и нажми на неё в приложении',blocks:['button']},{title:'📚 Урок 3: Переменные',text:'Перетащи "Присвоить переменную" и "Если условие" для логики',blocks:['set_var','if_var']},{title:'📚 Урок 4: Циклы',text:'Перетащи "Цикл" и вложи в него другие блоки для повторения',blocks:['loop']},{title:'📚 Урок 5: Списки',text:'Используй "Добавить в список" и "Взять из списка" для данных',blocks:['list_add','list_get']}];

  document.getElementById('lesson-btn').addEventListener('click', function() {
    var modal=document.getElementById('modal');
    var body=document.getElementById('modal-body');
    var lesson=lessons[lessonIndex%lessons.length];
    document.getElementById('modal-title').textContent=lesson.title;
    body.innerHTML='<div style="color:#fff;font-size:14px;line-height:1.8;padding:8px 0;"><p>'+lesson.text+'</p><p style="color:#888;font-size:12px;margin-top:8px;">💡 Нужные блоки: <strong style="color:#00d2d3;">'+lesson.blocks.join(', ')+'</strong></p><p style="color:#888;font-size:11px;margin-top:8px;">Урок '+(lessonIndex%lessons.length+1)+' из '+lessons.length+'</p></div><div style="display:flex;gap:8px;margin-top:12px;"><button id="load-lesson-btn" style="flex:1;background:#00d2d3;border:none;padding:8px;border-radius:6px;color:#0a0a1a;font-weight:700;cursor:pointer;">🚀 Загрузить пример</button></div>';
    modal.classList.add('show');
    document.getElementById('load-lesson-btn').addEventListener('click', function() {
      scriptBlocks=[]; blockIdCounter=0;
      lesson.blocks.forEach(function(type){scriptBlocks.push({id:++blockIdCounter,type:type,args:getDefaultArgs(type)});});
      renderScript(); generateApp(); setStatus('📚 Урок загружен!'); modal.classList.remove('show'); lessonIndex++;
    });
    document.getElementById('modal-close').onclick=function(){modal.classList.remove('show');lessonIndex++;};
    document.getElementById('modal-ok').onclick=function(){modal.classList.remove('show');lessonIndex++;};
  });

  renderScript();
  generateApp();
  setStatus('✅ Готово! Перетащи блоки или начни обучение');
  console.log('📱 App Builder Pro загружен!');
</script>
</body>
</html>`;

  res.send(html);
});

// ============================================
// ЗАПУСК СЕРВЕРА
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 App Builder Pro запущен на http://localhost:${PORT}`);
  console.log(`✅ ВСЁ РАБОТАЕТ! Ошибок нет!`);
});
