if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"4e7425201dce4063f07224d1454f81ee","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"4e7425201dce4063f07224d1454f81ee","url":"index.html"},{"revision":"70a4ba680f7ed373b070f93d29bc1535","url":"precache-manifest.70a4ba680f7ed373b070f93d29bc1535.js"},{"revision":"77f14df0cb908f7fffb18e9c694f546d","url":"static/css/26.93b3b32d.chunk.css"},{"revision":"8713f47a174d5d297cbd2b594a5fb8f0","url":"static/css/main.58c974ca.chunk.css"},{"revision":"ab84e9e3d76136449734f20a0541ab07","url":"static/js/0.e58f4b54.chunk.js"},{"revision":"6e55a8fbf8f23cc702be00913f2f2934","url":"static/js/1.ad21f058.chunk.js"},{"revision":"f444c49aa5f41f1c8fe410a7797b1680","url":"static/js/2.9053ce52.chunk.js"},{"revision":"e3e37601d42974551f76ab7a1504ad48","url":"static/js/25.280d8529.chunk.js"},{"revision":"a7f9defab0c60111b17bb430a3658380","url":"static/js/26.820decf5.chunk.js"},{"revision":"31653739874be6d8a58ac0a315b9f1e9","url":"static/js/27.96658d44.chunk.js"},{"revision":"727cd8c93d60f4a26f2f3592da35a804","url":"static/js/28.ebcfec11.chunk.js"},{"revision":"3bd420e2720729df32ce59247e0b16bc","url":"static/js/29.0e79d309.chunk.js"},{"revision":"260854e47e6844a7115a9c530a439b84","url":"static/js/3.fe2905a7.chunk.js"},{"revision":"cdd3607039a9571c7e8bee0c99eda8dd","url":"static/js/30.c53b3633.chunk.js"},{"revision":"8298510802941b32429f1384ae209109","url":"static/js/31.73c2efac.chunk.js"},{"revision":"2cb7ac77640dfba4e6f11842c96c2049","url":"static/js/32.0704c4a1.chunk.js"},{"revision":"b15c2bac3b381dcc65a60bef4fb59928","url":"static/js/4.4932bbde.chunk.js"},{"revision":"a6718373e8117961a4bba7bca5ca82c5","url":"static/js/About.e0941735.chunk.js"},{"revision":"77ae41703d047a8e4aec81e311030bcf","url":"static/js/Actions.9c2409bd.chunk.js"},{"revision":"1d292462f3a255f34b994aed36acbc6b","url":"static/js/Demographics.d9877157.chunk.js"},{"revision":"83a83599e21ec8d6088bd6be94fb5824","url":"static/js/Essentials.e992d3eb.chunk.js"},{"revision":"d3eb6a01cefec5d345c39687e4475aa3","url":"static/js/Footer.e7a94099.chunk.js"},{"revision":"4f7bcabd5b7361862b5a88ebcc1f256f","url":"static/js/Home.8e5f39e3.chunk.js"},{"revision":"5c845e58b298b9986a5a2621a95373ae","url":"static/js/Level.e83115b3.chunk.js"},{"revision":"96bdd74827c702d80f1371c637d49027","url":"static/js/main.17aa9abb.chunk.js"},{"revision":"31a095604c80d71bcd20042ab1e0365a","url":"static/js/MapExplorer.2a79e272.chunk.js"},{"revision":"824f886584c820b72d4f6d9f1cf73614","url":"static/js/MapVisualizer.2ba499f6.chunk.js"},{"revision":"b7a87a34b80fe227c4da0babf8d3741f","url":"static/js/Minigraph.0bb28aa2.chunk.js"},{"revision":"a0eba2f2c8915f61e072272fb2e473b1","url":"static/js/Row.86763ebf.chunk.js"},{"revision":"8247d110376d10693a4d4976df3427bc","url":"static/js/runtime-main.05babb1e.js"},{"revision":"b52bb46f4cb3c197a91b4f66abaf2d2b","url":"static/js/Search.8e7409d5.chunk.js"},{"revision":"1687c8d4d8c9019a56fa8eb8480ad563","url":"static/js/State.864cd49d.chunk.js"},{"revision":"bba4a20ae48fa555693fd4511d099fbd","url":"static/js/Table.8bed96db.chunk.js"},{"revision":"0506788f3985fd1360c58d5f7cffef94","url":"static/js/Timeline.86c0a657.chunk.js"},{"revision":"2bcddd154abd29c8d29eb595881241fd","url":"static/js/TimeSeries.5f46cdb3.chunk.js"},{"revision":"8d80be83bf5bf5cbd2ecb991de1a4f0a","url":"static/js/TimeSeriesExplorer.b64ad061.chunk.js"},{"revision":"b882810af62cdbcc009d69e7367effc5","url":"static/js/Updates.f60e5ba2.chunk.js"}]);

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
