if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"ddbc9ad1f77e83d9fd66631148122bbf","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"ddbc9ad1f77e83d9fd66631148122bbf","url":"index.html"},{"revision":"49356bef6e25a2d4094049ec9dc9e2d5","url":"precache-manifest.49356bef6e25a2d4094049ec9dc9e2d5.js"},{"revision":"cb740fc90ec139afa150d1df7e351d57","url":"static/css/13.93b3b32d.chunk.css"},{"revision":"e3f1dd009e110222b3c6454d15fb1864","url":"static/css/main.b62b46c0.chunk.css"},{"revision":"a8c031668e9c87f2faa51b48651e491c","url":"static/js/0.4a2f490b.chunk.js"},{"revision":"e7ff6c916b1a31da7d99a99be2deef0b","url":"static/js/1.79080310.chunk.js"},{"revision":"8fa2a9ba3759ebddcf4650d809306cef","url":"static/js/11.e84d8fba.chunk.js"},{"revision":"ef9f8c52d63913a83ca9f0a1b0ebddbe","url":"static/js/12.1af9d03f.chunk.js"},{"revision":"54f126dad49466ad02f61436de66aeac","url":"static/js/13.1ba00762.chunk.js"},{"revision":"c9842a6df4eae5bde13da6628bc8ca2f","url":"static/js/14.67bfd7c1.chunk.js"},{"revision":"f25045cbbdab8ecf01af94a42efe67e6","url":"static/js/15.ad398b54.chunk.js"},{"revision":"e972b569dec714d42d5c8095bf847e42","url":"static/js/2.2df823b1.chunk.js"},{"revision":"fdce491577fa3b95c665064a22219374","url":"static/js/DeepDive.524a48f3.chunk.js"},{"revision":"a452fce09aa2126e63241379c7b99318","url":"static/js/Essentials.5b5b934f.chunk.js"},{"revision":"3abcd0f72cebcc245488318a5816e4e8","url":"static/js/FAQ.bd8c9c34.chunk.js"},{"revision":"0513db93395f94d16e6fe92ad15ab144","url":"static/js/Home.a8bb10fe.chunk.js"},{"revision":"1a4bb0bfc29d51e84edcfed7c73cdc0d","url":"static/js/main.1df37ef3.chunk.js"},{"revision":"648cab402b2ed274e8310f90fb84c448","url":"static/js/PatientDB.c29424ad.chunk.js"},{"revision":"56e79b8859b5cfb6b03c53bd910418e8","url":"static/js/runtime-main.3370aa19.js"},{"revision":"1e2ed295ad923d19d13f884a2693a231","url":"static/js/State.c3ca8dec.chunk.js"}]);

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
