if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"5b032b89422890a75978dfe7be9751ed","url":"404.html"},{"revision":"460e2171184a144d1b778416a9389f37","url":"c3dbf9379de3f7b9fe4a.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"5b032b89422890a75978dfe7be9751ed","url":"index.html"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"686f5683b01ad85c92e958ede1d7b944","url":"static/css/22.5bf4b615.chunk.css"},{"revision":"52d1a506f485db6d972c879eb08b1b49","url":"static/js/0.d494f3d4.chunk.js"},{"revision":"9e48e6d13d19bb85a89edbb2f049d3b6","url":"static/js/1.46ea14c0.chunk.js"},{"revision":"5a79cded0170f27d294b640d289a23cc","url":"static/js/12.61c19f14.chunk.js"},{"revision":"0f6086d5d20e67ee399199fc8ca51e2e","url":"static/js/13.d2aeba24.chunk.js"},{"revision":"d32b2fbdd2aef92b369da21ebe758ab1","url":"static/js/14.a6e5800a.chunk.js"},{"revision":"fd9548b49ed7d66cd0a3040b7335ac74","url":"static/js/15.615d76e2.chunk.js"},{"revision":"12f4ac880580bb58cc3767e3236a9c0e","url":"static/js/16.1e4905ce.chunk.js"},{"revision":"5ddeea5f129b97191930908ca769d35d","url":"static/js/17.82a0f6eb.chunk.js"},{"revision":"4b08f6785171a510dfd69f2e9cd1c976","url":"static/js/18.992a34c6.chunk.js"},{"revision":"21f1c0b7068e2ac75ac83ef7d4d7ed21","url":"static/js/19.c152bed6.chunk.js"},{"revision":"f8607d311e1419b124e535c51fa7795a","url":"static/js/2.ca9a501a.chunk.js"},{"revision":"34a61c594165e5f067fb56012efeb0ab","url":"static/js/20.92e75d9d.chunk.js"},{"revision":"42d42f65a2039ddac2b62887052bb4e6","url":"static/js/21.4c51c0d4.chunk.js"},{"revision":"52ca3d3c86712ef184bb20e5487648cd","url":"static/js/22.085d585d.chunk.js"},{"revision":"c618e660e36fbef9efb51fa8730b7932","url":"static/js/23.ce9aaccf.chunk.js"},{"revision":"5955a3215c1b5ef634902e124b36e49c","url":"static/js/24.1b37bbb1.chunk.js"},{"revision":"c969c5af99476302f14b68a8ee0dd25f","url":"static/js/25.d729cc3c.chunk.js"},{"revision":"c338f42c39444b8b26c648d3257923d1","url":"static/js/26.a2380b2b.chunk.js"},{"revision":"34f0b3c2e1dd2c9052ecad6ad0fdc889","url":"static/js/27.3b134291.chunk.js"},{"revision":"71d2bd5352a75c84594fc89620a73619","url":"static/js/28.e4b33c8f.chunk.js"},{"revision":"3739ccb8323e5722ae1dc0f7fe41b980","url":"static/js/29.815e99f6.chunk.js"},{"revision":"6332c46235cdc7876f754c25abe95c74","url":"static/js/3.a6c33ad3.chunk.js"},{"revision":"760375e6635f1cdd23be985e7d6064a4","url":"static/js/30.78e5c183.chunk.js"},{"revision":"79fceb2cca4d62147b9da78f2579b071","url":"static/js/31.2f67588b.chunk.js"},{"revision":"de6d138c9d9227d3c9be39744052d44c","url":"static/js/32.cdeacdc1.chunk.js"},{"revision":"c6a6fdd2347ca7b08a91dd0f47ba40cd","url":"static/js/33.820f661f.chunk.js"},{"revision":"6dbf19a58ddde24a935df11decafa4cd","url":"static/js/34.e76010a4.chunk.js"},{"revision":"1eafda942c94d4ea420c138aeb60bbc6","url":"static/js/35.f4481158.chunk.js"},{"revision":"8070735f21463e806b58e7827e1b82c8","url":"static/js/36.f6564cae.chunk.js"},{"revision":"4ad3c0139f7cb46ef786de20296d4cd5","url":"static/js/37.e0f04879.chunk.js"},{"revision":"c2ae6a063f84b89affd2b2c84f93823c","url":"static/js/38.a3a532bb.chunk.js"},{"revision":"d1c222be99f063c73d770a34a24fe598","url":"static/js/39.b919dee5.chunk.js"},{"revision":"08c595940bd1228edb369f86cd6dc26e","url":"static/js/4.b7b6b4a3.chunk.js"},{"revision":"0a494c4a0d3fce43d253d589a06d638a","url":"static/js/40.dfe0cd39.chunk.js"},{"revision":"e522f4de7ae73e13602ce0ad58fc9422","url":"static/js/41.d1d29f0d.chunk.js"},{"revision":"346a30c2a34dc127a95a1ae482f77c0a","url":"static/js/42.6d87512e.chunk.js"},{"revision":"947a65e0765149fa7a6c5ff156fa8291","url":"static/js/43.d788da02.chunk.js"},{"revision":"64d4a678235199ef162ff60d37956357","url":"static/js/44.0688072b.chunk.js"},{"revision":"4d56c6ef5b6b8a3f45ffe19d05f91733","url":"static/js/45.36986d0c.chunk.js"},{"revision":"f68672aae915810fc2dc84dc380947d4","url":"static/js/5.738e135f.chunk.js"},{"revision":"150bb8264dd30e39f981933d2f09f870","url":"static/js/6.06a95304.chunk.js"},{"revision":"fb519183a61e959b064c54eae9b7fb5a","url":"static/js/7.99c12c0f.chunk.js"},{"revision":"61604c44cf004bf3327c9096fa141e1d","url":"static/js/8.40071967.chunk.js"},{"revision":"6b84b53b7a9c9397d655060cf872ff41","url":"static/js/9.99fe3708.chunk.js"},{"revision":"722167db1a340262c4e6b23c93336ee7","url":"static/js/main.757303ab.chunk.js"},{"revision":"c39a00755d3aed5ba03b5492fdd9362f","url":"static/js/runtime-main.871ff488.js"}]);

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
