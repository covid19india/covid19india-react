if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"2e66759ed9ce21388b239cd326dd4b54","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"2e66759ed9ce21388b239cd326dd4b54","url":"index.html"},{"revision":"5d16a8627d5f32fd56575ec69a384349","url":"precache-manifest.5d16a8627d5f32fd56575ec69a384349.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"5bf533eacabe29aa5c98686a938a7d6f","url":"static/css/main.708d3b03.chunk.css"},{"revision":"d115258092c1a02b5c978bae0b6cb9b6","url":"static/js/0.236f97f8.chunk.js"},{"revision":"8ec13b958449fdb28062a663d181ad24","url":"static/js/1.ba3095ff.chunk.js"},{"revision":"9fe087355121d48c9ca4348126bc4d2f","url":"static/js/10.d2c8e9de.chunk.js"},{"revision":"d5523e9ca3cffe6d9a159329a307ef89","url":"static/js/11.94c521d9.chunk.js"},{"revision":"27529008efab8a2dc0801969314c1642","url":"static/js/12.f425029b.chunk.js"},{"revision":"704e40520a9cbbfaea4271622158a7cc","url":"static/js/13.3c155036.chunk.js"},{"revision":"cc36b71bfe1ce0921e649831847235e5","url":"static/js/2.2854ead4.chunk.js"},{"revision":"6edf44cb615a4aa806d2065fcad028e1","url":"static/js/About.07fa1c70.chunk.js"},{"revision":"c755375c4b60fd872805e37da7b90ba9","url":"static/js/Demographics.9c0efa00.chunk.js"},{"revision":"d6ad6e13f5e23bf947b5033f74e0c39b","url":"static/js/Essentials.413b6ebc.chunk.js"},{"revision":"c779a0ca51bc2d0b959da9451af18c65","url":"static/js/Home.000c9bc8.chunk.js"},{"revision":"d0764ae7b653d105b85b1725561bd15f","url":"static/js/main.eda11fa4.chunk.js"},{"revision":"6871f752af05c5d245cefcf3c797682c","url":"static/js/runtime-main.ab5eb670.js"},{"revision":"209fc7db838ab6bed0c8561a53ff6c24","url":"static/js/State.2344a14b.chunk.js"}]);

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
