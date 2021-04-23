if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"f936a579f922ddea966dc070cb1abf16","url":"404.html"},{"revision":"9ec9216728dbf5a2c2a2b69256419662","url":"8ae050b0e0e914e9c1ae.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"f936a579f922ddea966dc070cb1abf16","url":"index.html"},{"revision":"a66872bead1f894a79ea2488187e8ff2","url":"static/css/20.f5f9d973.chunk.css"},{"revision":"fcc57cd56186f4c4275699e22a05fbb1","url":"static/css/21.7cb311a1.chunk.css"},{"revision":"8af922273d325de54a2b7d43980ac731","url":"static/js/0.29e377a2.chunk.js"},{"revision":"69fd178e0d768cc7cd79c2da7080ba58","url":"static/js/1.173dd8fc.chunk.js"},{"revision":"6e1b70a1cce789cc6d342f0957d62d20","url":"static/js/10.a313cc0e.chunk.js"},{"revision":"b4a85ca4c978313e5362b7ebdc88d100","url":"static/js/11.58bcf696.chunk.js"},{"revision":"ba4a16e5d5a46e988fc5a5272df9eb7f","url":"static/js/12.cdf83126.chunk.js"},{"revision":"8398d87addc7f431d8891800143d2de2","url":"static/js/13.d58bb1ac.chunk.js"},{"revision":"f869a83b6b0cfd9c46541a96ffb4ea6d","url":"static/js/14.06f903c1.chunk.js"},{"revision":"5716f642484f851252a83a1598db2dc3","url":"static/js/15.e60203a1.chunk.js"},{"revision":"476b14a69869289610e616c88d879424","url":"static/js/16.382bc4a4.chunk.js"},{"revision":"b61ce3fb882d4d0601f93785196498c4","url":"static/js/17.553ee2a2.chunk.js"},{"revision":"ec54a740661c684a71742365d68e6f62","url":"static/js/18.9c6b9b72.chunk.js"},{"revision":"3d93afc151f11d17ef5c30607aeefe13","url":"static/js/19.95c8b6bf.chunk.js"},{"revision":"d05e89b9edbd81d010a4e6f62a6141e4","url":"static/js/2.2e89a0df.chunk.js"},{"revision":"9a002c4fb04c023a9dbc8dd20f577ee1","url":"static/js/20.81a85488.chunk.js"},{"revision":"47ee20481a8760d5a70fd5a3160a23c9","url":"static/js/21.27711341.chunk.js"},{"revision":"86f119602dad59112a752ea7d17b252f","url":"static/js/22.b631b54f.chunk.js"},{"revision":"3f5324c3efaaf3fba28cf9e6b1513bd3","url":"static/js/23.0b52bab9.chunk.js"},{"revision":"7b39cd8371a777a83c76fd4034218b93","url":"static/js/24.f3c098b0.chunk.js"},{"revision":"72be7632d7db92e48bcbaa16249b13dd","url":"static/js/25.425af457.chunk.js"},{"revision":"46e5b914903db5665a1aafe31ac70a7d","url":"static/js/26.9160dfa7.chunk.js"},{"revision":"3828061e0914d4f1cd55fd48589bf1fc","url":"static/js/27.5bc5cf54.chunk.js"},{"revision":"ddd7ab8666a60e7dbdfc0ee3251dd867","url":"static/js/28.3bb79183.chunk.js"},{"revision":"4d59cdb627e27d6e19eb326a45595bed","url":"static/js/29.30662c40.chunk.js"},{"revision":"4dd82e6484fdf82730d76b203e3ea6c2","url":"static/js/3.c0b1f7fb.chunk.js"},{"revision":"6f51863a6d58603401298a4ba771e3c4","url":"static/js/30.da23c2d2.chunk.js"},{"revision":"fb66279ad8e217c5cd6fda3de7f052a7","url":"static/js/31.f07bfedd.chunk.js"},{"revision":"e16ff746b959024b402b64e66a654faf","url":"static/js/32.b03cb3bc.chunk.js"},{"revision":"b42d197e5c58cc5cc5fac605baac4717","url":"static/js/33.d3eacaa9.chunk.js"},{"revision":"d525aacc81bcdf583965e6c5bd82235b","url":"static/js/34.987bacba.chunk.js"},{"revision":"b3c284c89e5329dcc7c93fc883ca30bd","url":"static/js/35.3322453e.chunk.js"},{"revision":"21a91f564c90aec1b3bf325dd6d9cbc8","url":"static/js/36.c8b7ba04.chunk.js"},{"revision":"d1584c38e211b5973f24397f612b39f1","url":"static/js/37.31bd36dc.chunk.js"},{"revision":"905926dc2b33391aae5b524d616aa1f4","url":"static/js/38.6bc1c296.chunk.js"},{"revision":"204f74cd575ec6541d6e9cf16536a142","url":"static/js/39.28218f03.chunk.js"},{"revision":"39b883c94b4c428bf1069fb209629a3a","url":"static/js/4.64bd24f5.chunk.js"},{"revision":"7eab2ecaea49c030529bbb4961120b13","url":"static/js/40.df7c8c06.chunk.js"},{"revision":"5a272e042c5085947c5b6352127b25c4","url":"static/js/41.70cb0221.chunk.js"},{"revision":"bd625118413a081d12e2734eb6947902","url":"static/js/42.79e32425.chunk.js"},{"revision":"6c2574fc37401e8ff5f58034137c9a7d","url":"static/js/43.d2ba5d4b.chunk.js"},{"revision":"15329dc92fdb8bdf4c603c10810f2c3d","url":"static/js/44.bb8b0182.chunk.js"},{"revision":"f952754496e10e7c7fabbb4eebbc7498","url":"static/js/45.e78e8157.chunk.js"},{"revision":"e9e1219b8af05db4e7fe6f22d2db4e70","url":"static/js/46.2d2273ce.chunk.js"},{"revision":"28dd55926d038cc8f84dda2eef84bd58","url":"static/js/5.455735ca.chunk.js"},{"revision":"dd3993cb4f0556435d3fc847123db2fc","url":"static/js/6.e3aa8fce.chunk.js"},{"revision":"3c47b210566d53d4965c32a93e67ed22","url":"static/js/7.78e898a3.chunk.js"},{"revision":"3e15c95dbd29980040165b8d940f2bd6","url":"static/js/main.cc314abc.chunk.js"},{"revision":"ff4e8a22fb5caba2df9531668366b95e","url":"static/js/runtime-main.72ff21db.js"}]);

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
