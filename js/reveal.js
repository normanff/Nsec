(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const targets = document.querySelectorAll([
    '.hero-copy', '.demo-section > div', '.gallery-heading', '.screen-card',
    '.services .section-heading', '.pillars article', '.scope-section > div',
    '.launch-notice', '.contact-layout > div', '.installation-guide > section'
  ].join(', '));

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      if (motion.matches || element.matches(':focus-within')) continue;

      // Only animate visible content. The HTML stays readable before initialization.
      const animation = element.animate([
        {opacity: 0.55, transform: 'translateY(12px)'},
        {opacity: 1, transform: 'translateY(0)'}
      ], {duration: 440, easing: 'cubic-bezier(.2,.75,.25,1)'});
      running.add(animation);
      animation.onfinish = animation.oncancel = () => running.delete(animation);
    }
  }, {rootMargin: '0px 0px -12px 0px'});

  targets.forEach(target => observer.observe(target));
  motion.addEventListener('change', () => {
    if (motion.matches) running.forEach(animation => animation.cancel());
  });
})();
