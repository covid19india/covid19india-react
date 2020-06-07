if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"442577b56e830d678cb55c2d662593ac","url":"404.html"},{"revision":"d7e31151dcd23401679d39e494612d6f","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"442577b56e830d678cb55c2d662593ac","url":"index.html"},{"revision":"490f3a212a783b647de9f031eb797f18","url":"precache-manifest.490f3a212a783b647de9f031eb797f18.js"},{"revision":"8bf9f4a04624df685c16c7a85dabc32b","url":"static/css/11.93b3b32d.chunk.css"},{"revision":"1ab416fac31936ef1cc7a4eba63bda5a","url":"static/css/main.9d7fcf3d.chunk.css"},{"revision":"87825cd3541c9865a1a9d4f7d81386db","url":"static/js/0.53884abb.chunk.js"},{"revision":"7b1d6050bf3a8e97a93d9472bdfd0370","url":"static/js/1.06749cb2.chunk.js"},{"revision":"c779e05db795b3ce89b64a16e55c8c6d","url":"static/js/10.f8629b82.chunk.js"},{"revision":"1033844f28634519e5a301597638c5e1","url":"static/js/11.f343ddad.chunk.js"},{"revision":"a7ccdb840f992ae3c5f69f3540419d6c","url":"static/js/12.22968508.chunk.js"},{"revision":"e589e243e05b3f3c4146d8ec7d33b23b","url":"static/js/13.26076852.chunk.js"},{"revision":"77dd99578b8154c3d8c98301b9040ed4","url":"static/js/2.d596e359.chunk.js"},{"revision":"70207e8178abd8c62b228b8f995c25eb","url":"static/js/About.19126428.chunk.js"},{"revision":"a96545b48bca8a86d40e16174ef14987","url":"static/js/Demographics.fc11c277.chunk.js"},{"revision":"f4c81d82b56ad74d20424dfeec9abba5","url":"static/js/Essentials.9a76f1ef.chunk.js"},{"revision":"972833c2a8aa5fcbef2ccba3e4da4397","url":"static/js/Home.99b786e5.chunk.js"},{"revision":"a503ef3266dfde38be049507e49c8b04","url":"static/js/main.a1ebd6c4.chunk.js"},{"revision":"29c55b1cb097b2f8657461226bd547d8","url":"static/js/runtime-main.c912977f.js"},{"revision":"dfa9c899b93a2f54f8057c92d2c96d7b","url":"static/js/State.2a46ee3b.chunk.js"}]);

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
