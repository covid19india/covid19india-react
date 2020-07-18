if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"a6339279a1d4b1c7d59f1263ac37f3c7","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"a6339279a1d4b1c7d59f1263ac37f3c7","url":"index.html"},{"revision":"d4a49fc6a4436135b2dfc55cb8d7a9c0","url":"precache-manifest.d4a49fc6a4436135b2dfc55cb8d7a9c0.js"},{"revision":"3f417263c258eb9842008455c190fb64","url":"static/css/14.4e425e1c.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"6e609ee289c323935d349378327e59e0","url":"static/js/1.6ed7fd02.chunk.js"},{"revision":"ee5bed2e582080654a98b6001b366a22","url":"static/js/10.9413ecc1.chunk.js"},{"revision":"30a77d0cd0b6cdb3e34a29ff4a9756f1","url":"static/js/11.3e9ad84c.chunk.js"},{"revision":"3382ca0d4dc2ec243b5e5132ec6ab58f","url":"static/js/12.83ca96bf.chunk.js"},{"revision":"c1079f727e83a82e33cce95698c3b576","url":"static/js/13.c69aafd1.chunk.js"},{"revision":"bb24706e35602baec1a071f3db4d5cfb","url":"static/js/14.fa0857ae.chunk.js"},{"revision":"6fe1442fe27709ec76dfde4add93c3fb","url":"static/js/15.412e7d20.chunk.js"},{"revision":"53e3b995c7720c8cbb0b93239b208a21","url":"static/js/16.192f369d.chunk.js"},{"revision":"ad8fc80eef9003e41f50b1b4b12f38a3","url":"static/js/17.4bc67a3d.chunk.js"},{"revision":"091856df48083ac07815514fce4aaab0","url":"static/js/18.2b5fda6b.chunk.js"},{"revision":"0164f8cf8a355b8f6fbe485b42585040","url":"static/js/19.ee178e8c.chunk.js"},{"revision":"0e8820e624dcbe13de18371e10e3c2e1","url":"static/js/2.4f7e7ce9.chunk.js"},{"revision":"af6ad19ec945deb6d8a3b9373f897be7","url":"static/js/20.45f8f568.chunk.js"},{"revision":"77e22036843be6b83fb6b8f2f7831e1a","url":"static/js/21.73895a1c.chunk.js"},{"revision":"1075dfdca8707ac7030cae35c68f197e","url":"static/js/22.04d95d21.chunk.js"},{"revision":"bd3dc96af044a85b7409b426f115d104","url":"static/js/23.517896f3.chunk.js"},{"revision":"aaf8ae8c1bafb02bc7c361e1edb877fc","url":"static/js/24.abdf1511.chunk.js"},{"revision":"65ffb62138e0955c15e2994fb0fdcfaa","url":"static/js/25.71981d53.chunk.js"},{"revision":"251c4bc29134ba9f3ee5ea67dd4fde4f","url":"static/js/26.3be20f77.chunk.js"},{"revision":"4e7a4c27896a60a7a291a6a835b0e207","url":"static/js/27.835dd3c8.chunk.js"},{"revision":"5eae37a9078b1dcbe7caf6fb76c6f962","url":"static/js/28.399f9c42.chunk.js"},{"revision":"fe76bca7f373f06966ba025502d3082f","url":"static/js/29.768caa20.chunk.js"},{"revision":"35b5f94dfa80bcb63ad512b1306acec7","url":"static/js/3.9ec522c9.chunk.js"},{"revision":"84abbe46bc2846c337a0230243099e62","url":"static/js/30.7dd5e4ab.chunk.js"},{"revision":"d62997ad8b7712ee94ae87acb764566f","url":"static/js/31.b45795e6.chunk.js"},{"revision":"8a807553de8d087ab6be87ca013781e3","url":"static/js/32.9dbfa8d8.chunk.js"},{"revision":"06914e9b7b855a821fae54b8d0cf8b7f","url":"static/js/33.aa09704e.chunk.js"},{"revision":"360ba8e0266f52b174dedcaf66ed1d1d","url":"static/js/34.ecc4b20e.chunk.js"},{"revision":"c73c79a7b4fa0ab93fe553156fb0c7ae","url":"static/js/35.cf76c37f.chunk.js"},{"revision":"4e1df4083305cfa286daeb7844a3a06d","url":"static/js/36.05e5af8e.chunk.js"},{"revision":"e8bef842b3965dd87c849aeeab8248e8","url":"static/js/37.8efb149d.chunk.js"},{"revision":"5a67c2642e294dd22ca13e478d5e3011","url":"static/js/38.8c44612f.chunk.js"},{"revision":"aa9512d2e0beef73df4906cb50cafeeb","url":"static/js/4.1387fa07.chunk.js"},{"revision":"f30d00aecd6af1233ec3a74e40e48e4e","url":"static/js/5.5673e4ae.chunk.js"},{"revision":"ba7c8cc4cd884323dcafff2ccfd00b24","url":"static/js/8.ff4d62ca.chunk.js"},{"revision":"1628c67e5e930f3f83bc5b9471f7eb4b","url":"static/js/9.2bcca054.chunk.js"},{"revision":"c7b9082acfee0aba5f4b035b196a2ac2","url":"static/js/main.90309b29.chunk.js"},{"revision":"8b1197d076e5c720306e5621c26e3009","url":"static/js/runtime-main.33e31278.js"}]);

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
