// jQuery category filter for the transactions page
$(function () {
  const $filter = $('#txFilter');
  if (!$filter.length) return;

  // Wait until transactions.js has fetched the data
  $(document).on('spendly:loaded', function (event) {
    const expenses = event.originalEvent.detail;
    const categories = [...new Set(expenses.map((e) => e.category))].sort();

    categories.forEach((name) => {
      $('<option>').val(name).text(name).appendTo($filter);
    });
  });

  $filter.on('change', function () {
    const chosen = $(this).val();
    const all = window.SpendlyTx.getAll();
    const shown = chosen === 'all' ? all : all.filter((e) => e.category === chosen);
    window.SpendlyTx.render(shown);
  });
});
