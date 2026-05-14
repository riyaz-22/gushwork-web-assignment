(() => {
     const modalOverlay = document.querySelector('#datasheet-modal-overlay');
     const modal = document.querySelector('#datasheet-modal');
     const modalTitle = document.querySelector('#datasheet-modal-title');
     const closeButton = document.querySelector('.modal__close');
     const form = document.querySelector('#datasheet-form');
     const fieldGroups = Array.from(document.querySelectorAll('[data-modal-field]'));
     const fullNameInput = document.querySelector('#modal-full-name');
     const companyNameInput = document.querySelector('#modal-company-name');
     const callbackEmailInput = document.querySelector('#modal-callback-email');
     const countryCodeInput = document.querySelector('#modal-country-code');
     const phoneInput = document.querySelector('#modal-phone');
     const emailInput = document.querySelector('#modal-email');
     const contactInput = document.querySelector('#modal-contact');
     const submitButton = document.querySelector('.modal__submit');
     const FIELD_ERROR_SELECTOR = '.modal__field-error';
     const MODAL_MODES = {
          brochure: {
               title: 'Let us email the entire catalogue to you',
               submitLabel: 'Download Brochure',
               visibleFields: ['brochureEmail', 'brochureContact'],
               focusTarget: () => emailInput,
          },
          callback: {
               title: 'Request a call back',
               submitLabel: 'Submit Form',
               visibleFields: ['fullName', 'companyName', 'callbackEmail', 'phone'],
               focusTarget: () => fullNameInput,
          },
     };
     let lockedScrollY = 0;
     let isClosing = false;
     let closeTimer = 0;
     let lastFocusedElement = null;
     let previousBodyPaddingRight = '';
     let currentMode = 'brochure';

     if (!modalOverlay || !modal || !modalTitle || !closeButton || !form || !submitButton || fieldGroups.length === 0) return;

     form.setAttribute('novalidate', 'novalidate');

     const syncSubmitState = () => {
          if (currentMode === 'callback') {
               submitButton.disabled = false;
               return;
          }

          submitButton.disabled = emailInput.value.trim() === '';
     };

     const getFieldGroup = (name) => {
          return document.querySelector(`[data-modal-field="${name}"]`);
     };

     const getOrCreateFieldError = (fieldName) => {
          const group = getFieldGroup(fieldName);

          if (!group) {
               return null;
          }

          let errorElement = group.querySelector(FIELD_ERROR_SELECTOR);
          if (!errorElement) {
               errorElement = document.createElement('p');
               errorElement.className = 'modal__field-error';
               errorElement.setAttribute('aria-live', 'polite');
               errorElement.hidden = true;
               group.appendChild(errorElement);
          }

          return errorElement;
     };

     const setFieldError = (fieldName, message, controls = []) => {
          const errorElement = getOrCreateFieldError(fieldName);

          if (errorElement) {
               errorElement.textContent = message;
               errorElement.hidden = false;
          }

          controls.forEach((control) => {
               if (!control) return;
               control.classList.add('is-error');
               control.setAttribute('aria-invalid', 'true');
          });
     };

     const clearFieldError = (fieldName, controls = []) => {
          const group = getFieldGroup(fieldName);
          const errorElement = group?.querySelector(FIELD_ERROR_SELECTOR);

          if (errorElement) {
               errorElement.textContent = '';
               errorElement.hidden = true;
          }

          controls.forEach((control) => {
               if (!control) return;
               control.classList.remove('is-error');
               control.removeAttribute('aria-invalid');
          });
     };

     const clearAllFieldErrors = () => {
          clearFieldError('brochureEmail', [emailInput]);
          clearFieldError('brochureContact', [contactInput]);
          clearFieldError('fullName', [fullNameInput]);
          clearFieldError('companyName', [companyNameInput]);
          clearFieldError('callbackEmail', [callbackEmailInput]);
          clearFieldError('phone', [countryCodeInput, phoneInput]);
     };

     const setModeFieldVisibility = (visibleFields) => {
          fieldGroups.forEach((group) => {
               const isVisible = visibleFields.includes(group.dataset.modalField);
               group.hidden = !isVisible;

               const controls = group.querySelectorAll('input, select, textarea, button');
               controls.forEach((control) => {
                    control.disabled = !isVisible;
               });

               if (!isVisible && group.dataset.modalField) {
                    clearFieldError(group.dataset.modalField, Array.from(controls));
               }
          });
     };

     const resetFormState = () => {
          form.reset();
          clearAllFieldErrors();
          if (countryCodeInput) {
               countryCodeInput.value = '+91';
          }
     };

     const setModalMode = (mode) => {
          const config = MODAL_MODES[mode] || MODAL_MODES.brochure;

          currentMode = mode in MODAL_MODES ? mode : 'brochure';
          modalTitle.textContent = config.title;
          submitButton.textContent = config.submitLabel;
          setModeFieldVisibility(config.visibleFields);
          resetFormState();
          syncSubmitState();
     };

     const validateEmail = (value) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
     };

     const validatePhone = (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 7 && digits.length <= 15;
     };

     const handleBrochureSubmit = () => {
          const email = emailInput?.value.trim() || '';
          const contact = contactInput?.value.trim() || '';

          clearAllFieldErrors();

          if (!email) {
               setFieldError('brochureEmail', 'Please enter your email address', [emailInput]);
               emailInput?.focus();
               return;
          }

          if (!validateEmail(email)) {
               setFieldError('brochureEmail', 'Please enter a valid email address', [emailInput]);
               emailInput?.focus();
               return;
          }

          console.log('Download request:', { email, contact });
          alert(`Thank you! The datasheet will be sent to ${email}`);
          closeModal();
     };

     const handleCallbackSubmit = () => {
          const fullName = fullNameInput?.value.trim() || '';
          const companyName = companyNameInput?.value.trim() || '';
          const callbackEmail = callbackEmailInput?.value.trim() || '';
          const phone = phoneInput?.value.trim() || '';
          const countryCode = countryCodeInput?.value || '+91';

          clearAllFieldErrors();

          if (!fullName) {
               setFieldError('fullName', 'Please enter your full name', [fullNameInput]);
               fullNameInput?.focus();
               return;
          }

          if (fullName.length < 2) {
               setFieldError('fullName', 'Please enter your full name', [fullNameInput]);
               fullNameInput?.focus();
               return;
          }

          if (!companyName) {
               setFieldError('companyName', 'Please enter your company name', [companyNameInput]);
               companyNameInput?.focus();
               return;
          }

          if (companyName.length < 2) {
               setFieldError('companyName', 'Please enter your company name', [companyNameInput]);
               companyNameInput?.focus();
               return;
          }

          if (!callbackEmail) {
               setFieldError('callbackEmail', 'Please enter your email address', [callbackEmailInput]);
               callbackEmailInput?.focus();
               return;
          }

          if (!validateEmail(callbackEmail)) {
               setFieldError('callbackEmail', 'Please enter a valid email address', [callbackEmailInput]);
               callbackEmailInput?.focus();
               return;
          }

          if (!phone) {
               setFieldError('phone', 'Please enter your phone number', [countryCodeInput, phoneInput]);
               phoneInput?.focus();
               return;
          }

          if (!validatePhone(phone)) {
               setFieldError('phone', 'Please enter a valid phone number', [countryCodeInput, phoneInput]);
               phoneInput?.focus();
               return;
          }

          console.log('Callback request:', {
               fullName,
               companyName,
               email: callbackEmail,
               phone: `${countryCode} ${phone}`,
          });

          alert('Your request has been submitted successfully. Our team will call you shortly.');
          closeModal();
     };

     const focusWithoutScroll = (element) => {
          if (!element || typeof element.focus !== 'function') return;

          try {
               element.focus({ preventScroll: true });
          } catch {
               element.focus();
          }
     };

     const setScrollLock = (isLocked) => {
          if (isLocked) {
               if (document.body.dataset.scrollLocked === 'true') {
                    return;
               }

               lockedScrollY = window.scrollY;
               previousBodyPaddingRight = document.body.style.paddingRight;
               const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
               document.body.classList.add('modal-open');
               document.body.dataset.scrollLocked = 'true';
               document.body.style.position = 'fixed';
               document.body.style.top = `-${lockedScrollY}px`;
               document.body.style.left = '0';
               document.body.style.right = '0';
               document.body.style.width = '100%';
               if (scrollbarGap > 0) {
                    document.body.style.paddingRight = `${scrollbarGap}px`;
               }
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
          document.body.style.paddingRight = previousBodyPaddingRight;
          window.scrollTo(0, restoreY);

          if (previousScrollBehavior) {
               document.documentElement.style.scrollBehavior = previousScrollBehavior;
          } else {
               document.documentElement.style.removeProperty('scroll-behavior');
          }
     };

     const openModalFromTrigger = (event, triggerElement = event.currentTarget) => {
          if (!triggerElement || (modal.open && !isClosing)) {
               event.preventDefault();
               return;
          }

          if (event instanceof MouseEvent && event.button !== 0) {
               event.preventDefault();
               return;
          }

          event.preventDefault();
          event.stopPropagation();

          window.clearTimeout(closeTimer);
          isClosing = false;
          lastFocusedElement = triggerElement;
          setModalMode(triggerElement.dataset.modalMode || 'brochure');
          modalOverlay.dataset.state = 'open';
          modalOverlay.removeAttribute('hidden');
          setScrollLock(true);
          if (!modal.open) {
               modal.showModal();
          }
          requestAnimationFrame(() => {
               const focusTarget = MODAL_MODES[currentMode].focusTarget();
               focusWithoutScroll(focusTarget);
          });
     };

     document.addEventListener('click', (event) => {
          const triggerElement = event.target.closest('[data-modal-mode]');

          if (!triggerElement) {
               return;
          }

          const mode = triggerElement.dataset.modalMode;
          if (mode !== 'brochure' && mode !== 'callback') {
               return;
          }

          openModalFromTrigger(event, triggerElement);
     });

     setModalMode('brochure');
     syncSubmitState();
     emailInput?.addEventListener('input', syncSubmitState);
     emailInput?.addEventListener('input', () => clearFieldError('brochureEmail', [emailInput]));
     contactInput?.addEventListener('input', () => clearFieldError('brochureContact', [contactInput]));
     fullNameInput?.addEventListener('input', () => clearFieldError('fullName', [fullNameInput]));
     companyNameInput?.addEventListener('input', () => clearFieldError('companyName', [companyNameInput]));
     callbackEmailInput?.addEventListener('input', () => clearFieldError('callbackEmail', [callbackEmailInput]));
     phoneInput?.addEventListener('input', () => clearFieldError('phone', [countryCodeInput, phoneInput]));
     countryCodeInput?.addEventListener('change', () => clearFieldError('phone', [countryCodeInput, phoneInput]));

     const finishClose = () => {
          if (modal.open) {
               modal.close();
          }

          modalOverlay.setAttribute('hidden', '');
          modalOverlay.dataset.state = 'closed';
          isClosing = false;
          setScrollLock(false);
          focusWithoutScroll(lastFocusedElement);
          resetFormState();
          setModeFieldVisibility(MODAL_MODES[currentMode].visibleFields);
          syncSubmitState();
     };

     const closeModal = () => {
          if (isClosing || (!modal.open && modalOverlay.hasAttribute('hidden'))) {
               return;
          }

          isClosing = true;
          modalOverlay.dataset.state = 'closing';
          closeTimer = window.setTimeout(finishClose, 220);
     };

     closeButton.addEventListener('click', closeModal);

     modalOverlay.addEventListener('click', (event) => {
          if (event.target === modalOverlay) {
               closeModal();
          }
     });

     modal.addEventListener('cancel', (event) => {
          event.preventDefault();
          closeModal();
     });

     form.addEventListener('submit', (event) => {
          event.preventDefault();

          try {
               if (currentMode === 'callback') {
                    handleCallbackSubmit();
                    return;
               }

               handleBrochureSubmit();
          } catch (error) {
               console.error('Error submitting form:', error);
               alert('There was an error processing your request. Please try again.');
          }
     });
})();
