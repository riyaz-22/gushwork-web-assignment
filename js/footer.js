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
