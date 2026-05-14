(() => {
     const header = document.querySelector('.header');
     const firstFold = document.querySelector('main > section');
     const navbar = header?.querySelector('.navbar');
     const navActions = header?.querySelector('.nav-actions');
     const navLinks = header?.querySelector('.nav-links');
     const desktopMedia = window.matchMedia('(min-width: 1025px)');
     const SHRINK_DISTANCE = 220;

     if (!header || !firstFold || !navbar) {
          return;
     }

     let threshold = 0;
     let ticking = false;
     let maxSafeProgress = 1;

     const clamp01 = (value) => Math.min(1, Math.max(0, value));

     const readProgress = () => {
          const value = Number.parseFloat(header.style.getPropertyValue('--header-shrink-progress'));
          return Number.isFinite(value) ? clamp01(value) : 0;
     };

     const setProgress = (value) => {
          header.style.setProperty('--header-shrink-progress', clamp01(value).toFixed(4));
     };

     const isMultiRow = (element) => {
          if (!element) return false;

          const children = Array.from(element.children).filter((child) => {
               return window.getComputedStyle(child).display !== 'none';
          });

          if (children.length < 2) {
               return false;
          }

          const centers = children.map((child) => {
               const rect = child.getBoundingClientRect();
               return rect.top + (rect.height / 2);
          });

          const baselineCenter = centers[0];
          return centers.some((center) => Math.abs(center - baselineCenter) > 8);
     };

     const isOverflowing = (element) => {
          if (!element) return false;
          return (element.scrollWidth - element.clientWidth) > 1;
     };

     const hasBreakpointPressure = () => {
          const navbarWrapped = isMultiRow(navbar);
          const actionsWrapped = isMultiRow(navActions);
          const linksWrapped = isMultiRow(navLinks);

          const navbarOverflow = isOverflowing(navbar);
          const actionsOverflow = isOverflowing(navActions);
          const linksOverflow = isOverflowing(navLinks);

          return navbarWrapped || actionsWrapped || linksWrapped || navbarOverflow || actionsOverflow || linksOverflow;
     };

     const updateWrappedState = () => {
          const wrapped = isMultiRow(navbar) || isMultiRow(navActions);
          header.classList.toggle('is-nav-wrapped', wrapped);
     };

     const recalculateSafeProgress = () => {
          if (!desktopMedia.matches) {
               maxSafeProgress = 0;
               setProgress(0);
               updateWrappedState();
               return;
          }

          const wasPinned = header.classList.contains('is-pinned');
          const previousProgress = readProgress();

          if (!wasPinned) {
               header.classList.add('is-pinned');
          }

          let low = 0;
          let high = 1;

          for (let index = 0; index < 8; index += 1) {
               const mid = (low + high) / 2;
               setProgress(mid);

               if (hasBreakpointPressure()) {
                    high = mid;
               } else {
                    low = mid;
               }
          }

          maxSafeProgress = clamp01(low);
          setProgress(previousProgress);

          if (!wasPinned && window.scrollY <= 0) {
               header.classList.remove('is-pinned');
          }

          updateWrappedState();
     };

     const syncStickyHeight = () => {
          const height = header.offsetHeight;
          document.body.style.setProperty('--sticky-header-height', `${height}px`);
     };

     const setPinnedState = (isPinned) => {
          header.classList.toggle('is-pinned', isPinned);
          document.body.classList.toggle('has-sticky-header', isPinned);
     };

     const setAnnouncementState = (isVisible) => {
          header.classList.toggle('is-announcement-visible', isVisible);
     };

     const computeThreshold = () => {
          const firstFoldVisibleHeight = Math.min(firstFold.offsetHeight, window.innerHeight);
          threshold = firstFold.offsetTop + firstFoldVisibleHeight;
     };

     const onScroll = () => {
          if (ticking) {
               return;
          }

          ticking = true;
          window.requestAnimationFrame(() => {
               const scrollY = window.scrollY;
               const shouldPin = scrollY >= threshold;
               const showAnnouncement = shouldPin;

               setPinnedState(shouldPin);
               setAnnouncementState(showAnnouncement);

               if (shouldPin && desktopMedia.matches) {
                    const desiredProgress = clamp01(scrollY / SHRINK_DISTANCE);
                    setProgress(Math.min(desiredProgress, maxSafeProgress));
               } else {
                    setProgress(0);
               }

               updateWrappedState();
               syncStickyHeight();
               ticking = false;
          });
     };

     const onResize = () => {
          computeThreshold();
          recalculateSafeProgress();
          onScroll();
     };

     computeThreshold();
     recalculateSafeProgress();
     onScroll();

     window.addEventListener('scroll', onScroll, { passive: true });
     window.addEventListener('resize', onResize);
     window.addEventListener('load', onResize);
     desktopMedia.addEventListener('change', onResize);
})();
