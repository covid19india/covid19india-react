if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"ab0622a5e309124667cad87b1cf4dff5","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"ab0622a5e309124667cad87b1cf4dff5","url":"index.html"},{"revision":"65c1dafdb231973b1b98b84aa46b3e92","url":"precache-manifest.65c1dafdb231973b1b98b84aa46b3e92.js"},{"revision":"d1ecee1832b2380c83245506efe88ace","url":"static/css/14.de906ae8.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"5eb40bce1ea530782335938df7530eac","url":"static/js/1.f9bccece.chunk.js"},{"revision":"6db01be4a36093f7953b5c0ecf875ebb","url":"static/js/10.d7b97cc4.chunk.js"},{"revision":"286776236f9d93befc30dcb20d8309d7","url":"static/js/11.74db6d12.chunk.js"},{"revision":"841f2d18c448ed78cd0495f6cad1747a","url":"static/js/12.b7580959.chunk.js"},{"revision":"394b73a6d179c16800020abd844675e3","url":"static/js/13.290e09cc.chunk.js"},{"revision":"0569e90a591334013538e17448992d9e","url":"static/js/14.048cbd46.chunk.js"},{"revision":"9c97a411c687045b5347458dfddb5955","url":"static/js/15.41f10cd3.chunk.js"},{"revision":"28fb7370195cc1c2dc209b6aa027b8de","url":"static/js/16.ca36033a.chunk.js"},{"revision":"a9b0cbbb8a5cd00b03cf31935050a9e1","url":"static/js/17.2d37b1d8.chunk.js"},{"revision":"c4078fd23bc5763cb590c6793d10520c","url":"static/js/18.22c69d11.chunk.js"},{"revision":"599d4b07f0714eae9e563763a085aac8","url":"static/js/19.6f603ab4.chunk.js"},{"revision":"af99f281184db621dbffb29205e236ef","url":"static/js/2.fa2aa46b.chunk.js"},{"revision":"d268c92180e8c619b5310a09a49f38c1","url":"static/js/20.88dfacee.chunk.js"},{"revision":"097c798298090b549351b90f8ad0a619","url":"static/js/21.015fe001.chunk.js"},{"revision":"d1833d09aa99fa096969f85a7607c9a0","url":"static/js/22.aa230a01.chunk.js"},{"revision":"828a01a2484936d2174a91314a2b2d85","url":"static/js/23.b7a40962.chunk.js"},{"revision":"f642e556305661e8b06c09ccf4740561","url":"static/js/24.40066545.chunk.js"},{"revision":"50bcbe716e3a62f88cefcb7374da4b3d","url":"static/js/25.5e39e010.chunk.js"},{"revision":"4572cdd369e1913550e9986c9425e231","url":"static/js/26.a8e0d30f.chunk.js"},{"revision":"25269e5752f0ef129b2546f6c5180c11","url":"static/js/27.e27708e1.chunk.js"},{"revision":"f56147a7135ddebb0013eda51861929e","url":"static/js/28.f1a1d842.chunk.js"},{"revision":"b259c73d63366ec2ad516a08cd964d5a","url":"static/js/29.627a2725.chunk.js"},{"revision":"4b14ed8ce8406fdc7fbedd035f915721","url":"static/js/3.7b84d9da.chunk.js"},{"revision":"25c11d2830f0147c63bc96db90e0e65b","url":"static/js/30.12ca7d84.chunk.js"},{"revision":"941ba9645ef8bc75d480966b0db5988a","url":"static/js/31.0d80cd28.chunk.js"},{"revision":"0f0a50c2bc08f25cebcdbfbfbe464f4f","url":"static/js/32.91713cbc.chunk.js"},{"revision":"a54caea09bbd3f0a8418ec0ebde68407","url":"static/js/33.bae1a224.chunk.js"},{"revision":"a0fbd780e81153fe2ca179c786f0ff95","url":"static/js/34.20ac156c.chunk.js"},{"revision":"999aa5c6c253954e0aab7f4af2f6d0c5","url":"static/js/35.2190c8e2.chunk.js"},{"revision":"543ef2d627facf9c9ca208f33d302daf","url":"static/js/36.0953a7e0.chunk.js"},{"revision":"d78c5b5f1a6c182b0e5757b68d1861e2","url":"static/js/37.a138e5df.chunk.js"},{"revision":"a8da7c25844f9c68f1d7f92f4667be44","url":"static/js/38.ebe86702.chunk.js"},{"revision":"1a3cdda0bb40fb791e31ecb25b3cc481","url":"static/js/4.93ac8e85.chunk.js"},{"revision":"bab916cb486a5827e669c96160c991b6","url":"static/js/7.02161258.chunk.js"},{"revision":"f7469e2dda7be35840f2cbe95f97549a","url":"static/js/8.a9c71f1d.chunk.js"},{"revision":"84055afb8f4ed666cc87b1b4233b7182","url":"static/js/9.07f75471.chunk.js"},{"revision":"f385b1a7b98b9e3d5bd1e8f7d651a525","url":"static/js/main.0d71563c.chunk.js"},{"revision":"f364c8ba01796d85f74976982c481822","url":"static/js/runtime-main.a181ee00.js"}]);

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
