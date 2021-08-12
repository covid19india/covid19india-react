if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"b32f75ce448193cec7e6c9949ba84a26","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"b32f75ce448193cec7e6c9949ba84a26","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"fa58b34f703b8f212cb370759f77815a","url":"static/css/22.abf343ae.chunk.css"},{"revision":"17c389cf17272b648b44e76c5263a4fd","url":"static/js/0.ad9a7acd.chunk.js"},{"revision":"1fa33935f19c728f609b41b29611c67d","url":"static/js/1.b9d0ea7e.chunk.js"},{"revision":"970f56868780b941b66c214f0d0f8ed2","url":"static/js/12.6fb2a888.chunk.js"},{"revision":"f044706609b977197bedf68094271e5e","url":"static/js/13.6577b645.chunk.js"},{"revision":"b88bdb40943aaa7c37d44c50617a1203","url":"static/js/14.d47da608.chunk.js"},{"revision":"038a539e32080f17e15ba9be12650f2a","url":"static/js/15.f1ad520e.chunk.js"},{"revision":"2eda117f2428b672888bc32c334914b6","url":"static/js/16.8694e312.chunk.js"},{"revision":"a83e956c10603944ba63e4b419bdd7fe","url":"static/js/17.5fef8870.chunk.js"},{"revision":"8f6ba921817f368337f1076968a126d0","url":"static/js/18.44c24b78.chunk.js"},{"revision":"99c7d060426e8c2b9af01b3afeae2607","url":"static/js/19.99294a34.chunk.js"},{"revision":"1719be0aed4a647ef0a0b11dca617c68","url":"static/js/2.2d42af5e.chunk.js"},{"revision":"41be401eafc537b2d7be48de4b141bd4","url":"static/js/20.286872cf.chunk.js"},{"revision":"44cbe265372c8aea8f1ffa5bc47b3567","url":"static/js/21.4b97b564.chunk.js"},{"revision":"ab2e2580f2f4c54cfa8261b17deeb02e","url":"static/js/22.1fde6589.chunk.js"},{"revision":"1a8224524f7e89ffc8f2d2bcc39f0d95","url":"static/js/23.41fc08aa.chunk.js"},{"revision":"01709063b2eacb5d467eea83acec3552","url":"static/js/24.5ffd14e5.chunk.js"},{"revision":"ef1f006a40695899b4a4a10e680d7b39","url":"static/js/25.82ae13c4.chunk.js"},{"revision":"65f72f307f6c794b5c1a605d0281a9d8","url":"static/js/26.60c61900.chunk.js"},{"revision":"fb1dbc752ad000e016ebfc0cf4ac7b1e","url":"static/js/27.f619f22a.chunk.js"},{"revision":"889441d62aae20885d794442cd627a13","url":"static/js/28.36840008.chunk.js"},{"revision":"ff071f0a818b56d032112d7fd728cdb0","url":"static/js/29.dafeaf2a.chunk.js"},{"revision":"cd41a479576f4cfe9e6c703d0beeaef8","url":"static/js/3.d6dd2746.chunk.js"},{"revision":"970b7a6450fec9d3f971a3c10e69de3c","url":"static/js/30.43ed66da.chunk.js"},{"revision":"de1bd5ebacd7960c6f6cbd389f77b8ad","url":"static/js/31.78429833.chunk.js"},{"revision":"17950661b437a3526fd0007a07d5cfdf","url":"static/js/32.09a520fa.chunk.js"},{"revision":"c1d83d236432e2fcdcffa9ff96b4e729","url":"static/js/33.dacfc8ac.chunk.js"},{"revision":"95169f1c8c15c0e483604514d4a29504","url":"static/js/34.8aed08c0.chunk.js"},{"revision":"548fc6718c92d6375e3d5c91f15c96e4","url":"static/js/35.cc8c2aae.chunk.js"},{"revision":"d73b1ba2bc7a0d03cb4d99def744c7a6","url":"static/js/36.82539458.chunk.js"},{"revision":"8a205c93551e245ab9695da67acdfab4","url":"static/js/37.2d3ae3f3.chunk.js"},{"revision":"ad9f93431bdd87ca43605a06b07fbd17","url":"static/js/38.42926d7c.chunk.js"},{"revision":"3b263afe2bce708f333341c094931018","url":"static/js/39.03dfa6d5.chunk.js"},{"revision":"e0450f8439a75e23a0b36876cd4ed985","url":"static/js/4.fff38bbd.chunk.js"},{"revision":"ca583ec306e17bd266c33215049feae0","url":"static/js/40.e95d7b25.chunk.js"},{"revision":"92c15a6ab67df14b5e93ccd55bd6eea7","url":"static/js/41.a5a41d87.chunk.js"},{"revision":"fbd6d10400cc5abd36e0f24eaf450396","url":"static/js/42.73a17e33.chunk.js"},{"revision":"2a9e78fe87743aa0628b4b009430870b","url":"static/js/43.1be26e32.chunk.js"},{"revision":"e072181f06d3bcb12ab4218766b43955","url":"static/js/44.d253de2d.chunk.js"},{"revision":"417f42b91ef69990b0d5b24409b0d7ed","url":"static/js/45.95e11f89.chunk.js"},{"revision":"834f9e4e920894ca288fd13a36902a64","url":"static/js/46.cbd2eb23.chunk.js"},{"revision":"63bc879f94d8e5de52f9aebe8ea89ce6","url":"static/js/47.f59ff91e.chunk.js"},{"revision":"3fe53582a410ab46a4503e9c4d26ae68","url":"static/js/5.13c10a2c.chunk.js"},{"revision":"ba54032dfe0571a214b4e38b775128b6","url":"static/js/6.25f84119.chunk.js"},{"revision":"6165718a39c5742bd51a61f198104e84","url":"static/js/7.241ed25c.chunk.js"},{"revision":"13ce9b0000feee9d585cb6ecaacfdc61","url":"static/js/8.636e97d2.chunk.js"},{"revision":"21666e06f7bf71dccd9631cb0eda87c9","url":"static/js/9.464e0fbf.chunk.js"},{"revision":"8405fdaef65885fe635642f76d74f61c","url":"static/js/main.3ba05bc6.chunk.js"},{"revision":"14d35f0a80c09a04ebcce7d40d9d21b1","url":"static/js/runtime-main.8838ec51.js"}]);

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
