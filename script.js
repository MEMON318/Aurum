'use strict';
document.addEventListener('DOMContentLoaded', () => {
  // Keep the footer year current.
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Accessible mobile navigation.
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.textContent = open ? 'CLOSE ×' : 'MENU ☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation'); toggle.textContent = 'MENU ☰';
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'MENU ☰'; toggle.focus();
      }
    });
  }

  // Menu search, category filters, and a client-side tasting cart.
  const cards = [...document.querySelectorAll('.menu-item[data-category]')];
  const search = document.getElementById('menu-search');
  const filterButtons = [...document.querySelectorAll('.filter-tab')];
  const visibleCount = document.getElementById('visible-count');
  const emptyState = document.getElementById('empty-state');
  let activeFilter = 'all';
  const cart = new Map();
  const itemsLabel = document.getElementById('cart-items');
  const totalLabel = document.getElementById('cart-total');
  const countLabel = document.getElementById('cart-count');
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message; toast.classList.add('show');
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function filterMenu() {
    const term = (search?.value || '').trim().toLowerCase(); let visible = 0;
    cards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      const name = (card.dataset.name || card.textContent).toLowerCase();
      const matchesCategory = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesSearch = name.includes(term) || card.textContent.toLowerCase().includes(term);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show; if (show) visible++;
    });
    if (visibleCount) visibleCount.textContent = String(visible);
    if (emptyState) emptyState.style.display = visible ? 'none' : 'block';
  }
  if (search) search.addEventListener('input', filterMenu);
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filterButtons.forEach(b => { const selected = b === button; b.classList.toggle('active', selected); b.setAttribute('aria-pressed', String(selected)); });
    filterMenu();
  }));
  function renderCart() {
    if (!itemsLabel || !totalLabel) return;
    let total = 0, count = 0;
    const summary = [...cart.entries()].map(([name, item]) => { total += item.price * item.qty; count += item.qty; return `${name} × ${item.qty}`; });
    itemsLabel.textContent = summary.length ? summary.join(' · ') : 'Add a drink to start your demo order.';
    totalLabel.textContent = total.toLocaleString('en-PK');
    if (countLabel) countLabel.textContent = count ? `(${count})` : '';
  }
  document.querySelectorAll('.add[data-name][data-price]').forEach(button => button.addEventListener('click', () => {
    const name = button.dataset.name; const price = Number(button.dataset.price);
    if (!name || !Number.isFinite(price) || price < 0) return;
    const item = cart.get(name) || { price, qty: 0 }; item.qty++; cart.set(name, item);
    renderCart(); showToast(`${name} added to your tasting list`);
  }));
  document.getElementById('clear-cart')?.addEventListener('click', () => { cart.clear(); renderCart(); showToast('Tasting list cleared'); });
  document.getElementById('order-cart')?.addEventListener('click', () => {
    if (!cart.size) { showToast('Add a drink before preparing your order'); return; }
    const lines = [...cart.entries()].map(([name, item]) => `${name} x ${item.qty} — Rs. ${(item.price * item.qty).toLocaleString('en-PK')}`);
    const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.qty, 0);
    const message = `AURUM Coffee House — demo order\n\n${lines.join('\n')}\n\nEstimated total: Rs. ${total.toLocaleString('en-PK')}\n\nThis is a demo request only; please confirm availability and final prices.`;
    const subject = 'AURUM Coffee House — tasting list';
    // Mail client opens locally; no order is sent automatically.
    window.location.href = `mailto:hello@yourcafe.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    showToast('Your email app may open with this demo order');
  });
  filterMenu(); renderCart();

  // Contact / visit enquiry: validate and prepare an email draft, never claim delivery.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const dateInput = document.getElementById('visit-date');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const data = new FormData(contactForm);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();
      if (!name || !email || !message) return;
      const body = [
        `Name: ${name}`, `Email: ${email}`,
        data.get('date') ? `Preferred date: ${data.get('date')}` : '',
        data.get('guests') ? `Guests: ${data.get('guests')}` : '',
        data.get('subject') ? `Enquiry type: ${data.get('subject')}` : '', '', message
      ].filter((line, index, arr) => line !== '' || (index > 0 && arr[index - 1] !== '')).join('\n');
      const status = document.getElementById('form-status');
      if (status) status.textContent = 'Your email app is opening with a draft. The enquiry is not sent until you press Send.';
      window.location.href = `mailto:hello@yourcafe.com?subject=${encodeURIComponent('AURUM enquiry from ' + name)}&body=${encodeURIComponent(body)}`;
    });
  }
});
