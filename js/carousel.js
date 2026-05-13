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

          // Generate empty thumbnail placeholders for all slides
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
