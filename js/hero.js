/**
 * js/hero.js — "The Cover" Hero Component
 * Aaina Makeup Studio (Odisha)
 * Follows DESIGN.md & Decision D25
 * 
 * Features:
 * - Volume 1 (The Bridal Issue) standalone presentation
 * - Computes and fits exact masthead font-size across viewports without letter collisions
 * - Responsive updates on resize, font loading, and container dimensions
 * - Zero console errors, zero dead code
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $ } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s)
  };

  const coverEl = $("#cover");
  if (!coverEl) return;

  /**
   * Compute and set exact masthead font-size so the word spans the container exactly
   * from the left edge to the right edge with tight letter-spacing and no collisions.
   */
  function fitMasthead() {
    const masthead = $(".hero-cover__masthead", coverEl);
    const wrap = $(".hero-cover__masthead-wrap", coverEl);
    if (!masthead || !wrap) return;

    const targetWidth = wrap.clientWidth;
    if (targetWidth <= 0) return;

    // Use a fixed reference measurement font size
    masthead.style.fontSize = "100px";
    masthead.style.letterSpacing = "0.015em";
    masthead.style.whiteSpace = "nowrap";

    const measuredWidth = masthead.scrollWidth;
    if (measuredWidth > 0) {
      const calculatedFontSize = (targetWidth / measuredWidth) * 100;
      masthead.style.fontSize = `${calculatedFontSize}px`;
    }
  }

  // Bind fitMasthead to window resize, container changes, and font loading
  window.addEventListener("resize", fitMasthead, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitMasthead);
  }

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => fitMasthead());
    const wrap = $(".hero-cover__masthead-wrap", coverEl);
    if (wrap) ro.observe(wrap);
  }

  // Initial calculation
  fitMasthead();

})();
