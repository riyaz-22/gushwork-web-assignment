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
