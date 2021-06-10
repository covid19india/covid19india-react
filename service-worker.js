if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"9d9cb2ea14766ec37c9c794f73879a49","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"9d9cb2ea14766ec37c9c794f73879a49","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"a66872bead1f894a79ea2488187e8ff2","url":"static/css/20.f5f9d973.chunk.css"},{"revision":"d1fea059a7d4619eb68464962efbb1c3","url":"static/css/21.6b7c6f41.chunk.css"},{"revision":"855f45b3c48ca8e7dcfd8e1e1aff99b6","url":"static/js/0.c3d61b1a.chunk.js"},{"revision":"a041d0b8d05f6addd7fcae927406ba36","url":"static/js/1.a9fee63a.chunk.js"},{"revision":"a4394f5f373e1fa3274b91a5317f8e51","url":"static/js/11.07adafef.chunk.js"},{"revision":"5c53db2c5733504d73af0c43c88e2a31","url":"static/js/12.2b52ab46.chunk.js"},{"revision":"6f01968e42de97e0dd3df5de27d92e66","url":"static/js/13.b7323827.chunk.js"},{"revision":"b01f4fa3e51620b06e889a7e229226e9","url":"static/js/14.e0199fdf.chunk.js"},{"revision":"e01c935679f6bcddcd7197ab4fd4af18","url":"static/js/15.9fa543a2.chunk.js"},{"revision":"d1ded06fa01e1c952318d7c038a47d37","url":"static/js/16.bba8ec9a.chunk.js"},{"revision":"3617d9d8d2c0f7b1c7a7cbf78df05909","url":"static/js/17.328eb222.chunk.js"},{"revision":"9a7da25f032993e1799e01f7747b68b6","url":"static/js/18.adb92e2b.chunk.js"},{"revision":"4a96527cf95a50cb1e5ab9071c7109c4","url":"static/js/19.6c0a996e.chunk.js"},{"revision":"91517747b041bc0c82d7e56a0eee5118","url":"static/js/2.0c372208.chunk.js"},{"revision":"02582a01e8e2612db0bd5f47c85b1f86","url":"static/js/20.c2c0bd89.chunk.js"},{"revision":"7ffe8afb18ccb1b7a4943647826f4755","url":"static/js/21.39b80fae.chunk.js"},{"revision":"5064977d25b7878a927d1605323b7ab5","url":"static/js/22.30f392f4.chunk.js"},{"revision":"e4e9f4539fbec6b156d3ab4e947c33c8","url":"static/js/23.ac21be2a.chunk.js"},{"revision":"d4e91e4811d46d288effc13d3ac261ad","url":"static/js/24.cca7a038.chunk.js"},{"revision":"be350911ce6be698ce7e52d98b1d7d54","url":"static/js/25.b07de4db.chunk.js"},{"revision":"77caf68d6baac2a548103c8f3c4355ac","url":"static/js/26.68b50d7d.chunk.js"},{"revision":"364482a2a86a7e400ddb5f89afb033c3","url":"static/js/27.04ffc2c6.chunk.js"},{"revision":"7d25f0d58e01d7e91a04ba4569db7ae6","url":"static/js/28.e022a9da.chunk.js"},{"revision":"eefd17dcb0c7bf8a5eeb149dc96fe237","url":"static/js/29.98390906.chunk.js"},{"revision":"1478eeb60c25ad72e173bed3b9bee135","url":"static/js/3.9e0e978a.chunk.js"},{"revision":"77a4de842ff2065c36c3d85bb7de81ff","url":"static/js/30.690a6d3d.chunk.js"},{"revision":"0ca8ced123bf72e04c9acfe28e65536a","url":"static/js/31.c73e1c96.chunk.js"},{"revision":"da4eaf752f38d65f8fbc4f508e814551","url":"static/js/32.5a6c8a3a.chunk.js"},{"revision":"2b5c2bbba0cf38d843228a41236cba00","url":"static/js/33.5e04479f.chunk.js"},{"revision":"20b21f93d546e9cde06c176a1eb16e32","url":"static/js/34.e77c71d6.chunk.js"},{"revision":"fe619c604c0fe9ad27930605526f7d0b","url":"static/js/35.d1d96d96.chunk.js"},{"revision":"e273978ca668ea27cc8cedc408da902a","url":"static/js/36.4d2bc6c7.chunk.js"},{"revision":"75d9a2436c3006db20fa917624ce8fd3","url":"static/js/37.5af55f1a.chunk.js"},{"revision":"6bacc5c8f5c42992bd7b38cc9cdf60df","url":"static/js/38.2c5f7b3b.chunk.js"},{"revision":"8c736655710baae3b447408390a873d5","url":"static/js/39.15560796.chunk.js"},{"revision":"ee5c40884bc7eaa640bc9e98052806d4","url":"static/js/4.452a024e.chunk.js"},{"revision":"099b6f9dda2fbc72111943afb34c2a8b","url":"static/js/40.effbda50.chunk.js"},{"revision":"6c373fc3fbc554dfdd99f463e704ebcb","url":"static/js/41.d22a02c7.chunk.js"},{"revision":"e76fdbda64ef32e4b8493d02156343ac","url":"static/js/42.58dc0cb9.chunk.js"},{"revision":"85aa0d93d6d4f1828f0e6c93c62159dd","url":"static/js/43.a0381e54.chunk.js"},{"revision":"bea7c9792e15f44e4ea0817473530e20","url":"static/js/44.feee9846.chunk.js"},{"revision":"6bbdc5649b4a311c9c9b60b86cbb7914","url":"static/js/45.8e80f6cb.chunk.js"},{"revision":"6b442d173b758d85e1599e6916119fde","url":"static/js/46.30c5a56c.chunk.js"},{"revision":"568d1b6bd17ff704f42d34b081a516e3","url":"static/js/47.1b8ed84c.chunk.js"},{"revision":"bcb7e46c13b48aad13e8860b25b51efd","url":"static/js/48.905cd870.chunk.js"},{"revision":"e1ca2fceaa0536422332062f0f6fa835","url":"static/js/5.4b052197.chunk.js"},{"revision":"53df1680f22fb2336a62b1431d5dbdd4","url":"static/js/6.ab7d1edf.chunk.js"},{"revision":"0a1929664e87a0d507e33a4e439b9f1b","url":"static/js/7.b65ecb34.chunk.js"},{"revision":"3a8c1551dd6ba7e842ecd3bfafb7a937","url":"static/js/8.cdf4fd9d.chunk.js"},{"revision":"e35a757ea1aafa1a1bef116500cf9d83","url":"static/js/main.ae404468.chunk.js"},{"revision":"ce5176f550e406eb206e51258228d273","url":"static/js/runtime-main.c3c6f2d9.js"}]);

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
