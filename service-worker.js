if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"6e8e0a5ed6e5ebc7f76595131a1fc294","url":"404.html"},{"revision":"f421e8705f913d07193df994d3bf01fd","url":"blog/index.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"6e8e0a5ed6e5ebc7f76595131a1fc294","url":"index.html"},{"revision":"81143c8e345f8080ffa44d7a717178b9","url":"precache-manifest.81143c8e345f8080ffa44d7a717178b9.js"},{"revision":"cb740fc90ec139afa150d1df7e351d57","url":"static/css/13.93b3b32d.chunk.css"},{"revision":"2f6270eda5270d0b74ae3088a7359a70","url":"static/css/main.962af12f.chunk.css"},{"revision":"a8c031668e9c87f2faa51b48651e491c","url":"static/js/0.4a2f490b.chunk.js"},{"revision":"78fde426f8b37180462f06c26f6a3945","url":"static/js/1.486dccbc.chunk.js"},{"revision":"bd2cfeb0a03744da94d06d7bbb59ec3e","url":"static/js/11.0c8b25d5.chunk.js"},{"revision":"ef9f8c52d63913a83ca9f0a1b0ebddbe","url":"static/js/12.1af9d03f.chunk.js"},{"revision":"23ed39925e3b2dad3fbe9504a83ae727","url":"static/js/13.d0968699.chunk.js"},{"revision":"d1788d2f6892f63ddb8e04b134f2e735","url":"static/js/14.fe02c85f.chunk.js"},{"revision":"e3e68af286080260af7123e3273d5cfa","url":"static/js/15.472134a7.chunk.js"},{"revision":"d11458f714f1be72043e0e1ef34a631e","url":"static/js/2.cba78717.chunk.js"},{"revision":"e6ff5fd55243b4cdc0b77ac3183de6d7","url":"static/js/DeepDive.96edad52.chunk.js"},{"revision":"ed40dcb0cabc6fa830e8433969c1e365","url":"static/js/Essentials.6db588cd.chunk.js"},{"revision":"42740a1d408dbd595fb6eb208d483ab5","url":"static/js/FAQ.45038aa1.chunk.js"},{"revision":"99ec134198d1b5592d94151efe1dfed5","url":"static/js/Home.ab45dbdc.chunk.js"},{"revision":"b2dbadd7de2dc909bc8d1ae8cf5e7171","url":"static/js/main.69753817.chunk.js"},{"revision":"78cdb62df948063b03549b53f2e38a28","url":"static/js/PatientDB.21c4c104.chunk.js"},{"revision":"c4230722c7c45fa0d4b588b95b6b10be","url":"static/js/runtime-main.5c6849f9.js"},{"revision":"111afa7baa7cf71c315cb563de1b0003","url":"static/js/State.d8a6489d.chunk.js"}]);

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
