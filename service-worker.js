if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"c460e41c538c262bf7d290e9e0ac3ced","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"c460e41c538c262bf7d290e9e0ac3ced","url":"index.html"},{"revision":"a7657d8a2e97a2340f1f4dd7b2a0486c","url":"precache-manifest.a7657d8a2e97a2340f1f4dd7b2a0486c.js"},{"revision":"1a37163dc3e9ceb2f821371a7778637b","url":"static/css/15.2fec2875.chunk.css"},{"revision":"2db43e5be126642f6cf732309ba5cd65","url":"static/js/0.94311ccd.chunk.js"},{"revision":"e5acb7ca1febc6bd7bf22aab7365dad8","url":"static/js/1.f44128db.chunk.js"},{"revision":"37571bf90c1ca33c0c5c921745a29996","url":"static/js/10.d2b4e77f.chunk.js"},{"revision":"4a1657183a4ab7c4e0a00a4e10c0d6a2","url":"static/js/11.f1479fc9.chunk.js"},{"revision":"9f06da3ba863706b3796a64e96536db4","url":"static/js/12.3316941c.chunk.js"},{"revision":"3a8b28932ad1a2ef7973d6d2e3c57252","url":"static/js/13.4a5b9722.chunk.js"},{"revision":"b809b50cb468692c914fe659c1f47f4c","url":"static/js/14.502dbf62.chunk.js"},{"revision":"5ee2f532bcf44a5a74f5be78f779448e","url":"static/js/15.b6f239e8.chunk.js"},{"revision":"46b88d89a360eece98e214c7ccb31002","url":"static/js/16.b345c956.chunk.js"},{"revision":"5fea56d339cb2407c4211cd041f6ab01","url":"static/js/17.1a77698a.chunk.js"},{"revision":"f65f6c3c02c43a4a47ce97664a477672","url":"static/js/18.25f03c14.chunk.js"},{"revision":"ba6eb97f663b4bcf8dfa6818f42c8a1f","url":"static/js/19.b74a0351.chunk.js"},{"revision":"1a356325e59ba5b9687d8f43934a2a3a","url":"static/js/2.cbc3c73d.chunk.js"},{"revision":"f2df655a4ab48d770f5dde714607e57d","url":"static/js/20.661435e1.chunk.js"},{"revision":"b702cd21205e1225667a7a49dded8dc3","url":"static/js/21.ef2ba6ca.chunk.js"},{"revision":"46154b92316f2e3fb230cc5e78968b2b","url":"static/js/22.7c5f0aac.chunk.js"},{"revision":"04384a114a30fa7b0180b11a2e7a5ef0","url":"static/js/23.c7b8048e.chunk.js"},{"revision":"cedba7eaac0364276715fba023395793","url":"static/js/24.6993c385.chunk.js"},{"revision":"af6c14002f3ad8b0e2c0d1345246fbc3","url":"static/js/25.89f57819.chunk.js"},{"revision":"e811d0d959ce1e60caf6ebb340eb8da5","url":"static/js/26.5afee6a8.chunk.js"},{"revision":"ef19479375f43c55ba6d3a9b765e67dd","url":"static/js/27.269f97cc.chunk.js"},{"revision":"2f3ae9a1bc01e90d51110fca00828dcc","url":"static/js/28.3662efd1.chunk.js"},{"revision":"3b2bd03260f2bf6df8072941b786bfc2","url":"static/js/29.8cce78ce.chunk.js"},{"revision":"8b83c1ae622fa1051755ded11fd3e002","url":"static/js/3.00d71476.chunk.js"},{"revision":"a6f8c548cfe489e29293342c5e2674ce","url":"static/js/30.1c86a9e4.chunk.js"},{"revision":"206b69393e4c95315c004d1a27302c16","url":"static/js/31.2eb00a01.chunk.js"},{"revision":"2f1613ff524ba53bcb20962558774b56","url":"static/js/32.a04ff26b.chunk.js"},{"revision":"b2472a5f938e00ae1134de49eacb2923","url":"static/js/33.3a395d1a.chunk.js"},{"revision":"3697240fea37fb7ca5f01e2dd953fa9d","url":"static/js/34.4136a8b8.chunk.js"},{"revision":"359a7ef737e3eacb2e0239c4db6ac01f","url":"static/js/35.8ace9d08.chunk.js"},{"revision":"9ad1309d9c5332844df4bd985953dfe3","url":"static/js/36.e25576dd.chunk.js"},{"revision":"e8bef842b3965dd87c849aeeab8248e8","url":"static/js/37.8efb149d.chunk.js"},{"revision":"5a67c2642e294dd22ca13e478d5e3011","url":"static/js/38.8c44612f.chunk.js"},{"revision":"6932f6886b36f315bda5bbd36f74d56b","url":"static/js/4.0034d404.chunk.js"},{"revision":"bad49870d21b73f1799f205631ed92ca","url":"static/js/5.68fbab0a.chunk.js"},{"revision":"cb995d9a60f912a3e4aa898c60cfb077","url":"static/js/6.48b95c7e.chunk.js"},{"revision":"1d3811691a72967ac63214f2fd552c65","url":"static/js/9.7d7e4748.chunk.js"},{"revision":"4aa26bbdcdeb5d5b0b851a04625e66e0","url":"static/js/main.82a605e6.chunk.js"},{"revision":"ecfe4bb6eafab998483f646ee05913c8","url":"static/js/runtime-main.9cf66123.js"}]);

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
