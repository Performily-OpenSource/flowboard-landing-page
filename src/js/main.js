/**
 * Landing page behaviour: reading progress, mobile menu,
 * FAQ accordion, vacation gauge and the demo request form.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* Reading progress bar */
    var bar = document.querySelector("[data-progress]");
    if (bar) {
      var onScroll = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = pct + "%";
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    /* Mobile menu */
    var burger = document.querySelector("[data-burger]");
    var menu = document.getElementById("menu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.getAttribute("data-open") === "true";
        menu.setAttribute("data-open", String(!open));
        burger.setAttribute("aria-expanded", String(!open));
      });
      menu.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          menu.setAttribute("data-open", "false");
          burger.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* FAQ accordion */
    document.querySelectorAll("[data-faq-question]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        if (panel) panel.hidden = open;
      });
    });

    /* Vacation gauge */
    var arc = document.querySelector("[data-gauge-arc]");
    if (arc) {
      var used = Number(arc.getAttribute("data-value") || 0);
      var total = Number(arc.getAttribute("data-total") || 1);
      var r = arc.r.baseVal.value;
      var c = 2 * Math.PI * r;
      arc.style.strokeDasharray = String(c);
      arc.style.strokeDashoffset = String(c - (used / total) * c);
    }

    /* Demo request form */
    var form = document.querySelector("[data-demo-form]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = form.querySelector("[data-form-status]");
        if (status) {
          status.hidden = false;
          status.focus();
        }
        form.reset();
      });
    }
  });
})();
