if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"f82a9bec828de8a62e426b1576995a03","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"f82a9bec828de8a62e426b1576995a03","url":"index.html"},{"revision":"933b6291eaf62a448c1a54b6954b6265","url":"precache-manifest.933b6291eaf62a448c1a54b6954b6265.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"08723876a3d4aa285b9572753027c834","url":"static/css/main.2640b7f9.chunk.css"},{"revision":"ee359b69253dbaec00853db8ea3fa5ee","url":"static/js/0.fea98a06.chunk.js"},{"revision":"f42f200dc06013fa6b864b81901088af","url":"static/js/1.2c27ae9a.chunk.js"},{"revision":"07a3812e348308478350d325bd139a47","url":"static/js/10.8a9606a9.chunk.js"},{"revision":"327d57262a999740064371d9122d7951","url":"static/js/11.04525c8b.chunk.js"},{"revision":"84b87c120ff036afef9529ec60c9f9f5","url":"static/js/12.557b6828.chunk.js"},{"revision":"fddad0c6e98cd46c993f1e4e34431d40","url":"static/js/13.59492a7d.chunk.js"},{"revision":"a2b6dd100c9590e66b402a9819059cad","url":"static/js/2.4d2083ca.chunk.js"},{"revision":"1cf6d44aac0246452fb15192752859c2","url":"static/js/About.320f4be8.chunk.js"},{"revision":"db4654a79d795449011b071c2c2e0c1b","url":"static/js/Demographics.bcb5937b.chunk.js"},{"revision":"27c2e59d4e68fc0a6adf9e95415ea157","url":"static/js/Essentials.928b66bc.chunk.js"},{"revision":"d166b8744d42e40bc932d3fda5e126e1","url":"static/js/Home.764a2ccc.chunk.js"},{"revision":"d4e04a1865e04af2873953cc6a165710","url":"static/js/main.61825a8b.chunk.js"},{"revision":"3cb26369e93c77f6a1b7b80d9ec318db","url":"static/js/runtime-main.b9e3ede6.js"},{"revision":"1140133180d0f00388a27d340e4048dd","url":"static/js/State.b0cc1bcd.chunk.js"}]);

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
