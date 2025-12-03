document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');

  if (btn && nav) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      btn.setAttribute('aria-label', expanded ? 'Ouvrir le menu' : 'Fermer le menu');
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (btn.contains(e.target) || nav.contains(e.target)) return;
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Ouvrir le menu');
    });
  }

  const carousel = document.getElementById('packCarousel');
  const dots = document.querySelectorAll('.dot');

  if (!carousel || !dots.length) return;

  let currentIndex = 0;

  function updateCarousel(index) {
    currentIndex = index;
    carousel.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateCarousel(index);
    });
  });

  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchStartX - touchEndX > 50 && currentIndex < dots.length - 1) {
      updateCarousel(currentIndex + 1);
    }
    if (touchEndX - touchStartX > 50 && currentIndex > 0) {
      updateCarousel(currentIndex - 1);
    }
  }
});
