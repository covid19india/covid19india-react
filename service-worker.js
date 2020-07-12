if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"104301b8b06aea2823db49134f50d2f9","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"104301b8b06aea2823db49134f50d2f9","url":"index.html"},{"revision":"f4670f07973dc84a8205d01c0ba529ba","url":"precache-manifest.f4670f07973dc84a8205d01c0ba529ba.js"},{"revision":"1b3afc31cdcf28e497fccfb4fdd45ef5","url":"static/css/14.e57cbd41.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"27df6fb615a0b2edec3e409a4bcd6680","url":"static/js/1.678a9836.chunk.js"},{"revision":"02d1225c1e757b3e084c45b9cd0e8cd4","url":"static/js/10.e64151ed.chunk.js"},{"revision":"14f0d06aae9d9afe906fa87d970e737e","url":"static/js/11.7bc31ae1.chunk.js"},{"revision":"cfbbdfe6578be6b2f83e42039c61e168","url":"static/js/12.fb11eea8.chunk.js"},{"revision":"cd3e2ee5081dd981d80bc4ef2dc15e21","url":"static/js/13.ae77a819.chunk.js"},{"revision":"08ef328c7958d131415d06194ba887ac","url":"static/js/14.203079fc.chunk.js"},{"revision":"8c910ff4737463bb00ee9c42a7bd53ef","url":"static/js/15.ce5ad806.chunk.js"},{"revision":"4a53e0ffc30eca13757e629146496da5","url":"static/js/16.a6d7bd99.chunk.js"},{"revision":"1e639a191d97707c43ad5b8d401a707f","url":"static/js/17.ef9512c4.chunk.js"},{"revision":"f7e326ec955723b146e23dcdf887c5c0","url":"static/js/18.64b6ee89.chunk.js"},{"revision":"fded99d92f54586e1d32b5f01e3d0539","url":"static/js/19.685437c4.chunk.js"},{"revision":"82513090b3068c14b27334a9056d0b35","url":"static/js/2.589f327e.chunk.js"},{"revision":"8f6b06f81713d75a33cf94b4437d6fc4","url":"static/js/20.1ead4a97.chunk.js"},{"revision":"e37a5cb720b0e68ecf45b38245224a33","url":"static/js/21.32c3df86.chunk.js"},{"revision":"ca85a6dbbd00405919c7a707319ab021","url":"static/js/22.d3a28fe2.chunk.js"},{"revision":"a3197841091b6878edb663cf05ebdbd8","url":"static/js/23.40cad018.chunk.js"},{"revision":"8c25c4841b66beae7429f5900814c6e8","url":"static/js/24.04ad22bc.chunk.js"},{"revision":"4cc30dda1292f594031f9410239047e3","url":"static/js/25.0b8bb888.chunk.js"},{"revision":"5acb0b398d3b3b0ac6affce1bd852e9c","url":"static/js/26.ec138e4e.chunk.js"},{"revision":"69c32e2b6f4a1d55d34aebe476efea62","url":"static/js/27.a12dfe18.chunk.js"},{"revision":"e0ae822cd8b0df73381133954c9b7ceb","url":"static/js/28.9d4d32f5.chunk.js"},{"revision":"e25938fdf84ffc95d729cbba0517ac09","url":"static/js/29.ffd07d21.chunk.js"},{"revision":"0715bf75556c0f0c8734791916afa580","url":"static/js/3.b199b006.chunk.js"},{"revision":"0a49fc22931414c1e53b64e026a33872","url":"static/js/30.f1b5bc79.chunk.js"},{"revision":"707eb945969c87e818aefdad55e7fc41","url":"static/js/31.61411a94.chunk.js"},{"revision":"3fb4032644f7dd7d2897628491c507e7","url":"static/js/32.cb66ead0.chunk.js"},{"revision":"33aee01750ddd5827efe32e2140fb409","url":"static/js/33.a0051caa.chunk.js"},{"revision":"e2604d48f5843edf06a86d6cd9c85e62","url":"static/js/34.7e06c347.chunk.js"},{"revision":"cb3db8fc9c617d4cdb5fb1435edbb9cb","url":"static/js/35.39d3d0ee.chunk.js"},{"revision":"6f89ebf533595eb70c95fdf776ac09d6","url":"static/js/36.000ca18d.chunk.js"},{"revision":"79c78876e3df0ce99c9816210e82361d","url":"static/js/37.704b5923.chunk.js"},{"revision":"defde356784fae89d9f8b118f300adef","url":"static/js/38.cba9529b.chunk.js"},{"revision":"1a3cdda0bb40fb791e31ecb25b3cc481","url":"static/js/4.93ac8e85.chunk.js"},{"revision":"6e999b9457c4c853253b7c52b417c37d","url":"static/js/7.ac643e4d.chunk.js"},{"revision":"2d1097bd18b1fdf37929e4285486c245","url":"static/js/8.e5daa465.chunk.js"},{"revision":"2c6c30247a31523b9fd15aca2527b32f","url":"static/js/9.a4e97b4c.chunk.js"},{"revision":"3a0e120802b4e85a931b8500395f2d86","url":"static/js/main.78ee9a02.chunk.js"},{"revision":"764cac115235614dd5b22d851a6501fd","url":"static/js/runtime-main.36a020a1.js"}]);

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
