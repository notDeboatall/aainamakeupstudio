/**
 * js/hero.js — "The Cover" Dynamic Magazine Hero Component
 * Aaina Makeup Studio (Odisha)
 * Complies with PRD §6 F0, DESIGN §1 & §5, CONTENT §Cover, Decision D18
 * 
 * 4 Layers:
 * - L0: Mirror Oval (var(--bone) with 1px hairline, subject breaks out)
 * - L1: Masthead "AAINA" (sits behind subject, no letter collision)
 * - L2: Subject Cutout (transparent WebP with alpha, unboxed, baseline-anchored)
 * - L3: Text column & pin callouts (6px sindoor dot, 1px line, flat label)
 * 
 * Features:
 * - 2 issues: 01 Bridal (paper) & 02 Editorial (ink)
 * - 6.5s autoplay with clip-path wipe & crossfade
 * - Pause triggers: hover, focus, touch, tab hidden, IntersectionObserver off-screen
 * - Pointer parallax in requestAnimationFrame (desktop fine pointer only)
 * - Scroll-depth scaling 1 -> 1.04
 * - Full accessibility: aria-roledescription="carousel", polite live announcements, visible focus
 * - prefers-reduced-motion & no-JS fallback
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $, $$, el, escapeHTML, prefersReducedMotion } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s),
    $$: (s, c = document) => Array.from(c.querySelectorAll(s)),
    el: (tag, attrs = {}) => Object.assign(document.createElement(tag), attrs),
    escapeHTML: s => (s || "").replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[m]),
    prefersReducedMotion: () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  const coverEl = $("#cover");
  if (!coverEl) return;

  const heroData = (window.AAINA.site && window.AAINA.site.hero) || {
    autoplayMs: 6500,
    issues: [
      {
        id: "bridal",
        label: "01 Bridal",
        eyebrow: "The Bridal Issue · Vol. 01",
        theme: "paper",
        image: "assets/img/hero/cover-01.webp",
        width: 933,
        height: 1400,
        alt: "Editorial bridal beauty portrait with Sambalpuri drape, silver choker and traditional crimson accents",
        callouts: [
          { label: "Bridal — the full look →", href: "services.html#service-bridal", x: 42, y: 68, side: "left" },
          { label: "Reception & Engagement →", href: "services.html#service-reception", x: 74, y: 62, side: "right" },
          { label: "Hair & Saree draping →", href: "services.html#service-hair-saree", x: 92, y: 40, side: "right" }
        ]
      },
      {
        id: "editorial",
        label: "02 Editorial",
        eyebrow: "The Editorial Issue · Vol. 02",
        theme: "ink",
        image: "assets/img/hero/cover-02.webp",
        width: 933,
        height: 1400,
        alt: "Contemporary editorial photoshoot portrait with graphic eyeliner, bold lip and silver statement earrings",
        callouts: [
          { label: "Editorial & Photoshoot →", href: "services.html#service-editorial", x: 32, y: 78, side: "left" },
          { label: "Party Glam →", href: "services.html#service-party", x: 94, y: 53, side: "right" },
          { label: "Hair & Saree draping →", href: "services.html#service-hair-saree", x: 75, y: 90, side: "right" }
        ]
      }
    ]
  };

  const issues = heroData.issues;
  if (!issues || issues.length === 0) return;

  let activeIndex = 0;
  let autoplayTimer = null;
  let autoplayProgressTimer = null;
  let autoplayStartTime = 0;
  let isPausedByUser = false;
  let isHovered = false;
  let isFocused = false;
  let isIntersecting = true;
  let isTabHidden = document.visibilityState === "hidden";
  let touchStartX = 0;
  let touchStartY = 0;
  const AUTOPLAY_MS = heroData.autoplayMs || 6500;

  // DOM Elements
  const mastheadWrap = $(".hero-cover__masthead-wrap", coverEl);
  const ovalEl = $(".hero-cover__oval", coverEl);
  const cutoutsContainer = $(".hero-cover__cutouts", coverEl);
  const eyebrowEl = $(".hero-cover__eyebrow", coverEl);
  const liveRegion = $(".hero-cover__live", coverEl);
  const issueBtns = $$(".hero-cover__issue-btn", coverEl);
  const pauseBtn = $(".hero-cover__pause-btn", coverEl);
  const mobileCalloutSnap = $(".hero-cover__mobile-callouts", coverEl);

  /**
   * Safe check for reduced motion
   */
  function isReduced() {
    return prefersReducedMotion();
  }

  /**
   * Switch active issue
   */
  function setIssue(index, manual = false) {
    if (index < 0 || index >= issues.length) return;
    if (index === activeIndex && !manual) return;

    activeIndex = index;
    const issue = issues[activeIndex];

    // 1. Update data-issue on root section for CSS variable theme switching
    coverEl.dataset.issue = issue.id;

    // 2. Update eyebrow text with smooth transition
    if (eyebrowEl) {
      eyebrowEl.textContent = issue.eyebrow;
    }

    // 3. Update active subject cutout & callouts
    const subjects = $$(".hero-cover__subject", cutoutsContainer);
    subjects.forEach((sub, i) => {
      const isActive = i === activeIndex;
      sub.classList.toggle("is-active", isActive);
      sub.setAttribute("aria-hidden", isActive ? "false" : "true");
      
      const img = sub.querySelector("img");
      if (img) {
        if (isActive) {
          img.setAttribute("alt", issue.alt);
        }
      }
    });

    // 4. Update switcher buttons & progress
    issueBtns.forEach((btn, i) => {
      const isActive = i === activeIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "true" : "false");
      const bar = btn.querySelector(".hero-cover__progress-bar");
      if (bar) {
        bar.style.width = isActive ? "0%" : "0%";
      }
    });

    // 5. Update mobile scroll-snap callouts if present
    updateMobileCallouts(issue);

    // 6. Announce change to screen readers
    if (liveRegion) {
      liveRegion.textContent = `Showing ${issue.label}: ${issue.eyebrow}`;
    }

    // 7. Reset autoplay progress timer
    if (!isPaused() && !isReduced()) {
      startAutoplay();
    }
  }

  /**
   * Update mobile scroll-snap callout strip
   */
  function updateMobileCallouts(issue) {
    if (!mobileCalloutSnap) return;
    mobileCalloutSnap.innerHTML = "";
    (issue.callouts || []).forEach(c => {
      const a = document.createElement("a");
      a.href = c.href;
      a.className = "hero-cover__mobile-callout-link";
      a.textContent = c.label;
      mobileCalloutSnap.appendChild(a);
    });
  }

  /**
   * Check if autoplay should be paused
   */
  function isPaused() {
    return isPausedByUser || isHovered || isFocused || !isIntersecting || isTabHidden || isReduced();
  }

  /**
   * Start autoplay cycle
   */
  function startAutoplay() {
    stopAutoplay();
    if (isPaused() || isReduced()) return;

    autoplayStartTime = performance.now();
    const activeBtn = issueBtns[activeIndex];
    const progressBar = activeBtn ? activeBtn.querySelector(".hero-cover__progress-bar") : null;

    function tick(now) {
      if (isPaused()) {
        if (progressBar) progressBar.style.width = "0%";
        return;
      }
      const elapsed = now - autoplayStartTime;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      if (progressBar) {
        progressBar.style.width = `${pct}%`;
      }

      if (elapsed >= AUTOPLAY_MS) {
        const nextIndex = (activeIndex + 1) % issues.length;
        setIssue(nextIndex);
      } else {
        autoplayProgressTimer = requestAnimationFrame(tick);
      }
    }

    autoplayProgressTimer = requestAnimationFrame(tick);
  }

  /**
   * Stop autoplay timers
   */
  function stopAutoplay() {
    if (autoplayProgressTimer) {
      cancelAnimationFrame(autoplayProgressTimer);
      autoplayProgressTimer = null;
    }
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
    issueBtns.forEach(btn => {
      const bar = btn.querySelector(".hero-cover__progress-bar");
      if (bar) bar.style.width = "0%";
    });
  }

  /**
   * Update pause button UI state
   */
  function updatePauseBtn() {
    if (!pauseBtn) return;
    const paused = isPausedByUser || isReduced();
    pauseBtn.textContent = paused ? "Play" : "Pause";
    pauseBtn.setAttribute("aria-label", paused ? "Resume cover autoplay" : "Pause cover autoplay");
    pauseBtn.setAttribute("title", paused ? "Resume cover autoplay" : "Pause cover autoplay");
  }

  // Event Listeners: Issue Switcher Buttons
  issueBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      setIssue(idx, true);
    });
  });

  // Pause / Play Toggle
  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      isPausedByUser = !isPausedByUser;
      updatePauseBtn();
      if (isPausedByUser) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

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

  // IntersectionObserver: Pause when hero scrolls out of view
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

  // Touch Swipe (Left/Right swipe advances issue)
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
    // Ensure horizontal gesture with >= 40px threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) >= 40) {
      if (diffX < 0) {
        // Swipe left -> next issue
        setIssue((activeIndex + 1) % issues.length, true);
      } else {
        // Swipe right -> prev issue
        setIssue((activeIndex - 1 + issues.length) % issues.length, true);
      }
    }
  }, { passive: true });

  // Keyboard navigation when focused on hero or controls
  coverEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIssue((activeIndex - 1 + issues.length) % issues.length, true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setIssue((activeIndex + 1) % issues.length, true);
    }
  });

  /* -------------------------------------------------------------
     Pointer Parallax in requestAnimationFrame (Desktop Fine Pointer Only)
     ------------------------------------------------------------- */
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isPointerMoving = false;
  let parallaxActive = false;

  const hasFinePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  function onPointerMove(e) {
    if (isReduced() || !hasFinePointer) return;
    const rect = coverEl.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    // Normalized coordinates from center (-1 to +1)
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    targetX = Math.max(-1, Math.min(1, normX));
    targetY = Math.max(-1, Math.min(1, normY));
    isPointerMoving = true;
  }

  function updateParallax() {
    if (isReduced() || !hasFinePointer) {
      parallaxActive = false;
      return;
    }

    // Lerp towards target
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    // Parallax limits from spec:
    // Masthead: ±6px (opposite direction to pointer)
    // Oval: ±10px (opposite direction)
    // Subject: ±14px (with pointer)
    // Callouts: ±20px (with pointer)
    const mastheadOffset = currentX * -6;
    const ovalOffset = currentX * -10;
    const subjectOffset = currentX * 14;
    const calloutOffset = currentX * 20;

    if (mastheadWrap) {
      mastheadWrap.style.transform = `translate3d(${mastheadOffset.toFixed(2)}px, ${(currentY * -3).toFixed(2)}px, 0)`;
    }
    if (ovalEl) {
      ovalEl.style.transform = `translate3d(${ovalOffset.toFixed(2)}px, ${(currentY * -5).toFixed(2)}px, 0)`;
    }

    const activeSubject = $(".hero-cover__subject.is-active", cutoutsContainer);
    if (activeSubject) {
      const activeImg = activeSubject.querySelector(".hero-cover__img");
      if (activeImg) {
        activeImg.style.transform = `translate3d(${subjectOffset.toFixed(2)}px, ${(currentY * 7).toFixed(2)}px, 0)`;
      }
      const callouts = activeSubject.querySelector(".hero-cover__callouts");
      if (callouts) {
        callouts.style.transform = `translate3d(${calloutOffset.toFixed(2)}px, ${(currentY * 10).toFixed(2)}px, 0)`;
      }
    }

    requestAnimationFrame(updateParallax);
  }

  if (hasFinePointer && !isReduced()) {
    coverEl.addEventListener("mousemove", onPointerMove, { passive: true });
    requestAnimationFrame(updateParallax);
  }

  /* -------------------------------------------------------------
     Scroll Depth Scaling (Subject scales 1 -> 1.04 as page scrolls)
     ------------------------------------------------------------- */
  let scrollTicking = false;
  function onScroll() {
    if (isReduced() || scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const rect = coverEl.getBoundingClientRect();
      const heroHeight = rect.height;
      if (rect.bottom > 0 && rect.top <= 0) {
        // Scrolled between top of hero and bottom of hero
        const progress = Math.min(1, Math.max(0, -rect.top / heroHeight));
        const scale = 1 + progress * 0.04; // 1.0 -> 1.04
        coverEl.style.setProperty("--hero-scroll-scale", scale.toFixed(3));
      } else {
        coverEl.style.setProperty("--hero-scroll-scale", "1");
      }
      scrollTicking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* -------------------------------------------------------------
     Intro Animation (≤ 1.2s, plays once on first load)
     ------------------------------------------------------------- */
  function playIntro() {
    if (isReduced()) {
      coverEl.classList.add("is-loaded");
      return;
    }
    // Set trigger class on container after first paint
    requestAnimationFrame(() => {
      coverEl.classList.add("is-intro-active");
      setTimeout(() => {
        coverEl.classList.add("is-loaded");
        coverEl.classList.remove("is-intro-active");
        startAutoplay();
      }, 1200);
    });
  }

  // Initialize
  setIssue(0);
  updatePauseBtn();
  playIntro();

})();
