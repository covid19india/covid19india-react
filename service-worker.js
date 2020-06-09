if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"f8971699a1e0a31d59c49d40f3483f52","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"f8971699a1e0a31d59c49d40f3483f52","url":"index.html"},{"revision":"356bcd5fb42995067fe789d091f8c498","url":"precache-manifest.356bcd5fb42995067fe789d091f8c498.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"08723876a3d4aa285b9572753027c834","url":"static/css/main.2640b7f9.chunk.css"},{"revision":"ee359b69253dbaec00853db8ea3fa5ee","url":"static/js/0.fea98a06.chunk.js"},{"revision":"6e567bd80fedddd9269fe8555d8497f9","url":"static/js/1.37203eef.chunk.js"},{"revision":"c5c8337a0c026ec2473d8aba4c575c72","url":"static/js/10.2ee69b7c.chunk.js"},{"revision":"327d57262a999740064371d9122d7951","url":"static/js/11.04525c8b.chunk.js"},{"revision":"0f9ac650093eec326cbdc310066f4a4f","url":"static/js/12.afcc89fd.chunk.js"},{"revision":"fddad0c6e98cd46c993f1e4e34431d40","url":"static/js/13.59492a7d.chunk.js"},{"revision":"a2b6dd100c9590e66b402a9819059cad","url":"static/js/2.4d2083ca.chunk.js"},{"revision":"1cf6d44aac0246452fb15192752859c2","url":"static/js/About.320f4be8.chunk.js"},{"revision":"536b7c3f6d97c934a69b4d2f24d6cdb4","url":"static/js/Demographics.505f504b.chunk.js"},{"revision":"3ab5cf857161b4303e8dda15cbc64d1c","url":"static/js/Essentials.5c15a7bb.chunk.js"},{"revision":"f4ce668aeb63bc38bbb16007ded6c836","url":"static/js/Home.c1652f46.chunk.js"},{"revision":"82a8cfc21e4193a370acada1588b7911","url":"static/js/main.0cdb4a14.chunk.js"},{"revision":"b094b7cedbdeb2782dfd5e094d9fa68c","url":"static/js/runtime-main.80808461.js"},{"revision":"cb78a501a1d53c9ad220e8da572bca4f","url":"static/js/State.0565e17f.chunk.js"}]);

    /* custom cache rules */
    workbox.routing.registerRoute(
      new workbox.routing.NavigationRoute(
        new workbox.strategies.NetworkFirst({
          cacheName: 'PRODUCTION',
        })
      )
    );

    // Adding staleWhileRevalidate for all js files. Provide faster access from cache while revalidating in the background
    workbox.routing.registerRoute(
      /.*\.js$/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding staleWhileRevalidate for all html files
    workbox.routing.registerRoute(
      /.*\.html/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding staleWhileRevalidate for all css files
    workbox.routing.registerRoute(
      /.*\.css/,
      new workbox.strategies.StaleWhileRevalidate()
    );

    // Adding networkFirst for all json data. In offline mode will be fetched from cache
    workbox.routing.registerRoute(
      new RegExp('https://api\\.covid19india\\.org/.*\\.json'),
      new workbox.strategies.NetworkFirst(),
      'GET'
    );
  } else {
    console.log('Workbox could not be loaded. Hence, no offline support.');
  }
}
