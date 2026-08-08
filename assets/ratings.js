document.addEventListener('DOMContentLoaded', () => {
  const ratingSection = document.querySelector('.rating-card');
  if (!ratingSection) return;

  const starsContainer = ratingSection.querySelector('.star-rating');
  const stars = starsContainer ? starsContainer.querySelectorAll('.star') : [];
  const feedback = ratingSection.querySelector('.rating-feedback');

  const toolSlug = starsContainer ? starsContainer.getAttribute('data-slug') : '';
  const storageKey = `rated-toolsmatic-${toolSlug}`;
  const userRating = localStorage.getItem(storageKey);

  stars.forEach(star => {
    star.style.cursor = 'pointer';
    star.style.transition = 'transform 0.15s ease, color 0.15s ease, text-shadow 0.15s ease';
  });

  function highlightStars(ratingValue) {
    stars.forEach(star => {
      const starValue = parseInt(star.getAttribute('data-value'), 10);
      if (starValue <= ratingValue) {
        star.style.color = '#f59e0b';
        star.style.textShadow = '0 0 10px rgba(245, 158, 11, 0.4)';
      } else {
        star.style.color = 'var(--border, #e5e7eb)';
        star.style.textShadow = 'none';
      }
    });
  }

  function setFeedback(html) {
    if (feedback) feedback.innerHTML = html;
  }

  if (userRating) {
    const ratedVal = parseInt(userRating, 10);
    highlightStars(ratedVal);
    setFeedback(`You rated this tool <strong>${ratedVal} ★</strong>. Thank you for your feedback!`);
  } else {
    setFeedback('Be the first to rate this tool — your vote is stored on this device.');
    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        highlightStars(parseInt(star.getAttribute('data-value'), 10));
      });
      star.addEventListener('mouseout', () => {
        highlightStars(0);
      });
      star.addEventListener('click', () => {
        const starValue = star.getAttribute('data-value');
        localStorage.setItem(storageKey, starValue);
        highlightStars(parseInt(starValue, 10));
        setFeedback(`You rated this tool <strong>${starValue} ★</strong>. Thank you for your feedback!`);
        stars.forEach(s => {
          const clone = s.cloneNode(true);
          s.parentNode.replaceChild(clone, s);
        });
      });
    });
  }
});
