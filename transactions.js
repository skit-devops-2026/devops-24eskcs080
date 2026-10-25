// Loads sample expenses with fetch (AJAX) and renders them
(function () {
  'use strict';

  const list = document.getElementById('txList');
  if (!list) return;

  const status = document.getElementById('txStatus');
  const totalEl = document.getElementById('txTotal');
  const countEl = document.getElementById('txCount');
  const money = (n) => '₹' + n.toLocaleString('en-IN');
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let expenses = [];

  function render(items) {
    list.innerHTML = items.map((e) => `
      <li class="tx-row" data-category="${escapeHtml(e.category)}">
        <span class="tx-date">${escapeHtml(e.date)}</span>
        <span class="tx-cat">${escapeHtml(e.category)}</span>
        <span class="tx-note">${escapeHtml(e.note)}</span>
        <span class="tx-amount">${money(e.amount)}</span>
      </li>`).join('');
    const total = items.reduce((sum, e) => sum + e.amount, 0);
    totalEl.textContent = money(total);
    countEl.textContent = items.length;
    status.textContent = items.length ? '' : 'No expenses in this category.';
  }

  // Exposed so the jQuery filter (next step) can reuse it
  window.SpendlyTx = { getAll: () => expenses, render };

  async function load() {
    status.textContent = 'Loading expenses…';
    try {
      const response = await fetch('data/expenses.json');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      expenses = await response.json();
      render(expenses);
      document.dispatchEvent(new CustomEvent('spendly:loaded', { detail: expenses }));
    } catch (error) {
      status.textContent = 'Could not load expenses (' + error.message + '). Please try again.';
    }
  }

  load();
})();
