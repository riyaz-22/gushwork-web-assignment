(() => {
     const dropdown = document.querySelector('.nav-dropdown');
     const toggle = dropdown?.querySelector('.nav-dropdown__toggle');
     const menu = dropdown?.querySelector('.nav-dropdown__menu');

     if (!dropdown || !toggle || !menu) {
          return;
     }

     const setOpen = (isOpen) => {
          dropdown.classList.toggle('is-open', isOpen);
          toggle.setAttribute('aria-expanded', String(isOpen));
          menu.hidden = !isOpen;
     };

     toggle.addEventListener('click', () => {
          setOpen(!dropdown.classList.contains('is-open'));
     });

     document.addEventListener('click', (event) => {
          if (!dropdown.contains(event.target)) {
               setOpen(false);
          }
     });

     document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
               setOpen(false);
               toggle.focus();
          }
     });

     dropdown.addEventListener('focusout', (event) => {
          if (!dropdown.contains(event.relatedTarget)) {
               setOpen(false);
          }
     });

     setOpen(false);
})();
