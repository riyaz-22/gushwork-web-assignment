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
