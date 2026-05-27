(function () {
  'use strict';

  /* ── Figma frame "voice" exact dimensions ── */
  const FRAME_W = 859.397;
  const FRAME_H = 487.32;

  const CDN = 'https://cdn.jsdelivr.net/gh/karavaldon/storyworth-voice@main/assets';

  function injectFonts() {
    if (document.getElementById('sw-fonts')) return;
    const link = document.createElement('link');
    link.id = 'sw-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap';
    document.head.appendChild(link);
  }

  function loadGSAP(cb) {
    if (window.gsap) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  const CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    img, video { display: block; }
    :host { display: block; width: 100%; }

    .scale-wrap {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    /* Figma frame: 859.4 × 487.32, transparent bg */
    .frame {
      position: relative;
      width: ${FRAME_W}px;
      height: ${FRAME_H}px;
      transform-origin: top left;
      overflow: hidden;
    }

    /* ── Background photo (node 'image', x=154.1, y=0, 558.8×369.3, r=12) ── */
    .bg-image {
      position: absolute;
      left: 154.1px;
      top: 0;
      width: 558.8px;
      height: 369.3px;
      border-radius: 12px;
      object-fit: cover;
      box-shadow: 0 4px 18px rgba(0,0,0,0.12);
    }

    /* ── Dad portrait (node 'dad', x=0, y=161.9, 234.4×234.4, r=30, drop shadow) ── */
    .dad-wrap {
      position: absolute;
      left: 0;
      top: 161.9px;
      width: 234.4px;
      height: 234.4px;
      border-radius: 30px;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0,0,0,0.12);
      z-index: 2;
    }
    .dad-wrap video {
      width: 100%; height: 100%; object-fit: cover;
    }

    /* ── Daughter portrait (node 'daughter', x=191.5, y=290.4, 173.9×173.9, r=30, drop shadow, flipped) ── */
    .daughter-wrap {
      position: absolute;
      left: 191.5px;
      top: 290.4px;
      width: 173.9px;
      height: 173.9px;
      border-radius: 30px;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0,0,0,0.12);
      z-index: 3;
    }
    .daughter-wrap video {
      width: 100%; height: 100%; object-fit: cover;
      transform: scaleX(-1);
      object-position: calc(50% + 30px) center;
    }

    /* ── Cards (stacked vertically on right, x=566.4) ── */
    .card {
      position: absolute;
      left: 566.4px;
      width: 293px;
      height: 86px;
      background: rgba(237,231,226,0.8);
      border-radius: 12px;
      overflow: hidden;
      z-index: 4;
    }
    .card img {
      width: 100%; height: 100%;
    }

    #wtr-card1 { top: 130.3px; }
    #wtr-card2 { top: 237.0px; }
    #wtr-card3 { top: 341.9px; }

    /* ── Curly phone cord (node 'Vector 9782', x=64.7, y=402.1, rotated ~9.84°) ── */
    .cord {
      position: absolute;
      left: 64.7px;
      top: 402.1px;
      width: 134px;
      height: 80px;
      transform-origin: 0 0;
      transform: rotate(9.84deg);
      z-index: 5;
    }

    /* ── Recording dot ── */
    .rec-dot {
      position: absolute;
      left: 16px;
      top: 16px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #e8392a;
      z-index: 10;
    }
    @keyframes rec-glow {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,57,42,0.5); }
      50%      { opacity: 0.6; box-shadow: 0 0 0 6px rgba(232,57,42,0); }
    }
    .rec-dot { animation: rec-glow 1.4s ease-in-out infinite; }

    /* ── Replay ── */
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

          <!-- Background photo -->
          <img class="bg-image" id="wtr-bg" src="${ap}/mom-dad-book.jpg" alt="" />

          <!-- Dad portrait — dad2.mp4 -->
          <div class="dad-wrap" id="wtr-dad">
            <video id="wtr-vid-dad" src="${ap}/dad2.mp4" autoplay muted playsinline></video>
          </div>

          <!-- Daughter portrait — daughter.mp4, flipped -->
          <div class="daughter-wrap" id="wtr-daughter">
            <video id="wtr-vid-daughter" src="${ap}/daughter.mp4" autoplay muted playsinline></video>
          </div>

          <!-- Card 1: Family Calls -->
          <div class="card" id="wtr-card1">
            <img src="${ap}/wtr-card1-icon.svg" alt="Family Calls let you share together" />
          </div>

          <!-- Card 2: Magic Interviews -->
          <div class="card" id="wtr-card2">
            <img src="${ap}/wtr-card2-icon.svg" alt="Magic Interviews help him remember details" />
          </div>

          <!-- Card 3: Story Calls -->
          <div class="card" id="wtr-card3">
            <img src="${ap}/wtr-card3-icon.svg" alt="Story Calls capture his voice word-for-word" />
          </div>

          <!-- Curly phone cord -->
          <img class="cord" id="wtr-cord" src="${ap}/wtr-cord.svg" alt="" />

          <!-- Recording indicator -->
          <div class="rec-dot" id="wtr-rec"></div>

          <button class="replay-btn" id="wtr-replay">↺ Replay</button>
        </div>
      </div>
    `;
  }

  class WaysToRecord extends HTMLElement {
    connectedCallback() {
      injectFonts();
      const ap = this.getAttribute('asset-path') || CDN;
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
      const dad = shadow.getElementById('wtr-vid-dad');
      dad.addEventListener('loadedmetadata', () => { dad.currentTime = 0; });
      dad.addEventListener('ended', () => { dad.currentTime = 0; dad.play(); });

      const daughter = shadow.getElementById('wtr-vid-daughter');
      daughter.addEventListener('loadedmetadata', () => { daughter.currentTime = 6; });
      daughter.addEventListener('ended', () => { daughter.currentTime = 6; daughter.play(); });
    }

    _runAnimation(shadow) {
      const g = window.gsap;
      const $ = id => shadow.getElementById(id);

      const els = {
        bg:       $('wtr-bg'),
        dad:      $('wtr-dad'),
        daughter: $('wtr-daughter'),
        cord:     $('wtr-cord'),
        rec:      $('wtr-rec'),
        card1:    $('wtr-card1'),
        card2:    $('wtr-card2'),
        card3:    $('wtr-card3'),
      };

      const build = () => {
        const tl = g.timeline({ defaults: { ease: 'power2.out' } });

        /* reset — cord and rec dot start visible */
        g.set([els.bg, els.dad, els.daughter, els.card1, els.card2, els.card3], { opacity: 0 });
        g.set(els.cord, { opacity: 1 });
        g.set(els.rec,  { opacity: 1 });
        g.set([els.dad, els.daughter, els.bg], { y: 14 });
        g.set([els.card1, els.card2, els.card3], { x: 20 });

        /* background + portraits fade in together */
        tl.to(els.bg,       { opacity: 1, y: 0, duration: 0.5 });
        tl.to(els.dad,      { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
        tl.to(els.daughter, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');

        /* card 1 slides in */
        tl.to(els.card1, { opacity: 1, x: 0, duration: 0.35, ease: 'back.out(1.3)' }, '+=0.15');

        /* card 2 — 0.8s after card 1 */
        tl.to(els.card2, { opacity: 1, x: 0, duration: 0.35, ease: 'back.out(1.3)' }, '+=0.8');

        /* card 3 — 0.8s after card 2 */
        tl.to(els.card3, { opacity: 1, x: 0, duration: 0.35, ease: 'back.out(1.3)' }, '+=0.8');

        /* hold, then loop */
        tl.call(() => {
          setTimeout(() => {
            if (this._tl) this._tl.kill();
            this._tl = build();
          }, 3500);
        }, [], '+=1.8');

        return tl;
      };

      this._tl = build();
      $('wtr-replay').addEventListener('click', () => {
        if (this._tl) this._tl.kill();
        this._tl = build();
      });
    }
  }

  if (!customElements.get('ways-to-record')) {
    customElements.define('ways-to-record', WaysToRecord);
  }
})();
