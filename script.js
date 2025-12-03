document.addEventListener('DOMContentLoaded', function () {
  // --- Toggle du menu mobile ---
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');

  if (btn && nav) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      btn.setAttribute('aria-label', expanded ? 'Ouvrir le menu' : 'Fermer le menu');
    });

    // Ferme le menu lorsqu'on clique à l'extérieur (mobile)
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (btn.contains(e.target) || nav.contains(e.target)) return;
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Ouvrir le menu');
    });
  }

  // --- Carousel des packs (points, swipe et resize) ---
  const carousel = document.getElementById('packCarousel');
  const dots = document.querySelectorAll('.dot');
  const carouselContainer = carousel ? carousel.closest('.carousel-container') : null;

  if (!carousel || !dots.length || !carouselContainer) return;

  let currentIndex = 0;
  // On calcule la translation de manière directe en utilisant la position
  // réelle de la slide cible (offsetLeft). Cela évite tout décalage causé
  // par padding/marges/gap ou différence entre largeur du conteneur et
  // largeur effective d'un item.
  function updateCarousel(index) {
    const slides = carousel.querySelectorAll('.pack-item');
    if (!slides.length) return;
    const target = slides[index];
    if (!target) return;

    currentIndex = index;
    // offsetLeft donne la position du slide par rapport à l'élément offsetParent
    // (ici le carousel en flex). C'est la distance exacte à traduire.
    const shift = target.offsetLeft;
    carousel.style.transform = `translateX(-${shift}px)`;

    dots.forEach((dot, i) => {
      if (i === index) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateCarousel(index);
    });
  });

  // Support basic swipe
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
    const slides = carousel.querySelectorAll('.pack-item');
    const slide = slides[currentIndex];
    const swidth = slide ? slide.offsetWidth : carouselContainer.clientWidth;

    if (touchStartX - touchEndX > Math.min(50, swidth / 4) && currentIndex < dots.length - 1) {
      updateCarousel(currentIndex + 1);
    }
    if (touchEndX - touchStartX > Math.min(50, swidth / 4) && currentIndex > 0) {
      updateCarousel(currentIndex - 1);
    }
  }

  // Recalcule la largeur d'une diapositive au redimensionnement
  window.addEventListener('resize', () => {
    // Au redimensionnement, repositionne simplement la vue sur l'index courant
    // (la méthode updateCarousel recalcule target.offsetLeft à la volée).
    updateCarousel(currentIndex);
  });

  // position initiale
  updateCarousel(0);
});
