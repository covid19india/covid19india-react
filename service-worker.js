if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"d56f6422cf3ff338c52cc78970ff9d47","url":"404.html"},{"revision":"9ec9216728dbf5a2c2a2b69256419662","url":"8ae050b0e0e914e9c1ae.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"d56f6422cf3ff338c52cc78970ff9d47","url":"index.html"},{"revision":"a66872bead1f894a79ea2488187e8ff2","url":"static/css/20.f5f9d973.chunk.css"},{"revision":"2c27cadd3e3757f7c2ade259abe98f42","url":"static/css/21.87b21559.chunk.css"},{"revision":"22ea705ea2289e3c1ace8628d92640c6","url":"static/js/0.baf580dc.chunk.js"},{"revision":"69fd178e0d768cc7cd79c2da7080ba58","url":"static/js/1.173dd8fc.chunk.js"},{"revision":"6e1b70a1cce789cc6d342f0957d62d20","url":"static/js/10.a313cc0e.chunk.js"},{"revision":"b4a85ca4c978313e5362b7ebdc88d100","url":"static/js/11.58bcf696.chunk.js"},{"revision":"4cda364643d6f051d0edceb6662fa7a4","url":"static/js/12.19b28234.chunk.js"},{"revision":"2fe0b98eca6951f92cf70b935137ea5c","url":"static/js/13.223e5d72.chunk.js"},{"revision":"d924c73fc9db3c1c7f282e00b719f136","url":"static/js/14.56eb67d9.chunk.js"},{"revision":"7077c051c347a7b41df537c5a73a6d5f","url":"static/js/15.078e32a0.chunk.js"},{"revision":"07c06ed73baf6b98fdc3594affece5fd","url":"static/js/16.6fce6ade.chunk.js"},{"revision":"3055adc81ca3cc606a96959bc62a3d27","url":"static/js/17.0e956de9.chunk.js"},{"revision":"a1e2a1054640b923307c679d4377d15b","url":"static/js/18.7856f968.chunk.js"},{"revision":"1d8fb0b4d4940d650bfb0a29b9049098","url":"static/js/19.c5470e98.chunk.js"},{"revision":"dc83222c76cef8513e4d43e2df1502f9","url":"static/js/2.0ffb00f7.chunk.js"},{"revision":"8f3fed8f0bd362283222c07b8cacc3f6","url":"static/js/20.018119dc.chunk.js"},{"revision":"4ff0326dbd6550bf25884ee3e95f57f7","url":"static/js/21.31f04735.chunk.js"},{"revision":"0f1cdc5b438d7083c69398c359356062","url":"static/js/22.c76d53db.chunk.js"},{"revision":"d8a19042832f21245f0909691e6ba97b","url":"static/js/23.153d5299.chunk.js"},{"revision":"7d2eac8bacc6c955319787a374ffc612","url":"static/js/24.2576beba.chunk.js"},{"revision":"c8d92ec9cee4859f2484a2ce4d8ca7a3","url":"static/js/25.cf90707b.chunk.js"},{"revision":"f4e83a17561df7ce6e1d8c1539c1ef4b","url":"static/js/26.982542d2.chunk.js"},{"revision":"c5ad692bd5296a04b1789bc80b3095e4","url":"static/js/27.58cfc1d4.chunk.js"},{"revision":"90258254ca65ce4bad0ef827420733f5","url":"static/js/28.ccf30326.chunk.js"},{"revision":"7d50f45cb9781dd407c2ff0dd137b085","url":"static/js/29.a0d86f9a.chunk.js"},{"revision":"4dd82e6484fdf82730d76b203e3ea6c2","url":"static/js/3.c0b1f7fb.chunk.js"},{"revision":"cbfe4a5c2a658089e40a84d9713c9d11","url":"static/js/30.d764054b.chunk.js"},{"revision":"d20353dca020d183e8953652aeb11340","url":"static/js/31.b330fa28.chunk.js"},{"revision":"63a99f551a5daf717e6c24e5314119de","url":"static/js/32.22168364.chunk.js"},{"revision":"b9138d83c346b41ad4e96cf04217ee25","url":"static/js/33.778715e1.chunk.js"},{"revision":"b667d8a05b47f6f1972003d87c64236c","url":"static/js/34.7eed0e3c.chunk.js"},{"revision":"1806baabcc4935b05204e489135f5372","url":"static/js/35.a94659ed.chunk.js"},{"revision":"86405a14a9bd17b56dc119daa9bb73bc","url":"static/js/36.1d61ba8d.chunk.js"},{"revision":"3f664ec3a19cb5448baf0a8ab376a8d3","url":"static/js/37.40d701eb.chunk.js"},{"revision":"7672c03ab8c142171feb92f6480a88a8","url":"static/js/38.e06dd333.chunk.js"},{"revision":"a0282a66d871d2126f7d4c5e5610b030","url":"static/js/39.ba3da673.chunk.js"},{"revision":"945daa7fe4ffbf5338808dba96f76175","url":"static/js/4.0b49e78b.chunk.js"},{"revision":"2331b36b2905d4e1fb566da970a94c49","url":"static/js/40.80103ca6.chunk.js"},{"revision":"4a154a5cc6bc80cf14b59c0aab32198b","url":"static/js/41.718d27e7.chunk.js"},{"revision":"7bf6a7ac5fd0c07a40746d324e17f18b","url":"static/js/42.852bdb10.chunk.js"},{"revision":"fe43148fb6f522df50e0dbbe633762ea","url":"static/js/43.0c273e9e.chunk.js"},{"revision":"e5f7c38347ed703a3cb79d8af775437b","url":"static/js/44.b916d8ab.chunk.js"},{"revision":"62b02c11015f45d602e333387f9be99a","url":"static/js/45.dac38308.chunk.js"},{"revision":"d9d02fd6b6cb33654791ed315d4ba82a","url":"static/js/46.b112d0a3.chunk.js"},{"revision":"c9cadbd6d75df8f4dd95289e6db54777","url":"static/js/47.663843e2.chunk.js"},{"revision":"601e09cbda02f543fbcc6266ab89256e","url":"static/js/5.160c1da6.chunk.js"},{"revision":"3e59d8b37708bb14383da4b99e0d304d","url":"static/js/6.d67d40f6.chunk.js"},{"revision":"3c47b210566d53d4965c32a93e67ed22","url":"static/js/7.78e898a3.chunk.js"},{"revision":"5620c3a98a6d0bd1f47fa2415ea3b2e5","url":"static/js/main.e9f8fb52.chunk.js"},{"revision":"0c19f38a81a6246222ab41a9e7f11d65","url":"static/js/runtime-main.38bad66e.js"}]);

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
