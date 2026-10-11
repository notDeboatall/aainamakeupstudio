/**
 * js/reveal.js — Accessible Scroll Reveals using IntersectionObserver
 * Aaina Makeup Studio
 * Complies with DESIGN §6 (respects prefers-reduced-motion)
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $$, prefersReducedMotion } = window.AAINA.core || {
    $$: (s, c = document) => Array.from(c.querySelectorAll(s)),
    prefersReducedMotion: () => false
  };

  function initReveals() {
    // If user prefers reduced motion, make all elements immediately visible
    if (prefersReducedMotion()) {
      $$("[data-reveal]").forEach(el => {
        el.classList.add("is-revealed");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach(el => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px 0px 120px 0px",
      threshold: 0.02
    });

    function checkReveals() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      $$("[data-reveal]:not(.is-revealed)").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh + 50) {
          el.classList.add("is-revealed");
          observer.unobserve(el);
        } else {
          observer.observe(el);
        }
      });
    }

    checkReveals();
    window.addEventListener("scroll", checkReveals, { passive: true });
    window.addEventListener("resize", checkReveals, { passive: true });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initReveals);
    } else {
      initReveals();
    }
  }

  window.AAINA.reveal = {
    init: initReveals
  };
})();
