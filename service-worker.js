if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"3fbdd70434bfb6c8f9e4f060ab5c7f9d","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"3fbdd70434bfb6c8f9e4f060ab5c7f9d","url":"index.html"},{"revision":"19c0abf2b1e84461e87db9794397a30b","url":"precache-manifest.19c0abf2b1e84461e87db9794397a30b.js"},{"revision":"fbd206ed8c6390ccb89b5cd137a6f0b5","url":"static/css/14.7f70b1ca.chunk.css"},{"revision":"f9b4086a052b89e7920b2cafff2bb2fc","url":"static/js/0.378d49d1.chunk.js"},{"revision":"60835450a186781f97f69637979a21f2","url":"static/js/1.ce863550.chunk.js"},{"revision":"a8bf7e42a7d848a5cc6606905a5ff2f9","url":"static/js/10.ea0bf2d3.chunk.js"},{"revision":"61d31f3129063e09b962323c16f0befc","url":"static/js/11.e21f6041.chunk.js"},{"revision":"1b022f8ee61a1dad112f21948cb85048","url":"static/js/12.868a6d50.chunk.js"},{"revision":"44ea4e9dc370516c93cbf1963d0de7e4","url":"static/js/13.2288208a.chunk.js"},{"revision":"d08f091425760683e643f521654e8d44","url":"static/js/14.824dc4e7.chunk.js"},{"revision":"53109b42b3c42301d73ac187e1aa0873","url":"static/js/15.39d4d25c.chunk.js"},{"revision":"613a2c209e3281752d32f96f1d169634","url":"static/js/16.40ad7100.chunk.js"},{"revision":"0efe1158608dcc79629a50ecbe7f275a","url":"static/js/17.84e8cb84.chunk.js"},{"revision":"b3f837703f036072acc8e0bd95838470","url":"static/js/18.fefb0870.chunk.js"},{"revision":"e075227546c898937d416c50c991ae1d","url":"static/js/19.1be82f6d.chunk.js"},{"revision":"447d0838c67e6d123e4ae132593db20c","url":"static/js/2.f2ec6b08.chunk.js"},{"revision":"b07cbbc33efec72dd1c8c58bf522777b","url":"static/js/20.91c8bf34.chunk.js"},{"revision":"5ad1984b32476bbb48941919fd90a9ee","url":"static/js/21.53587d03.chunk.js"},{"revision":"5eb2f560d5fa57a4b183fc7dcb7438c9","url":"static/js/22.53ac3f07.chunk.js"},{"revision":"dbe508ebf83df897847432b75685a292","url":"static/js/23.b8349d9f.chunk.js"},{"revision":"d77b391f46e26db18122730462d291d7","url":"static/js/24.2c50be41.chunk.js"},{"revision":"ed902b7466dce068bd61358a56e2bfff","url":"static/js/25.d8490ef6.chunk.js"},{"revision":"a61bba4902b1712c2b0093f884c47e36","url":"static/js/26.baffeace.chunk.js"},{"revision":"ad394dd541350aae22ce4f37029b3068","url":"static/js/27.61435cbe.chunk.js"},{"revision":"efd92f58dd21bcb969cc655776898e43","url":"static/js/28.3237b482.chunk.js"},{"revision":"80c590158129cfdef6549245cf304916","url":"static/js/29.63814546.chunk.js"},{"revision":"ac92cf7a3325e3c944e17218e363a34f","url":"static/js/3.746c98f4.chunk.js"},{"revision":"1eac02d69edb65c9a2b96019f700afb3","url":"static/js/30.fccc1055.chunk.js"},{"revision":"b4fe743461672842adb905665ea6a3db","url":"static/js/31.3036da29.chunk.js"},{"revision":"f304c7c8784124a80aaeef93cbc0a5b9","url":"static/js/32.9b815896.chunk.js"},{"revision":"28d00419c4dc10ca417549b2f860da5c","url":"static/js/33.b3e28905.chunk.js"},{"revision":"0bda0723fe57168fc2d5f27ce44f7873","url":"static/js/34.e34cae65.chunk.js"},{"revision":"609de1c5c61f168be86614a183d1648d","url":"static/js/35.8f7e02a5.chunk.js"},{"revision":"fe60b817cfedd2e61f4337a6cc22516a","url":"static/js/36.e6b605b3.chunk.js"},{"revision":"22a06850353c27f2b0fa8fc2c4f4e6bd","url":"static/js/37.0c469bf6.chunk.js"},{"revision":"f2d70e4ea1e976790a59fc2c1dbb2562","url":"static/js/38.1a6d68e1.chunk.js"},{"revision":"0970c109a00d45444a8d685a08a1e7a5","url":"static/js/4.6e923618.chunk.js"},{"revision":"17cf5f328ce7c5bbab01d4bdb0dbff25","url":"static/js/7.a33d71eb.chunk.js"},{"revision":"d4a963ccc71ee9c1c78e4b62083805d2","url":"static/js/8.b84ad537.chunk.js"},{"revision":"87211b7b1ac88b6c48ff030b2ca5fdfb","url":"static/js/9.fd6e571f.chunk.js"},{"revision":"2dadc3aeb377e52688e085b4022a51c3","url":"static/js/main.ae88068e.chunk.js"},{"revision":"d1b1b0a0fa2c992b0adf784adb1f0a9a","url":"static/js/runtime-main.1f2e783c.js"}]);

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
