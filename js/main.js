const header = document.getElementById('header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
}

function closeMenu() {
  header.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
}

menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hero__content, .about__intro > h2, .about__intro > p, .about__values article, .budget, .service-panel > h2, .service-grid article, .service-divider h2, .clients > h2, .clients > p, .units-intro, .unit-description, .units-gallery__column img, .onboard h2, .onboard__services > div, .units-budget > div, .info-resources__intro, .info-card, .info-budget > div, .faq, .info-contact__panel').forEach((element) => revealObserver.observe(element));
}

const contactForm = document.querySelector('.info-contact form');

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector('[role="status"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    submitButton.disabled = true;
    status.textContent = '';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Error al enviar');
      contactForm.reset();
      status.textContent = '¡Gracias! Tu consulta se envió correctamente.';
    } catch (error) {
      status.textContent = 'No pudimos enviar tu consulta. Por favor, intentá nuevamente.';
    } finally {
      submitButton.disabled = false;
    }
  });
}
