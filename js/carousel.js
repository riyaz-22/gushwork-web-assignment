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
          activeIndex = (nextIndex + slides.length) % slides.length;
          render();
     };

     prevButton?.addEventListener('click', () => {
          setActiveIndex(activeIndex - 1);
     });

     nextButton?.addEventListener('click', () => {
          setActiveIndex(activeIndex + 1);
     });

     thumbs.forEach((thumb, index) => {
          const hasImage = () => !!thumb.querySelector('img');

          thumb.addEventListener('click', () => {
               if (!hasImage()) return;
               setActiveIndex(index);
          });

          thumb.addEventListener('keydown', (event) => {
               if (!hasImage()) return;

               if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    const next = thumbs.slice(index + 1).find(t => t.querySelector('img'));
                    if (next) { setActiveIndex(thumbs.indexOf(next)); next.focus(); }
               }

               if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    const prev = [...thumbs].slice(0, index).reverse().find(t => t.querySelector('img'));
                    if (prev) { setActiveIndex(thumbs.indexOf(prev)); prev.focus(); }
               }

               if (event.key === 'Home') {
                    event.preventDefault();
                    const first = thumbs.find(t => t.querySelector('img'));
                    if (first) { setActiveIndex(thumbs.indexOf(first)); first.focus(); }
               }

               if (event.key === 'End') {
                    event.preventDefault();
                    const last = [...thumbs].reverse().find(t => t.querySelector('img'));
                    if (last) { setActiveIndex(thumbs.indexOf(last)); last.focus(); }
               }
          });
     });

     viewport.addEventListener('keydown', (event) => {
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
          const bounds = viewport.getBoundingClientRect();
          const relativeX = ((event.clientX - bounds.left) / bounds.width) * 100;
          const relativeY = ((event.clientY - bounds.top) / bounds.height) * 100;

          carousel.classList.add('is-zooming');
          zoomSurface.style.backgroundPosition = `${relativeX}% ${relativeY}%`;
     });

     viewport.addEventListener('mouseenter', () => {
          carousel.classList.add('is-zooming');
          zoomSurface.style.backgroundPosition = '50% 50%';
     });

     viewport.addEventListener('mouseleave', () => {
          carousel.classList.remove('is-zooming');
          zoomSurface.style.backgroundPosition = '50% 50%';
     });

     render();
})();
