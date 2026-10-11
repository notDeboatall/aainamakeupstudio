/**
 * js/booking.js — Booking Sheet Dialog UI, Live Preview, Validation, & Delegation
 * Aaina Makeup Studio
 * Adheres to PRD §6 F1, CONTENT.md, and ARCHITECTURE §4
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
    escapeHTML: str => str
  };

  const STORAGE_KEY_NAME = "aaina_client_name";
  let activeTrigger = null;

  /**
   * Safe localStorage helpers (RULES §B7)
   */
  function getSavedName() {
    try {
      return localStorage.getItem(STORAGE_KEY_NAME) || "";
    } catch (e) {
      return "";
    }
  }

  function saveClientName(name) {
    try {
      if (name && name.trim()) {
        localStorage.setItem(STORAGE_KEY_NAME, name.trim());
      }
    } catch (e) {
      // Ignore if cookies/storage blocked
    }
  }

  /**
   * Ensure the <dialog id="booking"> exists in the DOM
   */
  function ensureDialog() {
    let dialog = $("#booking");
    if (!dialog) {
      dialog = el("dialog", { id: "booking", className: "booking-sheet" });
      document.body.appendChild(dialog);
    }
    return dialog;
  }

  /**
   * Render the Booking Sheet Form
   */
  function renderBookingSheet(dialog, {
    serviceId = "bridal",
    branchId = "lewis-road",
    reference = ""
  } = {}) {
    const services = window.AAINA.services || [];
    const branches = window.AAINA.branches || [];
    const savedName = getSavedName();

    dialog.className = "booking-sheet";
    dialog.innerHTML = `
      <div class="booking-sheet__panel">
        <header class="booking-sheet__header">
          <div>
            <span class="eyebrow">Direct Studio Booking</span>
            <h2 class="booking-sheet__title">Book on WhatsApp</h2>
            <p class="booking-sheet__subtitle">Fill this in. We'll open WhatsApp with your message ready to send.</p>
          </div>
          <button type="button" class="booking-sheet__close" id="booking-sheet-close" aria-label="Close booking sheet">
            ✕
          </button>
        </header>

        <form class="booking-sheet__form" id="booking-sheet-form" novalidate>
          <!-- Client Name Field -->
          <div class="form-group">
            <label for="book-name" class="label">Your Name <span class="required" aria-hidden="true">*</span></label>
            <input type="text" id="book-name" name="name" class="form-input" placeholder="e.g. Priya Das" value="${escapeHTML(savedName)}" required autocomplete="name">
            <span class="form-error" id="err-book-name" aria-live="polite"></span>
          </div>

          <!-- Studio Branch Selection -->
          <div class="form-group">
            <label for="book-branch" class="label">Choose Studio <span class="required" aria-hidden="true">*</span></label>
            <select id="book-branch" name="branch" class="form-select" required>
              ${branches.map(b => `
                <option value="${b.id}" ${b.id === branchId ? 'selected' : ''}>
                  ${b.name} (${b.area})
                </option>
              `).join("")}
            </select>
            <span class="form-error" id="err-book-branch" aria-live="polite"></span>
          </div>

          <!-- Service Selection -->
          <div class="form-group">
            <label for="book-service" class="label">Service</label>
            <select id="book-service" name="service" class="form-select">
              ${services.map(s => `
                <option value="${s.id}" ${s.id === serviceId ? 'selected' : ''}>
                  ${s.name} ${s.priceDisplay ? `(${s.priceDisplay.replace(/\[\[|\]\]/g, '')})` : ''}
                </option>
              `).join("")}
            </select>
          </div>

          <!-- Look Reference (Visible if booking a specific look from gallery) -->
          <div class="form-group ${reference ? '' : 'is-hidden'}" id="group-reference">
            <label for="book-reference" class="label">Lookbook Reference</label>
            <input type="text" id="book-reference" name="reference" class="form-input" value="${escapeHTML(reference)}" readonly>
          </div>

          <!-- Preferred Date -->
          <div class="form-group">
            <label for="book-date" class="label">Preferred Date (Optional)</label>
            <input type="date" id="book-date" name="date" class="form-input">
          </div>

          <!-- Anything to note -->
          <div class="form-group">
            <label for="book-note" class="label">Anything we should know? (Optional)</label>
            <textarea id="book-note" name="note" class="form-textarea" rows="2" placeholder="e.g. Morning wedding ceremony, skin sensitivity notes, etc."></textarea>
          </div>

          <!-- Live WhatsApp Message Preview (Builds Trust - DESIGN §5) -->
          <div class="booking-sheet__preview">
            <span class="label">Your Message Preview</span>
            <div class="message-bubble" id="booking-msg-preview" aria-live="polite">
              <!-- Live text generated here -->
            </div>
          </div>

          <!-- Actions -->
          <div class="booking-sheet__actions">
            <button type="submit" class="btn btn--primary btn--full btn--whatsapp">
              <svg class="whatsapp-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.941-.708-1.793s.448-1.272.607-1.446c.16-.175.348-.218.464-.218.116 0 .232.001.333.006.107.005.25-.041.391.298.145.349.493 1.202.536 1.29.043.087.072.189.014.304-.058.116-.087.189-.174.29-.087.102-.184.227-.262.305-.088.087-.179.182-.077.357.102.174.454.748.973 1.211.669.596 1.232.78 1.406.868.174.087.276.073.377-.044.102-.116.435-.508.551-.682.116-.174.232-.145.391-.087.16.058 1.015.479 1.189.566.174.087.29.131.334.204.043.072.043.42-.101.825z"/>
              </svg>
              <span>Open WhatsApp →</span>
            </button>
            <p class="booking-sheet__footnote">
              Nothing is sent until you press send in WhatsApp.
            </p>
          </div>
        </form>
      </div>
    `;

    setupBookingInteractions(dialog);
    updatePreview(dialog);
  }

  /**
   * Read current form values
   */
  function getFormValues(form) {
    const services = window.AAINA.services || [];
    const branches = window.AAINA.branches || [];

    const name = form.querySelector("#book-name").value;
    const branchId = form.querySelector("#book-branch").value;
    const serviceId = form.querySelector("#book-service").value;
    const date = form.querySelector("#book-date").value;
    const note = form.querySelector("#book-note").value;
    const reference = form.querySelector("#book-reference").value;

    const branchObj = branches.find(b => b.id === branchId) || { name: branchId };
    const serviceObj = services.find(s => s.id === serviceId) || { name: serviceId };

    return {
      name,
      branchId,
      branch: branchObj.name,
      serviceId,
      service: serviceObj.whatsappVerb || serviceObj.name,
      date,
      note,
      reference
    };
  }

  /**
   * Update the live preview bubble
   */
  function updatePreview(dialog) {
    const form = dialog.querySelector("#booking-sheet-form");
    const previewEl = dialog.querySelector("#booking-msg-preview");
    if (!form || !previewEl) return;

    const values = getFormValues(form);
    const msg = window.AAINA.whatsapp.buildMessage(values);
    previewEl.textContent = msg;
  }

  /**
   * Form validation & WhatsApp Submission
   */
  function setupBookingInteractions(dialog) {
    const form = dialog.querySelector("#booking-sheet-form");
    const closeBtn = dialog.querySelector("#booking-sheet-close");
    const nameInput = dialog.querySelector("#book-name");
    const errName = dialog.querySelector("#err-book-name");
    const errBranch = dialog.querySelector("#err-book-branch");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeBookingSheet(dialog));
    }

    // Live update preview on any input
    form.addEventListener("input", () => {
      errName.textContent = "";
      errBranch.textContent = "";
      updatePreview(dialog);
    });

    // Handle form submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      errName.textContent = "";
      errBranch.textContent = "";

      const values = getFormValues(form);

      // Validation per RULES §E & PRD §6 F1
      if (!values.name || values.name.trim().length < 2) {
        errName.textContent = "Please add your name.";
        nameInput.focus();
        return;
      }

      if (!values.branchId) {
        errBranch.textContent = "Please choose a studio.";
        return;
      }

      // Save name for convenience
      saveClientName(values.name);

      // Generate link and open
      window.AAINA.whatsapp.open(values);

      // Close modal
      closeBookingSheet(dialog);
    });
  }

  /**
   * Open dialog with focus trap
   */
  function openBookingSheet(options = {}) {
    activeTrigger = document.activeElement;
    const dialog = ensureDialog();
    renderBookingSheet(dialog, options);

    if (typeof dialog.showModal === "function") {
      try {
        dialog.showModal();
      } catch (e) {
        dialog.setAttribute("open", "");
      }
    } else {
      dialog.setAttribute("open", "");
    }

    document.body.classList.add("modal-open");
    dialog.dispatchEvent(new CustomEvent("aaina:booking:open", { detail: options }));

    // Focus first input
    const firstInput = dialog.querySelector("#book-name");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 50);
    }

    // Backdrop click closes dialog
    dialog.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("cancel", handleCancel);
  }

  function handleBackdropClick(e) {
    const dialog = $("#booking");
    if (e.target === dialog) {
      closeBookingSheet(dialog);
    }
  }

  function handleCancel(e) {
    e.preventDefault();
    const dialog = $("#booking");
    closeBookingSheet(dialog);
  }

  /**
   * Close dialog and restore focus
   */
  function closeBookingSheet(dialog) {
    dialog = dialog || $("#booking");
    if (!dialog) return;

    dialog.removeEventListener("click", handleBackdropClick);
    dialog.removeEventListener("cancel", handleCancel);

    if (typeof dialog.close === "function") {
      try {
        dialog.close();
      } catch (e) {
        dialog.removeAttribute("open");
      }
    } else {
      dialog.removeAttribute("open");
    }

    document.body.classList.remove("modal-open");
    dialog.dispatchEvent(new CustomEvent("aaina:booking:close"));

    if (activeTrigger && typeof activeTrigger.focus === "function") {
      activeTrigger.focus();
      activeTrigger = null;
    }
  }

  /**
   * Global Event Delegation for [data-book] triggers
   */
  function initBookingDelegation() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-book]");
      if (!trigger) return;

      e.preventDefault();

      const serviceId = trigger.dataset.service || "bridal";
      const branchId = trigger.dataset.branch || "bhubaneswar";
      const reference = trigger.dataset.reference || "";

      openBookingSheet({ serviceId, branchId, reference });
    });
  }

  // Auto-initialize delegation on ready
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initBookingDelegation);
    } else {
      initBookingDelegation();
    }
  }

  // Export API
  window.AAINA.booking = {
    open: openBookingSheet,
    close: closeBookingSheet,
    init: initBookingDelegation
  };
})();
