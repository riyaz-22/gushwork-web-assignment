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
