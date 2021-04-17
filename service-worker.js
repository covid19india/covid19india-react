if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"84e9f034129ad37895b2986757e76b15","url":"404.html"},{"revision":"9ec9216728dbf5a2c2a2b69256419662","url":"8ae050b0e0e914e9c1ae.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"84e9f034129ad37895b2986757e76b15","url":"index.html"},{"revision":"ee193d41615fb8cf1732f6191cb78d96","url":"static/css/22.f5f9d973.chunk.css"},{"revision":"f215608a7ce073a74dafc9c9baa3ea22","url":"static/css/23.e7bf9b77.chunk.css"},{"revision":"1f0d9eb00969b4b1bf75af316734e22f","url":"static/js/0.3ed53e4e.chunk.js"},{"revision":"760220a79b2621d48480b556a2861aa9","url":"static/js/1.5646fa25.chunk.js"},{"revision":"862f6eb27e1daa4a9947272c1ccbd2be","url":"static/js/12.57fe4216.chunk.js"},{"revision":"d5e8a41a8c22ee2163abf7ff76fb2eef","url":"static/js/13.589da67e.chunk.js"},{"revision":"87e3317061b80854ffb45ef7a03b47a2","url":"static/js/14.117f9b94.chunk.js"},{"revision":"803b89cd091ac0ad4cd935fd9c346d2e","url":"static/js/15.21df75c8.chunk.js"},{"revision":"c05dba4098df22cf24bc8793f0e0c65a","url":"static/js/16.6fbf9292.chunk.js"},{"revision":"690b1281e472b3589906a4e06d41029b","url":"static/js/17.ab1a5b2a.chunk.js"},{"revision":"5d5184a0f8e9e0f4b8cf9a8eab6616b6","url":"static/js/18.0f47b3bd.chunk.js"},{"revision":"8bc9dfdd8a0f6d448c75907d2e78de31","url":"static/js/19.1b3b4902.chunk.js"},{"revision":"84e50f3cbc81998f2a6b7438626019ac","url":"static/js/2.29815398.chunk.js"},{"revision":"12d49eaa15f864a43e137e47b9c4d533","url":"static/js/20.103bea74.chunk.js"},{"revision":"bedce5b1b154019b9b752b45c200dc05","url":"static/js/21.ce8d6581.chunk.js"},{"revision":"fdbc56a711a83e85bf3b47eca389d55e","url":"static/js/22.5b5cd9f8.chunk.js"},{"revision":"b7898ad00501c70e8b02f52bf4da6623","url":"static/js/23.82612c42.chunk.js"},{"revision":"753bdcf1e0b3c273f06d7e2c2a4f654f","url":"static/js/24.518d6192.chunk.js"},{"revision":"6b79febbaa633615d1c3a2c028b987f6","url":"static/js/25.bcd24197.chunk.js"},{"revision":"651e21e117930b453692ec86241bd3d0","url":"static/js/26.800f4530.chunk.js"},{"revision":"44674ebe027ad2b6aaf669cb31af0622","url":"static/js/27.3c2edf98.chunk.js"},{"revision":"0ffe6049bd166560f90a4f72656095ae","url":"static/js/28.be409af6.chunk.js"},{"revision":"edaaf4fa03e9685ccc87526b62450ee4","url":"static/js/29.412f2106.chunk.js"},{"revision":"b4c4218449c7f21392bb04d7c9ca9d09","url":"static/js/3.e0a2cb24.chunk.js"},{"revision":"bd04e9045358eaa6b31cb3d925cdc951","url":"static/js/30.0af3316b.chunk.js"},{"revision":"7c2408910a452012abde0e43bc904beb","url":"static/js/31.8a218ec7.chunk.js"},{"revision":"ef7d442499f19d3d42f08c9869dde71f","url":"static/js/32.7c6a341f.chunk.js"},{"revision":"a79521db568b13a7c87feb85b840dec5","url":"static/js/33.d45f15a5.chunk.js"},{"revision":"bd53c3b7bfe13d31309ee28d4169e14c","url":"static/js/34.6a43b5b9.chunk.js"},{"revision":"9f6146f4cd4a077b584ecd77815a367d","url":"static/js/35.999cdea4.chunk.js"},{"revision":"ec25f618f51c278360c4894e61c875ad","url":"static/js/36.dc9d6053.chunk.js"},{"revision":"07f1445bfb591a1eabcf1aaddcd0d0f2","url":"static/js/37.47782f99.chunk.js"},{"revision":"83f8b36f92ad21c801c6fabbd9a751a1","url":"static/js/38.f298c98a.chunk.js"},{"revision":"109485fe549a536a41c5a7ec66184fbd","url":"static/js/39.574051dd.chunk.js"},{"revision":"2557c1e57ec907adfa6de773895a8aa2","url":"static/js/4.f37ff0b3.chunk.js"},{"revision":"aa269438d4f8c1bc6e9c473d81e71740","url":"static/js/40.97d17e29.chunk.js"},{"revision":"7b985fa6d67f32d2a04e6e80697f8325","url":"static/js/41.6f09d612.chunk.js"},{"revision":"97678fa9d92fc1082ab902b08ebc10f6","url":"static/js/42.7607ff11.chunk.js"},{"revision":"98db1356a42148ada5046a422a61dec2","url":"static/js/43.cd1a65a5.chunk.js"},{"revision":"b47c69194e35778e913be24460a047cb","url":"static/js/44.b19a807d.chunk.js"},{"revision":"19af5a60b58cc728aadb722836b45edc","url":"static/js/5.05ae4db6.chunk.js"},{"revision":"6d36778e5824ef7eb8f353a16e93d69e","url":"static/js/6.7b9eb895.chunk.js"},{"revision":"2187d62bc16ac0a6108bb99a2b2e088a","url":"static/js/7.b6eff206.chunk.js"},{"revision":"af4d0e03fda2ed1244e9cab62f8397be","url":"static/js/8.e533d5c6.chunk.js"},{"revision":"2dde015f84ad6205243719fffdaa6268","url":"static/js/9.35309f2e.chunk.js"},{"revision":"4758af26351ed53f9b891272ccd04e66","url":"static/js/main.25a33a04.chunk.js"},{"revision":"bacce47ea40e028f54e24f93cacaeb62","url":"static/js/runtime-main.0120a72b.js"}]);

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
