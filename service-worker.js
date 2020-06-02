if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"6b93f6ca202a865d4b0b0895f027ca31","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"6b93f6ca202a865d4b0b0895f027ca31","url":"index.html"},{"revision":"7d4ed11ddc14ad2757e735232f50aeb5","url":"precache-manifest.7d4ed11ddc14ad2757e735232f50aeb5.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"d8e94ff3ae41c9745f4431e693057e88","url":"static/css/main.90d439f1.chunk.css"},{"revision":"d2336e576383f6bf629e2ac9136a67b0","url":"static/js/0.2bc92764.chunk.js"},{"revision":"e5110d36b643d52506d8de4e459356d8","url":"static/js/1.807197c4.chunk.js"},{"revision":"bc6518b4feacb03bd7e9b7d5e4c99ad0","url":"static/js/10.df31250d.chunk.js"},{"revision":"1033844f28634519e5a301597638c5e1","url":"static/js/11.f343ddad.chunk.js"},{"revision":"112c16a79d098274d08bb1c98f5ad52f","url":"static/js/12.bb128f8f.chunk.js"},{"revision":"bb960fe197a8e3a61ac8fff6f9e12ce9","url":"static/js/13.c3d02541.chunk.js"},{"revision":"2778162ca4e0a08184c41621ed946ca5","url":"static/js/14.0849bef1.chunk.js"},{"revision":"a32d8ae4f1e26c8d94ca44242ca3e897","url":"static/js/2.31b493c6.chunk.js"},{"revision":"70207e8178abd8c62b228b8f995c25eb","url":"static/js/About.19126428.chunk.js"},{"revision":"173c2994522db23b5427d694ea111086","url":"static/js/Demographics.7aea4a35.chunk.js"},{"revision":"9090bad5db098444d22f549a679e8b27","url":"static/js/Essentials.698139e1.chunk.js"},{"revision":"de54a0b39edb9ab4d1a708f0e6798eb3","url":"static/js/Home.8ddb159e.chunk.js"},{"revision":"2813228421a9cff51604bcda238a3e94","url":"static/js/main.10c9afaa.chunk.js"},{"revision":"9c0e7fd97972c9933fd9ec1fe1fa5af6","url":"static/js/runtime-main.7abb0ccc.js"},{"revision":"925447ed1bd48d854d62be4debce69cb","url":"static/js/State.7ac64b17.chunk.js"}]);

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
