(() => {
     const FIELD_CONFIG = [
          {
               id: 'contact-full-name',
               name: 'fullName',
               label: 'Full Name',
               type: 'text',
               placeholder: 'Full Name',
               autocomplete: 'name',
               required: true,
          },
          {
               id: 'contact-company-name',
               name: 'companyName',
               label: 'Company Name',
               type: 'text',
               placeholder: 'Company Name',
               autocomplete: 'organization',
               required: true,
          },
          {
               id: 'contact-email',
               name: 'email',
               label: 'Email Address',
               type: 'email',
               placeholder: 'Email Address',
               autocomplete: 'email',
               required: true,
          },
          {
               id: 'contact-phone',
               name: 'phone',
               label: 'Phone Number',
               type: 'tel',
               placeholder: '7003206616',
               autocomplete: 'tel-national',
               required: true,
               isPhone: true,
          },
     ];

     const COUNTRY_OPTIONS = [
          { code: '+91', label: '+91' },
          { code: '+1', label: '+1' },
          { code: '+44', label: '+44' },
          { code: '+971', label: '+971' },
     ];

     const root = document.querySelector('[data-contact-cta]');
     if (!root) return;

     const form = root.querySelector('[data-contact-form]');
     const fieldsRoot = root.querySelector('[data-contact-fields]');
     const submitButton = root.querySelector('[data-contact-submit]');
     const formMessage = root.querySelector('[data-contact-form-message]');

     if (!form || !fieldsRoot || !submitButton || !formMessage) return;

     const buildField = (field) => {
          const errorId = `${field.id}-error`;

          if (field.isPhone) {
               return `
                    <div class="contact-cta__field" data-field-wrap="${field.id}">
                         <label class="visually-hidden" for="contact-country-code">Country Code</label>
                         <label class="visually-hidden" for="${field.id}">${field.label}</label>
                         <div class="contact-cta__field-phone-row">
                              <select id="contact-country-code" name="countryCode" aria-label="Country code" required>
                                   ${COUNTRY_OPTIONS.map((option) => `<option value="${option.code}">${option.label}</option>`).join('')}
                              </select>
                              <input id="${field.id}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder}"
                                   autocomplete="${field.autocomplete}" inputmode="numeric" required aria-describedby="${errorId}" />
                         </div>
                         <p class="contact-cta__field-error" id="${errorId}" data-field-error="${field.id}" aria-live="polite"></p>
                    </div>
               `;
          }

          return `
               <div class="contact-cta__field" data-field-wrap="${field.id}">
                    <label class="visually-hidden" for="${field.id}">${field.label}</label>
                    <input id="${field.id}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder}"
                         autocomplete="${field.autocomplete}" ${field.required ? 'required' : ''} aria-describedby="${errorId}" />
                    <p class="contact-cta__field-error" id="${errorId}" data-field-error="${field.id}" aria-live="polite"></p>
               </div>
          `;
     };

     fieldsRoot.innerHTML = FIELD_CONFIG.map((field) => buildField(field)).join('');

     const getFieldElements = (fieldId) => {
          return {
               wrapper: fieldsRoot.querySelector(`[data-field-wrap="${fieldId}"]`),
               input: fieldsRoot.querySelector(`#${fieldId}`),
               error: fieldsRoot.querySelector(`[data-field-error="${fieldId}"]`),
          };
     };

     const setFormMessage = (text, state) => {
          formMessage.textContent = text;
          formMessage.classList.toggle('is-error', state === 'error');
          formMessage.classList.toggle('is-success', state === 'success');
     };

     const setFieldError = (fieldId, message) => {
          const { wrapper, input, error } = getFieldElements(fieldId);
          if (!wrapper || !input || !error) return;

          const hasError = Boolean(message);
          wrapper.classList.toggle('is-error', hasError);
          input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
          error.textContent = message || '';
     };

     const validateField = (field) => {
          const { input } = getFieldElements(field.id);
          if (!input) return true;

          const value = input.value.trim();

          if (field.required && !value) {
               setFieldError(field.id, `${field.label} is required.`);
               return false;
          }

          if (field.name === 'fullName' && value.length < 2) {
               setFieldError(field.id, 'Please enter your full name.');
               return false;
          }

          if (field.name === 'companyName' && value.length < 2) {
               setFieldError(field.id, 'Please enter your company name.');
               return false;
          }

          if (field.name === 'email') {
               const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               if (!emailPattern.test(value)) {
                    setFieldError(field.id, 'Please enter a valid email address.');
                    return false;
               }
          }

          if (field.name === 'phone') {
               const digits = value.replace(/\D/g, '');
               if (digits.length < 7 || digits.length > 15) {
                    setFieldError(field.id, 'Please enter a valid phone number.');
                    return false;
               }
          }

          setFieldError(field.id, '');
          return true;
     };

     const setSubmittingState = (isSubmitting) => {
          const controls = form.querySelectorAll('input, select, button');
          controls.forEach((control) => {
               control.disabled = isSubmitting;
          });
     };

     FIELD_CONFIG.forEach((field) => {
          const { input } = getFieldElements(field.id);
          if (!input) return;

          input.addEventListener('blur', () => {
               validateField(field);
          });

          input.addEventListener('input', () => {
               if (input.getAttribute('aria-invalid') === 'true') {
                    validateField(field);
               }
          });
     });

     form.addEventListener('submit', (event) => {
          event.preventDefault();

          setFormMessage('', 'idle');

          const results = FIELD_CONFIG.map((field) => ({
               field,
               isValid: validateField(field),
          }));

          const firstInvalid = results.find((result) => !result.isValid);
          if (firstInvalid) {
               const { input } = getFieldElements(firstInvalid.field.id);
               setFormMessage('Please correct the highlighted fields and try again.', 'error');
               input?.focus();
               return;
          }

          setSubmittingState(true);

          window.setTimeout(() => {
               setSubmittingState(false);
               setFormMessage('Quote request ready. Our team will contact you shortly.', 'success');
               form.reset();
               FIELD_CONFIG.forEach((field) => setFieldError(field.id, ''));
          }, 450);
     });
})();
