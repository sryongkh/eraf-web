# Eraf — Photography Portfolio

A four-page editorial photography concept built with HTML, CSS, and JavaScript. The desktop homepage uses GSAP and ScrollTrigger for a cinematic introduction, then moves into three photo series. About, Works, and Contact remain ordinary static pages.

## What this project demonstrates

- Scroll-driven animation with breakpoint and motion-preference cleanup.
- Progressive enhancement: the complete gallery remains readable when JavaScript is disabled or animation scripts fail to load.
- Responsive layouts for small phones through desktop, with a static homepage below 75rem or when reduced motion is enabled.
- Semantic page headings, keyboard focus styles, skip navigation, and direct links to individual photo series.
- Browser regression checks running before GitHub Pages deployment.

This repository presents a photography website concept. It does not establish authorship of the photographs or a commercial client engagement.

## Run the site

The website has no runtime package dependencies. Node.js 24 runs a small build script that copies source pages and assets into `dist/`:

```sh
npm run dev
```

Open [localhost:8000](http://127.0.0.1:8000). Run the command again after editing source files; the preview does not watch for changes. `dist/` contains generated files and is ignored by Git.

To produce files for any static host:

```sh
npm run build
```

Publish the contents of `dist/`. Interior source pages live in `src/pages/`, but the build exports them at their original URLs (`/about.html`, `/works.html`, `/contact.html`). Page and asset links are relative to that generated layout, so preview the build rather than opening the source HTML directly. The site also works under a GitHub Pages project path.

## Verify

Node.js 24 and npm run the build, local preview, and browser test tooling. Install the test dependencies and browser before running verification:

```sh
npm ci
npx playwright install chromium
npm test
```

Playwright builds the current source and serves `dist/` on port 8766 under `/eraf-web/` to catch project-path errors. Chromium checks the four pages at widths of 320, 390, 768, and 1440 pixels; linked local page assets; the desktop fallback without JavaScript or GSAP; motion cleanup when resizing or changing preferences; and gallery structure and section navigation. Failure traces are saved to `test-results/`.

The GitHub Actions workflow verifies pull requests and main-branch pushes. Deployment runs after verification succeeds and uploads only the generated `dist/` directory.

## Demo walkthrough

1. Open the homepage on a desktop and scroll through the animated introduction into the gallery.
2. Resize to a phone viewport, or enable reduced motion, to show the readable static layout.
3. Open Works and jump to a series using its index.
4. Follow About and Contact to complete the visitor journey.
5. Disable JavaScript and reload the homepage to demonstrate that the content remains available.

## Structure

```text
src/
  index.html                 Homepage source
  pages/                     About, Works, and Contact sources
  assets/
    styles/                  Homepage, interior-page, and font styles
      vendor/                Third-party styles
    scripts/
      home.js                Homepage motion and cleanup
      vendor/                Vendored animation and icon libraries
    fonts/                   Font files
    icons/                   Favicons and web manifest
    media/                   Photography and hero video
scripts/
  build.cjs                  Static export, preserving public page URLs
  serve.cjs                  Local preview of the exported site
tests/
  e2e/                       Browser journeys and fallback regressions
dist/                        Generated publication files (not committed)
playwright.config.js         Browser test configuration
```

### Where to make changes

Edit pages and assets in `src/`. Keep custom JavaScript separate from third-party files in `assets/scripts/vendor/`. Add new interior pages in `src/pages/`; the build exports every HTML file in that folder automatically. Keep source-page links relative to the exported root layout. Put browser checks in `tests/e2e/` and build/preview tooling in `scripts/`. Never edit `dist/` directly because the next build replaces it.

## Scope

Contact uses email and portfolio links; there is no contact-form backend. The gallery is maintained in static HTML. Browser automation currently covers Chromium; Safari and Firefox should also be checked before a broad public launch.
