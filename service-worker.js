if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"2be63e83bc974c182e5ab2885c4a63ee","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"2be63e83bc974c182e5ab2885c4a63ee","url":"index.html"},{"revision":"0f00a9e4947ac3bd4cc172e3b984754a","url":"precache-manifest.0f00a9e4947ac3bd4cc172e3b984754a.js"},{"revision":"d3ffba5b1dbe570b9cec203fbf428845","url":"static/css/24.93b3b32d.chunk.css"},{"revision":"273da534c9ee1a971f601f040c13aff8","url":"static/css/main.bfde48e0.chunk.css"},{"revision":"9553e8157b2756231a5883a8c18173a3","url":"static/js/0.23336447.chunk.js"},{"revision":"8c3f589fbc375b53630e4dddd57f9c61","url":"static/js/1.3e056089.chunk.js"},{"revision":"c9ff61c6be8b7f2d4e2d281f8070e403","url":"static/js/2.13d8db25.chunk.js"},{"revision":"1a6227f5b6342756dc09bda9fdeedd24","url":"static/js/23.b5df0f33.chunk.js"},{"revision":"3aae4b179e3016be2d05f8ee8a074e23","url":"static/js/24.625a7e70.chunk.js"},{"revision":"a4e3857f8531b259545b14c8c56681c9","url":"static/js/25.12b76290.chunk.js"},{"revision":"64636c1407daf9edaa60630dcd549462","url":"static/js/26.59e450bf.chunk.js"},{"revision":"37622e6448d85c8d5033dc4583ab176b","url":"static/js/27.5a851241.chunk.js"},{"revision":"af48c8abd53d32c5ec1145fddf012e40","url":"static/js/28.8aaef985.chunk.js"},{"revision":"e1bee4155290f8e54e163f13b4814a35","url":"static/js/29.41a454c3.chunk.js"},{"revision":"7dd1080402603c4cec5fbbee64db9d96","url":"static/js/3.c3a23507.chunk.js"},{"revision":"f150ab2d85c086b7527cd2f9a6ec052b","url":"static/js/30.485fb85c.chunk.js"},{"revision":"1e8fefe5dc0751dcaedaecc341cdd8ef","url":"static/js/31.d8774b1f.chunk.js"},{"revision":"9a9ec74fcac889218e64bffef1151764","url":"static/js/32.df2a7a5a.chunk.js"},{"revision":"e548160471fa66024a0574cd663cc258","url":"static/js/About.330348b2.chunk.js"},{"revision":"53b60b674b858e847b68925d5ee5fb70","url":"static/js/Actions.493d3b4e.chunk.js"},{"revision":"1f3efdbbd70c46fd68f3d12061709751","url":"static/js/Demographics.d1bff59d.chunk.js"},{"revision":"bf296bca070c39ccce1a5c5c9184b51a","url":"static/js/Essentials.6c60ea54.chunk.js"},{"revision":"eb5a73bc93e0c59dc8d48a765ff5b72a","url":"static/js/Footer.5c916aed.chunk.js"},{"revision":"580a85487d421332bb0ed6637df04d4b","url":"static/js/Home.159f3acd.chunk.js"},{"revision":"8a420d491973a12fbe5472851deb79a5","url":"static/js/Level.0ff2c23d.chunk.js"},{"revision":"8ec5f1c900f02451c20e1fba8af24a9a","url":"static/js/main.fd3cd455.chunk.js"},{"revision":"305b09c5eef9cedb0f6d598842f80c0f","url":"static/js/MapExplorer.7982272d.chunk.js"},{"revision":"e908f095b03575ceca680ad2bb5bed66","url":"static/js/MapVisualizer.c3507089.chunk.js"},{"revision":"c2773c11b50813ac89f63b0a2925b065","url":"static/js/Minigraph.4c0437b0.chunk.js"},{"revision":"f478abac9f4d8168c3ca780239c818e1","url":"static/js/runtime-main.4d12f777.js"},{"revision":"2af4d7a05f991e6b65085e2e3371f684","url":"static/js/Search.ae415bce.chunk.js"},{"revision":"f62b988c695a5e18e7f1370af352fafd","url":"static/js/State.2b583dde.chunk.js"},{"revision":"8f7a21c9ebd155dda8adccb73996b815","url":"static/js/Table.fdaf0b16.chunk.js"},{"revision":"b0f5532cc9032b68b3ded547555230fa","url":"static/js/Timeline.99e6c8ed.chunk.js"},{"revision":"b5bdcb8590e1e00fa32e56af7db3c958","url":"static/js/TimeSeries.efb4d27a.chunk.js"},{"revision":"1b8e67a62270a0a400f29098119c7b1b","url":"static/js/TimeSeriesExplorer.1f65fe72.chunk.js"},{"revision":"1af25344b9f3d072771997922f542e9a","url":"static/js/Updates.81b63b18.chunk.js"}]);

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
