if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"cf17dbe66b09e0499f9ac1f63d0a12e5","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"cf17dbe66b09e0499f9ac1f63d0a12e5","url":"index.html"},{"revision":"369009c8c29ffc0b9c99cbb651aa8c21","url":"precache-manifest.369009c8c29ffc0b9c99cbb651aa8c21.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"68c5f0fb28c2c6a5d871dddd071b7bb0","url":"static/css/main.587e7e3e.chunk.css"},{"revision":"c1491a6ed7c69b2ed9b31b2e3871901d","url":"static/js/0.c38c94d3.chunk.js"},{"revision":"9ec80b3241408d5a223778bfa873c553","url":"static/js/1.a1f1f99b.chunk.js"},{"revision":"09e6b4bd06096fd32f24f05fea135abf","url":"static/js/10.b02b70db.chunk.js"},{"revision":"0003979f91736ffd02fb1f17fee5d698","url":"static/js/11.f8f52853.chunk.js"},{"revision":"fa5549ece8365006919e3da4b2f22db9","url":"static/js/12.80b18296.chunk.js"},{"revision":"763c59cffd1484f3eff04d73eaea55fe","url":"static/js/13.f6f4935c.chunk.js"},{"revision":"86489a9b6a114fca8d4ddc854bf0e96a","url":"static/js/2.3c4501e5.chunk.js"},{"revision":"0dc3cc30ae1d910e9c3a4c2b897d6709","url":"static/js/About.970c55cc.chunk.js"},{"revision":"d51f71ba2657673ad4470575fa6fb792","url":"static/js/Demographics.16b47d76.chunk.js"},{"revision":"6fac4d7b05fd2a673a49b28a2bb58fa9","url":"static/js/Essentials.baddf91a.chunk.js"},{"revision":"dba5e44d590dba028bb7f1498feb607c","url":"static/js/Home.1ca4dd6b.chunk.js"},{"revision":"bfcc792bad56ffb42bedcc9f078151ac","url":"static/js/main.c10c3961.chunk.js"},{"revision":"1b71836ffbf1c5ccb943fdbf9eff43fd","url":"static/js/runtime-main.8fb69178.js"},{"revision":"43cb073406fcace2ae42e3f72bc1a312","url":"static/js/State.552cf5fb.chunk.js"}]);

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
