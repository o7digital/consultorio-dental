const form = document.querySelector('[data-appointment-form]');

if (form instanceof HTMLFormElement) {
  const english = form.dataset.language === 'en';
  const fullName = form.elements.namedItem('name');
  const phone = form.elements.namedItem('phone');
  const date = form.elements.namedItem('date');
  const time = form.elements.namedItem('time');
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const status = form.querySelector('.form-status');
  const idleLabel = submitLabel.textContent;
  let sending = false;

  if (date instanceof HTMLInputElement) {
    date.min = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  }

  const validatePhone = () => {
    if (!(phone instanceof HTMLInputElement)) return;
    const digits = phone.value.replace(/\D/g, '');
    const valid = /^[+\d() .-]+$/.test(phone.value) && digits.length >= 8 && digits.length <= 15;
    phone.setCustomValidity(valid || !phone.value ? '' : english
      ? 'Enter a valid phone number with 8 to 15 digits.'
      : 'Escribe un número de teléfono válido de 8 a 15 dígitos.');
  };

  phone.addEventListener('input', validatePhone);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    if (fullName instanceof HTMLInputElement) fullName.value = fullName.value.trim();
    validatePhone();
    if (!form.reportValidity()) return;

    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submitLabel.textContent = english ? 'Sending…' : 'Enviando…';
    status.textContent = '';
    status.removeAttribute('data-state');

    const data = new FormData(form);
    if (time instanceof HTMLSelectElement) {
      data.set('time', time.selectedOptions[0].textContent.trim());
    }
    data.set('consent', english ? 'Accepted' : 'Aceptado');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (response.status === 429) {
        status.dataset.state = 'error';
        status.textContent = english
          ? 'Too many requests. Please wait a moment before trying again.'
          : 'Se han enviado varias solicitudes. Espera un momento antes de intentarlo de nuevo.';
        return;
      }
      const result = await response.json();
      if (!response.ok || result.ok === false || result.errors?.length) throw new Error('Submission was not accepted');

      status.dataset.state = 'success';
      status.textContent = english
        ? 'Your request has been sent. Our team will contact you to confirm the date and time of your appointment.'
        : 'Tu solicitud se ha enviado. El equipo del consultorio te contactará para confirmar la fecha y el horario de tu cita.';
      form.reset();
    } catch {
      status.dataset.state = 'error';
      status.textContent = english
        ? 'We could not confirm your request was sent. Your details are still here. Please check your connection and try again, or call 55 5393 8629.'
        : 'No pudimos confirmar el envío. Tus datos siguen en el formulario. Revisa tu conexión e inténtalo de nuevo o llámanos al 55 5393 8629.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      submitLabel.textContent = idleLabel;
      if (status.textContent) status.focus({ preventScroll: true });
    }
  });
}
