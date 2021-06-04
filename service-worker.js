if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"410cde619b25d85e03ddf0ea08376bb7","url":"404.html"},{"revision":"460e2171184a144d1b778416a9389f37","url":"c3dbf9379de3f7b9fe4a.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"410cde619b25d85e03ddf0ea08376bb7","url":"index.html"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"663aa94ea94be8b37e63367848679adf","url":"static/css/22.767b6e29.chunk.css"},{"revision":"52d1a506f485db6d972c879eb08b1b49","url":"static/js/0.d494f3d4.chunk.js"},{"revision":"9e48e6d13d19bb85a89edbb2f049d3b6","url":"static/js/1.46ea14c0.chunk.js"},{"revision":"5a79cded0170f27d294b640d289a23cc","url":"static/js/12.61c19f14.chunk.js"},{"revision":"0f6086d5d20e67ee399199fc8ca51e2e","url":"static/js/13.d2aeba24.chunk.js"},{"revision":"d32b2fbdd2aef92b369da21ebe758ab1","url":"static/js/14.a6e5800a.chunk.js"},{"revision":"88fdae391406dc2772ab88524e49419d","url":"static/js/15.e67214ec.chunk.js"},{"revision":"12f4ac880580bb58cc3767e3236a9c0e","url":"static/js/16.1e4905ce.chunk.js"},{"revision":"41996a65f2ecde83dc4bbfb1c6fa15b3","url":"static/js/17.b82621fa.chunk.js"},{"revision":"9ae4db2c88b1a8daa5d08e4d71b1fbd6","url":"static/js/18.b3654851.chunk.js"},{"revision":"21f1c0b7068e2ac75ac83ef7d4d7ed21","url":"static/js/19.c152bed6.chunk.js"},{"revision":"f8607d311e1419b124e535c51fa7795a","url":"static/js/2.ca9a501a.chunk.js"},{"revision":"008fb839b86692777fb435d42f706d80","url":"static/js/20.dfeb8d17.chunk.js"},{"revision":"42d42f65a2039ddac2b62887052bb4e6","url":"static/js/21.4c51c0d4.chunk.js"},{"revision":"52ca3d3c86712ef184bb20e5487648cd","url":"static/js/22.085d585d.chunk.js"},{"revision":"4f66d3589ad4a2cbe7536efdf90508e0","url":"static/js/23.a42f555b.chunk.js"},{"revision":"5955a3215c1b5ef634902e124b36e49c","url":"static/js/24.1b37bbb1.chunk.js"},{"revision":"448b9ad635ead9e3e8d6d5f6bc5f2872","url":"static/js/25.d10d7a6f.chunk.js"},{"revision":"4ce1b2e60ff57b45690c6a744fedfd06","url":"static/js/26.8939143b.chunk.js"},{"revision":"34f0b3c2e1dd2c9052ecad6ad0fdc889","url":"static/js/27.3b134291.chunk.js"},{"revision":"6614ddc29561631c617adda868a3bdad","url":"static/js/28.41e8bdba.chunk.js"},{"revision":"2a64f2ec6825d6775e2fce36b22060df","url":"static/js/29.f5979bc2.chunk.js"},{"revision":"6332c46235cdc7876f754c25abe95c74","url":"static/js/3.a6c33ad3.chunk.js"},{"revision":"518c4d067c1ca4fdac28b011df432c20","url":"static/js/30.6e0828ae.chunk.js"},{"revision":"54c101b6f6af3c52c7d6cb0e372a12ce","url":"static/js/31.0d35f981.chunk.js"},{"revision":"2369170ee1a4bef0ddfee41400d54de1","url":"static/js/32.ad8844d1.chunk.js"},{"revision":"3eb8936f9bffabee46754caf08ec9492","url":"static/js/33.5614ee55.chunk.js"},{"revision":"4cd00b27a2a49a31c5924b8587c46235","url":"static/js/34.845f68df.chunk.js"},{"revision":"c6f61bf13a1c74851e00368f8a86ebf9","url":"static/js/35.72204ee6.chunk.js"},{"revision":"dbc7dceb82442b6545dcf7eed65fa346","url":"static/js/36.98da0a42.chunk.js"},{"revision":"4ad3c0139f7cb46ef786de20296d4cd5","url":"static/js/37.e0f04879.chunk.js"},{"revision":"80635758164f45bba6127d1b0eb7bbf4","url":"static/js/38.561c4491.chunk.js"},{"revision":"d1c222be99f063c73d770a34a24fe598","url":"static/js/39.b919dee5.chunk.js"},{"revision":"08c595940bd1228edb369f86cd6dc26e","url":"static/js/4.b7b6b4a3.chunk.js"},{"revision":"b1f1b47c1e3c0aca4670f61bd44af750","url":"static/js/40.18c4068d.chunk.js"},{"revision":"60ac38fdf342a17309462662b11c1583","url":"static/js/41.51fbdb50.chunk.js"},{"revision":"346a30c2a34dc127a95a1ae482f77c0a","url":"static/js/42.6d87512e.chunk.js"},{"revision":"0e7a4f12aefd585fb3bc8da0efe26087","url":"static/js/43.2dbf2e8a.chunk.js"},{"revision":"870b567e061f515e8fcd6cf29649ea8a","url":"static/js/44.e5adc85f.chunk.js"},{"revision":"4d56c6ef5b6b8a3f45ffe19d05f91733","url":"static/js/45.36986d0c.chunk.js"},{"revision":"f68672aae915810fc2dc84dc380947d4","url":"static/js/5.738e135f.chunk.js"},{"revision":"d1aef588b34a0ee6e0e4514f02cfbb2c","url":"static/js/6.f327716e.chunk.js"},{"revision":"4ea8758c3be5050fa90e0ee0bf164d07","url":"static/js/7.cbcf5ca3.chunk.js"},{"revision":"605656da5ead7c79105b5180bb774e07","url":"static/js/8.2bdff4a0.chunk.js"},{"revision":"6b84b53b7a9c9397d655060cf872ff41","url":"static/js/9.99fe3708.chunk.js"},{"revision":"0726f61b01ee46c819352d053d70c7e1","url":"static/js/main.5dc74a71.chunk.js"},{"revision":"03148807631f65366fbac46a9a702da8","url":"static/js/runtime-main.a21c5352.js"}]);

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
