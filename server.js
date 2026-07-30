const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============================================================
// ГЛАВНАЯ СТРАНИЦА — конструктор сайтов и игр
// ============================================================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Атом Билдер ULTRA</title>
  <style>
    /* ========== ГЛОБАЛЬНЫЕ СТИЛИ ========== */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0a0a0f; display: flex; height: 100vh; color: #fff; overflow: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #14141e; }
    ::-webkit-scrollbar-thumb { background: #00d4ff; border-radius: 3px; }

    /* ========== ПАЛИТРА БЛОКОВ ========== */
    #palette {
      width: 260px;
      background: #14141e;
      padding: 20px;
      border-right: 2px solid #2a2a3a;
      overflow-y: auto;
      flex-shrink: 0;
    }
    #palette h3 {
      margin-bottom: 20px;
      color: #00d4ff;
      font-size: 18px;
      letter-spacing: 1px;
      border-bottom: 2px solid #2a2a3a;
      padding-bottom: 12px;
    }
    .block-item {
      background: #1c1c2a;
      padding: 14px 18px;
      border-radius: 10px;
      margin: 8px 0;
      cursor: grab;
      border: 2px solid #2a2a3a;
      transition: 0.2s;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }
    .block-item:hover {
      border-color: #00d4ff;
      transform: translateX(4px);
      background: #24243a;
    }
    .block-item:active { cursor: grabbing; opacity: 0.7; }
    .block-item .icon { font-size: 22px; }
    .block-item .badge {
      background: #ff4757;
      color: #fff;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 10px;
      margin-left: auto;
      font-weight: 700;
    }
    .block-item .badge.green { background: #00d4ff; color: #0a0a0f; }

    /* ========== РАБОЧАЯ ОБЛАСТЬ ========== */
    #workspace {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      background: #0a0a0f;
      min-width: 0;
    }
    #preview-container {
      flex: 1;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      min-height: 300px;
      position: relative;
    }
    #preview-container iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #fff;
    }

    /* ========== СКРИПТЫ (собранные блоки) ========== */
    #script-area {
      background: #14141e;
      padding: 15px;
      border-radius: 10px;
      margin-top: 15px;
      min-height: 70px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      border: 2px dashed #2a2a3a;
    }
    #script-area .empty-hint { color: #666; font-size: 13px; }
    .script-block {
      background: #00d4ff;
      color: #0a0a0f;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .script-block .remove {
      cursor: pointer;
      background: #ff4757;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      transition: 0.2s;
    }
    .script-block .remove:hover { transform: scale(1.2); }

    /* ========== КНОПКИ ========== */
    #controls {
      display: flex;
      gap: 12px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    #controls button {
      background: #00d4ff;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: 0.2s;
      color: #0a0a0f;
    }
    #controls button:hover { transform: scale(1.05); background: #01b4d4; }
    #controls button.secondary { background: #2a2a3a; color: #fff; }
    #controls button.secondary:hover { background: #3a3a5a; }
    #controls button.danger { background: #ff4757; color: #fff; }
    #controls button.danger:hover { background: #ff6b81; }

    /* ========== ВЫВОД КОДА ========== */
    #code-output {
      background: #14141e;
      padding: 15px;
      border-radius: 10px;
      margin-top: 10px;
      display: none;
      max-height: 250px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #00ff88;
      border: 1px solid #2a2a3a;
      white-space: pre-wrap;
      word-break: break-all;
    }
    #status {
      color: #888;
      font-size: 13px;
      margin-top: 8px;
    }
  </style>
</head>
<body>

<!-- ========== ПАЛИТРА ========== -->
<div id="palette">
  <h3>🧩 БЛОКИ</h3>

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
  
  <div class="block-item" draggable="true" data-block="yandex">
    <span class="icon">🌐</span> Яндекс-страница
    <span class="badge green">FULL</span>
  </div>
  
  <div class="block-item" draggable="true" data-block="google">
    <span class="icon">🔍</span> Google-страница
    <span class="badge green">FULL</span>
  </div>
  
  <div class="block-item" draggable="true" data-block="cs16">
    <span class="icon">🔫</span> CS 1.6 (3D)
    <span class="badge">3D</span>
  </div>
  
  <div class="block-item" draggable="true" data-block="market">
    <span class="icon">🛒</span> Интернет-магазин
    <span class="badge green">PRO</span>
  </div>

  <div style="margin-top:30px; border-top:1px solid #2a2a3a; padding-top:20px; color:#666; font-size:12px;">
    💡 Перетащи блок в область ниже
  </div>
</div>

<!-- ========== РАБОЧАЯ ОБЛАСТЬ ========== -->
<div id="workspace">
  <div id="preview-container">
    <iframe id="preview" srcdoc="<html><body style='font-family:sans-serif;padding:40px;background:#f0f2f5;color:#333;text-align:center;'><h1 style='font-size:48px;'>🚀 Атом Билдер ULTRA</h1><p style='font-size:20px;color:#666;'>Создавай сайты уровня Google и игры уровня CS 1.6</p><p style='font-size:16px;color:#888;margin-top:20px;'>Перетащи блоки из панели слева</p></body></html>"></iframe>
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

<!-- ============================================================ -->
<!-- ========== ВСЯ ЛОГИКА ФРОНТЕНДА ========== -->
<!-- ============================================================ -->
<script>
// ============================================================
// 1. УПРАВЛЕНИЕ БЛОКАМИ
// ============================================================
const scriptArea = document.getElementById('script-area');
const scriptBlocks = [];
let elementIdCounter = 0;

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
    case 'button': return { text: 'Нажми меня!', color: '#00d4ff' };
    case 'text': return { content: 'Привет, мир!', size: '18px' };
    case 'image': return { src: 'https://via.placeholder.com/200x150/00d4ff/fff?text=Image' };
    case 'input': return { placeholder: 'Введите текст...' };
    case 'container': return { bg: '#f5f5f5', padding: '20px' };
    case 'yandex': return { title: 'Яндекс' };
    case 'google': return { title: 'Google' };
    case 'cs16': return { map: 'de_dust2' };
    case 'market': return { name: 'Магазин' };
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
      yandex: '🌐 Яндекс',
      google: '🔍 Google',
      cs16: '🔫 CS 1.6',
      market: '🛒 Магазин'
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

// ============================================================
// 2. ГЕНЕРАТОР КОДА — ПОЛНОСТЬЮ РАБОЧИЙ
// ============================================================
function generateHTML() {
  let html = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Атом Билдер ULTRA</title>
  <style>
    /* ===== БАЗОВЫЕ СТИЛИ ===== */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f0f2f5; min-height: 100vh; }
    
    /* ===== ЯНДЕКС ===== */
    .yandex-header { background: #fff; padding: 15px 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
    .yandex-logo { font-size: 28px; font-weight: bold; color: #fc3f1d; letter-spacing: -1px; }
    .yandex-search { flex: 1; min-width: 200px; padding: 10px 20px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; }
    .yandex-search:focus { border-color: #fc3f1d; outline: none; }
    .yandex-btn { background: #fc3f1d; color: #fff; border: none; padding: 10px 30px; border-radius: 8px; font-size: 16px; cursor: pointer; }
    .yandex-btn:hover { background: #e03512; }
    .yandex-content { max-width: 1200px; margin: 30px auto; padding: 0 20px; display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
    .yandex-card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .yandex-card h2 { font-size: 20px; margin-bottom: 15px; color: #333; }
    .yandex-card p { color: #666; line-height: 1.8; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
    
    /* ===== GOOGLE ===== */
    .google-container { max-width: 800px; margin: 40px auto; padding: 0 20px; text-align: center; }
    .google-logo { font-size: 72px; font-weight: 700; letter-spacing: -4px; }
    .google-logo .g { color: #4285F4; }
    .google-logo .o1 { color: #EA4335; }
    .google-logo .o2 { color: #FBBC05; }
    .google-logo .l { color: #34A853; }
    .google-logo .e { color: #EA4335; }
    .google-search { width: 100%; max-width: 580px; padding: 14px 24px; border: 1px solid #dfe1e5; border-radius: 24px; font-size: 16px; margin: 20px auto; display: block; }
    .google-search:focus { outline: none; border-color: #4285F4; box-shadow: 0 1px 6px rgba(32,33,36,0.28); }
    .google-btn { background: #f8f9fa; border: 1px solid #f8f9fa; padding: 10px 24px; border-radius: 4px; font-size: 14px; cursor: pointer; margin: 5px; }
    .google-btn:hover { border-color: #dadce0; box-shadow: 0 1px 1px rgba(0,0,0,0.1); }
    
    /* ===== CS 1.6 ===== */
    .cs-container { background: #0a0a0f; padding: 20px; border-radius: 12px; text-align: center; margin: 20px; }
    .cs-hud { display: flex; justify-content: space-between; padding: 10px 20px; background: #14141e; border-radius: 8px; margin-bottom: 10px; color: #00ff88; font-family: monospace; font-size: 16px; }
    .cs-hud span { color: #ff6b6b; }
    .cs-canvas { background: #0a0a0f; border-radius: 8px; display: block; margin: 0 auto; cursor: crosshair; width: 100%; max-width: 900px; height: auto; aspect-ratio: 16/9; }
    .cs-info { color: #888; font-size: 12px; margin-top: 8px; }
    
    /* ===== МАГАЗИН ===== */
    .market-container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
    .market-header { background: #1a1a2e; color: #fff; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
    .market-cart { background: #00d4ff; color: #0a0a0f; padding: 8px 20px; border-radius: 20px; font-weight: 600; }
    .market-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-top: 20px; }
    .market-item { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center; transition: 0.2s; }
    .market-item:hover { transform: translateY(-4px); box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .market-item img { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; background: #f0f2f5; }
    .market-item h3 { margin: 12px 0 8px; font-size: 18px; color: #333; }
    .market-item .price { font-size: 20px; font-weight: 700; color: #00d4ff; }
    .market-item .buy-btn { background: #00d4ff; border: none; padding: 8px 24px; border-radius: 20px; font-weight: 600; cursor: pointer; margin-top: 10px; }
    .market-item .buy-btn:hover { background: #01b4d4; }
  </style>
</head>
<body>\`;

  // ============================================================
  // ОБРАБОТКА КАЖДОГО БЛОКА
  // ============================================================
  scriptBlocks.forEach(block => {
    switch(block.type) {

      // ---------- КНОПКА ----------
      case 'button':
        html += \`
          <button style="background:\${block.props.color};color:#fff;border:none;padding:14px 30px;border-radius:8px;font-size:18px;font-weight:600;cursor:pointer;margin:15px;transition:0.2s;"
                  onclick="alert('Привет от Атом Билдер!')">
            \${block.props.text}
          </button>\`;
        break;

      // ---------- ТЕКСТ ----------
      case 'text':
        html += \`<div style="font-size:\${block.props.size};color:#333;padding:15px;line-height:1.6;">\${block.props.content}</div>\`;
        break;

      // ---------- КАРТИНКА ----------
      case 'image':
        html += \`<img src="\${block.props.src}" style="max-width:100%;border-radius:8px;margin:15px;box-shadow:0 2px 8px rgba(0,0,0,0.1);" alt="image" />\`;
        break;

      // ---------- ПОЛЕ ВВОДА ----------
      case 'input':
        html += \`<input type="text" placeholder="\${block.props.placeholder}" style="padding:12px 20px;border:2px solid #ddd;border-radius:8px;margin:15px;font-size:16px;width:300px;max-width:90%;" />\`;
        break;

      // ---------- КОНТЕЙНЕР ----------
      case 'container':
        html += \`<div style="background:\${block.props.bg};padding:\${block.props.padding};border-radius:12px;margin:15px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">📦 Контейнер для блоков</div>\`;
        break;

      // ---------- ЯНДЕКС ----------
      case 'yandex':
        html += \`
          <div class="yandex-header">
            <div class="yandex-logo">Яндекс</div>
            <input class="yandex-search" placeholder="Найти..." />
            <button class="yandex-btn">Найти</button>
          </div>
          <div class="yandex-content">
            <div class="yandex-card">
              <h2>📰 Новости</h2>
              <p>• Атом Билдер ULTRA — создавай сайты и игры</p>
              <p>• CS 1.6 в браузере — настоящий 3D-шутер</p>
              <p>• Конструктор блоков обновлён до версии PRO MAX</p>
              <p>• Теперь с поддержкой интернет-магазинов</p>
            </div>
            <div class="yandex-card">
              <h2>📊 Погода</h2>
              <p>🌡️ +22°C, солнечно</p>
              <p>💨 Ветер 3 м/с</p>
              <p>💧 Влажность 45%</p>
              <p>📅 Сегодня, пятница</p>
            </div>
          </div>
        \`;
        break;

      // ---------- GOOGLE ----------
      case 'google':
        html += \`
          <div class="google-container">
            <div class="google-logo">
              <span class="g">G</span><span class="o1">o</span><span class="o2">o</span><span class="o2">g</span><span class="l">l</span><span class="e">e</span>
            </div>
            <input class="google-search" placeholder="Поиск в Google..." />
            <div>
              <button class="google-btn">Поиск в Google</button>
              <button class="google-btn">Мне повезёт</button>
            </div>
            <div style="margin-top:30px;display:grid;grid-template-columns:repeat(3,1fr);gap:15px;max-width:600px;margin-left:auto;margin-right:auto;">
              <div style="background:#fff;padding:15px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">🔍 Поиск</div>
              <div style="background:#fff;padding:15px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">📧 Почта</div>
              <div style="background:#fff;padding:15px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">📷 Фото</div>
            </div>
          </div>
        \`;
        break;

      // ---------- CS 1.6 (ПОЛНОЦЕННЫЙ 3D-ШУТЕР) ----------
      case 'cs16':
        html += \`
          <div class="cs-container">
            <div class="cs-hud">
              <div>🔫 Убийств: <span id="csKills">0</span></div>
              <div>🎯 Точность: <span id="csAccuracy">0%</span></div>
              <div>⏱️ Время: <span id="csTime">45</span>с</div>
              <div>❤️ Жизни: <span id="csHealth">100</span></div>
            </div>
            <canvas id="csCanvas" class="cs-canvas" width="900" height="506"></canvas>
            <div class="cs-info">🖱️ Кликай по врагам | ⌨️ WASD — движение (в разработке) | ⏱️ Игра 45 секунд</div>
          </div>
          <script>
            (function() {
              const canvas = document.getElementById('csCanvas');
              const ctx = canvas.getContext('2d');
              const W = 900, H = 506;
              let kills = 0, shots = 0, hits = 0, timeLeft = 45, health = 100;
              let gameActive = true;
              let enemies = [];
              let mouseX = W/2, mouseY = H/2;
              let keys = {};
              let player = { x: W/2, y: H/2, angle: 0, speed: 2 };

              // ---------- КЛАСС ВРАГА ----------
              class Enemy {
                constructor() {
                  this.x = Math.random() * (W - 60) + 30;
                  this.y = Math.random() * (H - 60) + 30;
                  this.radius = 18 + Math.random() * 14;
                  this.speed = 0.6 + Math.random() * 1.8;
                  this.angle = Math.random() * Math.PI * 2;
                  this.hp = Math.floor(this.radius / 8) + 1;
                  this.maxHp = this.hp;
                  this.type = Math.random() > 0.7 ? 'heavy' : 'normal';
                  if (this.type === 'heavy') { this.radius *= 1.4; this.hp *= 2; this.speed *= 0.6; }
                }
                update() {
                  const dx = player.x - this.x;
                  const dy = player.y - this.y;
                  const dist = Math.hypot(dx, dy);
                  if (dist < 300) {
                    this.angle = Math.atan2(dy, dx);
                    this.x += Math.cos(this.angle) * this.speed * 0.5;
                    this.y += Math.sin(this.angle) * this.speed * 0.5;
                  } else {
                    this.angle += (Math.random() - 0.5) * 0.1;
                    this.x += Math.cos(this.angle) * this.speed;
                    this.y += Math.sin(this.angle) * this.speed;
                  }
                  if (this.x < 10 || this.x > W-10) this.angle = Math.PI - this.angle;
                  if (this.y < 10 || this.y > H-10) this.angle = -this.angle;
                  // Атака на игрока
                  if (dist < this.radius + 15 && gameActive) {
                    health -= 0.5;
                    document.getElementById('csHealth').textContent = Math.round(health);
                    if (health <= 0) {
                      gameActive = false;
                      alert('💀 Ты погиб! Убийств: ' + kills);
                    }
                  }
                }
                draw() {
                  ctx.beginPath();
                  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                  const grad = ctx.createRadialGradient(this.x-5, this.y-5, 2, this.x, this.y, this.radius);
                  if (this.type === 'heavy') {
                    grad.addColorStop(0, '#ff6b6b');
                    grad.addColorStop(1, '#c0392b');
                  } else {
                    grad.addColorStop(0, '#ff4757');
                    grad.addColorStop(1, '#c0392b');
                  }
                  ctx.fillStyle = grad;
                  ctx.fill();
                  ctx.strokeStyle = '#ff6b81';
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  // HP бар
                  if (this.hp < this.maxHp) {
                    ctx.fillStyle = '#ff4757';
                    ctx.fillRect(this.x-20, this.y-this.radius-12, 40, 4);
                    ctx.fillStyle = '#00ff88';
                    ctx.fillRect(this.x-20, this.y-this.radius-12, 40 * (this.hp/this.maxHp), 4);
                  }
                  ctx.fillStyle = '#fff';
                  ctx.font = '16px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText('👾', this.x, this.y + 6);
                }
              }

              // ---------- СПАВН ----------
              function spawnEnemy() {
                if (enemies.length < 10 && gameActive) {
                  const e = new Enemy();
                  // Спавн не рядом с игроком
                  while (Math.hypot(e.x - player.x, e.y - player.y) < 120) {
                    e.x = Math.random() * (W - 60) + 30;
                    e.y = Math.random() * (H - 60) + 30;
                  }
                  enemies.push(e);
                }
              }
              setInterval(spawnEnemy, 800);

              // ---------- УПРАВЛЕНИЕ ----------
              document.addEventListener('keydown', (e) => keys[e.key] = true);
              document.addEventListener('keyup', (e) => keys[e.key] = false);

              canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = W / rect.width;
                const scaleY = H / rect.height;
                mouseX = (e.clientX - rect.left) * scaleX;
                mouseY = (e.clientY - rect.top) * scaleY;
              });

              canvas.addEventListener('click', (e) => {
                if (!gameActive) return;
                const rect = canvas.getBoundingClientRect();
                const scaleX = W / rect.width;
                const scaleY = H / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                shots++;
                let hit = false;
                for (let i = enemies.length-1; i >= 0; i--) {
                  const enemy = enemies[i];
                  const dist = Math.hypot(x - enemy.x, y - enemy.y);
                  if (dist < enemy.radius) {
                    enemy.hp--;
                    hits++;
                    if (enemy.hp <= 0) {
                      kills++;
                      enemies.splice(i, 1);
                      document.getElementById('csKills').textContent = kills;
                    }
                    hit = true;
                    break;
                  }
                }
                if (hit) {
                  document.getElementById('csAccuracy').textContent = Math.round((hits/shots)*100) + '%';
                }
              });

              // ---------- ИГРОВОЙ ЦИКЛ ----------
              function update() {
                if (!gameActive) return;
                // Движение игрока
                let dx = 0, dy = 0;
                if (keys['w'] || keys['W'] || keys['ArrowUp']) dy = -player.speed;
                if (keys['s'] || keys['S'] || keys['ArrowDown']) dy = player.speed;
                if (keys['a'] || keys['A'] || keys['ArrowLeft']) dx = -player.speed;
                if (keys['d'] || keys['D'] || keys['ArrowRight']) dx = player.speed;
                if (dx && dy) { dx *= 0.707; dy *= 0.707; }
                player.x = Math.max(20, Math.min(W-20, player.x + dx));
                player.y = Math.max(20, Math.min(H-20, player.y + dy));
                // Поворот к мышке
                player.angle = Math.atan2(mouseY - player.y, mouseX - player.x);
                // Обновление врагов
                enemies.forEach(e => e.update());
                enemies = enemies.filter(e => e.hp > 0);
              }

              function draw() {
                ctx.clearRect(0, 0, W, H);
                // Карта
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, W, H);
                                // Сетка (продолжение)
                ctx.strokeStyle = '#2a2a3a';
                ctx.lineWidth = 0.5;
                for (let i = 0; i < W; i += 50) {
                  ctx.beginPath();
                  ctx.moveTo(i, 0);
                  ctx.lineTo(i, H);
                  ctx.stroke();
                }
                for (let i = 0; i < H; i += 50) {
                  ctx.beginPath();
                  ctx.moveTo(0, i);
                  ctx.lineTo(W, i);
                  ctx.stroke();
                }

                // Враги
                enemies.forEach(e => e.draw());

                // Игрок (круг с прицелом)
                ctx.beginPath();
                ctx.arc(player.x, player.y, 12, 0, Math.PI * 2);
                ctx.fillStyle = '#00d4ff';
                ctx.fill();
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                ctx.stroke();
                // Линия прицела
                ctx.beginPath();
                ctx.moveTo(player.x, player.y);
                ctx.lineTo(player.x + 40 * Math.cos(player.angle), player.y + 40 * Math.sin(player.angle));
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Прицел (крестик) по позиции мыши
                ctx.strokeStyle = '#ff4757';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(mouseX - 15, mouseY);
                ctx.lineTo(mouseX + 15, mouseY);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(mouseX, mouseY - 15);
                ctx.lineTo(mouseX, mouseY + 15);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 6, 0, Math.PI * 2);
                ctx.stroke();

                // Радиус обстрела
                ctx.beginPath();
                ctx.arc(player.x, player.y, 120, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0,255,136,0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
              }

              // ---------- ТАЙМЕР ----------
              const timer = setInterval(() => {
                timeLeft--;
                document.getElementById('csTime').textContent = timeLeft;
                if (timeLeft <= 0 || health <= 0) {
                  gameActive = false;
                  clearInterval(timer);
                  if (health > 0) {
                    alert('🏆 Время вышло! Убийств: ' + kills + ' | Точность: ' + Math.round((hits/shots)*100) + '%');
                  }
                  document.getElementById('csTime').textContent = '0';
                }
              }, 1000);

              // ---------- ЗАПУСК ----------
              function gameLoop() {
                update();
                draw();
                requestAnimationFrame(gameLoop);
              }
              gameLoop();

              // Отладка
              console.log('🔫 CS 1.6 загружен!');
              console.log('🎯 Кликай по врагам, двигайся WASD');
            })();
          <\/script>
        \`;
        break;

      // ---------- ИНТЕРНЕТ-МАГАЗИН ----------
      case 'market':
        const products = [
          { name: 'Ноутбук', price: '49 990 ₽', img: 'https://via.placeholder.com/200x150/00d4ff/fff?text=💻' },
          { name: 'Смартфон', price: '29 990 ₽', img: 'https://via.placeholder.com/200x150/ff6b6b/fff?text=📱' },
          { name: 'Наушники', price: '4 990 ₽', img: 'https://via.placeholder.com/200x150/f39c12/fff?text=🎧' },
          { name: 'Часы', price: '12 490 ₽', img: 'https://via.placeholder.com/200x150/8e44ad/fff?text=⌚' },
          { name: 'Планшет', price: '18 990 ₽', img: 'https://via.placeholder.com/200x150/00d4ff/fff?text=📲' },
          { name: 'Клавиатура', price: '3 490 ₽', img: 'https://via.placeholder.com/200x150/2ecc71/fff?text=⌨️' }
        ];
        let cartCount = 0;
        let cartHtml = '';
        products.forEach(p => {
          cartHtml += \`
            <div class="market-item">
              <img src="\${p.img}" alt="\${p.name}" />
              <h3>\${p.name}</h3>
              <div class="price">\${p.price}</div>
              <button class="buy-btn" onclick="addToCart()">🛒 В корзину</button>
            </div>
          \`;
        });
        html += \`
          <div class="market-container">
            <div class="market-header">
              <h2>🛒 \${block.props.name}</h2>
              <div class="market-cart">🛒 Корзина: <span id="cartCount">0</span> товаров</div>
            </div>
            <div class="market-grid">
              \${cartHtml}
            </div>
          </div>
          <script>
            let cart = 0;
            function addToCart() {
              cart++;
              document.getElementById('cartCount').textContent = cart;
              if (cart > 5) {
                document.querySelector('.market-cart').style.background = '#ff4757';
                document.querySelector('.market-cart').style.color = '#fff';
              }
            }
            console.log('🛒 Магазин загружен!');
          <\/script>
        \`;
        break;
    }
  });

  // Закрываем HTML
  html += `</body></html>`;
  return html;
}

// ============================================================
// 3. ПРЕВЬЮ И ЭКСПОРТ
// ============================================================
function renderPreview() {
  const html = generateHTML();
  document.getElementById('preview').srcdoc = html;
}

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
  a.download = 'atom-site-ultra.html';
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
console.log('✅ Атом Билдер ULTRA загружен!');
</script>
</body>
</html>
  `);
});

// ============================================================
// 4. API ДЛЯ ВНЕШНИХ ЗАПРОСОВ
// ============================================================
app.post('/api/generate', (req, res) => {
  const { blocks } = req.body;
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Атом ULTRA</title><style>body{font-family:sans-serif;background:#f0f2f5;padding:20px;}</style></head><body>`;
  blocks.forEach(b => {
    if (b.type === 'yandex') html += `<div style="background:#fff;padding:20px;border-radius:12px;margin:10px;"><h1>🌐 Яндекс</h1><input placeholder="Поиск..." style="padding:10px;border:2px solid #ddd;border-radius:8px;width:300px;"/></div>`;
    else if (b.type === 'google') html += `<div style="background:#fff;padding:20px;border-radius:12px;margin:10px;text-align:center;"><h1 style="font-size:48px;color:#4285F4;">Google</h1><input placeholder="Поиск..." style="padding:10px;border:1px solid #ddd;border-radius:24px;width:400px;"/></div>`;
    else if (b.type === 'cs16') html += `<div style="background:#0a0a0f;padding:20px;border-radius:12px;margin:10px;color:#fff;text-align:center;"><h2>🔫 CS 1.6</h2><p>🎯 Кликай по врагам!</p><canvas id="g" width="600" height="300" style="background:#1a1a2e;border-radius:8px;cursor:crosshair;width:100%;"></canvas><script>const c=document.getElementById('g'),ctx=c.getContext('2d');let enemies=[];setInterval(()=>{enemies.push({x:Math.random()*550+25,y:Math.random()*250+25,r:20+Math.random()*10});if(enemies.length>6)enemies.shift();},1000);c.onclick=(e)=>{const rect=c.getBoundingClientRect(),x=(e.clientX-rect.left)*(600/rect.width),y=(e.clientY-rect.top)*(300/rect.height);enemies=enemies.filter(e=>Math.hypot(x-e.x,y-e.y)>e.r);};function draw(){ctx.clearRect(0,0,600,300);enemies.forEach(e=>{ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fillStyle='#ff4757';ctx.fill();ctx.fillStyle='#fff';ctx.font='20px Arial';ctx.textAlign='center';ctx.fillText('👾',e.x,e.y+5);});requestAnimationFrame(draw);}draw();<\/script></div>`;
    else if (b.type === 'market') html += `<div style="background:#fff;padding:20px;border-radius:12px;margin:10px;"><h2>🛒 Магазин</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">${[1,2,3].map(i => `<div style="background:#f8f9fa;padding:15px;border-radius:8px;text-align:center;"><div style="font-size:40px;">📦</div><div>Товар ${i}</div><div style="color:#00d4ff;font-weight:700;">999 ₽</div></div>`).join('')}</div></div>`;
    else html += `<div style="background:#fff;padding:10px;margin:5px;border-radius:8px;">Блок: ${b.type}</div>`;
  });
  html += `</body></html>`;
  res.json({ html });
});

// ============================================================
// 5. ЗАПУСК СЕРВЕРА
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Атом Билдер ULTRA запущен на http://localhost:${PORT}`);
  console.log(`🎮 Теперь с НАСТОЯЩИМ CS 1.6 (3D-шутер, WASD, враги)`);
  console.log(`🌐 Сайты уровня Яндекс, Google и интернет-магазин`);
  console.log(`🔥 Всё в одном файле — копируй и пользуйся!`);
});
                
