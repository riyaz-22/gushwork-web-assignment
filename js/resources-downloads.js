(() => {
     const DOWNLOAD_RESOURCES = [
          {
               title: 'HDPE Pipe Installation Manual (PDF)',
               fileName: 'hdpe-pipe-installation-manual.pdf',
          },
          {
               title: 'Maintenance & Inspection Handbook (PDF)',
               fileName: 'maintenance-inspection-handbook.pdf',
          },
          {
               title: 'Engineering Specifications Sheet (PDF)',
               fileName: 'engineering-specifications-sheet.pdf',
          },
     ];

     const root = document.querySelector('[data-resources-downloads]');
     if (!root) return;

     const list = root.querySelector('[data-resources-list]');
     if (!list) return;

     const downloadIcon = `
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
               <path d="M12 4v10" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
               <path d="m7.5 10.5 4.5 4.5 4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
               <path d="M5 18.5h14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
          </svg>
     `;

     list.innerHTML = DOWNLOAD_RESOURCES.map((resource, index) => {
          return `
               <li class="resources-downloads__row">
                    <p class="resources-downloads__title">${resource.title}</p>
                    <button class="resources-downloads__action" type="button" data-resource-index="${index}">
                         <span>Download PDF</span>
                         <span class="resources-downloads__icon">${downloadIcon}</span>
                    </button>
               </li>
          `;
     }).join('');

     const buildPdfBlob = (resourceTitle) => {
          const placeholder = [
               '%PDF-1.1',
               `1 0 obj<</Title(${resourceTitle})>>endobj`,
               'trailer<</Root 1 0 R>>',
               '%%EOF',
          ].join('\n');

          return new Blob([placeholder], { type: 'application/pdf' });
     };

     list.addEventListener('click', (event) => {
          const action = event.target.closest('.resources-downloads__action');
          if (!action) return;

          const index = Number(action.dataset.resourceIndex);
          const resource = DOWNLOAD_RESOURCES[index];
          if (!resource) return;

          const blob = buildPdfBlob(resource.title);
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = resource.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.setTimeout(() => URL.revokeObjectURL(url), 500);
     });
})();
