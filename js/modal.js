(() => {
     // Get modal elements
     const downloadButton = document.querySelector('.technical-specs__download');
     const quoteButtons = Array.from(document.querySelectorAll('button')).filter((button) => {
          const label = (button.textContent || '').trim().toLowerCase();
          return label === 'request a quote' || label === 'get custom quote';
     });
     const modalOverlay = document.querySelector('#datasheet-modal-overlay');
     const modal = document.querySelector('#datasheet-modal');
     const closeButton = document.querySelector('.modal__close');
     const form = document.querySelector('#datasheet-form');
     const emailInput = document.querySelector('#modal-email');
     const contactInput = document.querySelector('#modal-contact');
     let lockedScrollY = 0;

     if (!modalOverlay || !modal) return;

     const setScrollLock = (isLocked) => {
          if (isLocked) {
               if (document.body.dataset.scrollLocked === 'true') {
                    return;
               }

               lockedScrollY = window.scrollY;
               document.body.classList.add('modal-open');
               document.body.dataset.scrollLocked = 'true';
               document.body.style.position = 'fixed';
               document.body.style.top = `-${lockedScrollY}px`;
               document.body.style.left = '0';
               document.body.style.right = '0';
               document.body.style.width = '100%';
               return;
          }

          if (document.body.dataset.scrollLocked !== 'true') {
               return;
          }

          const scrollTopValue = Number.parseInt(document.body.style.top || '0', 10);
          const restoreY = Number.isFinite(scrollTopValue) ? Math.abs(scrollTopValue) : lockedScrollY;
          const previousScrollBehavior = document.documentElement.style.scrollBehavior;

          // Force immediate restoration to avoid the visible "from top" smooth scroll effect.
          document.documentElement.style.scrollBehavior = 'auto';

          document.body.classList.remove('modal-open');
          delete document.body.dataset.scrollLocked;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.width = '';
          window.scrollTo(0, restoreY);

          if (previousScrollBehavior) {
               document.documentElement.style.scrollBehavior = previousScrollBehavior;
          } else {
               document.documentElement.style.removeProperty('scroll-behavior');
          }
     };

     const openModalFromTrigger = (event) => {
          if (!event.isTrusted || event.defaultPrevented || modal.open) {
               event.preventDefault();
               return;
          }

          if (event instanceof MouseEvent && event.button !== 0) {
               event.preventDefault();
               return;
          }

          event.preventDefault();
          event.stopPropagation();

          modalOverlay.removeAttribute('hidden');
          modal.showModal();
          setScrollLock(true);
          emailInput.focus();
     };

     if (downloadButton) {
          downloadButton.addEventListener('click', openModalFromTrigger);
     }

     quoteButtons.forEach((button) => {
          button.addEventListener('click', openModalFromTrigger);
     });

     // Close modal function
     const closeModal = () => {
          if (modal.open) {
               modal.close();
          }

          modalOverlay.setAttribute('hidden', '');
          setScrollLock(false);
          form.reset();
     };

     // Close modal when close button is clicked
     closeButton.addEventListener('click', closeModal);

     // Close modal when clicking outside (on the overlay)
     modalOverlay.addEventListener('click', (event) => {
          // Only close if clicking on the overlay itself, not on the modal
          if (event.target === modalOverlay) {
               closeModal();
          }
     });

     // Close modal with Escape key
     modal.addEventListener('cancel', () => {
          closeModal();
     });

     // Handle form submission
     form.addEventListener('submit', async (event) => {
          event.preventDefault();

          const email = emailInput.value.trim();
          const contact = contactInput.value.trim();

          // Validate email
          if (!email) {
               alert('Please enter your email address');
               emailInput.focus();
               return;
          }

          // In a real application, you would send this data to a server
          // For now, we'll just show a success message and close the modal
          console.log('Download request:', { email, contact });

          // Simulate download or form submission
          // You can replace this with actual API call
          try {
               // Example: fetch('/api/download-datasheet', { method: 'POST', body: JSON.stringify({ email, contact }) })

               // Show success message
               alert(`Thank you! The datasheet will be sent to ${email}`);

               // Close modal and reset form
               closeModal();
          } catch (error) {
               console.error('Error submitting form:', error);
               alert('There was an error processing your request. Please try again.');
          }
     });
})();
