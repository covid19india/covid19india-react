if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"5e2fba84de9d20a5fb7390bd5322df2c","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"5e2fba84de9d20a5fb7390bd5322df2c","url":"index.html"},{"revision":"eccf0ca81be03c50771bac28183f75a3","url":"precache-manifest.eccf0ca81be03c50771bac28183f75a3.js"},{"revision":"527244866960116b04a59d90e69611c4","url":"static/css/15.9943a6a2.chunk.css"},{"revision":"de8951ef1bdac7058e0053a0b2d818b5","url":"static/js/0.c0b2ded7.chunk.js"},{"revision":"d2c20e8a325d4000e9f54890d51b0d24","url":"static/js/1.24e11262.chunk.js"},{"revision":"3fd8091db53f1c49700bf225c7f84748","url":"static/js/10.645a1f07.chunk.js"},{"revision":"d83401ffacedb37edb0de4916289b253","url":"static/js/11.90a6b844.chunk.js"},{"revision":"99f1b71a24778f354b151e087d322b94","url":"static/js/12.c5f6d40e.chunk.js"},{"revision":"f25a523153daa26d0de272feddf2443c","url":"static/js/13.adee154f.chunk.js"},{"revision":"d3b5bc69c6a63bfab3ca48b77926c3ac","url":"static/js/14.8231a83e.chunk.js"},{"revision":"255519213834c54df5406248d37030f3","url":"static/js/15.0fa51708.chunk.js"},{"revision":"5510509b7ae3cfa9268e98d938d9d852","url":"static/js/16.fb536591.chunk.js"},{"revision":"808433a7c45a38d2f402d9f76aa24043","url":"static/js/17.6adca5f9.chunk.js"},{"revision":"fdc331a3d6c33a53f6c1b7ca3d8b3d94","url":"static/js/18.a247a5c8.chunk.js"},{"revision":"c09604a43b449fb2b811f978fa25d0a9","url":"static/js/19.d09c16da.chunk.js"},{"revision":"95f21619ba2a6e890228e8966d4a8f8e","url":"static/js/2.cd32a1ca.chunk.js"},{"revision":"abc9581bc217a1411548f80b785f936c","url":"static/js/20.99bfabff.chunk.js"},{"revision":"c941baeb4ee8b3e4bde6d2251ac1c0c2","url":"static/js/21.d8481585.chunk.js"},{"revision":"83561e444e9f818eff3f1522b520f5d1","url":"static/js/22.5073446c.chunk.js"},{"revision":"2c7b148e88094115afd1adb1b5fa28a3","url":"static/js/23.2d3e4d4f.chunk.js"},{"revision":"92c0d4dc1968688b4bdfd82b47d4eff3","url":"static/js/24.02cc563e.chunk.js"},{"revision":"51c2c9da450726d1c5b2fbdfc5e116de","url":"static/js/25.acab1679.chunk.js"},{"revision":"b9a132b8df44efe47d3564a750aaf733","url":"static/js/26.1cef9b3e.chunk.js"},{"revision":"8a279c0b9a20d2221c031032a4d4f663","url":"static/js/27.7518e40e.chunk.js"},{"revision":"6374ba754509fd3c477c07c27f24c75e","url":"static/js/28.72ba9105.chunk.js"},{"revision":"7f465056c599c5a6415cb290f5058619","url":"static/js/29.5285b1f3.chunk.js"},{"revision":"8b83c1ae622fa1051755ded11fd3e002","url":"static/js/3.00d71476.chunk.js"},{"revision":"c9af6a8ae4e32ea3c0bd7acab78a6600","url":"static/js/30.76a509fb.chunk.js"},{"revision":"6c39153a1707145fe288340b89f1b26a","url":"static/js/31.548199c8.chunk.js"},{"revision":"80a6707fc118197a2cc5b96af80dc168","url":"static/js/32.e00b2947.chunk.js"},{"revision":"851bed6a47d2c8c4bda26cb56996158b","url":"static/js/33.351fe563.chunk.js"},{"revision":"4f30d48284a8a78b1f69f47d118a3036","url":"static/js/34.8c0821ee.chunk.js"},{"revision":"a9f792b6d62f06f92fa048910f3aa8bd","url":"static/js/35.2c920d82.chunk.js"},{"revision":"b4967b78e7ea05331a0afc9dcebf426a","url":"static/js/36.87588777.chunk.js"},{"revision":"e8bef842b3965dd87c849aeeab8248e8","url":"static/js/37.8efb149d.chunk.js"},{"revision":"5a67c2642e294dd22ca13e478d5e3011","url":"static/js/38.8c44612f.chunk.js"},{"revision":"bcf29c1b05fcfe1ef4b0d909d0134314","url":"static/js/4.5a5909f2.chunk.js"},{"revision":"ea7ed5f12e3776017e405481d77616bf","url":"static/js/5.1b228b6e.chunk.js"},{"revision":"d7a80d2523436a80b03e8064821ae254","url":"static/js/6.b24b43ce.chunk.js"},{"revision":"1d3811691a72967ac63214f2fd552c65","url":"static/js/9.7d7e4748.chunk.js"},{"revision":"2a0b21c3003fe3906d66f8884e4547fa","url":"static/js/main.18de5066.chunk.js"},{"revision":"4582ad06077efe7951cd235f17550924","url":"static/js/runtime-main.0b8acc7f.js"}]);

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
