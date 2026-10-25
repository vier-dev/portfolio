/* Pixel hero character: eyes follow the cursor, blinks, click for a hello.
   Needs: <div class="pixel-hero" id="pixelHero"></div> and pixel-hero.css */
(function(){
  const host = document.getElementById('pixelHero');
  if (!host) return;

  // ---- edit these to restyle the character -------------------------
  const COLORS = {
    H:'#0f131b', K:'#2b3140',            // hair, hair highlight
    S:'#e8b58f', D:'#cf9a74',            // skin, nose shade
    W:'#ffffff',                          // eye whites
    B:'#2a2f3a', L:'#3a4150',            // blazer, lapel
    C:'#aac4e8', T:'#d6242b',            // shirt, tie
    M:'#b4524f', P:'#12161f'             // mouth, pupils
  };
  const MESSAGES = ["Hi, I'm Oliver!", "Need a system built?", "Let's talk below ↓"];
  // ------------------------------------------------------------------

  const MAP = [
    ".....HHHHHHHHHH.....",
    "....HHHKKHHHHHHH....",
    "....HHHHHHHHHHHH....",
    "....HHHHHHHSSSHH....",
    "....HSSSSSSSSSSH....",
    "....SHHSSSSSSHHS....",
    "....SWWWSSSSWWWS....",
    "....SWWWSSSSWWWS....",
    "....SSSSSSSSSSSS....",
    "....SSSSSDDSSSSS....",
    "....SSSSSSSSSSSS....",
    "....SSSSSSSSSSSS....",
    ".....SSSSSSSSSS.....",
    "......SSSSSSSS......",
    ".......SSSSSS.......",
    "..BBBBBBCCCCBBBBBB..",
    ".BBBBBBBCTTCBBBBBBB.",
    "BBBBBBBBLTTLBBBBBBBB",
    "BBBBBBBBLTTLBBBBBBBB",
    "BBBBBBBBBTTBBBBBBBBB"
  ];

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');

  function rect(parent, x, y, w, h, fill){
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', w); r.setAttribute('height', h);
    r.setAttribute('fill', fill);
    parent.appendChild(r);
    return r;
  }
  function group(cls){
    const g = document.createElementNS(NS, 'g');
    if (cls) g.setAttribute('class', cls);
    svg.appendChild(g);
    return g;
  }

  // body (runs of same colour are merged into one rect)
  const body = group('px-body');
  MAP.forEach((row, y) => {
    let x = 0;
    while (x < row.length){
      const ch = row[x]; let n = 1;
      while (x + n < row.length && row[x + n] === ch) n++;
      if (ch !== '.') rect(body, x, y, n, 1, COLORS[ch]);
      x += n;
    }
  });

  // pupils
  const EYES = [5, 12];
  const pupils = EYES.map(ex => rect(body, ex + 1, 7, 1, 1, COLORS.P));
  function setPupils(ox, oy){
    pupils.forEach((p, i) => {
      p.setAttribute('x', EYES[i] + ox);
      p.setAttribute('y', 6 + oy);
    });
  }
  setPupils(1, 1);

  // eyelids (blink)
  const lids = group('px-lids');
  lids.style.display = 'none';
  EYES.forEach(ex => { rect(lids, ex, 6, 3, 2, COLORS.S); rect(lids, ex, 7, 3, 1, COLORS.H); });

  // mouth
  const mouth = group('px-mouth');
  function setMouth(smile){
    mouth.innerHTML = '';
    if (smile){
      rect(mouth, 8, 11, 4, 1, COLORS.M);
      rect(mouth, 7, 10, 1, 1, COLORS.M);
      rect(mouth, 12, 10, 1, 1, COLORS.M);
    } else {
      rect(mouth, 9, 11, 2, 1, COLORS.M);
    }
  }
  setMouth(false);

  host.appendChild(svg);

  // sparkles
  [[14,16],[86,24],[78,62]].forEach(([x, y], i) => {
    const s = document.createElement('span');
    s.className = 'px-spark';
    s.style.left = x + '%'; s.style.top = y + '%';
    s.style.animationDelay = (i * 0.7) + 's';
    host.appendChild(s);
  });

  // hint + bubble
  const hint = document.createElement('span');
  hint.className = 'px-hint';
  hint.textContent = 'click me';
  host.appendChild(hint);

  const bubble = document.createElement('div');
  bubble.className = 'px-bubble';
  host.appendChild(bubble);

  host.setAttribute('role', 'button');
  host.setAttribute('tabindex', '0');
  host.setAttribute('aria-label', 'Pixel portrait of Oliver. Activate for a greeting.');

  // eyes follow the cursor
  document.addEventListener('pointermove', e => {
    const r = svg.getBoundingClientRect();
    const cx = r.left + r.width * 0.5;
    const cy = r.top + r.height * 0.3;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    setPupils(dx < -70 ? 0 : dx > 70 ? 2 : 1, dy < -50 ? 0 : 1);
  }, { passive: true });

  // blink every few seconds
  (function blink(){
    setTimeout(() => {
      lids.style.display = '';
      setTimeout(() => { lids.style.display = 'none'; blink(); }, 140);
    }, 2500 + Math.random() * 2500);
  })();

  // click / Enter: hop, smile, cycle a message
  let msg = 0, hideTimer, smileTimer;
  function hello(){
    host.classList.remove('is-hopping');
    void host.offsetWidth;                      // restart the animation
    host.classList.add('is-hopping');
    host.classList.add('has-clicked');
    bubble.textContent = MESSAGES[msg++ % MESSAGES.length];
    bubble.classList.add('is-on');
    setMouth(true);
    clearTimeout(hideTimer); clearTimeout(smileTimer);
    hideTimer = setTimeout(() => bubble.classList.remove('is-on'), 2600);
    smileTimer = setTimeout(() => setMouth(false), 1400);
  }
  host.addEventListener('click', hello);
  host.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); hello(); }
  });
})();
