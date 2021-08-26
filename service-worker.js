if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"b5a16295f2a756f4303ceb8cc5348835","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"b5a16295f2a756f4303ceb8cc5348835","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"fa58b34f703b8f212cb370759f77815a","url":"static/css/22.abf343ae.chunk.css"},{"revision":"038a830223503314180873a2c08b9a52","url":"static/js/0.3d2b55ab.chunk.js"},{"revision":"7e7ca35a8a5239507508df4e63217ecd","url":"static/js/1.4e5d9725.chunk.js"},{"revision":"7f8c5c5b257eaefb40e97f7a455a4296","url":"static/js/12.af0fdcf1.chunk.js"},{"revision":"a1504cc66f371f7cd36832d3289c5d93","url":"static/js/13.5f9df3ac.chunk.js"},{"revision":"225c969128e3a48012a84c0f004ff87d","url":"static/js/14.10d82cce.chunk.js"},{"revision":"08819056e8b28d109b4f75ffd43179aa","url":"static/js/15.3131d3d1.chunk.js"},{"revision":"41891a7eecca793407228a9748aac6c7","url":"static/js/16.ff48d2af.chunk.js"},{"revision":"c032d74bcdda1256b028d255ccf50a97","url":"static/js/17.fa388029.chunk.js"},{"revision":"785bcaf4732951c6f67066eb685031d1","url":"static/js/18.dc8a6d28.chunk.js"},{"revision":"31d86fabe7bc51ec628a633785560e3e","url":"static/js/19.b83f0873.chunk.js"},{"revision":"9e1d7b65707ab45fc810945d17a1cee4","url":"static/js/2.366b601a.chunk.js"},{"revision":"1fda226805dad93ac4fe2c4750eb6036","url":"static/js/20.9fb03057.chunk.js"},{"revision":"72334b6c6515942ce470ead084673bc9","url":"static/js/21.f7f6501a.chunk.js"},{"revision":"cf3db577912004d151b263e1bbabea15","url":"static/js/22.969476c1.chunk.js"},{"revision":"5c52a0056477b381376de9d09350900d","url":"static/js/23.036682b6.chunk.js"},{"revision":"c10c09b6cc4514f4f3bd6198f5b2008a","url":"static/js/24.1639376a.chunk.js"},{"revision":"2c73b303141c95b09433c1910813ac99","url":"static/js/25.ba337a84.chunk.js"},{"revision":"d575583a25bc09cb1fff3f73bfd7b65c","url":"static/js/26.07c15eec.chunk.js"},{"revision":"c8c3e4d800f1994e4f0f52dfe55b2471","url":"static/js/27.a72c5a7b.chunk.js"},{"revision":"0781d2320ce5663d175392b3df908ba0","url":"static/js/28.38092025.chunk.js"},{"revision":"9a40f732c955a36c749c9765ee60f4ff","url":"static/js/29.802953c9.chunk.js"},{"revision":"23fba0311df18956392ade9e769242e9","url":"static/js/3.46c4bf93.chunk.js"},{"revision":"4b64ebbea3508cf3f91350dbfcddefa8","url":"static/js/30.7194bb69.chunk.js"},{"revision":"060892bbb20675c2543973c68ac7022a","url":"static/js/31.2af47517.chunk.js"},{"revision":"e0da5f64ba34f2b76ef72bae322d58d8","url":"static/js/32.a6377927.chunk.js"},{"revision":"db6f426f52120afde76f5afe4d31334d","url":"static/js/33.591c5166.chunk.js"},{"revision":"4ef522f1e765701f0639eb64aa83fc48","url":"static/js/34.6ac3cd52.chunk.js"},{"revision":"a700ba81ee19510a558724da690400d8","url":"static/js/35.7765fb3a.chunk.js"},{"revision":"eb1a9ee726578f52c802bac9732173ef","url":"static/js/36.28cca6f1.chunk.js"},{"revision":"9ccd05f9468bd925db60ee9f789919c6","url":"static/js/37.a2a1117a.chunk.js"},{"revision":"3789b48ff8b9e2d0e72d5434d07a4ac1","url":"static/js/38.04d31490.chunk.js"},{"revision":"e7c5d11c2cee920fbb15d1f37226d8b5","url":"static/js/39.681e8bd3.chunk.js"},{"revision":"790e1d33656c2ae278bd35043eca2682","url":"static/js/4.de3e7cc2.chunk.js"},{"revision":"78c0adbe9e97aeaab2360b80aae3d4ae","url":"static/js/40.f51ba65d.chunk.js"},{"revision":"994c34a87e75cf2a1c942a46dfcb91d9","url":"static/js/41.c3806e1a.chunk.js"},{"revision":"5a703219baba9c537e03d3d2401a79ae","url":"static/js/42.129841e6.chunk.js"},{"revision":"4b47f47e6bf539b82b3ae9106ae81830","url":"static/js/43.4aee0c17.chunk.js"},{"revision":"90860dd6184e97ae0c3ecb8454596d12","url":"static/js/44.3c3b327b.chunk.js"},{"revision":"e7b8705910b9a60af9c4fdd916d23adf","url":"static/js/45.646c32ee.chunk.js"},{"revision":"a5483a5bb0b0a98302cf07d2452f7244","url":"static/js/46.8c39b76b.chunk.js"},{"revision":"fe3156fed30837a3df4ee65a8c1c9d7b","url":"static/js/5.c5ce36d5.chunk.js"},{"revision":"6ee928ea863c5821eebd2c918fab9aa6","url":"static/js/6.06c87d8d.chunk.js"},{"revision":"23afd2f4fcd9571d0827fc5f79600801","url":"static/js/7.d3661f2d.chunk.js"},{"revision":"daea0a8fabf928e3031e2cc706a44173","url":"static/js/8.18348d60.chunk.js"},{"revision":"3504d30aaf2770e6b4d91aba3266e420","url":"static/js/9.6a558fda.chunk.js"},{"revision":"8288b9f5b9ed6f97bbdd2193d0058646","url":"static/js/main.1a5944e7.chunk.js"},{"revision":"2aa1b5c2e9e2197833bc8354b198caac","url":"static/js/runtime-main.df3c65ab.js"}]);

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
