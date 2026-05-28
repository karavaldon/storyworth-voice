/* Storyworth Voice — Hero animation
   Sequence:
   1.  "Talk with us" + audio wave
   8.  Screen + glow
   2.  "Or talk with family"
   3.  Phone card + dad portrait (video)
   5.  Daughter portrait (video, flipped)
   6.  Chat 1 → Chat 2 → Chat 3
   7.  Arrow connector
   8.  Chapter card (screen)
   9.  White page
   10. Chapter title
   11. Story body — typewriter with blinking cursor
*/

const els = {
  glow:       document.getElementById('glow'),
  portrait:   document.getElementById('portrait'),
  daughter:   document.getElementById('daughter'),
  lblTalk:    document.getElementById('lbl-talk'),
  lblFamily:  document.getElementById('lbl-family'),
  phoneCard:  document.getElementById('phone-card'),
  audioWave:  document.getElementById('audio-wave'),
  bubble1:        document.getElementById('bubble-1'),
  bubble2:        document.getElementById('bubble-2'),
  bubble3:        document.getElementById('bubble-3'),
  connector:      document.getElementById('connector'),
  lblWrite:       document.getElementById('lbl-write'),
  chapterCard:    document.getElementById('chapter-card'),
  chapterPage:    document.getElementById('chapter-page'),
  chapterTitle:   document.getElementById('chapter-title'),
  chapterBody:    document.getElementById('chapter-body'),
};

// Story text: array of paragraphs, each paragraph is array of {text, em?} segments
const storyText = [
  [
    { text: 'Oh, yes. I remember thinking — I have no idea what I’m doing. But I also just knew I’d do anything for her. They put her in my arms and I just looked down at her and thought: ' },
    { text: 'well, that’s it. That’s my whole life right there.', em: true },
  ],
  [
    { text: 'I’d always heard people say your whole life changes. I thought I understood what that meant. I didn’t. You can’t, until someone puts a baby in your arms and she opens her eyes and looks at you like you’re the only thing in the world.' },
  ],
];


function typeWriter(container, paragraphs, msPerChar) {
  container.innerHTML = '';

  // Flatten into a sequence of typed characters + paragraph-break markers
  const chars = [];
  paragraphs.forEach((segs, pi) => {
    if (pi > 0) chars.push({ newPara: true });
    segs.forEach(seg => {
      [...seg.text].forEach(ch => chars.push({ ch, em: !!seg.em }));
    });
  });

  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';

  let i = 0;
  let currentP = null;
  let currentSpan = null;
  let currentEm = null;

  // Bootstrap first paragraph
  currentP = document.createElement('p');
  container.appendChild(currentP);
  currentP.appendChild(cursor);

  function tick() {
    if (i >= chars.length) return; // finished — cursor keeps blinking

    const item = chars[i++];

    if (item.newPara) {
      // Start a new paragraph, pause slightly longer between paragraphs
      currentP = document.createElement('p');
      container.appendChild(currentP);
      currentSpan = null;
      currentEm = null;
      currentP.appendChild(cursor);
      setTimeout(tick, msPerChar * 10);
      return;
    }

    // Create a new span/em when the style changes
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

function buildTimeline() {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // Start everything hidden
  gsap.set(Object.values(els), { opacity: 0 });
  gsap.set([els.portrait, els.daughter, els.phoneCard], { y: 16 });
  gsap.set([els.lblTalk, els.lblFamily], { y: 6 });
  gsap.set([els.bubble1, els.bubble2, els.bubble3], { y: 8 });
  gsap.set([els.chapterCard, els.chapterPage, els.chapterTitle], { x: 16 });
  gsap.set(els.connector, { scale: 0.6, transformOrigin: 'center center' });

  // 1. "Have a conversation" + audio wave
  tl.to(els.lblTalk,   { opacity: 1, y: 0, duration: 0.3 });
  tl.to(els.audioWave, { opacity: 1, duration: 0.3 }, '<');

  // 2. "with us or with family"
  tl.to(els.lblFamily, { opacity: 1, y: 0, duration: 0.25 }, '+=0.2');

  // 3. Phone card, then dad + daughter close behind
  tl.to(els.phoneCard, { opacity: 1, y: 0, duration: 0.45 }, '+=0.2');
  tl.to(els.portrait,  { opacity: 1, y: 0, duration: 0.45 }, '-=0.35');
  tl.to(els.daughter,  { opacity: 1, y: 0, duration: 0.45 }, '<+=0.05');

  // 6. Chat 1 → 2 → 3
  tl.to(els.bubble1, { opacity: 1, y: 0, duration: 0.22 }, '+=0.15');
  tl.to(els.bubble2, { opacity: 1, y: 0, duration: 0.22 }, '+=0.22');
  tl.to(els.bubble3, { opacity: 1, y: 0, duration: 0.22 }, '+=0.22');

  // 7. Arrow connector
  tl.to(els.connector, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.5)' }, '+=0.22');

  // 8. "We write a chapter" label + chapter card (screen) + glow
  tl.to(els.lblWrite,    { opacity: 1, duration: 0.3 }, '-=0.1');
  tl.to(els.chapterCard, { opacity: 1, x: 0, duration: 0.5 }, '-=0.15');
  tl.to(els.chapterPage, { opacity: 1, x: 0, duration: 0.5 }, '<');
  tl.to(els.glow,        { opacity: 0.6, duration: 0.7 }, '<');

  // 10. Chapter title
  tl.to(els.chapterTitle, { opacity: 1, x: 0, duration: 0.4 }, '+=0.12');

  // 11. Story — typewriter with cursor
  tl.call(() => {
    gsap.set(els.chapterBody, { opacity: 1 });
    typeWriter(els.chapterBody, storyText, 22);
  }, [], '+=0.25');

  return tl;
}

let tl = buildTimeline();

document.getElementById('replay-btn').addEventListener('click', () => {
  tl.kill();
  tl = buildTimeline();
});

// Dad video: loop starting from 3s
const dadVideo = document.getElementById('dad-video');
const DAD_LOOP_START = 3;

dadVideo.addEventListener('loadedmetadata', () => {
  dadVideo.currentTime = DAD_LOOP_START;
});
dadVideo.addEventListener('ended', () => {
  dadVideo.currentTime = DAD_LOOP_START;
  dadVideo.play();
});

// Daughter video: loop starting from 6s
const daughterVideo = document.getElementById('daughter-video');
const DAUGHTER_LOOP_START = 6;

daughterVideo.addEventListener('loadedmetadata', () => {
  daughterVideo.currentTime = DAUGHTER_LOOP_START;
});
daughterVideo.addEventListener('ended', () => {
  daughterVideo.currentTime = DAUGHTER_LOOP_START;
  daughterVideo.play();
});
