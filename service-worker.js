if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"debcd64ab09da56833c8c1f7af2f4212","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"debcd64ab09da56833c8c1f7af2f4212","url":"index.html"},{"revision":"b8ce019641d321683ca59b0c6ef0ac62","url":"precache-manifest.b8ce019641d321683ca59b0c6ef0ac62.js"},{"revision":"776314042e7d4d1a84310cef9369793c","url":"static/css/14.f4c836b0.chunk.css"},{"revision":"ea4df879eb870ee7510190ab45cd7b02","url":"static/js/0.48b63423.chunk.js"},{"revision":"60835450a186781f97f69637979a21f2","url":"static/js/1.ce863550.chunk.js"},{"revision":"a8bf7e42a7d848a5cc6606905a5ff2f9","url":"static/js/10.ea0bf2d3.chunk.js"},{"revision":"546bcb104ebecfe341e481c09f87b3b0","url":"static/js/11.c8cc9da9.chunk.js"},{"revision":"de3fbf9e94753e77c56e2436ab96cb16","url":"static/js/12.375f5272.chunk.js"},{"revision":"44ea4e9dc370516c93cbf1963d0de7e4","url":"static/js/13.2288208a.chunk.js"},{"revision":"d08f091425760683e643f521654e8d44","url":"static/js/14.824dc4e7.chunk.js"},{"revision":"53109b42b3c42301d73ac187e1aa0873","url":"static/js/15.39d4d25c.chunk.js"},{"revision":"7816a58ac7377b1ea4b6f30c16d775fb","url":"static/js/16.071350e6.chunk.js"},{"revision":"0efe1158608dcc79629a50ecbe7f275a","url":"static/js/17.84e8cb84.chunk.js"},{"revision":"b3f837703f036072acc8e0bd95838470","url":"static/js/18.fefb0870.chunk.js"},{"revision":"ef08251ad8dbda373482dd6e1ac3cabc","url":"static/js/19.6516336e.chunk.js"},{"revision":"447d0838c67e6d123e4ae132593db20c","url":"static/js/2.f2ec6b08.chunk.js"},{"revision":"b07cbbc33efec72dd1c8c58bf522777b","url":"static/js/20.91c8bf34.chunk.js"},{"revision":"abd8ba58054c4dddf689435621afbe92","url":"static/js/21.db6ae416.chunk.js"},{"revision":"13a64fbbcb0b14fa8575dc847127016d","url":"static/js/22.c655f49c.chunk.js"},{"revision":"8d820919ec66bb722add00e6cb2b8494","url":"static/js/23.840ce23d.chunk.js"},{"revision":"e34f2151e608976c2181538ae4439229","url":"static/js/24.adbed46e.chunk.js"},{"revision":"433204ca03df3bfcabcfcb54ec759174","url":"static/js/25.97a632a5.chunk.js"},{"revision":"3490851c38d069b1e789367437bdb16a","url":"static/js/26.ac405749.chunk.js"},{"revision":"a0c7f1ecc7cbfb925d1f4f7dd5a18cdf","url":"static/js/27.2a6dbbdc.chunk.js"},{"revision":"24bdda3db8553e9c947e12fb74e559c5","url":"static/js/28.6166b8f1.chunk.js"},{"revision":"a5a3f9056fb91c6ef2db1317d307eae4","url":"static/js/29.89bd5195.chunk.js"},{"revision":"ac92cf7a3325e3c944e17218e363a34f","url":"static/js/3.746c98f4.chunk.js"},{"revision":"1eac02d69edb65c9a2b96019f700afb3","url":"static/js/30.fccc1055.chunk.js"},{"revision":"b4fe743461672842adb905665ea6a3db","url":"static/js/31.3036da29.chunk.js"},{"revision":"f304c7c8784124a80aaeef93cbc0a5b9","url":"static/js/32.9b815896.chunk.js"},{"revision":"a18329be84338c6761724c1dea8697d3","url":"static/js/33.15aa7a35.chunk.js"},{"revision":"f96e4a708b7cadf2618d16e590283953","url":"static/js/34.c868da68.chunk.js"},{"revision":"8f2600efad921d5bf6a034bd69ef365a","url":"static/js/35.e8330e90.chunk.js"},{"revision":"fe60b817cfedd2e61f4337a6cc22516a","url":"static/js/36.e6b605b3.chunk.js"},{"revision":"22a06850353c27f2b0fa8fc2c4f4e6bd","url":"static/js/37.0c469bf6.chunk.js"},{"revision":"f2d70e4ea1e976790a59fc2c1dbb2562","url":"static/js/38.1a6d68e1.chunk.js"},{"revision":"0970c109a00d45444a8d685a08a1e7a5","url":"static/js/4.6e923618.chunk.js"},{"revision":"17cf5f328ce7c5bbab01d4bdb0dbff25","url":"static/js/7.a33d71eb.chunk.js"},{"revision":"d4a963ccc71ee9c1c78e4b62083805d2","url":"static/js/8.b84ad537.chunk.js"},{"revision":"87211b7b1ac88b6c48ff030b2ca5fdfb","url":"static/js/9.fd6e571f.chunk.js"},{"revision":"9181fe57b3581430ea725cbb08e15a1e","url":"static/js/main.0a168ddb.chunk.js"},{"revision":"56c1558a7934778f8bbaee18a11346e0","url":"static/js/runtime-main.d181b70c.js"}]);

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
