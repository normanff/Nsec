/**
 * NSEC - Attack Surface Simulator Engine
 * Handles hero live threat feed & interactive scan simulation
 */

(function () {
  let isScanning = false;

  function initSimulator() {
    const logContainer = document.getElementById('simulator-log-feed');
    const runBtn = document.getElementById('btn-run-simulation');
    if (!logContainer || !runBtn) return;

    appendLogMessage('[DEMO] Pronto. Execute a simulação para explorar o processo.');
    runBtn.addEventListener('click', runInteractiveScan);
  }

  function appendLogMessage(text) {
    const logContainer = document.getElementById('simulator-log-feed');
    if (!logContainer) return;

    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    const line = document.createElement('div');
    line.className = 'font-mono text-xs text-gray-300 leading-relaxed transition-all duration-300';
    
    if (text.includes('CRITICAL') || text.includes('ALERT') || text.includes('Falha')) {
      line.innerHTML = `<span class="text-gray-500">[${time}]</span> <span class="text-red-400 font-semibold">${text}</span>`;
    } else if (text.includes('COMPLETE')) {
      line.innerHTML = `<span class="text-gray-500">[${time}]</span> <span class="text-emerald-400 font-semibold">${text}</span>`;
    } else {
      line.innerHTML = `<span class="text-gray-500">[${time}]</span> ${text}`;
    }

    logContainer.appendChild(line);
    
    // Keep max 8 lines
    while (logContainer.children.length > 8) {
      logContainer.removeChild(logContainer.firstChild);
    }
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  function runInteractiveScan() {
    if (isScanning) return;
    isScanning = true;

    const runBtn = document.getElementById('btn-run-simulation');
    const statusText = document.getElementById('simulator-status-badge');
    
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.innerHTML = `<span class="inline-block animate-spin mr-2">⚙</span> Varredura em Andamento...`;
      runBtn.classList.add('opacity-75');
    }

    if (statusText) {
      statusText.innerText = 'ANALISANDO...';
      statusText.className = 'sev-pill sev-critical animate-pulse';
    }

    let step = 0;
    const scanSteps = [
      '[VARREDURA] Disparando sondagens de reconhecimento estendido...',
      '[SUPERFÍCIE] Auditando 5 subdomínios e 28 parâmetros de entrada...',
      '[EXPLORAÇÃO] Executando simulação de ataque em /auth/v2/token...',
      '[VALIDAÇÃO] Prova de conceito gerada sem impacto operacional.',
      '[RELATÓRIO] Ativos mapeados e risco computado.'
    ];

    const interval = setInterval(() => {
      if (step < scanSteps.length) {
        appendLogMessage(scanSteps[step]);
        step++;
      } else {
        clearInterval(interval);
        isScanning = false;

        if (runBtn) {
          runBtn.disabled = false;
          runBtn.innerText = 'Reexecutar Simulador de Varredura';
          runBtn.classList.remove('opacity-75');
        }

        if (statusText) {
          statusText.innerText = 'VARREDURA CONCLUÍDA';
          statusText.className = 'status-pill';
        }
      }
    }, 900);
  }

  document.addEventListener('DOMContentLoaded', initSimulator);
})();
