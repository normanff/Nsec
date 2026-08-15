/**
 * NSEC - Attack Surface Simulator Engine
 * Handles hero live threat feed & interactive scan simulation
 */

(function () {
  const mockEndpoints = [
    { target: 'api.nsec-labs.com', type: 'REST API', vulns: 'CRITICAL', status: 'BOLA Exploit Risk' },
    { target: 'auth.example.com', type: 'OAuth 2.0 Auth', vulns: 'HIGH', status: 'JWT Key Misconfig' },
    { target: 'app.example.com', type: 'Single Page App', vulns: 'MEDIUM', status: 'SSRF via Webhook' },
    { target: 'cloud.nsec-infra.io', type: 'AWS S3 Bucket', vulns: 'CRITICAL', status: 'Public Read Access' },
    { target: 'gateway.example.com', type: 'gRPC Endpoint', vulns: 'LOW', status: 'Info Disclosure' }
  ];

  const logPool = [
    '[INIT] Mapeando topologia externa de rede em nsec-labs.com...',
    '[DISCOVERY] 14 endpoints REST e 3 rotas GraphQL identificadas.',
    '[ANALYSIS] Testando autorização em GET /api/v1/user/account...',
    '[ALERT] Falha de autorização BOLA detectada em api.nsec-labs.com [CVSS 9.8]',
    '[SCAN] Verificando cabeçalhos CORS em auth.example.com...',
    '[ALERT] Chave de assinatura JWT fraca detectada em auth.example.com',
    '[VALIDATION] Testando injeção em integrador de webhook...',
    '[COMPLETE] Análise finalizada. 2 falhas críticas e 1 alta validadas com PoC.'
  ];

  let currentLogIdx = 0;
  let isScanning = false;

  function initSimulator() {
    const logContainer = document.getElementById('simulator-log-feed');
    const runBtn = document.getElementById('btn-run-simulation');
    if (!logContainer || !runBtn) return;

    // Start auto logging
    setInterval(() => {
      if (!isScanning) {
        appendLogMessage(logPool[currentLogIdx % logPool.length]);
        currentLogIdx++;
      }
    }, 2800);

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
