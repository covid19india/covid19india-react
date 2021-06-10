if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"f152f1f75d1fdc72ed829c9d0794affa","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"f152f1f75d1fdc72ed829c9d0794affa","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"f31d684cf67ce2facff3adf2461102f8","url":"static/css/22.e9b40006.chunk.css"},{"revision":"855f45b3c48ca8e7dcfd8e1e1aff99b6","url":"static/js/0.c3d61b1a.chunk.js"},{"revision":"9269b71e468c72266893596989f94ed7","url":"static/js/1.ae3a0985.chunk.js"},{"revision":"970f56868780b941b66c214f0d0f8ed2","url":"static/js/12.6fb2a888.chunk.js"},{"revision":"0249cfb723e3d3e7f1de7bdd55a1737b","url":"static/js/13.d198dea4.chunk.js"},{"revision":"f2ee046e0e1203b2d9b712789edce9b5","url":"static/js/14.f9bcc369.chunk.js"},{"revision":"0ebb5b1b0d3884065381cb23a73c0888","url":"static/js/15.ef07b8f2.chunk.js"},{"revision":"2eda117f2428b672888bc32c334914b6","url":"static/js/16.8694e312.chunk.js"},{"revision":"491a6577424756eb548924d2dcec3930","url":"static/js/17.ccd9bdc6.chunk.js"},{"revision":"3c28157485f42a458206482a6d0f779c","url":"static/js/18.88285c09.chunk.js"},{"revision":"bf4cffa2602a37a8e6dfd4f86317c60c","url":"static/js/19.ccec2e7e.chunk.js"},{"revision":"1719be0aed4a647ef0a0b11dca617c68","url":"static/js/2.2d42af5e.chunk.js"},{"revision":"d9e334fa63dba05538435d8b9a9456df","url":"static/js/20.a2f6de6e.chunk.js"},{"revision":"231b7c9a92461850a119244687becc20","url":"static/js/21.a6ba2757.chunk.js"},{"revision":"921a2f21c0988edce105c5d924cb319e","url":"static/js/22.c931fde9.chunk.js"},{"revision":"2ff815557876cda8f17659d75da1acdd","url":"static/js/23.c43f4564.chunk.js"},{"revision":"7e6f6b20844a50071a2b956a8f4cc18b","url":"static/js/24.ed302c4f.chunk.js"},{"revision":"ef1f006a40695899b4a4a10e680d7b39","url":"static/js/25.82ae13c4.chunk.js"},{"revision":"aaf53873cc237765b3e331690f83ae3b","url":"static/js/26.e5e7c7ac.chunk.js"},{"revision":"c828eb8c6c7b52467d098000e5887e61","url":"static/js/27.4cbf4235.chunk.js"},{"revision":"27cae01b502214954a31f7937b53141d","url":"static/js/28.6d788c3c.chunk.js"},{"revision":"a246f3afe64faa60659798527afbd5ee","url":"static/js/29.82f77d12.chunk.js"},{"revision":"cd41a479576f4cfe9e6c703d0beeaef8","url":"static/js/3.d6dd2746.chunk.js"},{"revision":"6db7c392872793d3c70ff2c438b25b91","url":"static/js/30.e7e2d5ed.chunk.js"},{"revision":"898a21959ab6bbe3063ea7af3936ac34","url":"static/js/31.6e560c8b.chunk.js"},{"revision":"104b1c82545799bf938b5ba1c410448f","url":"static/js/32.670d9e65.chunk.js"},{"revision":"5051d72ba084f43b91ea6dd20f646764","url":"static/js/33.f3ae6d35.chunk.js"},{"revision":"c4456bcfc7926024c83534a7e44bc2bc","url":"static/js/34.c649d34e.chunk.js"},{"revision":"71dfd3aa718a9242113a9b3eb5a81e43","url":"static/js/35.522d029e.chunk.js"},{"revision":"b7979abd60d5b57f677d6bc575edea5d","url":"static/js/36.2a488326.chunk.js"},{"revision":"6f93db8fd729a0092707f33c6ee1c492","url":"static/js/37.b39e9662.chunk.js"},{"revision":"aaec02ecb94f5129251899ce4cfeec87","url":"static/js/38.7d4da6e4.chunk.js"},{"revision":"3b263afe2bce708f333341c094931018","url":"static/js/39.03dfa6d5.chunk.js"},{"revision":"e0450f8439a75e23a0b36876cd4ed985","url":"static/js/4.fff38bbd.chunk.js"},{"revision":"0de1a07c746859148d32bed3b4857236","url":"static/js/40.e88ce858.chunk.js"},{"revision":"7ab5e9e49bc10b87fffbbc4734636fd9","url":"static/js/41.5ad9ffcc.chunk.js"},{"revision":"eb6f260801ec648e1d35d8752b20a314","url":"static/js/42.76dba1ca.chunk.js"},{"revision":"8edac4e9925774c9538832a835ada6fc","url":"static/js/43.ee481746.chunk.js"},{"revision":"8dc5b2dfa6619ec172db6c1d0fd474d5","url":"static/js/44.230d9a41.chunk.js"},{"revision":"86c72966c7a93052bbeee2d6c696b3b8","url":"static/js/45.b83c0f6a.chunk.js"},{"revision":"1792931de64e967c87b3e8153f0288c3","url":"static/js/46.36694db6.chunk.js"},{"revision":"63bc879f94d8e5de52f9aebe8ea89ce6","url":"static/js/47.f59ff91e.chunk.js"},{"revision":"3fe53582a410ab46a4503e9c4d26ae68","url":"static/js/5.13c10a2c.chunk.js"},{"revision":"31842eff04dc1e02afa1ddb4bd93bbbd","url":"static/js/6.d909d3cf.chunk.js"},{"revision":"666c1ba1cab90d93658d1527f90e1d89","url":"static/js/7.6f9a959e.chunk.js"},{"revision":"b4b6f69b57a7e8aacef33785acd6fbbd","url":"static/js/8.707b959b.chunk.js"},{"revision":"60986cfe0b08e4dc9f82c10c78b6850a","url":"static/js/9.758369c0.chunk.js"},{"revision":"684ea01c823c6312b2cc94c745e8df0b","url":"static/js/main.f7567dd2.chunk.js"},{"revision":"dd3f49e83d8b8bea067e6aecc7a67938","url":"static/js/runtime-main.6989cc71.js"}]);

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
