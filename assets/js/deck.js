/* Presentación · El miedo y la conducta
   Navegación, transiciones, barra inferior, pantalla completa y vista general. */
(function () {
  'use strict';

  const slides = [...document.querySelectorAll('.stage .slide')];
  const stage = document.getElementById('stage');
  const dots = document.getElementById('dots');
  const count = document.getElementById('count');
  const prog = document.getElementById('progress');
  const pad = n => String(n).padStart(2, '0');
  let cur = -1;

  /* ---------- Escala 16:9 ---------- */
  function fit() {
    const s = Math.min(innerWidth / 1600, innerHeight / 900);
    stage.style.setProperty('--s', s);
    document.documentElement.style.setProperty('--s', s);
  }
  addEventListener('resize', fit);
  fit();

  /* ---------- Puntos de navegación ---------- */
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Diapositiva ' + (i + 1));
    b.onclick = e => { e.stopPropagation(); go(i); };
    dots.appendChild(b);
  });

  /* ---------- Animaciones SVG (SMIL): solo corren en la diapositiva visible ---------- */
  function smil(slide, on) {
    slide.querySelectorAll('svg').forEach(svg => {
      try { on ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) {}
    });
  }

  /* ---------- Contadores animados ---------- */
  function counters(slide) {
    slide.querySelectorAll('[data-count]').forEach(el => {
      const fin = +el.dataset.count, dur = 1800, wait = 900, t0 = performance.now();
      el.textContent = '0';
      (function step() {
        const k = Math.min(1, (performance.now() - t0 - wait) / dur);
        if (k >= 0) el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US');
        if (k < 1) requestAnimationFrame(step);
      })();
    });
  }

  /* ---------- Ir a una diapositiva ---------- */
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === cur) return;
    document.body.classList.toggle('back', i < cur);

    if (cur >= 0) {
      const old = slides[cur];
      old.classList.remove('active');
      old.classList.add('leaving');
      setTimeout(() => { old.classList.remove('leaving'); smil(old, false); }, 950);
    }
    const s = slides[i];
    s.classList.remove('leaving', 'active');
    void s.offsetWidth;                      // reinicia las animaciones de entrada
    s.classList.add('active');
    smil(s, true);
    counters(s);

    document.body.dataset.tone = s.dataset.tone || 'dark';
    cur = i;
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
    count.textContent = pad(i + 1) + ' / ' + pad(slides.length);
    prog.style.width = ((i + 1) / slides.length * 100) + '%';
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {}
  }
  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  /* ---------- Pantalla completa ---------- */
  const fsTxt = document.getElementById('fsTxt');
  const fsIco = document.getElementById('fsIco');
  const isFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  function toggleFs() {
    const d = document, el = d.documentElement;
    if (!isFs()) (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    else (d.exitFullscreen || d.webkitExitFullscreen)?.call(d);
  }
  function fsLabel() {
    const on = isFs();
    fsTxt.textContent = on ? 'Salir' : 'Pantalla completa';
    fsIco.innerHTML = on
      ? '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'
      : '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>';
  }
  document.getElementById('fs').onclick = e => { e.stopPropagation(); toggleFs(); };
  document.addEventListener('fullscreenchange', fsLabel);
  document.addEventListener('webkitfullscreenchange', fsLabel);

  /* ---------- Vista general (miniaturas) ---------- */
  const ov = document.getElementById('overview');
  const grid = document.getElementById('ovGrid');
  let built = false;
  function buildOverview() {
    slides.forEach((sl, i) => {
      const t = document.createElement('button');
      t.className = 'thumb';
      t.dataset.tone = sl.dataset.tone || 'dark';
      t.style.setProperty('--i', i);
      t.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
      const inner = document.createElement('div');
      inner.className = 'inner';
      const c = sl.cloneNode(true);
      c.classList.add('active', 'static');
      c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
      c.querySelectorAll('animateMotion,animate,animateTransform').forEach(n => n.remove());
      c.querySelectorAll('[data-count]').forEach(n => { n.textContent = (+n.dataset.count).toLocaleString('en-US'); });
      inner.appendChild(c);
      t.appendChild(inner);
      const n = document.createElement('span');
      n.className = 'n'; n.textContent = pad(i + 1);
      t.appendChild(n);
      t.onclick = e => { e.stopPropagation(); closeOverview(); go(i); };
      grid.appendChild(t);
    });
    built = true;
  }
  function scaleThumbs() {
    grid.querySelectorAll('.thumb').forEach(t => {
      t.querySelector('.inner').style.transform = 'scale(' + (t.clientWidth / 1600) + ')';
    });
  }
  function openOverview() {
    if (!built) buildOverview();
    document.body.classList.add('ov');
    ov.setAttribute('aria-hidden', 'false');
    [...grid.children].forEach((t, k) => t.classList.toggle('cur', k === cur));
    requestAnimationFrame(scaleThumbs);
    grid.children[cur]?.scrollIntoView({ block: 'center' });
  }
  function closeOverview() {
    document.body.classList.remove('ov');
    ov.setAttribute('aria-hidden', 'true');
  }
  const ovOpen = () => document.body.classList.contains('ov');
  addEventListener('resize', () => { if (ovOpen()) scaleThumbs(); });
  document.getElementById('ovBtn').onclick = e => { e.stopPropagation(); ovOpen() ? closeOverview() : openOverview(); };
  ov.addEventListener('click', e => { if (e.target === ov) closeOverview(); });

  /* ---------- Teclado ---------- */
  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (ovOpen()) {
      if (k === 'Escape' || k === 'o' || k === 'O') { e.preventDefault(); closeOverview(); }
      return;
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'f' || k === 'F') toggleFs();
    else if (k === 'o' || k === 'O' || k === 'Escape') { if (k !== 'Escape' || !isFs()) openOverview(); }
    else if (/^[1-9]$/.test(k)) go(+k - 1);
  });

  /* ---------- Clic y deslizar ---------- */
  addEventListener('click', e => {
    if (ovOpen() || e.target.closest('.ui')) return;
    (e.clientX > innerWidth / 3) ? next() : prev();
  });
  let tx = null, ty = null;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', e => {
    if (tx === null || ovOpen()) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
    tx = ty = null;
  });

  /* ---------- Barra inferior: aparece al bajar el mouse ---------- */
  const ui = document.querySelector('.ui');
  const ZONA = 140;
  let hideT = null, idleT = null;
  const showUi = () => { ui.classList.add('show'); clearTimeout(hideT); };
  const hideUi = () => ui.classList.remove('show');
  addEventListener('mousemove', e => {
    document.body.classList.remove('idle');
    clearTimeout(idleT);
    if (e.clientY > innerHeight - ZONA) showUi();
    else {
      clearTimeout(hideT);
      hideT = setTimeout(hideUi, 250);
      idleT = setTimeout(() => { if (!ovOpen()) document.body.classList.add('idle'); }, 2500);
    }
  });
  document.addEventListener('mouseleave', hideUi);
  addEventListener('touchstart', () => { showUi(); clearTimeout(hideT); hideT = setTimeout(hideUi, 3000); }, { passive: true });

  /* ---------- Inicio ---------- */
  slides.forEach(sl => smil(sl, false));
  const h = parseInt(location.hash.slice(1), 10);
  const start = () => go(isNaN(h) ? 0 : h - 1);
  // Espera a las fuentes para que la primera animación no salte
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);
})();
