if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"d4e6bf389131a3de76ea9b14c84a516e","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"d4e6bf389131a3de76ea9b14c84a516e","url":"index.html"},{"revision":"fa659579f160589aa2a3497a99f494c3","url":"precache-manifest.fa659579f160589aa2a3497a99f494c3.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"d8e94ff3ae41c9745f4431e693057e88","url":"static/css/main.90d439f1.chunk.css"},{"revision":"d2336e576383f6bf629e2ac9136a67b0","url":"static/js/0.2bc92764.chunk.js"},{"revision":"89b754b6accba3fe5e612e2bff322cde","url":"static/js/1.816ffa6b.chunk.js"},{"revision":"f5c679e4bfaea46886c458460547f0dc","url":"static/js/10.78678ec8.chunk.js"},{"revision":"1033844f28634519e5a301597638c5e1","url":"static/js/11.f343ddad.chunk.js"},{"revision":"112c16a79d098274d08bb1c98f5ad52f","url":"static/js/12.bb128f8f.chunk.js"},{"revision":"3539a950ee2df928afc9486fe896ff0e","url":"static/js/13.2b31a924.chunk.js"},{"revision":"68e630c8ef6c6b8cf8f2ba59822c17a5","url":"static/js/14.432710d5.chunk.js"},{"revision":"bfeb3ad35a37c4088df943409860bb5c","url":"static/js/2.83e6ed32.chunk.js"},{"revision":"d8f6f5c18b22041cf4d12f4930c0d48b","url":"static/js/About.608849b6.chunk.js"},{"revision":"e5014de5de23630990ca57c3858d637a","url":"static/js/Demographics.f1d423bc.chunk.js"},{"revision":"ac4a42630c84311c526e2395d52e4ce3","url":"static/js/Essentials.44bf747a.chunk.js"},{"revision":"e8dbb32c5dda95f0ec3ca2cb158746a9","url":"static/js/Home.7207a41e.chunk.js"},{"revision":"3c18582c1489e3fd0051f14643e043a5","url":"static/js/main.923b1e58.chunk.js"},{"revision":"7b1436e14f10ff82cd0dd5737b105074","url":"static/js/runtime-main.862fa836.js"},{"revision":"0a77b33f2141cfda44cf7169a383cf9f","url":"static/js/State.a418e44e.chunk.js"}]);

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
