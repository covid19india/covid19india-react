if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"b608bdc7021a8183a15ff5acd8250161","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"b608bdc7021a8183a15ff5acd8250161","url":"index.html"},{"revision":"d57b22c72d48ba1bd4438d79725324c4","url":"precache-manifest.d57b22c72d48ba1bd4438d79725324c4.js"},{"revision":"e3f009105650b1bc7cde26c7ecf00343","url":"static/css/31.93b3b32d.chunk.css"},{"revision":"3c42134b0a539deb527d838d2e701f63","url":"static/css/App.5735a40c.chunk.css"},{"revision":"6ec1a7154ab056890f1f34d37686b21c","url":"static/js/0.a94dd842.chunk.js"},{"revision":"e57c571d3c834b067574eb4b8b8b4d8e","url":"static/js/1.60b7bc57.chunk.js"},{"revision":"d36597a2f3133909d958e1d5f36adb5b","url":"static/js/2.1ff98d57.chunk.js"},{"revision":"9ad8cd946ce3d2c0a37804a8d856c277","url":"static/js/29.88947182.chunk.js"},{"revision":"e431e6b5f750a8eb1f0b0d3569f9b840","url":"static/js/3.dd20ef7c.chunk.js"},{"revision":"1abda4d62e1b6ffc6ded5ea3d8844dde","url":"static/js/30.a04a08d6.chunk.js"},{"revision":"e5bbf4267db4096de0d6b161fee8898f","url":"static/js/31.a75a44dc.chunk.js"},{"revision":"96846461c96bd00143f1ed2139a209cc","url":"static/js/32.bb4718c6.chunk.js"},{"revision":"feee1c121b49936e37a4e78bf622df08","url":"static/js/33.37070caa.chunk.js"},{"revision":"ad97d0d87aecc10d1bc848d1074ef30f","url":"static/js/34.0bd69569.chunk.js"},{"revision":"e595a69f560bd19f6f0df3cb37d84a09","url":"static/js/35.1fca2279.chunk.js"},{"revision":"677c14f1251232ff4657c0b656871958","url":"static/js/36.dc0db896.chunk.js"},{"revision":"23cfa8a4fa9c8e034be2325f829395a8","url":"static/js/37.3d773b9a.chunk.js"},{"revision":"9f3c153f054fa415f290207999025a2c","url":"static/js/38.ba644af7.chunk.js"},{"revision":"a5ac264d030a30f11dc387f5fc2489d7","url":"static/js/4.5340ee7e.chunk.js"},{"revision":"f8105ffa709c19cd64cd6269db441b90","url":"static/js/5.fbc2d19f.chunk.js"},{"revision":"dfdb3b46471794ab276d2edda5f87704","url":"static/js/6.6a237fd6.chunk.js"},{"revision":"0aa3d11355170873e99f0a0538e19a0d","url":"static/js/About.bdd00dad.chunk.js"},{"revision":"83efa291fd1399c060e5f10b01b965f5","url":"static/js/Actions.2118e570.chunk.js"},{"revision":"2c3dc595c084fd20de976b5efc7111cf","url":"static/js/App.a574f60a.chunk.js"},{"revision":"c14735e9b1d15057d46ecd09c04b6ad0","url":"static/js/Demographics.f0ff21c7.chunk.js"},{"revision":"92e62f9c8e5dddf5275bbcc67fd98125","url":"static/js/Essentials.6fc62347.chunk.js"},{"revision":"c9a1b08ce9bd80b38cb93068fb5fb5b2","url":"static/js/Footer.8d08b657.chunk.js"},{"revision":"38444485bac2698f0f24f4587421fbba","url":"static/js/Home.c40e9928.chunk.js"},{"revision":"afa5b6d778a559b4d57bf9cf4bea7d6a","url":"static/js/LanguageSwitcher.51162fab.chunk.js"},{"revision":"ba5a16d030843ca9f18d66df36a948a4","url":"static/js/Level.1978eb31.chunk.js"},{"revision":"cbf7be6c0175aaf498606969c4c1a79b","url":"static/js/main.595e0583.chunk.js"},{"revision":"dea3ba6c091e262e12a080e218537c48","url":"static/js/MapExplorer.c637a937.chunk.js"},{"revision":"2badb534a9fb65756d1b92bb45808604","url":"static/js/MapVisualizer.68e08208.chunk.js"},{"revision":"773fd15835ccc02eb2081545fd2d3d52","url":"static/js/Minigraph.46f81952.chunk.js"},{"revision":"2e489b3d3fd6597faf31748010f1925b","url":"static/js/Row.ddba89fe.chunk.js"},{"revision":"13987add03fb22014f8a43522776d7c1","url":"static/js/runtime-main.209b860a.js"},{"revision":"b0e1054f0106102875c36661c289ba26","url":"static/js/Search.0825c773.chunk.js"},{"revision":"7de0fa4599f8e3646e846cf4f9b0ffde","url":"static/js/State.de76ef8b.chunk.js"},{"revision":"88b552537c52c33f7fcfe203079f6e95","url":"static/js/Table.cb404ce2.chunk.js"},{"revision":"0605daad3a52feeca2fa497066cd8df4","url":"static/js/Timeline.0616e7ce.chunk.js"},{"revision":"8a84d3c5ba007132451f9117f76dd73a","url":"static/js/TimeSeries.c0dc0c81.chunk.js"},{"revision":"6f8ed3b83461da86d204590d1dfa543b","url":"static/js/TimeSeriesExplorer.b5b673dc.chunk.js"},{"revision":"3580b4fea25bf16ff5c45a5e917b0ffd","url":"static/js/Updates.0a74503c.chunk.js"}]);

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
