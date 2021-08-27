if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"3993e6181af2000e44dd3be7ee019da5","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"3993e6181af2000e44dd3be7ee019da5","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"a66872bead1f894a79ea2488187e8ff2","url":"static/css/20.f5f9d973.chunk.css"},{"revision":"dc5409ff49a47801e91bc0fd82c00b4c","url":"static/css/21.b82d8140.chunk.css"},{"revision":"038a830223503314180873a2c08b9a52","url":"static/js/0.3d2b55ab.chunk.js"},{"revision":"5e5d15ad8ded933dd2625d0d7ee089b0","url":"static/js/1.64c1c1ef.chunk.js"},{"revision":"b2b36ba74ff7557b0696ee8c3f06b696","url":"static/js/11.0d4e9953.chunk.js"},{"revision":"7d21a3c1c917c5cda875fb2ca49d3edf","url":"static/js/12.1d4a1b78.chunk.js"},{"revision":"1cdc68ac5da721f8eb267ce214e8beda","url":"static/js/13.343896c0.chunk.js"},{"revision":"5ad544c358ce0fca479b22ff1891f08b","url":"static/js/14.7cb6d7c6.chunk.js"},{"revision":"001dbf76589195de13979b9df2d09126","url":"static/js/15.0f4fd666.chunk.js"},{"revision":"d2d907a2f36f4781561364e5e6139d59","url":"static/js/16.e079b83b.chunk.js"},{"revision":"a8c168e18c92a2090303bb4538ed6502","url":"static/js/17.c6ed984e.chunk.js"},{"revision":"bca34ff4c617cc5ca549e07f9205c7d2","url":"static/js/18.954979c2.chunk.js"},{"revision":"887c6ceb274b38816beb62db6b946417","url":"static/js/19.ec480231.chunk.js"},{"revision":"9e1d7b65707ab45fc810945d17a1cee4","url":"static/js/2.366b601a.chunk.js"},{"revision":"189a9cbf081207db711d47c186cd9d6b","url":"static/js/20.cf92ba7a.chunk.js"},{"revision":"7aac7d8cf89bb37b224dc8ea091368b7","url":"static/js/21.f057e7ec.chunk.js"},{"revision":"48ab8f7a88b5f61a5f6fdaa3083f45a5","url":"static/js/22.be353b22.chunk.js"},{"revision":"30ff9f7afe77f58ddbacdf13a394b52a","url":"static/js/23.e375bbea.chunk.js"},{"revision":"b8d1d7def59073561a8288ee814ef2e6","url":"static/js/24.813174db.chunk.js"},{"revision":"8ad2ff7666fc043c0895b3f853be7058","url":"static/js/25.ef9bf400.chunk.js"},{"revision":"9b881d6348ab14b549b1110fc72b7ef6","url":"static/js/26.d6c5ece2.chunk.js"},{"revision":"a24bc291f989324c25c346df607e4676","url":"static/js/27.e160a016.chunk.js"},{"revision":"4557232d0f089b721d3f57bd27152bf2","url":"static/js/28.8f0c2cae.chunk.js"},{"revision":"48194dea49e4516cd788f9f3bcb9b3aa","url":"static/js/29.26240f52.chunk.js"},{"revision":"fba2f51015d2c770d3cf38c182f21477","url":"static/js/3.4fab005e.chunk.js"},{"revision":"d81edb3b8e1918e8dee11d8f98bc71fc","url":"static/js/30.a00c3542.chunk.js"},{"revision":"c39df0775acdba4686c92d5ebb67743d","url":"static/js/31.87f31d86.chunk.js"},{"revision":"f6c5df46bfbdc603364e1ce266d9711b","url":"static/js/32.8bd98a05.chunk.js"},{"revision":"05ca83692ef43b5082d956616c600fd9","url":"static/js/33.109a31c5.chunk.js"},{"revision":"c5ef2727fb51e3b45cc19c710bee9db6","url":"static/js/34.2d7110e7.chunk.js"},{"revision":"8aa1dfe73d6031b2a52fda96062c8623","url":"static/js/35.792d70b9.chunk.js"},{"revision":"f4b195a8d92cef4c81732dc0672b0a05","url":"static/js/36.db5e9229.chunk.js"},{"revision":"5ea43bc597d87e5fc19625af17fa6692","url":"static/js/37.41a3b7be.chunk.js"},{"revision":"79a5a5c0b8806ef3072fbaca25fe5fcf","url":"static/js/38.62e146a4.chunk.js"},{"revision":"127119f6c5728bf1581c712537b71fc5","url":"static/js/39.bde8aa98.chunk.js"},{"revision":"a01cebf2d8302261b57ec08261972ba1","url":"static/js/4.c6f23ee7.chunk.js"},{"revision":"1d9cee0612bc8ef86bffd2923363f485","url":"static/js/40.78514dc4.chunk.js"},{"revision":"f25cbec82d6287bca7418bf801d7a02f","url":"static/js/41.18855fd1.chunk.js"},{"revision":"21c30dc942c53ed25a22fee9a92397e0","url":"static/js/42.c78e1e7c.chunk.js"},{"revision":"14a9b9ac021c611b6c657e4409fd77ef","url":"static/js/43.5f9df5ca.chunk.js"},{"revision":"27d2c4c246228d68e15d3132b18ab7c1","url":"static/js/44.62a159f1.chunk.js"},{"revision":"7c2148685552e89d835bb622bd9517ae","url":"static/js/5.44ebdf6e.chunk.js"},{"revision":"fabfd06e7bddf8ee9e28e094b7337f1d","url":"static/js/6.2269dc02.chunk.js"},{"revision":"c7809e28faf7d3fd0098fae614bc96fb","url":"static/js/7.1049bb21.chunk.js"},{"revision":"a883dcfee941b8f5cd6bbbd8f1efb228","url":"static/js/8.f7eeb7cc.chunk.js"},{"revision":"3659b540fe3d805c9ac62424880fc231","url":"static/js/main.fd878e26.chunk.js"},{"revision":"fe6cf385d11ab9f4e4f93a6e2ac4a5eb","url":"static/js/runtime-main.e5b1fc37.js"}]);

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
