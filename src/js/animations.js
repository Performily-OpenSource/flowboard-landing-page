(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supportsObserver = "IntersectionObserver" in window;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduceMotion || !supportsObserver) return;

  document.documentElement.classList.add("js-anim");

  document.addEventListener("DOMContentLoaded", function () {

    var REVEAL_GROUPS = [
      { selector: ".section-head", type: "up" },
      { selector: ".figure", type: "up", stagger: true },
      { selector: ".segment", type: "up", stagger: true },
      { selector: ".segments__note", type: "up" },
      { selector: ".module", type: "up", stagger: true },
      { selector: ".compat", type: "up", stagger: true },
      { selector: ".flow__grid > div", type: "up", stagger: true },
      { selector: ".matrix", type: "scale" },
      { selector: ".badge", type: "up", stagger: true },
      { selector: ".faq__item", type: "up", stagger: true },
      { selector: ".closing__copy", type: "left" },
      { selector: ".form", type: "right" },
      { selector: ".site-footer__grid > *", type: "up", stagger: true }
    ];

    var LIFT = ".figure, .segment, .module, .compat, .stage, .faq__item";
    document.querySelectorAll(LIFT).forEach(function (el) { el.classList.add("lift"); });

    var revealTargets = [];
    REVEAL_GROUPS.forEach(function (group) {
      document.querySelectorAll(group.selector).forEach(function (el, index) {
        var step = window.innerWidth < 768 ? 50 : 90;
        var delay = group.stagger ? Math.min(index, 6) * step : 0;
        el.setAttribute("data-reveal", group.type === "up" ? "" : group.type);
        el.style.transitionDelay = delay + "ms";
        revealTargets.push(el);
      });
    });

    function finishReveal(el) {
      var done = false;
      var wait = 700 + (parseInt(el.style.transitionDelay, 10) || 0) + 150;
      function cleanup() {
        if (done) return;
        done = true;
        el.style.transitionDelay = "";
        el.removeAttribute("data-reveal");
        el.removeEventListener("transitionend", handler);
      }
      function handler(event) {
        if (event.target === el && event.propertyName === "transform") cleanup();
      }
      el.addEventListener("transitionend", handler);
      window.setTimeout(cleanup, wait);
    }

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        finishReveal(entry.target);
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });

    function animateNumber(el, delay) {
      var original = el.textContent;
      var match = original.match(/(\d+)/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      if (target === 0) return;
      var prefix = original.slice(0, match.index);
      var suffix = original.slice(match.index + match[1].length);
      var duration = 1200;
      var start = null;

      el.textContent = prefix + "0" + suffix;

      function frame(time) {
        if (start === null) start = time;
        var progress = Math.min((time - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (progress < 1) window.requestAnimationFrame(frame);
        else el.textContent = original;
      }
      window.setTimeout(function () { window.requestAnimationFrame(frame); }, delay || 0);
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateNumber(entry.target, Number(entry.target.getAttribute("data-count-delay")) || 0);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (el) { counterObserver.observe(el); });

    var art = document.querySelector("[data-parallax]");
    if (art && finePointer) {
      var layers = art.querySelectorAll("[data-depth]");
      var hero = art.closest(".hero") || art;
      var frameId = null;

      hero.addEventListener("pointermove", function (event) {
        var rect = art.getBoundingClientRect();
        var x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        var y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = window.requestAnimationFrame(function () {
          layers.forEach(function (layer) {
            var depth = Number(layer.getAttribute("data-depth")) || 10;
            layer.style.transform =
              "translate3d(" + (x * depth).toFixed(1) + "px, " + (y * depth).toFixed(1) + "px, 0)";
          });
        });
      });

      hero.addEventListener("pointerleave", function () {
        if (frameId) window.cancelAnimationFrame(frameId);
        layers.forEach(function (layer) { layer.style.transform = ""; });
      });
    }


    if (finePointer) {
      document.addEventListener("pointermove", function (event) {
        var card = event.target.closest && event.target.closest(".card");
        if (!card) return;
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (event.clientX - rect.left) + "px");
        card.style.setProperty("--my", (event.clientY - rect.top) + "px");
      }, { passive: true });
    }

    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".menu a[href^='#']"));
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute("href")); })
      .filter(Boolean);

    if (sections.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            var active = link.getAttribute("href") === id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (section) { sectionObserver.observe(section); });
    }
  });
})();
