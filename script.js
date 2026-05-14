// Source: .\js\header.js
(() => {
     const header = document.querySelector('.header');
     const firstFold = document.querySelector('main > section');
     const navbar = header?.querySelector('.navbar');
     const navActions = header?.querySelector('.nav-actions');
     const navLinks = header?.querySelector('.nav-links');
     const desktopMedia = window.matchMedia('(min-width: 1025px)');
     const SHRINK_DISTANCE = 220;

     if (!header || !firstFold || !navbar) {
          return;
     }

     let threshold = 0;
     let ticking = false;
     let maxSafeProgress = 1;

     const clamp01 = (value) => Math.min(1, Math.max(0, value));

     const readProgress = () => {
          const value = Number.parseFloat(header.style.getPropertyValue('--header-shrink-progress'));
          return Number.isFinite(value) ? clamp01(value) : 0;
     };

     const setProgress = (value) => {
          header.style.setProperty('--header-shrink-progress', clamp01(value).toFixed(4));
     };

     const isMultiRow = (element) => {
          if (!element) return false;

          const children = Array.from(element.children).filter((child) => {
               return window.getComputedStyle(child).display !== 'none';
          });

          if (children.length < 2) {
               return false;
          }

          const centers = children.map((child) => {
               const rect = child.getBoundingClientRect();
               return rect.top + (rect.height / 2);
          });

          const baselineCenter = centers[0];
          return centers.some((center) => Math.abs(center - baselineCenter) > 8);
     };

     const isOverflowing = (element) => {
          if (!element) return false;
          return (element.scrollWidth - element.clientWidth) > 1;
     };

     const hasBreakpointPressure = () => {
          const navbarWrapped = isMultiRow(navbar);
          const actionsWrapped = isMultiRow(navActions);
          const linksWrapped = isMultiRow(navLinks);

          const navbarOverflow = isOverflowing(navbar);
          const actionsOverflow = isOverflowing(navActions);
          const linksOverflow = isOverflowing(navLinks);

          return navbarWrapped || actionsWrapped || linksWrapped || navbarOverflow || actionsOverflow || linksOverflow;
     };

     const updateWrappedState = () => {
          const wrapped = isMultiRow(navbar) || isMultiRow(navActions);
          header.classList.toggle('is-nav-wrapped', wrapped);
     };

     const recalculateSafeProgress = () => {
          if (!desktopMedia.matches) {
               maxSafeProgress = 0;
               setProgress(0);
               updateWrappedState();
               return;
          }

          const wasPinned = header.classList.contains('is-pinned');
          const previousProgress = readProgress();

          if (!wasPinned) {
               header.classList.add('is-pinned');
          }

          let low = 0;
          let high = 1;

          for (let index = 0; index < 8; index += 1) {
               const mid = (low + high) / 2;
               setProgress(mid);

               if (hasBreakpointPressure()) {
                    high = mid;
               } else {
                    low = mid;
               }
          }

          maxSafeProgress = clamp01(low);
          setProgress(previousProgress);

          if (!wasPinned && window.scrollY <= 0) {
               header.classList.remove('is-pinned');
          }

          updateWrappedState();
     };

     const syncStickyHeight = () => {
          const height = header.offsetHeight;
          document.body.style.setProperty('--sticky-header-height', `${height}px`);
     };

     const setPinnedState = (isPinned) => {
          header.classList.toggle('is-pinned', isPinned);
          document.body.classList.toggle('has-sticky-header', isPinned);
     };

     const setAnnouncementState = (isVisible) => {
          header.classList.toggle('is-announcement-visible', isVisible);
     };

     const computeThreshold = () => {
          const firstFoldVisibleHeight = Math.min(firstFold.offsetHeight, window.innerHeight);
          threshold = firstFold.offsetTop + firstFoldVisibleHeight;
     };

     const onScroll = () => {
          if (ticking) {
               return;
          }

          ticking = true;
          window.requestAnimationFrame(() => {
               const scrollY = window.scrollY;
               const shouldPin = scrollY >= threshold;
               const showAnnouncement = shouldPin;

               setPinnedState(shouldPin);
               setAnnouncementState(showAnnouncement);

               if (shouldPin && desktopMedia.matches) {
                    const desiredProgress = clamp01(scrollY / SHRINK_DISTANCE);
                    setProgress(Math.min(desiredProgress, maxSafeProgress));
               } else {
                    setProgress(0);
               }

               updateWrappedState();
               syncStickyHeight();
               ticking = false;
          });
     };

     const onResize = () => {
          computeThreshold();
          recalculateSafeProgress();
          onScroll();
     };

     computeThreshold();
     recalculateSafeProgress();
     onScroll();

     window.addEventListener('scroll', onScroll, { passive: true });
     window.addEventListener('resize', onResize);
     window.addEventListener('load', onResize);
     desktopMedia.addEventListener('change', onResize);
})();

// Source: .\js\main.js
(() => {
     const dropdown = document.querySelector('.nav-dropdown');
     const toggle = dropdown?.querySelector('.nav-dropdown__toggle');
     const menu = dropdown?.querySelector('.nav-dropdown__menu');

     if (!dropdown || !toggle || !menu) {
          return;
     }

     const setOpen = (isOpen) => {
          dropdown.classList.toggle('is-open', isOpen);
          toggle.setAttribute('aria-expanded', String(isOpen));
          menu.hidden = !isOpen;
     };

     toggle.addEventListener('click', () => {
          setOpen(!dropdown.classList.contains('is-open'));
     });

     menu.querySelectorAll('a').forEach((item) => {
          item.addEventListener('click', () => {
               setOpen(false);
          });
     });

     document.addEventListener('click', (event) => {
          if (!dropdown.contains(event.target)) {
               setOpen(false);
          }
     });

     document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
               setOpen(false);
               toggle.focus();
          }
     });

     dropdown.addEventListener('focusout', (event) => {
          if (!dropdown.contains(event.relatedTarget)) {
               setOpen(false);
          }
     });

     setOpen(false);
})();

// Source: .\js\carousel.js
(() => {
     const carousel = document.querySelector('[data-carousel]');

     if (!carousel) {
          return;
     }

     const track = carousel.querySelector('[data-carousel-track]');
     const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
     const prevButton = carousel.querySelector('[data-carousel-prev]');
     const nextButton = carousel.querySelector('[data-carousel-next]');
     const viewport = carousel.querySelector('[data-carousel-viewport]');
     const zoomSurface = carousel.querySelector('[data-carousel-zoom-surface]');
     const status = carousel.querySelector('[data-carousel-status]');
     let thumbnailContainer = carousel.querySelector('[data-carousel-thumbnails]');

     if (!track || slides.length === 0 || !viewport || !zoomSurface) {
          return;
     }

     // Maximum number of thumbnail slots to display
     const MAX_THUMBNAILS = 6;

     // Dynamically generate thumbnails based on number of slides
     let thumbs = Array.from(carousel.querySelectorAll('[data-carousel-thumb]'));
     if (thumbs.length === 0 && thumbnailContainer) {
          thumbs = generateThumbnails(slides.length, thumbnailContainer);
     }

     let activeIndex = 0;

     const isInteractionBlocked = () => {
          const modalOverlay = document.querySelector('#datasheet-modal-overlay');
          const modal = document.querySelector('#datasheet-modal');

          return document.body.classList.contains('modal-open') ||
               document.body.dataset.scrollLocked === 'true' ||
               (Boolean(modal?.open) && Boolean(modalOverlay) && !modalOverlay.hasAttribute('hidden'));
     };

     const stopEvent = (event) => {
          if (!event) return;

          event.preventDefault();
          event.stopPropagation();

          if (typeof event.stopImmediatePropagation === 'function') {
               event.stopImmediatePropagation();
          }
     };

     const getThumbByEvent = (event) => {
          const target = event.target;

          if (!(target instanceof Element)) {
               return null;
          }

          return target.closest('[data-carousel-thumb]');
     };

     const thumbHasImage = (thumb) => Boolean(thumb?.querySelector('img'));

     const normalizeIndex = (index) => {
          if (!Number.isInteger(index) || slides.length === 0) {
               return activeIndex;
          }

          return (index + slides.length) % slides.length;
     };

     /**
      * Generate thumbnail buttons dynamically based on slide count
      * Creates all thumbnails as empty placeholders - images added separately
      */
     function generateThumbnails(slideCount, container) {
          const generatedThumbs = [];

          // Generate thumbnail buttons from the slide images first.
          for (let i = 0; i < slideCount; i++) {
               const button = document.createElement('button');
               button.type = 'button';
               button.className = 'carousel-thumbnail';
               button.setAttribute('data-carousel-thumb', '');
               button.setAttribute('data-index', i);
               button.setAttribute('aria-label', `Thumbnail ${i + 1}`);
               button.setAttribute('aria-current', i === 0 ? 'true' : 'false');
               button.setAttribute('tabindex', i === 0 ? '0' : '-1');
               button.setAttribute('role', 'tab');

               const slideImage = slides[i]?.querySelector('img');
               if (slideImage) {
                    const thumbnailImage = document.createElement('img');
                    thumbnailImage.src = slideImage.currentSrc || slideImage.src;
                    thumbnailImage.alt = '';
                    thumbnailImage.decoding = 'async';
                    thumbnailImage.loading = i === 0 ? 'eager' : 'lazy';
                    button.appendChild(thumbnailImage);
               }

               container.appendChild(button);
               generatedThumbs.push(button);
          }

          // Generate empty placeholder thumbnails to reach MAX_THUMBNAILS
          for (let i = slideCount; i < MAX_THUMBNAILS; i++) {
               const button = document.createElement('button');
               button.type = 'button';
               button.className = 'carousel-thumbnail carousel-thumbnail--empty';
               button.setAttribute('data-carousel-thumb', '');
               button.setAttribute('data-index', i);
               button.setAttribute('aria-label', `Empty thumbnail slot ${i + 1}`);
               button.setAttribute('aria-current', 'false');
               button.setAttribute('tabindex', '-1');
               button.setAttribute('role', 'tab');
               button.disabled = true;

               const span = document.createElement('span');
               span.className = 'visually-hidden';
               span.textContent = `Empty thumbnail slot ${i + 1}`;
               button.appendChild(span);

               container.appendChild(button);
               generatedThumbs.push(button);
          }

          return generatedThumbs;
     }

     const render = () => {
          // Keep the active slide, thumbnail state, and live region in sync.
          track.style.transform = `translateX(-${activeIndex * 100}%)`;

          slides.forEach((slide, index) => {
               slide.classList.toggle('is-active', index === activeIndex);
          });

          thumbs.forEach((thumb, index) => {
               const hasImage = !!thumb.querySelector('img');

               if (hasImage) {
                    thumb.classList.toggle('is-active', index === activeIndex);
                    thumb.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
                    thumb.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
               } else {
                    // Thumbnails without an image are never active or focusable
                    thumb.classList.remove('is-active');
                    thumb.setAttribute('aria-current', 'false');
                    thumb.setAttribute('tabindex', '-1');
               }
          });

          const activeSlide = slides[activeIndex];
          const zoomImage = activeSlide.dataset.zoomImage || activeSlide.querySelector('img')?.src;

          if (zoomImage) {
               zoomSurface.style.backgroundImage = `url('${zoomImage}')`;
          }

          if (status) {
               status.textContent = `Showing image ${activeIndex + 1} of ${slides.length}`;
          }
     };

     const setActiveIndex = (nextIndex) => {
          if (!Number.isInteger(nextIndex) || slides.length === 0) {
               return;
          }

          const normalizedIndex = normalizeIndex(nextIndex);
          if (normalizedIndex === activeIndex) {
               return;
          }

          activeIndex = normalizedIndex;
          render();
     };

     prevButton?.addEventListener('click', (event) => {
          if (isInteractionBlocked()) {
               event.preventDefault();
               event.stopPropagation();
               return;
          }

          setActiveIndex(activeIndex - 1);
     });

     nextButton?.addEventListener('click', (event) => {
          if (isInteractionBlocked()) {
               event.preventDefault();
               event.stopPropagation();
               return;
          }

          setActiveIndex(activeIndex + 1);
     });

     // Capture blocked-state thumbnail interactions before any bubbling/default behavior can run.
     thumbnailContainer?.addEventListener('pointerdown', (event) => {
          const thumb = getThumbByEvent(event);
          if (!thumb) return;

          if (isInteractionBlocked()) {
               stopEvent(event);
          }
     }, true);

     thumbnailContainer?.addEventListener('click', (event) => {
          const thumb = getThumbByEvent(event);
          if (!thumb) return;

          if (isInteractionBlocked() || !event.isTrusted || event.defaultPrevented || !thumbHasImage(thumb)) {
               stopEvent(event);
               return;
          }

          stopEvent(event);

          const nextIndex = Number.parseInt(thumb.getAttribute('data-index') || '', 10);
          if (!Number.isInteger(nextIndex)) {
               return;
          }

          setActiveIndex(nextIndex);
     });

     thumbnailContainer?.addEventListener('keydown', (event) => {
          const thumb = getThumbByEvent(event);
          if (!thumb) return;

          if (isInteractionBlocked() || !thumbHasImage(thumb)) {
               stopEvent(event);
               return;
          }

          const index = Number.parseInt(thumb.getAttribute('data-index') || '', 10);
          if (!Number.isInteger(index)) {
               stopEvent(event);
               return;
          }

          if (event.key === 'ArrowRight') {
               stopEvent(event);
               const next = thumbs.slice(index + 1).find(t => thumbHasImage(t));
               if (next) { setActiveIndex(thumbs.indexOf(next)); next.focus(); }
          }

          if (event.key === 'ArrowLeft') {
               stopEvent(event);
               const prev = [...thumbs].slice(0, index).reverse().find(t => thumbHasImage(t));
               if (prev) { setActiveIndex(thumbs.indexOf(prev)); prev.focus(); }
          }

          if (event.key === 'Home') {
               stopEvent(event);
               const first = thumbs.find(t => thumbHasImage(t));
               if (first) { setActiveIndex(thumbs.indexOf(first)); first.focus(); }
          }

          if (event.key === 'End') {
               stopEvent(event);
               const last = [...thumbs].reverse().find(t => thumbHasImage(t));
               if (last) { setActiveIndex(thumbs.indexOf(last)); last.focus(); }
          }
     });

     viewport.addEventListener('keydown', (event) => {
          if (isInteractionBlocked()) {
               event.preventDefault();
               return;
          }

          if (event.key === 'ArrowRight') {
               event.preventDefault();
               setActiveIndex(activeIndex + 1);
          }

          if (event.key === 'ArrowLeft') {
               event.preventDefault();
               setActiveIndex(activeIndex - 1);
          }
     });

     viewport.addEventListener('mousemove', (event) => {
          if (isInteractionBlocked()) {
               carousel.classList.remove('is-zooming');
               return;
          }

          const bounds = viewport.getBoundingClientRect();
          const relativeX = ((event.clientX - bounds.left) / bounds.width) * 100;
          const relativeY = ((event.clientY - bounds.top) / bounds.height) * 100;

          carousel.classList.add('is-zooming');
          zoomSurface.style.backgroundPosition = `${relativeX}% ${relativeY}%`;
     });

     viewport.addEventListener('mouseenter', () => {
          if (isInteractionBlocked()) {
               return;
          }

          carousel.classList.add('is-zooming');
          zoomSurface.style.backgroundPosition = '50% 50%';
     });

     viewport.addEventListener('mouseleave', () => {
          carousel.classList.remove('is-zooming');
          zoomSurface.style.backgroundPosition = '50% 50%';
     });

     render();
})();

// Source: .\js\trusted-companies.js
(() => {
     // ─── Configuration ─────────────────────────────────────────────────────────
     // Update COMPANIES to add/remove logos. Each entry needs { name, logo }.
     // The logo path is relative to the HTML file, not this script.

     const COMPANIES = [
          { name: 'Euroflex', logo: './assets/images/icons/icon-companies.png' },
          { name: 'Euroflex', logo: './assets/images/icons/icon-companies.png' },
          { name: 'Euroflex', logo: './assets/images/icons/icon-companies.png' },
          { name: 'Euroflex', logo: './assets/images/icons/icon-companies.png' },
          { name: 'Euroflex', logo: './assets/images/icons/icon-companies.png' },
          { name: 'Euroflex', logo: './assets/images/icons/icon-companies.png' },
     ];

     // Derived — no need to touch manually.
     const COMPANY_COUNT = COMPANIES.length;

     // ─── Mount target ───────────────────────────────────────────────────────────
     const section = document.querySelector('[data-trusted-companies]');
     if (!section) return;

     const track = section.querySelector('[data-trusted-companies-track]');
     const countEl = section.querySelector('[data-trusted-companies-count]');

     if (!track) return;

     // ─── Render count ───────────────────────────────────────────────────────────
     if (countEl) {
          countEl.textContent = `${COMPANY_COUNT}+`;
     }

     // ─── Render logos ───────────────────────────────────────────────────────────
     COMPANIES.forEach(({ name, logo }) => {
          const item = document.createElement('li');
          item.className = 'trusted-companies__item';

          const img = document.createElement('img');
          img.src = logo;
          img.alt = name;
          img.loading = 'lazy';
          img.decoding = 'async';
          img.className = 'trusted-companies__logo';

          // Fallback: hide broken images gracefully
          img.addEventListener('error', () => {
               item.setAttribute('aria-hidden', 'true');
               item.classList.add('trusted-companies__item--broken');
          });

          item.appendChild(img);
          track.appendChild(item);
     });
})();

// Source: .\js\technical-specs.js
(() => {
     const INDIA_FLAG = '<img src="./assets/images/icons/icon-nationalFlag.png" alt="" loading="lazy" decoding="async" />';

     const TECHNICAL_SPEC_ROWS = [
          {
               parameter: 'Pipe Diameter Range',
               specification: '20mm to 1600mm (3/4" to 63")',
          },
          {
               parameter: 'Pressure Ratings',
               specification: 'PN 2.5, PN 4, PN 6, PN 8, PN 10, PN 12.5, PN 16',
          },
          {
               parameter: 'Standard Dimension Ratio',
               specification: 'SDR 33, SDR 26, SDR 21, SDR 17, SDR 13.6, SDR 11',
          },
          {
               parameter: 'Operating Temperature',
               specification: '-40C to +80C (-40F to +176F)',
          },
          {
               parameter: 'Service Life',
               specification: '50+ Years (at 20 degrees C, PN 10)',
          },
          {
               parameter: 'Material Density',
               specification: '0.95 - 0.96 g/cm3',
          },
          {
               parameter: 'Certification Standards',
               specification: 'IS 5984, ISO 4427, ASTM D3035',
          },
          {
               parameter: 'Joint Type',
               specification: 'Butt Fusion, Electrofusion, Mechanical',
          },
          {
               parameter: 'Coil Lengths',
               specification: 'Up to 500m (for smaller diameters)',
          },
          {
               parameter: 'Country of Origin',
               specification: `<span class="technical-specs__country-flag" aria-hidden="true">${INDIA_FLAG}</span> India`,
          },
     ];

     const rowsRoot = document.querySelector('[data-technical-spec-rows]');
     if (!rowsRoot) return;

     const rowsMarkup = TECHNICAL_SPEC_ROWS.map(({ parameter, specification }) => {
          return `
               <tr>
                    <th scope="row">${parameter}</th>
                    <td>${specification}</td>
               </tr>
          `;
     }).join('');

     rowsRoot.innerHTML = rowsMarkup;
})();

// Source: .\js\built-to-last.js
(() => {
     const BUILT_TO_LAST_CARDS = [
          {
               icon: 'bag',
               title: 'Superior Chemical Resistance',
               description:
                    "HDPE pipes resist a wide range of chemicals, acids, and alkalis. Unlike metal pipes, they won't corrode, rust, or scale, ensuring pure water quality and extended service life in aggressive environments.",
          },
          {
               icon: 'feather',
               title: 'Exceptional Flexibility & Durability',
               description:
                    "HDPE pipes resist a wide range of chemicals, acids, and alkalis. Unlike metal pipes, they won't corrode, rust, or scale, ensuring pure water quality and extended service life in aggressive environments.",
          },
          {
               icon: 'cube',
               title: 'Leak-Proof Fusion Welding',
               description:
                    "HDPE pipes resist a wide range of chemicals, acids, and alkalis. Unlike metal pipes, they won't corrode, rust, or scale, ensuring pure water quality and extended service life in aggressive environments.",
          },
          {
               icon: 'gear',
               title: 'Cost-Effective Long-Term Solution',
               description:
                    "HDPE pipes resist a wide range of chemicals, acids, and alkalis. Unlike metal pipes, they won't corrode, rust, or scale, ensuring pure water quality and extended service life in aggressive environments.",
          },
          {
               icon: 'gear',
               title: 'Environmentally Sustainable',
               description:
                    "HDPE pipes resist a wide range of chemicals, acids, and alkalis. Unlike metal pipes, they won't corrode, rust, or scale, ensuring pure water quality and extended service life in aggressive environments.",
          },
          {
               icon: 'gear',
               title: 'Certified Quality Assurance',
               description:
                    "HDPE pipes resist a wide range of chemicals, acids, and alkalis. Unlike metal pipes, they won't corrode, rust, or scale, ensuring pure water quality and extended service life in aggressive environments.",
          },
     ];

     const ICONS = {
          bag: `<img src="./assets/images/icons/icon-bag.png" alt="" loading="lazy" decoding="async" />`,
          feather: `<img src="./assets/images/icons/icon-sewing.png" alt="" loading="lazy" decoding="async" />`,
          cube: `<img src="./assets/images/icons/icon-box.png" alt="" loading="lazy" decoding="async" />`,
          gear: `<img src="./assets/images/icons/icon-gear.png" alt="" loading="lazy" decoding="async" />`,
     };

     const container = document.querySelector('[data-built-to-last-grid]');
     if (!container) return;

     container.innerHTML = BUILT_TO_LAST_CARDS.map(({ icon, title, description }) => `
          <article class="built-to-last__card">
               <span class="built-to-last__icon" aria-hidden="true">${ICONS[icon]}</span>
               <h3 class="built-to-last__card-title">${title}</h3>
               <p class="built-to-last__card-description">${description}</p>
          </article>
     `).join('');
})();

// Source: .\js\faq.js
(() => {
     const FAQ_ITEMS = [
          {
               question: 'What is the purpose of a laser cutter for sheet metal?',
               answer:
                    'It is designed to cut various types of sheet metal with precision, allowing for intricate designs and shapes that are essential in manufacturing processes.',
               expanded: true,
          },
          {
               question: 'What are the benefits of using aluminum tubing in manufacturing?',
               answer:
                    'Aluminum tubing offers a lightweight, corrosion-resistant, and adaptable solution for a wide range of industrial applications.',
          },
          {
               question: 'How is aluminum tubing produced?',
               answer:
                    'Aluminum tubing is typically produced through extrusion, drawing, and finishing processes tailored to the required diameter and profile.',
          },
          {
               question: 'What are the common applications of aluminum tubing?',
               answer:
                    'It is used in structural frameworks, transport systems, HVAC assemblies, machinery, and many precision fabrication projects.',
          },
          {
               question: 'Can aluminum tubing be customized?',
               answer:
                    'Yes. It can be customized by dimension, thickness, finish, and fabrication requirements to suit project-specific needs.',
          },
     ];

     const accordionRoot = document.querySelector('[data-faq-accordion]');
     const form = document.querySelector('[data-faq-catalogue-form]');
     const emailInput = document.querySelector('[data-faq-catalogue-email]');
     const message = document.querySelector('[data-faq-catalogue-message]');

     if (!accordionRoot || !form || !emailInput || !message) {
          return;
     }

     const idBase = 'faq-item';

     const iconMarkup = `<img src="./assets/images/icons/icon-chevron-up.png" alt="" loading="lazy" decoding="async" />`;

     accordionRoot.innerHTML = FAQ_ITEMS.map(({ question, answer, expanded }, index) => {
          const itemId = `${idBase}-${index + 1}`;
          const isFirstItem = index === 0;

          // First item: interactive button trigger; others: static div
          const triggerElement = isFirstItem
               ? `<button class="faq-item__trigger" type="button" aria-expanded="${expanded ? 'true' : 'false'}"
                    aria-controls="${itemId}-panel" id="${itemId}-trigger" data-faq-trigger>
                    <span>${question}</span>
                    <span class="faq-item__icon" aria-hidden="true">${iconMarkup}</span>
               </button>`
               : `<div class="faq-item__trigger" style="cursor: default;">
                    <span>${question}</span>
                    <span class="faq-item__icon" aria-hidden="true">${iconMarkup}</span>
               </div>`;

          return `
               <article class="faq-item${expanded ? ' is-open' : ''}" data-faq-item>
                    <h3 class="faq-item__title">
                         ${triggerElement}
                    </h3>
                    <div class="faq-item__panel" id="${itemId}-panel" role="region" aria-labelledby="${itemId}-trigger"
                         data-faq-panel ${expanded ? '' : 'hidden'}>
                         <div class="faq-item__panel-inner">
                              <p>${answer}</p>
                         </div>
                    </div>
               </article>
          `;
     }).join('');

     const items = Array.from(accordionRoot.querySelectorAll('[data-faq-item]'));

     const setPanelHeight = (item, isOpen) => {
          const panel = item.querySelector('[data-faq-panel]');
          if (!panel) return;

          panel.hidden = false;
          panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';
          item.classList.toggle('is-open', isOpen);

          if (!isOpen) {
               window.setTimeout(() => {
                    if (!item.classList.contains('is-open')) {
                         panel.hidden = true;
                    }
               }, 260);
          }
     };

     const closeItem = (item) => {
          const trigger = item.querySelector('[data-faq-trigger]');
          if (trigger) {
               trigger.setAttribute('aria-expanded', 'false');
          }
          setPanelHeight(item, false);
     };

     const openItem = (item) => {
          const trigger = item.querySelector('[data-faq-trigger]');
          if (trigger) {
               trigger.setAttribute('aria-expanded', 'true');
          }
          setPanelHeight(item, true);
     };

     items.forEach((item, itemIndex) => {
          const trigger = item.querySelector('[data-faq-trigger]');
          const panel = item.querySelector('[data-faq-panel]');
          if (!trigger || !panel) return;

          const isOpen = item.classList.contains('is-open');
          panel.hidden = !isOpen;
          panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';

          // Only first item is interactive; rest are dummy
          if (itemIndex === 0) {
               trigger.addEventListener('click', () => {
                    const currentlyOpen = item.classList.contains('is-open');

                    if (currentlyOpen) {
                         closeItem(item);
                         trigger.setAttribute('aria-expanded', 'false');
                    } else {
                         openItem(item);
                         trigger.setAttribute('aria-expanded', 'true');
                    }
               });
          }
     });

     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     const setMessage = (text, isError = false) => {
          message.textContent = text;
          message.classList.toggle('is-error', isError);
          message.classList.toggle('is-success', !isError && Boolean(text));
     };

     form.addEventListener('submit', (event) => {
          event.preventDefault();

          const value = emailInput.value.trim();

          if (!value) {
               setMessage('Please enter your email address.', true);
               emailInput.focus();
               return;
          }

          if (!emailPattern.test(value)) {
               setMessage('Please enter a valid email address.', true);
               emailInput.focus();
               return;
          }

          setMessage('Catalogue request ready. We will contact you shortly.');
          form.reset();
     });
})();

// Source: .\js\applications.js
(() => {
     const APPLICATION_CARDS = [
          {
               title: 'Fishnet Manufacturing',
               description: 'High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads used in modern packaging applications.',
          },
          {
               title: 'Fishnet Manufacturing',
               description: 'High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads used in modern packaging applications.',
          },
          {
               title: 'Fishnet Manufacturing',
               description: 'High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads used in modern packaging applications.',
          },
          {
               title: 'Fishnet Manufacturing',
               description: 'High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads used in modern packaging applications.',
          },
          {
               title: 'Fishnet Manufacturing',
               description: 'High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads used in modern packaging applications.',
          },
     ];

     const slider = document.querySelector('[data-applications-slider]');
     if (!slider) return;

     const track = slider.querySelector('[data-applications-track]');
     const prevButton = slider.querySelector('[data-applications-prev]');
     const nextButton = slider.querySelector('[data-applications-next]');

     if (!track || !prevButton || !nextButton) return;

     const bgUrl = './assets/images/backgrounds/section-information-bg.png';

     track.innerHTML = APPLICATION_CARDS.map(({ title, description }, index) => `
          <article class="applications-card">
               <img class="applications-card__image" src="${bgUrl}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
               <div class="applications-card__overlay" aria-hidden="true"></div>
               <div class="applications-card__body">
                    <h3 class="applications-card__title">${title}</h3>
                    <p class="applications-card__description">${description}</p>
               </div>
          </article>
     `).join('');

     const scrollAmount = () => {
          const card = track.querySelector('.applications-card');
          if (!card) return 360;
          const cardWidth = card.getBoundingClientRect().width;
          const styles = window.getComputedStyle(track);
          const gap = parseFloat(styles.gap || styles.columnGap || '0') || 0;
          return cardWidth + gap;
     };

     const updateControls = () => {
          const maxScrollLeft = track.scrollWidth - track.clientWidth;
          prevButton.disabled = track.scrollLeft <= 4;
          nextButton.disabled = track.scrollLeft >= maxScrollLeft - 4;
     };

     const scrollTrack = (direction) => {
          track.scrollBy({ left: direction * scrollAmount(), behavior: 'smooth' });
     };

     prevButton.addEventListener('click', () => scrollTrack(-1));
     nextButton.addEventListener('click', () => scrollTrack(1));
     track.addEventListener('scroll', updateControls, { passive: true });
     window.addEventListener('resize', updateControls);

     updateControls();
})();

// Source: .\js\manufacturing-process.js
(() => {
     const PROCESS_STEPS = [
          {
               tab: 'Raw Material',
               title: 'High-Grade Raw Material Selection',
               description:
                    'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
               highlights: ['PE100 grade material', 'Optimal molecular weight distribution'],
          },
          {
               tab: 'Extrusion',
               title: 'Precision Extrusion Process',
               description:
                    'Controlled melt flow and calibrated extrusion lines ensure consistent wall thickness and structural stability throughout production.',
               highlights: ['Computer-controlled extrusion line', 'Uniform melt pressure and throughput'],
          },
          {
               tab: 'Cooling',
               title: 'Optimized Cooling Control',
               description:
                    'Multi-stage cooling systems stabilize product geometry and prevent deformation during high-speed manufacturing operations.',
               highlights: ['Multi-zone water cooling', 'Stable dimensional retention'],
          },
          {
               tab: 'Sizing',
               title: 'Accurate Sizing & Calibration',
               description:
                    'Calibrators and vacuum tanks align dimensions with strict tolerances to maintain quality consistency across batches.',
               highlights: ['Vacuum calibration units', 'Strict diameter tolerance checks'],
          },
          {
               tab: 'Quality Control',
               title: 'Comprehensive Quality Verification',
               description:
                    'Every batch undergoes rigorous physical, dimensional, and pressure integrity checks before final release.',
               highlights: ['In-line and lab testing', 'Pressure and impact validation'],
          },
          {
               tab: 'Marking',
               title: 'Traceability Marking System',
               description:
                    'Continuous on-line marking ensures each pipe includes complete traceability details for standards compliance.',
               highlights: ['Batch and spec coding', 'Standards-compliant print clarity'],
          },
          {
               tab: 'Cutting',
               title: 'Precision Cutting & Finishing',
               description:
                    'Automated cutting units deliver exact lengths with clean, burr-free edges for seamless installation.',
               highlights: ['Automated length control', 'Clean edge finishing'],
          },
          {
               tab: 'Packaging',
               title: 'Secure Final Packaging',
               description:
                    'Finished pipes are packed with protective handling standards to preserve quality throughout transit and storage.',
               highlights: ['Transit-safe bundling', 'Moisture and handling protection'],
          },
     ];

     const root = document.querySelector('[data-manufacturing-process]');
     if (!root) return;

     const tabsRoot = root.querySelector('[data-manufacturing-tabs]');
     const titleEl = root.querySelector('[data-manufacturing-title]');
     const descriptionEl = root.querySelector('[data-manufacturing-description]');
     const highlightsEl = root.querySelector('[data-manufacturing-highlights]');
     const contentEl = root.querySelector('[data-manufacturing-content]');
     const prevButton = root.querySelector('[data-manufacturing-prev]');
     const nextButton = root.querySelector('[data-manufacturing-next]');

     if (!tabsRoot || !titleEl || !descriptionEl || !highlightsEl || !contentEl || !prevButton || !nextButton) {
          return;
     }

     let activeIndex = 0;

     tabsRoot.innerHTML = PROCESS_STEPS.map((step, index) => {
          const id = `manufacturing-tab-${index + 1}`;
          const panelId = `manufacturing-panel-${index + 1}`;
          return `
               <button type="button" class="manufacturing-process__tab" role="tab" id="${id}"
                    aria-controls="${panelId}" aria-selected="${index === 0 ? 'true' : 'false'}"
                    tabindex="${index === 0 ? '0' : '-1'}" data-manufacturing-tab data-index="${index}">
                    ${step.tab}
               </button>
          `;
     }).join('');

     const tabs = Array.from(tabsRoot.querySelectorAll('[data-manufacturing-tab]'));

     const syncConnectorLine = () => {
          const firstTab = tabs[0];
          const lastTab = tabs[tabs.length - 1];

          if (!firstTab || !lastTab) return;

          const start = firstTab.offsetLeft + firstTab.offsetWidth / 2;
          const end = lastTab.offsetLeft + lastTab.offsetWidth / 2;
          tabsRoot.style.setProperty('--process-line-start', `${start}px`);
          tabsRoot.style.setProperty('--process-line-width', `${Math.max(end - start, 0)}px`);
     };

     const queueConnectorSync = () => {
          window.requestAnimationFrame(() => {
               syncConnectorLine();
               window.requestAnimationFrame(syncConnectorLine);
          });
     };

     const updateControls = () => {
          prevButton.disabled = activeIndex === 0;
          nextButton.disabled = activeIndex === PROCESS_STEPS.length - 1;
     };

     const renderHighlights = (items) => {
          highlightsEl.innerHTML = items
               .map((item) => `<li><span>${item}</span></li>`)
               .join('');
     };

     const render = (index, animate = true) => {
          activeIndex = index;
          const step = PROCESS_STEPS[activeIndex];

          tabs.forEach((tab, tabIndex) => {
               const isActive = tabIndex === activeIndex;
               tab.classList.toggle('is-active', isActive);
               tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
               tab.setAttribute('tabindex', isActive ? '0' : '-1');
          });

          if (animate) {
               contentEl.classList.add('is-switching');
          }

          window.setTimeout(() => {
               titleEl.textContent = step.title;
               descriptionEl.textContent = step.description;
               renderHighlights(step.highlights);
               updateControls();
               contentEl.classList.remove('is-switching');
          }, animate ? 90 : 0);
     };

     tabs.forEach((tab) => {
          tab.addEventListener('click', () => {
               const index = Number(tab.dataset.index);
               if (Number.isNaN(index) || index === activeIndex) return;
               render(index, true);
          });
     });

     prevButton.addEventListener('click', () => {
          if (activeIndex > 0) {
               render(activeIndex - 1, true);
          }
     });

     nextButton.addEventListener('click', () => {
          if (activeIndex < PROCESS_STEPS.length - 1) {
               render(activeIndex + 1, true);
          }
     });

     render(0, false);
     queueConnectorSync();
     window.addEventListener('resize', queueConnectorSync);
     window.addEventListener('load', queueConnectorSync);

     if (document.fonts?.ready) {
          document.fonts.ready.then(queueConnectorSync);
     }

     if ('ResizeObserver' in window) {
          new ResizeObserver(queueConnectorSync).observe(tabsRoot);
     }
})();

// Source: .\js\resources-downloads.js
(() => {
     const DOWNLOAD_RESOURCES = [
          {
               title: 'HDPE Pipe Installation Manual (PDF)',
               fileName: 'hdpe-pipe-installation-manual.pdf',
          },
          {
               title: 'Maintenance & Inspection Handbook (PDF)',
               fileName: 'maintenance-inspection-handbook.pdf',
          },
          {
               title: 'Engineering Specifications Sheet (PDF)',
               fileName: 'engineering-specifications-sheet.pdf',
          },
     ];

     const root = document.querySelector('[data-resources-downloads]');
     if (!root) return;

     const list = root.querySelector('[data-resources-list]');
     if (!list) return;

     const iconDownload = `<img src="./assets/images/icons/icon-download.png" alt="" loading="lazy" decoding="async" />`;

     list.innerHTML = DOWNLOAD_RESOURCES.map((resource, index) => {
          return `
               <li class="resources-downloads__row">
                    <p class="resources-downloads__title">${resource.title}</p>
                    <button class="resources-downloads__action" type="button" data-resource-index="${index}">
                         <span>Download PDF</span>
                         <span class="resources-downloads__icon">${iconDownload}</span>
                    </button>
               </li>
          `;
     }).join('');

     const buildPdfBlob = (resourceTitle) => {
          const placeholder = [
               '%PDF-1.1',
               `1 0 obj<</Title(${resourceTitle})>>endobj`,
               'trailer<</Root 1 0 R>>',
               '%%EOF',
          ].join('\n');

          return new Blob([placeholder], { type: 'application/pdf' });
     };

     list.addEventListener('click', (event) => {
          const action = event.target.closest('.resources-downloads__action');
          if (!action) return;

          const index = Number(action.dataset.resourceIndex);
          const resource = DOWNLOAD_RESOURCES[index];
          if (!resource) return;

          const blob = buildPdfBlob(resource.title);
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = resource.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.setTimeout(() => URL.revokeObjectURL(url), 500);
     });
})();

// Source: .\js\solutions-portfolio.js
(() => {
     const SOLUTIONS = [
          {
               title: 'HDPE Fittings & Accessories',
               description:
                    'Complete range of electrofusion and butt fusion fittings, including elbows, tees, reducers, and couplers for seamless pipe connections.',
               image: './assets/images/portfolio/india-engineer-man.jpg',
               imageAlt: 'Engineer wearing a yellow safety helmet reviewing production operations',
               ctaLabel: 'Learn More',
          },
          {
               title: 'Professional Installation Services',
               description:
                    'Expert installation and fusion welding services ensuring optimal system performance, compliance with standards, and long-term reliability.',
               image: './assets/images/portfolio/group-of-engineer-man.jpg',
               imageAlt: 'Two engineers in safety gear discussing industrial installation details',
               ctaLabel: 'Learn More',
          },
          {
               title: 'PE-RT Heating Pipes',
               description:
                    'Polyethylene of Raised Temperature resistance pipes ideal for underfloor heating, radiator connections, and hot water applications.',
               image: './assets/images/portfolio/india-engineer-man.jpg',
               imageAlt: 'Engineer in a factory aisle for PE-RT heating pipe applications',
               ctaLabel: 'Learn More',
          },
     ];

     const root = document.querySelector('[data-solutions-portfolio]');
     if (!root) return;

     const grid = root.querySelector('[data-solutions-grid]');
     if (!grid) return;

     grid.innerHTML = SOLUTIONS.map((item) => {
          return `
               <article class="solutions-portfolio__card">
                    <h3 class="solutions-portfolio__card-title">${item.title}</h3>
                    <p class="solutions-portfolio__card-description">${item.description}</p>
                    <figure class="solutions-portfolio__card-media">
                         <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" decoding="async" />
                    </figure>
                    <button type="button" class="solutions-portfolio__card-cta">${item.ctaLabel}</button>
               </article>
          `;
     }).join('');
})();

// Source: .\js\testimonials.js
(() => {
     const TESTIMONIALS = [
          {
               title: 'Excellent support for specialized applications.',
               description:
                    'The durability and performance of Meera\'s fishnet processing equipment has significantly improved our marine product quality. Excellent support for specialized applications.',
               name: 'Carlos Mendoza',
               role: 'Operations Manager',
          },
          {
               title: 'Provides the exact specifications we need!',
               description:
                    'For our technical textile applications, Meera\'s specialized machinery provides the exact specifications we need. Their understanding of our automotive textile requirements is exceptional.',
               name: 'Rajesh Kumar',
               role: 'Manufacturing Head',
          },
          {
               title: 'Revolutionized our FIBC production efficiency!',
               description:
                    'Meera Industries\' TFO machines have revolutionized our FIBC production efficiency. Their precision engineering delivers the consistent yarn strength critical for our bulk container applications.',
               name: 'Johann Mueller',
               role: 'Production Director',
          },
          {
               title: 'Consistent output with dependable uptime.',
               description:
                    'From setup to daily output, the machine performance has stayed stable under demanding schedules. The process consistency helped us reduce quality variation across batches.',
               name: 'Anita Sharma',
               role: 'Plant Supervisor',
          },
          {
               title: 'Strong engineering and responsive service.',
               description:
                    'The team helped us align configuration with our technical thread line quickly. We saw smooth commissioning and responsive support during every optimization cycle.',
               name: 'Luca Bianchi',
               role: 'Technical Lead',
          },
     ];

     const root = document.querySelector('[data-testimonials-slider]');
     if (!root) return;

     const viewport = root.querySelector('[data-testimonials-viewport]');
     const track = root.querySelector('[data-testimonials-track]');

     if (!viewport || !track) return;

     track.innerHTML = TESTIMONIALS.map((item) => {
          return `
               <article class="testimonial-card">
                    <img class="testimonial-card__quote" src="./assets/images/icons/icon-quote.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                    <h3 class="testimonial-card__title">${item.title}</h3>
                    <p class="testimonial-card__description">${item.description}</p>
                    <footer class="testimonial-card__profile">
                         <div class="testimonial-card__avatar" aria-hidden="true"></div>
                         <div class="testimonial-card__person">
                              <p class="testimonial-card__name">${item.name}</p>
                              <p class="testimonial-card__role">${item.role}</p>
                         </div>
                    </footer>
               </article>
          `;
     }).join('');

     const getStep = () => {
          const card = track.querySelector('.testimonial-card');
          if (!card) return 320;
          const styles = window.getComputedStyle(track);
          const gap = parseFloat(styles.gap || styles.columnGap || '0') || 0;
          return card.getBoundingClientRect().width + gap;
     };

     viewport.addEventListener('keydown', (event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') {
               return;
          }

          event.preventDefault();

          if (event.key === 'Home') {
               viewport.scrollTo({ left: 0, behavior: 'smooth' });
               return;
          }

          if (event.key === 'End') {
               viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'smooth' });
               return;
          }

          const direction = event.key === 'ArrowRight' ? 1 : -1;
          viewport.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
     });

     let isDragging = false;
     let startX = 0;
     let startScrollLeft = 0;

     const stopDragging = () => {
          isDragging = false;
          viewport.classList.remove('is-dragging');
          viewport.style.removeProperty('user-select');
     };

     viewport.addEventListener('pointerdown', (event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;

          isDragging = true;
          startX = event.clientX;
          startScrollLeft = viewport.scrollLeft;
          viewport.classList.add('is-dragging');
          viewport.style.userSelect = 'none';
          viewport.setPointerCapture(event.pointerId);
     });

     viewport.addEventListener('pointermove', (event) => {
          if (!isDragging) return;

          const deltaX = event.clientX - startX;
          viewport.scrollLeft = startScrollLeft - deltaX;
     });

     viewport.addEventListener('pointerup', stopDragging);
     viewport.addEventListener('pointercancel', stopDragging);
     viewport.addEventListener('lostpointercapture', stopDragging);
})();

// Source: .\js\contact-cta.js
(() => {
     const FIELD_CONFIG = [
          {
               id: 'contact-full-name',
               name: 'fullName',
               label: 'Full Name',
               type: 'text',
               placeholder: 'Full Name',
               autocomplete: 'name',
               required: true,
          },
          {
               id: 'contact-company-name',
               name: 'companyName',
               label: 'Company Name',
               type: 'text',
               placeholder: 'Company Name',
               autocomplete: 'organization',
               required: true,
          },
          {
               id: 'contact-email',
               name: 'email',
               label: 'Email Address',
               type: 'email',
               placeholder: 'Email Address',
               autocomplete: 'email',
               required: true,
          },
          {
               id: 'contact-phone',
               name: 'phone',
               label: 'Phone Number',
               type: 'tel',
               placeholder: '7003206616',
               autocomplete: 'tel-national',
               required: true,
               isPhone: true,
          },
     ];

     const COUNTRY_OPTIONS = [
          { code: '+91', label: '+91' },
          { code: '+1', label: '+1' },
          { code: '+44', label: '+44' },
          { code: '+971', label: '+971' },
     ];

     const root = document.querySelector('[data-contact-cta]');
     if (!root) return;

     const form = root.querySelector('[data-contact-form]');
     const fieldsRoot = root.querySelector('[data-contact-fields]');
     const submitButton = root.querySelector('[data-contact-submit]');
     const formMessage = root.querySelector('[data-contact-form-message]');

     if (!form || !fieldsRoot || !submitButton || !formMessage) return;

     const buildField = (field) => {
          const errorId = `${field.id}-error`;

          if (field.isPhone) {
               return `
                    <div class="contact-cta__field" data-field-wrap="${field.id}">
                         <label class="visually-hidden" for="contact-country-code">Country Code</label>
                         <label class="visually-hidden" for="${field.id}">${field.label}</label>
                         <div class="contact-cta__field-phone-row">
                              <select id="contact-country-code" name="countryCode" aria-label="Country code" required>
                                   ${COUNTRY_OPTIONS.map((option) => `<option value="${option.code}">${option.label}</option>`).join('')}
                              </select>
                              <input id="${field.id}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder}"
                                   autocomplete="${field.autocomplete}" inputmode="numeric" required aria-describedby="${errorId}" />
                         </div>
                         <p class="contact-cta__field-error" id="${errorId}" data-field-error="${field.id}" aria-live="polite"></p>
                    </div>
               `;
          }

          return `
               <div class="contact-cta__field" data-field-wrap="${field.id}">
                    <label class="visually-hidden" for="${field.id}">${field.label}</label>
                    <input id="${field.id}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder}"
                         autocomplete="${field.autocomplete}" ${field.required ? 'required' : ''} aria-describedby="${errorId}" />
                    <p class="contact-cta__field-error" id="${errorId}" data-field-error="${field.id}" aria-live="polite"></p>
               </div>
          `;
     };

     fieldsRoot.innerHTML = FIELD_CONFIG.map((field) => buildField(field)).join('');

     const getFieldElements = (fieldId) => {
          return {
               wrapper: fieldsRoot.querySelector(`[data-field-wrap="${fieldId}"]`),
               input: fieldsRoot.querySelector(`#${fieldId}`),
               error: fieldsRoot.querySelector(`[data-field-error="${fieldId}"]`),
          };
     };

     const setFormMessage = (text, state) => {
          formMessage.textContent = text;
          formMessage.classList.toggle('is-error', state === 'error');
          formMessage.classList.toggle('is-success', state === 'success');
     };

     const setFieldError = (fieldId, message) => {
          const { wrapper, input, error } = getFieldElements(fieldId);
          if (!wrapper || !input || !error) return;

          const hasError = Boolean(message);
          wrapper.classList.toggle('is-error', hasError);
          input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
          error.textContent = message || '';
     };

     const validateField = (field) => {
          const { input } = getFieldElements(field.id);
          if (!input) return true;

          const value = input.value.trim();

          if (field.required && !value) {
               setFieldError(field.id, `${field.label} is required.`);
               return false;
          }

          if (field.name === 'fullName' && value.length < 2) {
               setFieldError(field.id, 'Please enter your full name.');
               return false;
          }

          if (field.name === 'companyName' && value.length < 2) {
               setFieldError(field.id, 'Please enter your company name.');
               return false;
          }

          if (field.name === 'email') {
               const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               if (!emailPattern.test(value)) {
                    setFieldError(field.id, 'Please enter a valid email address.');
                    return false;
               }
          }

          if (field.name === 'phone') {
               const digits = value.replace(/\D/g, '');
               if (digits.length < 7 || digits.length > 15) {
                    setFieldError(field.id, 'Please enter a valid phone number.');
                    return false;
               }
          }

          setFieldError(field.id, '');
          return true;
     };

     const setSubmittingState = (isSubmitting) => {
          const controls = form.querySelectorAll('input, select, button');
          controls.forEach((control) => {
               control.disabled = isSubmitting;
          });
     };

     FIELD_CONFIG.forEach((field) => {
          const { input } = getFieldElements(field.id);
          if (!input) return;

          input.addEventListener('blur', () => {
               validateField(field);
          });

          input.addEventListener('input', () => {
               if (input.getAttribute('aria-invalid') === 'true') {
                    validateField(field);
               }
          });
     });

     form.addEventListener('submit', (event) => {
          event.preventDefault();

          setFormMessage('', 'idle');

          const results = FIELD_CONFIG.map((field) => ({
               field,
               isValid: validateField(field),
          }));

          const firstInvalid = results.find((result) => !result.isValid);
          if (firstInvalid) {
               const { input } = getFieldElements(firstInvalid.field.id);
               setFormMessage('Please correct the highlighted fields and try again.', 'error');
               input?.focus();
               return;
          }

          setSubmittingState(true);

          window.setTimeout(() => {
               setSubmittingState(false);
               setFormMessage('Quote request ready. Our team will contact you shortly.', 'success');
               form.reset();
               FIELD_CONFIG.forEach((field) => setFieldError(field.id, ''));
          }, 450);
     });
})();

// Source: .\js\footer.js
(() => {
     const CATEGORIES = [
          'Packaging Industry Solutions',
          'Fishnet Manufacturing',
          'PPMF/Tapes and Twines',
          'FIBC and Woven Sack',
          'Carpet and Rugs Industry',
          'Technical Textiles',
     ];

     const PRODUCTS = [
          'Two For One Twister',
          'TPRS Twister Machine',
          'Ring Twisting Machines',
          'Covering Machines',
          'Heat Setting Equipment',
          'Servo Controlled Winders',
     ];

     const CONTACT_ITEMS = [
          {
               icon: 'location',
               text: ['2126, Road No. 2, GIDC Sachin, Surat - 394 230', 'Gujarat, India'],
          },
          {
               icon: 'phone',
               text: ['+91-XXX-XXX-XXXX'],
          },
          {
               icon: 'mail',
               text: ['info@meeramind.com'],
          },
          {
               icon: 'support',
               text: ['support@meeramind.com'],
          },
     ];

     const SOCIALS = [
          {
               label: 'LinkedIn',
               href: '#',
               icon: 'linkedin',
          },
          {
               label: 'X',
               href: '#',
               icon: 'x',
          },
          {
               label: 'Instagram',
               href: '#',
               icon: 'instagram',
          },
     ];

     const POLICIES = ['Privacy Policy', 'Terms of Service', 'Sitemap'];

     const root = document.querySelector('[data-site-footer]');
     if (!root) return;

     root.addEventListener('click', (event) => {
          const link = event.target.closest('a');
          if (!link || !root.contains(link)) return;
          event.preventDefault();
     });

     const categoriesRoot = root.querySelector('[data-footer-categories]');
     const productsRoot = root.querySelector('[data-footer-products]');
     const contactRoot = root.querySelector('[data-footer-contact]');
     const socialsRoot = root.querySelector('[data-footer-socials]');
     const policiesRoot = root.querySelector('[data-footer-policies]');

     const icons = {
          location: `<img src="./assets/images/logo/logo-map.png" alt="" loading="lazy" decoding="async" />`,
          phone: `<img src="./assets/images/logo/logo-mobile.png" alt="" loading="lazy" decoding="async" />`,
          mail: `<img src="./assets/images/logo/logo-mail.png" alt="" loading="lazy" decoding="async" />`,
          support: `<img src="./assets/images/logo/logo-support.png" alt="" loading="lazy" decoding="async" />`,
          linkedin: `<img src="./assets/images/logo/logo-linkedin.png" alt="" loading="lazy" decoding="async" />`,
          x: `<img src="./assets/images/logo/logo-X.png" alt="" loading="lazy" decoding="async" />`,
          instagram: `<img src="./assets/images/logo/logo-instagram.png" alt="" loading="lazy" decoding="async" />`,
     };

     const createLink = (text, href = '#') => `<li><a href="${href}">${text}</a></li>`;

     if (categoriesRoot) {
          categoriesRoot.innerHTML = CATEGORIES.map((item) => createLink(item)).join('');
     }

     if (productsRoot) {
          productsRoot.innerHTML = PRODUCTS.map((item) => createLink(item)).join('');
     }

     if (contactRoot) {
          contactRoot.innerHTML = CONTACT_ITEMS.map((item) => {
               const lines = item.text
                    .map((line, index) => {
                         const isEmail = line.includes('@');
                         const isPhone = line.startsWith('+');
                         const href = isEmail ? `mailto:${line}` : isPhone ? `tel:${line.replace(/[^\d+]/g, '')}` : '#';
                         return index === 0
                              ? `<a href="${href}">${line}</a>`
                              : `<span>${line}</span>`;
                    })
                    .join('');

               return `
                    <li class="site-footer__contact-item site-footer__contact-item--${item.icon}">
                         <span class="site-footer__contact-icon" aria-hidden="true">${icons[item.icon]}</span>
                         <span class="site-footer__contact-text">${lines}</span>
                    </li>
               `;
          }).join('');
     }

     if (socialsRoot) {
          socialsRoot.innerHTML = SOCIALS.map((item) => `
               <li>
                    <a class="site-footer__social-link" href="#" aria-label="${item.label}">
                         <span class="site-footer__social-icon" aria-hidden="true">${icons[item.icon]}</span>
                    </a>
               </li>
          `).join('');
     }

     if (policiesRoot) {
          policiesRoot.innerHTML = POLICIES.map((item) => createLink(item)).join('');
     }
})();

// Source: .\js\modal.js
(() => {
     const modalOverlay = document.querySelector('#datasheet-modal-overlay');
     const modal = document.querySelector('#datasheet-modal');
     const modalTitle = document.querySelector('#datasheet-modal-title');
     const closeButton = document.querySelector('.modal__close');
     const form = document.querySelector('#datasheet-form');
     const fieldGroups = Array.from(document.querySelectorAll('[data-modal-field]'));
     const fullNameInput = document.querySelector('#modal-full-name');
     const companyNameInput = document.querySelector('#modal-company-name');
     const callbackEmailInput = document.querySelector('#modal-callback-email');
     const countryCodeInput = document.querySelector('#modal-country-code');
     const phoneInput = document.querySelector('#modal-phone');
     const emailInput = document.querySelector('#modal-email');
     const contactInput = document.querySelector('#modal-contact');
     const submitButton = document.querySelector('.modal__submit');
     const FIELD_ERROR_SELECTOR = '.modal__field-error';
     const MODAL_MODES = {
          brochure: {
               title: 'Let us email the entire catalogue to you',
               submitLabel: 'Download Brochure',
               visibleFields: ['brochureEmail', 'brochureContact'],
               focusTarget: () => emailInput,
          },
          callback: {
               title: 'Request a call back',
               submitLabel: 'Submit Form',
               visibleFields: ['fullName', 'companyName', 'callbackEmail', 'phone'],
               focusTarget: () => fullNameInput,
          },
     };
     let lockedScrollY = 0;
     let isClosing = false;
     let closeTimer = 0;
     let lastFocusedElement = null;
     let previousBodyPaddingRight = '';
     let currentMode = 'brochure';

     if (!modalOverlay || !modal || !modalTitle || !closeButton || !form || !submitButton || fieldGroups.length === 0) return;

     form.setAttribute('novalidate', 'novalidate');

     const syncSubmitState = () => {
          if (currentMode === 'callback') {
               submitButton.disabled = false;
               return;
          }

          submitButton.disabled = emailInput.value.trim() === '';
     };

     const getFieldGroup = (name) => {
          return document.querySelector(`[data-modal-field="${name}"]`);
     };

     const getOrCreateFieldError = (fieldName) => {
          const group = getFieldGroup(fieldName);

          if (!group) {
               return null;
          }

          let errorElement = group.querySelector(FIELD_ERROR_SELECTOR);
          if (!errorElement) {
               errorElement = document.createElement('p');
               errorElement.className = 'modal__field-error';
               errorElement.setAttribute('aria-live', 'polite');
               errorElement.hidden = true;
               group.appendChild(errorElement);
          }

          return errorElement;
     };

     const setFieldError = (fieldName, message, controls = []) => {
          const errorElement = getOrCreateFieldError(fieldName);

          if (errorElement) {
               errorElement.textContent = message;
               errorElement.hidden = false;
          }

          controls.forEach((control) => {
               if (!control) return;
               control.classList.add('is-error');
               control.setAttribute('aria-invalid', 'true');
          });
     };

     const clearFieldError = (fieldName, controls = []) => {
          const group = getFieldGroup(fieldName);
          const errorElement = group?.querySelector(FIELD_ERROR_SELECTOR);

          if (errorElement) {
               errorElement.textContent = '';
               errorElement.hidden = true;
          }

          controls.forEach((control) => {
               if (!control) return;
               control.classList.remove('is-error');
               control.removeAttribute('aria-invalid');
          });
     };

     const clearAllFieldErrors = () => {
          clearFieldError('brochureEmail', [emailInput]);
          clearFieldError('brochureContact', [contactInput]);
          clearFieldError('fullName', [fullNameInput]);
          clearFieldError('companyName', [companyNameInput]);
          clearFieldError('callbackEmail', [callbackEmailInput]);
          clearFieldError('phone', [countryCodeInput, phoneInput]);
     };

     const setModeFieldVisibility = (visibleFields) => {
          fieldGroups.forEach((group) => {
               const isVisible = visibleFields.includes(group.dataset.modalField);
               group.hidden = !isVisible;

               const controls = group.querySelectorAll('input, select, textarea, button');
               controls.forEach((control) => {
                    control.disabled = !isVisible;
               });

               if (!isVisible && group.dataset.modalField) {
                    clearFieldError(group.dataset.modalField, Array.from(controls));
               }
          });
     };

     const resetFormState = () => {
          form.reset();
          clearAllFieldErrors();
          if (countryCodeInput) {
               countryCodeInput.value = '+91';
          }
     };

     const setModalMode = (mode) => {
          const config = MODAL_MODES[mode] || MODAL_MODES.brochure;

          currentMode = mode in MODAL_MODES ? mode : 'brochure';
          modalTitle.textContent = config.title;
          submitButton.textContent = config.submitLabel;
          setModeFieldVisibility(config.visibleFields);
          resetFormState();
          syncSubmitState();
     };

     const validateEmail = (value) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
     };

     const validatePhone = (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 7 && digits.length <= 15;
     };

     const handleBrochureSubmit = () => {
          const email = emailInput?.value.trim() || '';
          const contact = contactInput?.value.trim() || '';

          clearAllFieldErrors();

          if (!email) {
               setFieldError('brochureEmail', 'Please enter your email address', [emailInput]);
               emailInput?.focus();
               return;
          }

          if (!validateEmail(email)) {
               setFieldError('brochureEmail', 'Please enter a valid email address', [emailInput]);
               emailInput?.focus();
               return;
          }

          console.log('Download request:', { email, contact });
          alert(`Thank you! The datasheet will be sent to ${email}`);
          closeModal();
     };

     const handleCallbackSubmit = () => {
          const fullName = fullNameInput?.value.trim() || '';
          const companyName = companyNameInput?.value.trim() || '';
          const callbackEmail = callbackEmailInput?.value.trim() || '';
          const phone = phoneInput?.value.trim() || '';
          const countryCode = countryCodeInput?.value || '+91';

          clearAllFieldErrors();

          if (!fullName) {
               setFieldError('fullName', 'Please enter your full name', [fullNameInput]);
               fullNameInput?.focus();
               return;
          }

          if (fullName.length < 2) {
               setFieldError('fullName', 'Please enter your full name', [fullNameInput]);
               fullNameInput?.focus();
               return;
          }

          if (!companyName) {
               setFieldError('companyName', 'Please enter your company name', [companyNameInput]);
               companyNameInput?.focus();
               return;
          }

          if (companyName.length < 2) {
               setFieldError('companyName', 'Please enter your company name', [companyNameInput]);
               companyNameInput?.focus();
               return;
          }

          if (!callbackEmail) {
               setFieldError('callbackEmail', 'Please enter your email address', [callbackEmailInput]);
               callbackEmailInput?.focus();
               return;
          }

          if (!validateEmail(callbackEmail)) {
               setFieldError('callbackEmail', 'Please enter a valid email address', [callbackEmailInput]);
               callbackEmailInput?.focus();
               return;
          }

          if (!phone) {
               setFieldError('phone', 'Please enter your phone number', [countryCodeInput, phoneInput]);
               phoneInput?.focus();
               return;
          }

          if (!validatePhone(phone)) {
               setFieldError('phone', 'Please enter a valid phone number', [countryCodeInput, phoneInput]);
               phoneInput?.focus();
               return;
          }

          console.log('Callback request:', {
               fullName,
               companyName,
               email: callbackEmail,
               phone: `${countryCode} ${phone}`,
          });

          alert('Your request has been submitted successfully. Our team will call you shortly.');
          closeModal();
     };

     const focusWithoutScroll = (element) => {
          if (!element || typeof element.focus !== 'function') return;

          try {
               element.focus({ preventScroll: true });
          } catch {
               element.focus();
          }
     };

     const setScrollLock = (isLocked) => {
          if (isLocked) {
               if (document.body.dataset.scrollLocked === 'true') {
                    return;
               }

               lockedScrollY = window.scrollY;
               previousBodyPaddingRight = document.body.style.paddingRight;
               const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
               document.body.classList.add('modal-open');
               document.body.dataset.scrollLocked = 'true';
               document.body.style.position = 'fixed';
               document.body.style.top = `-${lockedScrollY}px`;
               document.body.style.left = '0';
               document.body.style.right = '0';
               document.body.style.width = '100%';
               if (scrollbarGap > 0) {
                    document.body.style.paddingRight = `${scrollbarGap}px`;
               }
               return;
          }

          if (document.body.dataset.scrollLocked !== 'true') {
               return;
          }

          const scrollTopValue = Number.parseInt(document.body.style.top || '0', 10);
          const restoreY = Number.isFinite(scrollTopValue) ? Math.abs(scrollTopValue) : lockedScrollY;
          const previousScrollBehavior = document.documentElement.style.scrollBehavior;

          // Force immediate restoration to avoid the visible "from top" smooth scroll effect.
          document.documentElement.style.scrollBehavior = 'auto';

          document.body.classList.remove('modal-open');
          delete document.body.dataset.scrollLocked;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.width = '';
          document.body.style.paddingRight = previousBodyPaddingRight;
          window.scrollTo(0, restoreY);

          if (previousScrollBehavior) {
               document.documentElement.style.scrollBehavior = previousScrollBehavior;
          } else {
               document.documentElement.style.removeProperty('scroll-behavior');
          }
     };

     const openModalFromTrigger = (event, triggerElement = event.currentTarget) => {
          if (!triggerElement || (modal.open && !isClosing)) {
               event.preventDefault();
               return;
          }

          if (event instanceof MouseEvent && event.button !== 0) {
               event.preventDefault();
               return;
          }

          event.preventDefault();
          event.stopPropagation();

          window.clearTimeout(closeTimer);
          isClosing = false;
          lastFocusedElement = triggerElement;
          setModalMode(triggerElement.dataset.modalMode || 'brochure');
          modalOverlay.dataset.state = 'open';
          modalOverlay.removeAttribute('hidden');
          setScrollLock(true);
          if (!modal.open) {
               modal.showModal();
          }
          requestAnimationFrame(() => {
               const focusTarget = MODAL_MODES[currentMode].focusTarget();
               focusWithoutScroll(focusTarget);
          });
     };

     document.addEventListener('click', (event) => {
          const triggerElement = event.target.closest('[data-modal-mode]');

          if (!triggerElement) {
               return;
          }

          const mode = triggerElement.dataset.modalMode;
          if (mode !== 'brochure' && mode !== 'callback') {
               return;
          }

          openModalFromTrigger(event, triggerElement);
     });

     setModalMode('brochure');
     syncSubmitState();
     emailInput?.addEventListener('input', syncSubmitState);
     emailInput?.addEventListener('input', () => clearFieldError('brochureEmail', [emailInput]));
     contactInput?.addEventListener('input', () => clearFieldError('brochureContact', [contactInput]));
     fullNameInput?.addEventListener('input', () => clearFieldError('fullName', [fullNameInput]));
     companyNameInput?.addEventListener('input', () => clearFieldError('companyName', [companyNameInput]));
     callbackEmailInput?.addEventListener('input', () => clearFieldError('callbackEmail', [callbackEmailInput]));
     phoneInput?.addEventListener('input', () => clearFieldError('phone', [countryCodeInput, phoneInput]));
     countryCodeInput?.addEventListener('change', () => clearFieldError('phone', [countryCodeInput, phoneInput]));

     const finishClose = () => {
          if (modal.open) {
               modal.close();
          }

          modalOverlay.setAttribute('hidden', '');
          modalOverlay.dataset.state = 'closed';
          isClosing = false;
          setScrollLock(false);
          focusWithoutScroll(lastFocusedElement);
          resetFormState();
          setModeFieldVisibility(MODAL_MODES[currentMode].visibleFields);
          syncSubmitState();
     };

     const closeModal = () => {
          if (isClosing || (!modal.open && modalOverlay.hasAttribute('hidden'))) {
               return;
          }

          isClosing = true;
          modalOverlay.dataset.state = 'closing';
          closeTimer = window.setTimeout(finishClose, 220);
     };

     closeButton.addEventListener('click', closeModal);

     modalOverlay.addEventListener('click', (event) => {
          if (event.target === modalOverlay) {
               closeModal();
          }
     });

     modal.addEventListener('cancel', (event) => {
          event.preventDefault();
          closeModal();
     });

     form.addEventListener('submit', (event) => {
          event.preventDefault();

          try {
               if (currentMode === 'callback') {
                    handleCallbackSubmit();
                    return;
               }

               handleBrochureSubmit();
          } catch (error) {
               console.error('Error submitting form:', error);
               alert('There was an error processing your request. Please try again.');
          }
     });
})();

