if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"b0a6f7930e2f63346da1992847bed727","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"b0a6f7930e2f63346da1992847bed727","url":"index.html"},{"revision":"82d71b618d8ee64ba79c47549f669815","url":"precache-manifest.82d71b618d8ee64ba79c47549f669815.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"86547ce84d7a4021c6930b8d6be7237f","url":"static/css/main.5518569f.chunk.css"},{"revision":"c00e3c893660106acb0d7ef94a01c325","url":"static/js/0.6b427113.chunk.js"},{"revision":"83c6c9e003374a3d572438f907d1fd0a","url":"static/js/1.52aecde1.chunk.js"},{"revision":"c779e05db795b3ce89b64a16e55c8c6d","url":"static/js/10.f8629b82.chunk.js"},{"revision":"24ccf5eaa7359b44a3c0bbf42dfa5e61","url":"static/js/11.a7d3d8c8.chunk.js"},{"revision":"a7ccdb840f992ae3c5f69f3540419d6c","url":"static/js/12.22968508.chunk.js"},{"revision":"e589e243e05b3f3c4146d8ec7d33b23b","url":"static/js/13.26076852.chunk.js"},{"revision":"77dd99578b8154c3d8c98301b9040ed4","url":"static/js/2.d596e359.chunk.js"},{"revision":"70207e8178abd8c62b228b8f995c25eb","url":"static/js/About.19126428.chunk.js"},{"revision":"c5da6722659f084d76f9265f0ddb86b0","url":"static/js/Demographics.1819bfe2.chunk.js"},{"revision":"5eaec77ff01568b89778a69b7793f3e2","url":"static/js/Essentials.c2b1f9f7.chunk.js"},{"revision":"f49bf6be25f71f4deec4f2cc0c0d891c","url":"static/js/Home.e0cf5c4a.chunk.js"},{"revision":"3609dd553e183dca8187e281826cd9ad","url":"static/js/main.810f7404.chunk.js"},{"revision":"fb57235a28c83a1a9e49bb8816195c3b","url":"static/js/runtime-main.96cc7123.js"},{"revision":"da3e294dfff9c103f49bfae79a2eb4bd","url":"static/js/State.78b24104.chunk.js"}]);

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
