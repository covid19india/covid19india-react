const workboxBuild = require('workbox-build');

const buildSW = () => {
  workboxBuild
    .injectManifest({
      swSrc: 'src/sw-template.js',
      swDest: 'build/service-worker.js',
      globDirectory: 'build',
      globPatterns: ['**/*.{html,woff2,js,css}'], // precaching restricted to only html and fonts.
    })
    .then(({count, size, warnings}) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    })
    .catch(console.error);
};

buildSW();
