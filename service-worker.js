if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"6a345cc63ea0f8c0677ae4ff4af063c9","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"6a345cc63ea0f8c0677ae4ff4af063c9","url":"index.html"},{"revision":"11d993a3f220f3752a2de9da94246ee5","url":"precache-manifest.11d993a3f220f3752a2de9da94246ee5.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"d8e94ff3ae41c9745f4431e693057e88","url":"static/css/main.90d439f1.chunk.css"},{"revision":"3b290dc8390843a4cbd32d51a20a1063","url":"static/js/0.5e912a68.chunk.js"},{"revision":"327d02a8361f399d1c4a26cabcb739ae","url":"static/js/1.8a473b0c.chunk.js"},{"revision":"bc6518b4feacb03bd7e9b7d5e4c99ad0","url":"static/js/10.df31250d.chunk.js"},{"revision":"1033844f28634519e5a301597638c5e1","url":"static/js/11.f343ddad.chunk.js"},{"revision":"a7ccdb840f992ae3c5f69f3540419d6c","url":"static/js/12.22968508.chunk.js"},{"revision":"e589e243e05b3f3c4146d8ec7d33b23b","url":"static/js/13.26076852.chunk.js"},{"revision":"77dd99578b8154c3d8c98301b9040ed4","url":"static/js/2.d596e359.chunk.js"},{"revision":"70207e8178abd8c62b228b8f995c25eb","url":"static/js/About.19126428.chunk.js"},{"revision":"66b1b27da2ad0073414372dd1cebbdee","url":"static/js/Demographics.37105321.chunk.js"},{"revision":"f4c81d82b56ad74d20424dfeec9abba5","url":"static/js/Essentials.9a76f1ef.chunk.js"},{"revision":"c6e63a9b247da647087dd91264ecea8a","url":"static/js/Home.f18db81f.chunk.js"},{"revision":"ec1c482bee7907752fa8a5fc82251a3b","url":"static/js/main.11ad37d7.chunk.js"},{"revision":"6e487e24afc4fc391b2b6e18f64209f7","url":"static/js/runtime-main.59d70956.js"},{"revision":"85916fb474a321a3cdd2c395a9ce9733","url":"static/js/State.360fb689.chunk.js"}]);

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
