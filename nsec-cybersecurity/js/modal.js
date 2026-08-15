/**
 * NSEC - Modal Handler
 * Controls Pentest Scope Request Modal steps & form validation
 */

(function () {
  function initModal() {
    const modal = document.getElementById('pentest-modal');
    const openBtns = document.querySelectorAll('.btn-open-modal');
    const closeBtns = document.querySelectorAll('.btn-close-modal');
    const form = document.getElementById('pentest-request-form');
    const successBox = document.getElementById('modal-success-box');

    if (!modal) return;

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success state
        if (form && successBox) {
          form.classList.add('hidden');
          successBox.classList.remove('hidden');
        }
      });
    }

    const resetBtn = document.getElementById('btn-reset-modal');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (form) {
          form.reset();
          form.classList.remove('hidden');
        }
        if (successBox) {
          successBox.classList.add('hidden');
        }
        closeModal();
      });
    }
  }

  function openModal() {
    const modal = document.getElementById('pentest-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    const modal = document.getElementById('pentest-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('DOMContentLoaded', initModal);
})();
