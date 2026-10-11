/**
 * js/gallery.js — Lookbook Card Rendering, Category Filtering, Deep Linking, & Lightbox
 * Aaina Makeup Studio
 * Complies with PRD §6 F3, DESIGN §5, Image Brief §1 & §2
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $, $$, el, escapeHTML, formatAspectRatio } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s),
    $$: (s, c = document) => Array.from(c.querySelectorAll(s)),
    el: (tag, attrs, ...ch) => {
      const e = document.createElement(tag);
      Object.assign(e, attrs);
      ch.forEach(c => c && e.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
      return e;
    },
    escapeHTML: s => s,
    formatAspectRatio: r => (r || "4/5").replace(":", " / ").replace("/", " / ")
  };

  let currentCategory = "all";
  let activeLightboxIndex = 0;
  let activeVisibleItems = [];
  let previousFocusEl = null;

  /**
   * Get public gallery items (omitting placeholder: true per Image Brief §2)
   */
  function getPublicItems() {
    const allItems = window.AAINA.gallery || [];
    return allItems.filter(item => !item.placeholder);
  }

  /**
   * Render Filter Buttons
   * Rule: Hide any category with zero visible items (Image Brief §2)
   */
  function renderFilterBar() {
    const container = $("#gallery-filters");
    if (!container) return;

    const publicItems = getPublicItems();
    const categories = window.AAINA.galleryCategories || [];

    // Calculate count per category
    const validCategories = categories.filter(cat => {
      if (cat.id === "all") return publicItems.length > 0;
      return publicItems.some(item => item.category === cat.id);
    });

    container.innerHTML = `
      <div class="gallery-filter-bar" role="tablist" aria-label="Lookbook categories">
        ${validCategories.map(cat => `
          <button type="button" class="filter-btn ${cat.id === currentCategory ? 'is-active' : ''}" 
                  data-category="${cat.id}" role="tab" aria-selected="${cat.id === currentCategory}">
            ${cat.label}
          </button>
        `).join("")}
      </div>
    `;

    // Filter button clicks
    $$(".filter-btn", container).forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.category;
        setFilter(cat);
        // Update URL hash
        window.location.hash = cat === "all" ? "" : cat;
      });
    });
  }

  /**
   * Set active category & re-render grid
   */
  function setFilter(cat) {
    currentCategory = cat;
    renderFilterBar();
    renderGalleryGrid();
  }

  /**
   * Render Gallery Cards Grid on gallery.html
   */
  function renderGalleryGrid() {
    const container = $("#gallery-grid");
    if (!container) return;

    const publicItems = getPublicItems();
    const filtered = currentCategory === "all"
      ? publicItems
      : publicItems.filter(item => item.category === currentCategory);

    activeVisibleItems = filtered;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding-block: var(--space-6); text-align: center;">
          <p class="lead">Nothing here yet. Check another category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    filtered.forEach((item, index) => {
      const isWide = item.ratio === "16/10" || item.ratio === "16:10";
      const card = el("article", {
        className: `gallery-card ${isWide ? 'gallery-card--wide' : ''}`,
        tabIndex: 0,
        role: "button",
        "aria-label": `View ${item.title} larger`,
        dataset: { index: String(index), id: item.id }
      });

      const mediaWrap = el("div", {
        className: "gallery-card__media",
        style: `aspect-ratio: ${formatAspectRatio(item.ratio)};`
      });

      const img = el("img", {
        className: "gallery-card__img",
        src: item.thumb || item.src,
        alt: item.alt || item.title,
        width: item.width || 1200,
        height: item.height || 1500,
        loading: "lazy",
        style: `object-position: ${item.focus || '50% 50%'};`
      });

      mediaWrap.appendChild(img);

      const caption = el("div", {
        className: "gallery-card__caption"
      });

      const catSpan = el("span", {
        className: "gallery-card__category"
      }, item.category.toUpperCase());

      const titleEl = el("strong", {
        className: "gallery-card__title"
      }, item.title);

      caption.appendChild(catSpan);
      caption.appendChild(titleEl);

      card.appendChild(mediaWrap);
      card.appendChild(caption);

      card.addEventListener("click", () => openLightbox(index));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(index);
        }
      });

      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  }

  /**
   * Render Featured Cards on Home Page Lookbook Teaser (index.html)
   */
  function renderHomeFeaturedLookbook() {
    const container = $("#home-lookbook-grid");
    if (!container) return;

    const publicItems = getPublicItems();
    const featured = publicItems.filter(item => item.featured).slice(0, 6);

    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    featured.forEach((item, index) => {
      const isWide = item.ratio === "16/10" || item.ratio === "16:10";
      const card = el("article", {
        className: `gallery-card ${isWide ? 'gallery-card--wide' : ''}`,
        tabIndex: 0,
        role: "button",
        "aria-label": `View ${item.title} larger`,
        dataset: { id: item.id }
      });

      const mediaWrap = el("div", {
        className: "gallery-card__media",
        style: `aspect-ratio: ${formatAspectRatio(item.ratio)};`
      });

      const img = el("img", {
        className: "gallery-card__img",
        src: item.thumb || item.src,
        alt: item.alt || item.title,
        width: item.width || 1200,
        height: item.height || 1500,
        loading: "lazy",
        style: `object-position: ${item.focus || '50% 50%'};`
      });

      mediaWrap.appendChild(img);

      const caption = el("div", {
        className: "gallery-card__caption"
      });

      caption.innerHTML = `
        <span class="gallery-card__category">${item.category.toUpperCase()}</span>
        <strong class="gallery-card__title">${escapeHTML(item.title)}</strong>
      `;

      card.appendChild(mediaWrap);
      card.appendChild(caption);

      // Clicking on home card triggers booking directly or navigates to lookbook
      card.addEventListener("click", () => {
        activeVisibleItems = featured;
        openLightbox(index);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activeVisibleItems = featured;
          openLightbox(index);
        }
      });

      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  }

  /**
   * Lightbox Modal Component (Tasks 3.6 & 4.9)
   */
  function ensureLightbox() {
    let lb = $("#gallery-lightbox");
    if (!lb) {
      lb = el("div", {
        id: "gallery-lightbox",
        className: "lightbox",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Lookbook Lightbox View"
      });
      document.body.appendChild(lb);
    }
    return lb;
  }

  function renderLightboxContent(lb, item) {
    lb.innerHTML = `
      <div class="lightbox__header">
        <span class="eyebrow eyebrow--inv">${item.category.toUpperCase()} LOOKBOOK</span>
        <button type="button" class="btn btn--outline" id="lightbox-close" aria-label="Close lightbox">Close ✕</button>
      </div>

      <div class="lightbox__stage" id="lightbox-stage">
        <button type="button" class="lightbox__btn-nav lightbox__btn-nav--prev" id="lightbox-prev" aria-label="Previous image">← Prev</button>
        <img src="${item.src}" alt="${item.alt || item.title}" class="lightbox__img" id="lightbox-img">
        <button type="button" class="lightbox__btn-nav lightbox__btn-nav--next" id="lightbox-next" aria-label="Next image">Next →</button>
      </div>

      <div class="lightbox__footer">
        <div>
          <h2 class="lightbox__caption-title">${escapeHTML(item.title)}</h2>
          <div class="lightbox__credit">
            ${item.year ? `${item.year}` : ''} ${item.credit ? `· ${escapeHTML(item.credit)}` : ''}
          </div>
        </div>
        <button type="button" class="btn btn--primary" data-book data-service="${item.category}" data-reference="${escapeHTML(item.title)}">
          Book this look →
        </button>
      </div>
    `;

    setupLightboxInteractions(lb);
  }

  function openLightbox(target) {
    if (typeof target === "string") {
      const allItems = getPublicItems();
      const idx = allItems.findIndex(it => it.id === target);
      if (idx !== -1) {
        activeVisibleItems = allItems;
        activeLightboxIndex = idx;
      }
    } else if (typeof target === "number") {
      activeLightboxIndex = target;
    } else if (target && typeof target === "object" && target.id) {
      const allItems = getPublicItems();
      const idx = allItems.findIndex(it => it.id === target.id);
      if (idx !== -1) {
        activeVisibleItems = allItems;
        activeLightboxIndex = idx;
      }
    }

    if (!activeVisibleItems || !activeVisibleItems[activeLightboxIndex]) return;
    previousFocusEl = document.activeElement;

    const lb = ensureLightbox();
    renderLightboxContent(lb, activeVisibleItems[activeLightboxIndex]);
    lb.classList.add("is-open");
    document.body.classList.add("modal-open");

    const closeBtn = $("#lightbox-close");
    if (closeBtn) closeBtn.focus();

    document.addEventListener("keydown", handleLightboxKeydown);
    setupTouchSwipe(lb);
  }

  function closeLightbox() {
    const lb = $("#gallery-lightbox");
    if (!lb) return;

    lb.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleLightboxKeydown);

    if (previousFocusEl && typeof previousFocusEl.focus === "function") {
      previousFocusEl.focus();
    }
  }

  function nextLightbox() {
    if (!activeVisibleItems.length) return;
    activeLightboxIndex = (activeLightboxIndex + 1) % activeVisibleItems.length;
    const lb = $("#gallery-lightbox");
    renderLightboxContent(lb, activeVisibleItems[activeLightboxIndex]);
  }

  function prevLightbox() {
    if (!activeVisibleItems.length) return;
    activeLightboxIndex = (activeLightboxIndex - 1 + activeVisibleItems.length) % activeVisibleItems.length;
    const lb = $("#gallery-lightbox");
    renderLightboxContent(lb, activeVisibleItems[activeLightboxIndex]);
  }

  function handleLightboxKeydown(e) {
    if (e.key === "Escape") {
      closeLightbox();
      return;
    }
    if (e.key === "ArrowRight") {
      nextLightbox();
      return;
    }
    if (e.key === "ArrowLeft") {
      prevLightbox();
      return;
    }
  }

  function setupLightboxInteractions(lb) {
    const closeBtn = $("#lightbox-close", lb);
    const prevBtn = $("#lightbox-prev", lb);
    const nextBtn = $("#lightbox-next", lb);
    const stage = $("#lightbox-stage", lb);

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", prevLightbox);
    if (nextBtn) nextBtn.addEventListener("click", nextLightbox);

    // Backdrop click
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target === stage) {
        closeLightbox();
      }
    });
  }

  /**
   * Touch Swipe Support for mobile (PRD §6 F3)
   */
  function setupTouchSwipe(element) {
    let touchStartX = 0;
    let touchEndX = 0;

    element.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    element.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) {
          nextLightbox(); // Swiped left -> next
        } else {
          prevLightbox(); // Swiped right -> prev
        }
      }
    }
  }

  /**
   * Check URL hash on page load for deep linking (e.g. gallery.html#bridal)
   */
  function handleInitialHash() {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash) {
      const categories = window.AAINA.galleryCategories || [];
      const match = categories.find(c => c.id === hash);
      if (match) {
        setFilter(match.id);
        return;
      }
    }
    renderFilterBar();
    renderGalleryGrid();
  }

  function initGallery() {
    renderHomeFeaturedLookbook();

    if ($("#gallery-grid")) {
      handleInitialHash();
      window.addEventListener("hashchange", handleInitialHash);
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initGallery);
    } else {
      initGallery();
    }
  }

  window.AAINA.galleryModule = {
    setFilter,
    openLightbox,
    closeLightbox,
    init: initGallery
  };
})();
