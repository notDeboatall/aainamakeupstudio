/**
 * js/services.js — Services Rows Renderer (Home Index & Services Page)
 * Aaina Makeup Studio
 * Complies with PRD §6 F1, CONTENT.md, and DESIGN §5
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $, escapeHTML } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s),
    escapeHTML: s => s
  };

  /**
   * Render Home Services Index Rows (01–06)
   */
  function renderHomeServices() {
    const container = $("#home-services-index");
    if (!container) return;

    const services = window.AAINA.services || [];
    container.innerHTML = services.map(s => `
      <div class="service-row" data-reveal>
        <span class="service-row__num">${s.order || ''}</span>
        <h3 class="service-row__title">${s.name}</h3>
        <p class="service-row__blurb">${s.blurb}</p>
        <div class="service-row__meta">
          <span class="service-row__price">
            ${s.priceFrom ? `from ₹${s.priceFrom.toLocaleString('en-IN')}` : s.priceDisplay ? escapeHTML(s.priceDisplay) : 'Price on request'}
          </span>
          <span class="service-row__duration">${s.duration || ''}</span>
        </div>
        <div class="service-row__action">
          <button type="button" class="btn btn--header" data-book data-service="${s.id}" aria-label="Book ${s.name} on WhatsApp">
            Book <span class="btn__arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `).join("");
  }

  /**
   * Render Comprehensive Services Page Catalog
   */
  function renderFullServices() {
    const container = $("#full-services-list");
    if (!container) return;

    const services = window.AAINA.services || [];
    container.innerHTML = services.map(s => `
      <article class="service-card-full hairline" id="service-${s.id}" data-reveal style="padding-block: var(--space-6); display: grid; grid-template-columns: 80px 1.2fr 2fr; gap: var(--space-5);">
        <span class="numeral">${s.order || ''}</span>
        <div>
          <span class="eyebrow">${s.duration || ''}</span>
          <h2 class="h2" style="margin-top: 4px;">${s.name}</h2>
          <div style="margin-top: var(--space-3);">
            <strong style="font-size: 1.1rem; color: var(--ink);">
              ${s.priceFrom ? `from ₹${s.priceFrom.toLocaleString('en-IN')}` : s.priceDisplay ? escapeHTML(s.priceDisplay) : 'Price on request'}
            </strong>
          </div>
          <div style="margin-top: var(--space-4);">
            <button type="button" class="btn btn--primary" data-book data-service="${s.id}" aria-label="Book ${s.name} on WhatsApp">
              Book on WhatsApp <span class="btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div>
          <p class="lead" style="margin-bottom: var(--space-3); color: var(--ink);">${s.blurb}</p>
          ${s.details && s.details.length ? `
            <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4); border-top: var(--border-hairline); padding-top: var(--space-3);">
              ${s.details.map(d => `
                <li style="display: flex; gap: var(--space-2); font-size: 0.95rem; color: var(--muted);">
                  <span style="color: var(--sindoor);" aria-hidden="true">✦</span>
                  <span>${escapeHTML(d)}</span>
                </li>
              `).join("")}
            </ul>
          ` : ''}
        </div>
      </article>
    `).join("");
  }

  function initServices() {
    renderHomeServices();
    renderFullServices();
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initServices);
    } else {
      initServices();
    }
  }

  window.AAINA.servicesModule = {
    renderHomeServices,
    renderFullServices,
    init: initServices
  };
})();
