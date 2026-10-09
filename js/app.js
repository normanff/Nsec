/**
 * NSEC - Core Application Orchestrator
 * Dynamic rendering, article reader modal & scope calculator engine
 */

(function () {
  function initApp() {
    renderServices();
    renderWorkflow();
    renderAttackChain();
    renderSurfaces();
    renderMethodologies();
    renderArticles();
    setupHeaderScroll();
    setupMobileMenu();
    setupScrollAnimations();
    setupSmoothScroll();
    setupArticleModal();
    setupScopeCalculator();
    
    // Initialize Lucide icons if available
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // 1. Render Services
  function renderServices() {
    const container = document.getElementById('services-grid');
    if (!container || !window.NSEC_DATA) return;

    container.innerHTML = window.NSEC_DATA.services.map(svc => `
      <div class="glass-panel p-6 sm:p-8 flex flex-col justify-between group hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(255,59,48,0.08)] transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
            <i data-lucide="${svc.icon}" class="w-6 h-6"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">${svc.title}</h3>
          <p class="text-gray-400 text-sm leading-relaxed mb-6">${svc.description}</p>
        </div>
        <div class="pt-4 border-t border-white/5 flex items-center justify-between">
          <span class="font-mono text-xs text-gray-500 group-hover:text-red-400/80 transition-colors">${svc.techTag}</span>
          <span class="text-gray-600 group-hover:text-red-400 group-hover:translate-x-1 transition-all">→</span>
        </div>
      </div>
    `).join('');
  }

  // 2. Render Workflow Timeline
  function renderWorkflow() {
    const container = document.getElementById('workflow-container');
    if (!container || !window.NSEC_DATA) return;

    container.innerHTML = window.NSEC_DATA.workflow.map((item, idx) => `
      <div class="relative flex-1 glass-panel p-6 sm:p-8 hover:border-red-500/30 transition-all duration-300 group">
        <div class="font-mono text-3xl sm:text-4xl font-extrabold text-red-500/30 group-hover:text-red-400 transition-colors mb-4">${item.step}</div>
        <h3 class="text-lg sm:text-xl font-bold text-white mb-3">${item.title}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">${item.description}</p>
        ${idx < window.NSEC_DATA.workflow.length - 1 ? `
          <div class="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border border-red-500/30 text-red-400 text-xs flex items-center justify-center z-10">
            ›
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  // 3. Render Attack Chain Stages
  function renderAttackChain() {
    const container = document.getElementById('attack-chain-grid');
    if (!container || !window.NSEC_DATA) return;

    container.innerHTML = window.NSEC_DATA.attackChain.map(stg => `
      <div class="glass-panel p-6 border-l-2 border-l-red-500/40 hover:border-l-red-400 hover:bg-white/[0.02] transition-all">
        <div class="flex items-center gap-3 mb-2">
          <span class="font-mono text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">${stg.stage}</span>
          <h4 class="text-base font-bold text-white">${stg.name}</h4>
        </div>
        <p class="text-xs text-gray-400 leading-relaxed">${stg.detail}</p>
      </div>
    `).join('');
  }

  // 4. Render Tested Surfaces Grid
  function renderSurfaces() {
    const container = document.getElementById('surfaces-grid');
    if (!container || !window.NSEC_DATA) return;

    container.innerHTML = window.NSEC_DATA.surfaces.map(surf => `
      <div class="glass-panel p-5 flex items-start gap-4 group hover:border-red-500/40 hover:bg-red-500/[0.02] transition-all duration-300">
        <div class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-400 group-hover:border-red-500/40 group-hover:scale-105 transition-all">
          <i data-lucide="${surf.icon}" class="w-5 h-5"></i>
        </div>
        <div>
          <h4 class="text-sm font-bold text-white group-hover:text-red-400 transition-colors">${surf.name}</h4>
          <p class="text-xs text-gray-500 font-mono mt-1">${surf.tag}</p>
        </div>
      </div>
    `).join('');
  }

  // 5. Render Methodologies
  function renderMethodologies() {
    const container = document.getElementById('methodologies-grid');
    if (!container || !window.NSEC_DATA) return;

    container.innerHTML = window.NSEC_DATA.methodologies.map(m => `
      <div class="glass-panel p-6 text-center hover:border-red-500/30 transition-all">
        <div class="font-mono text-lg font-extrabold text-red-400 mb-1">${m.name}</div>
        <div class="text-xs text-gray-400">${m.desc}</div>
      </div>
    `).join('');
  }

  // 6. Render Security Lab Articles
  function renderArticles() {
    const container = document.getElementById('articles-grid');
    if (!container || !window.NSEC_DATA) return;

    container.innerHTML = window.NSEC_DATA.articles.map(art => `
      <article data-article-id="${art.id}" class="article-card glass-panel p-6 sm:p-8 flex flex-col justify-between group hover:border-red-500/40 cursor-pointer transition-all duration-300">
        <div>
          <div class="flex items-center justify-between text-xs font-mono text-gray-500 mb-4">
            <span class="text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20">${art.tag}</span>
            <span>${art.readTime}</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-3 group-hover:text-red-400 transition-colors leading-snug">${art.title}</h3>
          <p class="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">${art.excerpt}</p>
        </div>
        <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>${art.date}</span>
          <button type="button" class="article-open text-red-400 text-left" aria-label="Ler artigo: ${art.title}">Ler artigo →</button>
        </div>
      </article>
    `).join('');

    // Rebind article clicks
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.articleId;
        const art = window.NSEC_DATA.articles.find(a => a.id === id);
        if (art) openArticleModal(art);
      });
    });
  }

  // Security Lab Article Reader Modal
  function setupArticleModal() {
    const modal = document.getElementById('article-modal');
    const closeBtn = document.getElementById('btn-close-article-modal');
    if (!modal) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', closeArticleModal);
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeArticleModal();
    });
  }

  function openArticleModal(art) {
    const modal = document.getElementById('article-modal');
    const tagEl = document.getElementById('article-modal-tag');
    const titleEl = document.getElementById('article-modal-title');
    const metaEl = document.getElementById('article-modal-meta');
    const bodyEl = document.getElementById('article-modal-body');

    if (!modal) return;

    if (tagEl) tagEl.innerText = art.tag;
    if (titleEl) titleEl.innerText = art.title;
    if (metaEl) metaEl.innerText = `${art.date} • ${art.readTime} • Publicação NSEC Security Lab`;
    if (bodyEl) bodyEl.innerHTML = art.fullContent || `<p>${art.excerpt}</p>`;

    window.NSEC_DIALOG.open(modal);
  }

  function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    window.NSEC_DIALOG.close();
  }

  // Interactive Scope & Duration Estimator Widget
  function setupScopeCalculator() {
    const webInput = document.getElementById('calc-web-count');
    const apiInput = document.getElementById('calc-api-count');
    const cloudInput = document.getElementById('calc-cloud-count');
    const resultDays = document.getElementById('calc-result-days');
    const resultComplexity = document.getElementById('calc-result-complexity');

    if (!webInput || !apiInput || !cloudInput || !resultDays) return;

    function updateEstimate() {
      const inputs = [webInput, apiInput, cloudInput];
      if (inputs.some(input => input.value === '' || !input.validity.valid)) {
        resultDays.innerText = 'Revise as quantidades';
        resultComplexity.innerText = 'Use números inteiros dentro dos limites de cada campo.';
        return;
      }
      const [web, api, cloud] = inputs.map(input => Number(input.value));
      if (web + api + cloud === 0) {
        resultDays.innerText = 'Selecione pelo menos um ativo';
        resultComplexity.innerText = 'Adicione os ambientes que deseja avaliar.';
        return;
      }

      const totalScore = (web * 3) + (api * 2) + (cloud * 4);

      let days = '3 a 5 dias úteis';
      let complexity = 'Padrão (Escopo Médio)';

      if (totalScore <= 4) {
        days = '2 a 4 dias úteis';
        complexity = 'Essencial (Escopo Focalizado)';
      } else if (totalScore > 4 && totalScore <= 15) {
        days = '5 a 8 dias úteis';
        complexity = 'Avançado (Multi-Camadas)';
      } else {
        days = '10 a 15 dias úteis';
        complexity = 'Amplo (Múltiplos Ambientes)';
      }

      resultDays.innerText = days;
      if (resultComplexity) resultComplexity.innerText = complexity;
    }

    [webInput, apiInput, cloudInput].forEach(inp => {
      inp.addEventListener('input', updateEstimate);
    });

    updateEstimate();
  }

  // Header Scroll Effect
  function setupHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Navigation Menu Toggle
  function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('mobile-nav-menu');
    if (!toggleBtn || !navMenu) return;

    function setOpen(open) {
      navMenu.classList.toggle('hidden', !open);
      toggleBtn.setAttribute('aria-expanded', String(open));
      toggleBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    toggleBtn.addEventListener('click', () => setOpen(navMenu.classList.contains('hidden')));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !navMenu.classList.contains('hidden')) { setOpen(false); toggleBtn.focus(); }
    });
    navMenu.querySelector('button')?.addEventListener('click', () => setOpen(false));

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setOpen(false);
      });
    });
  }

  // IntersectionObserver for scroll animations
  function setupScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-6');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700', 'ease-out');
      observer.observe(el);
    });
  }

  // Smooth scroll for anchor links
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
          if (href === '#conteudo') target.focus({ preventScroll: true });
          history.replaceState(null, '', href);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
