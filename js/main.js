/* Lark — Speech Pathology for Children — site behavior
   Reads window.SITE_CONFIG (js/config.js). No build step, no dependencies. */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  /* ---------- Inject contact details everywhere ---------- */
  document.querySelectorAll("[data-phone]").forEach(function (el) {
    el.textContent = cfg.phone || "";
    if (el.tagName === "A") el.href = cfg.phoneHref || "#";
  });
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.textContent = cfg.email || "";
    if (el.tagName === "A") el.href = "mailto:" + (cfg.email || "");
  });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Sticky mobile CTA (hidden until user scrolls past hero) ---------- */
  var sticky = document.querySelector(".sticky-cta");
  if (sticky) {
    document.body.classList.add("has-sticky-cta");
    var shown = false;
    window.addEventListener("scroll", function () {
      var should = window.scrollY > 420;
      if (should !== shown) {
        shown = should;
        sticky.classList.toggle("is-shown", shown);
      }
    }, { passive: true });
  }

  /* ---------- Scheduler embed: Cliniko (preferred) or Calendly ----------
     Mounts into #scheduler-embed on the booking page. If neither is configured,
     the appointment-request form is shown instead. When a live calendar is
     embedded, the manual request form is hidden to keep one clear path. */
  var schedulerBox = document.getElementById("scheduler-embed");
  if (schedulerBox) {
    var requestBlock = document.getElementById("request-form-block");
    if (cfg.clinikoUrl && cfg.clinikoMode === "link") {
      // Link-out mode: a real navigation to Cliniko so referral/UTM/ad source
      // is preserved in analytics (Cliniko's recommended approach for tracking).
      var card = document.createElement("div");
      card.className = "scheduler-linkout";
      var h = document.createElement("h3");
      h.textContent = "Book your free Discovery Call";
      var p = document.createElement("p");
      p.textContent = "You'll head to our secure Cliniko booking calendar to pick a time that suits you.";
      var a = document.createElement("a");
      a.className = "btn btn--primary btn--lg";
      a.href = cfg.clinikoUrl;
      a.textContent = "Open the booking calendar →";
      card.appendChild(h);
      card.appendChild(p);
      card.appendChild(a);
      schedulerBox.appendChild(card);
      schedulerBox.classList.add("is-active");
      if (requestBlock) requestBlock.style.display = "none";
    } else if (cfg.clinikoUrl) {
      // Add ?embedded=true, keeping it BEFORE any #fragment (e.g. #schedule),
      // otherwise it lands inside the fragment and is ignored.
      var cUrl = cfg.clinikoUrl;
      if (!/[?&]embedded=/.test(cUrl)) {
        var hashAt = cUrl.indexOf("#");
        var frag = hashAt > -1 ? cUrl.slice(hashAt) : "";
        var base = hashAt > -1 ? cUrl.slice(0, hashAt) : cUrl;
        base += (base.indexOf("?") > -1 ? "&" : "?") + "embedded=true";
        cUrl = base + frag;
      }
      var frame = document.createElement("iframe");
      frame.className = "scheduler-frame";
      frame.src = cUrl;
      frame.title = "Book an appointment with Lark Speech Pathology";
      frame.loading = "lazy";
      schedulerBox.appendChild(frame);
      schedulerBox.classList.add("is-active");
      if (requestBlock) requestBlock.style.display = "none";
    } else if (cfg.calendlyUrl) {
      var widget = document.createElement("div");
      widget.className = "calendly-inline-widget";
      widget.setAttribute("data-url", cfg.calendlyUrl + "?hide_gdpr_banner=1&primary_color=1c6b62");
      widget.style.minWidth = "320px";
      widget.style.height = "760px";
      schedulerBox.appendChild(widget);
      var s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      schedulerBox.appendChild(s);
      schedulerBox.classList.add("is-active");
      if (requestBlock) requestBlock.style.display = "none";
    }
  }

  /* ---------- Forms ----------
     Priority: 1) cfg.formEndpoint (Formspree etc.)
               2) Netlify Forms (AJAX post to "/") when deployed
               3) Demo mode (local preview): validate, log, show success   */
  function encode(data) {
    return Object.keys(data)
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]); })
      .join("&");
  }

  function isLocalPreview() {
    return location.protocol === "file:" ||
      /^(localhost|127\.|192\.168\.|0\.0\.0\.0)/.test(location.hostname);
  }

  document.querySelectorAll("form[data-handler]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var msg = form.querySelector(".form-msg");
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      function fail(text) {
        if (msg) {
          msg.textContent = text;
          msg.classList.add("is-visible", "form-msg--err");
          msg.classList.remove("form-msg--ok");
        }
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
      }

      function succeed() {
        var kind = form.dataset.handler;
        if (kind === "guide") {
          try { localStorage.setItem("lark_guide_unlocked", "1"); } catch (err) {}
          window.location.href = "milestone-guide.html";
          return;
        }
        form.style.display = "none";
        var success = document.getElementById(form.dataset.success || "");
        if (success) success.classList.add("is-visible");
      }

      if (btn) {
        btn.dataset.label = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Sending…";
      }

      if (cfg.formEndpoint) {
        fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        })
          .then(function (r) { r.ok ? succeed() : fail("Something went wrong — please call us instead: " + (cfg.phone || "")); })
          .catch(function () { fail("Something went wrong — please call us instead: " + (cfg.phone || "")); });
      } else if (!isLocalPreview()) {
        // Netlify Forms AJAX submission (works once deployed to Netlify)
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode(data),
        })
          .then(function (r) { r.ok ? succeed() : fail("Something went wrong — please call us instead: " + (cfg.phone || "")); })
          .catch(function () { fail("Something went wrong — please call us instead: " + (cfg.phone || "")); });
      } else {
        // Demo mode for local preview — no backend attached yet.
        console.info("[Lark demo mode] Form submission (connect Formspree or deploy to Netlify to receive these):", data);
        setTimeout(succeed, 500);
      }
    });
  });

  /* ---------- Milestone guide soft gate ----------
     If someone lands on the guide without going through the email form,
     bounce them to the capture page. (Client-side only — a determined
     visitor can bypass it; that's the normal tradeoff for static sites.) */
  if (document.body.dataset.page === "milestone-guide") {
    var unlocked = false;
    try { unlocked = localStorage.getItem("lark_guide_unlocked") === "1"; } catch (err) {}
    if (!unlocked && !/unlocked=1/.test(location.search)) {
      window.location.replace("guide.html");
    }
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
