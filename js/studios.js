/**
 * js/studios.js — Branch Tabs, Information Panels, Lazy Map, & Hash Routing
 * Aaina Makeup Studio
 * Complies with PRD §6 F2, ARCHITECTURE §4, and Image Brief
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $, $$, el, escapeHTML } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s),
    $$: (s, c = document) => Array.from(c.querySelectorAll(s)),
    el: (tag, attrs, ...ch) => {
      const e = document.createElement(tag);
      Object.assign(e, attrs);
      ch.forEach(c => c && e.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
      return e;
    },
    escapeHTML: s => s
  };

  let activeBranchId = "lewis-road";
  const loadedMaps = new Set();

  /**
   * Render Branch Location Tabs & Panels on studios.html
   */
  function renderStudiosPage() {
    const container = $("#studios-container");
    if (!container) return;

    const branches = window.AAINA.branches || [];
    if (!branches.length) return;

    // Check if activeBranchId is valid, else fallback to first
    if (!branches.some(b => b.id === activeBranchId)) {
      activeBranchId = branches[0].id;
    }

    container.className = "studios-layout";
    container.innerHTML = `
      <!-- Tab List -->
      <div class="studio-tablist" role="tablist" aria-label="Studio branches">
        ${branches.map(b => `
          <button type="button" class="studio-tab ${b.id === activeBranchId ? 'is-active' : ''}" 
                  id="tab-${b.id}" role="tab" aria-selected="${b.id === activeBranchId}" 
                  aria-controls="panel-${b.id}" data-branch-id="${b.id}">
            <span class="studio-tab__num">${b.order || ''}</span>
            <span class="studio-tab__name">${b.name}</span>
          </button>
        `).join("")}
      </div>

      <!-- Panels -->
      <div class="studio-panels-wrap">
        ${branches.map(b => `
          <div class="studio-panel ${b.id === activeBranchId ? 'is-active' : ''}" 
               id="panel-${b.id}" role="tabpanel" aria-labelledby="tab-${b.id}">
            <div>
              <span class="eyebrow">${b.city || b.name} Studio</span>
              <h2 class="h2" style="margin-top: 4px;">${b.name} (${b.area})</h2>
              <p class="text-muted" style="margin-top: var(--space-2); font-size: 1.05rem;">
                ${escapeHTML(b.address)}
              </p>
              ${b.landmark ? `
                <p class="text-muted" style="font-size: 0.9rem; margin-top: 4px;">
                  <strong>Landmark:</strong> ${escapeHTML(b.landmark)}
                </p>
              ` : ''}
              ${b.parking ? `
                <p class="text-muted" style="font-size: 0.9rem; margin-top: 2px;">
                  <strong>Parking:</strong> ${escapeHTML(b.parking)}
                </p>
              ` : ''}
            </div>

            <!-- Hours Table -->
            <div style="margin-block: var(--space-4);">
              <span class="label" style="margin-bottom: var(--space-2);">Studio Hours</span>
              <table class="studio-hours-table">
                <tbody>
                  ${(b.hours || []).map(h => `
                    <tr>
                      <td>${h.days}</td>
                      <td>${h.time}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>

            <!-- Contact & Directions Actions -->
            <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; margin-block: var(--space-2);">
              <a href="${b.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--outline">
                Get Directions →
              </a>
              <button type="button" class="btn btn--primary" data-book data-branch="${b.id}">
                WhatsApp this Studio →
              </button>
              <a href="tel:${b.phone.replace(/[^0-9+]/g, '')}" class="btn btn--outline" style="min-height: 48px;">
                Call: ${b.phone}
              </a>
            </div>

            <!-- Lazy Loaded Google Maps Embed -->
            <div class="studio-map-frame" id="map-frame-${b.id}" style="margin-top: var(--space-4);">
              <!-- Iframe injected lazily on tab activation -->
            </div>
          </div>
        `).join("")}
      </div>
    `;

    setupTabInteractions(container);
    loadActiveMap(activeBranchId);
  }

  /**
   * Lazily loads map iframe only for the active panel (ARCHITECTURE §4)
   */
  function loadActiveMap(branchId) {
    if (loadedMaps.has(branchId)) return;

    const frame = $(`#map-frame-${branchId}`);
    const branches = window.AAINA.branches || [];
    const branch = branches.find(b => b.id === branchId);

    if (frame && branch && branch.mapEmbed) {
      const iframe = el("iframe", {
        src: branch.mapEmbed,
        title: `Google Maps Location for Aaina Makeup Studio in ${branch.name}`,
        loading: "lazy",
        referrerpolicy: "no-referrer-when-downgrade",
        allowfullscreen: ""
      });
      frame.innerHTML = "";
      frame.appendChild(iframe);
      loadedMaps.add(branchId);
    }
  }

  /**
   * Setup click & keyboard arrow navigation on tabs
   */
  function setupTabInteractions(container) {
    const tabs = $$(".studio-tab", container);
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        const branchId = tab.dataset.branchId;
        selectBranch(branchId);
        window.location.hash = branchId;
      });

      tab.addEventListener("keydown", (e) => {
        let targetIndex = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        }
        if (targetIndex !== null) {
          e.preventDefault();
          tabs[targetIndex].focus();
          tabs[targetIndex].click();
        }
      });
    });
  }

  /**
   * Activate specific branch
   */
  function selectBranch(branchId) {
    activeBranchId = branchId;
    $$(".studio-tab").forEach(tab => {
      const isActive = tab.dataset.branchId === branchId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    $$(".studio-panel").forEach(panel => {
      const isActive = panel.id === `panel-${branchId}`;
      panel.classList.toggle("is-active", isActive);
    });

    loadActiveMap(branchId);
  }

  /**
   * Handle hash routing on page load (e.g. studios.html#lewis-road)
   */
  function handleHashChange() {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash) {
      const branches = window.AAINA.branches || [];
      const match = branches.find(b => b.id === hash || b.name.toLowerCase() === hash);
      if (match) {
        selectBranch(match.id);
      }
    }
  }

  function initStudios() {
    if ($("#studios-container")) {
      renderStudiosPage();
      handleHashChange();
      window.addEventListener("hashchange", handleHashChange);
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initStudios);
    } else {
      initStudios();
    }
  }

  window.AAINA.studiosModule = {
    selectBranch,
    init: initStudios
  };
})();
