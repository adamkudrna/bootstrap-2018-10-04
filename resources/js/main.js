/**
 * Anchor Smooth Scroll
 */
function scrollToAnchor(e) {
  const target = $(e.target).closest($('a')).attr('href');
  const targetEl = $(target);

  if (targetEl.length) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: targetEl.offset().top,
    }, 500);

    window.history.pushState(null, null, target);
  }
}

$('.js-anchor').on('click', scrollToAnchor);
