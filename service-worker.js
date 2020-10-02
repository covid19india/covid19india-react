if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"c5eb61ab1a6fc49cbc536d1e7d4792df","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"c5eb61ab1a6fc49cbc536d1e7d4792df","url":"index.html"},{"revision":"0d69f2e0a374cb871bf6956089308f7e","url":"precache-manifest.0d69f2e0a374cb871bf6956089308f7e.js"},{"revision":"6291c88ba967aeb92807969d2fbd83dc","url":"static/css/15.fdf98672.chunk.css"},{"revision":"7d4e1e17bdf366f877b4d150879e4be7","url":"static/js/0.4e9d56d0.chunk.js"},{"revision":"af20b6d8e0146ce1ffd95ef973bbe90e","url":"static/js/1.7668780d.chunk.js"},{"revision":"e3495469404f5f8f80ff1faa0278b3fc","url":"static/js/10.73d1f781.chunk.js"},{"revision":"465b543fe033a4e89b937007d23ea550","url":"static/js/11.501f3e7b.chunk.js"},{"revision":"84949cebe3a483af09ac9eb028642831","url":"static/js/12.81eb6e28.chunk.js"},{"revision":"096fee898e0b50ec5b4485ef2cdd4737","url":"static/js/13.96ce3f32.chunk.js"},{"revision":"769fd113d8148183b28571d5b0ccbb2f","url":"static/js/14.85529f7a.chunk.js"},{"revision":"b1b07972ce270c6f6d50240737eec0d3","url":"static/js/15.2611754a.chunk.js"},{"revision":"461c8a6e0eb1e224b258c2b64be87d2f","url":"static/js/16.34443c77.chunk.js"},{"revision":"b3776b54f6f6603f88914d42c00caeeb","url":"static/js/17.1becda0e.chunk.js"},{"revision":"bb0e4d5a18ffa27df668ef2308ef8b32","url":"static/js/18.040dbf17.chunk.js"},{"revision":"cc6cc1af065cde69c59baab689f4ae52","url":"static/js/19.e036a738.chunk.js"},{"revision":"22a0ea3abb6535a17d1d2ae3bbadffe7","url":"static/js/2.852d72c6.chunk.js"},{"revision":"485eeca78284c9fc9e6ec2e11f608605","url":"static/js/20.6d123ae2.chunk.js"},{"revision":"b06a8f482e27e6700cb982d9505d06a2","url":"static/js/21.0941bf20.chunk.js"},{"revision":"e60c36cc1f844c45192e42d96f18b27f","url":"static/js/22.b9a592e5.chunk.js"},{"revision":"676bd54a1ff19304fb2fba8480c27c4c","url":"static/js/23.4a2cdf1d.chunk.js"},{"revision":"e6518c718693d6c3790bac281c91c3c2","url":"static/js/24.4d29f8a6.chunk.js"},{"revision":"a7244ce6b0c8cbd69c297623e2d502dc","url":"static/js/25.a2da128c.chunk.js"},{"revision":"737597fe3c73934b5a82b5b11435b025","url":"static/js/26.e1a03c12.chunk.js"},{"revision":"8e432f0ff5d2c36f8eb68501b84c2e9b","url":"static/js/27.69cfbb4c.chunk.js"},{"revision":"ec7ac5a97ca2f1c9763b6be44474ccc2","url":"static/js/28.d8264a26.chunk.js"},{"revision":"11a3a8e2702fc75b5ce45dcf0774ab36","url":"static/js/29.bf273d4f.chunk.js"},{"revision":"a0ac6d90f855433940989d7fbf6d851f","url":"static/js/3.6fe98d4a.chunk.js"},{"revision":"4938159954f3f414b08dd4fa21fd39bb","url":"static/js/30.7de3b43c.chunk.js"},{"revision":"fd5c0d30cc0261a33cf7b24604a2779d","url":"static/js/31.6dfed760.chunk.js"},{"revision":"e58c6815fae22774d45300ef82117297","url":"static/js/32.056a1905.chunk.js"},{"revision":"35dfa43183a246eec43d22ea1c75e53c","url":"static/js/33.2ffe7b1b.chunk.js"},{"revision":"7fced34e40c83954a359d691cd9ef88a","url":"static/js/34.da30d313.chunk.js"},{"revision":"58bdeea088d942330b64e13a3544af81","url":"static/js/35.895416dd.chunk.js"},{"revision":"03c6a9649ad0a0df49ad8a196feffc68","url":"static/js/36.c9f0b327.chunk.js"},{"revision":"b14616e5e282d44f2ba3581eb4633128","url":"static/js/37.e517f828.chunk.js"},{"revision":"c5789db7bfb7b01aa3a7534ef570e89e","url":"static/js/4.89d765e8.chunk.js"},{"revision":"a2dd7702cc8797a5895a81e8cc53f551","url":"static/js/5.518f6213.chunk.js"},{"revision":"509b650a9fa949f3e58fde698b562a44","url":"static/js/6.8bc5acb1.chunk.js"},{"revision":"51e6a16528190fdb331ba0ec6152c44e","url":"static/js/9.042cb669.chunk.js"},{"revision":"b4b127b582d2a1e0d9cf780c665973a1","url":"static/js/main.8185c4fa.chunk.js"},{"revision":"349248d4243a937b1c6fccad2764cbf5","url":"static/js/runtime-main.3750cd8e.js"}]);

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
