/**
 * Language switcher.
 * The markup ships in English (en_US), the default interface language.
 * Only the Spanish (es_419) dictionary travels in this file: the English
 * copy is read from the DOM on load, so nothing is duplicated.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "flowboard.lang";
  var original = new Map();
  var originalAttr = new Map();

  function collect() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      original.set(el, el.innerHTML);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      originalAttr.set(el, el.getAttribute("placeholder") || "");
    });
  }

  function apply(lang) {
    var dict = lang === "es" ? window.FLOWBOARD_ES || {} : {};

    original.forEach(function (fallback, el) {
      var key = el.getAttribute("data-i18n");
      el.innerHTML = dict[key] !== undefined ? dict[key] : fallback;
    });

    originalAttr.forEach(function (fallback, el) {
      var key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", dict[key] !== undefined ? dict[key] : fallback);
    });

    document.documentElement.lang = lang === "es" ? "es-419" : "en-US";

    document.querySelectorAll("[data-lang]").forEach(function (el) {
      var on = el.getAttribute("data-lang") === lang;
      if (el.hasAttribute("aria-pressed")) el.setAttribute("aria-pressed", String(on));
      if (el.hasAttribute("aria-current")) el.setAttribute("aria-current", String(on));
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* private mode: the choice simply is not remembered */
    }
  }

  function stored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    collect();
    apply(stored() === "es" ? "es" : "en");

    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.addEventListener("click", function () {
        apply(el.getAttribute("data-lang"));
      });
    });

    var toggle = document.querySelector("[data-lang-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        apply(document.documentElement.lang === "es-419" ? "en" : "es");
      });
    }
  });
})();
