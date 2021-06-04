if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"1e2cff2a9114980ba0688449ad277a58","url":"404.html"},{"revision":"460e2171184a144d1b778416a9389f37","url":"c3dbf9379de3f7b9fe4a.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"1e2cff2a9114980ba0688449ad277a58","url":"index.html"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"d5fc338183eaaaa676441de9152b7043","url":"static/css/22.cd09b1f1.chunk.css"},{"revision":"52d1a506f485db6d972c879eb08b1b49","url":"static/js/0.d494f3d4.chunk.js"},{"revision":"9e48e6d13d19bb85a89edbb2f049d3b6","url":"static/js/1.46ea14c0.chunk.js"},{"revision":"5a79cded0170f27d294b640d289a23cc","url":"static/js/12.61c19f14.chunk.js"},{"revision":"0f6086d5d20e67ee399199fc8ca51e2e","url":"static/js/13.d2aeba24.chunk.js"},{"revision":"d32b2fbdd2aef92b369da21ebe758ab1","url":"static/js/14.a6e5800a.chunk.js"},{"revision":"7d5ffd2167d428618e52bf3fab4453d7","url":"static/js/15.6d141236.chunk.js"},{"revision":"12f4ac880580bb58cc3767e3236a9c0e","url":"static/js/16.1e4905ce.chunk.js"},{"revision":"7fc767bfb644e1d02c2154422eeefc94","url":"static/js/17.7aeb5bd0.chunk.js"},{"revision":"7d48e98f5c296b76867e738715c293b2","url":"static/js/18.b6b0cb8b.chunk.js"},{"revision":"21f1c0b7068e2ac75ac83ef7d4d7ed21","url":"static/js/19.c152bed6.chunk.js"},{"revision":"f8607d311e1419b124e535c51fa7795a","url":"static/js/2.ca9a501a.chunk.js"},{"revision":"5a45d30dd0230929fc5c92c09032a9ba","url":"static/js/20.08acbc24.chunk.js"},{"revision":"42d42f65a2039ddac2b62887052bb4e6","url":"static/js/21.4c51c0d4.chunk.js"},{"revision":"52ca3d3c86712ef184bb20e5487648cd","url":"static/js/22.085d585d.chunk.js"},{"revision":"3c0b00dc418b14c4b3cd065898e6447a","url":"static/js/23.f9e26b8b.chunk.js"},{"revision":"5955a3215c1b5ef634902e124b36e49c","url":"static/js/24.1b37bbb1.chunk.js"},{"revision":"b9a9aa5a5a11bc2d7138346e52219ad8","url":"static/js/25.f44fa9eb.chunk.js"},{"revision":"2550b6b364bf9be6b4bae38cdfb5496b","url":"static/js/26.cad8aeaf.chunk.js"},{"revision":"34f0b3c2e1dd2c9052ecad6ad0fdc889","url":"static/js/27.3b134291.chunk.js"},{"revision":"440ffec94e07e512818173d7ad27f3a5","url":"static/js/28.13236ac0.chunk.js"},{"revision":"87bf37568e306020e56a7f68c761ff46","url":"static/js/29.40041bcc.chunk.js"},{"revision":"6332c46235cdc7876f754c25abe95c74","url":"static/js/3.a6c33ad3.chunk.js"},{"revision":"c53b898ea06869670a33358d78f9a1a6","url":"static/js/30.88c62e11.chunk.js"},{"revision":"9b774d74ce34d0bef9d0b9430739ebf2","url":"static/js/31.da7ef596.chunk.js"},{"revision":"06eafd0db61d14a2c8ddf380b4c98acc","url":"static/js/32.f120bfd9.chunk.js"},{"revision":"172628ff09465c0206d530c64d1041b7","url":"static/js/33.2f8c7b42.chunk.js"},{"revision":"023801489b4d30beef426d921e9b6685","url":"static/js/34.18522e9f.chunk.js"},{"revision":"a0b54fbf67d43d12571e3f60c109be6d","url":"static/js/35.ebd07ef6.chunk.js"},{"revision":"78b06392418265e8f5790db677a097a3","url":"static/js/36.225d95bc.chunk.js"},{"revision":"4ad3c0139f7cb46ef786de20296d4cd5","url":"static/js/37.e0f04879.chunk.js"},{"revision":"9a53841da6b01219ec7f64e9c4f9fa97","url":"static/js/38.946b3e30.chunk.js"},{"revision":"d1c222be99f063c73d770a34a24fe598","url":"static/js/39.b919dee5.chunk.js"},{"revision":"08c595940bd1228edb369f86cd6dc26e","url":"static/js/4.b7b6b4a3.chunk.js"},{"revision":"b10de999283987c8c07b610b889440ed","url":"static/js/40.2325894c.chunk.js"},{"revision":"fd511cc7b1ef556c6b1f8ee10d367b10","url":"static/js/41.324c641e.chunk.js"},{"revision":"346a30c2a34dc127a95a1ae482f77c0a","url":"static/js/42.6d87512e.chunk.js"},{"revision":"97ecbcea6b2d01470ce60a26eed9a5d3","url":"static/js/43.879c728d.chunk.js"},{"revision":"7ff37d5195797c9178a58d518d5e6d9c","url":"static/js/44.1340af45.chunk.js"},{"revision":"4d56c6ef5b6b8a3f45ffe19d05f91733","url":"static/js/45.36986d0c.chunk.js"},{"revision":"f68672aae915810fc2dc84dc380947d4","url":"static/js/5.738e135f.chunk.js"},{"revision":"678a614b87ee4de9a5c5cb3ca727f900","url":"static/js/6.f06f9a58.chunk.js"},{"revision":"1cce3bf2be647ae76224dcee03ef6952","url":"static/js/7.a088e3f5.chunk.js"},{"revision":"9d884914c1f1429b210d62ba7fe5b007","url":"static/js/8.37ec9a31.chunk.js"},{"revision":"6b84b53b7a9c9397d655060cf872ff41","url":"static/js/9.99fe3708.chunk.js"},{"revision":"19970ebeede2ba2a1c992f159555deef","url":"static/js/main.90952c63.chunk.js"},{"revision":"2f2db9d40d9109d51be65a6d4f05615b","url":"static/js/runtime-main.43b8f2c6.js"}]);

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
