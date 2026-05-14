# Gushwork Web Assignment

Responsive product landing page built with vanilla HTML, CSS, and JavaScript.

## Overview

This project implements a product-focused marketing page based on the provided Figma specification. The page is built without frameworks or external UI libraries and focuses on responsive layout behavior, a sticky header, and an interactive image carousel with zoom support.

## Submission Files

- `index.html` - Main page markup
- `styles.css` - Main stylesheet
- `script.js` - Single JavaScript entrypoint
- `assets/` - Images, icons, logos, and fonts used by the page

## Features

- Sticky header that appears after scrolling beyond the first fold
- Smooth header transitions and animation states
- Interactive image carousel with previous and next controls
- Hover-based zoom preview for carousel images
- Responsive layout for desktop, tablet, and mobile breakpoints
- Semantic HTML structure and accessible labels for interactive UI

## Project Structure

```text
.
|-- assets/
|-- index.html
|-- js/
|   |-- applications.js
|   |-- built-to-last.js
|   |-- carousel.js
|   |-- contact-cta.js
|   |-- faq.js
|   |-- footer.js
|   |-- header.js
|   |-- main.js
|   |-- manufacturing-process.js
|   |-- modal.js
|   |-- resources-downloads.js
|   |-- solutions-portfolio.js
|   |-- technical-specs.js
|   |-- testimonials.js
|   `-- trusted-companies.js
|-- README.md
|-- script.js
`-- styles.css
```

## Local Usage

1. Clone or download the repository.
2. Open `index.html` directly in a browser, or serve the folder with any simple static file server.
3. Ensure the `assets/` and `js/` folders remain alongside `index.html`.

## Notes

- The root `script.js` file is the single entrypoint requested for submission.
- Feature-specific behavior remains organized inside the `js/` folder and is loaded in sequence by the entry script.
- The root `styles.css` file contains the active page styles used by the submission.