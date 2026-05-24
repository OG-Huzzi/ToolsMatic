document.addEventListener('DOMContentLoaded', () => {
  const ratingSection = document.querySelector('.rating-card');
  if (!ratingSection) return;

  const starsContainer = ratingSection.querySelector('.star-rating');
  const stars = starsContainer.querySelectorAll('.star');
  const valueDisplay = ratingSection.querySelector('.rating-value');
  const countDisplay = ratingSection.querySelector('.rating-count');
  
  const toolSlug = starsContainer.getAttribute('data-slug');
  const storageKey = `rated-toolsmatic-${toolSlug}`;
  
  let seedRating = parseFloat(valueDisplay.textContent) || 4.8;
  let seedCount = parseInt(countDisplay.textContent, 10) || 120;
  
  const userRating = localStorage.getItem(storageKey);
  
  // Set up CSS styling variables dynamically if not defined
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

  function resetStars() {
    if (localStorage.getItem(storageKey)) {
      highlightStars(parseInt(localStorage.getItem(storageKey), 10));
    } else {
      highlightStars(0);
    }
  }

  if (userRating) {
    const ratedVal = parseInt(userRating, 10);
    highlightStars(ratedVal);
    
    // Add success message
    const feedback = ratingSection.querySelector('.rating-feedback');
    feedback.innerHTML = `You rated this tool <strong>${ratedVal} ★</strong>. Thank you for your feedback! <br><span style="font-size:0.85em;color:var(--muted);font-weight:normal;">Average: ${seedRating}/5 (${seedCount} votes)</span>`;
  } else {
    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const starValue = parseInt(star.getAttribute('data-value'), 10);
        highlightStars(starValue);
        star.style.transform = 'scale(1.25)';
      });
      
      star.addEventListener('mouseout', () => {
        resetStars();
        star.style.transform = 'scale(1)';
      });
      
      star.addEventListener('click', () => {
        const starValue = parseInt(star.getAttribute('data-value'), 10);
        
        // Store in localStorage
        localStorage.setItem(storageKey, starValue.toString());
        
        // Calculate new rating
        const newCount = seedCount + 1;
        const newRating = ((seedRating * seedCount) + starValue) / newCount;
        const roundedRating = Math.round(newRating * 100) / 100;
        
        // Visual pop effect
        starsContainer.style.transform = 'scale(1.1)';
        setTimeout(() => {
          starsContainer.style.transform = 'scale(1)';
        }, 150);
        
        // Update view
        highlightStars(starValue);
        const feedback = ratingSection.querySelector('.rating-feedback');
        feedback.innerHTML = `You rated this tool <strong>${starValue} ★</strong>. Thank you for your feedback! <br><span style="font-size:0.85em;color:var(--muted);font-weight:normal;">Average: ${roundedRating}/5 (${newCount} votes)</span>`;
        
        // Remove mouse listeners
        stars.forEach(s => {
          const clone = s.cloneNode(true);
          s.parentNode.replaceChild(clone, s);
        });
      });
    });
  }
});
