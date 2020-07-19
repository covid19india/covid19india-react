if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"b5074f42f3b79b484b63c89d96bf63d3","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"b5074f42f3b79b484b63c89d96bf63d3","url":"index.html"},{"revision":"3990a9b210d5a9162ebe09b0468f0301","url":"precache-manifest.3990a9b210d5a9162ebe09b0468f0301.js"},{"revision":"8d0af6cf691b1aeaee7e080c1d173973","url":"static/css/15.71f41249.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"f63b940dbe981252284db5b9dc5099ee","url":"static/js/1.acf1d400.chunk.js"},{"revision":"b9f7aa0a9f5a96c23773cab2225408bd","url":"static/js/10.4ef4852b.chunk.js"},{"revision":"f484187cda7678908939704039ae05be","url":"static/js/11.fb6bc401.chunk.js"},{"revision":"0ccc6b6bffb308093f2e893536755272","url":"static/js/12.31fbf4e0.chunk.js"},{"revision":"6f4d8b04187a6eab29f25c1e91dbfb84","url":"static/js/13.e5ddc4f9.chunk.js"},{"revision":"56362cdcb86c578c72a321846dcc9270","url":"static/js/14.c2852e69.chunk.js"},{"revision":"cf29218727882bea2742ae18471349ad","url":"static/js/15.4c0814ee.chunk.js"},{"revision":"0c45315d04950e3d92dac2fc1878a9b8","url":"static/js/16.99d52123.chunk.js"},{"revision":"ad8fc80eef9003e41f50b1b4b12f38a3","url":"static/js/17.4bc67a3d.chunk.js"},{"revision":"4df19b1d049ff4c76972113e17cd4568","url":"static/js/18.aef9b99b.chunk.js"},{"revision":"7e1e94738fad973bd2142b64ddc0b6c6","url":"static/js/19.fca51128.chunk.js"},{"revision":"aa9f274767ca2d6d5bf98a2090147ca4","url":"static/js/2.cfc3a494.chunk.js"},{"revision":"b68c5db15e46a438cdf93480db22fcf4","url":"static/js/20.bbb0308c.chunk.js"},{"revision":"0e4c90dd1be0ceb3a4c806c8b3aa5cf5","url":"static/js/21.0812fe16.chunk.js"},{"revision":"ea14648897d2aae87b82e163e86c6555","url":"static/js/22.663c1f5e.chunk.js"},{"revision":"a3b74a6dd18da82db996f14765616649","url":"static/js/23.5ee6a52b.chunk.js"},{"revision":"d89218fada412c9a82cd53d1ab0840a2","url":"static/js/24.3e7c54ba.chunk.js"},{"revision":"0212230e390fba8e09c19e0739892145","url":"static/js/25.be631150.chunk.js"},{"revision":"d773c00582232f86e6dbc5dbe8bf1843","url":"static/js/26.cdca1b72.chunk.js"},{"revision":"3679f50f8f1d7b4ee795cce035b847fe","url":"static/js/27.abde1acb.chunk.js"},{"revision":"6e3ae1914e6f3d9ed4a55fa278233040","url":"static/js/28.fee8f7ab.chunk.js"},{"revision":"9621e286ae54dae8a84708895bceda62","url":"static/js/29.bebe4ea4.chunk.js"},{"revision":"876e6f1e574bcfcfb0135dc935ba930e","url":"static/js/3.ddd77e9f.chunk.js"},{"revision":"39c5a187f2d4871e88090d6ab4576874","url":"static/js/30.cb821047.chunk.js"},{"revision":"0c8b0313e167c12cfe09b3e13a39cbc9","url":"static/js/31.61b5aed5.chunk.js"},{"revision":"0d38379f96f8cd73e9c01e8b78055b58","url":"static/js/32.f5fa7380.chunk.js"},{"revision":"9f9636d7a5da915e12c220750f2a0b65","url":"static/js/33.b8eb7432.chunk.js"},{"revision":"233d10f22990fa8eb1b0a098de2d2ef4","url":"static/js/34.d8b885d6.chunk.js"},{"revision":"7eb8ad5303e04a11358683375e6be94d","url":"static/js/35.9842fb28.chunk.js"},{"revision":"dad82626a7f90f11feea024a95d970e1","url":"static/js/36.de21ebbb.chunk.js"},{"revision":"e8bef842b3965dd87c849aeeab8248e8","url":"static/js/37.8efb149d.chunk.js"},{"revision":"5a67c2642e294dd22ca13e478d5e3011","url":"static/js/38.8c44612f.chunk.js"},{"revision":"a9ba86496a7b34bc74b7112529806eb2","url":"static/js/4.aecd5c43.chunk.js"},{"revision":"a31a0b3dc01030a17e3ebfa1ea24f43e","url":"static/js/5.5705e195.chunk.js"},{"revision":"83d4cf645e7b95fb9588268ab3f2fb55","url":"static/js/6.a52a60d8.chunk.js"},{"revision":"1d3811691a72967ac63214f2fd552c65","url":"static/js/9.7d7e4748.chunk.js"},{"revision":"3217c8fbd3675baf0db7b81f7858cab3","url":"static/js/main.55262a31.chunk.js"},{"revision":"ec3ecefaf560102da76670928288061d","url":"static/js/runtime-main.784d5836.js"}]);

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
