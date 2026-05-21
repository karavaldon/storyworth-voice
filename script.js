/* Storyworth Voice LP — minimal JS, animation hooks added later */

/* Question card carousel */
(function () {
  const cards = document.querySelector('.question-cards');
  if (!cards) return;

  const questions = [
    'Did you have any pets as a child?',
    'What was the happiest day of your life?',
    'What was your favorite subject in school?',
    'Where did you grow up, and what was it like?',
    'What is a lesson life has taught you?',
    'What do you most want your family to remember about you?',
  ];

  let currentIndex = 0;

  function getCardTexts() {
    return cards.querySelectorAll('.question-card__text');
  }

  document.querySelector('.carousel-btn--prev')?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + questions.length) % questions.length;
    updateCards();
  });

  document.querySelector('.carousel-btn--next')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % questions.length;
    updateCards();
  });

  function updateCards() {
    const texts = getCardTexts();
    texts[0].textContent = questions[currentIndex % questions.length];
    texts[1].textContent = questions[(currentIndex + 1) % questions.length];
  }
})();
