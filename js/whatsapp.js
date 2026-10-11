/**
 * js/whatsapp.js — WhatsApp Message & URL Generator
 * Aaina Makeup Studio
 * Adheres to CONTENT.md, PRD §6 F1, and ARCHITECTURE §4
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  /**
   * Cleans a phone number to digits only (strips spaces, +, -, etc.)
   */
  function cleanPhoneNumber(phone) {
    if (!phone) return "";
    if (String(phone).includes("[[")) {
      return String(phone);
    }
    return String(phone).replace(/\D/g, "");
  }

  /**
   * Resolves the target WhatsApp number for a booking.
   * Priority: branch.whatsapp -> site.defaultWhatsApp -> fallback placeholder
   */
  function resolveWhatsAppNumber(branchId) {
    const branches = window.AAINA.branches || [];
    const site = window.AAINA.site || {};
    
    if (branchId) {
      const branch = branches.find(b => b.id === branchId || b.name.toLowerCase() === branchId.toLowerCase());
      if (branch && branch.whatsapp) {
        return cleanPhoneNumber(branch.whatsapp);
      }
    }
    return cleanPhoneNumber(site.defaultWhatsApp || "916372091560");
  }

  /**
   * Builds the formatted WhatsApp message string per CONTENT.md specification
   * Template:
   * Hello Aaina Makeup Studio 👋
   * I'm {name}. I'd like to book *{service}* at your {branch} studio.
   * [Look reference: {reference} (lookbook)]
   * [📅 Preferred date: {date}]
   * [📝 Note: {note}]
   * (Sent from the website)
   */
  function buildMessage({
    name = "",
    service = "Bridal Makeup",
    branch = "Bhubaneswar",
    date = "",
    note = "",
    reference = ""
  } = {}) {
    const clientName = (name || "").trim();
    const serviceName = (service || "Bridal Makeup").trim();
    const branchName = (branch || "Bhubaneswar").trim();

    let lines = [
      "Hello Aaina Makeup Studio 👋",
      `I'm ${clientName}. I'd like to book *${serviceName}* at your ${branchName} studio.`
    ];

    if (reference && reference.trim()) {
      lines.push(`Look reference: ${reference.trim()} (lookbook)`);
    }

    if (date && date.trim()) {
      lines.push(`📅 Preferred date: ${date.trim()}`);
    }

    if (note && note.trim()) {
      lines.push(`📝 Note: ${note.trim()}`);
    }

    lines.push("(Sent from the website)");

    return lines.join("\n");
  }

  /**
   * Constructs the wa.me link with encoded URI component
   */
  function buildLink({
    number,
    message = "",
    branchId,
    ...messagePayload
  } = {}) {
    const targetNumber = number
      ? cleanPhoneNumber(number)
      : resolveWhatsAppNumber(branchId || messagePayload.branch);

    const msg = message || buildMessage(messagePayload);
    const encoded = encodeURIComponent(msg);

    return `https://wa.me/${targetNumber}?text=${encoded}`;
  }

  /**
   * Opens WhatsApp link in a new tab with fallback to location.href if popup blocked
   */
  function openWhatsApp(payload) {
    const url = typeof payload === "string" ? payload : buildLink(payload);
    try {
      const newTab = window.open(url, "_blank", "noopener,noreferrer");
      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
    return url;
  }

  // Public API
  window.AAINA.whatsapp = {
    cleanPhoneNumber,
    resolveWhatsAppNumber,
    buildMessage,
    buildLink,
    open: openWhatsApp
  };
})();
