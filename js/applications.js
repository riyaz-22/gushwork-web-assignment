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

     const iconMarkup = `
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
               <path d="M12 5v14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
               <path d="M6.5 10.5 12 5l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
     `;

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
