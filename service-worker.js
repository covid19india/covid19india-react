if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"0a80df86a9b48a065097e46d1c01fc27","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"0a80df86a9b48a065097e46d1c01fc27","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"33caa79b53d0c40b4de15355041a2e4b","url":"static/css/22.b49f6be6.chunk.css"},{"revision":"17c389cf17272b648b44e76c5263a4fd","url":"static/js/0.ad9a7acd.chunk.js"},{"revision":"9269b71e468c72266893596989f94ed7","url":"static/js/1.ae3a0985.chunk.js"},{"revision":"970f56868780b941b66c214f0d0f8ed2","url":"static/js/12.6fb2a888.chunk.js"},{"revision":"0249cfb723e3d3e7f1de7bdd55a1737b","url":"static/js/13.d198dea4.chunk.js"},{"revision":"f2ee046e0e1203b2d9b712789edce9b5","url":"static/js/14.f9bcc369.chunk.js"},{"revision":"fb9cc80a2d98328325ab9c57bf5101cc","url":"static/js/15.12b85add.chunk.js"},{"revision":"2eda117f2428b672888bc32c334914b6","url":"static/js/16.8694e312.chunk.js"},{"revision":"491a6577424756eb548924d2dcec3930","url":"static/js/17.ccd9bdc6.chunk.js"},{"revision":"b1806e4d3b7dd750502032653f6a3780","url":"static/js/18.cfd4afc4.chunk.js"},{"revision":"5966639fa0e6fb591f048763bd3483cf","url":"static/js/19.7440e949.chunk.js"},{"revision":"1719be0aed4a647ef0a0b11dca617c68","url":"static/js/2.2d42af5e.chunk.js"},{"revision":"7c71e242c4b60bfaf333717c40ada1fd","url":"static/js/20.f7f2891f.chunk.js"},{"revision":"1d66a1152f6bb41b7f1d18e579541b85","url":"static/js/21.02a7162c.chunk.js"},{"revision":"921a2f21c0988edce105c5d924cb319e","url":"static/js/22.c931fde9.chunk.js"},{"revision":"1908e977c88f766fb302d70caa875861","url":"static/js/23.2ee75c23.chunk.js"},{"revision":"327afafc9b0a221356f1262c2ea684ee","url":"static/js/24.221f43ba.chunk.js"},{"revision":"ef1f006a40695899b4a4a10e680d7b39","url":"static/js/25.82ae13c4.chunk.js"},{"revision":"1b2c9995fac566f3173c8846fc018a01","url":"static/js/26.ff6b8571.chunk.js"},{"revision":"fb1dbc752ad000e016ebfc0cf4ac7b1e","url":"static/js/27.f619f22a.chunk.js"},{"revision":"21ffed9a7524f59d6c0661aca243060c","url":"static/js/28.5b5af6e8.chunk.js"},{"revision":"6d5be6c4acdb6f71ca7f6743e0002bb6","url":"static/js/29.70d7a404.chunk.js"},{"revision":"cd41a479576f4cfe9e6c703d0beeaef8","url":"static/js/3.d6dd2746.chunk.js"},{"revision":"6db7c392872793d3c70ff2c438b25b91","url":"static/js/30.e7e2d5ed.chunk.js"},{"revision":"8637da42ab62ca7f3f7e393871d33b26","url":"static/js/31.c824e796.chunk.js"},{"revision":"1318c722c1fead68a33016e06414a29a","url":"static/js/32.2fe85bc4.chunk.js"},{"revision":"c87338c6db472f9cf58c2f6db970155c","url":"static/js/33.a5c154ef.chunk.js"},{"revision":"c4456bcfc7926024c83534a7e44bc2bc","url":"static/js/34.c649d34e.chunk.js"},{"revision":"71dfd3aa718a9242113a9b3eb5a81e43","url":"static/js/35.522d029e.chunk.js"},{"revision":"2e40f353f33ee4b7c3e5ce6d4d138988","url":"static/js/36.9fcc0188.chunk.js"},{"revision":"0b8ab0765bd0b3c3cf62757823524869","url":"static/js/37.bd88f780.chunk.js"},{"revision":"842253ecd1736274055d6f83fb0b2865","url":"static/js/38.2aaef4cd.chunk.js"},{"revision":"3b263afe2bce708f333341c094931018","url":"static/js/39.03dfa6d5.chunk.js"},{"revision":"e0450f8439a75e23a0b36876cd4ed985","url":"static/js/4.fff38bbd.chunk.js"},{"revision":"0de1a07c746859148d32bed3b4857236","url":"static/js/40.e88ce858.chunk.js"},{"revision":"7ab5e9e49bc10b87fffbbc4734636fd9","url":"static/js/41.5ad9ffcc.chunk.js"},{"revision":"a9d0c172f409f6efb50dc5aa3d2a497c","url":"static/js/42.0fcdcb59.chunk.js"},{"revision":"8edac4e9925774c9538832a835ada6fc","url":"static/js/43.ee481746.chunk.js"},{"revision":"1f24c869872d245930df6de3407b827d","url":"static/js/44.0b4554e5.chunk.js"},{"revision":"86c72966c7a93052bbeee2d6c696b3b8","url":"static/js/45.b83c0f6a.chunk.js"},{"revision":"27d36f95ff2b58062b91d6029e6d06af","url":"static/js/46.a729762b.chunk.js"},{"revision":"63bc879f94d8e5de52f9aebe8ea89ce6","url":"static/js/47.f59ff91e.chunk.js"},{"revision":"3fe53582a410ab46a4503e9c4d26ae68","url":"static/js/5.13c10a2c.chunk.js"},{"revision":"4ab1316f4c4a8a1b5c76711c908f4ec3","url":"static/js/6.6b91fa8d.chunk.js"},{"revision":"666c1ba1cab90d93658d1527f90e1d89","url":"static/js/7.6f9a959e.chunk.js"},{"revision":"6bd11c6e54869332136ccd2f1f079967","url":"static/js/8.6b913628.chunk.js"},{"revision":"60986cfe0b08e4dc9f82c10c78b6850a","url":"static/js/9.758369c0.chunk.js"},{"revision":"22ce28df5c13cffa2c204f29593a8214","url":"static/js/main.b3185323.chunk.js"},{"revision":"ed22e627b988116167bf5d40410535ca","url":"static/js/runtime-main.62cf148b.js"}]);

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
