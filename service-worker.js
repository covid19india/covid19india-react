if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"57e6baade0e527a76dd9b82beb47d7e4","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"57e6baade0e527a76dd9b82beb47d7e4","url":"index.html"},{"revision":"c78db149906e45f715ce809dd2851646","url":"precache-manifest.c78db149906e45f715ce809dd2851646.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"aa63de508c69cfa6f6b07c2291615a10","url":"static/css/main.9ceb05a0.chunk.css"},{"revision":"d115258092c1a02b5c978bae0b6cb9b6","url":"static/js/0.236f97f8.chunk.js"},{"revision":"8ec13b958449fdb28062a663d181ad24","url":"static/js/1.ba3095ff.chunk.js"},{"revision":"9fe087355121d48c9ca4348126bc4d2f","url":"static/js/10.d2c8e9de.chunk.js"},{"revision":"d5523e9ca3cffe6d9a159329a307ef89","url":"static/js/11.94c521d9.chunk.js"},{"revision":"27529008efab8a2dc0801969314c1642","url":"static/js/12.f425029b.chunk.js"},{"revision":"704e40520a9cbbfaea4271622158a7cc","url":"static/js/13.3c155036.chunk.js"},{"revision":"cc36b71bfe1ce0921e649831847235e5","url":"static/js/2.2854ead4.chunk.js"},{"revision":"6edf44cb615a4aa806d2065fcad028e1","url":"static/js/About.07fa1c70.chunk.js"},{"revision":"c755375c4b60fd872805e37da7b90ba9","url":"static/js/Demographics.9c0efa00.chunk.js"},{"revision":"9ce92bc5770b6c2236336da52703c0f8","url":"static/js/Essentials.91881700.chunk.js"},{"revision":"e59c58a185dec0e7502043f62b59352a","url":"static/js/Home.a805f28b.chunk.js"},{"revision":"d0764ae7b653d105b85b1725561bd15f","url":"static/js/main.eda11fa4.chunk.js"},{"revision":"17c99b06b6a8431c2f62393dffbb5a85","url":"static/js/runtime-main.f88a0b47.js"},{"revision":"209fc7db838ab6bed0c8561a53ff6c24","url":"static/js/State.2344a14b.chunk.js"}]);

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
