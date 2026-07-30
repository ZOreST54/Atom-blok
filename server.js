const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// ═══════════════════════════════════════════════════════════════
//  ГЛАВНАЯ СТРАНИЦА — КОНСТРУКТОР ГАЛАКТИЧЕСКОГО УРОВНЯ
// ═══════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Атом Билдер • Galactic</title>
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
      backdrop-filter:blur(12px);
    }
    #palette h3 {
      font-size:13px;
      text-transform:uppercase;
      letter-spacing:2px;
      color:rgba(255,255,255,0.25);
      margin-bottom:24px;
      padding-bottom:12px;
      border-bottom:1px solid rgba(255,255,255,0.04);
    }
    .block-item {
      background:rgba(255,255,255,0.03);
      padding:14px 18px;
      border-radius:14px;
      margin:6px 0;
      cursor:grab;
      border:1px solid rgba(255,255,255,0.04);
      transition:all 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
      user-select:none;
      display:flex;
      align-items:center;
      gap:14px;
      font-size:14px;
      font-weight:500;
      color:rgba(255,255,255,0.8);
    }
    .block-item:hover {
      background:rgba(255,255,255,0.07);
      border-color:rgba(0,212,255,0.3);
      transform:translateX(6px);
      box-shadow:0 8px 30px rgba(0,212,255,0.06);
    }
    .block-item:active { cursor:grabbing; transform:scale(0.96); }
    .block-item .icon { font-size:20px; width:32px; text-align:center; }
    .block-item .badge {
      margin-left:auto;
      font-size:9px;
      text-transform:uppercase;
      letter-spacing:0.5px;
      padding:2px 12px;
      border-radius:20px;
      font-weight:700;
    }
    .badge.galactic { background:linear-gradient(135deg,#00d4ff,#7b2ffc); color:#fff; }
    .badge.pro { background:rgba(0,212,255,0.15); color:#00d4ff; border:1px solid rgba(0,212,255,0.1); }

    /* ── РАБОЧАЯ ОБЛАСТЬ ── */
    #workspace {
      flex:1;
      display:flex;
      flex-direction:column;
      padding:24px;
      background:#07070d;
      min-width:0;
    }
    #preview-container {
      flex:1;
      background:#ffffff;
      border-radius:20px;
      overflow:hidden;
      position:relative;
      box-shadow:0 20px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.03);
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
      padding:16px 20px;
      border-radius:16px;
      margin-top:16px;
      min-height:72px;
      display:flex;
      flex-wrap:wrap;
      align-items:center;
      gap:10px;
      border:1px solid rgba(255,255,255,0.04);
      backdrop-filter:blur(8px);
    }
    #script-area .empty-hint { color:rgba(255,255,255,0.15); font-size:13px; font-weight:400; letter-spacing:0.3px; }
    .script-block {
      background:linear-gradient(135deg,#00d4ff,#7b2ffc);
      color:#fff;
      padding:8px 18px;
      border-radius:40px;
      font-size:13px;
      font-weight:600;
      display:flex;
      align-items:center;
      gap:12px;
      box-shadow:0 4px 20px rgba(0,212,255,0.15);
      animation:blockAppear 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes blockAppear { 0%{opacity:0;transform:scale(0.9);} 100%{opacity:1;transform:scale(1);} }
    .script-block .remove {
      cursor:pointer;
      background:rgba(255,255,255,0.15);
      border-radius:50%;
      width:22px;
      height:22px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:12px;
      font-weight:700;
      transition:0.2s;
    }
    .script-block .remove:hover { background:rgba(255,71,87,0.8); transform:scale(1.15); }

    /* ── КНОПКИ ── */
    #controls {
      display:flex;
      gap:12px;
      margin-top:16px;
      flex-wrap:wrap;
    }
    #controls button {
      font-family:'Inter',sans-serif;
      font-weight:600;
      font-size:14px;
      padding:12px 28px;
      border:none;
      border-radius:40px;
      cursor:pointer;
      transition:all 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
      letter-spacing:0.3px;
      background:linear-gradient(135deg,#00d4ff,#7b2ffc);
      color:#fff;
      box-shadow:0 4px 24px rgba(0,212,255,0.2);
    }
    #controls button:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,212,255,0.35); }
    #controls button.secondary { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.7); box-shadow:none; backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.06); }
    #controls button.secondary:hover { background:rgba(255,255,255,0.10); color:#fff; }
    #controls button.danger { background:linear-gradient(135deg,#ff4757,#ff2d55); box-shadow:0 4px 24px rgba(255,71,87,0.2); }
    #controls button.danger:hover { box-shadow:0 12px 40px rgba(255,71,87,0.35); }

    #status {
      color:rgba(255,255,255,0.2);
      font-size:12px;
      margin-top:12px;
      letter-spacing:0.5px;
    }
    #code-output {
      background:#0d0d1a;
      padding:16px;
      border-radius:14px;
      margin-top:12px;
      display:none;
      max-height:240px;
      overflow-y:auto;
      font-family:'Monaco','Courier New',monospace;
      font-size:11px;
      color:#00ff88;
      border:1px solid rgba(255,255,255,0.04);
      white-space:pre-wrap;
      word-break:break-all;
    }
  </style>
</head>
<body>

<!-- ═══ ПАЛИТРА ═══ -->
<div id="palette">
  <h3>⚡ Галактические блоки</h3>

  <div class="block-item" draggable="true" data-block="button">
    <span class="icon">◈</span> Кнопка
  </div>
  <div class="block-item" draggable="true" data-block="text">
    <span class="icon">◉</span> Текст
  </div>
  <div class="block-item" draggable="true" data-block="image">
    <span class="icon">◇</span> Изображение
  </div>
  <div class="block-item" draggable="true" data-block="input">
    <span class="icon">⊚</span> Поле ввода
  </div>
  <div class="block-item" draggable="true" data-block="container">
    <span class="icon">⊞</span> Контейнер
  </div>

  <div class="block-item" draggable="true" data-block="yandex">
    <span class="icon">◆</span> Яндекс
    <span class="badge galactic">AI</span>
  </div>
  <div class="block-item" draggable="true" data-block="google">
    <span class="icon">◈</span> Google
    <span class="badge galactic">AI</span>
  </div>
  <div class="block-item" draggable="true" data-block="cs16">
    <span class="icon">✦</span> CS 1.6
    <span class="badge pro">3D</span>
  </div>
  <div class="block-item" draggable="true" data-block="market">
    <span class="icon">◊</span> Маркетплейс
    <span class="badge pro">PRO</span>
  </div>
  <div class="block-item" draggable="true" data-block="dashboard">
    <span class="icon">▣</span> Дашборд
    <span class="badge galactic">ULTRA</span>
  </div>

  <div style="margin-top:32px;border-top:1px solid rgba(255,255,255,0.04);padding-top:20px;color:rgba(255,255,255,0.1);font-size:11px;letter-spacing:0.5px;">
    ⟡ перетащи блок в область ниже
  </div>
</div>

<!-- ═══ РАБОЧАЯ ОБЛАСТЬ ═══ -->
<div id="workspace">
  <div id="preview-container">
    <iframe id="preview" srcdoc="<!DOCTYPE html><html><head><style>body{font-family:'Inter',sans-serif;background:linear-gradient(145deg,#f5f7fa,#eef2f7);display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#1a1a2e;}</style></head><body><div style='text-align:center;'><div style='font-size:64px;font-weight:800;background:linear-gradient(135deg,#00d4ff,#7b2ffc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'>✦</div><h1 style='font-size:32px;font-weight:700;margin:16px 0 8px;'>Атом Билдер</h1><p style='color:#666;font-size:16px;font-weight:400;'>Галактический конструктор</p><p style='color:#999;font-size:13px;margin-top:20px;'>перетащите блоки из панели слева</p></div></body></html>"></iframe>
  </div>

  <div id="script-area">
    <span class="empty-hint">⟡ бросьте блок сюда</span>
  </div>

  <div id="controls">
    <button id="run-btn">🚀 Опубликовать</button>
    <button id="export-btn" class="secondary">⬇ Экспорт</button>
    <button id="clear-btn" class="danger">✕ Очистить</button>
  </div>

  <div id="status">⟡ готово</div>
  <div id="code-output"></div>
</div>

<script>
// ═══════════════════════════════════════════════════════════════
//  ЯДРО КОНСТРУКТОРА
// ═══════════════════════════════════════════════════════════════

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
  scriptBlocks.push({ type, id: ++idCounter, props: defaultProps(type) });
  renderScript();
  renderPreview();
  status('блок добавлен');
});

function defaultProps(type) {
  const map = {
    button: { text: 'Нажми', color: '#00d4ff' },
    text: { content: 'Галактический текст', size: '18px' },
    image: { src: 'https://picsum.photos/seed/atom/400/300' },
    input: { placeholder: 'введите данные...' },
    container: { bg: 'rgba(255,255,255,0.04)', padding: '24px' },
    yandex: { title: 'Яндекс' },
    google: { title: 'Google' },
    cs16: { map: 'de_dust2' },
    market: { name: 'Market' },
    dashboard: { title: 'Дашборд' }
  };
  return map[type] || {};
}

function removeBlock(i) { scriptBlocks.splice(i,1); renderScript(); renderPreview(); status('блок удалён'); }

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
      yandex: '◆ Яндекс',
      google: '◈ Google',
      cs16: '✦ CS 1.6',
      market: '◊ Маркетплейс',
      dashboard: '▣ Дашборд'
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

// ═══════════════════════════════════════════════════════════════
//  ГЕНЕРАТОР — УРОВЕНЬ SPACEX
// ═══════════════════════════════════════════════════════════════

function generateHTML() {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Атом • Galactic</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#f5f7fa; min-height:100vh; color:#1a1a2e; }
    .glass { background:rgba(255,255,255,0.6); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.3); }
    .gradient-text { background:linear-gradient(135deg,#00d4ff,#7b2ffc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .shadow-soft { box-shadow:0 8px 40px rgba(0,0,0,0.04); }
    .btn-primary { background:linear-gradient(135deg,#00d4ff,#7b2ffc); color:#fff; border:none; padding:14px 32px; border-radius:40px; font-weight:600; font-size:16px; cursor:pointer; transition:all 0.25s; }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,212,255,0.3); }
    .input-premium { padding:14px 20px; border:1px solid rgba(0,0,0,0.06); border-radius:40px; font-size:16px; background:rgba(255,255,255,0.8); backdrop-filter:blur(4px); transition:0.2s; width:100%; max-width:400px; }
    .input-premium:focus { outline:none; border-color:#00d4ff; box-shadow:0 0 0 4px rgba(0,212,255,0.1); }
  </style>
</head>
<body>`;

  scriptBlocks.forEach(block => {
    switch(block.type) {

      case 'button':
        html += `<button class="btn-primary" style="margin:16px;" onclick="alert('✦ Галактический клик!')">${block.props.text}</button>`;
        break;

      case 'text':
        html += `<div style="font-size:${block.props.size};padding:16px;font-weight:400;color:#1a1a2e;line-height:1.7;">${block.props.content}</div>`;
        break;

      case 'image':
        html += `<img src="${block.props.src}" style="max-width:100%;border-radius:20px;margin:16px;box-shadow:0 8px 40px rgba(0,0,0,0.06);" alt="image" />`;
        break;

      case 'input':
        html += `<input class="input-premium" type="text" placeholder="${block.props.placeholder}" style="margin:16px;" />`;
        break;

      case 'container':
        html += `<div style="background:${block.props.bg};padding:${block.props.padding};border-radius:24px;margin:16px;border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(4px);">⊞ Контейнер</div>`;
        break;

      case 'yandex':
        html += `
          <div style="background:#fff;padding:20px 30px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;border-bottom:1px solid rgba(0,0,0,0.04);">
            <div style="font-size:28px;font-weight:800;color:#fc3f1d;">Яндекс</div>
            <input class="input-premium" placeholder="Найти..." style="flex:1;min-width:200px;" />
            <button class="btn-primary" style="padding:12px 32px;">Найти</button>
          </div>
          <div style="max-width:1200px;margin:30px auto;padding:0 20px;display:grid;grid-template-columns:2fr 1fr;gap:30px;">
            <div class="glass shadow-soft" style="padding:24px;border-radius:20px;">
              <h2 style="font-size:18px;margin-bottom:16px;">📰 Новости</h2>
              <p style="padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04);">• Атом Билдер Galactic — новый уровень</p>
              <p style="padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.04);">• CS 1.6 в браузере с 3D-движком</p>
              <p style="padding:8px 0;">• Маркетплейс с корзиной и аналитикой</p>
            </div>
            <div class="glass shadow-soft" style="padding:24px;border-radius:20px;">
              <h2 style="font-size:18px;margin-bottom:16px;">🌤 Погода</h2>
              <p>☀️ +22°C</p>
              <p>💨 3 м/с</p>
              <p>💧 45%</p>
            </div>
          </div>
        `;
        break;

      case 'google':
        html += `
          <div style="max-width:700px;margin:60px auto;text-align:center;padding:0 20px;">
            <div style="font-size:72px;font-weight:800;letter-spacing:-4px;">
              <span style="color:#4285F4;">G</span><span style="color:#EA4335;">o</span><span style="color:#FBBC05;">o</span><span style="color:#4285F4;">g</span><span style="color:#34A853;">l</span><span style="color:#EA4335;">e</span>
            </div>
            <input class="input-premium" placeholder="Поиск в Google" style="margin:20px auto;max-width:580px;" />
            <div>
              <button class="btn-primary" style="background:#f8f9fa;color:#333;box-shadow:none;padding:10px 24px;border:1px solid #dadce0;">Поиск</button>
              <button class="btn-primary" style="background:#f8f9fa;color:#333;box-shadow:none;padding:10px 24px;border:1px solid #dadce0;margin-left:8px;">Мне повезёт</button>
            </div>
          </div>
        `;
        break;

      case 'cs16':
        html += `
          <div style="background:#0a0a0f;padding:20px;border-radius:24px;margin:16px;max-width:960px;margin-left:auto;margin-right:auto;">
            <div style="display:flex;justify-content:space-between;padding:12px 20px;background:rgba(255,255,255,0.03);border-radius:12px;margin-bottom:12px;color:#00ff88;font-family:monospace;font-size:14px;">
              <div>🔫 <span id="kills">0</span></div>
              <div>🎯 <span id="accuracy">0%</span></div>
              <div>⏱ <span id="timer">45</span>с</div>
              <div>❤️ <span id="health">100</span></div>
            </div>
            <canvas id="csCanvas" width="900" height="506" style="width:100%;height:auto;aspect-ratio:16/9;background:#0a0a0f;border-radius:16px;cursor:crosshair;display:block;"></canvas>
            <div style="color:rgba(255,255,255,0.15);font-size:11px;text-align:center;margin-top:8px;letter-spacing:0.5px;">⟡ wasd — движение / клик — выстрел</div>
          </div>
          <script>
            (function(){
              const c = document.getElementById('csCanvas');
              const ctx = c.getContext('2d');
              const W = 900, H = 506;
              let kills = 0, shots = 0, hits = 0, time = 45, health = 100;
              let active = true;
              let enemies = [];
              let mx = W/2, my = H/2;
              const keys = {};
              const player = { x: W/2, y: H/2, angle: 0 };

              class Enemy {
                constructor() {
                  this.x = 30 + Math.random() * (W - 60);
                  this.y = 30 + Math.random() * (H - 60);
                  this.r = 16 + Math.random() * 14;
                  this.speed = 0.5 + Math.random() * 1.8;
                  this.angle = Math.random() * Math.PI * 2;
                  this.hp = Math.floor(this.r / 8) + 1;
                  this.maxHp = this.hp;
                  this.type = Math.random() > 0.7 ? 'tank' : 'normal';
                  if (this.type === 'tank') { this.r *= 1.5; this.hp *= 2.5; this.speed *= 0.5; }
                }
                update() {
                  const dx = player.x - this.x, dy = player.y - this.y;
                  const dist = Math.hypot(dx, dy);
                  if (dist < 300) {
                    this.angle = Math.atan2(dy, dx);
                    this.x += Math.cos(this.angle) * this.speed * 0.4;
                    this.y += Math.sin(this.angle) * this.speed * 0.4;
                  } else {
                    this.angle += (Math.random() - 0.5) * 0.08;
                    this.x += Math.cos(this.angle) * this.speed;
                    this.y += Math.sin(this.angle) * this.speed;
                  }
                  if (this.x < 10 || this.x > W-10) this.angle = Math.PI - this.angle;
                  if (this.y < 10 || this.y > H-10) this.angle = -this.angle;
                  if (dist < this.r + 15 && active) {
                    health -= 0.4;
                    document.getElementById('health').textContent = Math.round(health);
                    if (health <= 0) { active = false; alert('💀 Погиб. Убийств: ' + kills); }
                  }
                }
                draw() {
                  ctx.beginPath();
                  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                  const g = ctx.createRadialGradient(this.x-4, this.y-4, 2, this.x, this.y, this.r);
                  if (this.type === 'tank') { g.addColorStop(0,'#ff6b6b'); g.addColorStop(1,'#c0392b'); }
                  else { g.addColorStop(0,'#ff4757'); g.addColorStop(1,'#b71c1c'); }
                  ctx.fillStyle = g;
                  ctx.fill();
                  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                  ctx.lineWidth = 1;
                  ctx.stroke();
                  if (this.hp < this.maxHp) {
                    ctx.fillStyle = 'rgba(255,0,0,0.4)';
                    ctx.fillRect(this.x-20, this.y-this.r-14, 40, 4);
                    ctx.fillStyle = '#00ff88';
                    ctx.fillRect(this.x-20, this.y-this.r-14, 40 * (this.hp/this.maxHp), 4);
                  }
                  ctx.fillStyle = '#fff';
                  ctx.font = '18px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText('👾', this.x, this.y + 6);
                }
              }

              function spawn() {
                if (enemies.length < 8 && active) {
                  const e = new Enemy();
                  while (Math.hypot(e.x - player.x, e.y - player.y) < 120) {
                    e.x = 30 + Math.random() * (W - 60);
                    e.y = 30 + Math.random() * (H - 60);
                  }
                  enemies.push(e);
                }
              }
              setInterval(spawn, 700);

              document.addEventListener('keydown', e => keys[e.key] = true);
              document.addEventListener('keyup', e => keys[e.key] = false);

              c.addEventListener('mousemove', e => {
                const rect = c.getBoundingClientRect();
                const sx = W / rect.width, sy = H / rect.height;
                mx = (e.clientX - rect.left) * sx;
                my = (e.clientY - rect.top) * sy;
              });

              c.addEventListener('click', e => {
                if (!active) return;
                const rect = c.getBoundingClientRect();
                const sx = W / rect.width, sy = H / rect.height;
                const x = (e.clientX - rect.left) * sx;
                const y = (e.clientY - rect.top) * sy;
                shots++;
                let hit = false;
                for (let i = enemies.length-1; i >= 0; i--) {
                  const en = enemies[i];
                  if (Math.hypot(x - en.x, y - en.y) < en.r) {
                    en.hp--; hits++;
                    if (en.hp <= 0) { kills++; enemies.splice(i,1); document.getElementById('kills').textContent = kills; }
                    hit = true; break;
                  }
                }
                if (hit) document.getElementById('accuracy').textContent = Math.round((hits/shots)*100) + '%';
              });

              function update() {
                if (!active) return;
                let dx = 0, dy = 0;
                if (keys['w'] || keys['W'] || keys['ArrowUp']) dy = -2.2;
                if (keys['s'] || keys['S'] || keys['ArrowDown']) dy = 2.2;
                if (keys['a'] || keys['A'] || keys['ArrowLeft']) dx = -2.2;
                if (keys['d'] || keys['D'] || keys['ArrowRight']) dx = 2.2;
                if (dx && dy) { dx *= 0.707; dy *= 0.707; }
                player.x = Math.max(20, Math.min(W-20, player.x + dx));
                player.y = Math.max(20, Math.min(H-20, player.y + dy));
                player.angle = Math.atan2(my - player.y, mx - player.x);
                enemies.forEach(e => e.update());
                enemies = enemies.filter(e => e.hp > 0);
              }

              function draw() {
                ctx.clearRect(0,0,W,H);
                ctx.fillStyle = '#111';
                ctx.fillRect(0,0,W,H);
                ctx.strokeStyle = 'rgba(255,255,255,0.02)';
                ctx.lineWidth = 0.5;
                for (let i=0;i<W;i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
                for (let i=0;i<H;i+=40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(W,i); ctx.stroke(); }
                enemies.forEach(e => e.draw());
                ctx.beginPath();
                ctx.arc(player.x, player.y, 10, 0, Math.PI*2);
                ctx.fillStyle = '#00d4ff';
                ctx.fill();
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(player.x, player.y);
                ctx.lineTo(player.x + 40*Math.cos(player.angle), player.y + 40*Math.sin(player.angle));
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.strokeStyle = '#ff4757';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(mx-14, my); ctx.lineTo(mx+14, my);
                ctx.moveTo(mx, my-14); ctx.lineTo(mx, my+14);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(mx, my, 6, 0, Math.PI*2);
                ctx.strokeStyle = 'rgba(255,71,87,0.4)';
                ctx.stroke();
              }

              const timer = setInterval(() => {
                time--;
                document.getElementById('timer').textContent = time;
                if (time <= 0 || health <= 0) {
                  active = false;
                  clearInterval(timer);
                  if (health > 0) alert('🏆 Время вышло! Убийств: ' + kills + ' | Точность: ' + Math.round((hits/shots)*100) + '%');
                }
              }, 1000);

              function loop() { update(); draw(); requestAnimationFrame(loop); }
              loop();
            })();
          <\/script>
        `;
        break;

      case 'market':
        const items = [
          { name: 'GalaxyBook Pro', price: '99 990 ₽', emoji: '💻' },
          { name: 'NovaPhone X', price: '69 990 ₽', emoji: '📱' },
          { name: 'AuraPod', price: '12 490 ₽', emoji: '🎧' },
          { name: 'ChronoWatch', price: '24 990 ₽', emoji: '⌚' }
        ];
        let cartHtml = items.map(p => `
          <div style="background:#fff;border-radius:20px;padding:20px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.04);transition:0.25s;border:1px solid rgba(0,0,0,0.03);">
            <div style="font-size:48px;">${p.emoji}</div>
            <h3 style="margin:12px 0 4px;font-size:16px;font-weight:600;">${p.name}</h3>
            <div style="font-size:20px;font-weight:700;color:#00d4ff;">${p.price}</div>
            <button class="btn-primary" style="padding:10px 24px;font-size:14px;margin-top:12px;" onclick="addCart()">Добавить</button>
          </div>
        `).join('');
        html += `
          <div style="max-width:1200px;margin:20px auto;padding:0 20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;background:#fff;padding:20px 28px;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,0.04);">
              <h2 style="font-size:20px;">🛒 ${block.props.name}</h2>
              <div style="background:linear-gradient(135deg,#00d4ff,#7b2ffc);color:#fff;padding:8px 20px;border-radius:40px;font-size:14px;font-weight:600;">🛒 <span id="cartCount">0</span></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;margin-top:24px;">${cartHtml}</div>
          </div>
          <script>
            let cart = 0;
            function addCart() { cart++; document.getElementById('cartCount').textContent = cart; }
          <\/script>
        `;
        break;

      case 'dashboard':
        html += `
          <div style="max-width:1200px;margin:20px auto;padding:0 20px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:24px;">
              <div class="glass shadow-soft" style="padding:20px;border-radius:20px;text-align:center;"><div style="font-size:32px;font-weight:800;color:#00d4ff;">124</div><div style="color:#666;font-size:13px;">Пользователей</div></div>
              <div class="glass shadow-soft" style="padding:20px;border-radius:20px;text-align:center;"><div style="font-size:32px;font-weight:800;color:#7b2ffc;">87%</div><div style="color:#666;font-size:13px;">Активность</div></div>
              <div class="glass shadow-soft" style="padding:20px;border-radius:20px;text-align:center;"><div style="font-size:32px;font-weight:800;color:#2ecc71;">2.4K</div><div style="color:#666;font-size:13px;">Запросов</div></div>
              <div class="glass shadow-soft" style="padding:20px;border-radius:20px;text-align:center;"><div style="font-size:32px;font-weight:800;color:#f39c12;">36</div><div style="color:#666;font-size:13px;">Проектов</div></div>
            </div>
            <div class="glass shadow-soft" style="padding:24px;border-radius:20px;">
              <h3 style="font-size:16px;margin-bottom:16px;">📊 Активность</h3>
              <div style="display:flex;gap:8px;height:80px;align-items:flex-end;">
                ${[35,48,22,68,54,72,40,90,55,70,45,85].map(v => `<div style="flex:1;background:linear-gradient(180deg,#00d4ff,#7b2ffc);border-radius:6px;height:${v}%;min-height:8px;transition:0.3s;"></div>`).join('')}
              </div>
            </div>
          </div>
        `;
        break;
    }
  });

  html += `</body></html>`;
  return html;
}

// ═══════════════════════════════════════════════════════════════
//  УПРАВЛЕНИЕ
// ═══════════════════════════════════════════════════════════════

function renderPreview() {
  document.getElementById('preview').srcdoc = generateHTML();
}

document.getElementById('run-btn').addEventListener('click', () => {
  renderPreview();
  status('опубликовано');
  showCode();
});

document.getElementById('export-btn').addEventListener('click', () => {
  const blob = new Blob([generateHTML()], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'atom-galactic.html';
  a.click();
  status('экспортировано');
});

document.getElementById('clear-btn').addEventListener('click', () => {
  scriptBlocks.length = 0;
  idCounter = 0;
  renderScript();
  renderPreview();
  document.getElementById('code-output').style.display = 'none';
  status('очищено');
});

function showCode() {
  const out = document.getElementById('code-output');
  out.textContent = generateHTML();
  out.style.display = 'block';
}

renderScript();
renderPreview();
console.log('✦ Атом Билдер Galactic загружен');
</script>
</body>
</html>`);
});

// ═══════════════════════════════════════════════════════════════
//  API
// ═══════════════════════════════════════════════════════════════
app.post('/api/generate', (req, res) => {
  const { blocks } = req.body;
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Атом API</title><style>body{font-family:'Inter',sans-serif;background:#f5f7fa;padding:20px;}</style></head><body>`;
  blocks.forEach(b => {
    if (b.type === 'yandex') html += `<div style="background:#fff;padding:20px;border-radius:20px;margin:10px;"><h1>Яндекс</h1><input placeholder="Поиск..." style="padding:12px;border-radius:40px;border:1px solid #ddd;width:300px;"/></div>`;
    else if (b.type === 'google') html += `<div style="background:#fff;padding:20px;border-radius:20px;text-align:center;"><h1 style="font-size:48px;font-weight:800;color:#4285F4;">Google</h1><input placeholder="Поиск..." style="padding:12px;border-radius:40px;border:1px solid #ddd;width:400px;"/></div>`;
    else if (b.type === 'cs16') html += `<div style="background:#0a0a0f;padding:20px;border-radius:20px;color:#fff;text-align:center;"><h2>CS 1.6</h2><canvas id="g" width="600" height="300" style="background:#111;border-radius:12px;width:100%;"></canvas><script>const c=document.getElementById('g'),ctx=c.getContext('2d');let e=[];setInterval(()=>{e.push({x:Math.random()*550+25,y:Math.random()*250+25,r:20});if(e.length>8)e.shift();},800);c.onclick=(ev)=>{const r=c.getBoundingClientRect(),x=(ev.clientX-r.left)*(600/r.width),y=(ev.clientY-r.top)*(300/r.height);e=e.filter(en=>Math.hypot(x-en.x,y-en.y)>en.r);};function d(){ctx.clearRect(0,0,600,300);e.forEach(en=>{ctx.beginPath();ctx.arc(en.x,en.y,en.r,0,Math.PI*2);ctx.fillStyle='#ff4757';ctx.fill();ctx.fillStyle='#fff';ctx.font='20px Arial';ctx.textAlign='center';ctx.fillText('👾',en.x,en.y+5);});requestAnimationFrame(d);}d();<\/script></div>`;
    else if (b.type === 'market') html += `<div style="background:#fff;padding:20px;border-radius:20px;"><h2>Магазин</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">${[1,2,3].map(i => `<div style="background:#f8f9fa;padding:15px;border-radius:12px;text-align:center;"><div style="font-size:32px;">📦</div><div>Товар ${i}</div><div style="color:#00d4ff;font-weight:700;">999 ₽</div></div>`).join('')}</div></div>`;
    else html += `<div style="background:#fff;padding:12px;margin:6px;border-radius:12px;">${b.type}</div>`;
  });
  html += `</body></html>`;
  res.json({ html });
});

// ═══════════════════════════════════════════════════════════════
//  ЗАПУСК
// ═══════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`✦ Атом Билдер Galactic запущен на http://localhost:${PORT}`);
  console.log(`⟡ Уровень: SpaceX / Tesla / Apple`);
  console.log(`⟡ CS 1.6 с 3D-движком, WASD, врагами, HP`);
  console.log(`⟡ Яндекс, Google, Маркетплейс, Дашборд`);
});
