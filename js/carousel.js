(() => {
     const carousel = document.querySelector('[data-carousel]');

     if (!carousel) {
          return;
     }

     const track = carousel.querySelector('[data-carousel-track]');
     const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
     const thumbs = Array.from(carousel.querySelectorAll('[data-carousel-thumb]'));
     const prevButton = carousel.querySelector('[data-carousel-prev]');
     const nextButton = carousel.querySelector('[data-carousel-next]');
     const viewport = carousel.querySelector('[data-carousel-viewport]');
     const zoomSurface = carousel.querySelector('[data-carousel-zoom-surface]');
     const status = carousel.querySelector('[data-carousel-status]');

     if (!track || slides.length === 0 || !viewport || !zoomSurface) {
          return;
     }

     let activeIndex = 0;

     const render = () => {
          // Keep the active slide, thumbnail state, and live region in sync.
          track.style.transform = `translateX(-${activeIndex * 100}%)`;

          slides.forEach((slide, index) => {
               slide.classList.toggle('is-active', index === activeIndex);
          });

          thumbs.forEach((thumb, index) => {
               thumb.classList.toggle('is-active', index === activeIndex);
               thumb.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
               thumb.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
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
          thumb.addEventListener('click', () => {
               setActiveIndex(index);
          });

          thumb.addEventListener('keydown', (event) => {
               if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    setActiveIndex(index + 1);
                    thumbs[(index + 1) % thumbs.length]?.focus();
               }

               if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    setActiveIndex(index - 1);
                    thumbs[(index - 1 + thumbs.length) % thumbs.length]?.focus();
               }

               if (event.key === 'Home') {
                    event.preventDefault();
                    setActiveIndex(0);
                    thumbs[0]?.focus();
               }

               if (event.key === 'End') {
                    event.preventDefault();
                    setActiveIndex(thumbs.length - 1);
                    thumbs[thumbs.length - 1]?.focus();
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
