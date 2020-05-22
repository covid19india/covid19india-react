if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"47171fda5071d82babfc053172f5e12d","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"47171fda5071d82babfc053172f5e12d","url":"index.html"},{"revision":"dc219a4d69c693f85ffede6289f2a9f7","url":"precache-manifest.dc219a4d69c693f85ffede6289f2a9f7.js"},{"revision":"cb740fc90ec139afa150d1df7e351d57","url":"static/css/13.93b3b32d.chunk.css"},{"revision":"2f6270eda5270d0b74ae3088a7359a70","url":"static/css/main.962af12f.chunk.css"},{"revision":"a8c031668e9c87f2faa51b48651e491c","url":"static/js/0.4a2f490b.chunk.js"},{"revision":"78fde426f8b37180462f06c26f6a3945","url":"static/js/1.486dccbc.chunk.js"},{"revision":"8fa2a9ba3759ebddcf4650d809306cef","url":"static/js/11.e84d8fba.chunk.js"},{"revision":"ef9f8c52d63913a83ca9f0a1b0ebddbe","url":"static/js/12.1af9d03f.chunk.js"},{"revision":"23ed39925e3b2dad3fbe9504a83ae727","url":"static/js/13.d0968699.chunk.js"},{"revision":"7093efa5f9e2470ecd5aeb4dfec20d2c","url":"static/js/14.de4b6a56.chunk.js"},{"revision":"e3e68af286080260af7123e3273d5cfa","url":"static/js/15.472134a7.chunk.js"},{"revision":"d11458f714f1be72043e0e1ef34a631e","url":"static/js/2.cba78717.chunk.js"},{"revision":"e6ff5fd55243b4cdc0b77ac3183de6d7","url":"static/js/DeepDive.96edad52.chunk.js"},{"revision":"1d27a51998c3e48644f05037e34108d7","url":"static/js/Essentials.8d9c3656.chunk.js"},{"revision":"42740a1d408dbd595fb6eb208d483ab5","url":"static/js/FAQ.45038aa1.chunk.js"},{"revision":"f7c5ba1df125e5d4d3281993807998f3","url":"static/js/Home.87c77e00.chunk.js"},{"revision":"162388d1fcc0247d7bd53e5a74c3a08e","url":"static/js/main.825eadd6.chunk.js"},{"revision":"3b2a83a6a407c6714238f2b0a36abb7c","url":"static/js/PatientDB.d5aee580.chunk.js"},{"revision":"076ff348fcc5a1b095ac3f27d21cf41d","url":"static/js/runtime-main.78bdd22f.js"},{"revision":"f85f904cfb463cfe371b7024984ad35f","url":"static/js/State.2cf229a1.chunk.js"}]);

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
