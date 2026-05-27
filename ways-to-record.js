(function () {
  'use strict';

  const FRAME_W = 933.97;
  const FRAME_H = 566.56;

  function injectFonts() {
    if (document.getElementById('sw-fonts')) return;
    const link = document.createElement('link');
    link.id = 'sw-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;1,400&family=Playfair+Display:ital,wght@0,400;1,400&family=EB+Garamond:ital@0;1&display=swap';
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

    .frame {
      position: relative;
      width: ${FRAME_W}px;
      height: ${FRAME_H}px;
      transform-origin: top left;
      background: #f8f4f1;
      overflow: hidden;
    }

    /* ── Heading ── */
    .heading {
      position: absolute;
      top: 48px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'GT America', 'DM Sans', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #1e1e1e;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    /* ── Phone cord ── */
    .phone-cord {
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      width: 760px;
      height: 28px;
      overflow: visible;
    }

    @keyframes cord-wiggle {
      0%   { transform: translateX(-50%) translateY(0px); }
      15%  { transform: translateX(-50%) translateY(-5px); }
      30%  { transform: translateX(-50%) translateY(3px); }
      45%  { transform: translateX(-50%) translateY(-4px); }
      60%  { transform: translateX(-50%) translateY(2px); }
      75%  { transform: translateX(-50%) translateY(-2px); }
      100% { transform: translateX(-50%) translateY(0px); }
    }

    .phone-cord--wiggling {
      animation: cord-wiggle 1.4s ease-in-out;
    }

    /* ── Cards row ── */
    .cards-row {
      position: absolute;
      top: 106px;
      left: 68px;
      display: flex;
      gap: 24px;
    }

    .card {
      width: 250px;
      height: 416px;
      background: #f7ede6;
      border-radius: 18px;
      border: 5px solid #fff;
      box-shadow: 0 4px 25px rgba(190,157,132,0.12);
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }

    /* ── Card video ── */
    .card-video-wrap {
      width: 100%;
      height: 316px;
      overflow: hidden;
      background: #e8d5c4;
    }

    .card-video-wrap video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Daughter video: flip + re-center like the hero */
    #wtr-card2 .card-video-wrap video {
      transform: scaleX(-1);
      object-position: calc(50% + 30px) center;
    }

    /* Empty video placeholder for card3 until a video is provided */
    .card-video-wrap--empty {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-video-wrap--empty::after {
      content: '';
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(200,168,130,0.3);
      box-shadow: 0 0 0 12px rgba(200,168,130,0.12);
    }

    /* ── Card labels ── */
    .card-label {
      position: absolute;
      bottom: 38px;
      left: 0; right: 0;
      text-align: center;
      font-family: 'GT America', 'DM Sans', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #1e1e1e;
      line-height: 1.35;
      padding: 0 12px;
    }

    .card-sublabel {
      position: absolute;
      bottom: 18px;
      left: 0; right: 0;
      text-align: center;
      font-family: 'GT America', 'DM Sans', system-ui, sans-serif;
      font-size: 11px;
      color: #9c826d;
      line-height: 1.4;
      padding: 0 12px;
    }

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

  /* Curly phone-cord SVG path — repeating S-curve loops across 760px */
  function cordPath() {
    let d = 'M 0,14';
    const loopW = 16;
    const loops = Math.ceil(760 / loopW);
    for (let i = 0; i < loops; i++) {
      const x = i * loopW;
      if (i % 2 === 0) {
        d += ` C ${x + 4},2 ${x + 12},2 ${x + loopW},14`;
      } else {
        d += ` C ${x + 4},26 ${x + 12},26 ${x + loopW},14`;
      }
    }
    return d;
  }

  function buildHTML(ap) {
    return `
      <div class="scale-wrap">
        <div class="frame">

          <p class="heading" id="wtr-heading">Ways to record your story</p>

          <!-- Curly phone cord -->
          <svg class="phone-cord" id="wtr-cord"
               viewBox="0 0 760 28" fill="none"
               xmlns="http://www.w3.org/2000/svg"
               preserveAspectRatio="xMidYMid meet">
            <path d="${cordPath()}"
                  stroke="#c8a882" stroke-width="2" stroke-linecap="round"
                  fill="none"/>
          </svg>

          <div class="cards-row">

            <!-- Card 1: Talk with Storyworth — dad2.mp4 -->
            <div class="card" id="wtr-card1">
              <div class="card-video-wrap">
                <video id="wtr-vid1"
                       src="${ap}/dad2.mp4"
                       autoplay muted playsinline>
                </video>
              </div>
              <div class="card-label">Talk with Storyworth</div>
              <div class="card-sublabel">We call and ask the questions</div>
            </div>

            <!-- Card 2: Talk with family — daughter.mp4 -->
            <div class="card" id="wtr-card2">
              <div class="card-video-wrap">
                <video id="wtr-vid2"
                       src="${ap}/daughter.mp4"
                       autoplay muted playsinline>
                </video>
              </div>
              <div class="card-label">Talk with family</div>
              <div class="card-sublabel">Record a conversation together</div>
            </div>

            <!-- Card 3: video to be added -->
            <div class="card" id="wtr-card3">
              <div class="card-video-wrap card-video-wrap--empty" id="wtr-card3-video">
                <!-- swap in a <video> tag once the file is ready -->
              </div>
              <div class="card-label">Record yourself</div>
              <div class="card-sublabel">Speak at your own pace</div>
            </div>

          </div>

          <button class="replay-btn" id="wtr-replay">↺ Replay</button>

        </div>
      </div>
    `;
  }

  class WaysToRecord extends HTMLElement {
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
      const vid1 = shadow.getElementById('wtr-vid1');
      if (vid1) {
        vid1.addEventListener('loadedmetadata', () => { vid1.currentTime = 0; });
        vid1.addEventListener('ended', () => { vid1.currentTime = 0; vid1.play(); });
      }

      const vid2 = shadow.getElementById('wtr-vid2');
      if (vid2) {
        vid2.addEventListener('loadedmetadata', () => { vid2.currentTime = 6; });
        vid2.addEventListener('ended', () => { vid2.currentTime = 6; vid2.play(); });
      }
    }

    _runAnimation(shadow) {
      const g = window.gsap;
      const $ = id => shadow.getElementById(id);

      const els = {
        heading: $('wtr-heading'),
        cord:    $('wtr-cord'),
        card1:   $('wtr-card1'),
        card2:   $('wtr-card2'),
        card3:   $('wtr-card3'),
      };

      const build = () => {
        const tl = g.timeline({ defaults: { ease: 'power2.out' } });

        /* reset */
        g.set(Object.values(els), { opacity: 0 });
        g.set([els.card1, els.card2, els.card3], { y: 22 });
        g.set(els.heading, { y: 6 });
        g.set(els.cord, { scaleX: 0, transformOrigin: 'left center' });

        /* heading */
        tl.to(els.heading, { opacity: 1, y: 0, duration: 0.4 });

        /* cord stretches in from left */
        tl.to(els.cord, {
          opacity: 1, scaleX: 1, duration: 0.7, ease: 'power2.inOut'
        }, '+=0.15');

        /* card 1 */
        tl.to(els.card1, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.3)' }, '+=0.3');

        /* card 2 — 1.5s after card 1 */
        tl.to(els.card2, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.3)' }, '+=1.5');

        /* card 3 — 1.5s after card 2 */
        tl.to(els.card3, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.3)' }, '+=1.5');

        /* cord wiggle after all three cards are in */
        tl.call(() => {
          const cord = els.cord;
          cord.classList.remove('phone-cord--wiggling');
          void cord.offsetWidth; /* force reflow to restart animation */
          cord.classList.add('phone-cord--wiggling');
        }, [], '+=0.4');

        /* hold, then loop */
        tl.call(() => {
          setTimeout(() => {
            if (this._tl) this._tl.kill();
            this._tl = build();
          }, 3500);
        }, [], '+=1.2');

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
