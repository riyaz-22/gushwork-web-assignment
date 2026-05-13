(() => {
     const INDIA_FLAG = '<img src="./assets/images/icons/icon-nationalFlag.png" alt="" loading="lazy" decoding="async" />';

     const TECHNICAL_SPEC_ROWS = [
          {
               parameter: 'Pipe Diameter Range',
               specification: '20mm to 1600mm (3/4" to 63")',
          },
          {
               parameter: 'Pressure Ratings',
               specification: 'PN 2.5, PN 4, PN 6, PN 8, PN 10, PN 12.5, PN 16',
          },
          {
               parameter: 'Standard Dimension Ratio',
               specification: 'SDR 33, SDR 26, SDR 21, SDR 17, SDR 13.6, SDR 11',
          },
          {
               parameter: 'Operating Temperature',
               specification: '-40C to +80C (-40F to +176F)',
          },
          {
               parameter: 'Service Life',
               specification: '50+ Years (at 20 degrees C, PN 10)',
          },
          {
               parameter: 'Material Density',
               specification: '0.95 - 0.96 g/cm3',
          },
          {
               parameter: 'Certification Standards',
               specification: 'IS 5984, ISO 4427, ASTM D3035',
          },
          {
               parameter: 'Joint Type',
               specification: 'Butt Fusion, Electrofusion, Mechanical',
          },
          {
               parameter: 'Coil Lengths',
               specification: 'Up to 500m (for smaller diameters)',
          },
          {
               parameter: 'Country of Origin',
               specification: `<span class="technical-specs__country-flag" aria-hidden="true">${INDIA_FLAG}</span> India`,
          },
     ];

     const rowsRoot = document.querySelector('[data-technical-spec-rows]');
     if (!rowsRoot) return;

     const rowsMarkup = TECHNICAL_SPEC_ROWS.map(({ parameter, specification }) => {
          return `
               <tr>
                    <th scope="row">${parameter}</th>
                    <td>${specification}</td>
               </tr>
          `;
     }).join('');

     rowsRoot.innerHTML = rowsMarkup;
})();
