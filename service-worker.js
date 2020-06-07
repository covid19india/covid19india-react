if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"da4faedf486e0892b9d3e987aa793dbf","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"da4faedf486e0892b9d3e987aa793dbf","url":"index.html"},{"revision":"8f6da3254e2868b31ce823fb42cd568e","url":"precache-manifest.8f6da3254e2868b31ce823fb42cd568e.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"35046b664f435c7bbd6b689d24504b77","url":"static/css/main.df34c4be.chunk.css"},{"revision":"bcddb5101724e2d23363bc0eb13f530b","url":"static/js/0.0dd2304a.chunk.js"},{"revision":"778bcf2a0c81821348798231817ab25d","url":"static/js/1.b7ae0ba3.chunk.js"},{"revision":"60762fb67da89d692f9b871b1d9be817","url":"static/js/10.b3de2fbb.chunk.js"},{"revision":"aa646cb6e7c2d20847eabf7ccb2b35d4","url":"static/js/11.51cf7000.chunk.js"},{"revision":"5a86bfbe0ea6f676cc23dd98cb31db85","url":"static/js/12.78feb748.chunk.js"},{"revision":"3409dd087f7455a617948cf417f578a9","url":"static/js/13.0322ffec.chunk.js"},{"revision":"b705e0bde1571ba4ace9d5b3ea49563e","url":"static/js/2.b5691c13.chunk.js"},{"revision":"af38acf19f8cc0a227dc609642c8683c","url":"static/js/About.bd18e215.chunk.js"},{"revision":"cb5741cd0d3e690ad10d1b55609b0d64","url":"static/js/Demographics.fe193404.chunk.js"},{"revision":"8e1d6b6d1fc689f943407af02db09112","url":"static/js/Essentials.3f8d3c26.chunk.js"},{"revision":"bdad5c8f3c39a89c08e228f53f6a061e","url":"static/js/Home.466d56b1.chunk.js"},{"revision":"3ac392a426ade959aaae23fe94abc9a3","url":"static/js/main.9f3a80fd.chunk.js"},{"revision":"f0827217333f6aa6faab17477d905e4d","url":"static/js/runtime-main.85438e05.js"},{"revision":"be11e5c5e18e35eaf567a0e96dbad94f","url":"static/js/State.1bb30dda.chunk.js"}]);

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
