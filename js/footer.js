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

     const categoriesRoot = root.querySelector('[data-footer-categories]');
     const productsRoot = root.querySelector('[data-footer-products]');
     const contactRoot = root.querySelector('[data-footer-contact]');
     const socialsRoot = root.querySelector('[data-footer-socials]');
     const policiesRoot = root.querySelector('[data-footer-policies]');

     const icons = {
          location: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 21s6-5.1 6-11.1a6 6 0 1 0-12 0C6 15.9 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                    <path d="M12 11a1.9 1.9 0 1 0 0.01 0Z" fill="currentColor"/>
               </svg>
          `,
          phone: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M5.5 4.5h2.2c.5 0 1 .3 1.2.8l1.4 3.4c.2.5.1 1-.2 1.4l-1.4 1.5a14.5 14.5 0 0 0 6 6l1.5-1.4c.4-.4.9-.5 1.4-.3l3.4 1.4c.5.2.8.7.8 1.2V19c0 .8-.7 1.5-1.5 1.5C9.7 20.5 3.5 14.3 3.5 6.5 3.5 5.7 4.2 5 5 5h.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
          `,
          mail: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M4.5 6.5h15c.8 0 1.5.7 1.5 1.5v8c0 .8-.7 1.5-1.5 1.5h-15C3.7 17.5 3 16.8 3 16V8c0-.8.7-1.5 1.5-1.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                    <path d="m4.5 8 7.5 5 7.5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
          `,
          support: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M4.5 11.5a7.5 7.5 0 0 1 15 0v3.2a2.3 2.3 0 0 1-2.3 2.3H16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5.5 11.5h-1A1.5 1.5 0 0 0 3 13v1.8a1.7 1.7 0 0 0 1.7 1.7H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 20h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
               </svg>
          `,
          linkedin: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M6.2 8.7V18H3.7V8.7h2.5Zm.2-2.9c0 .7-.6 1.3-1.5 1.3S3.5 6.5 3.5 5.8 4.1 4.5 5 4.5s1.4.6 1.4 1.3ZM20.5 18h-2.5v-4.7c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V18H12V8.7h2.4v1.3h.1c.3-.6 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.2V18Z" fill="currentColor"/>
               </svg>
          `,
          x: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M4 5h3.3l4 5.1L15.8 5H20l-6.6 7.5L20.5 19h-3.3l-4.4-5.7L7.8 19H4l7-8L4 5Z" fill="currentColor"/>
               </svg>
          `,
          instagram: `
               <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M7 4.5h10a2.5 2.5 0 0 1 2.5 2.5v10A2.5 2.5 0 0 1 17 19.5H7A2.5 2.5 0 0 1 4.5 17V7A2.5 2.5 0 0 1 7 4.5Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
                    <path d="M12 9.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
                    <path d="M17.2 6.8h0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
               </svg>
          `,
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
                    <a class="site-footer__social-link" href="${item.href}" aria-label="${item.label}">
                         <span class="site-footer__social-icon" aria-hidden="true">${icons[item.icon]}</span>
                    </a>
               </li>
          `).join('');
     }

     if (policiesRoot) {
          policiesRoot.innerHTML = POLICIES.map((item) => createLink(item)).join('');
     }
})();
