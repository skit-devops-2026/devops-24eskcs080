// jQuery FAQ accordion for the help page
$(function () {
  const $questions = $('.faq-question');
  if (!$questions.length) return;

  // Collapse with JS (not CSS) so the answers stay readable if JS fails
  $('.faq-answer').hide();

  $questions.on('click', function () {
    const $button = $(this);
    const $panel = $('#' + $button.attr('aria-controls'));
    const opening = $button.attr('aria-expanded') === 'false';

    // Only one answer open at a time
    $questions.not($button).each(function () {
      $(this).attr('aria-expanded', 'false');
      $('#' + $(this).attr('aria-controls')).slideUp(200);
    });

    $button.attr('aria-expanded', String(opening));
    if (opening) { $panel.slideDown(200); } else { $panel.slideUp(200); }
  });
});
