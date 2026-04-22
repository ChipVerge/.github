/* ============================================================
   SQUARED STUDIO — Contact Form
   ============================================================ */

(function () {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const statusEl = document.getElementById('contactStatus');
  const serviceField = document.getElementById('service');
  const nextField = document.getElementById('nextPage');
  const sourceField = document.getElementById('sourcePage');

  if (sourceField) {
    sourceField.value = window.location.href;
  }

  if (nextField) {
    nextField.value = 'https://chipverge.com/contact.html?sent=1';
  }

  const requestedService = new URLSearchParams(window.location.search).get('service');
  const sentFlag = new URLSearchParams(window.location.search).get('sent');
  if (requestedService && serviceField) {
    const matchedOption = Array.from(serviceField.options).find((option) => option.value === requestedService);
    if (matchedOption) {
      serviceField.value = requestedService;
    }
  }

  function setStatus(message, success) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    statusEl.classList.add(success ? 'is-success' : 'is-error');
  }

  function showToast(message, success = true) {
    let toast = document.querySelector('.toast');

    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.borderColor = success ? 'var(--green)' : '#f87171';
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 4000);
  }

  if (sentFlag === '1') {
    setStatus('Message sent. We will respond within 24 hours.', true);
    showToast('Message sent. We will respond within 24 hours.', true);
  }

  function handleSubmit() {
    if (sourceField) {
      sourceField.value = window.location.href;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    setStatus('Submitting your message...', true);
  }

  contactForm.addEventListener('submit', handleSubmit);
})();