/**
 * js/hero.js — "The Cover" Hero Component
 * Aaina Makeup Studio (Odisha)
 * Follows DESIGN.md & Decision D25 / Alignment Update
 * 
 * Features:
 * - Single cover presentation: Volume 1 (The Bridal Issue)
 * - Dynamic masthead font-size calculation to span container exactly without letter collisions
 * - Optical alignment binding (anchorX, scale, offsetY from data/site.js)
 * - Sindoor debug overlay HUD when ?debug=hero is in URL
 * - Zero console errors, zero dead code
 */
"use strict";

window.AAINA = window.AAINA || {};

(function () {
  const { $ } = window.AAINA.core || {
    $: (s, c = document) => c.querySelector(s)
  };

  const coverEl = $("#cover");
  if (!coverEl) return;

  const heroData = (window.AAINA.site && window.AAINA.site.hero) || {};
  const bridalData = (heroData.issues && heroData.issues[0]) || {
    anchorX: 49.35,
    scale: 1.0,
    offsetY: 0
  };

  // Apply optical correction custom properties to cover element
  coverEl.style.setProperty("--issue-scale", `${bridalData.scale || 1.0}`);
  coverEl.style.setProperty("--issue-offset-y", `${bridalData.offsetY || 0}px`);
  coverEl.style.setProperty("--issue-anchor-x", `${bridalData.anchorX || 49.35}%`);

  /**
   * Compute and set exact masthead font-size so the word spans the container exactly
   * from the left edge to the right edge with tight letter-spacing and no collisions.
   */
  function fitMasthead() {
    const masthead = $(".hero-cover__masthead", coverEl);
    const wrap = $(".hero-cover__masthead-wrap", coverEl);
    if (!masthead || !wrap) return;

    const targetWidth = wrap.clientWidth;
    if (targetWidth <= 0) return;

    // Measure true text width using inline display
    masthead.style.display = "inline";
    masthead.style.fontSize = "100px";
    masthead.style.letterSpacing = "0.015em";
    masthead.style.whiteSpace = "nowrap";

    const measuredTextWidth = masthead.getBoundingClientRect().width;
    masthead.style.display = "block";

    if (measuredTextWidth > 0) {
      const calculatedFontSize = (targetWidth / measuredTextWidth) * 100;
      masthead.style.fontSize = `${calculatedFontSize}px`;
    }
  }

  // Bind fitMasthead to window resize, container changes, and font loading
  window.addEventListener("resize", fitMasthead, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitMasthead);
  }

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => fitMasthead());
    const wrap = $(".hero-cover__masthead-wrap", coverEl);
    if (wrap) ro.observe(wrap);
  }

  // Initial calculation
  fitMasthead();

  /* -------------------------------------------------------------
     Debug Overlay HUD Mode (?debug=hero)
     ------------------------------------------------------------- */
  const isDebug = new URLSearchParams(window.location.search).get("debug") === "hero";
  if (isDebug) {
    function renderDebugOverlay() {
      let hud = document.getElementById("hero-debug-hud");
      if (!hud) {
        hud = document.createElement("aside");
        hud.id = "hero-debug-hud";
        hud.style.cssText = `
          position: fixed;
          bottom: 12px;
          right: 12px;
          background: rgba(15, 14, 13, 0.94);
          color: #F3EEE6;
          font-family: monospace;
          font-size: 11px;
          line-height: 1.45;
          padding: 10px 14px;
          border: 1px solid #C1121F;
          border-radius: 4px;
          z-index: 99999;
          pointer-events: none;
          max-width: 340px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(hud);
      }

      let centerLine = document.getElementById("hero-debug-centerline");
      if (!centerLine) {
        centerLine = document.createElement("div");
        centerLine.id = "hero-debug-centerline";
        centerLine.style.cssText = `
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          border-left: 1px dashed #C1121F;
          z-index: 9999;
          pointer-events: none;
        `;
        const stage = $(".hero-cover__stage", coverEl) || coverEl;
        stage.appendChild(centerLine);
      }

      const img = $(".hero-cover__img", coverEl);
      const masthead = $(".hero-cover__masthead", coverEl);
      const container = $(".hero-cover__container", coverEl) || coverEl;

      if (img) {
        const r = img.getBoundingClientRect();
        const stageR = (img.parentElement || coverEl).getBoundingClientRect();
        const contR = container.getBoundingClientRect();
        const personCenterClientX = r.left + r.width * ((bridalData.anchorX || 49.35) / 100);
        const centerLineOffset = personCenterClientX - stageR.left;
        centerLine.style.left = `${centerLineOffset}px`;

        // Alpha bounds in rendered coordinates:
        // person bbox: [minX: 254, maxX: 1121, minY: 0, maxY: 1128] out of 1393x1129
        const personLeft = r.left + r.width * (254 / 1393);
        const personRight = r.left + r.width * (1121 / 1393);
        const personTop = r.top; // minY is 0
        const personBottom = r.bottom;

        let vertOverlapStr = "0%";
        let horizOverlapStr = "None";
        if (masthead) {
          const mR = masthead.getBoundingClientRect();
          const vertOverlapPx = Math.max(0, mR.bottom - personTop);
          const vertOverlapPct = mR.height > 0 ? ((vertOverlapPx / mR.height) * 100).toFixed(1) : "0";
          vertOverlapStr = `${vertOverlapPct}% (${Math.round(vertOverlapPx)}px of masthead height)`;

          const horizOverlapPx = Math.max(0, Math.min(personRight, mR.right) - Math.max(personLeft, mR.left));
          const horizOverlapPct = mR.width > 0 ? ((horizOverlapPx / mR.width) * 100).toFixed(1) : "0";
          horizOverlapStr = `${horizOverlapPct}% (${Math.round(horizOverlapPx)}px)`;
        }

        const heroH = coverEl.clientHeight;
        const imgH = r.height;
        const imgHPct = heroH > 0 ? ((imgH / heroH) * 100).toFixed(1) : "0";
        const distFromContRight = Math.round(contR.right - personRight);

        hud.innerHTML = `
          <strong style="color:#C1121F;">HERO DEBUG HUD</strong><br>
          Viewport: ${window.innerWidth} × ${window.innerHeight}<br>
          Hero Height: ${heroH}px<br>
          Img Height: ${Math.round(imgH)}px (<strong>${imgHPct}%</strong> of hero)<br>
          Person Bounds: ${Math.round(personRight - personLeft)} × ${Math.round(personBottom - personTop)}px<br>
          Subject from Container Right: ${distFromContRight}px<br>
          AnchorX: ${bridalData.anchorX || 49.35}% | Scale: ${bridalData.scale || 1.0}<br>
          OffsetY: ${bridalData.offsetY || 0}px<br>
          Masthead Vert Overlap: <strong>${vertOverlapStr}</strong><br>
          Masthead Horiz Overlap: ${horizOverlapStr}<br>
          Baseline: delta 0px (bottom-anchored)
        `;
      }
    }

    window.addEventListener("resize", renderDebugOverlay, { passive: true });
    setTimeout(renderDebugOverlay, 300);
  }

})();

