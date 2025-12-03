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
  const carouselContainer = carousel ? carousel.closest('.carousel-container') : null;

  if (!carousel || !dots.length || !carouselContainer) return;

  let currentIndex = 0;
  // Trouve un élément de slide et utilise sa largeur réelle (offsetWidth)
  // afin de respecter la taille des items définie en CSS.
  let slideEl = carousel.querySelector('.pack-item');
  let slideWidth = slideEl ? slideEl.offsetWidth : carouselContainer.clientWidth;

  // Met à jour la position en pixels pour que le déplacement corresponde
  // à la largeur visible du conteneur (évite les pourcentages relatifs
  // à la largeur du track qui faussent le calcul).
  function updateCarousel(index) {
    currentIndex = index;
    const shift = index * slideWidth; // utilise la largeur réelle d'un item
    carousel.style.transform = `translateX(-${shift}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
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

  // Recalcule la largeur du conteneur au redimensionnement
  window.addEventListener('resize', () => {
    // Recalculer la largeur d'une diapositive après redimensionnement
    slideEl = carousel.querySelector('.pack-item');
    slideWidth = slideEl ? slideEl.offsetWidth : carouselContainer.clientWidth;
    updateCarousel(currentIndex);
  });

  // position initiale
  updateCarousel(0);
});
