if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"3847c0c5f4885324e533a4db0a03ef65","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"3847c0c5f4885324e533a4db0a03ef65","url":"index.html"},{"revision":"5a95a3c00b0c8fbab32c73dd9b0a528e","url":"precache-manifest.5a95a3c00b0c8fbab32c73dd9b0a528e.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"1ab416fac31936ef1cc7a4eba63bda5a","url":"static/css/main.9d7fcf3d.chunk.css"},{"revision":"395e0fdb55952ce0257aafc17d67b58e","url":"static/js/0.9c489626.chunk.js"},{"revision":"d272320ef0e21050ea90f386392bf64c","url":"static/js/1.8e953305.chunk.js"},{"revision":"60762fb67da89d692f9b871b1d9be817","url":"static/js/10.b3de2fbb.chunk.js"},{"revision":"a19c17cf3b13e317200d9e01ab9afa0b","url":"static/js/11.87d51da1.chunk.js"},{"revision":"64d8fff10516e0aef80706202d9fc6e2","url":"static/js/12.7e4e3f37.chunk.js"},{"revision":"bd55d995ef4a677a6e233ea10d7d166c","url":"static/js/13.debc6e8d.chunk.js"},{"revision":"726665331423442138e6112ab1ae879f","url":"static/js/2.3041e30e.chunk.js"},{"revision":"953716abb37adbb58d6fd37609f2a357","url":"static/js/About.8e16ee69.chunk.js"},{"revision":"88466c47659e1a127f5f42271b26e2c6","url":"static/js/Demographics.53ebee9e.chunk.js"},{"revision":"0f502798c89f259c46664ff3bb6c3172","url":"static/js/Essentials.f9fae568.chunk.js"},{"revision":"a4ccd74ffcaba89dcc6f154fc12addf5","url":"static/js/Home.31461f0f.chunk.js"},{"revision":"bc521c30157618d576ffd2fddc9a483f","url":"static/js/main.7aba9ee3.chunk.js"},{"revision":"44f4364d9ef2ef3f439f1feeb1f090a9","url":"static/js/runtime-main.5305a71e.js"},{"revision":"d93c28816b71059a8de901d5ad43aec0","url":"static/js/State.6f6c939d.chunk.js"}]);

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
