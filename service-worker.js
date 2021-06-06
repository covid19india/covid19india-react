if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"773ee40b7669af6eb7935bede2277f7a","url":"404.html"},{"revision":"460e2171184a144d1b778416a9389f37","url":"c3dbf9379de3f7b9fe4a.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"773ee40b7669af6eb7935bede2277f7a","url":"index.html"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"49fcb402356d195c262211ea8a9775f5","url":"static/css/22.8a1b2e17.chunk.css"},{"revision":"52d1a506f485db6d972c879eb08b1b49","url":"static/js/0.d494f3d4.chunk.js"},{"revision":"fd38677cfedf8f7dd2a06b94333ebcbb","url":"static/js/1.30c8a588.chunk.js"},{"revision":"0a280261e940d4d23875b175c55b6594","url":"static/js/12.b172132c.chunk.js"},{"revision":"81dac5295aceec6d9d14befb56c626da","url":"static/js/13.cd1d5c81.chunk.js"},{"revision":"82a975c293e0eec78a561368ed95471c","url":"static/js/14.4a816c1a.chunk.js"},{"revision":"9382fd4f48cdf9f539abde5b6a480338","url":"static/js/15.91817b0f.chunk.js"},{"revision":"0b3352b07d602b5f2a81309c9e600c5a","url":"static/js/16.6fa26487.chunk.js"},{"revision":"fdc9f01619b5f82e1dd9738c9c1361cc","url":"static/js/17.b3fc4c7f.chunk.js"},{"revision":"e19776785047b692d3a2f97921df9677","url":"static/js/18.e7297fcf.chunk.js"},{"revision":"d02ebaf0ce0436c0ac9a46e59c5ee582","url":"static/js/19.b0f5089d.chunk.js"},{"revision":"2055b6c43d9f9dcbeb72af2a94440361","url":"static/js/2.cb3c13d9.chunk.js"},{"revision":"a0521090da797033e4675e68c9f08f1b","url":"static/js/20.2062f38e.chunk.js"},{"revision":"7c0911f383cca257581299d50fb3c08f","url":"static/js/21.3e809ef8.chunk.js"},{"revision":"e8db30852b569d95af42f6c38aaabb0f","url":"static/js/22.dc0ecb34.chunk.js"},{"revision":"e80ca9e6e55d0d16edbc73ccabe72b72","url":"static/js/23.f1de8b11.chunk.js"},{"revision":"70481e28be80cdcfe206327edb598341","url":"static/js/24.05b8853b.chunk.js"},{"revision":"a38d66a27347dbdd2f03763a9ddb68b2","url":"static/js/25.8ee041c7.chunk.js"},{"revision":"b316a61e63d18211435be4c7eadac62f","url":"static/js/26.e1f859db.chunk.js"},{"revision":"34f0b3c2e1dd2c9052ecad6ad0fdc889","url":"static/js/27.3b134291.chunk.js"},{"revision":"08e8724e49e5c6cc79753b6a5672997c","url":"static/js/28.f88af1dd.chunk.js"},{"revision":"e2109e0527f438155232af0d8d17817c","url":"static/js/29.51c561e5.chunk.js"},{"revision":"6332c46235cdc7876f754c25abe95c74","url":"static/js/3.a6c33ad3.chunk.js"},{"revision":"40533ec5f5caf14208ee3c291661dbb5","url":"static/js/30.c2271c33.chunk.js"},{"revision":"a1c26b6d8b0fb3e9b2387a380894fe30","url":"static/js/31.0c6c91c3.chunk.js"},{"revision":"31b468abff868e867a18404863572426","url":"static/js/32.54e327cf.chunk.js"},{"revision":"5151a8d1b976bffdf3cfc76c85ba4f84","url":"static/js/33.26e12be6.chunk.js"},{"revision":"c27cdbac78b2da1d1db21356865ca805","url":"static/js/34.5748bd9f.chunk.js"},{"revision":"eb2856f4c7b4e6d508ad2c38044b0154","url":"static/js/35.a10b476f.chunk.js"},{"revision":"e90ee6db1da2acb8999e469857e393fc","url":"static/js/36.28a8a5c9.chunk.js"},{"revision":"5ee212e5c6eea1c8b411f69d4e0cb5b1","url":"static/js/37.5819e405.chunk.js"},{"revision":"e2225ebaf01f4f4df23b47ea5d290396","url":"static/js/38.afca02f5.chunk.js"},{"revision":"1a3eb6f463dc1c6b005b5cd43d8f8966","url":"static/js/39.2b967712.chunk.js"},{"revision":"08c595940bd1228edb369f86cd6dc26e","url":"static/js/4.b7b6b4a3.chunk.js"},{"revision":"602c9b53dad3eb517a4cc68b151b2c03","url":"static/js/40.51513f3b.chunk.js"},{"revision":"d3f97a52ee73bbce8ba7753cb5c6eb9d","url":"static/js/41.7c8a73a2.chunk.js"},{"revision":"732007672a2fbfbdb1db2eaf257eee39","url":"static/js/42.9966f5e9.chunk.js"},{"revision":"0acd04ca5124f489753a9d09b9956c77","url":"static/js/43.8cf27cbb.chunk.js"},{"revision":"4d367ca7def730e18169698f9a27b3c6","url":"static/js/44.8f35a58b.chunk.js"},{"revision":"4d56c6ef5b6b8a3f45ffe19d05f91733","url":"static/js/45.36986d0c.chunk.js"},{"revision":"f68672aae915810fc2dc84dc380947d4","url":"static/js/5.738e135f.chunk.js"},{"revision":"feb3e5b7256d0f32988fd00c3d08ecff","url":"static/js/6.6e82bf4c.chunk.js"},{"revision":"200e386e210e400e5bacad5d8c6a6480","url":"static/js/7.bc2bb957.chunk.js"},{"revision":"7d104a4493be60fba70b051b85180ec3","url":"static/js/8.1c4ebeb4.chunk.js"},{"revision":"6b84b53b7a9c9397d655060cf872ff41","url":"static/js/9.99fe3708.chunk.js"},{"revision":"a5d1cfa43f81fe45c5bdd4ae6cb603bc","url":"static/js/main.002c29ab.chunk.js"},{"revision":"64c5ce71fd9371ad768ed8196aad14c5","url":"static/js/runtime-main.d73bdd72.js"}]);

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
