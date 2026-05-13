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

     const iconDownload = `<img src="./assets/images/icons/icon-download.png" alt="" loading="lazy" decoding="async" />`;

     list.innerHTML = DOWNLOAD_RESOURCES.map((resource, index) => {
          return `
               <li class="resources-downloads__row">
                    <p class="resources-downloads__title">${resource.title}</p>
                    <button class="resources-downloads__action" type="button" data-resource-index="${index}">
                         <span>Download PDF</span>
                         <span class="resources-downloads__icon">${iconDownload}</span>
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
