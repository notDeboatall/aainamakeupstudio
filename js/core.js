/**
 * js/core.js — Core Helpers, DOM Utilities & Image Fallback Engine
 * Aaina Makeup Studio
 * Complies with RULES §B, ARCHITECTURE §4, and Image Brief
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  /**
   * DOM query selector helpers
   */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  /**
   * Safe HTML Escaper to prevent XSS (RULES §B4)
   */
  function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Create DOM Element helper
   */
  function el(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    for (const [key, val] of Object.entries(attributes)) {
      if (key === "className" || key === "class") {
        element.className = val;
      } else if (key === "dataset") {
        for (const [dataKey, dataVal] of Object.entries(val)) {
          element.dataset[dataKey] = dataVal;
        }
      } else if (key.startsWith("on") && typeof val === "function") {
        element.addEventListener(key.slice(2).toLowerCase(), val);
      } else if (val !== null && val !== undefined && val !== false) {
        element.setAttribute(key, val === true ? "" : val);
      }
    }
    for (const child of children) {
      if (child === null || child === undefined) continue;
      if (typeof child === "string" || typeof child === "number") {
        element.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof Node) {
        element.appendChild(child);
      } else if (Array.isArray(child)) {
        child.forEach(c => {
          if (c) element.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
        });
      }
    }
    return element;
  }

  /**
   * Reduced motion detector (DESIGN §6)
   */
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * Format Aspect Ratio to CSS string
   * e.g. "3/4" -> "3 / 4", "16:10" -> "16 / 10"
   */
  function formatAspectRatio(ratio) {
    if (!ratio) return "4 / 5";
    return ratio.replace(":", " / ").replace("/", " / ");
  }

  /**
   * Programmatic Placeholder Builder (Image Brief Section B & ASSETS §B)
   * Solid var(--bone) block at the slot's aspect ratio, 1px hairline border,
   * small sindoor category label top-left, "Photo coming soon" in Bodoni bottom-left,
   * short description in muted text. Accessible role="img".
   */
  function createPlaceholderBlock({
    label = "STUDIO",
    description = "",
    ratio = "4/5",
    className = ""
  } = {}) {
    const cssRatio = formatAspectRatio(ratio);
    const accessibleLabel = description
      ? `${description}, photo coming soon`
      : `${label} — Photo coming soon`;

    const container = el("div", {
      className: `aaina-placeholder ${className}`.trim(),
      role: "img",
      "aria-label": accessibleLabel,
      style: `aspect-ratio: ${cssRatio};`
    });

    const topLabel = el("span", {
      className: "aaina-placeholder__label"
    }, label.toUpperCase());

    const bottomWrap = el("div", {
      className: "aaina-placeholder__bottom"
    });

    const titleEl = el("span", {
      className: "aaina-placeholder__title"
    }, "Photo coming soon");

    bottomWrap.appendChild(titleEl);

    if (description) {
      const descEl = el("span", {
        className: "aaina-placeholder__desc"
      }, description);
      bottomWrap.appendChild(descEl);
    }

    container.appendChild(topLabel);
    container.appendChild(bottomWrap);

    return container;
  }

  /**
   * Safely loads an image or falls back to the placeholder block.
   * Uses a native JS error listener (RULES §B2: zero inline onerror).
   */
  function attachImageWithFallback(imgElement, {
    label = "AAINA",
    description = "",
    ratio = "4/5"
  } = {}) {
    if (!imgElement) return;

    // Check if image already errored
    imgElement.addEventListener("error", function handleError() {
      imgElement.removeEventListener("error", handleError);
      const placeholder = createPlaceholderBlock({ label, description, ratio });
      if (imgElement.parentNode) {
        imgElement.parentNode.replaceChild(placeholder, imgElement);
      }
    }, { once: true });
  }

  /**
   * Global Image Load Listener
   * Gracefully catches any dynamic image failure and converts it to a styled placeholder
   */
  function initGlobalImageFallbacks() {
    document.addEventListener("error", function (e) {
      const target = e.target;
      if (target && target.tagName === "IMG") {
        const label = target.dataset.placeholderLabel || "AAINA";
        const desc = target.alt || target.dataset.placeholderDesc || "";
        const ratio = target.dataset.ratio || "4/5";
        const placeholder = createPlaceholderBlock({
          label,
          description: desc.replace(/\s*—\s*photo coming soon/gi, "").trim(),
          ratio
        });
        if (target.parentNode) {
          target.parentNode.replaceChild(placeholder, target);
        }
      }
    }, true);
  }

  // Initialize global listener
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initGlobalImageFallbacks);
    } else {
      initGlobalImageFallbacks();
    }
  }

  // Export Core API
  window.AAINA.core = {
    $,
    $$,
    el,
    escapeHTML,
    prefersReducedMotion,
    formatAspectRatio,
    createPlaceholderBlock,
    attachImageWithFallback
  };
})();
