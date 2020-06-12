if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"7a7846e2140c8c1802fd31ef62f14e4b","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"7a7846e2140c8c1802fd31ef62f14e4b","url":"index.html"},{"revision":"9c156cb9499ef527065b74326d58a8f2","url":"precache-manifest.9c156cb9499ef527065b74326d58a8f2.js"},{"revision":"77f14df0cb908f7fffb18e9c694f546d","url":"static/css/26.93b3b32d.chunk.css"},{"revision":"bf5377cd900a43d208fbf9f1a6c5ce36","url":"static/css/main.e67ca9f4.chunk.css"},{"revision":"13537ce5dfd6703f33a6ca762ed1cb36","url":"static/js/0.6c4de5a6.chunk.js"},{"revision":"c91a3e9033c39ae742fb350f258afa93","url":"static/js/1.a76cbe00.chunk.js"},{"revision":"63adf10fb3bbe48f4b1111887689e865","url":"static/js/2.750ed5ba.chunk.js"},{"revision":"861c9fe7ab30edcfd0330b656fbb2a1a","url":"static/js/25.8d742271.chunk.js"},{"revision":"40c472284209f839f705ba766e420c9f","url":"static/js/26.fb4572bd.chunk.js"},{"revision":"2d35522b792ed00b4f3e9a6348fa21ec","url":"static/js/27.bfda649d.chunk.js"},{"revision":"d9f65508d3e113d0ac1cdf102dceb5ae","url":"static/js/28.2474c606.chunk.js"},{"revision":"1baa4248a2f36272e8e7ee4f2ada0b82","url":"static/js/29.003cd122.chunk.js"},{"revision":"21c5b9462bcb096f45eeb883e982451c","url":"static/js/3.63c04861.chunk.js"},{"revision":"10686c726e5167cbedd1b3eca1e3ac0f","url":"static/js/30.11b4f3f2.chunk.js"},{"revision":"8bb5b41967ac23f82a87a3e6850b5783","url":"static/js/31.5cfce8f2.chunk.js"},{"revision":"3c7d770cdd748fe35b0f1abd1f07121d","url":"static/js/32.a1e22aff.chunk.js"},{"revision":"84bfaa095323041b9538998dcd5d6c97","url":"static/js/4.d8515323.chunk.js"},{"revision":"c2bc7516de5b87e00cb3271ecc8fe503","url":"static/js/About.7f023779.chunk.js"},{"revision":"d191eabc5a373b99b3fd17169a03a7dd","url":"static/js/Actions.9188c65a.chunk.js"},{"revision":"9526ffc3b3f83caca93217a2f0b45312","url":"static/js/Demographics.a35599f4.chunk.js"},{"revision":"65bfd8e193ecd400444784af032656b3","url":"static/js/Essentials.f9422ea9.chunk.js"},{"revision":"e0664f0b167892cbf9ce3a26a937702d","url":"static/js/Footer.72a6ace2.chunk.js"},{"revision":"7225e3b1722ec218ac41500a216e6f42","url":"static/js/Home.3144d0dd.chunk.js"},{"revision":"f3d9455c6d829714f4109aa9a8531a86","url":"static/js/Level.ef842c9b.chunk.js"},{"revision":"ab3288189e15b524361dcc6e81f804e0","url":"static/js/main.b4bbfad4.chunk.js"},{"revision":"e2cfde24f2407a568040606de56c1742","url":"static/js/MapExplorer.43fcb784.chunk.js"},{"revision":"825051be62737db94f562758a7cb5148","url":"static/js/MapVisualizer.ce55c72f.chunk.js"},{"revision":"3522ed3788a7189c510862f192641375","url":"static/js/Minigraph.78a9069c.chunk.js"},{"revision":"862ac551ad8c87d5962d603ecf910c9a","url":"static/js/Row.c3de3a12.chunk.js"},{"revision":"8ed742030ac1b0a7ac520f2bae137004","url":"static/js/runtime-main.38ecd763.js"},{"revision":"12246ad85e77d4099992ac559a6b1ec1","url":"static/js/Search.32d7eaf4.chunk.js"},{"revision":"bc2c8d1895e8945a0495cad4f6e2e3a0","url":"static/js/State.c53a4970.chunk.js"},{"revision":"5696503153a13bda9859342858fe1b3f","url":"static/js/Table.47509e53.chunk.js"},{"revision":"dd775df3dc6ae186c648b1a1e3737fd7","url":"static/js/Timeline.78bf7528.chunk.js"},{"revision":"c4337494534b986d23b481b16b5a3735","url":"static/js/TimeSeries.8e7f869b.chunk.js"},{"revision":"4388549ba971ed56db639a844753757e","url":"static/js/TimeSeriesExplorer.0094dae3.chunk.js"},{"revision":"540719ac19df018eaee25cead89ddc6f","url":"static/js/Updates.483bc46c.chunk.js"}]);

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
