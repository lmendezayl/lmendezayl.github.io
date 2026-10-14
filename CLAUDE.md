# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Lautaro Mendez (Data Engineer / Scientist). Static, dependency-free, three source files: [index.html](index.html), [style.css](style.css), [script.js](script.js). No build step, no package manager, no tests, no linter.

## Development & deployment

Open [index.html](index.html) directly in a browser, or serve the folder (`python -m http.server 8000`) if you need a real origin — the contact form POSTs cross-origin to Formspree, which works from `file://` too, but a server is closer to production.

Deployment is GitHub Pages: the remote is `lmendezayl/lmendezayl.github.io`, so pushing to `main` publishes the site as-is. There is no CI.

External runtime dependencies loaded from CDNs (no local copies): Google Fonts (Inter, JetBrains Mono), devicon for tech-stack icons, flagcdn for the language-switch flag, and Formspree (`https://formspree.io/f/xaqpykbp`) as the contact-form backend.

## Architecture notes

### Translations are duplicated — change both places

Every user-visible string exists twice: as literal text in [index.html](index.html) on an element carrying `data-i18n="<key>"`, and as a value in the `translations` object in [script.js:310](script.js#L310) under both `en` and `es`. `setLanguage()` runs on page load (not just on switch) and assigns `translations[lang][key]` into `el.innerHTML`, so the HTML copy is always overwritten and serves only as a no-JS fallback.

Consequences when editing copy:
- Adding a new translatable string means adding the `data-i18n` attribute *and* both language entries. A missing key silently leaves the HTML text in place.
- Values go through `innerHTML`, so inline markup (`<b>`, `<strong>`, `<span class="highlight">`) is intentional and must be preserved in both languages.
- The English entries embed the original HTML's literal newlines and indentation (`\n   ...`); this is cosmetic whitespace, harmless to reproduce or drop.
- `setLanguage()` also swaps the flag image and repoints `#cv-link` between `CV_Lautaro_Mendez_2026_en.pdf` and `CV_Lautaro_Mendez_2026_sp.pdf` — those filenames are hardcoded at [script.js:443](script.js#L443).
- The hero heading is split across `hero-title` / rotating words / `hero-suffix` so word order works in both languages (EN: "Data " + "Engineer"; ES: "Ingeniero" + " de Datos"). Keep all three keys in sync.

Language and theme both persist in `localStorage` (`lang`, `theme`), defaulting to `en` and dark.

### Theming: CSS variables plus a JS mirror

Dark is the default in `:root`; `body.light-mode` overrides the same custom properties ([style.css:16](style.css#L16)). The toggle only adds/removes that class.

The canvas cannot read CSS variables, so `drawLorentz()` branches on `document.body.classList.contains('light-mode')` and uses hardcoded hexes that duplicate the palette — accent `#64ffda` / `#0056b3` and background `#0a192f` / `#f9f8f4` ([script.js:222-246](script.js#L222-L246)). Changing those colors in CSS requires updating these literals too.

### script.js is split across two scopes

Only smooth scrolling, the section-reveal `IntersectionObserver`, and the contact-form handler live inside `DOMContentLoaded`. Theme toggle, canvas, hamburger menu, and i18n run at top level — safe because the `<script>` tag is last in `<body>`.

The reveal observer sets inline `opacity: 0` on every `<section>` and restores it on intersection. The hero is a `<header>`, not a `<section>`, so it is deliberately excluded.

### Canvas background and the easter egg

`#math-canvas` runs a permanent `requestAnimationFrame` loop with two modes. Default is a mouse-reactive quiver/vector field; clicking `#lorentz-trigger` (the faint dot near the top-left of the hero, [index.html:64](index.html#L64)) toggles to a Lorenz attractor trail. The canvas is `pointer-events: none`, which is why the trigger is a separate element at a high `z-index`. A second easter egg is the `?` link in the footer.

### Contact form

`script.js` intercepts submit and posts `FormData` to `contactForm.action` with `Accept: application/json`, then shows `#form-success-msg` / `#form-error-msg` and auto-hides success after 5s. The button's "Sending..." label is hardcoded English and not translated; it restores the original `innerHTML` in `finally` so the translated label survives.

### Tech-stack icons

Two mechanisms in the same grid: devicon classes (`<i class="devicon-python-plain colored tech-icon">`) and inline `<span class="tech-icon custom-tech-icon">` wrapping hand-written SVGs for logos devicon lacks (Databricks, Pydantic, Looker Studio, Power BI, Apps Script). Both rely on `data-name` for the CSS hover tooltip (`.tech-icon::after`). Some of the custom SVGs contain leftover/overlapping path attempts with `opacity="0"` — dead but harmless.

Note the `colored` class on devicon icons is applied selectively (omitted on Pandas, Linux, Bash, SQLAlchemy) for visual consistency against both backgrounds — a deliberate past change, not an oversight.
