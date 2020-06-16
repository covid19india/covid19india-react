if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"c724695e58e35af3562519be1173c5e4","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"c724695e58e35af3562519be1173c5e4","url":"index.html"},{"revision":"ec4ae8f32c96ab0efb11239ea25e24f9","url":"precache-manifest.ec4ae8f32c96ab0efb11239ea25e24f9.js"},{"revision":"010abe3d2b1ba45c96937ceb6cdcc1ab","url":"static/css/29.93b3b32d.chunk.css"},{"revision":"e1d6797096ff2cefb9330b879fd5ece5","url":"static/css/App.74867c80.chunk.css"},{"revision":"1fe100f2778206fa49692514b9f91ffd","url":"static/js/0.e500e23f.chunk.js"},{"revision":"24ab3c44a0e46a6dc2f25a573fb16b53","url":"static/js/1.90be350c.chunk.js"},{"revision":"080a725dbb13d4817a7ae6acc6f895ae","url":"static/js/2.a2c8dd38.chunk.js"},{"revision":"11d0ace9147d762455e2ec0a862c898c","url":"static/js/27.7ee360d0.chunk.js"},{"revision":"3ca05712a58a91bc38097a96f39e4f40","url":"static/js/28.0591e583.chunk.js"},{"revision":"a2626ef3d6c024b809e970417f304e34","url":"static/js/29.ceb78f1c.chunk.js"},{"revision":"cbbfaed17026fcec1483941ed2dcac71","url":"static/js/3.52097b7d.chunk.js"},{"revision":"6a41393ff738d64f8ac4d10c5bb88fbb","url":"static/js/30.c773fb64.chunk.js"},{"revision":"1570efba1aa7328f75ec95585fc7deba","url":"static/js/31.d06474a9.chunk.js"},{"revision":"f484f6bbcf869e95acad74c9e419d892","url":"static/js/32.520927b7.chunk.js"},{"revision":"0d245f5ba3d3ffbd974da75583272334","url":"static/js/33.3bdd8e36.chunk.js"},{"revision":"886944cc452d3451d60bfe500dab8eb9","url":"static/js/34.803969f1.chunk.js"},{"revision":"55c1214c6aae96f841ad39f5e59b1e0e","url":"static/js/35.7b24e164.chunk.js"},{"revision":"db87fe744d1a80bf7e02cca5aa05c66f","url":"static/js/36.9550ecb1.chunk.js"},{"revision":"4e61ddd3d2ac7c8fb8087ed64fe8220c","url":"static/js/37.4f905d7a.chunk.js"},{"revision":"635d2b139e458f7d29625c72015c92cc","url":"static/js/38.0066e254.chunk.js"},{"revision":"753cba77f44971f14422bb4cdee36c21","url":"static/js/4.e557980b.chunk.js"},{"revision":"c3c9970d182ccb31efa6051bd2ed6eb1","url":"static/js/About.168b3ae3.chunk.js"},{"revision":"20370bacae0424325bdebea847f447fa","url":"static/js/Actions.8cc4c5c7.chunk.js"},{"revision":"4f739231c4f7d7139b980b61caaed140","url":"static/js/App.01d64961.chunk.js"},{"revision":"4f20838e1e804690ddbc8580899a2e2a","url":"static/js/Demographics.5f59402e.chunk.js"},{"revision":"7831c526cde31a1189df95c9cf048222","url":"static/js/Essentials.12fa09a0.chunk.js"},{"revision":"dddb8b5f702e4f1a8bfdcb019038f061","url":"static/js/Footer.8f3a2b84.chunk.js"},{"revision":"e3cb39f23d4d5e8b8cfb20c7ef28310b","url":"static/js/Home.1bbcfa5d.chunk.js"},{"revision":"9f2f993084081c910c64e16ef43c40cf","url":"static/js/LanguageSwitcher.9f89f1e9.chunk.js"},{"revision":"716e442aad58f49684a481fd3cb45393","url":"static/js/Level.f10615c6.chunk.js"},{"revision":"ebe089c6ab5b57837067d0a2470cdca2","url":"static/js/main.33ef82a4.chunk.js"},{"revision":"e63fae1a4f31fe05d7ce6dbdfa290825","url":"static/js/MapExplorer.d63c2c73.chunk.js"},{"revision":"e617bdc43372abb671676581d3570209","url":"static/js/MapVisualizer.66022ad5.chunk.js"},{"revision":"c07f87602b5f3d4ba20c5496026cfb27","url":"static/js/Minigraph.8d2122f0.chunk.js"},{"revision":"16ee6fb898a6be6b34ea32b8a6b895dc","url":"static/js/Row.706c1083.chunk.js"},{"revision":"d392f3407b4ab2c9abbc460eea06154a","url":"static/js/runtime-main.f2555038.js"},{"revision":"4ee92dd0387f01639cb10d1bad5c466c","url":"static/js/Search.23fb5ae7.chunk.js"},{"revision":"a704d83c7377981c8bfa81d4b789f726","url":"static/js/State.2bc71002.chunk.js"},{"revision":"794b8e262df656db15911b4ae8a6ae7b","url":"static/js/Table.d364d6d4.chunk.js"},{"revision":"ed699ab29272a4fd8da2870355eb867f","url":"static/js/Timeline.ad846002.chunk.js"},{"revision":"b308162e9bc9fdf7bfa587f7704caa12","url":"static/js/TimeSeries.d26cabef.chunk.js"},{"revision":"d65555d3a355ca21faf3a2a5767a8531","url":"static/js/TimeSeriesExplorer.e5b95456.chunk.js"},{"revision":"960f173a48819b453100500b7b2afbb2","url":"static/js/Updates.df1b2204.chunk.js"}]);

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
