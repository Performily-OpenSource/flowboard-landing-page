# Flowboard Landing Page

Public landing page for **Flowboard**, the HR management platform built by **Performily**.

Course: 1ASI0729 Open Source Application Development, NRC 7729, term 2026-20, UPC.

## Stack

Plain HTML5, CSS3 and vanilla JavaScript. No build step and no dependencies: open `index.html` in a browser and it runs.

## Structure

```
index.html          Landing page
terms.html          Terms of service
privacy.html        Privacy policy
src/css/tokens.css      Design tokens: colour, type scale, spacing, radii, glass, easing
src/css/styles.css      Layout, glass components and sections
src/css/animations.css  Entrance, scroll reveal and ambient (standby) motion
src/js/i18n.js          Language switcher (en_US default, es_419)
src/js/main.js          Menu, accordion, scroll progress, header state, gauge, form
src/js/animations.js    Scroll reveal, counters, hero parallax, active navigation link
```

## Language

The default interface language is **English (en_US)**. Spanish (es_419) is available from the switcher in the header and the footer, and the choice is stored in `localStorage`.

## Visual style and motion

Cards use a glass surface (translucent background with `backdrop-filter`). The hero shows floating cards that bob gently and follow the pointer with a parallax effect; sections reveal on scroll and figures count up. All motion is disabled when the user has `prefers-reduced-motion: reduce`, and without JavaScript the page renders complete and static.

## Accessibility

Semantic landmarks, a skip link, visible focus rings on every interactive element and ARIA attributes on the menu, the accordion and the language switcher.

## Branching model

GitFlow.

| Branch | Purpose |
| --- | --- |
| `main` | Released code |
| `develop` | Integration branch |
| `feature/*` | One branch per feature, merged into `develop` with `--no-ff` |
| `release/*` | Version stabilisation, merged into `main` and back into `develop` |

Commits follow Conventional Commits: `type(scope): description`, written in English.

## Version

`1.1.0`

## Team

Performily, UPC 2026-20.
