/* Shikhar & Mrinali — site interactions */
(function () {
  'use strict';

  const CONFIG = {
    // Google Apps Script web-app URL that stores RSVPs & guestbook wishes in a Google Sheet (see README.md).
    // Leave empty and RSVPs fall back to "send via WhatsApp"; wishes are kept in the visitor's browser only.
    endpoint: '',
    // Optional family WhatsApp number in international format, digits only, e.g. '919876543210'.
    whatsapp: ''
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ } }
  };

  document.documentElement.classList.remove('no-js');

  /* ---------- toast ---------- */
  const toastEl = $('.toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-shown'), 2600);
  }

  /* ---------- nav ---------- */
  const nav = $('.nav');
  const toggle = $('.nav__toggle');
  const menu = $('#nav-menu');
  const toTop = $('.to-top');
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    toTop.classList.toggle('is-shown', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  if ('IntersectionObserver' in window) {
    const links = new Map($$('.nav__menu a:not(.btn)').map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-current'));
        const a = links.get(en.target.id);
        if (a) a.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => spy.observe(s));
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = $$('.reveal');
  reveals.forEach((el) => {
    const sibs = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if (sibs.length > 2 && i > 0) el.style.transitionDelay = Math.min(i * 90, 450) + 'ms';
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- floating hearts ---------- */
  const heartsLayer = $('.hearts-layer');
  const HEART_COLORS = ['#F2B5C4', '#E8A0B4', '#C9B6EA', '#F8C8B0', '#E6C97E', '#F7D1DC'];
  function spawnHeart() {
    if (document.hidden || heartsLayer.childElementCount > 14) return;
    const h = document.createElement('span');
    h.className = 'fh';
    const size = 10 + Math.random() * 20;
    h.style.cssText = `left:${Math.random() * 100}%;--s:${size}px;--c:${HEART_COLORS[(Math.random() * HEART_COLORS.length) | 0]};--d:${9 + Math.random() * 8}s;--o:${0.35 + Math.random() * 0.4}`;
    h.innerHTML = '<svg><use href="#i-heart"/></svg>';
    h.addEventListener('animationend', (e) => { if (e.target === h) h.remove(); });
    heartsLayer.appendChild(h);
  }
  if (!reduceMotion) setInterval(spawnHeart, 1300);

  /* ---------- sparkle cursor trail (desktop) ---------- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let last = 0;
    window.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - last < 70) return;
      last = now;
      const s = document.createElement('span');
      s.className = 'sparkle-trail';
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      s.innerHTML = '<svg width="12" height="12"><use href="#i-sparkle"/></svg>';
      s.addEventListener('animationend', () => s.remove());
      document.body.appendChild(s);
    }, { passive: true });
  }

  /* ---------- confetti / particle engine ---------- */
  const confetti = (() => {
    const cv = $('.confetti');
    const ctx = cv.getContext('2d');
    let parts = [], running = false, dpr = 1;
    const COLORS = ['#F2B5C4', '#C24D6E', '#C9B6EA', '#FFDCC8', '#E6C97E', '#FFFFFF', '#D86B8C'];
    function size() { dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    function heartPath(c, s) {
      c.beginPath(); c.moveTo(0, s * 0.3);
      c.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
      c.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s);
      c.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
      c.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3); c.fill();
    }
    function frame() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
      parts.forEach((p) => {
        p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life / 40);
        ctx.translate(p.x * dpr, p.y * dpr); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.shape === 'heart') heartPath(ctx, p.s * dpr);
        else if (p.shape === 'flake') { ctx.fillRect(-p.s * dpr / 2, -p.s * dpr / 4, p.s * dpr, p.s * dpr / 2); }
        else { ctx.scale(1, Math.cos(p.rot * 3)); ctx.fillRect(-p.s * dpr / 2, -p.s * dpr / 2, p.s * dpr, p.s * dpr * 0.6); }
        ctx.restore();
      });
      if (parts.length) requestAnimationFrame(frame); else { running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
    }
    function start() { if (!running) { running = true; size(); requestAnimationFrame(frame); } }
    window.addEventListener('resize', () => running && size());
    return {
      burst(x, y, n = 120) {
        if (reduceMotion) return;
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
          parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, g: 0.22, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
            s: 6 + Math.random() * 9, c: COLORS[(Math.random() * COLORS.length) | 0], shape: Math.random() < 0.35 ? 'heart' : 'rect', life: 140 + Math.random() * 60 });
        }
        start();
      },
      flakes(x, y, n = 3) {
        if (reduceMotion) return;
        for (let i = 0; i < n; i++) {
          parts.push({ x: x + (Math.random() - 0.5) * 20, y, vx: (Math.random() - 0.5) * 2, vy: Math.random() * 1.5, g: 0.25, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
            s: 2 + Math.random() * 4, c: ['#C9973B', '#E6C97E', '#F3DC8C', '#B8862F'][(Math.random() * 4) | 0], shape: 'flake', life: 60 });
        }
        start();
      }
    };
  })();

  /* ---------- countdown ---------- */
  const cd = $('.countdown');
  if (cd) {
    const target = new Date(cd.dataset.target).getTime();
    const cells = Object.fromEntries($$('[data-unit]', cd).map((el) => [el.dataset.unit, el]));
    const pad = (v) => String(v).padStart(2, '0');
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        cd.hidden = true;
        $('.countdown__done').hidden = false;
        clearInterval(timer);
        return;
      }
      const vals = {
        days: Math.floor(diff / 864e5),
        hours: Math.floor(diff / 36e5) % 24,
        minutes: Math.floor(diff / 6e4) % 60,
        seconds: Math.floor(diff / 1e3) % 60
      };
      Object.entries(vals).forEach(([k, v]) => {
        const txt = k === 'days' ? String(v) : pad(v);
        if (cells[k].textContent !== txt) {
          cells[k].textContent = txt;
          cells[k].classList.remove('tick'); void cells[k].offsetWidth; cells[k].classList.add('tick');
        }
      });
    }
    const timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------- add to calendar (.ics) ---------- */
  const ICS_EVENTS = [
    ['Shri Ganesh Pujan', '2026-12-09T09:00', 2, 'Shadiwala Ghar, 127-B Shriyantra Nagar, Khandwa Road, Indore'],
    ['Mehendi', '2026-12-10T11:30', 2.5, 'Shadiwala Ghar, 127-B Shriyantra Nagar, Khandwa Road, Indore'],
    ['Haldi', '2026-12-10T14:00', 2.5, 'Shadiwala Ghar, 127-B Shriyantra Nagar, Khandwa Road, Indore'],
    ['Ring Ceremony', '2026-12-11T11:30', 2, 'Hotel Sayaji, H/1 Scheme No. 54, Vijay Nagar, Indore'],
    ['Shaam-e-Sangeet', '2026-12-11T19:00', 4, 'Hotel Sayaji, H/1 Scheme No. 54, Vijay Nagar, Indore'],
    ['Baraat', '2026-12-12T10:00', 2, 'Hotel Sayaji, H/1 Scheme No. 54, Vijay Nagar, Indore'],
    ['Jaimala & Mangal Pheras', '2026-12-12T12:15', 3, 'Hotel Sayaji, H/1 Scheme No. 54, Vijay Nagar, Indore'],
    ['Reception & Dinner', '2026-12-12T20:00', 3.5, 'Hotel Sayaji, H/1 Scheme No. 54, Vijay Nagar, Indore']
  ];
  const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const icsEsc = (s) => s.replace(/([,;\\])/g, '\\$1');
  $$('[data-ics]').forEach((btn) => btn.addEventListener('click', () => {
    const now = icsDate(new Date());
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ShikharWedsMrinali//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    ICS_EVENTS.forEach(([name, start, hrs, loc], i) => {
      const s = new Date(start + ':00+05:30');
      const e = new Date(s.getTime() + hrs * 36e5);
      lines.push('BEGIN:VEVENT', `UID:swm-${i}@shikharwedsmrinali`, `DTSTAMP:${now}`, `DTSTART:${icsDate(s)}`, `DTEND:${icsDate(e)}`,
        `SUMMARY:${icsEsc(name + ' · Shikhar & Mrinali')}`, `LOCATION:${icsEsc(loc)}`, 'DESCRIPTION:#ShikharWedsMrinali', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Shikhar-Mrinali-Wedding.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Calendar file downloaded. See you there!');
  }));

  /* ---------- scratch card ---------- */
  const scratchCard = $('.scratch__card');
  if (scratchCard) {
    const canvas = $('.scratch__canvas', scratchCard);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const resetBtn = $('.scratch__reset');
    let dpr = 1, drawing = false, last = null, revealed = false, checkPending = false, touched = false;

    function paintFoil() {
      const r = scratchCard.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      const w = canvas.width, h = canvas.height;
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#B8862F'); g.addColorStop(0.25, '#E9CD7C'); g.addColorStop(0.45, '#F7E7B0');
      g.addColorStop(0.6, '#D3A84E'); g.addColorStop(0.8, '#F1D98F'); g.addColorStop(1, '#A87A2A');
      ctx.fillStyle = g;
      roundRect(ctx, 0, 0, w, h, 28 * dpr); ctx.fill();
      // foil grain
      for (let i = 0; i < (w * h) / 90; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,.18)' : 'rgba(120,80,20,.14)';
        ctx.fillRect(Math.random() * w, Math.random() * h, dpr, dpr);
      }
      // brushed diagonal sheen
      ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1 * dpr;
      for (let x = -h; x < w; x += 6 * dpr) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke(); }
      // inner border
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5 * dpr;
      roundRect(ctx, 14 * dpr, 14 * dpr, w - 28 * dpr, h - 28 * dpr, 18 * dpr); ctx.stroke();
      // label
      ctx.fillStyle = 'rgba(110,70,20,.85)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `${Math.round(Math.min(w / 9, 56 * dpr))}px "Great Vibes", cursive`;
      ctx.fillText('Scratch Here', w / 2, h / 2 - 14 * dpr);
      ctx.font = `500 ${Math.round(12 * dpr)}px Jost, sans-serif`;
      ctx.fillText('♥  TO REVEAL OUR WEDDING DATE  ♥'.split('').join(String.fromCharCode(8202)), w / 2, h / 2 + 30 * dpr);
      // sparkles
      ctx.fillStyle = 'rgba(255,255,255,.9)';
      [[0.14, 0.22], [0.86, 0.26], [0.2, 0.8], [0.82, 0.78], [0.5, 0.16]].forEach(([fx, fy], i) => star(ctx, fx * w, fy * h, (i % 2 ? 7 : 10) * dpr));
    }
    function roundRect(c, x, y, w, h, r) {
      c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    }
    function star(c, x, y, s) {
      c.beginPath(); c.moveTo(x, y - s); c.quadraticCurveTo(x, y, x + s, y); c.quadraticCurveTo(x, y, x, y + s);
      c.quadraticCurveTo(x, y, x - s, y); c.quadraticCurveTo(x, y, x, y - s); c.fill();
    }
    function point(e) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr, cx: e.clientX, cy: e.clientY };
    }
    function scratch(p) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = ctx.fillStyle = '#000';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.lineWidth = 46 * dpr;
      ctx.beginPath();
      ctx.moveTo((last || p).x, (last || p).y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      // rough edge for a realistic scratch
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(p.x + (Math.random() - 0.5) * 40 * dpr, p.y + (Math.random() - 0.5) * 40 * dpr, (2 + Math.random() * 5) * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      last = p;
      confetti.flakes(p.cx, p.cy, 2);
      if (!checkPending) { checkPending = true; setTimeout(checkProgress, 250); }
    }
    function checkProgress() {
      checkPending = false;
      if (revealed) return;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 4 * 24) { total++; if (data[i] < 40) clear++; }
      if (clear / total > 0.5) reveal();
    }
    function reveal() {
      revealed = true;
      canvas.classList.add('is-done');
      scratchCard.classList.add('is-revealed');
      resetBtn.hidden = false;
      const r = scratchCard.getBoundingClientRect();
      confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 160);
      toast('Save the date: 12 December 2026 ♥');
    }
    canvas.addEventListener('pointerdown', (e) => {
      if (revealed) return;
      drawing = true; last = null; touched = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
      scratch(point(e));
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      (evs.length ? evs : [e]).forEach((ev) => scratch(point(ev)));
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => canvas.addEventListener(t, () => { drawing = false; last = null; }));
    resetBtn.addEventListener('click', () => {
      revealed = false;
      resetBtn.hidden = true;
      scratchCard.classList.remove('is-revealed');
      canvas.classList.remove('is-done');
      paintFoil();
    });
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (!revealed) { touched = false; paintFoil(); } }, 200);
    });
    paintFoil();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!touched) paintFoil(); });
  }

  /* ---------- tabs (itinerary + venues) ---------- */
  function loadMaps(root) {
    $$('iframe[data-src]', root).forEach((f) => { f.src = f.dataset.src; f.removeAttribute('data-src'); });
  }
  $$('.tabs[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    function select(tab) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on) { panel.classList.add('is-in'); loadMaps(panel); }
      });
    }
    tabs.forEach((t, i) => {
      t.tabIndex = t.classList.contains('is-active') ? 0 : -1;
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus(); select(next);
      });
    });
  });
  // the visible venue map loads once the section approaches the viewport
  const venueSection = $('#venue');
  if ('IntersectionObserver' in window) {
    const mio = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { $$('.venue:not([hidden])').forEach(loadMaps); mio.disconnect(); }
    }, { rootMargin: '300px' });
    mio.observe(venueSection);
  } else {
    $$('.venue:not([hidden])').forEach(loadMaps);
  }

  /* ---------- gallery filter ---------- */
  const filterBtns = $$('[data-filter]');
  const tiles = $$('#gallery-grid .tile');
  filterBtns.forEach((b) => b.addEventListener('click', () => {
    filterBtns.forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', String(x === b)); });
    const f = b.dataset.filter;
    tiles.forEach((t) => t.classList.toggle('is-hidden', f !== 'all' && t.dataset.cat !== f));
  }));

  /* ---------- lightbox ---------- */
  const lb = $('.lightbox');
  const lbMedia = $('.lightbox__media', lb);
  const lbCap = $('.lightbox__caption', lb);
  let group = [], index = 0, lastFocus = null;

  function showItem() {
    const btn = group[index];
    const caption = btn.dataset.caption || '';
    lbMedia.innerHTML = '';
    if (btn.dataset.lbArt) {
      lbMedia.innerHTML = window.CoupleArt ? window.CoupleArt.render(btn.dataset.lbArt) : '';
    } else {
      const img = new Image();
      img.src = btn.dataset.lb;
      img.alt = (btn.querySelector('img') || {}).alt || caption;
      img.decoding = 'async';
      lbMedia.appendChild(img);
    }
    lbCap.textContent = caption;
    if (group.length > 1) {
      const sm = document.createElement('small');
      sm.textContent = `${index + 1} / ${group.length}`;
      lbCap.appendChild(sm);
    }
    $$('.lightbox__nav', lb).forEach((n) => (n.hidden = group.length < 2));
  }
  function openLb(btn) {
    if (btn.closest('#gallery-grid')) group = $$('#gallery-grid .tile:not(.is-hidden) button');
    else if (btn.closest('.event__decor')) group = $$('button', btn.closest('.event__decor'));
    else group = [btn];
    index = Math.max(0, group.indexOf(btn));
    lastFocus = document.activeElement;
    showItem();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lb.classList.add('is-open'));
    $('.lightbox__close', lb).focus();
  }
  function closeLb() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; lbMedia.innerHTML = ''; }, 300);
    if (lastFocus) lastFocus.focus();
  }
  function step(d) { index = (index + d + group.length) % group.length; showItem(); }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lb], [data-lb-art]');
    if (btn) { e.preventDefault(); openLb(btn); }
  });
  $('.lightbox__close', lb).addEventListener('click', closeLb);
  $('.lightbox__nav--prev', lb).addEventListener('click', () => step(-1));
  $('.lightbox__nav--next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lightbox__figure')) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      const f = $$('button:not([hidden])', lb);
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50 && group.length > 1) step(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- copy buttons ---------- */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  }
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    toast((await copyText(b.dataset.copy)) ? `Copied: ${b.dataset.copy}` : 'Could not copy, please copy manually');
  }));

  /* ---------- remote storage (optional Google Sheet) ---------- */
  function sendRemote(payload) {
    if (!CONFIG.endpoint) return Promise.resolve(false);
    const body = new URLSearchParams(payload);
    return fetch(CONFIG.endpoint, { method: 'POST', mode: 'no-cors', body }).then(() => true).catch(() => false);
  }

  /* ---------- form validation helper ---------- */
  function validate(form) {
    let ok = true;
    $$('input[required], textarea[required]', form).forEach((inp) => {
      if (inp.type === 'radio') return;
      const field = inp.closest('.field');
      const valid = inp.value.trim() !== '' && inp.checkValidity();
      field.classList.toggle('is-invalid', !valid);
      if (!valid && ok) { inp.focus(); ok = false; }
    });
    return ok;
  }
  $$('form').forEach((f) => f.addEventListener('input', (e) => {
    const field = e.target.closest('.field.is-invalid');
    if (field && e.target.checkValidity() && e.target.value.trim()) field.classList.remove('is-invalid');
  }));

  /* ---------- RSVP ---------- */
  const rsvp = $('#rsvp-form');
  if (rsvp) {
    const attendingOnly = $$('[data-when-attending]', rsvp);
    rsvp.addEventListener('change', (e) => {
      if (e.target.name === 'attendance') attendingOnly.forEach((f) => (f.hidden = e.target.value !== 'Joyfully accepts'));
    });
    rsvp.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(rsvp)) return;
      const fd = new FormData(rsvp);
      const attending = fd.get('attendance') === 'Joyfully accepts';
      const data = {
        type: 'rsvp',
        name: fd.get('name').trim(),
        phone: fd.get('phone').trim(),
        guests: attending ? fd.get('guests') : '0',
        attendance: fd.get('attendance'),
        meal: attending ? fd.get('meal') : '',
        events: attending ? fd.getAll('events').join(', ') : '',
        message: (fd.get('message') || '').trim(),
        submittedAt: new Date().toISOString()
      };
      const btn = $('button[type="submit"]', rsvp);
      btn.disabled = true;
      const all = store.get('swm-rsvps', []);
      all.push(data);
      store.set('swm-rsvps', all);
      const sent = await sendRemote(data);
      btn.disabled = false;

      const done = $('.rsvp__done', rsvp);
      $('[data-rsvp-name]', done).textContent = data.name.split(' ')[0];
      $('[data-rsvp-msg]', done).textContent = attending
        ? `We’ve saved ${data.guests === '1' ? 'a seat' : data.guests + ' seats'} for you. We can’t wait to celebrate with you in Indore!`
        : 'We’ll miss you dearly, and thank you for your love and blessings.';
      const wa = $('[data-rsvp-wa]', done);
      if (!sent || CONFIG.whatsapp) {
        const text = `RSVP for Shikhar & Mrinali's wedding\nName: ${data.name}\nPhone: ${data.phone}\nAttendance: ${data.attendance}` +
          (attending ? `\nGuests: ${data.guests}\nMeal: ${data.meal}${data.events ? `\nFunctions: ${data.events}` : ''}` : '') +
          (data.message ? `\nMessage: ${data.message}` : '');
        wa.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
        wa.textContent = sent ? 'Also send on WhatsApp' : 'Send your RSVP to the family on WhatsApp';
        wa.className = sent ? 'btn btn--ghost btn--sm' : 'btn btn--primary btn--sm';
        wa.hidden = false;
      } else {
        wa.hidden = true;
      }
      done.hidden = false;
      rsvp.classList.add('is-sent');
      rsvp.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      const r = rsvp.getBoundingClientRect();
      if (attending) confetti.burst(r.left + r.width / 2, Math.max(120, r.top + 120), 180);
    });
    $('[data-rsvp-again]', rsvp).addEventListener('click', () => {
      rsvp.reset();
      attendingOnly.forEach((f) => (f.hidden = false));
      rsvp.classList.remove('is-sent');
      $('.rsvp__done', rsvp).hidden = true;
      $('#r-name').focus();
    });
  }

  /* ---------- guestbook ---------- */
  const wall = $('#wish-wall');
  const wishForm = $('#wish-form');
  const WISH_BG = ['#FFF5F7', '#F6F1FD', '#FFF4EC', '#FFFBF2', '#F3F8EF'];
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function wishCard(w) {
    const card = document.createElement('article');
    card.className = 'wish';
    card.style.setProperty('--bg', WISH_BG[hash(w.name + w.message) % WISH_BG.length]);
    const p = document.createElement('p');
    p.textContent = w.message;
    const foot = document.createElement('footer');
    const who = document.createElement('strong');
    who.textContent = '— ' + w.name;
    const when = document.createElement('time');
    const d = new Date(w.time);
    if (!isNaN(d)) { when.dateTime = d.toISOString(); when.textContent = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    foot.append(who, when);
    card.append(p, foot);
    return card;
  }
  function renderWishes(list) {
    const empty = $('.guestbook__empty', wall);
    $$('.wish', wall).forEach((w) => w.remove());
    empty.hidden = list.length > 0;
    list.slice().sort((a, b) => new Date(b.time) - new Date(a.time)).forEach((w) => wall.appendChild(wishCard(w)));
  }
  let wishes = store.get('swm-wishes', []);
  renderWishes(wishes);
  if (CONFIG.endpoint) {
    fetch(CONFIG.endpoint + (CONFIG.endpoint.includes('?') ? '&' : '?') + 'type=wishes')
      .then((r) => r.json())
      .then((remote) => {
        if (!Array.isArray(remote)) return;
        const key = (w) => w.name + '|' + w.message;
        const seen = new Set(remote.map(key));
        wishes = remote.concat(wishes.filter((w) => !seen.has(key(w))));
        renderWishes(wishes);
      })
      .catch(() => { /* keep local wishes */ });
  }
  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(wishForm)) return;
      const fd = new FormData(wishForm);
      const w = { name: fd.get('name').trim(), message: fd.get('message').trim(), time: new Date().toISOString() };
      const local = store.get('swm-wishes', []);
      local.push(w);
      store.set('swm-wishes', local);
      wishes.push(w);
      renderWishes(wishes);
      sendRemote({ type: 'wish', ...w });
      wishForm.reset();
      toast('Thank you for your lovely wish ♥');
      const r = wall.getBoundingClientRect();
      confetti.burst(r.left + r.width / 2, Math.max(120, r.top + 60), 70);
    });
  }
})();
