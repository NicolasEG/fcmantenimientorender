document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('open', !open);
    header?.classList.toggle('menu-active', !open);
    document.body.style.overflow = open ? '' : 'hidden';
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    header?.classList.remove('menu-active');
    document.body.style.overflow = '';
  }));

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .12, rootMargin: '0px 0px -40px' });
    reveals.forEach(element => observer.observe(element));
  } else reveals.forEach(element => element.classList.add('visible'));

  const parallax = document.querySelector('[data-parallax]');
  const parallaxSection = document.querySelector('[data-parallax-section]');
  if (parallax && parallaxSection && !reducedMotion) {
    let ticking = false;
    const moveParallax = () => {
      if (innerWidth > 640) {
        parallax.style.removeProperty('--mobile-parallax');
        ticking = false;
        return;
      }
      const rect = parallaxSection.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      const offset = (progress - .5) * 340;
      parallax.style.setProperty('--mobile-parallax', `${offset}px`);
      ticking = false;
    };
    const requestMove = () => {
      if (!ticking) {
        requestAnimationFrame(moveParallax);
        ticking = true;
      }
    };
    window.addEventListener('scroll', requestMove, { passive: true });
    window.addEventListener('resize', requestMove, { passive: true });
    moveParallax();
  }

  const track = document.querySelector('[data-carousel]');
  if (track) {
    track.innerHTML += track.innerHTML;
    track.addEventListener('mouseenter', () => track.classList.add('is-paused'));
    track.addEventListener('mouseleave', () => track.classList.remove('is-paused'));
  }

  const modal = document.querySelector('[data-lightbox-modal]');
  if (modal && track) {
    const originalCards = [...track.querySelectorAll('.work-card')].slice(0, 7);
    const modalImage = modal.querySelector('[data-lightbox-image]');
    const modalCaption = modal.querySelector('[data-lightbox-caption]');
    let currentIndex = 0;
    const showImage = index => {
      currentIndex = (index + originalCards.length) % originalCards.length;
      const card = originalCards[currentIndex];
      const image = card.querySelector('img');
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modalCaption.textContent = card.querySelector('strong')?.textContent || image.alt;
    };
    const openModal = card => {
      const src = card.querySelector('img').getAttribute('src');
      currentIndex = originalCards.findIndex(item => item.querySelector('img').getAttribute('src') === src);
      showImage(Math.max(0, currentIndex));
      modal.showModal();
      document.body.style.overflow = 'hidden';
    };
    track.querySelectorAll('.work-card').forEach(card => {
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Ampliar ${card.querySelector('img').alt}`);
      card.addEventListener('pointerdown', () => track.classList.add('is-paused'));
      card.addEventListener('click', () => openModal(card));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openModal(card);
        }
      });
    });
    const closeModal = () => {
      modal.close();
      document.body.style.overflow = '';
    };
    modal.querySelector('[data-lightbox-close]').addEventListener('click', closeModal);
    modal.querySelector('[data-lightbox-prev]').addEventListener('click', () => showImage(currentIndex - 1));
    modal.querySelector('[data-lightbox-next]').addEventListener('click', () => showImage(currentIndex + 1));
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    modal.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    });
    modal.addEventListener('close', () => { document.body.style.overflow = ''; });
  }

  document.querySelectorAll('[data-year]').forEach(element => element.textContent = new Date().getFullYear());
  const whatsappIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.075-.792.372-.273.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.438-9.887 9.888-9.887a9.82 9.82 0 0 1 7.021 2.91 9.82 9.82 0 0 1 2.9 7.021c-.003 5.45-4.44 9.889-9.926 9.889m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/></svg>';
  document.querySelectorAll('.whatsapp-float span').forEach(element => element.innerHTML = whatsappIcon);
  const form = document.querySelector('[data-form]');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelector('[data-form-status]').textContent = '¡Gracias! Tu consulta quedó preparada. Conectá este formulario a tu correo o WhatsApp para recibirla.';
    form.reset();
  });
});
