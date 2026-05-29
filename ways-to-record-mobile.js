(function () {
  'use strict';

  const FRAME_W = 400;
  const FRAME_H = 681;

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
    :host { display: block; width: 100%; background: transparent; }

    .scale-wrap {
      position: relative;
      width: 100%;
      overflow: hidden;
      background: none;
    }

    .frame {
      position: relative;
      width: ${FRAME_W}px;
      height: ${FRAME_H}px;
      transform-origin: top left;
      background: none;
    }

    /* ── Background photo ── */
    .bg-image {
      position: absolute;
      left: -0.5px;
      top: 395.41px;
      width: 401px;
      height: auto;
    }

    /* ── Dad portrait: x=25.38, y=28.71, 228.94×228.94, r=20 ── */
    .dad-wrap {
      position: absolute;
      left: 25.38px;
      top: 28.71px;
      width: 228.94px;
      height: 228.94px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 0 0 4px #fff, 0 4px 18px rgba(0,0,0,0.12);
      z-index: 4;
    }
    .dad-wrap video {
      width: 100%; height: 100%; object-fit: cover;
      transform: scale(1.3);
      object-position: calc(50% + 24px) center;
    }

    /* ── Daughter portrait: x=213.41, y=151.3, 161.21×161.21, r=20 ── */
    .daughter-wrap {
      position: absolute;
      left: 213.41px;
      top: 151.3px;
      width: 161.21px;
      height: 161.21px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 0 0 3px #fff, 0 4px 18px rgba(0,0,0,0.12);
      z-index: 3;
    }
    .daughter-wrap video {
      width: 100%; height: 100%; object-fit: cover;
      transform: scaleX(-1);
      object-position: calc(50% + 30px) center;
    }

    /* ── Cards — all stacked at the same position, one visible at a time ── */
    .card {
      position: absolute;
      left: 74px;
      top: 298px;
      width: 252px;
      height: 73px;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(238, 231, 226, 0.15);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 5;
    }
    .card img {
      width: 100%; height: 100%;
    }

    /* ── Progress bar inside each card ── */
    .card-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: #3D2D22;
      transform: scaleX(0);
      transform-origin: left center;
      z-index: 2;
    }

    /* ── Phone cord: x=264.54, y=47.31, 82.23×98.79 ── */
    .cord {
      position: absolute;
      left: 266.54px;
      top: 44.31px;
      width: 82.23px;
      height: 98.79px;
      z-index: 6;
    }

    /* ── Recording dot: x=202, y=48.54, 33.18×33.18 ── */
    .rec-dot {
      position: absolute;
      left: 202px;
      top: 48.54px;
      width: 33.18px;
      height: 33.18px;
      border-radius: 50%;
      background: #F6734D;
      border: 3px solid #fff;
      z-index: 10;
    }
    @keyframes rec-glow {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(246,115,77,0.5); }
      50%       { opacity: 0.6; box-shadow: 0 0 0 8px rgba(246,115,77,0); }
    }
    .rec-dot { animation: rec-glow 1.4s ease-in-out infinite; }
  `;

  function buildHTML(ap, dadSrc, daughterSrc) {
    return `
      <div class="scale-wrap">
        <div class="frame">

          <img class="bg-image" id="wtrm-bg" src="${ap}/mom-dad-mobile.png" alt="" />

          <div class="dad-wrap" id="wtrm-dad">
            <video id="wtrm-vid-dad" src="${dadSrc}" autoplay muted playsinline></video>
          </div>

          <div class="daughter-wrap" id="wtrm-daughter">
            <video id="wtrm-vid-daughter" src="${daughterSrc}" autoplay muted playsinline></video>
          </div>

          <div class="card" id="wtrm-card1">
            <img src="${ap}/card1.png" alt="Family Calls" />
            <div class="card-progress"></div>
          </div>
          <div class="card" id="wtrm-card2">
            <img src="${ap}/card2.png" alt="Magic Interviews" />
            <div class="card-progress"></div>
          </div>
          <div class="card" id="wtrm-card3">
            <img src="${ap}/card3.png" alt="Story Calls" />
            <div class="card-progress"></div>
          </div>

          <img class="cord" id="wtrm-cord" src="${ap}/wtr-cord-mobile-v2.svg" alt="" />

          <div class="rec-dot" id="wtrm-rec"></div>
        </div>
      </div>
    `;
  }

  class WaysToRecordMobile extends HTMLElement {
    connectedCallback() {
      injectFonts();
      const ap = this.getAttribute('asset-path') || CDN;
      const dadSrc = this.getAttribute('dad-src') || `${ap}/dad3.mp4`;
      const daughterSrc = this.getAttribute('daughter-src') || `${ap}/daughter.mp4`;
      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = CSS;
      shadow.appendChild(style);

      const tmp = document.createElement('div');
      tmp.innerHTML = buildHTML(ap, dadSrc, daughterSrc);
      while (tmp.firstChild) shadow.appendChild(tmp.firstChild);

      this._setupVideos(shadow);
      this._ro = new ResizeObserver(() => this._updateScale(shadow));
      this._ro.observe(this);
      this._updateScale(shadow);

      loadGSAP(() => {
        this._io = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (!this._tl) this._runAnimation(shadow);
            } else {
              if (this._cardTl) { this._cardTl.kill(); this._cardTl = null; }
              if (this._tl) { this._tl.kill(); this._tl = null; }
            }
          });
        }, { threshold: 0.3 });
        this._io.observe(this);
      });
    }

    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
      if (this._tl) this._tl.kill();
      if (this._cardTl) this._cardTl.kill();
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
      const dad = shadow.getElementById('wtrm-vid-dad');
      dad.addEventListener('loadedmetadata', () => { dad.currentTime = 13; });
      dad.addEventListener('ended', () => { dad.currentTime = 13; dad.play(); });

      const daughter = shadow.getElementById('wtrm-vid-daughter');
      daughter.addEventListener('loadedmetadata', () => { daughter.currentTime = 6; });
      daughter.addEventListener('ended', () => { daughter.currentTime = 6; daughter.play(); });
    }

    _runAnimation(shadow) {
      const g = window.gsap;
      const $ = id => shadow.getElementById(id);

      const els = {
        bg:       $('wtrm-bg'),
        dad:      $('wtrm-dad'),
        daughter: $('wtrm-daughter'),
        rec:      $('wtrm-rec'),
        card1:    $('wtrm-card1'),
        card2:    $('wtrm-card2'),
        card3:    $('wtrm-card3'),
      };

      const cards = [els.card1, els.card2, els.card3];
      const bars = cards.map(c => c.querySelector('.card-progress'));

      const CARD_DURATION = 3;
      const PUSH_DUR = 0.3;
      const FADE = 0.2;
      const CARD_W = 252;

      /* ── intro: portraits + bg fade in once ── */
      const intro = g.timeline({ defaults: { ease: 'power2.out' } });
      g.set([els.bg, els.dad, els.daughter, els.rec,
             els.card1, els.card2, els.card3], { opacity: 0 });
      g.set([els.dad, els.daughter, els.bg, els.rec], { y: 14 });
      g.set(cards, { x: CARD_W });
      g.set(bars, { scaleX: 0 });

      intro.to(els.dad,      { opacity: 1, y: 0, duration: 0.5 });
      intro.to(els.rec,      { opacity: 1, y: 0, duration: 0.5 }, '-=0.5');
      intro.to(els.daughter, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');
      intro.to(els.bg,       { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

      /* ── card loop — cycles 1→2→3→1→2→3 continuously ── */
      const cycleCard = (idx) => {
        const card = cards[idx];
        const bar  = bars[idx];

        const tl = g.timeline({ defaults: { ease: 'power2.out' } });
        g.set(card, { x: CARD_W });
        tl.to(card, { opacity: 1, x: 0, duration: PUSH_DUR, ease: 'power2.out' });
        tl.to(bar, { scaleX: 1, duration: CARD_DURATION, ease: 'none' }, '+=0.05');
        tl.to(card, { x: -CARD_W, opacity: 0, duration: PUSH_DUR, ease: 'power2.in' });
        tl.set(bar, { scaleX: 0 });
        tl.call(() => { cycleCard((idx + 1) % 3); });

        this._cardTl = tl;
        return tl;
      };

      intro.call(() => { cycleCard(0); }, [], '+=0.15');
      this._tl = intro;
    }
  }

  if (!customElements.get('ways-to-record-mobile-v2')) {
    customElements.define('ways-to-record-mobile-v2', WaysToRecordMobile);
  }
})();
