(() => {
     const PROCESS_STEPS = [
          {
               tab: 'Raw Material',
               title: 'High-Grade Raw Material Selection',
               description:
                    'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
               highlights: ['PE100 grade material', 'Optimal molecular weight distribution'],
          },
          {
               tab: 'Extrusion',
               title: 'Precision Extrusion Process',
               description:
                    'Controlled melt flow and calibrated extrusion lines ensure consistent wall thickness and structural stability throughout production.',
               highlights: ['Computer-controlled extrusion line', 'Uniform melt pressure and throughput'],
          },
          {
               tab: 'Cooling',
               title: 'Optimized Cooling Control',
               description:
                    'Multi-stage cooling systems stabilize product geometry and prevent deformation during high-speed manufacturing operations.',
               highlights: ['Multi-zone water cooling', 'Stable dimensional retention'],
          },
          {
               tab: 'Sizing',
               title: 'Accurate Sizing & Calibration',
               description:
                    'Calibrators and vacuum tanks align dimensions with strict tolerances to maintain quality consistency across batches.',
               highlights: ['Vacuum calibration units', 'Strict diameter tolerance checks'],
          },
          {
               tab: 'Quality Control',
               title: 'Comprehensive Quality Verification',
               description:
                    'Every batch undergoes rigorous physical, dimensional, and pressure integrity checks before final release.',
               highlights: ['In-line and lab testing', 'Pressure and impact validation'],
          },
          {
               tab: 'Marking',
               title: 'Traceability Marking System',
               description:
                    'Continuous on-line marking ensures each pipe includes complete traceability details for standards compliance.',
               highlights: ['Batch and spec coding', 'Standards-compliant print clarity'],
          },
          {
               tab: 'Cutting',
               title: 'Precision Cutting & Finishing',
               description:
                    'Automated cutting units deliver exact lengths with clean, burr-free edges for seamless installation.',
               highlights: ['Automated length control', 'Clean edge finishing'],
          },
          {
               tab: 'Packaging',
               title: 'Secure Final Packaging',
               description:
                    'Finished pipes are packed with protective handling standards to preserve quality throughout transit and storage.',
               highlights: ['Transit-safe bundling', 'Moisture and handling protection'],
          },
     ];

     const root = document.querySelector('[data-manufacturing-process]');
     if (!root) return;

     const tabsRoot = root.querySelector('[data-manufacturing-tabs]');
     const titleEl = root.querySelector('[data-manufacturing-title]');
     const descriptionEl = root.querySelector('[data-manufacturing-description]');
     const highlightsEl = root.querySelector('[data-manufacturing-highlights]');
     const contentEl = root.querySelector('[data-manufacturing-content]');
     const prevButton = root.querySelector('[data-manufacturing-prev]');
     const nextButton = root.querySelector('[data-manufacturing-next]');

     if (!tabsRoot || !titleEl || !descriptionEl || !highlightsEl || !contentEl || !prevButton || !nextButton) {
          return;
     }

     let activeIndex = 0;

     tabsRoot.innerHTML = PROCESS_STEPS.map((step, index) => {
          const id = `manufacturing-tab-${index + 1}`;
          const panelId = `manufacturing-panel-${index + 1}`;
          return `
               <button type="button" class="manufacturing-process__tab" role="tab" id="${id}"
                    aria-controls="${panelId}" aria-selected="${index === 0 ? 'true' : 'false'}"
                    tabindex="${index === 0 ? '0' : '-1'}" data-manufacturing-tab data-index="${index}">
                    ${step.tab}
               </button>
          `;
     }).join('');

     const tabs = Array.from(tabsRoot.querySelectorAll('[data-manufacturing-tab]'));

     const updateControls = () => {
          prevButton.disabled = activeIndex === 0;
          nextButton.disabled = activeIndex === PROCESS_STEPS.length - 1;
     };

     const renderHighlights = (items) => {
          highlightsEl.innerHTML = items
               .map((item) => `<li><span>${item}</span></li>`)
               .join('');
     };

     const render = (index, animate = true) => {
          activeIndex = index;
          const step = PROCESS_STEPS[activeIndex];

          tabs.forEach((tab, tabIndex) => {
               const isActive = tabIndex === activeIndex;
               tab.classList.toggle('is-active', isActive);
               tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
               tab.setAttribute('tabindex', isActive ? '0' : '-1');
          });

          if (animate) {
               contentEl.classList.add('is-switching');
          }

          window.setTimeout(() => {
               titleEl.textContent = step.title;
               descriptionEl.textContent = step.description;
               renderHighlights(step.highlights);
               updateControls();
               contentEl.classList.remove('is-switching');
          }, animate ? 90 : 0);
     };

     tabs.forEach((tab) => {
          tab.addEventListener('click', () => {
               const index = Number(tab.dataset.index);
               if (Number.isNaN(index) || index === activeIndex) return;
               render(index, true);
          });
     });

     prevButton.addEventListener('click', () => {
          if (activeIndex > 0) {
               render(activeIndex - 1, true);
          }
     });

     nextButton.addEventListener('click', () => {
          if (activeIndex < PROCESS_STEPS.length - 1) {
               render(activeIndex + 1, true);
          }
     });

     render(0, false);
})();
