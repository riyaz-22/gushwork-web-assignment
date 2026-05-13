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

     const getInitials = (name) => {
          const parts = name.trim().split(/\s+/).slice(0, 2);
          return parts.map((part) => part.charAt(0).toUpperCase()).join('');
     };

     track.innerHTML = TESTIMONIALS.map((item) => {
          return `
               <article class="testimonial-card">
                    <p class="testimonial-card__quote" aria-hidden="true">&ldquo;</p>
                    <h3 class="testimonial-card__title">${item.title}</h3>
                    <p class="testimonial-card__description">${item.description}</p>
                    <footer class="testimonial-card__profile">
                         <div class="testimonial-card__avatar" aria-hidden="true">${getInitials(item.name)}</div>
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
