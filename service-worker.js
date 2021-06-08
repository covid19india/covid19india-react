if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"5cb15f24e3f42d48f0e437f5b3664f52","url":"404.html"},{"revision":"460e2171184a144d1b778416a9389f37","url":"c3dbf9379de3f7b9fe4a.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"5cb15f24e3f42d48f0e437f5b3664f52","url":"index.html"},{"revision":"ee193d41615fb8cf1732f6191cb78d96","url":"static/css/22.f5f9d973.chunk.css"},{"revision":"a08e0e1487a14e7708ce72c85b416db4","url":"static/css/23.a4ed9fa0.chunk.css"},{"revision":"b4acc576db35f4c578621e6c7e7ef982","url":"static/css/5.1432c553.chunk.css"},{"revision":"93c5ab856ecdfead17fbfde50ae8cc13","url":"static/js/0.bd3d2871.chunk.js"},{"revision":"4046cbd37395e7c8b6c4c67f45db934a","url":"static/js/1.cb2f5e6f.chunk.js"},{"revision":"b07e3613d084c3224e66f4875348f0d5","url":"static/js/10.d85ccd01.chunk.js"},{"revision":"14f9fc8878545ec671b12c3544dca658","url":"static/js/13.e7b8bd71.chunk.js"},{"revision":"485675d72c8e2789edd482f121357fd4","url":"static/js/14.3dd0bf3e.chunk.js"},{"revision":"8b25f261f68cce4838addf0b5152ca5a","url":"static/js/15.0f3b3a2b.chunk.js"},{"revision":"1d79e2fe586d78552e906c436202718d","url":"static/js/16.160c4aba.chunk.js"},{"revision":"91e7c298e9b13f5c4b26d2b872a40eb2","url":"static/js/17.5696d076.chunk.js"},{"revision":"470c4e587b08ac0429595dbd887610cb","url":"static/js/18.21bca3e3.chunk.js"},{"revision":"55cd3f21be50581df6537f2f339d7055","url":"static/js/19.79c2ade7.chunk.js"},{"revision":"9ae481b5c3a730207df63333900edf70","url":"static/js/2.4a5e0e9b.chunk.js"},{"revision":"4a760549afc5745643284fa194f64b20","url":"static/js/20.b63297a1.chunk.js"},{"revision":"de71159b7f471c9d0b79adc812816f53","url":"static/js/21.141e6261.chunk.js"},{"revision":"3c6f637e2e840c40c3da23d7cbbb682c","url":"static/js/22.65edaffd.chunk.js"},{"revision":"5f55d2d9d8e8c13780be79cb8a90b388","url":"static/js/23.96f62dcc.chunk.js"},{"revision":"241bf6971bd8a5efcf9a92fdd354234f","url":"static/js/24.e6e72a14.chunk.js"},{"revision":"b8ac55638273137562f3afaa84cc4300","url":"static/js/25.c5df0a35.chunk.js"},{"revision":"4ed45ee2898e308fbef9eb4882a5e998","url":"static/js/26.7a73f0c4.chunk.js"},{"revision":"37204efdb47d5b43a39280c06cd8c084","url":"static/js/27.7766b4f3.chunk.js"},{"revision":"e09b60322cc2ae4c578182e5c01738b3","url":"static/js/28.538d24bb.chunk.js"},{"revision":"b1482c7e1bfe34ec985aeee93928cebb","url":"static/js/29.9546e0a9.chunk.js"},{"revision":"0768ac07ce9b937c2432151dee3dc162","url":"static/js/3.3b17ff7a.chunk.js"},{"revision":"25c502dd0986249af70d779af08daaa1","url":"static/js/30.34975bdb.chunk.js"},{"revision":"daa5a45a66e418d46ad690fd1bd46aa9","url":"static/js/31.19fc077a.chunk.js"},{"revision":"8c2f27c88c1c950fc34d3391e84da084","url":"static/js/32.2817c849.chunk.js"},{"revision":"c4ffdcbd2df67c735d5e63f1198d7952","url":"static/js/33.f4c8aa41.chunk.js"},{"revision":"e3b6707c2c8ab2b9b54e3f6297b04302","url":"static/js/34.e6a0008d.chunk.js"},{"revision":"44891353793be66341afeee1a95d048d","url":"static/js/35.b7f38346.chunk.js"},{"revision":"c299a396da372023f96db68d3568d423","url":"static/js/36.446de56c.chunk.js"},{"revision":"dfbf75d4e4c0d3f995a08afaebc47bc5","url":"static/js/37.3b7c4203.chunk.js"},{"revision":"1988e97845ab10da5b5451cc2e6a0af3","url":"static/js/38.fffd5ada.chunk.js"},{"revision":"3d86da8eaf3fed896b06196c339fa44a","url":"static/js/39.eaccaab0.chunk.js"},{"revision":"bb08b83c80c404d16257fc90b4127a7d","url":"static/js/4.dbcf25f5.chunk.js"},{"revision":"d69b592057eb41cd8904482017d72002","url":"static/js/40.2a1ffa94.chunk.js"},{"revision":"017101063600a5966a44c832be5ab822","url":"static/js/41.8ff5f97d.chunk.js"},{"revision":"5de4309e3caacdcf5724a79de77ffdd0","url":"static/js/42.8e130625.chunk.js"},{"revision":"54c5b152fad743f3c8ca9a37af677c5c","url":"static/js/43.27d4497d.chunk.js"},{"revision":"862ebb8c4f56492a9b5d224a1407f371","url":"static/js/44.95b1a5d7.chunk.js"},{"revision":"a2e5547fb3e4049a70a572d04a3f76f2","url":"static/js/45.36edbce9.chunk.js"},{"revision":"fda2efcbfcd77b2e1b0a0ed6f088c265","url":"static/js/46.4c1facbe.chunk.js"},{"revision":"1053b1616e2278bfae378d1c902f111d","url":"static/js/5.0b2957dc.chunk.js"},{"revision":"d4b3c9336aa604813efc38b9dbe9ee4a","url":"static/js/6.d4148a0c.chunk.js"},{"revision":"e2cf5491f64769cf08d06b9861947381","url":"static/js/7.c1d39d41.chunk.js"},{"revision":"916a42a7dab04f33d644ff6ec810369f","url":"static/js/8.635eabce.chunk.js"},{"revision":"6b84b53b7a9c9397d655060cf872ff41","url":"static/js/9.99fe3708.chunk.js"},{"revision":"4f2164e1685b6f3234657eb5b4db7b22","url":"static/js/main.ef07732e.chunk.js"},{"revision":"d29c04355bb1dbfa01976e5369c3f87f","url":"static/js/runtime-main.17ae1256.js"}]);

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
