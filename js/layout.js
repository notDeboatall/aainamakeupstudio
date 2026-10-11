/**
 * js/layout.js — Shared Header & Footer Injection, Mobile Nav, & Scroll Behaviors
 * Aaina Makeup Studio
 * Complies with DESIGN §5, RULES §B, and ARCHITECTURE §4
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $, $$, el, prefersReducedMotion } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s),
    $$: (s, c = document) => Array.from(c.querySelectorAll(s)),
    el: (tag, attrs, ...ch) => {
      const e = document.createElement(tag);
      Object.assign(e, attrs);
      ch.forEach(c => c && e.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
      return e;
    },
    prefersReducedMotion: () => false
  };

  /**
   * Determine current active file name
   */
  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    return page === "" ? "index.html" : page;
  }

  /**
   * Render Shared Header into #site-header
   */
  function injectHeader() {
    const header = $("#site-header");
    if (!header) return;

    const site = window.AAINA.site || {};
    const navItems = site.nav || [
      { label: "Home", href: "index.html" },
      { label: "Services", href: "services.html" },
      { label: "Lookbook", href: "gallery.html" },
      { label: "Studios", href: "studios.html" }
    ];
    const currentPage = getCurrentPage();

    header.className = "site-header hairline";
    header.innerHTML = `
      <div class="site-header__container container">
        <a href="index.html" class="site-header__brand" aria-label="Aaina Makeup Studio Home">
          <span class="site-header__wordmark">Aaina</span>
          <span class="site-header__submark">Makeup Studio</span>
        </a>

        <nav class="site-header__nav" aria-label="Main Navigation">
          <ul class="site-header__menu">
            ${navItems.map(item => {
              const isActive = item.href === currentPage || (currentPage === "index.html" && item.href === "./");
              return `
                <li class="site-header__item">
                  <a href="${item.href}" class="site-header__link ${isActive ? 'is-active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
                    ${item.label}
                  </a>
                </li>
              `;
            }).join("")}
          </ul>
        </nav>

        <div class="site-header__actions">
          <button type="button" class="btn btn--header" data-book data-service="bridal" aria-label="Book appointment on WhatsApp">
            ${site.headerCta || 'Book'} <span class="btn__arrow" aria-hidden="true">→</span>
          </button>

          <button type="button" class="site-header__burger" id="mobile-menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
            <span class="burger-bar"></span>
            <span class="burger-bar"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Full-Screen Overlay Navigation -->
      <div class="mobile-nav" id="mobile-menu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div class="mobile-nav__header container">
          <a href="index.html" class="site-header__brand" tabindex="-1">
            <span class="site-header__wordmark">Aaina</span>
            <span class="site-header__submark">Makeup Studio</span>
          </a>
          <button type="button" class="mobile-nav__close" id="mobile-menu-close" aria-label="Close menu">
            Close ✕
          </button>
        </div>

        <nav class="mobile-nav__body container">
          <ul class="mobile-nav__list">
            ${navItems.map((item, idx) => {
              const isActive = item.href === currentPage;
              return `
                <li class="mobile-nav__item">
                  <span class="mobile-nav__num">0${idx + 1}</span>
                  <a href="${item.href}" class="mobile-nav__link ${isActive ? 'is-active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
                    ${item.label}
                  </a>
                </li>
              `;
            }).join("")}
          </ul>

          <div class="mobile-nav__footer">
            <button type="button" class="btn btn--primary btn--full" data-book>
              Book on WhatsApp →
            </button>
            <p class="mobile-nav__location">Bhubaneswar (Lewis Road · Gudiapokhari)</p>
          </div>
        </nav>
      </div>
    `;

    setupMobileMenu();
    setupHeaderScroll(header);
  }

  /**
   * Mobile Menu Drawer Interaction
   */
  function setupMobileMenu() {
    const toggle = $("#mobile-menu-toggle");
    const closeBtn = $("#mobile-menu-close");
    const menu = $("#mobile-menu");
    if (!toggle || !menu || !closeBtn) return;

    let previousFocus = null;

    function openMenu() {
      previousFocus = document.activeElement;
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-locked");
      closeBtn.focus();
      document.addEventListener("keydown", handleKeydown);
    }

    function closeMenu() {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-locked");
      document.removeEventListener("keydown", handleKeydown);
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    }

    function handleKeydown(e) {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key === "Tab") {
        const focusables = $$("a[href], button:not([disabled])", menu);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    toggle.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);

    // Close when a nav link is clicked
    $$(".mobile-nav__link", menu).forEach(link => {
      link.addEventListener("click", closeMenu);
    });
  }

  /**
   * Header Hide-On-Scroll-Down, Show-On-Scroll-Up
   * Respects prefers-reduced-motion (DESIGN §6)
   */
  function setupHeaderScroll(header) {
    if (prefersReducedMotion()) return;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
          
          if (currentScrollY > 120) {
            if (currentScrollY > lastScrollY + 6 && !document.body.classList.contains("menu-locked")) {
              header.classList.add("is-hidden");
            } else if (currentScrollY < lastScrollY - 6) {
              header.classList.remove("is-hidden");
            }
          } else {
            header.classList.remove("is-hidden");
          }

          lastScrollY = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Render Shared Footer into #site-footer
   */
  function injectFooter() {
    const footer = $("#site-footer");
    if (!footer) return;

    const site = window.AAINA.site || {};
    const branches = window.AAINA.branches || [];
    const navItems = site.nav || [];

    footer.className = "site-footer section--ink";
    footer.innerHTML = `
      <div class="site-footer__container container">
        <div class="site-footer__grid">
          <!-- Column 1: Studios -->
          <div class="site-footer__col">
            <span class="eyebrow eyebrow--inv">Where to find us</span>
            <h3 class="site-footer__col-title">Studios</h3>
            <ul class="site-footer__branches">
              ${branches.map(b => `
                <li class="site-footer__branch-item">
                  <strong>${b.name}</strong>
                  <span class="site-footer__branch-area">${b.area}</span>
                  <div class="site-footer__branch-contact">
                    <a href="tel:${b.phone.replace(/[^0-9+]/g, '')}" class="site-footer__link">${b.phone}</a>
                    <span class="site-footer__sep">·</span>
                    <a href="https://wa.me/${b.whatsapp}" target="_blank" rel="noopener noreferrer" class="site-footer__link">WhatsApp</a>
                  </div>
                </li>
              `).join("")}
            </ul>
          </div>

          <!-- Column 2: Navigation -->
          <div class="site-footer__col">
            <span class="eyebrow eyebrow--inv">Index</span>
            <h3 class="site-footer__col-title">Pages</h3>
            <ul class="site-footer__links">
              ${navItems.map(item => `
                <li>
                  <a href="${item.href}" class="site-footer__link">${item.label}</a>
                </li>
              `).join("")}
            </ul>
          </div>

          <!-- Column 3: Brand & Philosophy -->
          <div class="site-footer__col">
            <span class="eyebrow eyebrow--inv">About</span>
            <h3 class="site-footer__col-title">Aaina</h3>
            <p class="site-footer__text">
              Aaina means <em>mirror</em>. Dedicated bridal, party, and editorial makeup artistry across Odisha. We prepare the skin, match undertones in natural lighting, and honor your occasion.
            </p>
            <div class="site-footer__social">
              <a href="${site.instagram}" target="_blank" rel="noopener noreferrer" class="site-footer__link site-footer__link--underline">
                Instagram (${site.instagramHandle || '@aainamakeup'})
              </a>
            </div>
          </div>
        </div>

        <!-- Huge Cropped Masthead Background -->
        <div class="site-footer__masthead-wrap" aria-hidden="true">
          <div class="site-footer__masthead">AAINA</div>
        </div>

        <!-- Legal bar -->
        <div class="site-footer__bottom hairline-top">
          <p class="site-footer__copyright">
            © ${site.copyrightYear || 2026} ${site.name}. All rights reserved.
          </p>
          <p class="site-footer__credit">
            ${site.footerText || 'Aaina Makeup Studio — Odisha.'}
          </p>
        </div>
      </div>
    `;
  }

  // Auto-run on DOM ready
  function initLayout() {
    injectHeader();
    injectFooter();
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initLayout);
    } else {
      initLayout();
    }
  }

  window.AAINA.layout = {
    injectHeader,
    injectFooter,
    init: initLayout
  };
})();
