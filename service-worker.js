if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"21d3372054290190008bd233acabbcfa","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"21d3372054290190008bd233acabbcfa","url":"index.html"},{"revision":"696df123e40ee3d6fc5c9fddcda4ef27","url":"precache-manifest.696df123e40ee3d6fc5c9fddcda4ef27.js"},{"revision":"3f3ab58053ca4bdc4a26980fe735e145","url":"static/css/17.42da948e.chunk.css"},{"revision":"ba90d73cd2bf82d83eb43d091537c191","url":"static/js/0.da62a621.chunk.js"},{"revision":"6a3b527f8f333e1cb5e708913d87dab2","url":"static/js/1.7024d2a8.chunk.js"},{"revision":"495be25e86fcf7d712817e6370f9a344","url":"static/js/10.83398838.chunk.js"},{"revision":"68d2f18a7de74d4dac3a763f29147edf","url":"static/js/11.190cbb75.chunk.js"},{"revision":"420366821de8a04e760a898d1b6a0b30","url":"static/js/12.5f41ea70.chunk.js"},{"revision":"497e64fe884a215dc2b097e332645902","url":"static/js/13.42a04a26.chunk.js"},{"revision":"137dd3df1697194db7ac5e4ebf840de0","url":"static/js/14.c1a99e75.chunk.js"},{"revision":"08012b39c56e0fc95db7158073894a26","url":"static/js/15.3360c5f6.chunk.js"},{"revision":"ca375c2a28a7092e8b14e9afce361dac","url":"static/js/16.bf9cec15.chunk.js"},{"revision":"4f1774245d8d320b9d13eda3db14e6fd","url":"static/js/17.fb7e0e85.chunk.js"},{"revision":"aaf9b383745292163f3975cc812fd6de","url":"static/js/18.170a5ac9.chunk.js"},{"revision":"f68f46e4661499cbd8562106e9f59487","url":"static/js/19.474b0422.chunk.js"},{"revision":"b8168c4c1987b817f5d3fb1500d19a51","url":"static/js/2.770c0883.chunk.js"},{"revision":"3d2aea42b18072ea1f5c6d52cecab10b","url":"static/js/20.3c29caad.chunk.js"},{"revision":"42f038a33f8e841671827c4bb32d1b06","url":"static/js/21.65f445c7.chunk.js"},{"revision":"eea89904f4272fe40bbbbb9e0babfeee","url":"static/js/22.dd22a412.chunk.js"},{"revision":"8b44c365513b025b7a8b657ac9cdb21e","url":"static/js/23.7e2767a0.chunk.js"},{"revision":"3e5eef1806167ab18a8a2b8014f73aa8","url":"static/js/24.aba26c83.chunk.js"},{"revision":"2b27da5fcf1c107e3046eeff596fe066","url":"static/js/25.3bdf76fd.chunk.js"},{"revision":"5ef2dc379802b8f7a9d353f65eec9587","url":"static/js/26.fa3e9436.chunk.js"},{"revision":"6123aa78e5e59b0955a56bb4fd2ca67d","url":"static/js/27.f1c474f3.chunk.js"},{"revision":"17171e0da426b0b7bee502ac9696ce0a","url":"static/js/28.98e4c34b.chunk.js"},{"revision":"ce352b705272e4c8c4fd975e2c7b739b","url":"static/js/29.69ef4c1d.chunk.js"},{"revision":"707512392fc15aabd2b7f8eeaed383ff","url":"static/js/3.2faea36e.chunk.js"},{"revision":"521b9735ceb265345a2f1507f64f3b93","url":"static/js/30.eef7729f.chunk.js"},{"revision":"f6137076a9b779c16c2d96a00aa36e49","url":"static/js/31.10a4e5e1.chunk.js"},{"revision":"2cfbfd65c05a8210c83471d6bbf8834c","url":"static/js/32.c138bfc2.chunk.js"},{"revision":"6d416f42309de944f80ea9e927508904","url":"static/js/33.712ef06b.chunk.js"},{"revision":"5401b1ca4d2a1d6fd2f9487133569dfe","url":"static/js/34.ca24956d.chunk.js"},{"revision":"bd7fe8de59574ea0b0225e96efd8aaf9","url":"static/js/35.dc41bcc4.chunk.js"},{"revision":"03c6a9649ad0a0df49ad8a196feffc68","url":"static/js/36.c9f0b327.chunk.js"},{"revision":"2c8de65bb417ea0a9f11e43eab812ef1","url":"static/js/37.60f06f8b.chunk.js"},{"revision":"15ad0ddec239e270607aa8d7c9d444da","url":"static/js/38.6857e25c.chunk.js"},{"revision":"6f1327e4ed333a86ca925b3f4df56ea3","url":"static/js/4.915bf599.chunk.js"},{"revision":"681d0b94d79a6968faa21979cf3d3b2f","url":"static/js/5.118d115a.chunk.js"},{"revision":"c639284fe4e3bc75b1a8147a8db8b3e6","url":"static/js/8.778aeec6.chunk.js"},{"revision":"bab4fa548cf2190b78aafe35528b1bd9","url":"static/js/9.299d3c83.chunk.js"},{"revision":"c6c690c546d3141f739a1adb19602f7c","url":"static/js/main.d5c66caa.chunk.js"},{"revision":"f3018bf5cee8c06838e6cb27fe9e2709","url":"static/js/runtime-main.b97e951e.js"}]);

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
