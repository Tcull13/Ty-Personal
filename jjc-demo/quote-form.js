'use strict';
(() => {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  const endpoint = 'https://formsubmit.co/ajax/joeyharrington516@gmail.com';
  const phone = '+17815882531';
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.links');
  const send = document.getElementById('sendQuote');
  const status = document.getElementById('status');
  const followup = document.getElementById('quoteFollowup');
  const fallback = document.getElementById('quoteFallback');
  let inFlight = false;
  let accepted = false;

  const sms = (message) => {
    const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return 'sms:' + phone + (apple ? '&' : '?') + 'body=' + encodeURIComponent(message);
  };
  document.querySelectorAll('[data-sms]').forEach(a => { a.href = sms(a.dataset.sms); });
  function closeMenu() {
    if (!menu || !nav) return;
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    menu.textContent = 'MENU';
  }
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menu.textContent = open ? 'CLOSE' : 'MENU';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (innerWidth > 1100) closeMenu(); });
  }
  form.addEventListener('focusin', () => document.body.classList.add('form-focused'));
  form.addEventListener('focusout', () => {
    setTimeout(() => { if (!form.contains(document.activeElement)) document.body.classList.remove('form-focused'); }, 0);
  });
  function setStatus(text, state) {
    status.textContent = text;
    status.dataset.state = state;
  }
  function values() {
    const raw = new FormData(form);
    const data = {};
    raw.forEach((value, key) => { if (typeof value === 'string') data[key] = value.trim(); });
    data.submitted_at_utc = new Date().toISOString();
    data.website = location.origin + location.pathname;
    if (!data.email) delete data.email;
    return data;
  }
  function quoteText(data) {
    return [
      'Hi Joey, I would like a JJC exterior-cleaning quote.',
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      'Property: ' + data.location,
      'Service: ' + data.service,
      data.email ? 'Email: ' + data.email : '',
      data.details ? 'Details: ' + data.details : 'I can send property photos.'
    ].filter(Boolean).join('\n');
  }
  // Only an explicit positive API acknowledgement counts as acceptance.
  // Acknowledgement is not proof of arrival in the recipient's inbox.
  async function post(data) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'omit',
        signal: controller.signal
      });
      let body;
      try { body = await response.json(); }
      catch (_) { throw new Error('Unrecognized response'); }
      const message = typeof body.message === 'string' ? body.message : '';
      if (/activat|verif|confirm your email|check your (?:email|inbox)/i.test(message)) {
        return { state: 'activation' };
      }
      if (!response.ok || !(body.success === true || body.success === 'true')) {
        throw new Error('Submission not acknowledged');
      }
      return { state: 'accepted' };
    } finally { clearTimeout(timer); }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (inFlight || accepted || !form.reportValidity()) return;
    const data = values();
    if (data._honey) {
      setStatus('This request could not be sent. Please call or text JJC.', 'error');
      return;
    }
    if (!data.name || !data.phone || !data.location || !data.service) {
      setStatus('Please complete all required fields; spaces alone are not valid.', 'error');
      return;
    }
    if ((data.phone.match(/\d/g) || []).length < 7) {
      setStatus('Please enter a phone number Joey can reach you on.', 'error');
      document.getElementById('phone').focus();
      return;
    }
    document.getElementById('textFallback').href = sms(quoteText(data));
    fallback.hidden = true;
    followup.hidden = true;
    inFlight = true;
    send.disabled = true;
    send.textContent = 'Sending request…';
    form.setAttribute('aria-busy', 'true');
    setStatus('Sending your request. Please keep this page open.', 'sending');
    try {
      const result = await post(data);
      if (result.state === 'activation') {
        setStatus('Email notifications still need owner activation. Please call or text JJC instead; your details remain below.', 'activation');
        fallback.hidden = false;
        return;
      }
      accepted = true;
      setStatus('Your request was accepted. Thank you for contacting JJC. Joey can follow up about your project.', 'success');
      document.getElementById('textPhotos').href = sms('Hi Joey, this is ' + data.name + '. I just submitted a JJC quote request for ' + data.service + ' at ' + data.location + '. Here are my property photos.');
      followup.hidden = false;
      // Prevent repeat submissions and accidental edits after acceptance.
      form.querySelectorAll('input:not([type=hidden]), select, textarea').forEach(input => { input.disabled = true; });
    } catch (_) {
      setStatus('We could not confirm that your request went through. Your details are still here. Retry or text JJC; retrying may duplicate an earlier request.', 'error');
      fallback.hidden = false;
    } finally {
      inFlight = false;
      form.setAttribute('aria-busy', 'false');
      send.disabled = accepted;
      send.textContent = accepted ? 'Request accepted' : 'Request my quote';
    }
  });
  // Owner-only-by-intent setup helper, NOT a security boundary.
  // It never sends automatically and contains no customer information.
  const setup = document.getElementById('emailSetup');
  if (setup && new URLSearchParams(location.search).get('setup') === '1') {
    setup.hidden = false;
    const button = document.getElementById('activateEmail');
    const result = document.getElementById('setupStatus');
    let setupSent = false;
    button.addEventListener('click', async () => {
      if (setupSent || button.disabled) return;
      button.disabled = true;
      result.textContent = 'Sending one setup test…';
      const payload = {
        name: 'JJC website setup test',
        message: 'SETUP TEST — not a customer lead. Joey: confirm any FormSubmit activation email, then submit a separate test from the website and verify it arrives in your inbox before relying on notifications.',
        _subject: 'JJC website — email setup test (not a customer quote)',
        _template: 'table',
        _honey: '',
        website: location.origin + location.pathname,
        submitted_at_utc: new Date().toISOString()
      };
      try {
        const outcome = await post(payload);
        setupSent = true;
        button.textContent = 'Setup request submitted';
        result.textContent = outcome.state === 'activation'
          ? 'The service says activation is needed. Joey: check your inbox and spam folder for FormSubmit, confirm the activation email, then verify a new test quote arrives.'
          : 'The service accepted the setup test. Joey: check your inbox and spam folder for a test or activation email. Confirm any activation request, then verify a new test quote arrives. Inbox delivery is not verified by this page.';
      } catch (_) {
        button.disabled = false;
        result.textContent = 'The setup request could not be confirmed. Try again, or submit a clearly labeled setup test through the normal form below. No delivery has been verified.';
      }
    });
  }
})();
