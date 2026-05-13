(() => {
     const header = document.querySelector('.header');
     const firstFold = document.querySelector('main > section');

     if (!header || !firstFold) {
          return;
     }

     let threshold = 0;
     let ticking = false;

     const syncStickyHeight = () => {
          const height = header.offsetHeight;
          document.body.style.setProperty('--sticky-header-height', `${height}px`);
     };

     const setPinnedState = (isPinned) => {
          header.classList.toggle('is-pinned', isPinned);
          document.body.classList.toggle('has-sticky-header', isPinned);
          syncStickyHeight();
     };

     const computeThreshold = () => {
          threshold = firstFold.offsetTop + firstFold.offsetHeight;
     };

     const onScroll = () => {
          if (ticking) {
               return;
          }

          ticking = true;
          window.requestAnimationFrame(() => {
               const shouldPin = window.scrollY >= threshold;
               setPinnedState(shouldPin);
               ticking = false;
          });
     };

     const onResize = () => {
          computeThreshold();
          syncStickyHeight();
          onScroll();
     };

     computeThreshold();
     onScroll();

     window.addEventListener('scroll', onScroll, { passive: true });
     window.addEventListener('resize', onResize);
     window.addEventListener('load', onResize);
})();
