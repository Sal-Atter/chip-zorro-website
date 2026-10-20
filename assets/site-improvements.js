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
