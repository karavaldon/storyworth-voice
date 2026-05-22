(function () {
  'use strict';

  const FRAME_W = 400;
  const FRAME_H = 567;

  function injectFonts() {
    if (document.getElementById('sw-fonts')) return;
    const link = document.createElement('link');
    link.id = 'sw-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Playfair+Display:ital,wght@0,400;1,400&family=EB+Garamond:ital@0;1&display=swap';
    document.head.appendChild(link);
  }

  function loadGSAP(cb) {
    if (window.gsap) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  const storyText = [
    [
      { text: "Oh, yes. I remember thinking — I have no idea what I'm doing. But I also just knew I'd do anything for her. They put her in my arms and I just looked down at her and thought: " },
      { text: "well, that's it. That's my whole life right there.", em: true },
    ],
    [
      { text: "I'd heard people say your whole life changes. I thought I understood what that meant. You can't, until someone puts a baby in your arms and she opens her eyes and looks at you like you're the only thing in the world." },
    ],
  ];

  function typeWriter(container, paragraphs, msPerChar) {
    container.innerHTML = '';
    const chars = [];
    paragraphs.forEach((segs, pi) => {
      if (pi > 0) chars.push({ newPara: true });
      segs.forEach(seg => {
        [...seg.text].forEach(ch => chars.push({ ch, em: !!seg.em }));
      });
    });

    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    let i = 0, currentP = null, currentSpan = null, currentEm = null;
    currentP = document.createElement('p');
    container.appendChild(currentP);
    currentP.appendChild(cursor);

    function tick() {
      if (i >= chars.length) return;
      const item = chars[i++];
      if (item.newPara) {
        currentP = document.createElement('p');
        container.appendChild(currentP);
        currentSpan = null; currentEm = null;
        currentP.appendChild(cursor);
        setTimeout(tick, msPerChar * 10);
        return;
      }
      if (item.em !== currentEm || !currentSpan) {
        currentSpan = document.createElement(item.em ? 'em' : 'span');
        currentEm = item.em;
        currentP.insertBefore(currentSpan, cursor);
      }
      currentSpan.textContent += item.ch;
      setTimeout(tick, msPerChar);
    }
    setTimeout(tick, msPerChar);
  }

  const CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    img { display: block; }

    :host { display: block; width: 100%; }

    .scale-wrap {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .frame {
      position: relative;
      width: ${FRAME_W}px;
      height: ${FRAME_H}px;
      transform-origin: top left;
    }

    /* Each screen fills the frame */
    .screen {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
    }

    /* ── Labels ──────────────────────────────────────────────── */
    .label {
      position: absolute;
      font-family: 'GT America', 'DM Sans', system-ui, sans-serif;
      font-size: 20px;
      color: #1e1e1e;
      white-space: nowrap;
      text-align: center;
      line-height: normal;
      transform: translateX(-50%);
    }
    .label strong { font-weight: 500; }

    /* Screen 1 labels */
    .label--talk   { left: 209.14px; top: 19.98px; }
    .label--family { left: 238.64px; top: 50px; }

    /* Screen 2 label — centered in 400px frame */
    .label--write  { left: 200px; top: 50px; }

    /* ── Portraits ───────────────────────────────────────────── */
    .portrait-wrap {
      position: absolute;
      border-radius: 50%;
      overflow: hidden;
      z-index: 2;
      box-shadow: 0 0 0 5px #fff;
    }
    .portrait-wrap--dad {
      left: 170.84px; top: 118.9px;
      width: 125.46px; height: 125.46px;
    }
    .portrait-wrap--daughter {
      left: 122.46px; top: 190.88px;
      width: 86.615px; height: 86.615px;
      box-shadow: none;
    }
    .portrait-wrap--daughter video {
      transform: scaleX(-1);
      object-position: calc(50% + 30px) center;
    }
    .portrait-wrap img,
    .portrait-wrap video { width: 100%; height: 100%; object-fit: cover; }

    /* ── Phone card ──────────────────────────────────────────── */
    .phone-card {
      position: absolute;
      left: 87.16px; top: 89.96px;
      width: 238.313px; height: 456.367px;
      background: #f7ede6;
      border-radius: 18px;
      border: 5px solid #fff;
      box-shadow: 0 4px 25px rgba(190,157,132,0.12);
    }

    /* ── Audio wave ──────────────────────────────────────────── */
    .audio-wave {
      position: absolute;
      left: 77.86px; top: 29.4px;
      width: 61.2px; height: 39.83px;
      overflow: visible;
    }

    @keyframes bar1 { 0%,100%{transform:scaleY(0.9)}  30%{transform:scaleY(0.58)} 65%{transform:scaleY(0.78)} }
    @keyframes bar2 { 0%,100%{transform:scaleY(0.65)} 20%{transform:scaleY(1)}    55%{transform:scaleY(0.6)}  }
    @keyframes bar3 { 0%,100%{transform:scaleY(1)}    35%{transform:scaleY(0.55)} 60%{transform:scaleY(0.85)} 80%{transform:scaleY(0.62)} }
    @keyframes bar4 { 0%,100%{transform:scaleY(0.72)} 25%{transform:scaleY(0.52)} 50%{transform:scaleY(0.95)} 75%{transform:scaleY(0.6)} }
    @keyframes bar5 { 0%,100%{transform:scaleY(0.88)} 20%{transform:scaleY(0.65)} 50%{transform:scaleY(0.55)} 75%{transform:scaleY(0.82)} }
    @keyframes bar6 { 0%,100%{transform:scaleY(0.68)} 30%{transform:scaleY(0.95)} 58%{transform:scaleY(0.6)} }
    .bar { transform-box: fill-box; transform-origin: center; }
    #bar-1 { animation: bar1 1.3s ease-in-out infinite 0s;    }
    #bar-2 { animation: bar2 1.5s ease-in-out infinite 0.18s; }
    #bar-3 { animation: bar3 1.1s ease-in-out infinite 0.07s; }
    #bar-4 { animation: bar4 1.4s ease-in-out infinite 0.3s;  }
    #bar-5 { animation: bar5 1.2s ease-in-out infinite 0.12s; }
    #bar-6 { animation: bar6 1.6s ease-in-out infinite 0.24s; }

    /* ── Chat bubbles ────────────────────────────────────────── */
    .bubble {
      position: absolute;
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      border-radius: 9px;
      padding: 6px 12px;
      font-family: 'GT America', 'DM Sans', system-ui, sans-serif;
      font-size: 12px;
      line-height: 18px;
      color: #000;
      box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.06);
    }
    .bubble--q { left: 41.89px;  top: 299.28px; width: 203.48px; }
    #bubble-2  { left: 127.46px; top: 361.97px; width: 230.65px; }
    #bubble-3  { left: 127.46px; top: 455.51px; width: 230.65px; }

    /* ── Glow (screen 2) ─────────────────────────────────────── */
    .glow {
      position: absolute;
      left: -103.77px; top: -62.93px;
      width: 715.509px; height: 715.509px;
      pointer-events: none;
    }

    /* ── Chapter card / screen (screen 2) ────────────────────── */
    .chapter-card {
      position: absolute;
      left: 34.936px; top: 98.11px;
      width: 330.128px; height: 339.493px;
      background: linear-gradient(125.11deg, #f7eee7 2.96%, #f1d8c4 96.9%);
      border-radius: 18px;
      border: 5px solid #fff;
      box-shadow: 0 4px 25px rgba(190,157,132,0.12);
    }

    /* ── White page (screen 2) ───────────────────────────────── */
    .chapter-page {
      position: absolute;
      left: 70.60px; top: 132.81px;
      width: 258.808px; height: 304.792px;
      background: #fff;
      overflow: hidden;
    }

    /* ── Chapter title — inside .chapter-page ────────────────── */
    .chapter-title {
      position: absolute;
      left: 32.624px; top: 18.84px;
      width: 193.552px;
      font-family: 'GT Super Display', 'Playfair Display', Georgia, serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 23px;
      color: #042a21;
      text-align: center;
    }

    /* ── Chapter body — inside .chapter-page ─────────────────── */
    .chapter-body {
      position: absolute;
      left: 17.18px; top: 80.69px;
      width: 224.43px;
      font-family: 'Garamond Premier Pro', 'EB Garamond', Georgia, serif;
      font-size: 10px;
      line-height: 25px;
      color: #042a21;
    }
    .chapter-body p + p { margin-top: 8px; }
    .chapter-body em { font-style: italic; }

    /* ── Typewriter cursor ───────────────────────────────────── */
    @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .type-cursor {
      display: inline-block;
      width: 1px; height: 0.85em;
      background: #042a21;
      vertical-align: text-bottom;
      margin-left: 1px;
      animation: cursor-blink 0.6s step-end infinite;
    }

  `;

  function buildHTML(ap) {
    return `
      <div class="scale-wrap">
        <div class="frame">

          <!-- ── Screen 1: mobile 1 (phone call side) ───────── -->
          <div class="screen" id="screen-1">
            <p class="label label--talk"   id="lbl-talk">Talk with <strong>us</strong></p>
            <p class="label label--family" id="lbl-family">Or talk with <strong>family</strong></p>

            <svg id="audio-wave" class="audio-wave" viewBox="0 0 61.1992 39.8345" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="bar" id="bar-1" d="M6.02933 11.5264C6.02933 9.76039 4.67923 8.3286 3.01414 8.3286C1.35009 8.3286 0 9.76039 0 11.5264V28.3076C0 30.0737 1.35009 31.5054 3.01414 31.5054C4.67923 31.5054 6.02933 30.0737 6.02933 28.3076V11.5264Z" fill="#FF9E82"/>
              <path class="bar" id="bar-2" d="M17.0635 17.3207C17.0635 15.5547 15.7134 14.1229 14.0494 14.1229C12.3843 14.1229 11.0342 15.5547 11.0342 17.3207V22.5132C11.0342 24.2794 12.3843 25.711 14.0494 25.711C15.7134 25.711 17.0635 24.2794 17.0635 22.5132V17.3207Z" fill="#FF9E82"/>
              <path class="bar" id="bar-3" d="M28.0966 8.62963C28.0966 6.86349 26.7476 5.43181 25.0825 5.43181C23.4174 5.43181 22.0684 6.86349 22.0684 8.62963V31.2046C22.0684 32.9708 23.4174 34.4025 25.0825 34.4025C26.7476 34.4025 28.0966 32.9708 28.0966 31.2046V8.62963Z" fill="#FF9E82"/>
              <path class="bar" id="bar-4" d="M39.1309 3.19771C39.1309 1.43168 37.7808 0 36.1167 0C34.4516 0 33.1016 1.43168 33.1016 3.19771V36.6367C33.1016 38.4029 34.4516 39.8345 36.1167 39.8345C37.7808 39.8345 39.1309 38.4029 39.1309 36.6367V3.19771Z" fill="#FF9E82"/>
              <path class="bar" id="bar-5" d="M50.165 8.62963C50.165 6.86349 48.8159 5.43181 47.1509 5.43181C45.4858 5.43181 44.1367 6.86349 44.1367 8.62963V31.2046C44.1367 32.9708 45.4858 34.4025 47.1509 34.4025C48.8159 34.4025 50.165 32.9708 50.165 31.2046V8.62963Z" fill="#FF9E82"/>
              <path class="bar" id="bar-6" d="M61.1992 17.3207C61.1992 15.5547 59.8492 14.1229 58.1841 14.1229C56.52 14.1229 55.1699 15.5547 55.1699 17.3207V22.5132C55.1699 24.2793 56.52 25.711 58.1841 25.711C59.8492 25.711 61.1992 24.2793 61.1992 22.5132V17.3207Z" fill="#FF9E82"/>
            </svg>

            <div class="portrait-wrap portrait-wrap--daughter" id="daughter">
              <video src="${ap}/daughter.mp4" id="daughter-video" autoplay muted playsinline></video>
            </div>
            <div class="portrait-wrap portrait-wrap--dad" id="portrait">
              <video src="${ap}/dad.mp4" id="dad-video" autoplay muted playsinline></video>
            </div>

            <div class="phone-card" id="phone-card"></div>

            <div class="bubble bubble--q" id="bubble-1">Do you remember the moment you became my dad?</div>
            <div class="bubble" id="bubble-2">Oh yes... I remember that day and thinking... ha I have no idea what I'm doing. But I also just knew I'd do anything for you.</div>
            <div class="bubble" id="bubble-3">They put you in my arms and I thought... well that's it. That's my whole life right there...</div>
          </div>

          <!-- ── Screen 2: mobile 2 (chapter side) ───────────── -->
          <div class="screen" id="screen-2">
            <img class="glow" id="glow" src="${ap}/glow.svg" alt="" />
            <p class="label label--write" id="lbl-write">We write a <strong>chapter</strong></p>
            <div class="chapter-card" id="chapter-card"></div>
            <div class="chapter-page" id="chapter-page">
              <h2 class="chapter-title" id="chapter-title">Do you remember the moment you became a dad?</h2>
              <div class="chapter-body" id="chapter-body"></div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  class StoryworthHeroMobile extends HTMLElement {
    connectedCallback() {
      injectFonts();
      const ap = this.getAttribute('asset-path') || './assets';
      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = CSS;
      shadow.appendChild(style);

      const tmp = document.createElement('div');
      tmp.innerHTML = buildHTML(ap);
      while (tmp.firstChild) shadow.appendChild(tmp.firstChild);

      this._setupVideos(shadow);
      this._ro = new ResizeObserver(() => this._updateScale(shadow));
      this._ro.observe(this);
      this._updateScale(shadow);
      loadGSAP(() => this._runAnimation(shadow));
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
      if (this._tl) this._tl.kill();
    }

    _updateScale(shadow) {
      const w = this.getBoundingClientRect().width || FRAME_W;
      const scale = Math.min(1, w / FRAME_W);
      const frame = shadow.querySelector('.frame');
      if (frame) frame.style.transform = `scale(${scale})`;
      const wrap = shadow.querySelector('.scale-wrap');
      if (wrap) wrap.style.height = (FRAME_H * scale) + 'px';
    }

    _setupVideos(shadow) {
      const dad = shadow.getElementById('dad-video');
      dad.addEventListener('loadedmetadata', () => { dad.currentTime = 3; });
      dad.addEventListener('ended', () => { dad.currentTime = 3; dad.play(); });

      const daughter = shadow.getElementById('daughter-video');
      daughter.addEventListener('loadedmetadata', () => { daughter.currentTime = 6; });
      daughter.addEventListener('ended', () => { daughter.currentTime = 6; daughter.play(); });
    }

    _runAnimation(shadow) {
      const g = window.gsap;
      const $ = id => shadow.getElementById(id);

      const els = {
        screen1:      $('screen-1'),
        screen2:      $('screen-2'),
        // Screen 1
        lblTalk:      $('lbl-talk'),
        lblFamily:    $('lbl-family'),
        audioWave:    $('audio-wave'),
        phoneCard:    $('phone-card'),
        portrait:     $('portrait'),
        daughter:     $('daughter'),
        bubble1:      $('bubble-1'),
        bubble2:      $('bubble-2'),
        bubble3:      $('bubble-3'),
        // Screen 2
        glow:         $('glow'),
        lblWrite:     $('lbl-write'),
        chapterCard:  $('chapter-card'),
        chapterPage:  $('chapter-page'),
        chapterTitle: $('chapter-title'),
        chapterBody:  $('chapter-body'),
      };

      const build = () => {
        const tl = g.timeline({ defaults: { ease: 'power2.out' } });

        // Reset screens
        g.set(els.screen1, { opacity: 1 });
        g.set(els.screen2, { opacity: 0 });

        // Hide all individual elements
        g.set([
          els.lblTalk, els.lblFamily, els.audioWave, els.phoneCard,
          els.portrait, els.daughter, els.bubble1, els.bubble2, els.bubble3,
          els.glow, els.lblWrite, els.chapterCard, els.chapterPage,
          els.chapterTitle, els.chapterBody,
        ], { opacity: 0 });

        // Entry offsets
        g.set([els.portrait, els.daughter, els.phoneCard], { y: 16 });
        g.set([els.lblTalk, els.lblFamily], { y: 6 });
        g.set([els.bubble1, els.bubble2, els.bubble3], { y: 8 });
        g.set([els.chapterCard, els.chapterPage, els.chapterTitle], { y: 12 });

        // ── Screen 1 sequence ───────────────────────────────── //
        tl.to(els.lblTalk,   { opacity: 1, y: 0, duration: 0.35 });
        tl.to(els.audioWave, { opacity: 1, duration: 0.35 }, '<');
        tl.to(els.lblFamily, { opacity: 1, y: 0, duration: 0.3  }, '+=0.25');
        tl.to(els.phoneCard, { opacity: 1, y: 0, duration: 0.5  }, '+=0.3');
        tl.to(els.portrait,  { opacity: 1, y: 0, duration: 0.5  }, '-=0.35');
        tl.to(els.daughter,  { opacity: 1, y: 0, duration: 0.5  }, '<+=0.05');
        tl.to(els.bubble1,   { opacity: 1, y: 0, duration: 0.25 }, '+=0.2');
        tl.to(els.bubble2,   { opacity: 1, y: 0, duration: 0.25 }, '+=0.3');
        tl.to(els.bubble3,   { opacity: 1, y: 0, duration: 0.25 }, '+=0.3');

        // ── Crossfade to screen 2 ───────────────────────────── //
        tl.to(els.screen1, { opacity: 0, duration: 0.5, ease: 'power1.inOut' }, '+=1.8');
        tl.to(els.screen2, { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, '<');

        // ── Screen 2 sequence ───────────────────────────────── //
        tl.to(els.lblWrite,     { opacity: 1, duration: 0.35 }, '+=0.2');
        tl.to(els.chapterCard,  { opacity: 1, y: 0, duration: 0.55 }, '-=0.2');
        tl.to(els.glow,         { opacity: 0.6, duration: 0.8 }, '<');
        tl.to(els.chapterPage,  { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');
        tl.to(els.chapterTitle, { opacity: 1, y: 0, duration: 0.45 }, '+=0.15');
        tl.call(() => {
          g.set(els.chapterBody, { opacity: 1 });
          typeWriter(els.chapterBody, storyText, 12);
        }, [], '+=0.3');

        tl.call(() => {
          this._tl.kill();
          this._tl = build();
        }, [], '+=4');

        return tl;
      };

      this._tl = build();
    }
  }

  if (!customElements.get('storyworth-hero-mobile')) {
    customElements.define('storyworth-hero-mobile', StoryworthHeroMobile);
  }
})();
