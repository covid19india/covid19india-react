if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"ea2c094d2edfbc70ae0f550c466dd863","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"ea2c094d2edfbc70ae0f550c466dd863","url":"index.html"},{"revision":"8379c3b578d4f71bdca65000a25f5c01","url":"precache-manifest.8379c3b578d4f71bdca65000a25f5c01.js"},{"revision":"9031e72e0e56f4f894f165f56ead3e82","url":"static/css/13.de906ae8.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"290c39beed7a9242ec776f94a3408194","url":"static/js/1.10f1e89f.chunk.js"},{"revision":"6bc1673e0ff018dfb6e95dab6f038103","url":"static/js/10.0f3f16f9.chunk.js"},{"revision":"cc06e9bc0814ea52fb342f6c3623ee22","url":"static/js/11.b6840b7e.chunk.js"},{"revision":"f962a8234f0c0da98a7a6aca629947a3","url":"static/js/12.899fd739.chunk.js"},{"revision":"b55d1008098ad7f227f5616a7402471e","url":"static/js/13.51728757.chunk.js"},{"revision":"a0e50e79c28d96fce87f6a7d4b79779d","url":"static/js/14.3cd5cb9d.chunk.js"},{"revision":"7655e317242f861832f22da0fe8a4e18","url":"static/js/15.dce76cfa.chunk.js"},{"revision":"4d7b1961b1c95b76636d5604af4c52fe","url":"static/js/16.c04b64c1.chunk.js"},{"revision":"90e4dc55bc2c957d0b2abf3bb7fb0435","url":"static/js/17.afc41c2c.chunk.js"},{"revision":"d5989c028a031838da664872050aad72","url":"static/js/18.fddc4b91.chunk.js"},{"revision":"e2e533244de684ae4bdc18db9422c184","url":"static/js/19.00dfcf1c.chunk.js"},{"revision":"bb140724bb94f0bddc99798d49170a43","url":"static/js/2.51640ae9.chunk.js"},{"revision":"5ff18228a835bde7234e54ecc9d79dfd","url":"static/js/20.eb87742a.chunk.js"},{"revision":"847cede70b2ceadcdb31a1f69e06d713","url":"static/js/21.6a082045.chunk.js"},{"revision":"1bea3d6893a53cf3df706c1c3f10f5ab","url":"static/js/22.b8a98039.chunk.js"},{"revision":"22d041e9bc1ede9be8e16e29326a5cc9","url":"static/js/23.03db5086.chunk.js"},{"revision":"beba65ae3648d67496341dffec1ab2c0","url":"static/js/24.e3f2b4ef.chunk.js"},{"revision":"61b47c3e530dc5a20f06127b81c7e3e5","url":"static/js/25.77c034e8.chunk.js"},{"revision":"d6ba0eeca616008d3a13af0177c9e84d","url":"static/js/26.c2068cd6.chunk.js"},{"revision":"2a51440bc3acc7b69bad8acdaa0cdca1","url":"static/js/27.b0dc0e9c.chunk.js"},{"revision":"b4fcdad99d29a724c551f83eb8e21222","url":"static/js/28.82682531.chunk.js"},{"revision":"a59b88fc3e0cb15ede918c794162f295","url":"static/js/29.163e6e85.chunk.js"},{"revision":"cd1fa4a761d6109f4c6685c569a6d54d","url":"static/js/3.1ccdc6a7.chunk.js"},{"revision":"0bf59ff69dcc2008ba9368cd1ea84008","url":"static/js/30.7dba6cf3.chunk.js"},{"revision":"0b13c2a5c093ca0edc0e1d7ccf157bc9","url":"static/js/31.c3b13510.chunk.js"},{"revision":"3852d0776826cf2b1d9ac84f05bb7a3c","url":"static/js/32.2576279f.chunk.js"},{"revision":"06914e9b7b855a821fae54b8d0cf8b7f","url":"static/js/33.aa09704e.chunk.js"},{"revision":"871dfca539d255e9f7487fc01cfd3485","url":"static/js/34.567e01b3.chunk.js"},{"revision":"6dbce5cdf00695ab5ea47792d9c6ec4a","url":"static/js/35.0544a193.chunk.js"},{"revision":"4e1df4083305cfa286daeb7844a3a06d","url":"static/js/36.05e5af8e.chunk.js"},{"revision":"e8bef842b3965dd87c849aeeab8248e8","url":"static/js/37.8efb149d.chunk.js"},{"revision":"beed74442d951a371ebd96fc9be803d6","url":"static/js/4.f447625d.chunk.js"},{"revision":"ea53d178b847dc89769e9559f662c85d","url":"static/js/7.977086ae.chunk.js"},{"revision":"6bb66d1a422e9b93d0d5ea489d6631e9","url":"static/js/8.281c63b6.chunk.js"},{"revision":"e70ec8f28e29ec97a17bc75fb4290772","url":"static/js/9.707b9ae2.chunk.js"},{"revision":"49afaa779ea1720cc0cd776503398da5","url":"static/js/main.893fa7e9.chunk.js"},{"revision":"6d0109bfdcfc6b2125d028433a60726b","url":"static/js/runtime-main.1d8ff434.js"}]);

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
