/**
 * js/reviews.js — Reviews Pull-Quote Carousel or Auto-Hide
 * Aaina Makeup Studio
 * Complies with PRD §6 F4, RULES §C4, and CONTENT §7
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $, escapeHTML } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s),
    escapeHTML: s => s
  };

  let currentIndex = 0;

  function renderReviews() {
    const section = $("#reviews-section");
    if (!section) return;

    const reviews = window.AAINA.reviews || [];

    // Auto-hide section if no genuine reviews exist per PRD §6 F4
    if (!reviews || reviews.length === 0) {
      section.style.display = "none";
      section.setAttribute("aria-hidden", "true");
      return;
    }

    section.style.display = "";
    section.removeAttribute("aria-hidden");

    const container = $("#reviews-container");
    if (!container) return;

    const current = reviews[currentIndex];
    container.innerHTML = `
      <div class="review-quote-wrap">
        <blockquote class="review-quote">
          “${escapeHTML(current.quote)}”
        </blockquote>
        <div class="review-author">
          <div>
            <strong>${escapeHTML(current.name)}</strong> · 
            <span class="text-muted">${escapeHTML(current.service || '')}${current.branch ? `, ${escapeHTML(current.branch)}` : ''}</span>
          </div>
          <span class="label">${escapeHTML(current.source || 'Verified Client')} · ${escapeHTML(current.rating || '5/5')}</span>
        </div>
      </div>
      ${reviews.length > 1 ? `
        <div class="review-controls" style="display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-3);">
          <button type="button" class="btn btn--outline" id="prev-review" aria-label="Previous review">← Prev</button>
          <button type="button" class="btn btn--outline" id="next-review" aria-label="Next review">Next →</button>
        </div>
      ` : ''}
    `;

    const prevBtn = $("#prev-review");
    const nextBtn = $("#next-review");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        renderReviews();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % reviews.length;
        renderReviews();
      });
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", renderReviews);
    } else {
      renderReviews();
    }
  }

  window.AAINA.reviewsModule = {
    render: renderReviews
  };
})();
