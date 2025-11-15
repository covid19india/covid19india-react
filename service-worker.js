if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"429e2f27d76e8fded5c569dcab1c1f18","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"429e2f27d76e8fded5c569dcab1c1f18","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"e1b4bb7171f893224fd40d3fb983c9a2","url":"static/css/22.80df4701.chunk.css"},{"revision":"0ff5cf098070438329a1271ddf981ca0","url":"static/js/0.a0c39cc9.chunk.js"},{"revision":"cb511f19b727ea82553fe56e028828f4","url":"static/js/1.2cbb26ea.chunk.js"},{"revision":"5f2ff6cdb7139f9d2b607c90b9bcb620","url":"static/js/11.526bce41.chunk.js"},{"revision":"84231be66b314f84b96d300098e67959","url":"static/js/12.5aa3f191.chunk.js"},{"revision":"674b7e3957991f0b4c9901270be4e5f8","url":"static/js/13.925eca04.chunk.js"},{"revision":"5b454712d66127f2607091826c0f38f4","url":"static/js/14.dd64631f.chunk.js"},{"revision":"4f87ced6bbd0eba95d8c08cdc388fabe","url":"static/js/15.d5336327.chunk.js"},{"revision":"1babc26ef10ad0f9d54bec2507f82fa9","url":"static/js/16.05332d0d.chunk.js"},{"revision":"a063e05dcc01cfc2a7d515a87a139cf2","url":"static/js/17.f78d18af.chunk.js"},{"revision":"e3c701a0a7fc011bf541c3c4967faea0","url":"static/js/18.075f7ec8.chunk.js"},{"revision":"5aacb09ceaa8a26c471e037579eb349f","url":"static/js/19.f5d866b8.chunk.js"},{"revision":"f0fbd43ae3c7cb2bce87ae3f37d9b816","url":"static/js/2.b9040596.chunk.js"},{"revision":"5659f7694548c0ef7a7efe90e52204e4","url":"static/js/20.cc38d188.chunk.js"},{"revision":"c4d99cab5c6d6faa257923dd12a6d759","url":"static/js/21.481a1bc8.chunk.js"},{"revision":"f82ff925b775b265506cd8bab5a29f74","url":"static/js/22.e26b3cac.chunk.js"},{"revision":"67f3073a7a06fc87e22cf8d7b72b05d2","url":"static/js/23.18371aa3.chunk.js"},{"revision":"63ac2a91b11c2984f712e683d8f4ff96","url":"static/js/24.bbb1cd1b.chunk.js"},{"revision":"d0377ed36adb6e955d5d32762adecb8c","url":"static/js/25.434cbef6.chunk.js"},{"revision":"23deca0c1af81b70fc4d458fbc84ca03","url":"static/js/26.4d1c5a86.chunk.js"},{"revision":"1fa0ab9d6e0add30877913e6bd06dd60","url":"static/js/27.09fd1aff.chunk.js"},{"revision":"a7468dcf07f35307a5da8eb207bb93cc","url":"static/js/28.aa92045b.chunk.js"},{"revision":"b0a0037fdce0e7a78449151263fc5ba9","url":"static/js/29.40f59c61.chunk.js"},{"revision":"71e9df6b149df02af213e56a63c8e68b","url":"static/js/3.e35455bc.chunk.js"},{"revision":"1957ced3d1338b7f36125bad44426263","url":"static/js/30.8d041c51.chunk.js"},{"revision":"5e4ba867a07fac0607712f937b08b5ce","url":"static/js/31.82f3dd7d.chunk.js"},{"revision":"74e9680b365c7186b3643f1f9cce9db0","url":"static/js/32.177efa5e.chunk.js"},{"revision":"97470936ee2c13625645b010b4ee7355","url":"static/js/33.169a5f31.chunk.js"},{"revision":"082613220ac406d234c1e58872015241","url":"static/js/34.dceebab8.chunk.js"},{"revision":"05a2abaf2ccf86c2867aa560832906eb","url":"static/js/35.3d0e91aa.chunk.js"},{"revision":"83952de1e6b98c687aaaebcd4d9f7fc3","url":"static/js/36.9d4e8557.chunk.js"},{"revision":"36dd65f87453f15b7e80d8d27d9260b3","url":"static/js/37.559b59cd.chunk.js"},{"revision":"5485c828a8b467c7ee7e0324e77691af","url":"static/js/38.368d7750.chunk.js"},{"revision":"1b4ec1e90fb5ab762d2f7703caaeefed","url":"static/js/39.d1182d34.chunk.js"},{"revision":"6f2d773a71432e513a78fcdf2626b9a0","url":"static/js/4.2c0898e3.chunk.js"},{"revision":"b4225208adb1e9e8e186e801c76d148d","url":"static/js/40.9ef41232.chunk.js"},{"revision":"ad65278eacf33060689936e8453c58df","url":"static/js/41.12bf9e4f.chunk.js"},{"revision":"742e8f6fbdc3838c473671d494a1f5c8","url":"static/js/42.416b9917.chunk.js"},{"revision":"2d4ca7780f038513c2c5769bcfe4b79e","url":"static/js/43.60aa7a3c.chunk.js"},{"revision":"ce493fe240e01f8b94c895d1c800f908","url":"static/js/44.1761074d.chunk.js"},{"revision":"13cefcd0461769506093a21639276e12","url":"static/js/45.bd4ac566.chunk.js"},{"revision":"a5483a5bb0b0a98302cf07d2452f7244","url":"static/js/46.8c39b76b.chunk.js"},{"revision":"77420b0992cd18220d5e72c61f55ab27","url":"static/js/5.3e7a1035.chunk.js"},{"revision":"2586bf0c80b72ae133c72b656d3f23b3","url":"static/js/6.59de0973.chunk.js"},{"revision":"685a5ab8c030d3b9b38ab827d8d37336","url":"static/js/7.25f0e432.chunk.js"},{"revision":"761664d3c985dd0e179b5ee57f587156","url":"static/js/8.dce88d22.chunk.js"},{"revision":"ea748b5e959148153aa3fae864819473","url":"static/js/main.4e56008d.chunk.js"},{"revision":"f403e911028bcbfb6bab11333307707d","url":"static/js/runtime-main.838dd949.js"}]);

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
      new RegExp('https://data\\.covid19india\\.org/.*\\.json'),
      new workbox.strategies.NetworkFirst(),
      'GET'
    );
  } else {
    console.log('Workbox could not be loaded. Hence, no offline support.');
  }
}
