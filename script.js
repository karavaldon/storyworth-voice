/* Storyworth Voice — Hero animation demo
   Timeline mimics the "call → chapter" story flow.
   Designed to be translated into Webflow Interactions.

   GSAP element map:
   ─────────────────────────────────────────────
   #portrait       Dad's circular photo
   #phone-card     Peach phone card
   #audio-wave     Waveform inside the phone
   #lbl-talk       "Talk with us" label
   #bubble-1       Question bubble
   #connector      Curved arrow
   #lbl-write      "We write a chapter" label
   #chapter-card   Gradient card (right)
   #chapter-page   White paper inside card
   #chapter-title  Serif question heading
   #chapter-body   Garamond body text
   #bubble-2       First response bubble
   #bubble-3       Second response bubble
*/

const els = {
  portrait:     document.getElementById('portrait'),
  phoneCard:    document.getElementById('phone-card'),
  audioWave:    document.getElementById('audio-wave'),
  lblTalk:      document.getElementById('lbl-talk'),
  bubble1:      document.getElementById('bubble-1'),
  connector:    document.getElementById('connector'),
  lblWrite:     document.getElementById('lbl-write'),
  chapterCard:  document.getElementById('chapter-card'),
  chapterPage:  document.getElementById('chapter-page'),
  chapterTitle: document.getElementById('chapter-title'),
  chapterBody:  document.getElementById('chapter-body'),
  bubble2:      document.getElementById('bubble-2'),
  bubble3:      document.getElementById('bubble-3'),
};

function buildTimeline() {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  /* Set everything invisible at start */
  gsap.set(Object.values(els), { opacity: 0 });
  gsap.set([els.portrait, els.phoneCard], { y: 16 });
  gsap.set([els.bubble1, els.bubble2, els.bubble3], { y: 10 });
  gsap.set([els.chapterCard, els.chapterPage, els.chapterTitle, els.chapterBody], { x: 16 });
  gsap.set(els.connector, { scale: 0.6, transformOrigin: 'center center' });

  /* 1. "Talk with us" label */
  tl.to(els.lblTalk, { opacity: 1, duration: 0.4 });

  /* 2. Portrait slides up into view */
  tl.to(els.portrait, { opacity: 1, y: 0, duration: 0.55 }, '-=0.1');

  /* 3. Phone card follows */
  tl.to(els.phoneCard, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3');

  /* 4. Audio wave pulses in */
  tl.to(els.audioWave, { opacity: 1, duration: 0.35 }, '-=0.1');

  /* 5. Question bubble pops up */
  tl.to(els.bubble1, { opacity: 1, y: 0, duration: 0.4 }, '+=0.15');

  /* 6. First response bubble */
  tl.to(els.bubble2, { opacity: 1, y: 0, duration: 0.4 }, '+=0.4');

  /* 7. Arrow connector appears */
  tl.to(els.connector, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, '+=0.2');

  /* 8. "We write a chapter" label */
  tl.to(els.lblWrite, { opacity: 1, duration: 0.35 }, '-=0.15');

  /* 9. Chapter card slides in from right */
  tl.to(els.chapterCard, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' }, '-=0.1');

  /* 10. White page appears */
  tl.to(els.chapterPage, { opacity: 1, x: 0, duration: 0.4 }, '-=0.3');

  /* 11. Chapter title fades in */
  tl.to(els.chapterTitle, { opacity: 1, x: 0, duration: 0.45 }, '-=0.1');

  /* 12. Chapter body text fades in */
  tl.to(els.chapterBody, { opacity: 1, x: 0, duration: 0.5 }, '-=0.15');

  /* 13. Final response bubble */
  tl.to(els.bubble3, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

  return tl;
}

let tl = buildTimeline();

document.getElementById('replay-btn').addEventListener('click', () => {
  tl.kill();
  tl = buildTimeline();
});
