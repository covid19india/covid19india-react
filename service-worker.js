if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"1f94cf376634f924d0c033d2d02ded2f","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"1f94cf376634f924d0c033d2d02ded2f","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"f31d684cf67ce2facff3adf2461102f8","url":"static/css/22.e9b40006.chunk.css"},{"revision":"855f45b3c48ca8e7dcfd8e1e1aff99b6","url":"static/js/0.c3d61b1a.chunk.js"},{"revision":"9269b71e468c72266893596989f94ed7","url":"static/js/1.ae3a0985.chunk.js"},{"revision":"970f56868780b941b66c214f0d0f8ed2","url":"static/js/12.6fb2a888.chunk.js"},{"revision":"0249cfb723e3d3e7f1de7bdd55a1737b","url":"static/js/13.d198dea4.chunk.js"},{"revision":"f2ee046e0e1203b2d9b712789edce9b5","url":"static/js/14.f9bcc369.chunk.js"},{"revision":"80c7a8d67e0b864adcdbedefd47492d9","url":"static/js/15.fc483b7c.chunk.js"},{"revision":"2eda117f2428b672888bc32c334914b6","url":"static/js/16.8694e312.chunk.js"},{"revision":"491a6577424756eb548924d2dcec3930","url":"static/js/17.ccd9bdc6.chunk.js"},{"revision":"44ba3b3295b7eea4a814f23b27ac5d7b","url":"static/js/18.d228ce9d.chunk.js"},{"revision":"56c0eaa1bc1b4f648f137752c57d5ee8","url":"static/js/19.9fc10b30.chunk.js"},{"revision":"1719be0aed4a647ef0a0b11dca617c68","url":"static/js/2.2d42af5e.chunk.js"},{"revision":"00430d94dda91c3b6290631fd744d065","url":"static/js/20.69aea1ac.chunk.js"},{"revision":"231b7c9a92461850a119244687becc20","url":"static/js/21.a6ba2757.chunk.js"},{"revision":"921a2f21c0988edce105c5d924cb319e","url":"static/js/22.c931fde9.chunk.js"},{"revision":"7b08f70d695a135b4a3659735a349ac3","url":"static/js/23.1e2321b6.chunk.js"},{"revision":"4f3faa71bbd94db7f626f5f17025c93c","url":"static/js/24.badbdaca.chunk.js"},{"revision":"ef1f006a40695899b4a4a10e680d7b39","url":"static/js/25.82ae13c4.chunk.js"},{"revision":"8b5f4d1ebb0ee7acf36cb9af9603cdd0","url":"static/js/26.afcbf979.chunk.js"},{"revision":"c828eb8c6c7b52467d098000e5887e61","url":"static/js/27.4cbf4235.chunk.js"},{"revision":"e316f80babc03b8157e06c8e85d75f97","url":"static/js/28.8107348c.chunk.js"},{"revision":"868d7a74b5c41591d05be49f22afe323","url":"static/js/29.cfea984e.chunk.js"},{"revision":"cd41a479576f4cfe9e6c703d0beeaef8","url":"static/js/3.d6dd2746.chunk.js"},{"revision":"1df6f7ec7a3ab65404c710d0722b512f","url":"static/js/30.26f5f799.chunk.js"},{"revision":"6b568c18e5934850cca836775ba1a819","url":"static/js/31.7d28c49a.chunk.js"},{"revision":"5cb96f9d09f5a01556b2df2c9962c39f","url":"static/js/32.837d2113.chunk.js"},{"revision":"95fbeda042c598158f3446342bd8e67e","url":"static/js/33.2e1ab95a.chunk.js"},{"revision":"9a1131e165821679c7ab438f216cdf11","url":"static/js/34.d806b1d0.chunk.js"},{"revision":"f887c546f6d9282b4ed296a3c9230425","url":"static/js/35.db88d558.chunk.js"},{"revision":"e5bbd07a2f32f9c3a9f18d858e1abf24","url":"static/js/36.b3bc1850.chunk.js"},{"revision":"756daf12eb20b301c194b2f4b151e515","url":"static/js/37.06e7fb1e.chunk.js"},{"revision":"3cb1da77e7311a84220ff17b282667c3","url":"static/js/38.ae421ca1.chunk.js"},{"revision":"3b263afe2bce708f333341c094931018","url":"static/js/39.03dfa6d5.chunk.js"},{"revision":"e0450f8439a75e23a0b36876cd4ed985","url":"static/js/4.fff38bbd.chunk.js"},{"revision":"0de1a07c746859148d32bed3b4857236","url":"static/js/40.e88ce858.chunk.js"},{"revision":"9c56277d1aedab11d519da4759f94400","url":"static/js/41.991d5428.chunk.js"},{"revision":"1854e426a5cd2dd25e502b956474c573","url":"static/js/42.219aa296.chunk.js"},{"revision":"8edac4e9925774c9538832a835ada6fc","url":"static/js/43.ee481746.chunk.js"},{"revision":"c49083c0975c780a7af33eed947d8a61","url":"static/js/44.54fe9e06.chunk.js"},{"revision":"8a848f42888ed236f76c6c8bd35eeab2","url":"static/js/45.2ec25db0.chunk.js"},{"revision":"bd25a50c9ee87cea1fd1d2638b6eadd3","url":"static/js/46.24534783.chunk.js"},{"revision":"63bc879f94d8e5de52f9aebe8ea89ce6","url":"static/js/47.f59ff91e.chunk.js"},{"revision":"3fe53582a410ab46a4503e9c4d26ae68","url":"static/js/5.13c10a2c.chunk.js"},{"revision":"68405395d39d509e46b315eb96d60ac3","url":"static/js/6.ad72cbe2.chunk.js"},{"revision":"666c1ba1cab90d93658d1527f90e1d89","url":"static/js/7.6f9a959e.chunk.js"},{"revision":"db8c2d9a03b9536b0b999f346de3f103","url":"static/js/8.e5a378d3.chunk.js"},{"revision":"60986cfe0b08e4dc9f82c10c78b6850a","url":"static/js/9.758369c0.chunk.js"},{"revision":"334dd6afb2543ca91287f5d7bc0b50a9","url":"static/js/main.072dec60.chunk.js"},{"revision":"7e304b66ae7f4d65b35a2e8fd3a2cb3a","url":"static/js/runtime-main.f2808830.js"}]);

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
