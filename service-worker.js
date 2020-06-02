if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"9fd4262f02e68454f93ddd6b03c75e1b","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"9fd4262f02e68454f93ddd6b03c75e1b","url":"index.html"},{"revision":"69449b4ef76005b799699d4bf57b8041","url":"precache-manifest.69449b4ef76005b799699d4bf57b8041.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"d8e94ff3ae41c9745f4431e693057e88","url":"static/css/main.90d439f1.chunk.css"},{"revision":"d2336e576383f6bf629e2ac9136a67b0","url":"static/js/0.2bc92764.chunk.js"},{"revision":"bbe7744de44c4fe875dcc7345abbc5d3","url":"static/js/1.e47aa1a5.chunk.js"},{"revision":"ff9c67291d3120068f4a0e7d2493abdb","url":"static/js/10.2f0ecb3f.chunk.js"},{"revision":"1033844f28634519e5a301597638c5e1","url":"static/js/11.f343ddad.chunk.js"},{"revision":"112c16a79d098274d08bb1c98f5ad52f","url":"static/js/12.bb128f8f.chunk.js"},{"revision":"cff9a13ca55a3c1a02fbf281543c4cf7","url":"static/js/13.c9bb8c89.chunk.js"},{"revision":"2778162ca4e0a08184c41621ed946ca5","url":"static/js/14.0849bef1.chunk.js"},{"revision":"bfeb3ad35a37c4088df943409860bb5c","url":"static/js/2.83e6ed32.chunk.js"},{"revision":"d8f6f5c18b22041cf4d12f4930c0d48b","url":"static/js/About.608849b6.chunk.js"},{"revision":"bf196c6c518836334de97450f2483325","url":"static/js/Demographics.31045eb0.chunk.js"},{"revision":"21f8641613943bd4a5b1057330480c78","url":"static/js/Essentials.4c519c4b.chunk.js"},{"revision":"79510828ce3eb7941c269c081496d59d","url":"static/js/Home.de11a221.chunk.js"},{"revision":"01f3ecb9135be1831788d11f25aa53ac","url":"static/js/main.7de2f58a.chunk.js"},{"revision":"3bce69be351329fa536a72f12c2f15d8","url":"static/js/runtime-main.7962b1a3.js"},{"revision":"77687ef6a90ec94f68a735b89eed3bf8","url":"static/js/State.949a8eba.chunk.js"}]);

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
