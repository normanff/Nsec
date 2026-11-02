/* Prepare an email locally. A draft is not a submitted request. */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contact-modal');
    const form = document.getElementById('contact-request-form');
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
        'Olá, N7 Studio! Gostaria de saber mais sobre o Code Arena.', '',
        'Nome: ' + document.getElementById('contact-name').value.trim(),
        'E-mail: ' + document.getElementById('contact-email').value.trim(),
        'Nome de preferência: ' + (document.getElementById('contact-nickname').value.trim() || 'Não informado'),
        'Interesses: ' + (scopes.join(', ') || 'Code Arena em geral'),
        'Experiência com Python: ' + document.getElementById('experience').selectedOptions[0].text,
        '', 'Minha dúvida ou ideia:', document.getElementById('contact-details').value.trim() || 'A definir.'
      ].join('\n');
      document.getElementById('request-email-link').href = 'mailto:normanff57@gmail.com?subject=' + encodeURIComponent('Contato sobre o N7 Code Arena') + '&body=' + encodeURIComponent(message);
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
