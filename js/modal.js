/* Prepare an email locally. A draft is not a submitted request. */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('pentest-modal');
    const form = document.getElementById('pentest-request-form');
    const preview = document.getElementById('modal-success-box');
    document.querySelectorAll('.btn-open-modal').forEach(button => {
      button.addEventListener('click', () => window.NSEC_DIALOG.open(modal));
    });
    document.querySelectorAll('.btn-close-modal').forEach(button => {
      button.addEventListener('click', () => window.NSEC_DIALOG.close());
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const scopes = [...form.querySelectorAll('[name="scope"]:checked')].map(input => input.parentElement.innerText.trim());
      const message = [
        'Olá, NSEC! Gostaria de solicitar uma proposta de pentest.', '',
        'Nome: ' + document.getElementById('contact-name').value.trim(),
        'E-mail: ' + document.getElementById('contact-email').value.trim(),
        'Empresa: ' + document.getElementById('company-name').value.trim(),
        'Ambientes: ' + (scopes.join(', ') || 'A definir com a equipe'),
        'Prazo desejado: ' + document.getElementById('urgency').selectedOptions[0].text,
        '', 'Detalhes do escopo:', document.getElementById('scope-details').value.trim() || 'A definir.'
      ].join('\n');
      document.getElementById('request-email-link').href = 'mailto:contato@nsec.com.br?subject=' + encodeURIComponent('Solicitação de proposta de pentest') + '&body=' + encodeURIComponent(message);
      document.getElementById('request-email-preview').value = message;
      form.classList.add('hidden');
      preview.classList.remove('hidden');
      document.getElementById('email-ready-title').focus();
    });
    document.getElementById('btn-reset-modal').addEventListener('click', () => {
      preview.classList.add('hidden');
      form.classList.remove('hidden');
      document.getElementById('contact-name').focus();
    });
  });
})();
