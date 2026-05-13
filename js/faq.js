(() => {
     const FAQ_ITEMS = [
          {
               question: 'What is the purpose of a laser cutter for sheet metal?',
               answer:
                    'It is designed to cut various types of sheet metal with precision, allowing for intricate designs and shapes that are essential in manufacturing processes.',
               expanded: true,
          },
          {
               question: 'What are the benefits of using aluminum tubing in manufacturing?',
               answer:
                    'Aluminum tubing offers a lightweight, corrosion-resistant, and adaptable solution for a wide range of industrial applications.',
          },
          {
               question: 'How is aluminum tubing produced?',
               answer:
                    'Aluminum tubing is typically produced through extrusion, drawing, and finishing processes tailored to the required diameter and profile.',
          },
          {
               question: 'What are the common applications of aluminum tubing?',
               answer:
                    'It is used in structural frameworks, transport systems, HVAC assemblies, machinery, and many precision fabrication projects.',
          },
          {
               question: 'Can aluminum tubing be customized?',
               answer:
                    'Yes. It can be customized by dimension, thickness, finish, and fabrication requirements to suit project-specific needs.',
          },
     ];

     const accordionRoot = document.querySelector('[data-faq-accordion]');
     const form = document.querySelector('[data-faq-catalogue-form]');
     const emailInput = document.querySelector('[data-faq-catalogue-email]');
     const message = document.querySelector('[data-faq-catalogue-message]');

     if (!accordionRoot || !form || !emailInput || !message) {
          return;
     }

     const idBase = 'faq-item';

     const iconMarkup = `<img src="./assets/images/icons/icon-chevron-up.png" alt="" loading="lazy" decoding="async" />`;

     accordionRoot.innerHTML = FAQ_ITEMS.map(({ question, answer, expanded }, index) => {
          const itemId = `${idBase}-${index + 1}`;
          const isFirstItem = index === 0;

          // First item: interactive button trigger; others: static div
          const triggerElement = isFirstItem
               ? `<button class="faq-item__trigger" type="button" aria-expanded="${expanded ? 'true' : 'false'}"
                    aria-controls="${itemId}-panel" id="${itemId}-trigger" data-faq-trigger>
                    <span>${question}</span>
                    <span class="faq-item__icon" aria-hidden="true">${iconMarkup}</span>
               </button>`
               : `<div class="faq-item__trigger" style="cursor: default;">
                    <span>${question}</span>
                    <span class="faq-item__icon" aria-hidden="true">${iconMarkup}</span>
               </div>`;

          return `
               <article class="faq-item${expanded ? ' is-open' : ''}" data-faq-item>
                    <h3 class="faq-item__title">
                         ${triggerElement}
                    </h3>
                    <div class="faq-item__panel" id="${itemId}-panel" role="region" aria-labelledby="${itemId}-trigger"
                         data-faq-panel ${expanded ? '' : 'hidden'}>
                         <div class="faq-item__panel-inner">
                              <p>${answer}</p>
                         </div>
                    </div>
               </article>
          `;
     }).join('');

     const items = Array.from(accordionRoot.querySelectorAll('[data-faq-item]'));

     const setPanelHeight = (item, isOpen) => {
          const panel = item.querySelector('[data-faq-panel]');
          if (!panel) return;

          panel.hidden = false;
          panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';
          item.classList.toggle('is-open', isOpen);

          if (!isOpen) {
               window.setTimeout(() => {
                    if (!item.classList.contains('is-open')) {
                         panel.hidden = true;
                    }
               }, 260);
          }
     };

     const closeItem = (item) => {
          const trigger = item.querySelector('[data-faq-trigger]');
          if (trigger) {
               trigger.setAttribute('aria-expanded', 'false');
          }
          setPanelHeight(item, false);
     };

     const openItem = (item) => {
          const trigger = item.querySelector('[data-faq-trigger]');
          if (trigger) {
               trigger.setAttribute('aria-expanded', 'true');
          }
          setPanelHeight(item, true);
     };

     items.forEach((item, itemIndex) => {
          const trigger = item.querySelector('[data-faq-trigger]');
          const panel = item.querySelector('[data-faq-panel]');
          if (!trigger || !panel) return;

          const isOpen = item.classList.contains('is-open');
          panel.hidden = !isOpen;
          panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';

          // Only first item is interactive; rest are dummy
          if (itemIndex === 0) {
               trigger.addEventListener('click', () => {
                    const currentlyOpen = item.classList.contains('is-open');

                    if (currentlyOpen) {
                         closeItem(item);
                         trigger.setAttribute('aria-expanded', 'false');
                    } else {
                         openItem(item);
                         trigger.setAttribute('aria-expanded', 'true');
                    }
               });
          }
     });

     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     const setMessage = (text, isError = false) => {
          message.textContent = text;
          message.classList.toggle('is-error', isError);
          message.classList.toggle('is-success', !isError && Boolean(text));
     };

     form.addEventListener('submit', (event) => {
          event.preventDefault();

          const value = emailInput.value.trim();

          if (!value) {
               setMessage('Please enter your email address.', true);
               emailInput.focus();
               return;
          }

          if (!emailPattern.test(value)) {
               setMessage('Please enter a valid email address.', true);
               emailInput.focus();
               return;
          }

          setMessage('Catalogue request ready. We will contact you shortly.');
          form.reset();
     });
})();
