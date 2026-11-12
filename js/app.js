(function () {
  document.documentElement.classList.add('js-enabled');
  const menuButton = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-nav-menu');
  function setMenu(open) {
    menu.classList.toggle('hidden', !open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  menuButton.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
      setMenu(false);
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });

})();
