if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"0300a9f249f47d5acac37baac36d14f6","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"0300a9f249f47d5acac37baac36d14f6","url":"index.html"},{"revision":"0f9216a91d135d132f9786917be660fc","url":"precache-manifest.0f9216a91d135d132f9786917be660fc.js"},{"revision":"066be3764a0039f712e46a97368d9df8","url":"static/css/15.5984a436.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"0224c594a502ca0e049163fbcf8caef8","url":"static/js/1.c2fe6bb1.chunk.js"},{"revision":"6026ddc1d557a61276a473d8e0d18a61","url":"static/js/10.b7bc28b0.chunk.js"},{"revision":"74d4e80a237d307b75d8453b2fedef5b","url":"static/js/11.121b6a9d.chunk.js"},{"revision":"b20e1476f73b9af7e15109bf7fc9224e","url":"static/js/12.208f4f63.chunk.js"},{"revision":"60216c13c530b873113a3de463281522","url":"static/js/13.5e3616df.chunk.js"},{"revision":"341c876dae46c04ef18f25a734a2c68b","url":"static/js/14.67c1a283.chunk.js"},{"revision":"8a034c7eaea65ee62e073095f72e8896","url":"static/js/15.6f81f91d.chunk.js"},{"revision":"46b88d89a360eece98e214c7ccb31002","url":"static/js/16.b345c956.chunk.js"},{"revision":"5fea56d339cb2407c4211cd041f6ab01","url":"static/js/17.1a77698a.chunk.js"},{"revision":"1129e94f42d0178dd3606d68a174afcf","url":"static/js/18.7efb03a0.chunk.js"},{"revision":"79bdd5aeb83df92bc4b406fdc2a7bdc5","url":"static/js/19.72b95a3b.chunk.js"},{"revision":"929766316bff7cb97f49fe9855305cf3","url":"static/js/2.79557938.chunk.js"},{"revision":"c8f5c37d92d0b53bd140aee680d82253","url":"static/js/20.c9de81af.chunk.js"},{"revision":"ec1624b05f3ed32adda039ef79c75bb6","url":"static/js/21.ac88c14e.chunk.js"},{"revision":"d1b111d9a8bae23bb83e733571a00e80","url":"static/js/22.c636121a.chunk.js"},{"revision":"e9e4f1d00e97c84540ca621472b3f115","url":"static/js/23.dae4ae17.chunk.js"},{"revision":"8f88eaf9942bc825a79e83d7d164dea0","url":"static/js/24.6bcb68b2.chunk.js"},{"revision":"0fb0d83a05f7a46491edcbe37f98646a","url":"static/js/25.517fe8dd.chunk.js"},{"revision":"435b589ac8186c37ae26a5842c219ee7","url":"static/js/26.8ffcfb57.chunk.js"},{"revision":"c600c136dc19770f2d9f08bc7a9f7a7c","url":"static/js/27.4e87095c.chunk.js"},{"revision":"4bce21ea4cfcb7368ae0468537ef90c6","url":"static/js/28.b2fef015.chunk.js"},{"revision":"ff778f96ef295270afa20507fd255307","url":"static/js/29.8d49f6ce.chunk.js"},{"revision":"8b83c1ae622fa1051755ded11fd3e002","url":"static/js/3.00d71476.chunk.js"},{"revision":"6c2d9f5c80364b9f604776d290ba3ed8","url":"static/js/30.7e4bcc72.chunk.js"},{"revision":"215d513b8f7782f57b8d199fbf107aa7","url":"static/js/31.56eea8c7.chunk.js"},{"revision":"5c8dcc8924a9504ebb2efb2b54f229e9","url":"static/js/32.bf9f2ea0.chunk.js"},{"revision":"5019a2a0ed3754c38842807cfa2170c6","url":"static/js/33.22627683.chunk.js"},{"revision":"935632ed894e29418c534ebfa31bc0ba","url":"static/js/34.ef29caf5.chunk.js"},{"revision":"8cf7f3ca8bc08d80fb2440bfdac8f3d2","url":"static/js/35.8fdf4c63.chunk.js"},{"revision":"56a481d2d4db7f29055859ad0005b2a6","url":"static/js/36.e4a413d8.chunk.js"},{"revision":"e8bef842b3965dd87c849aeeab8248e8","url":"static/js/37.8efb149d.chunk.js"},{"revision":"5a67c2642e294dd22ca13e478d5e3011","url":"static/js/38.8c44612f.chunk.js"},{"revision":"381456f2ebf33d4f1b13f3c06364562d","url":"static/js/4.89db10ad.chunk.js"},{"revision":"9db0ab99aff4ba29bf0fd5c8714cf13d","url":"static/js/5.01939ca1.chunk.js"},{"revision":"b57a9b1404c3ccc808a97f37bb34f1c9","url":"static/js/6.6d195c44.chunk.js"},{"revision":"1d3811691a72967ac63214f2fd552c65","url":"static/js/9.7d7e4748.chunk.js"},{"revision":"e5532939d6d0c9056fb2b889986f9f04","url":"static/js/main.0d211e2d.chunk.js"},{"revision":"f47e30462c67a4ffd6cba7fb51b03ac4","url":"static/js/runtime-main.00b11114.js"}]);

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
