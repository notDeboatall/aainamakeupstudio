/**
 * js/hero.js — "Quiet Cover" Hero Component
 * Aaina Makeup Studio (Odisha)
 * Complies with DESIGN §5, PRD §6 F0, CONTENT §Cover, Decision D23
 * 
 * Principle: One focal point (subject in mirror), one message (headline), one action (CTA).
 * 
 * Features:
 * - Single locked stage geometry with pop-out dual-layer mask
 * - 2 issues: Bridal (paper) & Editorial (ink)
 * - 9s autoplay with comprehensive pause triggers
 * - Permanent autoplay stop on manual switch
 * - Touch swipe & keyboard navigation
 * - Theme-color address bar synchronization
 * - Sindoor debug overlay mode (?debug=hero)
 * - Zero parallax, zero scroll scaling, zero clutter
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $, $$, prefersReducedMotion } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s),
    $$: (s, c = document) => Array.from(c.querySelectorAll(s)),
    prefersReducedMotion: () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  const coverEl = $("#cover");
  if (!coverEl) return;

  const heroData = (window.AAINA.site && window.AAINA.site.hero) || {
    autoplayMs: 9000,
    issues: [
      {
        id: "bridal",
        eyebrow: "The Bridal Issue · Vol. 01",
        theme: "paper",
        image: "assets/img/hero/cover-01.webp",
        width: 1024,
        height: 1536,
        anchorX: 60.40,
        scale: 1.0,
        offsetY: 0,
        alt: "Editorial bridal beauty portrait with Sambalpuri drape, silver choker and traditional crimson accents"
      },
      {
        id: "editorial",
        eyebrow: "The Editorial Issue · Vol. 02",
        theme: "ink",
        image: "assets/img/hero/cover-02.webp",
        width: 1024,
        height: 1536,
        anchorX: 57.23,
        scale: 0.81,
        offsetY: 10,
        alt: "Contemporary editorial photoshoot portrait with graphic eyeliner, bold lip and silver statement earrings"
      }
    ]
  };

  const issues = heroData.issues;
  if (!issues || issues.length === 0) return;

  let activeIndex = 0;
  let autoplayTimer = null;
  let hasSwitchedManually = false;
  let isHovered = false;
  let isFocused = false;
  let isIntersecting = true;
  let isTabHidden = document.visibilityState === "hidden";
  let touchStartX = 0;
  let touchStartY = 0;
  const AUTOPLAY_MS = heroData.autoplayMs || 9000;

  // DOM Elements
  const cutoutsContainer = $(".hero-cover__cutouts", coverEl);
  const eyebrowEl = $(".hero-cover__eyebrow", coverEl);
  const liveRegion = $(".hero-cover__live", coverEl);
  const dotBtns = $$(".hero-cover__dot", coverEl);

  function isReduced() {
    return prefersReducedMotion();
  }

  function shouldPause() {
    return hasSwitchedManually || isHovered || isFocused || !isIntersecting || isTabHidden || isReduced();
  }

  /**
   * Switch active issue
   */
  function setIssue(index, manual = false) {
    if (index < 0 || index >= issues.length) return;
    if (index === activeIndex && !manual) return;

    if (manual) {
      hasSwitchedManually = true;
      stopAutoplay();
    }

    activeIndex = index;
    const issue = issues[activeIndex];

    // 1. Update data-issue on root section for CSS variable theme switching
    coverEl.dataset.issue = issue.id;

    // 2. Sync theme-color meta tag for native mobile browser chrome
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.content = issue.id === "editorial" ? "#0F0E0D" : "#FBF8F3";
    }

    // 3. Update eyebrow text
    if (eyebrowEl) {
      eyebrowEl.textContent = issue.eyebrow;
    }

    // 4. Update active subject cutout
    const subjects = $$(".hero-cover__subject", cutoutsContainer);
    subjects.forEach((sub, i) => {
      const issueItem = issues[i];
      const isActive = i === activeIndex;
      sub.classList.toggle("is-active", isActive);
      sub.setAttribute("aria-hidden", isActive ? "false" : "true");

      if (issueItem) {
        sub.style.setProperty("--issue-anchor-x", `${issueItem.anchorX || 50}%`);
        sub.style.setProperty("--issue-scale", `${issueItem.scale || 1}`);
        sub.style.setProperty("--issue-offset-y", `${issueItem.offsetY || 0}px`);
      }

      // Update alt text on active image
      const img = sub.querySelector(".hero-cover__img");
      if (img) {
        img.setAttribute("alt", isActive ? issue.alt : "");
      }
    });

    // 5. Update quiet issue switcher dots
    dotBtns.forEach((btn, i) => {
      const isActive = i === activeIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "true" : "false");
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // 6. Screen reader announcement
    if (liveRegion) {
      liveRegion.textContent = `Showing issue ${activeIndex + 1}: ${issue.eyebrow}`;
    }

    // 7. Restart autoplay timer if active
    if (!shouldPause()) {
      startAutoplay();
    }
  }

  /**
   * Start autoplay cycle
   */
  function startAutoplay() {
    stopAutoplay();
    if (shouldPause()) return;

    autoplayTimer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % issues.length;
      setIssue(nextIndex, false);
    }, AUTOPLAY_MS);
  }

  /**
   * Stop autoplay timer
   */
  function stopAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Event Listeners: Quiet Dots
  dotBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      setIssue(idx, true);
    });
  });

  // Hover & Focus Pauses
  coverEl.addEventListener("mouseenter", () => {
    isHovered = true;
    stopAutoplay();
  });
  coverEl.addEventListener("mouseleave", () => {
    isHovered = false;
    startAutoplay();
  });

  coverEl.addEventListener("focusin", () => {
    isFocused = true;
    stopAutoplay();
  });
  coverEl.addEventListener("focusout", (e) => {
    if (!coverEl.contains(e.relatedTarget)) {
      isFocused = false;
      startAutoplay();
    }
  });

  // Tab visibility pause
  document.addEventListener("visibilitychange", () => {
    isTabHidden = document.visibilityState === "hidden";
    if (isTabHidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // IntersectionObserver: Pause when hero is off-screen
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(coverEl);
  }

  // Touch Horizontal Swipe Gesture
  coverEl.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  coverEl.addEventListener("touchend", (e) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) >= 40) {
      if (diffX < 0) {
        setIssue((activeIndex + 1) % issues.length, true);
      } else {
        setIssue((activeIndex - 1 + issues.length) % issues.length, true);
      }
    }
  }, { passive: true });

  // Keyboard navigation on dots or hero container
  coverEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIssue((activeIndex - 1 + issues.length) % issues.length, true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setIssue((activeIndex + 1) % issues.length, true);
    }
  });

  /**
   * Compute and set exact masthead font-size so the tight word spans the container exactly
   * Complies with Requirement 2:
   * "Use letter-spacing between 0 and +0.02em, set white-space: nowrap, and compute font-size
   * from the container width so the word spans the container exactly (left edge = logo/left gutter edge,
   * right edge = container right edge). Letters must not touch. Keep thick-hairline font settings."
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

  // Bind fitMasthead to resize, container changes, and font loading
  window.addEventListener("resize", fitMasthead, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitMasthead);
  }
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => fitMasthead());
    const wrap = $(".hero-cover__masthead-wrap", coverEl);
    if (wrap) ro.observe(wrap);
  }

  // Initialize
  setIssue(0);
  fitMasthead();
  if (!isReduced()) {
    startAutoplay();
  }

})();
