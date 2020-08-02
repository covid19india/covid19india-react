if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"497d3a2a6362e8139ba98d29c1c20723","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"497d3a2a6362e8139ba98d29c1c20723","url":"index.html"},{"revision":"05d5167a41335c1c74ae3a0bb5d69f57","url":"precache-manifest.05d5167a41335c1c74ae3a0bb5d69f57.js"},{"revision":"659fcbdcf1070cd596a9ed8ef5f80710","url":"static/css/15.aa9ef476.chunk.css"},{"revision":"d821572059e39b842a8ca128be7e6a5e","url":"static/js/0.7742e829.chunk.js"},{"revision":"fbadcc4f327904d1e3accba99aed870b","url":"static/js/1.f63f7f98.chunk.js"},{"revision":"16aada5c1c5694505e5cf123a16071de","url":"static/js/10.e499401a.chunk.js"},{"revision":"c0819e8237f51ace5b618dcc956337fd","url":"static/js/11.69ac2a06.chunk.js"},{"revision":"918914ac1333ffa1ed87726b078c9f87","url":"static/js/12.f412ffe8.chunk.js"},{"revision":"3a44e3c7d96319a20cccc9890d66f1a4","url":"static/js/13.366a99e1.chunk.js"},{"revision":"5f893de583b08631aa1ef3485ecbc2db","url":"static/js/14.1ae5ae42.chunk.js"},{"revision":"92fc7825e37c8a6fa0d5c8e63d14f706","url":"static/js/15.dc6b0e40.chunk.js"},{"revision":"e13b903bf90ca7c1ea24b7b1e3850402","url":"static/js/16.02d2665f.chunk.js"},{"revision":"91e6142f36a43c263c60f572ef459246","url":"static/js/17.bc94136d.chunk.js"},{"revision":"926a7a23274bb479bf1b3081c75e2a49","url":"static/js/18.f3494b4d.chunk.js"},{"revision":"4f2880b2e926afdbb7b2907a7593b6a4","url":"static/js/19.40beb627.chunk.js"},{"revision":"e7c261ab13e95ba1df031aa9e971032b","url":"static/js/2.3440eef0.chunk.js"},{"revision":"fe367f3501abd89787a5c091f09af5c4","url":"static/js/20.a37579ef.chunk.js"},{"revision":"a1c94636453b64441580496942241465","url":"static/js/21.950fbd4b.chunk.js"},{"revision":"543255b1b8fbe11802601783396d58b6","url":"static/js/22.dae76627.chunk.js"},{"revision":"a38a384ad358941dae14e3e18b83b5a9","url":"static/js/23.37942ab3.chunk.js"},{"revision":"8e096c09a46a9b27562c22b55593216e","url":"static/js/24.77120163.chunk.js"},{"revision":"b5a89ba4d1afe6779aae42cb5062e41e","url":"static/js/25.8f686a84.chunk.js"},{"revision":"1fcc7ef50838b269645f8bac3a2b4b90","url":"static/js/26.444cce70.chunk.js"},{"revision":"684f2aeb46216ca777cee1376cde3f19","url":"static/js/27.4b2215d9.chunk.js"},{"revision":"ca0980d8ab8bf5c8019ac5a73da6e867","url":"static/js/28.b3659fe4.chunk.js"},{"revision":"21f8254c505464a443f873a808c41958","url":"static/js/29.c6acc42b.chunk.js"},{"revision":"27b4db684c521f9a659ff6095bcfb271","url":"static/js/3.1a55f62c.chunk.js"},{"revision":"77a3ff254fe226c90781e94ef824a398","url":"static/js/30.989e1062.chunk.js"},{"revision":"b5278eceb88bb9000661f1c5e46d417c","url":"static/js/31.6c15338f.chunk.js"},{"revision":"ccfc32b9a86c7f6070f2afb0cdde8330","url":"static/js/32.159ca789.chunk.js"},{"revision":"a20b3511efc68a9c032618d76a3a94fc","url":"static/js/33.53c22020.chunk.js"},{"revision":"1d386b86f769c9925576beca1327f34a","url":"static/js/34.d0857f24.chunk.js"},{"revision":"050082c29d2b55239be85b843e791a07","url":"static/js/35.41201f73.chunk.js"},{"revision":"903cea094a7920b723a81d0c196c0d73","url":"static/js/36.f4629458.chunk.js"},{"revision":"4d0a502e05c2d3598401d45ffcd91d22","url":"static/js/37.1df2839e.chunk.js"},{"revision":"ea8602608932d707c1931f7e8baa3868","url":"static/js/4.bcd2e3a7.chunk.js"},{"revision":"9f617a9f2037c3ea182245f816e6ff4d","url":"static/js/5.35de881d.chunk.js"},{"revision":"1a1b5c462ca127c7bde64bc63a2723c9","url":"static/js/6.40d893eb.chunk.js"},{"revision":"124eb96115a679a77050cd2cf201cd83","url":"static/js/9.e6fa575e.chunk.js"},{"revision":"8f877cb35a66d075eb7f4e7a4b447ca5","url":"static/js/main.204c2f3f.chunk.js"},{"revision":"86ab6fd8e42154ce12e507b680ead46f","url":"static/js/runtime-main.85689e30.js"}]);

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
