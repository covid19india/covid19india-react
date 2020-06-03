if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"40b5d772ce883455bb86acc1d3fc7e40","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"40b5d772ce883455bb86acc1d3fc7e40","url":"index.html"},{"revision":"feb88bd8ea3477e92d0320961f00b67b","url":"precache-manifest.feb88bd8ea3477e92d0320961f00b67b.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"1ab416fac31936ef1cc7a4eba63bda5a","url":"static/css/main.9d7fcf3d.chunk.css"},{"revision":"c00e3c893660106acb0d7ef94a01c325","url":"static/js/0.6b427113.chunk.js"},{"revision":"83c6c9e003374a3d572438f907d1fd0a","url":"static/js/1.52aecde1.chunk.js"},{"revision":"c779e05db795b3ce89b64a16e55c8c6d","url":"static/js/10.f8629b82.chunk.js"},{"revision":"24ccf5eaa7359b44a3c0bbf42dfa5e61","url":"static/js/11.a7d3d8c8.chunk.js"},{"revision":"a7ccdb840f992ae3c5f69f3540419d6c","url":"static/js/12.22968508.chunk.js"},{"revision":"e589e243e05b3f3c4146d8ec7d33b23b","url":"static/js/13.26076852.chunk.js"},{"revision":"77dd99578b8154c3d8c98301b9040ed4","url":"static/js/2.d596e359.chunk.js"},{"revision":"70207e8178abd8c62b228b8f995c25eb","url":"static/js/About.19126428.chunk.js"},{"revision":"a96545b48bca8a86d40e16174ef14987","url":"static/js/Demographics.fc11c277.chunk.js"},{"revision":"5eaec77ff01568b89778a69b7793f3e2","url":"static/js/Essentials.c2b1f9f7.chunk.js"},{"revision":"c0aaa0297e4a6b3deb051777ca1201e1","url":"static/js/Home.ce318f68.chunk.js"},{"revision":"269305d335cf78b76ac4d43de42243b6","url":"static/js/main.3c58d049.chunk.js"},{"revision":"f2866e223a90b7414c0d24034cfb6d46","url":"static/js/runtime-main.2d2334c2.js"},{"revision":"60e5435e029d8499bef08d7316ac7a96","url":"static/js/State.6cae29c1.chunk.js"}]);

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
