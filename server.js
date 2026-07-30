const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============================================
// ВЕСЬ ФРОНТЕНД (HTML + CSS + JS)
// ============================================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Атом Билдер Pro — Scratch + AI</title>
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
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #2a2a4a;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    #toolbar h1 { font-size: 18px; color: #00d2d3; white-space: nowrap; }
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
    #toolbar button.ai { background: #ffd93d; color: #0a0a1a; }
    #toolbar button.ai:hover { background: #ffed4a; }
    #toolbar .status { color: #888; font-size: 13px; margin-left: auto; }

    /* ===== ОСНОВНАЯ ОБЛАСТЬ ===== */
    #main {
      display: flex;
      flex: 1;
      min-height: 0;
    }

    /* ===== ЛЕВАЯ ПАНЕЛЬ — ПАЛИТРА ===== */
    #palette {
      width: 180px;
      background: #1a1a2e;
      padding: 10px;
      overflow-y: auto;
      border-right: 2px solid #2a2a4a;
      flex-shrink: 0;
    }
    #palette h4 {
      color: #00d2d3;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 8px 0 4px 0;
    }
    #palette h4:first-child { margin-top: 0; }
    .block-item {
      background: #16213e;
      padding: 5px 8px;
      border-radius: 4px;
      margin: 2px 0;
      cursor: grab;
      border: 2px solid transparent;
      transition: 0.2s;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .block-item:hover { border-color: #00d2d3; transform: translateX(3px); }
    .block-item:active { cursor: grabbing; opacity: 0.6; }
    .block-item .dot {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    /* ===== СЦЕНА ===== */
    #workspace {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 10px;
      background: #0a0a1a;
      min-width: 0;
    }
    #stage-container {
      background: #1a1a3e;
      border-radius: 10px;
      overflow: hidden;
      flex: 1;
      min-height: 250px;
      position: relative;
      border: 2px solid #2a2a4a;
    }
    #stage-container canvas {
      width: 100%;
      height: 100%;
      display: block;
      background: #f5f5f5;
      cursor: crosshair;
    }

    /* ===== СКРИПТЫ ===== */
    #script-area {
      background: #1a1a2e;
      border-radius: 8px;
      padding: 10px;
      margin-top: 8px;
      min-height: 50px;
      max-height: 120px;
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
      padding: 8px 0;
    }
    .script-block {
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 5px;
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
    .script-block.nested {
      margin-left: 15px;
      border-left: 2px solid rgba(255,255,255,0.15);
      padding-left: 8px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    /* ===== ПРАВАЯ ПАНЕЛЬ — ОБЪЕКТЫ И ПЕРЕМЕННЫЕ ===== */
    #sidebar {
      width: 180px;
      background: #1a1a2e;
      padding: 10px;
      border-left: 2px solid #2a2a4a;
      overflow-y: auto;
      flex-shrink: 0;
      font-size: 12px;
    }
    #sidebar h4 {
      color: #00d2d3;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 8px 0 4px 0;
    }
    #sidebar h4:first-child { margin-top: 0; }
    .sprite-item {
      background: #16213e;
      padding: 5px 8px;
      border-radius: 4px;
      margin: 3px 0;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      border: 2px solid transparent;
      font-size: 11px;
    }
    .sprite-item:hover { border-color: #00d2d3; }
    .sprite-item .dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .var-item {
      background: #16213e;
      padding: 3px 8px;
      border-radius: 3px;
      margin: 2px 0;
      font-family: monospace;
      font-size: 11px;
    }
    .var-item .val { color: #00d2d3; float: right; }

    /* ===== AI ОКНО ===== */
    #ai-modal {
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
    #ai-modal.show { display: flex; }
    #ai-modal .box {
      background: #1a1a2e;
      padding: 30px;
      border-radius: 16px;
      max-width: 500px;
      width: 90%;
      border: 2px solid #00d2d3;
    }
    #ai-modal .box h2 { color: #00d2d3; margin-bottom: 15px; }
    #ai-modal .box textarea {
      width: 100%;
      height: 80px;
      background: #0a0a1a;
      color: #fff;
      border: 2px solid #2a2a4a;
      border-radius: 8px;
      padding: 10px;
      font-size: 14px;
      resize: vertical;
      font-family: inherit;
    }
    #ai-modal .box textarea:focus { outline: none; border-color: #00d2d3; }
    #ai-modal .box .actions {
      display: flex;
      gap: 10px;
      margin-top: 12px;
    }
    #ai-modal .box .actions button {
      padding: 8px 20px;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
      font-size: 14px;
    }
    #ai-modal .box .actions button.primary { background: #00d2d3; color: #0a0a1a; }
    #ai-modal .box .actions button.primary:hover { transform: scale(1.05); }
    #ai-modal .box .actions button.danger { background: #ff4757; color: #fff; }
    #ai-modal .box .actions button.danger:hover { background: #ff6b81; }

    /* Список клонов */
    .clone-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 4px;
    }
    .clone-item {
      background: #0a0a1a;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
      border: 1px solid #2a2a4a;
    }
  </style>
</head>
<body>

<!-- ===== ТУЛБАР ===== -->
<div id="toolbar">
  <h1>🧩 Атом Билдер Pro</h1>
  <button id="run-btn">▶️ Выполнить</button>
  <button id="stop-btn" class="danger">⏹ Стоп</button>
  <button id="reset-btn" class="danger">🔄 Сброс</button>
  <button id="clear-btn" class="danger">🗑️ Очистить</button>
  <button id="ai-btn" class="ai">🤖 AI Помощник</button>
  <button id="export-btn">📦 Экспорт HTML</button>
  <button id="clone-btn">📋 Клон +1</button>
  <span class="status" id="status">✅ Готово</span>
</div>

<!-- ===== ОСНОВНАЯ ОБЛАСТЬ ===== -->
<div id="main">
  <!-- Палитра -->
  <div id="palette">
    <h4>🎯 Motion</h4>
    <div class="block-item" data-block='{"type":"move","args":{"steps":10}}'><span class="dot" style="background:#4C97FF;"></span> двигать 10</div>
    <div class="block-item" data-block='{"type":"turn","args":{"degrees":15}}'><span class="dot" style="background:#4C97FF;"></span> повернуть 15°</div>
    <div class="block-item" data-block='{"type":"goto","args":{"x":0,"y":0}}'><span class="dot" style="background:#4C97FF;"></span> перейти (0,0)</div>
    <div class="block-item" data-block='{"type":"glide","args":{"secs":1,"x":100,"y":100}}'><span class="dot" style="background:#4C97FF;"></span> плавно (100,100)</div>
    <div class="block-item" data-block='{"type":"bounce"}'><span class="dot" style="background:#4C97FF;"></span> отскочить</div>

    <h4>🔄 Controls</h4>
    <div class="block-item" data-block='{"type":"repeat","args":{"times":5}}'><span class="dot" style="background:#FFAB19;"></span> повторить 5</div>
    <div class="block-item" data-block='{"type":"forever"}'><span class="dot" style="background:#FFAB19;"></span> всегда</div>
    <div class="block-item" data-block='{"type":"if","args":{"condition":"x > 100"}}'><span class="dot" style="background:#FFAB19;"></span> если x>100</div>
    <div class="block-item" data-block='{"type":"wait","args":{"secs":1}}'><span class="dot" style="background:#FFAB19;"></span> ждать 1с</div>

    <h4>👀 Looks</h4>
    <div class="block-item" data-block='{"type":"say","args":{"text":"Hello","secs":2}}'><span class="dot" style="background:#9966FF;"></span> сказать "Hello"</div>
    <div class="block-item" data-block='{"type":"show"}'><span class="dot" style="background:#9966FF;"></span> показать</div>
    <div class="block-item" data-block='{"type":"hide"}'><span class="dot" style="background:#9966FF;"></span> спрятать</div>
    <div class="block-item" data-block='{"type":"size","args":{"size":50}}'><span class="dot" style="background:#9966FF;"></span> размер 50%</div>

    <h4>📦 Variables</h4>
    <div class="block-item" data-block='{"type":"set_var","args":{"name":"x","value":0}}'><span class="dot" style="background:#FF8C1A;"></span> x = 0</div>
    <div class="block-item" data-block='{"type":"change_var","args":{"name":"x","amount":5}}'><span class="dot" style="background:#FF8C1A;"></span> x += 5</div>
    <div class="block-item" data-block='{"type":"add_list","args":{"name":"primes","value":2}}'><span class="dot" style="background:#FF8C1A;"></span> добавить в список</div>

    <h4>🎨 Pen</h4>
    <div class="block-item" data-block='{"type":"pen_down"}'><span class="dot" style="background:#00b894;"></span> перо вниз</div>
    <div class="block-item" data-block='{"type":"pen_up"}'><span class="dot" style="background:#00b894;"></span> перо вверх</div>
    <div class="block-item" data-block='{"type":"clear"}'><span class="dot" style="background:#00b894;"></span> очистить</div>

    <h4>🔵 Operators</h4>
    <div class="block-item" data-block='{"type":"add","args":{"a":5,"b":3}}'><span class="dot" style="background:#59C059;"></span> a + b</div>
    <div class="block-item" data-block='{"type":"mod","args":{"a":10,"b":3}}'><span class="dot" style="background:#59C059;"></span> a mod b</div>
    <div class="block-item" data-block='{"type":"random","args":{"min":1,"max":10}}'><span class="dot" style="background:#59C059;"></span> случайное</div>
  </div>

  <!-- Рабочая область -->
  <div id="workspace">
    <div id="stage-container">
      <canvas id="stage"></canvas>
    </div>
    <div id="script-area">
      <span class="empty-hint">📋 Перетащи блок сюда, чтобы собрать программу</span>
    </div>
  </div>

  <!-- Спрайты и переменные -->
  <div id="sidebar">
    <h4>🎭 Спрайты</h4>
    <div id="sprite-list">
      <div class="sprite-item active" data-sprite="0">
        <span class="dot" style="background:#00d2d3;"></span> Объект
        <span style="margin-left:auto;font-size:10px;color:#888;">0 клонов</span>
      </div>
    </div>
    <div id="clone-list" class="clone-list"></div>

    <h4>📊 Переменные</h4>
    <div id="var-list">
      <div class="var-item"><span>x</span> <span class="val">0</span></div>
      <div class="var-item"><span>y</span> <span class="val">0</span></div>
      <div class="var-item"><span>primes</span> <span class="val">[]</span></div>
    </div>

    <h4>💡 Советы</h4>
    <div style="font-size:11px;color:#888;line-height:1.5;">
      🧩 Перетащи блоки в скрипт<br>
      🤖 AI поможет собрать программу<br>
      📋 Клоны создаются нажатием кнопки
    </div>
  </div>
</div>

<!-- ===== AI МОДАЛЬНОЕ ОКНО ===== -->
<div id="ai-modal">
  <div class="box">
    <h2>🤖 AI Помощник</h2>
    <p style="color:#888;font-size:14px;margin-bottom:10px;">Опиши что хочешь сделать:</p>
    <textarea id="ai-input" placeholder="Например: нарисовать квадрат со стороной 100"></textarea>
    <div class="actions">
      <button class="primary" id="ai-generate">✨ Собрать</button>
      <button class="danger" id="ai-close">✕ Закрыть</button>
    </div>
    <div id="ai-result" style="margin-top:10px;color:#00d2d3;font-size:13px;display:none;"></div>
  </div>
</div>

<!-- ========================================== -->
<!-- ===== ВЕСЬ JS ===== -->
<!-- ========================================== -->
<script>
// ============================================
// 1. СЦЕНА (Canvas)
// ============================================
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  const container = document.getElementById('stage-container');
  W = canvas.width = container.clientWidth;
  H = canvas.height = container.clientHeight;
  render();
}
window.addEventListener('resize', resizeCanvas);

// ============================================
// 2. СОСТОЯНИЕ
// ============================================
let sprites = [{
  id: 0,
  name: 'Объект',
  x: 200,
  y: 200,
  angle: 0,
  size: 25,
  visible: true,
  color: '#00d2d3',
  penDown: false
}];
let clones = [];
let currentSpriteId = 0;
let variables = { x: 0, y: 0, primes: [] };
let scriptBlocks = [];
let blockIdCounter = 0;
let running = false;
let trail = [];

function getSprite(id) {
  return sprites.find(s => s.id === id) || sprites[0];
}

function getCurrentSprite() {
  return getSprite(currentSpriteId);
}

// ============================================
// 3. РЕНДЕР
// ============================================
function render() {
  ctx.clearRect(0, 0, W, H);
  
  // Сетка
  ctx.strokeStyle = '#e8e8e8';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  
  // След пера
  if (trail.length > 1) {
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
      ctx.lineTo(trail[i].x, trail[i].y);
    }
    ctx.stroke();
  }
  
  // Рисуем все спрайты
  [...sprites, ...clones].forEach(sprite => {
    if (!sprite.visible) return;
    
    ctx.save();
    ctx.translate(sprite.x, sprite.y);
    ctx.rotate((sprite.angle || 0) * Math.PI / 180);
    
    const size = sprite.size || 25;
    
    // Тень
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 8;
    
    // Тело
    const grad = ctx.createRadialGradient(-5, -5, 0, 0, 0, size);
    grad.addColorStop(0, sprite.color || '#00d2d3');
    grad.addColorStop(1, '#008080');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Глаза
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-size*0.3, -size*0.2, size*0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size*0.3, -size*0.2, size*0.3, 0, Math.PI*2);
    ctx.fill();
    
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.arc(-size*0.2, -size*0.15, size*0.15, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size*0.4, -size*0.15, size*0.15, 0, Math.PI*2);
    ctx.fill();
    
    // Рот
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, size*0.05, size*0.2, 0, Math.PI);
    ctx.stroke();
    
    // Имя
    ctx.restore();
    ctx.fillStyle = '#333';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(sprite.name || 'Объект', sprite.x, sprite.y + size + 16);
  });
  
  // Координаты
  const s = getCurrentSprite();
  ctx.fillStyle = '#666';
  ctx.font = '11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('x: ' + Math.round(s.x) + '  y: ' + Math.round(s.y), 10, 20);
  ctx.fillText('угол: ' + Math.round(s.angle || 0) + '°', 10, 36);
  ctx.fillText('спрайты: ' + (sprites.length + clones.length), 10, 52);
  
  // Обновляем переменные
  updateVariables();
}

// ============================================
// 4. БЛОКИ
// ============================================
const scriptArea = document.getElementById('script-area');

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
    scriptBlocks.push({
      id: ++blockIdCounter,
      type: block.type,
      args: { ...block.args },
      children: []
    });
    renderScript();
    document.getElementById('status').textContent = '✅ Блок добавлен';
  } catch(err) {
    console.error('Ошибка:', err);
  }
});

function removeBlock(index) {
  scriptBlocks.splice(index, 1);
  renderScript();
  render();
}

function renderScript() {
  scriptArea.innerHTML = '';
  
  if (scriptBlocks.length === 0) {
    scriptArea.innerHTML = '<span class="empty-hint">📋 Перетащи блок сюда</span>';
    return;
  }
  
  scriptBlocks.forEach((block, index) => {
    const div = document.createElement('div');
    div.className = 'script-block';
    div.style.background = getBlockColor(block.type);
    
    const label = getBlockLabel(block);
    div.innerHTML = \`
      \${label}
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

function getBlockColor(type) {
  const colors = {
    move: '#4C97FF', turn: '#4C97FF', goto: '#4C97FF', glide: '#4C97FF', bounce: '#4C97FF',
    repeat: '#FFAB19', forever: '#FFAB19', if: '#FFAB19', wait: '#FFAB19',
    say: '#9966FF', show: '#9966FF', hide: '#9966FF', size: '#9966FF',
    set_var: '#FF8C1A', change_var: '#FF8C1A', add_list: '#FF8C1A',
    add: '#59C059', mod: '#59C059', random: '#59C059',
    pen_down: '#00b894', pen_up: '#00b894', clear: '#00b894'
  };
  return colors[type] || '#666';
}

function getBlockLabel(block) {
  const labels = {
    move: \`➡️ двигать \${block.args.steps}\`,
    turn: \`🔄 повернуть \${block.args.degrees}°\`,
    goto: \`📍 перейти (\${block.args.x},\${block.args.y})\`,
    glide: \`🕊️ плавно (\${block.args.x},\${block.args.y}) \${block.args.secs}с\`,
    bounce: '↕ отскочить',
    repeat: \`🔁 повторить \${block.args.times}\`,
    forever: '🔁 всегда',
    if: \`❓ если \${block.args.condition}\`,
    wait: \`⏳ ждать \${block.args.secs}с\`,
    say: \`💬 "\${block.args.text}" \${block.args.secs}с\`,
    show: '👀 показать',
    hide: '🙈 спрятать',
    size: \`📐 размер \${block.args.size}%\`,
    set_var: \`📦 \${block.args.name} = \${block.args.value}\`,
    change_var: \`📦 \${block.args.name} += \${block.args.amount}\`,
    add_list: \`📋 добавить \${block.args.value} в \${block.args.name}\`,
    add: \`➕ \${block.args.a} + \${block.args.b}\`,
    mod: \`🔢 \${block.args.a} mod \${block.args.b}\`,
    random: \`🎲 случайное \${block.args.min}-\${block.args.max}\`,
    pen_down: '🖊️ перо вниз',
    pen_up: '✋ перо вверх',
    clear: '🧹 очистить'
  };
  return labels[block.type] || block.type;
}

// ============================================
// 5. ИСПОЛНИТЕЛЬ
// ============================================
function executeScript() {
  if (running) return;
  running = true;
  document.getElementById('status').textContent = '▶️ Выполняется...';
  
  // Сброс
  trail = [];
  const s = getCurrentSprite();
  s.x = 200;
  s.y = 200;
  s.angle = 0;
  s.penDown = false;
  
  // Проходим по блокам
  for (let i = 0; i < scriptBlocks.length; i++) {
    if (!running) break;
    executeBlock(scriptBlocks[i], s);
  }
  
  running = false;
  document.getElementById('status').textContent = '✅ Выполнено!';
  render();
}

function executeBlock(block, sprite) {
  if (!sprite) sprite = getCurrentSprite();
  
  switch(block.type) {
    case 'move': {
      const rad = (sprite.angle || 0) * Math.PI / 180;
      const dx = block.args.steps * Math.cos(rad);
      const dy = block.args.steps * Math.sin(rad);
      if (sprite.penDown) {
        trail.push({ x: sprite.x, y: sprite.y });
        trail.push({ x: sprite.x + dx, y: sprite.y + dy });
      }
      sprite.x += dx;
      sprite.y += dy;
      variables.x = Math.round(sprite.x);
      variables.y = Math.round(sprite.y);
      render();
      break;
    }
    case 'turn': {
      sprite.angle = (sprite.angle || 0) + block.args.degrees;
      render();
      break;
    }
    case 'goto': {
      sprite.x = block.args.x;
      sprite.y = block.args.y;
      variables.x = Math.round(sprite.x);
      variables.y = Math.round(sprite.y);
      render();
      break;
    }
    case 'glide': {
      const steps = 20;
      const dx = (block.args.x - sprite.x) / steps;
      const dy = (block.args.y - sprite.y) / steps;
      for (let i = 0; i < steps; i++) {
        sprite.x += dx;
        sprite.y += dy;
        render();
        if (!running) break;
      }
      break;
    }
    case 'bounce': {
      if (sprite.x < 0 || sprite.x > W) sprite.angle = 180 - (sprite.angle || 0);
      if (sprite.y < 0 || sprite.y > H) sprite.angle = -(sprite.angle || 0);
      render();
      break;
    }
    case 'repeat': {
      for (let i = 0; i < block.args.times; i++) {
        if (!running) break;
        // Ищем дочерние блоки (в упрощённой версии — следующие блоки)
        const idx = scriptBlocks.indexOf(block);
        for (let j = idx + 1; j < scriptBlocks.length; j++) {
          if (scriptBlocks[j].type === 'repeat' || scriptBlocks[j].type === 'forever') break;
          executeBlock(scriptBlocks[j], sprite);
          if (!running) break;
        }
      }
      break;
    }
    case 'forever': {
      while (running) {
        const idx = scriptBlocks.indexOf(block);
        for (let j = idx + 1; j < scriptBlocks.length; j++) {
          if (scriptBlocks[j].type === 'forever' || scriptBlocks[j].type === 'repeat') break;
          executeBlock(scriptBlocks[j], sprite);
          if (!running) break;
        }
        if (!running) break;
      }
      break;
    }
    case 'if': {
      try {
        const condition = block.args.condition.replace(/x/g, variables.x).replace(/y/g, variables.y);
        if (eval(condition)) {
          const idx = scriptBlocks.indexOf(block);
          for (let j = idx + 1; j < scriptBlocks.length; j++) {
            if (scriptBlocks[j].type === 'if') break;
            executeBlock(scriptBlocks[j], sprite);
            if (!running) break;
          }
        }
      } catch(e) {}
      break;
    }
    case 'wait': {
      const start = Date.now();
      while (Date.now() - start < block.args.secs * 1000) {
        if (!running) break;
      }
      break;
    }
    case 'say': {
      document.getElementById('status').textContent = \`💬 "\${block.args.text}"\`;
      const start = Date.now();
      while (Date.now() - start < block.args.secs * 1000) {
        if (!running) break;
      }
      document.getElementById('status').textContent = '✅ Выполнено!';
      break;
    }
    case 'show': {
      sprite.visible = true;
      render();
      break;
    }
    case 'hide': {
      sprite.visible = false;
      render();
      break;
    }
    case 'size': {
      sprite.size = block.args.size * 0.5;
      render();
      break;
    }
    case 'set_var': {
      variables[block.args.name] = block.args.value;
      render();
      break;
    }
    case 'change_var': {
      variables[block.args.name] = (variables[block.args.name] || 0) + block.args.amount;
      render();
      break;
    }
    case 'add_list': {
      if (!variables[block.args.name]) variables[block.args.name] = [];
      variables[block.args.name].push(block.args.value);
      render();
      break;
    }
    case 'add': {
      const result = block.args.a + block.args.b;
      document.getElementById('status').textContent = \`➕ \${block.args.a} + \${block.args.b} = \${result}\`;
      break;
    }
    case 'mod': {
      const result = block.args.a % block.args.b;
      document.getElementById('status').textContent = \`🔢 \${block.args.a} mod \${block.args.b} = \${result}\`;
      break;
    }
    case 'random': {
      const result = Math.floor(Math.random() * (block.args.max - block.args.min + 1)) + block.args.min;
      document.getElementById('status').textContent = \`🎲 Случайное: \${result}\`;
      break;
    }
    case 'pen_down': {
      sprite.penDown = true;
      break;
    }
    case 'pen_up': {
      sprite.penDown = false;
      break;
    }
    case 'clear': {
      trail = [];
      render();
      break;
    }
  }
}

// ============================================
// 6. КЛОНИРОВАНИЕ
// ============================================
function createClone() {
  const s = getCurrentSprite();
  const clone = {
    id: Date.now(),
    name: 'Клон ' + (clones.length + 1),
    x: s.x + 20,
    y: s.y + 20,
    angle: s.angle || 0,
    size: s.size || 25,
    visible: true,
    color: '#ff6b6b',
    penDown: false,
    isClone: true
  };
  clones.push(clone);
  updateSpriteList();
  render();
  document.getElementById('status').textContent = '📋 Клон создан!';
}

document.getElementById('clone-btn').addEventListener('click', createClone);

// ============================================
// 7. СПИСОК СПРАЙТОВ
// ============================================
function updateSpriteList() {
  const list = document.getElementById('sprite-list');
  list.innerHTML = '';
  
  // Основной спрайт
  const mainDiv = document.createElement('div');
  mainDiv.className = 'sprite-item active';
  mainDiv.dataset.sprite = '0';
  mainDiv.innerHTML = \`
    <span class="dot" style="background:#00d2d3;"></span>
    Объект
    <span style="margin-left:auto;font-size:10px;color:#888;">\${clones.length} клонов</span>
  \`;
  list.appendChild(mainDiv);
  
  // Клоны
  clones.forEach((clone, i) => {
    const div = document.createElement('div');
    div.className = 'sprite-item';
    div.dataset.sprite = clone.id;
    div.innerHTML = \`
      <span class="dot" style="background:#ff6b6b;"></span>
      \${clone.name}
      <span style="margin-left:auto;font-size:10px;color:#888;">✕</span>
    \`;
    div.querySelector('span:last-child').addEventListener('click', () => {
      clones.splice(i, 1);
      updateSpriteList();
      render();
    });
    list.appendChild(div);
  });
}

// ============================================
// 8. AI ПОМОЩНИК
// ============================================
document.getElementById('ai-btn').addEventListener('click', () => {
  document.getElementById('ai-modal').classList.add('show');
});

document.getElementById('ai-close').addEventListener('click', () => {
  document.getElementById('ai-modal').classList.remove('show');
});

document.getElementById('ai-generate').addEventListener('click', () => {
  const input = document.getElementById('ai-input').value.toLowerCase();
  const result = document.getElementById('ai-result');
  
  // Простой AI парсинг
  let blocks = [];
  
  if (input.includes('квадрат')) {
    const size = parseInt(input.match(/\\d+/)?.[0] || 50);
    blocks = [
      { type: 'pen_down', args: {} },
      { type: 'repeat', args: { times: 4 } },
      { type: 'move', args: { steps: size } },
      { type: 'turn', args: { degrees: 90 } },
      { type: 'pen_up', args: {} }
    ];
    result.textContent = '✨ Собран скрипт для квадрата!';
  } else if (input.includes('круг')) {
    blocks = [
      { type: 'pen_down', args: {} },
      { type: 'repeat', args: { times: 36 } },
      { type: 'move', args: { steps: 5 } },
      { type: 'turn', args: { degrees: 10 } },
      { type: 'pen_up', args: {} }
    ];
    result.textContent = '✨ Собран скрипт для круга!';
  } else if (input.includes('спираль')) {
    blocks = [
      { type: 'set_var', args: { name: 'step', value: 5 } },
      { type: 'repeat', args: { times: 30 } },
      { type: 'move', args: { steps: 5 } },
      { type: 'turn', args: { degrees: 15 } },
      { type: 'change_var', args: { name: 'step', amount: 1 } }
    ];
    result.textContent = '✨ Собран скрипт для спирали!';
  } else if (input.includes('прямоугольник')) {
    const w = parseInt(input.match(/ширина\\s*(\\d+)/)?.[1] || 80);
    const h = parseInt(input.match(/высота\\s*(\\d+)/)?.[1] || 50);
    blocks = [
      { type: 'pen_down', args: {} },
      { type: 'move', args: { steps: w } },
      { type: 'turn', args: { degrees: 90 } },
      { type: 'move', args: { steps: h } },
      { type: 'turn', args: { degrees: 90 } },
      { type: 'move', args: { steps: w } },
      { type: 'turn', args: { degrees: 90 } },
      { type: 'move', args: { steps: h } },
      { type: 'turn', args: { degrees: 90 } },
      { type: 'pen_up', args: {} }
    ];
    result.textContent = '✨ Собран скрипт для прямоугольника!';
  } else if (input.includes('звезда')) {
    blocks = [
      { type: 'pen_down', args: {} },
      { type: 'repeat', args: { times: 5 } },
      { type: 'move', args: { steps: 60 } },
      { type: 'turn', args: { degrees: 144 } },
      { type: 'pen_up', args: {} }
    ];
    result.textContent = '✨ Собран скрипт для звезды!';
  } else if (input.includes('простое') || input.includes('улам')) {
    // Спираль Улама
    blocks = [
      { type: 'set_var', args: { name: 'primes', value: [] } },
      { type: 'set_var', args: { name: 'n', value: 2 } },
      { type: 'set_var', args: { name: 'max', value: 100 } },
      { type: 'repeat', args: { times: 50 } },
      { type: 'move', args: { steps: 3 } },
      { type: 'turn', args: { degrees: 7 } }
    ];
    result.textContent = '✨ Собран скрипт для спирали Улама!';
  } else {
    blocks = [
      { type: 'move', args: { steps: 50 } },
      { type: 'turn', args: { degrees: 90 } },
      { type: 'move', args: { steps: 50 } },
      { type: 'turn', args: { degrees: 90 } }
    ];
    result.textContent = '🤖 Не понял запрос, собрал простой скрипт';
  }
  
  // Загружаем блоки
  scriptBlocks = blocks.map((b, i) => ({
    id: ++blockIdCounter,
    type: b.type,
    args: { ...b.args },
    children: []
  }));
  
  renderScript();
  render();
  result.style.display = 'block';
  
  setTimeout(() => {
    document.getElementById('ai-modal').classList.remove('show');
    result.style.display = 'none';
  }, 2000);
});

// ============================================
// 9. ЭКСПОРТ
// ============================================
document.getElementById('export-btn').addEventListener('click', () => {
  const code = generateHTML();
  const blob = new Blob([code], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'atom-app.html';
  a.click();
  URL.revokeObjectURL(url);
  document.getElementById('status').textContent = '📦 Экспортировано!';
});

function generateHTML() {
  let html = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Атом Приложение</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; height: 100vh; }
    canvas { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <canvas id="app" width="600" height="400"></canvas>
  <script>
    const canvas = document.getElementById('app');
    const ctx = canvas.getContext('2d');
    let x = 300, y = 200, angle = 0, penDown = false;
    let trail = [];
    
    function render() {
      ctx.clearRect(0, 0, 600, 400);
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      for(let i=0;i<600;i+=50){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,400); ctx.stroke(); }
      for(let i=0;i<400;i+=50){ ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(600,i); ctx.stroke(); }
      
      if(trail.length > 1) {
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for(let i=1;i<trail.length;i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#00d2d3';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI*2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x-6, y-4, 6, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x+6, y-4, 6, 0, Math.PI*2);
      ctx.fill();
      
      ctx.fillStyle = '#2d3436';
      ctx.beginPath();
      ctx.arc(x-4, y-2, 3, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x+8, y-2, 3, 0, Math.PI*2);
      ctx.fill();
    }
    
    function move(steps) {
      const rad = angle * Math.PI / 180;
      const dx = steps * Math.cos(rad);
      const dy = steps * Math.sin(rad);
      if(penDown) trail.push({x, y}, {x: x+dx, y: y+dy});
      x += dx; y += dy;
      render();
    }
    
    function turn(deg) { angle += deg; render(); }
    function goto(nx, ny) { x = nx; y = ny; render(); }
    function penDown() { penDown = true; }
    function penUp() { penDown = false; }
    function clear() { trail = []; render(); }
    
    // ===== ВЫПОЛНЕНИЕ СКРИПТА =====
    // (Здесь будет сгенерированный код из блоков)
    // ===== КОНЕЦ СКРИПТА =====
    
    render();
  <\/script>
</body>
</html>\`;
  
  // Добавляем блоки в код
  let scriptCode = '';
  scriptBlocks.forEach(block => {
    switch(block.type) {
      case 'move': scriptCode += \`move(\${block.args.steps});\\n\`; break;
      case 'turn': scriptCode += \`turn(\${block.args.degrees});\\n\`; break;
      case 'goto': scriptCode += \`goto(\${block.args.x}, \${block.args.y});\\n\`; break;
      case 'pen_down': scriptCode += 'penDown();\\n'; break;
      case 'pen_up': scriptCode += 'penUp();\\n'; break;
      case 'clear': scriptCode += 'clear();\\n'; break;
      case 'repeat': scriptCode += \`for(let i=0;i<\${block.args.times};i++){\\n\`; break;
    }
  });
  
  // Вставляем код в экспорт
  html = html.replace('// ===== ВЫПОЛНЕНИЕ СКРИПТА =====', scriptCode);
  
  return html;
}

// ============================================
// 10. УПРАВЛЕНИЕ
// ============================================
document.getElementById('run-btn').addEventListener('click', executeScript);

document.getElementById('stop-btn').addEventListener('click', () => {
  running = false;
  document.getElementById('status').textContent = '⏹ Остановлено';
});

document.getElementById('reset-btn').addEventListener('click', () => {
  running = false;
  const s = getCurrentSprite();
  s.x = 200;
  s.y = 200;
  s.angle = 0;
  s.penDown = false;
  trail = [];
  variables = { x: 0, y: 0, primes: [] };
  render();
  document.getElementById('status').textContent = '🔄 Сброшено';
});

document.getElementById('clear-btn').addEventListener('click', () => {
  scriptBlocks = [];
  blockIdCounter = 0;
  renderScript();
  document.getElementById('status').textContent = '🗑️ Очищено';
});

function updateVariables() {
  const list = document.getElementById('var-list');
  list.innerHTML = '';
  for (let key in variables) {
    const val = Array.isArray(variables[key]) ? JSON.stringify(variables[key]) : variables[key];
    list.innerHTML += \`<div class="var-item"><span>\${key}</span> <span class="val">\${val}</span></div>\`;
  }
}

// Клик по сцене
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (W / rect.width);
  const y = (e.clientY - rect.top) * (H / rect.height);
  const s = getCurrentSprite();
  s.x = x;
  s.y = y;
  variables.x = Math.round(s.x);
  variables.y = Math.round(s.y);
  render();
});

// ============================================
// 11. ЗАГРУЗКА ПРИМЕРА (Спираль Улама)
// ============================================
function loadUlamSpiral() {
  scriptBlocks = [
    { id: ++blockIdCounter, type: 'set_var', args: { name: 'step', value: 5 }, children: [] },
    { id: ++blockIdCounter, type: 'set_var', args: { name: 'primes', value: [] }, children: [] },
    { id: ++blockIdCounter, type: 'pen_down', args: {}, children: [] },
    { id: ++blockIdCounter, type: 'repeat', args: { times: 50 }, children: [] },
    { id: ++blockIdCounter, type: 'move', args: { steps: 5 }, children: [] },
    { id: ++blockIdCounter, type: 'turn', args: { degrees: 15 }, children: [] },
    { id: ++blockIdCounter, type: 'change_var', args: { name: 'step', amount: 1 }, children: [] },
    { id: ++blockIdCounter, type: 'pen_up', args: {}, children: [] }
  ];
  renderScript();
  render();
  document.getElementById('status').textContent = '🧮 Загружена спираль Улама!';
}

// Загружаем спираль Улама по умолчанию
setTimeout(loadUlamSpiral, 500);

// ============================================
// 12. ИНИЦИАЛИЗАЦИЯ
// ============================================
resizeCanvas();
render();
updateSpriteList();
console.log('🧩 Атом Билдер Pro с AI и обучением загружен!');
console.log('🤖 Напиши "квадрат", "круг", "спираль" в AI помощнике');
</script>
</body>
</html>
  `);
});

// ============================================
// ЗАПУСК СЕРВЕРА
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Атом Билдер Pro запущен на http://localhost:${PORT}`);
  console.log(`🤖 AI помощник: скажи "квадрат", "круг", "спираль"`);
  console.log(`📦 Экспорт в HTML приложение`);
});
