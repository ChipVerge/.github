/* ============================================================
   SQUARED STUDIO — Contact Form
   ============================================================ */

(function () {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const statusEl = document.getElementById('contactStatus');
  const serviceField = document.getElementById('service');
  const sourceField = document.getElementById('sourcePage');
  const initialButtonText = submitButton.textContent;
  const ajaxEndpoint = `${contactForm.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/')}`;

  if (sourceField) {
    sourceField.value = window.location.href;
  }

  const requestedService = new URLSearchParams(window.location.search).get('service');
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);

    if (sourceField) {
      formData.set('source_page', window.location.href);
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    setStatus('', true);

    try {
      const response = await fetch(ajaxEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });

      const payload = await response.json().catch(() => ({}));
      const wasSuccessful = response.ok && String(payload.success ?? 'true') !== 'false';

      if (!wasSuccessful) {
        throw new Error(payload.message || 'Email delivery failed.');
      }

      contactForm.reset();
      setStatus('Message sent. We will respond within 24 hours.', true);
      showToast('Message sent. We will respond within 24 hours.', true);
    } catch (error) {
      setStatus('The form could not be sent right now. Please email foez.official@gmail.com directly.', false);
      showToast('The form could not be sent right now. Please email foez.official@gmail.com directly.', false);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = initialButtonText;
    }
  }

  contactForm.addEventListener('submit', handleSubmit);
})();