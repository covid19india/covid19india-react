if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"ae7bbe444ae7a5b54d17148cb823c830","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"ae7bbe444ae7a5b54d17148cb823c830","url":"index.html"},{"revision":"1c888d66457cad22d4e9e91e0d1a0a82","url":"precache-manifest.1c888d66457cad22d4e9e91e0d1a0a82.js"},{"revision":"659fcbdcf1070cd596a9ed8ef5f80710","url":"static/css/15.aa9ef476.chunk.css"},{"revision":"d821572059e39b842a8ca128be7e6a5e","url":"static/js/0.7742e829.chunk.js"},{"revision":"07781eaada39f28c749d1210e05df777","url":"static/js/1.ee8294cd.chunk.js"},{"revision":"3083c03147bfba00208c416d18cce9c6","url":"static/js/10.d39aef6f.chunk.js"},{"revision":"ab405289b067b0b454cea200cb6f60da","url":"static/js/11.81b400e8.chunk.js"},{"revision":"c44cbe293ffa1f03402a2cad154800f3","url":"static/js/12.886ae44b.chunk.js"},{"revision":"e31999987d9b07b2bac01d698b5be75f","url":"static/js/13.b37925d5.chunk.js"},{"revision":"0d4217a71e3ad5faeb0660d7656d207a","url":"static/js/14.d58b11f0.chunk.js"},{"revision":"1e6e59613682d35449f4bf4076bd4e06","url":"static/js/15.ea824b15.chunk.js"},{"revision":"006f41a54023426d9e153ad9e64b07ca","url":"static/js/16.ebdf7f64.chunk.js"},{"revision":"b8239f0a7f530369c08395c5762c74ca","url":"static/js/17.f080e359.chunk.js"},{"revision":"ddc69812ad017013c0ccbba51d2d9de8","url":"static/js/18.690573cc.chunk.js"},{"revision":"01431f83ed56d6ae70f0ae4850802a62","url":"static/js/19.38a87f6c.chunk.js"},{"revision":"b1b16163e9892cf63112fc5de9b2d4e9","url":"static/js/2.50df0a76.chunk.js"},{"revision":"38eda61108660776d9fac8dbfd47547b","url":"static/js/20.b219e8bc.chunk.js"},{"revision":"8d7a466bb7160db25d56e74f159d333f","url":"static/js/21.b9198d41.chunk.js"},{"revision":"d4ba704abd8b1895eea50950ee672bd7","url":"static/js/22.368f52ef.chunk.js"},{"revision":"8d62fb04283c3bdb6557883c52ada494","url":"static/js/23.ea6bebe0.chunk.js"},{"revision":"f04462c28955c296765e8a2f60ba9fc7","url":"static/js/24.046b5fe1.chunk.js"},{"revision":"1364d1a731704b5f9267e0e9020952dd","url":"static/js/25.302bbce2.chunk.js"},{"revision":"cc526fb5eb1fd43d0b6970ce0dd764eb","url":"static/js/26.df6ccd9c.chunk.js"},{"revision":"ecc845ff17ff0b833e22ab481372e608","url":"static/js/27.b95a1e2f.chunk.js"},{"revision":"396f1274888821ae8bf68f672b198214","url":"static/js/28.79dca404.chunk.js"},{"revision":"8a9ca173400f19495230712882c9f482","url":"static/js/29.3a3ce018.chunk.js"},{"revision":"27b4db684c521f9a659ff6095bcfb271","url":"static/js/3.1a55f62c.chunk.js"},{"revision":"71e11e12819acb28f74a7d85eee52fe4","url":"static/js/30.751976ba.chunk.js"},{"revision":"7ac56fcbd470e406ed4f1eb2f4ceaf34","url":"static/js/31.c22086b2.chunk.js"},{"revision":"85c4222163137a0ebfef2b4bd994ddb6","url":"static/js/32.f0a8f468.chunk.js"},{"revision":"ea0ad94b3948673a3d3dc8458ab0c203","url":"static/js/33.dcc45d5a.chunk.js"},{"revision":"1762c6041f3a301a1a6c0f34fb5c70ef","url":"static/js/34.5bfe4f40.chunk.js"},{"revision":"bbfd2f3cf77b9dd9d4241267ab1ae96c","url":"static/js/35.6e8d91aa.chunk.js"},{"revision":"903cea094a7920b723a81d0c196c0d73","url":"static/js/36.f4629458.chunk.js"},{"revision":"4d0a502e05c2d3598401d45ffcd91d22","url":"static/js/37.1df2839e.chunk.js"},{"revision":"0da172d7114e4b4f5e8589b944613ca8","url":"static/js/4.8273d6d1.chunk.js"},{"revision":"e3fa7f67ebc18b0b4477d12890a9a056","url":"static/js/5.ad370cba.chunk.js"},{"revision":"d92b1ff0fa4ffab8201fd03dd176ff98","url":"static/js/6.d8f0c763.chunk.js"},{"revision":"124eb96115a679a77050cd2cf201cd83","url":"static/js/9.e6fa575e.chunk.js"},{"revision":"9a346a35737dbffeb4ed050ee0b76a35","url":"static/js/main.03ec6c54.chunk.js"},{"revision":"756cad47f9795d35ed8aec3d6b1d3d00","url":"static/js/runtime-main.c6774e6d.js"}]);

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
