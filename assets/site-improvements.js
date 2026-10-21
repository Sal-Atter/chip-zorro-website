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

/* Booking sync to the Chip Zorro database (Hostinger). Watches
   chipzorro_bookings and POSTs each new booking once to the owner's
   endpoint, which stores it in MySQL. Baselined silently on first run,
   like the FormSubmit alerts, so existing bookings never flood the
   database. Fails silently; never interrupts the site. */
(() => {
  'use strict';
  const DB_ENDPOINT = 'https://chipzorro.com/api/booking.php';
  const DB_TOKEN = 'ueyrEUDL50bQRJLNfzd4e3WEb6ru6kjB';
  const BOOKINGS_KEY = 'chipzorro_bookings';
  const SENT_KEY = 'chipzorro_db_bookings';
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
        fetch(DB_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CZ-Token': DB_TOKEN },
          body: JSON.stringify(b),
          keepalive: true
        }).then((res) => {
          sending.delete(b.id);
          if (res && res.ok) {
            const now = readSent() || new Set();
            now.add(b.id);
            saveSent(now);
          }
        }).catch(() => { sending.delete(b.id); });
      });
    } catch {}
  };
  setInterval(check, 4000);
  check();
})();

/* Admin database sync. When the owner opens the built-in admin, a slim
   connect bar appears under the tabs. Once the owner connects with the
   Chip Zorro admin password, bookings from the Hostinger database are
   merged into the site's own booking store, so they show up in the
   native "Bookings & Work Orders" tab (and the dashboard counts) like
   any other booking. Deletions made here are propagated back to the
   database (after two consecutive checks, for safety); bookings deleted
   in the database disappear here too. Local-only bookings are never
   removed. Fails silently; never interrupts the site. */
(() => {
  'use strict';
  const API = 'https://chipzorro.com/api';
  const BOOKINGS_KEY = 'chipzorro_bookings';
  const KNOWN_KEY = 'cz_db_known_orders';
  const TOMB_KEY = 'cz_db_tombstones';
  const TOKEN_KEY = 'cz_admin_token';
  const ALERTED_KEY = 'chipzorro_alerted_bookings';
  const DB_SENT_KEY = 'chipzorro_db_bookings';
  const RELOAD_KEY = 'cz_db_last_reload';
  let bar = null;
  let syncing = false;
  const pendingDeletes = new Map();

  const token = () => { try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; } };
  const readJSON = (key, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(key) || 'null');
      return v === null ? fallback : v;
    } catch { return fallback; }
  };
  const readBookings = () => {
    const v = readJSON(BOOKINGS_KEY, []);
    return Array.isArray(v) ? v : [];
  };
  const saveBookings = (list) => {
    try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list)); } catch {}
  };
  const markSent = (id) => {
    [ALERTED_KEY, DB_SENT_KEY].forEach((key) => {
      const set = readJSON(key, null);
      if (Array.isArray(set) && !set.includes(id)) {
        set.push(id);
        try { localStorage.setItem(key, JSON.stringify(set)); } catch {}
      }
    });
  };
  const findTabBar = () => {
    const dash = [...document.querySelectorAll('button')]
      .find((b) => b.textContent.trim().startsWith('Dashboard Overview'));
    return dash ? dash.parentElement : null;
  };
  const maybeReload = () => {
    try {
      const ae = document.activeElement;
      if (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) return;
      const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
      if (Date.now() - last < 15000) return;
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      location.reload();
    } catch {}
  };
  const apiFetch = async (path, opts) => {
    const res = await fetch(API + path, Object.assign({}, opts || {}, {
      headers: Object.assign({ 'Authorization': 'Bearer ' + token() }, (opts && opts.headers) || {})
    }));
    if (res.status === 401) {
      try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
      renderBar();
      throw new Error('unauthorized');
    }
    return res;
  };
  const sync = async () => {
    if (syncing || !token()) return;
    syncing = true;
    try {
      const res = await apiFetch('/bookings.php');
      const data = await res.json();
      const dbList = Array.isArray(data.bookings) ? data.bookings : [];
      const dbOrders = new Set(dbList.map((b) => b && b.orderNumber).filter(Boolean));
      let local = readBookings();
      const localOrders = new Set(local.map((b) => b && b.orderNumber).filter(Boolean));
      const localIds = new Set(local.map((b) => b && b.id).filter(Boolean));
      const known = readJSON(KNOWN_KEY, null);
      let changed = false;

      // Bookings deleted here -> delete in the database. A tombstone is
      // recorded on first sight so the merge below can never resurrect
      // the booking while the delete is pending; the DELETE itself only
      // fires after the booking is still gone on a second check.
      if (Array.isArray(known)) {
        let tombs = readJSON(TOMB_KEY, []);
        if (!Array.isArray(tombs)) tombs = [];
        const goneLocally = known.filter((o) => dbOrders.has(o) && !localOrders.has(o));
        goneLocally.forEach((o) => { if (!tombs.includes(o)) tombs.push(o); });
        for (const order of [...tombs]) {
          if (!dbOrders.has(order) || localOrders.has(order)) {
            tombs = tombs.filter((o) => o !== order);
            pendingDeletes.delete(order);
            continue;
          }
          const n = (pendingDeletes.get(order) || 0) + 1;
          pendingDeletes.set(order, n);
          if (n >= 2) {
            pendingDeletes.delete(order);
            tombs = tombs.filter((o) => o !== order);
            try { await apiFetch('/bookings.php?order=' + encodeURIComponent(order), { method: 'DELETE' }); } catch {}
            dbOrders.delete(order);
          }
        }
        try { localStorage.setItem(TOMB_KEY, JSON.stringify(tombs)); } catch {}
        sync._tombs = tombs;
        // Bookings deleted in the database -> remove here (only ones we synced before).
        const removedRemotely = known.filter((o) => !dbOrders.has(o) && localOrders.has(o));
        if (removedRemotely.length) {
          local = local.filter((b) => !removedRemotely.includes(b.orderNumber));
          changed = true;
        }
      }
      // New database bookings -> add here, and never alert on them.
      // Tombstoned orders are skipped: they are pending deletion.
      const tombsNow = Array.isArray(sync._tombs) ? sync._tombs : readJSON(TOMB_KEY, []);
      dbList.forEach((b) => {
        if (!b || !b.orderNumber || localOrders.has(b.orderNumber) || (b.id && localIds.has(b.id))) return;
        if (Array.isArray(tombsNow) && tombsNow.includes(b.orderNumber)) return;
        local.push(b);
        localOrders.add(b.orderNumber);
        if (b.id) { localIds.add(b.id); markSent(b.id); }
        changed = true;
      });
      try { localStorage.setItem(KNOWN_KEY, JSON.stringify([...dbOrders])); } catch {}
      if (changed) {
        saveBookings(local);
        maybeReload();
      }
    } catch {}
    syncing = false;
  };
  const renderBar = () => {
    if (!bar || !bar.isConnected) return;
    const connected = Boolean(token());
    bar.innerHTML = '';
    bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;' +
      'background:#0f172a;border-top:1px solid #1e293b;padding:8px 12px;font:12px/1.5 Arial,Helvetica,sans-serif;';
    const msg = document.createElement('span');
    msg.style.color = connected ? '#6ee7b7' : '#94a3b8';
    msg.textContent = connected
      ? '● Live bookings connected — database bookings show in Bookings & Work Orders.'
      : '○ Live bookings are off — sign in to show database bookings in this admin.';
    bar.appendChild(msg);
    if (connected) {
      const out = document.createElement('button');
      out.type = 'button';
      out.textContent = 'Disconnect';
      out.style.cssText = 'background:#1e293b;color:#cbd5e1;border:1px solid #334155;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;';
      out.addEventListener('click', () => {
        try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
        renderBar();
      });
      bar.appendChild(out);
    } else {
      const pw = document.createElement('input');
      pw.type = 'password';
      pw.placeholder = 'Admin password';
      pw.autocomplete = 'current-password';
      pw.style.cssText = 'background:#020617;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:5px 9px;font-size:12px;min-width:170px;';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Connect live bookings';
      btn.style.cssText = 'background:#ea580c;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:12px;font-weight:bold;';
      const note = document.createElement('span');
      note.style.color = '#fca5a5';
      const attempt = async () => {
        note.textContent = '';
        btn.disabled = true;
        try {
          const res = await fetch(API + '/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pw.value })
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.token) {
            try { sessionStorage.setItem(TOKEN_KEY, data.token); } catch {}
            renderBar();
            sync();
          } else {
            note.textContent = data.error === 'locked_out' ? 'Too many wrong attempts — locked for 10 minutes.'
              : data.error === 'admin_password_not_set' ? 'Password not set yet — set it at chipzorro.com/admin first.'
              : 'Wrong password.';
          }
        } catch { note.textContent = 'Could not reach the server.'; }
        btn.disabled = false;
      };
      btn.addEventListener('click', attempt);
      pw.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') attempt(); });
      bar.appendChild(pw);
      bar.appendChild(btn);
      bar.appendChild(note);
    }
  };
  const inject = () => {
    try {
      const tabBar = findTabBar();
      if (!tabBar) return;
      if (bar && bar.isConnected) return;
      bar = document.createElement('div');
      bar.id = 'cz-sync-bar';
      tabBar.after(bar);
      renderBar();
      if (token()) sync();
    } catch {}
  };
  const observer = new MutationObserver(() => { inject(); });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(() => { if (token() && findTabBar()) sync(); }, 30000);
  inject();
})();
