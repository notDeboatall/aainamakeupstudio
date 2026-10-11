/**
 * js/carousel.js — Lookbook 3D Coverflow Carousel (Home Page)
 * Aaina Makeup Studio
 * Complies with PRD §6 F3, DESIGN §5, Image Brief §1 & §2, Decision D16
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $, escapeHTML } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s),
    escapeHTML: s => (s || "").replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[m])
  };

  let activeIndex = 0;
  let items = [];
  let cards = [];
  let autoplayTimer = null;
  let isAutoplayPausedByUser = false;
  let isHovered = false;
  let isFocused = false;
  let isIntersecting = true;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let hasDragged = false;

  const AUTOPLAY_INTERVAL = 5000;
  const DRAG_THRESHOLD = 40;

  /**
   * Check if reduced motion is preferred
   */
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * Filter featured items from window.AAINA.gallery
   */
  function getFeaturedItems() {
    const all = window.AAINA.gallery || [];
    // Only featured items that are not placeholders
    return all.filter(item => item.featured && !item.placeholder);
  }

  /**
   * Render placeholder block if image fails to load
   */
  function createPlaceholder(item) {
    const ph = document.createElement("div");
    ph.className = "aaina-placeholder carousel__placeholder";
    ph.innerHTML = `
      <span class="aaina-placeholder__label">${escapeHTML(item.category ? item.category.toUpperCase() : "LOOKBOOK")}</span>
      <div class="aaina-placeholder__bottom">
        <span class="aaina-placeholder__title">Photo coming soon</span>
        <span class="aaina-placeholder__desc">${escapeHTML(item.title || "Featured Look")}</span>
      </div>
    `;
    return ph;
  }

  /**
   * Calculate circular offset
   */
  function getOffset(index, active, total) {
    let diff = index - active;
    diff = ((diff % total) + total) % total;
    if (diff > total / 2) {
      diff -= total;
    }
    return diff;
  }

  /**
   * Update 3D card layout variables and state
   */
  function updateLayout() {
    const total = items.length;
    if (total === 0) return;

    cards.forEach((card, i) => {
      const diff = getOffset(i, activeIndex, total);
      const absDiff = Math.abs(diff);

      card.style.setProperty("--o", String(diff));
      card.style.setProperty("--a", String(absDiff));

      // Visual & interaction visibility
      if (absDiff > 2) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.setAttribute("aria-hidden", "true");
        card.setAttribute("tabindex", "-1");
        card.classList.remove("is-active", "is-neighbor");
      } else if (absDiff === 0) {
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
        card.setAttribute("aria-hidden", "false");
        card.setAttribute("tabindex", "0");
        card.classList.add("is-active");
        card.classList.remove("is-neighbor");
      } else {
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
        card.setAttribute("aria-hidden", "true");
        card.setAttribute("tabindex", "-1");
        card.classList.add("is-neighbor");
        card.classList.remove("is-active");
      }

      // Stacking order: active in front, immediate neighbors behind, outer behind
      const z = absDiff === 0 ? 10 : absDiff === 1 ? 6 : absDiff === 2 ? 3 : 1;
      card.style.zIndex = String(z);

      // Preload images within offset ±2
      if (absDiff <= 2) {
        const img = card.querySelector("img");
        if (img && img.loading === "lazy") {
          img.loading = "eager";
        }
      }
    });

    updateCaption();
    updateCounter();
  }

  /**
   * Update active caption below stage with cross-fade
   */
  function updateCaption() {
    const infoWrap = $("#carousel-caption-info");
    const bookBtn = $("#carousel-book-btn");
    const item = items[activeIndex];
    if (!item || !infoWrap) return;

    // Trigger cross-fade
    infoWrap.classList.add("is-changing");

    setTimeout(() => {
      const catEl = infoWrap.querySelector(".carousel__caption-cat");
      const titleEl = infoWrap.querySelector(".carousel__caption-title");
      const metaEl = infoWrap.querySelector(".carousel__caption-meta");

      if (catEl) catEl.textContent = (item.category || "BRIDAL").toUpperCase();
      if (titleEl) titleEl.textContent = item.title;
      if (metaEl) {
        const metaParts = [];
        if (item.year) metaParts.push(item.year);
        if (item.credit) metaParts.push(item.credit);
        metaEl.textContent = metaParts.join(" · ");
      }

      if (bookBtn) {
        bookBtn.dataset.service = item.category || "bridal";
        bookBtn.dataset.reference = item.title || "";
        bookBtn.setAttribute("aria-label", `Book ${item.title} on WhatsApp`);
      }

      infoWrap.classList.remove("is-changing");
    }, 100);
  }

  /**
   * Update slide counter ("02 / 06")
   */
  function updateCounter() {
    const counter = $("#carousel-counter");
    if (!counter) return;
    const current = String(activeIndex + 1).padStart(2, "0");
    const total = String(items.length).padStart(2, "0");
    counter.textContent = `${current} / ${total}`;
  }

  /**
   * Navigate to index
   */
  function goTo(index) {
    const total = items.length;
    if (total === 0) return;
    activeIndex = ((index % total) + total) % total;
    updateLayout();
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function prev() {
    goTo(activeIndex - 1);
  }

  /**
   * Autoplay management
   */
  function shouldAutoplay() {
    if (prefersReducedMotion()) return false;
    if (isAutoplayPausedByUser) return false;
    if (isHovered || isFocused || !isIntersecting) return false;
    if (document.visibilityState !== "visible") return false;
    return true;
  }

  function startAutoplay() {
    stopAutoplay();
    if (!shouldAutoplay()) return;
    autoplayTimer = setInterval(() => {
      if (shouldAutoplay()) {
        next();
      }
    }, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function toggleAutoplay() {
    isAutoplayPausedByUser = !isAutoplayPausedByUser;
    const btn = $("#carousel-playpause");
    if (btn) {
      btn.textContent = isAutoplayPausedByUser ? "Play" : "Pause";
      btn.setAttribute("aria-label", isAutoplayPausedByUser ? "Play carousel autoplay" : "Pause carousel autoplay");
    }
    if (isAutoplayPausedByUser) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }

  /**
   * Handle card click (side card -> center, center card -> lightbox)
   */
  function handleCardClick(index) {
    const diff = getOffset(index, activeIndex, items.length);
    if (diff !== 0) {
      goTo(index);
    } else {
      openActiveLightbox();
    }
  }

  /**
   * Open lightbox for active item
   */
  function openActiveLightbox() {
    const item = items[activeIndex];
    if (!item) return;

    if (window.AAINA.galleryModule && typeof window.AAINA.galleryModule.openLightbox === "function") {
      window.AAINA.galleryModule.openLightbox(item.id);
    } else {
      window.location.href = `gallery.html#${item.category || "bridal"}`;
    }
  }

  /**
   * Setup pointer drag / swipe events
   */
  function setupDragEvents(stage) {
    stage.addEventListener("pointerdown", e => {
      // Don't drag if click originates from interactive buttons
      if (e.target.closest("button") || e.target.closest("a")) return;

      isDragging = true;
      hasDragged = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      stage.setPointerCapture(e.pointerId);
      stopAutoplay();
    });

    stage.addEventListener("pointermove", e => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      if (Math.abs(dx) > 10) {
        hasDragged = true;
      }
    });

    const endDrag = e => {
      if (!isDragging) return;
      isDragging = false;
      try {
        if (stage.hasPointerCapture(e.pointerId)) {
          stage.releasePointerCapture(e.pointerId);
        }
      } catch (err) {
        // Ignored
      }

      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) >= DRAG_THRESHOLD) {
        if (dx < 0) {
          next();
        } else {
          prev();
        }
      }
      startAutoplay();
    };

    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
  }

  /**
   * Setup keyboard navigation
   */
  function setupKeyboardEvents(wrapper) {
    wrapper.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(items.length - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        if (document.activeElement && document.activeElement.classList.contains("carousel__card")) {
          e.preventDefault();
          const cardIdx = Number(document.activeElement.dataset.index);
          handleCardClick(cardIdx);
        }
      }
    });
  }

  /**
   * Setup visibility and intersection observers
   */
  function setupObservers(wrapper) {
    // Page visibility (tab change)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    });

    // Viewport intersection observer
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        });
      }, { threshold: 0.25 });

      observer.observe(wrapper);
    }
  }

  /**
   * Initialize and build carousel markup
   */
  function initCarousel() {
    const root = $("#lookbook-carousel");
    if (!root) return;

    let mount = root;
    if (root.tagName.toLowerCase() === "section") {
      const container = root.querySelector(".container") || root;
      let inner = container.querySelector("#lookbook-carousel-mount") || container.querySelector("#home-lookbook-grid") || container.querySelector(".carousel");
      if (!inner) {
        inner = document.createElement("div");
        inner.id = "lookbook-carousel-mount";
        container.appendChild(inner);
      }
      mount = inner;
    }

    items = getFeaturedItems();
    if (items.length === 0) {
      mount.innerHTML = `
        <div style="padding: var(--space-6); text-align: center;">
          <p class="lead">Lookbook preview loading.</p>
        </div>
      `;
      return;
    }

    // Build carousel DOM structure
    mount.innerHTML = `
      <div class="carousel" role="region" aria-roledescription="carousel" aria-label="Lookbook Featured Faces" tabindex="0">
        <div class="carousel__stage">
          <div class="carousel__track"></div>
        </div>

        <div class="carousel__caption-wrap">
          <div class="carousel__caption-info" id="carousel-caption-info" aria-live="polite">
            <span class="carousel__caption-cat">BRIDAL</span>
            <h3 class="carousel__caption-title">Featured Look</h3>
            <div class="carousel__caption-meta"></div>
          </div>

          <div class="carousel__actions-wrap">
            <button type="button" class="btn btn--primary carousel__btn-book" id="carousel-book-btn" data-book data-service="bridal" data-reference="">
              Book this look <span class="btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div class="carousel__controls-bar">
          <div class="carousel__controls">
            <button type="button" class="carousel__btn-text" id="carousel-prev" aria-label="Previous look">Prev</button>
            <span class="carousel__counter" id="carousel-counter" aria-label="Current slide">01 / ${String(items.length).padStart(2, "0")}</span>
            <button type="button" class="carousel__btn-text" id="carousel-next" aria-label="Next look">Next</button>
            <span class="carousel__controls-sep" aria-hidden="true">/</span>
            <button type="button" class="carousel__btn-text" id="carousel-playpause" aria-label="Pause autoplay">${prefersReducedMotion() ? "Play" : "Pause"}</button>
          </div>
        </div>
      </div>
    `;

    const wrapper = $(".carousel", mount);
    const stage = $(".carousel__stage", wrapper);
    const track = $(".carousel__track", stage);

    // Build cards
    cards = items.map((item, index) => {
      const card = document.createElement("article");
      card.className = "carousel__card hairline";
      card.setAttribute("role", "group");
      card.setAttribute("aria-roledescription", "slide");
      card.setAttribute("aria-label", `${index + 1} of ${items.length}: ${item.title}`);
      card.dataset.index = String(index);
      card.dataset.id = item.id;

      // Image element
      const img = document.createElement("img");
      img.className = "carousel__card-img";
      img.src = item.thumb || item.src;
      img.alt = item.alt || item.title;
      img.width = item.width || 1200;
      img.height = item.height || 1600;
      img.style.objectPosition = item.focus || "50% 50%";
      img.loading = index < 3 ? "eager" : "lazy";

      // Graceful error fallback
      img.addEventListener("error", () => {
        img.remove();
        const ph = createPlaceholder(item);
        card.prepend(ph);
      });

      // Flat depth ink overlay
      const overlay = document.createElement("div");
      overlay.className = "carousel__card-overlay";
      overlay.setAttribute("aria-hidden", "true");

      card.appendChild(img);
      card.appendChild(overlay);

      // Card click
      card.addEventListener("click", e => {
        if (hasDragged) return;
        handleCardClick(index);
      });

      track.appendChild(card);
      return card;
    });

    // Button interactions
    $("#carousel-prev", wrapper).addEventListener("click", () => {
      prev();
      startAutoplay();
    });

    $("#carousel-next", wrapper).addEventListener("click", () => {
      next();
      startAutoplay();
    });

    $("#carousel-playpause", wrapper).addEventListener("click", toggleAutoplay);

    // Hover & focus pausing
    wrapper.addEventListener("mouseenter", () => {
      isHovered = true;
      stopAutoplay();
    });

    wrapper.addEventListener("mouseleave", () => {
      isHovered = false;
      startAutoplay();
    });

    wrapper.addEventListener("focusin", () => {
      isFocused = true;
      stopAutoplay();
    });

    wrapper.addEventListener("focusout", () => {
      isFocused = false;
      startAutoplay();
    });

    // Touch / Pointer drag
    setupDragEvents(stage);

    // Keyboard events
    setupKeyboardEvents(wrapper);

    // Observers
    setupObservers(wrapper);

    // If reduced motion is requested, start in paused state
    if (prefersReducedMotion()) {
      isAutoplayPausedByUser = true;
    }

    // Initial update
    updateLayout();
    startAutoplay();
  }

  // Public module API
  window.AAINA.carousel = {
    init: initCarousel,
    next,
    prev,
    goTo,
    toggleAutoplay,
    getActiveIndex: () => activeIndex,
    getItems: () => items
  };

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCarousel);
    } else {
      initCarousel();
    }
  }
})();
