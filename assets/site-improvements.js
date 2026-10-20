/* Maintained enhancement source for the original static site. No visual rebuild. */
(() => {
  'use strict';
  const localDate = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const ux = window.ChipZorroUX = {
    pending: false,
    error(message) {
      let node = document.getElementById('cz-feedback');
      if (!node) {
        node = document.createElement('div'); node.id = 'cz-feedback'; node.setAttribute('role', 'alert');
        node.tabIndex = -1; document.body.append(node);
      }
      node.replaceChildren(document.createTextNode(message));
      const close = document.createElement('button'); close.textContent = 'Dismiss'; close.type = 'button';
      close.onclick = () => node.remove(); node.append(close); node.focus();
    },
    busy(pending) {
      ux.pending = pending;
      document.querySelectorAll('form').forEach(form => {
        form.setAttribute('aria-busy', String(pending));
        form.querySelectorAll('button[type="submit"]').forEach(button => { button.disabled = pending; });
      });
    },
    csvCell(value) {
      let text = String(value ?? '');
      // Legacy exporter already wraps some values in quotes.
      if (text.startsWith('"') && text.endsWith('"')) text = text.slice(1, -1);
      if (/^[\s]*[=+\-@\t\r]/.test(text)) text = "'" + text;
      return '"' + text.replaceAll('"', '""') + '"';
    }
  };
  let serial = 0, frame = 0, lastStep = '';
  const decorate = () => {
    frame = 0;
    const root = document.getElementById('root'); if (!root) return;
    const main = root.querySelector('main') || root.children[0]?.children[1];
    if (main && !main.id) { main.id = 'cz-main'; main.tabIndex = -1; }
    root.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(input => {
      if (input.closest('[hidden]')) return;
      let label = input.previousElementSibling;
      if (label?.tagName !== 'LABEL') {
        const parentLabel = input.parentElement?.previousElementSibling;
        if (parentLabel?.tagName === 'LABEL') label = parentLabel;
      }
      if (label?.tagName === 'LABEL') {
        if (!input.id) input.id = `cz-field-${++serial}`;
        label.htmlFor = input.id;
      }
      const name = (label?.textContent || input.getAttribute('placeholder') || '').toLowerCase();
      if (!input.labels?.length && !input.getAttribute('aria-label')) {
        input.setAttribute('aria-label', input.type === 'email' ? 'Email for your confirmation' : input.type === 'tel' ? 'Mobile phone for arrival updates' : name.includes('search') ? 'Search work orders' : input.type === 'password' ? 'Admin password' : name || (input.tagName === 'SELECT' ? input.options[input.selectedIndex]?.textContent || 'Filter' : 'Enter details'));
      }
      const auto = name.includes('street') ? 'street-address' : name === 'city' ? 'address-level2' : name === 'state' ? 'address-level1' : name.includes('zip') ? 'postal-code' : name.includes('email') ? 'email' : name.includes('phone') ? 'tel' : name.includes('full name') ? 'name' : '';
      if (auto) input.autocomplete = auto;
      if (input.type === 'tel') { input.inputMode = 'tel'; input.pattern = '[+()0-9 .-]{10,25}'; }
      if (name.includes('zip')) { input.inputMode = 'numeric'; input.maxLength = 5; input.pattern = '[0-9]{5}'; input.required = true; }
      if (input.type === 'date') { input.min = localDate(); input.required = true; }
      if (/^(street address|city|state)$/.test(name)) input.required = true;
    });
    root.querySelectorAll('img').forEach(image => {
      if (image.dataset.czPrepared) return; image.dataset.czPrepared = 'true';
      image.decoding = 'async';
      if (image.getBoundingClientRect().top > innerHeight) image.loading = 'lazy';
    });
    root.querySelectorAll('video').forEach(video => {
      if (video.dataset.czPrepared) return; video.dataset.czPrepared = 'true';
      video.setAttribute('aria-label', 'Chip Zorro fox windshield rescue animation');
      video.controls = true; video.playsInline = true; video.preload = 'metadata';
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { video.autoplay = false; video.pause(); }
    });
    root.querySelectorAll('table').forEach(table => {
      const wrapper = table.parentElement;
      wrapper.tabIndex = 0; wrapper.setAttribute('role', 'region'); wrapper.setAttribute('aria-label', 'Work orders; scroll horizontally for all columns');
      table.querySelectorAll('thead th').forEach(th => th.scope = 'col');
    });
    const step = [...root.querySelectorAll('p')].find(p => /^Step \d of 5/.test(p.textContent));
    if (step && step.textContent !== lastStep) {
      lastStep = step.textContent; step.setAttribute('aria-live', 'polite');
      const heading = [...root.querySelectorAll('h3')].find(h => !h.closest('footer'));
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    }
    if (!step) lastStep = '';
  };
  document.addEventListener('submit', event => {
    if (!event.target.checkValidity()) { event.preventDefault(); event.stopImmediatePropagation(); event.target.reportValidity(); }
  }, true);
  const start = () => {
    const skip = document.createElement('a'); skip.href = '#cz-main'; skip.className = 'cz-skip'; skip.textContent = 'Skip to main content'; document.body.prepend(skip);
    new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(decorate); }).observe(document.getElementById('root'), {childList:true, subtree:true});
    decorate();
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();

/* Booking email alerts via FormSubmit. Watches chipzorro_bookings in
   localStorage and emails the owner once per new booking. Bookings that
   already exist on first run are baselined silently, so seeded/demo data
   never triggers an alert. Fails silently; never interrupts the site. */
(() => {
  'use strict';
  const ALERT_ENDPOINT = 'https://formsubmit.co/ajax/service@chipzorro.com';
  const BOOKINGS_KEY = 'chipzorro_bookings';
  const SENT_KEY = 'chipzorro_alerted_bookings';
  const sending = new Set();

  const readBookings = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };
  const readSent = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(SENT_KEY) || 'null');
      return Array.isArray(parsed) ? new Set(parsed) : null;
    } catch { return null; }
  };
  const saveSent = (set) => {
    try { localStorage.setItem(SENT_KEY, JSON.stringify([...set])); } catch {}
  };
  const text = (v) => (v === undefined || v === null || v === '' ? null : String(v));
  const vehicleText = (v) => {
    if (!v) return null;
    if (typeof v === 'string') return v;
    return text([v.year, v.make, v.model, v.trim].filter(Boolean).join(' '));
  };
  const payloadFor = (b) => {
    const rows = {
      _subject: `New Chip Zorro booking ${b.orderNumber || ''} - ${b.customerName || 'customer'}`,
      _template: 'table',
      _captcha: 'false',
      'Order number': text(b.orderNumber),
      'Customer': text(b.customerName),
      'Phone': text(b.customerPhone),
      'Email': text(b.customerEmail),
      'Address': text([b.address, b.city, b.state, b.zipCode].filter(Boolean).join(', ')),
      'Vehicle': vehicleText(b.vehicle),
      'Damage': b.damageType ? `${b.damageType}${b.chipCount ? ` (${b.chipCount} chip${b.chipCount > 1 ? 's' : ''})` : ''}` : null,
      'Service location': text(b.locationType),
      'Appointment': text([b.appointmentDate, b.timeSlot].filter(Boolean).join(' ')),
      'Payment': text(b.paymentMethod),
      'Insurance carrier': text(b.insuranceCarrier),
      'Policy number': text(b.insurancePolicyNumber),
      'Estimated cost': b.estimatedCost != null ? `$${b.estimatedCost}` : null,
      'Referral code': text(b.referralCode),
      'Gift card code': text(b.giftCardCode),
      'Urgent': b.isUrgent ? (text(b.urgencyReason) || 'Yes') : null,
      'Booked at': text(b.createdAt)
    };
    Object.keys(rows).forEach((k) => { if (rows[k] === null) delete rows[k]; });
    return rows;
  };
  const check = () => {
    try {
      const bookings = readBookings();
      if (!bookings.length) return;
      const sent = readSent();
      if (sent === null) {
        saveSent(new Set(bookings.map((b) => b && b.id).filter(Boolean)));
        return;
      }
      bookings.forEach((b) => {
        if (!b || !b.id || sent.has(b.id) || sending.has(b.id)) return;
        sending.add(b.id);
        fetch(ALERT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payloadFor(b))
        }).then((res) => {
          if (res.ok) { sent.add(b.id); saveSent(sent); }
        }).catch(() => {}).finally(() => { sending.delete(b.id); });
      });
    } catch {}
  };
  check();
  setInterval(check, 4000);
  window.addEventListener('storage', (e) => { if (e.key === BOOKINGS_KEY) check(); });
})();

/* Booking submit transport for static hosting. The app POSTs the booking
   form to "/" (a form-capture pattern) and only saves the booking when
   that POST succeeds. This static host has no form endpoint, so answer
   that one request locally with success: the booking then saves normally
   and the FormSubmit alert (above) emails it to the owner. Every other
   request passes through untouched. */
(() => {
  'use strict';
  if (typeof window.fetch !== 'function') return;
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    try {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      const method = String((init && init.method) || (input && typeof input === 'object' && input.method) || 'GET').toUpperCase();
      const body = init && typeof init.body === 'string' ? init.body : '';
      const path = new URL(url, window.location.href).pathname;
      const isBookingPost = method === 'POST'
        && (path === '/' || path === '/chip-zorro-website' || path === '/chip-zorro-website/')
        && body.includes('form-name=chip-repair-booking');
      if (isBookingPost) {
        return Promise.resolve(new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
    } catch {}
    return originalFetch(input, init);
  };
})();
