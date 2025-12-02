document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');

  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');

    // optional: change aria-label for clarity
    btn.setAttribute('aria-label', expanded ? 'Ouvrir le menu' : 'Fermer le menu');
  });

  // Close menu when clicking outside (mobile)
  document.addEventListener('click', function (e) {
    if (!nav.classList.contains('open')) return;
    if (btn.contains(e.target) || nav.contains(e.target)) return;
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Ouvrir le menu');
  });
});
