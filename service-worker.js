if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"8554365825c539013102d43109d4591b","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"8554365825c539013102d43109d4591b","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"a66872bead1f894a79ea2488187e8ff2","url":"static/css/20.f5f9d973.chunk.css"},{"revision":"d1fea059a7d4619eb68464962efbb1c3","url":"static/css/21.6b7c6f41.chunk.css"},{"revision":"855f45b3c48ca8e7dcfd8e1e1aff99b6","url":"static/js/0.c3d61b1a.chunk.js"},{"revision":"356a4093608c02188144fa79195e3c8f","url":"static/js/1.c4970738.chunk.js"},{"revision":"a4394f5f373e1fa3274b91a5317f8e51","url":"static/js/11.07adafef.chunk.js"},{"revision":"5251700521685d02222a39641eba2bd6","url":"static/js/12.c1c5bd6b.chunk.js"},{"revision":"7f404157eb7d34871e5f767825b3c641","url":"static/js/13.cff73070.chunk.js"},{"revision":"a8e839e77c96ede6a154764f7d96b9ff","url":"static/js/14.81bc9981.chunk.js"},{"revision":"067a595b2f68d162510238a87137a2f6","url":"static/js/15.36be325f.chunk.js"},{"revision":"b2d5e3bd0d8c6f12dce3399196d0b0df","url":"static/js/16.2bcd5391.chunk.js"},{"revision":"360fa15ec1f6e140284b6266a1fa2e86","url":"static/js/17.c9f35fe8.chunk.js"},{"revision":"29355ef30f58eabfd554243f6a512d72","url":"static/js/18.bc557440.chunk.js"},{"revision":"d77b8edf3ccb326fe061e3d6c67dad32","url":"static/js/19.8a70f3ec.chunk.js"},{"revision":"28d175fe98b2689705e5397f97d35b9d","url":"static/js/2.f9aa831f.chunk.js"},{"revision":"4fce798198929e261919bb89db74512b","url":"static/js/20.a7c4b148.chunk.js"},{"revision":"fa508cc15c56b2a5ec9cb00cf36cd406","url":"static/js/21.bd0968f6.chunk.js"},{"revision":"a7e3be41ac2a0dfeff62b42f5e4e8e09","url":"static/js/22.8b937923.chunk.js"},{"revision":"f21383d2a88cbc5b272b6c390d217f72","url":"static/js/23.ab77afaf.chunk.js"},{"revision":"0e951f1ed76df2fa4e57d9279b73b2c0","url":"static/js/24.24676357.chunk.js"},{"revision":"e2751260fa76180dfdc3b6d6d31a67ce","url":"static/js/25.7d689a9d.chunk.js"},{"revision":"60bb40aa5490626870f012e0f886995b","url":"static/js/26.2d654393.chunk.js"},{"revision":"364482a2a86a7e400ddb5f89afb033c3","url":"static/js/27.04ffc2c6.chunk.js"},{"revision":"7d25f0d58e01d7e91a04ba4569db7ae6","url":"static/js/28.e022a9da.chunk.js"},{"revision":"eefd17dcb0c7bf8a5eeb149dc96fe237","url":"static/js/29.98390906.chunk.js"},{"revision":"adac6341cfab2bce8688982cc2ceb452","url":"static/js/3.eaaa9554.chunk.js"},{"revision":"02162413d92a194c954753bb8fccb5d2","url":"static/js/30.d79c7de1.chunk.js"},{"revision":"0ca8ced123bf72e04c9acfe28e65536a","url":"static/js/31.c73e1c96.chunk.js"},{"revision":"2dc73791d636cacea58337beba9a8145","url":"static/js/32.07e4efc2.chunk.js"},{"revision":"2b5c2bbba0cf38d843228a41236cba00","url":"static/js/33.5e04479f.chunk.js"},{"revision":"20b21f93d546e9cde06c176a1eb16e32","url":"static/js/34.e77c71d6.chunk.js"},{"revision":"fe619c604c0fe9ad27930605526f7d0b","url":"static/js/35.d1d96d96.chunk.js"},{"revision":"b08f6e4abf27ea4724bfc01822d0bde8","url":"static/js/36.99c604d3.chunk.js"},{"revision":"75d9a2436c3006db20fa917624ce8fd3","url":"static/js/37.5af55f1a.chunk.js"},{"revision":"6bacc5c8f5c42992bd7b38cc9cdf60df","url":"static/js/38.2c5f7b3b.chunk.js"},{"revision":"8c736655710baae3b447408390a873d5","url":"static/js/39.15560796.chunk.js"},{"revision":"ee5c40884bc7eaa640bc9e98052806d4","url":"static/js/4.452a024e.chunk.js"},{"revision":"099b6f9dda2fbc72111943afb34c2a8b","url":"static/js/40.effbda50.chunk.js"},{"revision":"313693049542e10c85154e2641d8172f","url":"static/js/41.c6176cfb.chunk.js"},{"revision":"e76fdbda64ef32e4b8493d02156343ac","url":"static/js/42.58dc0cb9.chunk.js"},{"revision":"37816be2cf6aa53702cf2182199e36d5","url":"static/js/43.af97f012.chunk.js"},{"revision":"bea7c9792e15f44e4ea0817473530e20","url":"static/js/44.feee9846.chunk.js"},{"revision":"e2244c4ddc9f3353a5f9d0d44e77dbb1","url":"static/js/45.f690369b.chunk.js"},{"revision":"6b442d173b758d85e1599e6916119fde","url":"static/js/46.30c5a56c.chunk.js"},{"revision":"568d1b6bd17ff704f42d34b081a516e3","url":"static/js/47.1b8ed84c.chunk.js"},{"revision":"bcb7e46c13b48aad13e8860b25b51efd","url":"static/js/48.905cd870.chunk.js"},{"revision":"96a3f5f0507f641435546e6fcaaec6ae","url":"static/js/5.14663d66.chunk.js"},{"revision":"53df1680f22fb2336a62b1431d5dbdd4","url":"static/js/6.ab7d1edf.chunk.js"},{"revision":"0a1929664e87a0d507e33a4e439b9f1b","url":"static/js/7.b65ecb34.chunk.js"},{"revision":"3a8c1551dd6ba7e842ecd3bfafb7a937","url":"static/js/8.cdf4fd9d.chunk.js"},{"revision":"e35a757ea1aafa1a1bef116500cf9d83","url":"static/js/main.ae404468.chunk.js"},{"revision":"311abafe1e6b9aa1f97b8e5c01b4db54","url":"static/js/runtime-main.17837bf1.js"}]);

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
