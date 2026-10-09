/**
 * NSEC - SaaS Dashboard Preview Logic & Interactive Vulnerability Inspector
 * Handles table filtering, tab switching & technical PoC drawer view
 */

(function () {
  let currentFilter = 'All';
  let searchQuery = '';

  function initDashboard() {
    renderVulnerabilities();
    setupFilterButtons();
    setupSearchInput();
    setupVulnerabilityDrawer();
  }

  function renderVulnerabilities() {
    const tableBody = document.getElementById('saas-table-body');
    if (!tableBody || !window.NSEC_DATA) return;

    const items = window.NSEC_DATA.saasMock.vulnerabilities.filter(item => {
      let matchesFilter = true;
      if (currentFilter === 'Open') matchesFilter = item.status === 'Open';
      else if (currentFilter === 'In remediation') matchesFilter = item.status === 'In remediation';
      else if (currentFilter === 'Resolved') matchesFilter = item.status === 'Resolved';

      let matchesSearch = true;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        matchesSearch = item.title.toLowerCase().includes(q) ||
                        item.asset.toLowerCase().includes(q) ||
                        item.id.toLowerCase().includes(q) ||
                        item.cwe.toLowerCase().includes(q);
      }

      return matchesFilter && matchesSearch;
    });

    if (items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-8 text-gray-500 font-mono text-sm">
            Nenhuma vulnerabilidade encontrada para os filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = items.map(item => {
      const sevClass = item.severity === 'Critical' ? 'sev-critical' :
                       item.severity === 'High' ? 'sev-high' :
                       item.severity === 'Medium' ? 'sev-medium' : 'sev-low';

      let statusBadge = '';
      if (item.status === 'Open') {
        statusBadge = `<span class="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20"><span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Aberto</span>`;
      } else if (item.status === 'In remediation') {
        statusBadge = `<span class="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Em Remediação</span>`;
      } else {
        statusBadge = `<span class="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Resolvido</span>`;
      }

      return `
        <tr data-vuln-id="${item.id}" class="vuln-row group cursor-pointer hover:bg-emerald-500/[0.04] transition-colors">
          <td class="font-mono text-xs text-gray-400 font-semibold group-hover:text-emerald-400 transition-colors"><button type="button" aria-label="Inspecionar ${item.id}" class="underline underline-offset-4">${item.id}</button></td>
          <td>
            <div class="font-medium text-gray-200 group-hover:text-white transition-colors flex items-center gap-2">
              <span>${item.title}</span>
              <span class="text-[10px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Ver PoC →</span>
            </div>
            <div class="text-xs text-gray-500 font-mono mt-0.5">${item.cwe} • CVSS ${item.cvss}</div>
          </td>
          <td class="font-mono text-xs text-emerald-400/90">${item.asset}</td>
          <td><span class="sev-pill ${sevClass}">${item.severity}</span></td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');

    // Rebind row click listeners
    tableBody.querySelectorAll('.vuln-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.vulnId;
        const item = window.NSEC_DATA.saasMock.vulnerabilities.find(v => v.id === id);
        if (item) openVulnDrawer(item);
      });
    });
  }

  function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.saas-filter-btn');
    filterButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === currentFilter));
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('bg-red-500/20', 'text-red-400', 'border-red-500/40');
          b.classList.add('bg-white/5', 'text-gray-400', 'border-white/10');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.remove('bg-white/5', 'text-gray-400', 'border-white/10');
        btn.classList.add('bg-red-500/20', 'text-red-400', 'border-red-500/40');

        btn.setAttribute('aria-pressed', 'true');
        currentFilter = btn.dataset.filter || 'All';
        renderVulnerabilities();
      });
    });
  }

  function setupSearchInput() {
    const searchInput = document.getElementById('saas-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderVulnerabilities();
    });
  }

  function setupVulnerabilityDrawer() {
    const drawer = document.getElementById('vuln-drawer');
    const closeBtn = document.getElementById('btn-close-drawer');
    if (!drawer) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', closeVulnDrawer);
    }
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeVulnDrawer();
    });
  }

  function openVulnDrawer(item) {
    const drawer = document.getElementById('vuln-drawer');
    const titleEl = document.getElementById('drawer-vuln-title');
    const idEl = document.getElementById('drawer-vuln-id');
    const assetEl = document.getElementById('drawer-vuln-asset');
    const sevEl = document.getElementById('drawer-vuln-sev');
    const cweEl = document.getElementById('drawer-vuln-cwe');
    const pocEl = document.getElementById('drawer-vuln-poc');
    const remedEl = document.getElementById('drawer-vuln-remediation');

    if (!drawer) return;

    if (titleEl) titleEl.innerText = item.title;
    if (idEl) idEl.innerText = item.id;
    if (assetEl) assetEl.innerText = item.asset;
    if (cweEl) cweEl.innerText = `${item.cwe} (CVSS ${item.cvss})`;
    if (pocEl) pocEl.innerText = item.poc || 'N/A';
    if (remedEl) remedEl.innerText = item.remediation || 'N/A';

    if (sevEl) {
      const sevClass = item.severity === 'Critical' ? 'sev-critical' :
                       item.severity === 'High' ? 'sev-high' :
                       item.severity === 'Medium' ? 'sev-medium' : 'sev-low';
      sevEl.innerText = item.severity;
      sevEl.className = `sev-pill ${sevClass}`;
    }

    window.NSEC_DIALOG.open(drawer);
  }

  function closeVulnDrawer() {
    const drawer = document.getElementById('vuln-drawer');
    window.NSEC_DIALOG.close();
  }

  document.addEventListener('DOMContentLoaded', initDashboard);
})();
