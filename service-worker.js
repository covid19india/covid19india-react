if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"9b3dd93ff193e2390404dbaa5815c3c4","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"9b3dd93ff193e2390404dbaa5815c3c4","url":"index.html"},{"revision":"73791892d59c4f788a81824c359afd3c","url":"precache-manifest.73791892d59c4f788a81824c359afd3c.js"},{"revision":"2c46c366dec046be1d2744c3e4a19d79","url":"static/css/14.fa5c1286.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"6e609ee289c323935d349378327e59e0","url":"static/js/1.6ed7fd02.chunk.js"},{"revision":"ee5bed2e582080654a98b6001b366a22","url":"static/js/10.9413ecc1.chunk.js"},{"revision":"db541c271fac2f334c79deabd7bf68e8","url":"static/js/11.0295a934.chunk.js"},{"revision":"3382ca0d4dc2ec243b5e5132ec6ab58f","url":"static/js/12.83ca96bf.chunk.js"},{"revision":"2763afae56aa9b3c9ba9e56a295af34d","url":"static/js/13.bfdcafa8.chunk.js"},{"revision":"bb24706e35602baec1a071f3db4d5cfb","url":"static/js/14.fa0857ae.chunk.js"},{"revision":"6fe1442fe27709ec76dfde4add93c3fb","url":"static/js/15.412e7d20.chunk.js"},{"revision":"53e3b995c7720c8cbb0b93239b208a21","url":"static/js/16.192f369d.chunk.js"},{"revision":"ad8fc80eef9003e41f50b1b4b12f38a3","url":"static/js/17.4bc67a3d.chunk.js"},{"revision":"091856df48083ac07815514fce4aaab0","url":"static/js/18.2b5fda6b.chunk.js"},{"revision":"7e1e94738fad973bd2142b64ddc0b6c6","url":"static/js/19.fca51128.chunk.js"},{"revision":"0e8820e624dcbe13de18371e10e3c2e1","url":"static/js/2.4f7e7ce9.chunk.js"},{"revision":"8f0d8d60bec2cbd8f4ad6e63a296438d","url":"static/js/20.3d05f382.chunk.js"},{"revision":"84b78c9df61d30f51a37e1e8f2fdd396","url":"static/js/21.96c51cfd.chunk.js"},{"revision":"5736307d619d2cd6768c6cd3eea278cf","url":"static/js/22.3190d8c8.chunk.js"},{"revision":"bd3dc96af044a85b7409b426f115d104","url":"static/js/23.517896f3.chunk.js"},{"revision":"aaf8ae8c1bafb02bc7c361e1edb877fc","url":"static/js/24.abdf1511.chunk.js"},{"revision":"7166131374e6e9493c21358c4dcbc229","url":"static/js/25.4773ab47.chunk.js"},{"revision":"3c2bd4d7210e8d85b8de6019b4e633bc","url":"static/js/26.927bff96.chunk.js"},{"revision":"ce32ed261963dbc5b7a4ae71941481a1","url":"static/js/27.6581a5dc.chunk.js"},{"revision":"f33475590884d2f8699c2816e7e922aa","url":"static/js/28.cebbeda9.chunk.js"},{"revision":"a7c27f44069623ac646325f06a102a20","url":"static/js/29.8e3461fe.chunk.js"},{"revision":"35b5f94dfa80bcb63ad512b1306acec7","url":"static/js/3.9ec522c9.chunk.js"},{"revision":"84abbe46bc2846c337a0230243099e62","url":"static/js/30.7dd5e4ab.chunk.js"},{"revision":"d62997ad8b7712ee94ae87acb764566f","url":"static/js/31.b45795e6.chunk.js"},{"revision":"b012e37030c713f51c92456846417455","url":"static/js/32.a37e2816.chunk.js"},{"revision":"806ca3204a2db7ed716f6f8cf97b0cad","url":"static/js/33.8d84a8bf.chunk.js"},{"revision":"f126d8c837e2335a269f4c8615a4c692","url":"static/js/34.33277fe2.chunk.js"},{"revision":"c73c79a7b4fa0ab93fe553156fb0c7ae","url":"static/js/35.cf76c37f.chunk.js"},{"revision":"4e1df4083305cfa286daeb7844a3a06d","url":"static/js/36.05e5af8e.chunk.js"},{"revision":"e8bef842b3965dd87c849aeeab8248e8","url":"static/js/37.8efb149d.chunk.js"},{"revision":"5a67c2642e294dd22ca13e478d5e3011","url":"static/js/38.8c44612f.chunk.js"},{"revision":"aa9512d2e0beef73df4906cb50cafeeb","url":"static/js/4.1387fa07.chunk.js"},{"revision":"d8849aa9b6f27eb55c8453325ce51f97","url":"static/js/5.f2e6d6c1.chunk.js"},{"revision":"ba7c8cc4cd884323dcafff2ccfd00b24","url":"static/js/8.ff4d62ca.chunk.js"},{"revision":"1628c67e5e930f3f83bc5b9471f7eb4b","url":"static/js/9.2bcca054.chunk.js"},{"revision":"5e0196e772dcb3c40557894e1e52cf1f","url":"static/js/main.5d5ddfde.chunk.js"},{"revision":"8b40b75936d8999122d1a774d351fad6","url":"static/js/runtime-main.8d912b1f.js"}]);

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
