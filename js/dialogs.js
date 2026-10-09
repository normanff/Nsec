/* Shared dialog lifecycle: focus, Escape, scroll locking and inert background. */
(function () {
  let active = null;
  let returnFocus = null;
  let previousOverflow = '';
  const background = new Map();
  const focusable = 'button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]';

  function close(restoreFocus = true) {
    if (!active) return;
    active.classList.remove('active');
    active.setAttribute('aria-hidden', 'true');
    background.forEach((wasInert, element) => { element.inert = wasInert; });
    background.clear();
    document.body.style.overflow = previousOverflow;
    active = null;
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus();
  }

  function open(element) {
    if (!element || active === element) return;
    const trigger = active ? returnFocus : document.activeElement.closest('#mobile-nav-menu')
      ? document.getElementById('mobile-menu-btn') : document.activeElement;
    close(false);
    returnFocus = trigger;
    previousOverflow = document.body.style.overflow;
    active = element;
    active.classList.add('active');
    active.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    [...document.body.children].filter(child => child !== active && child.tagName !== 'SCRIPT').forEach(child => {
      background.set(child, child.inert);
      child.inert = true;
    });
    // Wait for the visibility transition to apply before moving keyboard focus.
    requestAnimationFrame(() => {
      if (active === element) (element.querySelector(focusable) || element).focus();
    });
  }

  document.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab' || !active) return;
    const controls = [...active.querySelectorAll(focusable)].filter(el => el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); active.focus(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === active)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  document.addEventListener('click', event => {
    if (active && (event.target === active || event.target.closest('[data-close-dialog]'))) close();
  });
  window.NSEC_DIALOG = { open, close };
})();
