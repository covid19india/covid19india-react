if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"4b97b2a570ba41d1a1d9023c084eda4c","url":"2df8de709567e293b27c.worker.js"},{"revision":"64edcbec1ed9fc37831cb55923844bab","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"64edcbec1ed9fc37831cb55923844bab","url":"index.html"},{"revision":"6dc9a9d2aaa5fa2b04787dc01402578d","url":"static/css/22.19fd72cd.chunk.css"},{"revision":"e6de5a082cc39e708a811bf56cfdc3a2","url":"static/js/0.f975bc25.chunk.js"},{"revision":"61fa9710f570af56056fdd071a318860","url":"static/js/1.f1cf72a0.chunk.js"},{"revision":"b150c721011868e61d21f4f5f70662dd","url":"static/js/10.1779d5b5.chunk.js"},{"revision":"7bcd8dc6a90fad89eb6cf2a13051a445","url":"static/js/11.49a7ff05.chunk.js"},{"revision":"9807797f60422ac604164b69623f647b","url":"static/js/14.c4624bc0.chunk.js"},{"revision":"9529d07d7e16c2186ee4af244c30c70c","url":"static/js/15.dd370368.chunk.js"},{"revision":"9892ff59b534e2f47460535b592d1c00","url":"static/js/16.e805c38e.chunk.js"},{"revision":"c96ada432cc0a1137eb7db352a888ead","url":"static/js/17.91cff186.chunk.js"},{"revision":"6f4f8987e9f05e043356ac7f2f986311","url":"static/js/18.7c8c58f0.chunk.js"},{"revision":"9b69fdfa36a6424846d762ce69f05ea1","url":"static/js/19.db163d28.chunk.js"},{"revision":"a61cf3cd0353cf61636b34ccfcf03ab5","url":"static/js/2.0fc4525e.chunk.js"},{"revision":"f8f5b67cb9e630dc5fbdd121a22825d0","url":"static/js/20.1a305ce7.chunk.js"},{"revision":"fef3a7a6b83143d941260a908707b6ef","url":"static/js/21.be257519.chunk.js"},{"revision":"c1744a384eb97e8589843ad2ec1ffd3d","url":"static/js/22.c4869c93.chunk.js"},{"revision":"e99d8da62395fef4830256013d0466ce","url":"static/js/23.ec2bc580.chunk.js"},{"revision":"83358d5b4df3a94cacb6833a1645bd93","url":"static/js/24.dfa74ff8.chunk.js"},{"revision":"8461d4b5b2f70a98a6bf0c6501c64bbc","url":"static/js/25.460ee975.chunk.js"},{"revision":"9566c39f21a3b98a3141af62d861f503","url":"static/js/26.a1142191.chunk.js"},{"revision":"f9dcd3675c043cf8f7c689533d75c229","url":"static/js/27.10ff5f72.chunk.js"},{"revision":"d0963d91013da1e69153bf8198e4bc08","url":"static/js/28.50d901c2.chunk.js"},{"revision":"8be3f54111ae023100557c49001ec2cb","url":"static/js/29.5756b086.chunk.js"},{"revision":"49e01045356e2e88f4f1e90bcafe38ba","url":"static/js/3.89d28af8.chunk.js"},{"revision":"c284a486ba93689b4d35240707f383e0","url":"static/js/30.84ec23ed.chunk.js"},{"revision":"a8d2e8e607cf1c9acc12fce5e01c0dff","url":"static/js/31.992bb780.chunk.js"},{"revision":"bab534f786e69a9440fca9382d85f2af","url":"static/js/32.67119b83.chunk.js"},{"revision":"c9115522b4e1bc19432522c8647c628d","url":"static/js/33.b8cf8012.chunk.js"},{"revision":"aedc44cb1ec9942114600504471a916f","url":"static/js/34.e1dccd3c.chunk.js"},{"revision":"adf61d6b47e38638166fcd878112d8d0","url":"static/js/35.61f296bd.chunk.js"},{"revision":"04d4b9742b069afb7dc1c78af981a563","url":"static/js/36.4f0a4936.chunk.js"},{"revision":"d4589cf1b8b43bfa9dac3e0c60a7c419","url":"static/js/37.34235a8d.chunk.js"},{"revision":"d483b7f615eb8f3afde055204fd26a58","url":"static/js/38.8d42bd52.chunk.js"},{"revision":"788651c9b03754730a2eddd6da47ad60","url":"static/js/39.2174c73a.chunk.js"},{"revision":"be006d36ade3da68466c6d40a805d891","url":"static/js/4.ff1f1406.chunk.js"},{"revision":"54fcbb3fd62582c2e600925d1b5563c5","url":"static/js/40.6914e2c2.chunk.js"},{"revision":"71212bb1d52f7ec964a93bd4928230c6","url":"static/js/41.269c219b.chunk.js"},{"revision":"31145f3421707d206cd5a33f20d8fb34","url":"static/js/5.89713424.chunk.js"},{"revision":"e7f227c26c70f9456603afc0cc7e7b48","url":"static/js/6.01fafef7.chunk.js"},{"revision":"602ededfe7e22a2f528c21eb9f6f9d17","url":"static/js/7.452963ad.chunk.js"},{"revision":"9a3423219258151b260e60dde118e3b3","url":"static/js/8.9e199d7b.chunk.js"},{"revision":"ace8b110745e3a2bdbe2d6eda1e3c9d1","url":"static/js/9.5b93555e.chunk.js"},{"revision":"e6aa0bcd4fecf30661665fdde6c993e8","url":"static/js/main.a8429dd1.chunk.js"},{"revision":"93e79c5f93498b48dd7cd6b16e440078","url":"static/js/runtime-main.5b046b80.js"}]);

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
