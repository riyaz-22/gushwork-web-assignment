(() => {
     const scriptSources = [
          './js/header.js',
          './js/main.js',
          './js/carousel.js',
          './js/trusted-companies.js',
          './js/technical-specs.js',
          './js/built-to-last.js',
          './js/faq.js',
          './js/applications.js',
          './js/manufacturing-process.js',
          './js/resources-downloads.js',
          './js/solutions-portfolio.js',
          './js/testimonials.js',
          './js/contact-cta.js',
          './js/footer.js',
          './js/modal.js'
     ];

     const loadScript = (index) => {
          if (index >= scriptSources.length) {
               return;
          }

          const script = document.createElement('script');
          script.src = scriptSources[index];
          script.onload = () => loadScript(index + 1);
          script.onerror = () => {
               console.error(`Failed to load script: ${scriptSources[index]}`);
               loadScript(index + 1);
          };
          document.body.appendChild(script);
     };

     // Load the existing feature scripts in order through a single submission entrypoint.
     loadScript(0);
})();