(function () {
  'use strict';

  const FRAME_W = 933.97;
  const FRAME_H = 566.56;

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
      { text: 'Oh, yes. I remember thinking — I have no idea what I’m doing. But I also just knew I’d do anything for her. They put her in my arms and I just looked down at her and thought: ' },
      { text: 'well, that’s it. That’s my whole life right there.', em: true },
    ],
    [
      { text: 'I’d always heard people say your whole life changes. I thought I understood what that meant. I didn’t. You can’t, until someone puts a baby in your arms and she opens her eyes and looks at you like you’re the only thing in the world.' },
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
    .label--talk   { left: 219.01px; top: 0; }
    .label--family { left: 248.51px; top: 29.33px; }
    .label--write  { left: 533.2px;  top: 113.08px; }

    .glow {
      position: absolute;
      left: 441px;
      top: 19.98px;
      width: 715.509px;
      height: 715.509px;
      pointer-events: none;
    }

    .portrait-wrap {
      position: absolute;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      z-index: 2;
      box-shadow: 0 0 0 5px #fff;
    }
    .portrait-wrap--dad      { left: 240.76px; top: 96.9px;   width: 125.46px;  height: 125.46px; }
    .portrait-wrap--daughter { left: 193.38px; top: 169.88px; width: 86.615px;  height: 86.615px; box-shadow: none; }
    .portrait-wrap--daughter video { transform: scaleX(-1); object-position: calc(50% + 30px) center; }
    .portrait-wrap img,
    .portrait-wrap video { width: 100%; height: 100%; object-fit: cover; }

    .phone-card {
      position: absolute;
      left: 158.08px; top: 68.96px;
      width: 238.31px; height: 456.367px;
      background: #f7ede6;
      border-radius: 18px;
      border: 5px solid #fff;
      box-shadow: 0 4px 25px rgba(190,157,132,0.12);
    }

    .audio-wave {
      position: absolute;
      left: 87.70px; top: 9.40px;
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

    .bubble {
      position: absolute;
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      border-radius: 9px;
      padding: 6px 12px;
      font-size: 12px;
      line-height: 18px;
      color: #000;
      box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.06);
    }
    .bubble--q { left: 112.81px; top: 278.28px; width: 203.48px; }
    #bubble-2  { left: 198.38px; top: 340.97px; width: 230.65px; }
    #bubble-3  { left: 198.38px; top: 434.51px; width: 230.65px; }

    .arrow-connector {
      position: absolute;
      left: 405.01px; top: 272.75px;
      width: 36px; height: 26.5px;
    }

    .chapter-card {
      position: absolute;
      left: 448.68px; top: 150.09px;
      width: 485.29px; height: 408px;
      background: linear-gradient(130.12deg, #f7eee7 2.96%, #f1d8c4 96.9%);
      border-radius: 18px;
      border: 5px solid #fff;
      box-shadow: 0 4px 25px rgba(190,157,132,0.12);
    }

    .chapter-page {
      position: absolute;
      left: 511.16px; top: 203.92px;
      width: 360.34px; height: 354.85px;
      background: #fff;
      overflow: hidden;
    }

    .chapter-title {
      position: absolute;
      left: 45.43px; top: 41.33px;
      width: 269.48px;
      font-family: 'GT Super Display', 'Playfair Display', Georgia, serif;
      font-size: 21px;
      font-weight: 400;
      line-height: 27px;
      color: #042a21;
      text-align: center;
    }

    .chapter-body {
      position: absolute;
      left: 32.63px; top: 127.41px;
      width: 303.15px;
      font-family: 'Garamond Premier Pro', 'EB Garamond', Georgia, serif;
      font-size: 12px;
      line-height: 27px;
      color: #042a21;
    }
    .chapter-body p + p { margin-top: 10px; }
    .chapter-body em { font-style: italic; }

    @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .type-cursor {
      display: inline-block;
      width: 1px; height: 0.85em;
      background: #042a21;
      vertical-align: text-bottom;
      margin-left: 1px;
      animation: cursor-blink 0.6s step-end infinite;
    }

    .replay-btn {
      position: absolute;
      bottom: 16px; right: 16px;
      background: #042a21;
      color: #fff;
      border: none;
      border-radius: 24px;
      padding: 10px 20px;
      font-family: 'GT America', 'DM Sans', system-ui, sans-serif;
      font-size: 14px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      z-index: 100;
    }
    .replay-btn:hover { opacity: 1; }
  `;

  function buildHTML(ap) {
    return `
      <div class="scale-wrap">
        <div class="frame">
          <img class="glow" id="glow" src="${ap}/glow.svg" alt="" />

          <p class="label label--talk"   id="lbl-talk">Talk with <strong>us</strong></p>
          <p class="label label--family" id="lbl-family">Or talk with <strong>family</strong></p>
          <p class="label label--write"  id="lbl-write">We write a <strong>chapter</strong></p>

          <div class="portrait-wrap portrait-wrap--daughter" id="daughter">
            <video src="${ap}/daughter.mp4" id="daughter-video" autoplay muted playsinline></video>
          </div>
          <div class="portrait-wrap portrait-wrap--dad" id="portrait">
            <video src="${ap}/dad.mp4" id="dad-video" autoplay muted playsinline></video>
          </div>

          <div class="phone-card" id="phone-card"></div>

          <svg id="audio-wave" class="audio-wave" viewBox="0 0 61.1992 39.8345" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="bar" id="bar-1" d="M6.02933 11.5264C6.02933 9.76039 4.67923 8.3286 3.01414 8.3286C1.35009 8.3286 0 9.76039 0 11.5264V28.3076C0 30.0737 1.35009 31.5054 3.01414 31.5054C4.67923 31.5054 6.02933 30.0737 6.02933 28.3076V11.5264Z" fill="#FF9E82"/>
            <path class="bar" id="bar-2" d="M17.0635 17.3207C17.0635 15.5547 15.7134 14.1229 14.0494 14.1229C12.3843 14.1229 11.0342 15.5547 11.0342 17.3207V22.5132C11.0342 24.2794 12.3843 25.711 14.0494 25.711C15.7134 25.711 17.0635 24.2794 17.0635 22.5132V17.3207Z" fill="#FF9E82"/>
            <path class="bar" id="bar-3" d="M28.0966 8.62963C28.0966 6.86349 26.7476 5.43181 25.0825 5.43181C23.4174 5.43181 22.0684 6.86349 22.0684 8.62963V31.2046C22.0684 32.9708 23.4174 34.4025 25.0825 34.4025C26.7476 34.4025 28.0966 32.9708 28.0966 31.2046V8.62963Z" fill="#FF9E82"/>
            <path class="bar" id="bar-4" d="M39.1309 3.19771C39.1309 1.43168 37.7808 0 36.1167 0C34.4516 0 33.1016 1.43168 33.1016 3.19771V36.6367C33.1016 38.4029 34.4516 39.8345 36.1167 39.8345C37.7808 39.8345 39.1309 38.4029 39.1309 36.6367V3.19771Z" fill="#FF9E82"/>
            <path class="bar" id="bar-5" d="M50.165 8.62963C50.165 6.86349 48.8159 5.43181 47.1509 5.43181C45.4858 5.43181 44.1367 6.86349 44.1367 8.62963V31.2046C44.1367 32.9708 45.4858 34.4025 47.1509 34.4025C48.8159 34.4025 50.165 32.9708 50.165 31.2046V8.62963Z" fill="#FF9E82"/>
            <path class="bar" id="bar-6" d="M61.1992 17.3207C61.1992 15.5547 59.8492 14.1229 58.1841 14.1229C56.52 14.1229 55.1699 15.5547 55.1699 17.3207V22.5132C55.1699 24.2793 56.52 25.711 58.1841 25.711C59.8492 25.711 61.1992 24.2793 61.1992 22.5132V17.3207Z" fill="#FF9E82"/>
          </svg>

          <div class="bubble bubble--q" id="bubble-1">Do you remember the moment you became my dad?</div>
          <div class="bubble bubble--a" id="bubble-2">Oh yes... I remember that day and thinking... ha I have no idea what I'm doing. But I also just knew I'd do anything for you.</div>
          <div class="bubble bubble--a" id="bubble-3">They put you in my arms and I thought... well that's it. That's my whole life right there...</div>

          <img class="arrow-connector" src="${ap}/arrow-connector.svg" alt="" id="connector" />

          <div class="chapter-card" id="chapter-card"></div>
          <div class="chapter-page" id="chapter-page">
            <h2 class="chapter-title" id="chapter-title">Do you remember the moment you became a dad?</h2>
            <div class="chapter-body" id="chapter-body"></div>
          </div>

          <button class="replay-btn" id="replay-btn">↺ Replay</button>
        </div>
      </div>
    `;
  }

  class StoryworthHero extends HTMLElement {
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
        glow:         $('glow'),
        portrait:     $('portrait'),
        daughter:     $('daughter'),
        lblTalk:      $('lbl-talk'),
        lblFamily:    $('lbl-family'),
        phoneCard:    $('phone-card'),
        audioWave:    $('audio-wave'),
        bubble1:      $('bubble-1'),
        bubble2:      $('bubble-2'),
        bubble3:      $('bubble-3'),
        connector:    $('connector'),
        lblWrite:     $('lbl-write'),
        chapterCard:  $('chapter-card'),
        chapterPage:  $('chapter-page'),
        chapterTitle: $('chapter-title'),
        chapterBody:  $('chapter-body'),
      };

      const build = () => {
        const tl = g.timeline({ defaults: { ease: 'power2.out' } });
        g.set(Object.values(els), { opacity: 0 });
        g.set([els.portrait, els.daughter, els.phoneCard], { y: 16 });
        g.set([els.lblTalk, els.lblFamily], { y: 6 });
        g.set([els.bubble1, els.bubble2, els.bubble3], { y: 8 });
        g.set([els.chapterCard, els.chapterPage, els.chapterTitle], { x: 16 });
        g.set(els.connector, { scale: 0.6, transformOrigin: 'center center' });

        tl.to(els.lblTalk,      { opacity: 1, y: 0, duration: 0.35 });
        tl.to(els.audioWave,    { opacity: 1, duration: 0.35 }, '<');
        tl.to(els.lblFamily,    { opacity: 1, y: 0, duration: 0.3 }, '+=0.25');
        tl.to(els.phoneCard,    { opacity: 1, y: 0, duration: 0.5 }, '+=0.3');
        tl.to(els.portrait,     { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');
        tl.to(els.daughter,     { opacity: 1, y: 0, duration: 0.5 }, '<+=0.05');
        tl.to(els.bubble1,      { opacity: 1, y: 0, duration: 0.25 }, '+=0.2');
        tl.to(els.bubble2,      { opacity: 1, y: 0, duration: 0.25 }, '+=0.3');
        tl.to(els.bubble3,      { opacity: 1, y: 0, duration: 0.25 }, '+=0.3');
        tl.to(els.connector,    { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, '+=0.3');
        tl.to(els.lblWrite,     { opacity: 1, duration: 0.35 }, '-=0.1');
        tl.to(els.chapterCard,  { opacity: 1, x: 0, duration: 0.55 }, '-=0.2');
        tl.to(els.glow,         { opacity: 0.6, duration: 0.8 }, '<');
        tl.to(els.chapterPage,  { opacity: 1, x: 0, duration: 0.4 }, '-=0.2');
        tl.to(els.chapterTitle, { opacity: 1, x: 0, duration: 0.45 }, '+=0.15');
        tl.call(() => {
          g.set(els.chapterBody, { opacity: 1 });
          typeWriter(els.chapterBody, storyText, 22);
        }, [], '+=0.3');
        return tl;
      };

      this._tl = build();
      $('replay-btn').addEventListener('click', () => {
        this._tl.kill();
        this._tl = build();
      });
    }
  }

  if (!customElements.get('storyworth-hero')) {
    customElements.define('storyworth-hero', StoryworthHero);
  }
})();
