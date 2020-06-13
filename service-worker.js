if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"21fdf54247b87126197b35877dff59e6","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"21fdf54247b87126197b35877dff59e6","url":"index.html"},{"revision":"25deb8129077ce41fe5ba4ac0536fe32","url":"precache-manifest.25deb8129077ce41fe5ba4ac0536fe32.js"},{"revision":"546db5b682af321ded42a8b73a9aee9b","url":"static/css/30.93b3b32d.chunk.css"},{"revision":"3c42134b0a539deb527d838d2e701f63","url":"static/css/App.5735a40c.chunk.css"},{"revision":"bacd8165097909492b070e16ad6f2a69","url":"static/js/0.271001cb.chunk.js"},{"revision":"e57c571d3c834b067574eb4b8b8b4d8e","url":"static/js/1.60b7bc57.chunk.js"},{"revision":"ccbb5ba13349946b0be270d67af24b79","url":"static/js/2.1ac683d1.chunk.js"},{"revision":"df677f7aa9e88e7bab9873fa92cc5ee7","url":"static/js/28.5036c1d5.chunk.js"},{"revision":"3b68c1a2b88e1e268d28acf1e458c206","url":"static/js/29.b0c6f174.chunk.js"},{"revision":"0e10af1e9bc07d25eac04c6b894ca9e6","url":"static/js/3.69fcf068.chunk.js"},{"revision":"baa45a136df8eb53a941ce479fd06c88","url":"static/js/30.a7cbd97d.chunk.js"},{"revision":"f79098535071c2b2d190164132713caf","url":"static/js/31.4fe37585.chunk.js"},{"revision":"125bccf2e2a6d78d16bdce4f3d65b07e","url":"static/js/32.7dbd201d.chunk.js"},{"revision":"7a97379f33d6b7dfa6df15e618fa93a4","url":"static/js/33.c1777eb5.chunk.js"},{"revision":"e1eb6f42c1fda9e742d807cb2381640e","url":"static/js/34.9691754a.chunk.js"},{"revision":"e99aacfa3a88dbe6374a271ce8d8dec1","url":"static/js/35.33ec8c7c.chunk.js"},{"revision":"853f2b184c5af8dd839b5d4f41b7c8f3","url":"static/js/36.fbd90726.chunk.js"},{"revision":"4ab5e6d9094d186eb4494175a1cb5a2a","url":"static/js/37.3a32d54e.chunk.js"},{"revision":"1c181cf9d04b1392e2a36bc8cf3265e1","url":"static/js/4.bcbea2c6.chunk.js"},{"revision":"108a139f0a707241d381d68c2fcb6d03","url":"static/js/5.bec65e05.chunk.js"},{"revision":"637e111491eddc6621bec60a6ed52ad6","url":"static/js/About.21822f7c.chunk.js"},{"revision":"19128e127fb446eddec6050c4b6bdb64","url":"static/js/Actions.9e1aabef.chunk.js"},{"revision":"99229ed2729eab13875bdd60d7592f6f","url":"static/js/App.f258420a.chunk.js"},{"revision":"c124cef08cb1c21f10539ea42606c7e0","url":"static/js/Demographics.a457f94b.chunk.js"},{"revision":"cb27104d47f40aeafc6f5dcc74a95c86","url":"static/js/Essentials.3d83db6b.chunk.js"},{"revision":"fd41cbc0235489b8b3b3c897a6609089","url":"static/js/Footer.e82dee4c.chunk.js"},{"revision":"5b503ba0d6b3ec235b646e9d4c83e5bc","url":"static/js/Home.5106ed6a.chunk.js"},{"revision":"fce19b8b414d4ed3c65e9aae6090acbd","url":"static/js/LanguageSwitcher.ea672f18.chunk.js"},{"revision":"c5ab684e3b0fa92492b68934e30383e6","url":"static/js/Level.90ed86be.chunk.js"},{"revision":"8ab1a64371bececaee31537ab35f51b6","url":"static/js/main.fc9def1e.chunk.js"},{"revision":"87b9975943ebc03b8121bdeb04ccb578","url":"static/js/MapExplorer.50f8f226.chunk.js"},{"revision":"424ae7bd6a6553d4ccb47d98dd60d6d3","url":"static/js/MapVisualizer.5acf327d.chunk.js"},{"revision":"a5e499274ea6592ec40fc769b11401d1","url":"static/js/Minigraph.5c869a65.chunk.js"},{"revision":"2352e9f016225194e02962c507d128d4","url":"static/js/Row.7085934e.chunk.js"},{"revision":"05b27685a5fedd47862fe40a5f7764d0","url":"static/js/runtime-main.0f4528e2.js"},{"revision":"6967e318ae351f49d667ab97c529bf0d","url":"static/js/Search.1047bd60.chunk.js"},{"revision":"e6671bc320e30504ce0862bfd42dbacc","url":"static/js/State.2cbcb58f.chunk.js"},{"revision":"937ba09a99141a73a7736063ddfaee96","url":"static/js/Table.e51c6d0f.chunk.js"},{"revision":"d510395ed5ed628818a577e6f4c124ed","url":"static/js/Timeline.c85827c6.chunk.js"},{"revision":"58022520553e12ddc0c59c9d01072d53","url":"static/js/TimeSeries.7b91d1aa.chunk.js"},{"revision":"2e81de04305589210440d151d5c10e6b","url":"static/js/TimeSeriesExplorer.3f6f0d56.chunk.js"},{"revision":"fc318ba52151d7ca4014eb0de60d91d2","url":"static/js/Updates.dccebaa1.chunk.js"}]);

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
