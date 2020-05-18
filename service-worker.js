if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"84aa8294819ac1bffd5550a24d9902c8","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"84aa8294819ac1bffd5550a24d9902c8","url":"index.html"},{"revision":"e76cf755d58948b9e35fd1f5628251a5","url":"precache-manifest.e76cf755d58948b9e35fd1f5628251a5.js"},{"revision":"cb740fc90ec139afa150d1df7e351d57","url":"static/css/13.93b3b32d.chunk.css"},{"revision":"af8453130b1be16226b521e09b95aebb","url":"static/css/main.dde7c33d.chunk.css"},{"revision":"9fedd94083ceae8b31708882f2afb041","url":"static/js/0.af784392.chunk.js"},{"revision":"3be1ea9d500b5594682a651d2346931d","url":"static/js/1.cd0161fc.chunk.js"},{"revision":"7b2cbac26e8a941a2cc2d9b459ce0e9e","url":"static/js/11.01d8ac61.chunk.js"},{"revision":"04413f072ed156be974c479a672dc83a","url":"static/js/12.48acd55e.chunk.js"},{"revision":"c7664fccfafbc85bb1f44d0a49491542","url":"static/js/13.583ad582.chunk.js"},{"revision":"190f78f17323c524422e7f669ed3238d","url":"static/js/14.5c9fd1aa.chunk.js"},{"revision":"175111dabe09c6e77272c8121470494d","url":"static/js/15.607631d9.chunk.js"},{"revision":"aa4eb6332dbe29c7d64ed67a31164ff3","url":"static/js/16.e0b61754.chunk.js"},{"revision":"f233a93b24dc97bdf8010fbabb294827","url":"static/js/2.54042c5d.chunk.js"},{"revision":"92957bb59ab63970c352a24d36967a7b","url":"static/js/DeepDive.2320bdee.chunk.js"},{"revision":"b856537edbae53ac887b50f399912be3","url":"static/js/Essentials.9e23c04a.chunk.js"},{"revision":"75b732cc8e619f7e7f103bbcaaeef2b4","url":"static/js/FAQ.a6e9b7ca.chunk.js"},{"revision":"943fa311007867df446305c334fa72d4","url":"static/js/Home.eed5ecde.chunk.js"},{"revision":"4efd6083de4fb4b6234d93af31ab8a23","url":"static/js/main.49b7cb42.chunk.js"},{"revision":"40293e05a37c99652ee335002f5d57e8","url":"static/js/PatientDB.eb04a4d1.chunk.js"},{"revision":"f3605e6b470aae4dc251e092148bfbac","url":"static/js/runtime-main.6c3890bd.js"},{"revision":"bccfe125b17b031ac546a5067444c4a5","url":"static/js/State.432a3935.chunk.js"}]);

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
