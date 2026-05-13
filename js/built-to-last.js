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
          bag: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M7 8h10l1 12H6L7 8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                    <path d="M9 8V6.8A3.8 3.8 0 0 1 12.8 3h.4A3.8 3.8 0 0 1 17 6.8V8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
               </svg>
          `,
          feather: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M19 5c-4 0-7 1.7-10 5.2C7 12 5.8 14.4 5 19c4.6-.8 7-2 8.8-4 3.5-3 5.2-6 5.2-10Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                    <path d="M12.5 11.5 5 19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
               </svg>
          `,
          cube: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                    <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                    <path d="M12 12v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
               </svg>
          `,
          gear: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" fill="none" stroke="currentColor" stroke-width="1.8" />
                    <path d="M19 12a7 7 0 0 0-.1-1.1l2-1.5-1.8-3.1-2.4.8a7.4 7.4 0 0 0-1.9-1.1L14.3 3h-4.6l-.5 2.1c-.7.3-1.3.6-1.9 1.1l-2.4-.8L3.1 8.4l2 1.5A7 7 0 0 0 5 12c0 .4 0 .7.1 1.1l-2 1.5L4.9 17.7l2.4-.8c.6.5 1.2.8 1.9 1.1l.5 2h4.6l.5-2c.7-.3 1.3-.6 1.9-1.1l2.4.8 1.8-3.1-2-1.5c.1-.4.1-.7.1-1.1Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
               </svg>
          `,
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
