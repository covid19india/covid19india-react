if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"fa8dba581a68145bd341bb8ad40ecfbf","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"fa8dba581a68145bd341bb8ad40ecfbf","url":"index.html"},{"revision":"16a114c4fb1844a0e58758c0a06f36a8","url":"precache-manifest.16a114c4fb1844a0e58758c0a06f36a8.js"},{"revision":"d1ecee1832b2380c83245506efe88ace","url":"static/css/14.de906ae8.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"5eb40bce1ea530782335938df7530eac","url":"static/js/1.f9bccece.chunk.js"},{"revision":"0c6226543808417b06cb801c7e1978fd","url":"static/js/10.eefff101.chunk.js"},{"revision":"64f0256d2bb8a82755f1b3d152e6c685","url":"static/js/11.7df7c3f7.chunk.js"},{"revision":"4010018c25009504248f3213ad7c319c","url":"static/js/12.69bd7f8f.chunk.js"},{"revision":"cd3e2ee5081dd981d80bc4ef2dc15e21","url":"static/js/13.ae77a819.chunk.js"},{"revision":"6c4d763e433e36fc577c429a64e31285","url":"static/js/14.32619092.chunk.js"},{"revision":"085962ab079d0a77e681a832549be9ab","url":"static/js/15.8a3169c9.chunk.js"},{"revision":"652dc08de6f3f21a7d4cbd4dbfb39b48","url":"static/js/16.347b9ea8.chunk.js"},{"revision":"94e2bd8b98ff331192d13c1e40123a3b","url":"static/js/17.17559a39.chunk.js"},{"revision":"c4078fd23bc5763cb590c6793d10520c","url":"static/js/18.22c69d11.chunk.js"},{"revision":"d8dc06bd6f04750590560603fd26ea40","url":"static/js/19.97b82bb7.chunk.js"},{"revision":"af99f281184db621dbffb29205e236ef","url":"static/js/2.fa2aa46b.chunk.js"},{"revision":"d268c92180e8c619b5310a09a49f38c1","url":"static/js/20.88dfacee.chunk.js"},{"revision":"2404bac709871f5fea85f1390abc0a8d","url":"static/js/21.8631b32b.chunk.js"},{"revision":"ca85a6dbbd00405919c7a707319ab021","url":"static/js/22.d3a28fe2.chunk.js"},{"revision":"217c703dc5b65d0fc25213f6c844f0bb","url":"static/js/23.5574dfa2.chunk.js"},{"revision":"69ede7590b6a6f7a16f9080157db6054","url":"static/js/24.dc759fef.chunk.js"},{"revision":"50bcbe716e3a62f88cefcb7374da4b3d","url":"static/js/25.5e39e010.chunk.js"},{"revision":"4328394a061629648f5c312f822c5ca0","url":"static/js/26.63a51b97.chunk.js"},{"revision":"a3f11885262b0c9f5228dcafa5ef6925","url":"static/js/27.1de0daa1.chunk.js"},{"revision":"4533d35c0ad2c7e816d2ad45f3a07c2a","url":"static/js/28.cf1b47fd.chunk.js"},{"revision":"976bc27e00c30ad7fb9a76c7b88de16a","url":"static/js/29.c900e8ac.chunk.js"},{"revision":"0715bf75556c0f0c8734791916afa580","url":"static/js/3.b199b006.chunk.js"},{"revision":"856171be0a29cbf3eeab037b7a7b7f94","url":"static/js/30.d5fa4a36.chunk.js"},{"revision":"e6a59d619c3467f2bec9571ff41c9f19","url":"static/js/31.edf85606.chunk.js"},{"revision":"0f0a50c2bc08f25cebcdbfbfbe464f4f","url":"static/js/32.91713cbc.chunk.js"},{"revision":"a54caea09bbd3f0a8418ec0ebde68407","url":"static/js/33.bae1a224.chunk.js"},{"revision":"604c0c96282348ab39ff71aa26394e2d","url":"static/js/34.4c4053e0.chunk.js"},{"revision":"9c6f0154585e5ef0d7c5dd75465d15d4","url":"static/js/35.4c8b4e1b.chunk.js"},{"revision":"543ef2d627facf9c9ca208f33d302daf","url":"static/js/36.0953a7e0.chunk.js"},{"revision":"d78c5b5f1a6c182b0e5757b68d1861e2","url":"static/js/37.a138e5df.chunk.js"},{"revision":"defde356784fae89d9f8b118f300adef","url":"static/js/38.cba9529b.chunk.js"},{"revision":"1a3cdda0bb40fb791e31ecb25b3cc481","url":"static/js/4.93ac8e85.chunk.js"},{"revision":"6e999b9457c4c853253b7c52b417c37d","url":"static/js/7.ac643e4d.chunk.js"},{"revision":"f7469e2dda7be35840f2cbe95f97549a","url":"static/js/8.a9c71f1d.chunk.js"},{"revision":"eeb2a885877aca3a5b8c4be2f077f6bb","url":"static/js/9.4ccbbd0a.chunk.js"},{"revision":"ade8bdc0792a43e768b048c2b9f71a8a","url":"static/js/main.7e983503.chunk.js"},{"revision":"c90ca5a786e10a4bc8a2dbdd36218259","url":"static/js/runtime-main.0fcdb7f6.js"}]);

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
