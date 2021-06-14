if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"ff5371d6428c9a662b993ab390658b9f","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"ff5371d6428c9a662b993ab390658b9f","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"874fd88c227ce8213cc30158ea46c11b","url":"static/css/22.4247d24c.chunk.css"},{"revision":"17c389cf17272b648b44e76c5263a4fd","url":"static/js/0.ad9a7acd.chunk.js"},{"revision":"9269b71e468c72266893596989f94ed7","url":"static/js/1.ae3a0985.chunk.js"},{"revision":"970f56868780b941b66c214f0d0f8ed2","url":"static/js/12.6fb2a888.chunk.js"},{"revision":"0249cfb723e3d3e7f1de7bdd55a1737b","url":"static/js/13.d198dea4.chunk.js"},{"revision":"f2ee046e0e1203b2d9b712789edce9b5","url":"static/js/14.f9bcc369.chunk.js"},{"revision":"3351f499f412b25b28f25e2692a0f64d","url":"static/js/15.f1aca12c.chunk.js"},{"revision":"2eda117f2428b672888bc32c334914b6","url":"static/js/16.8694e312.chunk.js"},{"revision":"491a6577424756eb548924d2dcec3930","url":"static/js/17.ccd9bdc6.chunk.js"},{"revision":"96e9b9b3096761ba136fd263f8347955","url":"static/js/18.fecb7ae8.chunk.js"},{"revision":"1a9b013ad43cd3bc3afb2629b281d9e9","url":"static/js/19.2143a5f9.chunk.js"},{"revision":"1719be0aed4a647ef0a0b11dca617c68","url":"static/js/2.2d42af5e.chunk.js"},{"revision":"ec8363e49f1698381270e8493576123f","url":"static/js/20.7fbe54d9.chunk.js"},{"revision":"58dec146db7010b6d87592462fca1408","url":"static/js/21.a81b8f2e.chunk.js"},{"revision":"348b83d7948e7db31d21549960f08d2b","url":"static/js/22.e936a87e.chunk.js"},{"revision":"1a8224524f7e89ffc8f2d2bcc39f0d95","url":"static/js/23.41fc08aa.chunk.js"},{"revision":"07d8ba8188d041107fa14868f9f83d2c","url":"static/js/24.5f0d7c6e.chunk.js"},{"revision":"ef1f006a40695899b4a4a10e680d7b39","url":"static/js/25.82ae13c4.chunk.js"},{"revision":"ca2d97ea7255947ce42d8b934d2ba8ea","url":"static/js/26.03def331.chunk.js"},{"revision":"fb1dbc752ad000e016ebfc0cf4ac7b1e","url":"static/js/27.f619f22a.chunk.js"},{"revision":"918c469bd9e5959eb00aff3f48f36f08","url":"static/js/28.304378ff.chunk.js"},{"revision":"9d41eb65bdec799c4d907dab339fe7b8","url":"static/js/29.d00242be.chunk.js"},{"revision":"cd41a479576f4cfe9e6c703d0beeaef8","url":"static/js/3.d6dd2746.chunk.js"},{"revision":"29a28751182924115a25ca6121be3212","url":"static/js/30.94079f5e.chunk.js"},{"revision":"de1bd5ebacd7960c6f6cbd389f77b8ad","url":"static/js/31.78429833.chunk.js"},{"revision":"17950661b437a3526fd0007a07d5cfdf","url":"static/js/32.09a520fa.chunk.js"},{"revision":"c1d83d236432e2fcdcffa9ff96b4e729","url":"static/js/33.dacfc8ac.chunk.js"},{"revision":"95169f1c8c15c0e483604514d4a29504","url":"static/js/34.8aed08c0.chunk.js"},{"revision":"774f30f7538dabb8b2a3366d775a56c0","url":"static/js/35.0fa91653.chunk.js"},{"revision":"0863aed2fb87f24ce4dd26c21203520d","url":"static/js/36.b256a532.chunk.js"},{"revision":"8a205c93551e245ab9695da67acdfab4","url":"static/js/37.2d3ae3f3.chunk.js"},{"revision":"ad9f93431bdd87ca43605a06b07fbd17","url":"static/js/38.42926d7c.chunk.js"},{"revision":"3b263afe2bce708f333341c094931018","url":"static/js/39.03dfa6d5.chunk.js"},{"revision":"e0450f8439a75e23a0b36876cd4ed985","url":"static/js/4.fff38bbd.chunk.js"},{"revision":"1e11aaf7ddad7e30c46c577d6408b751","url":"static/js/40.25af87a4.chunk.js"},{"revision":"92c15a6ab67df14b5e93ccd55bd6eea7","url":"static/js/41.a5a41d87.chunk.js"},{"revision":"bd4835d65615300488536e70ea47958f","url":"static/js/42.be858f6f.chunk.js"},{"revision":"2a9e78fe87743aa0628b4b009430870b","url":"static/js/43.1be26e32.chunk.js"},{"revision":"43128b8735c30a62ded28977c6aaf858","url":"static/js/44.69fa23a9.chunk.js"},{"revision":"f0932ba583b2678416e68b12ad693a9e","url":"static/js/45.2aa555c0.chunk.js"},{"revision":"834f9e4e920894ca288fd13a36902a64","url":"static/js/46.cbd2eb23.chunk.js"},{"revision":"63bc879f94d8e5de52f9aebe8ea89ce6","url":"static/js/47.f59ff91e.chunk.js"},{"revision":"3fe53582a410ab46a4503e9c4d26ae68","url":"static/js/5.13c10a2c.chunk.js"},{"revision":"77b194f36b7313724d5b9d8fd276d500","url":"static/js/6.7dae2b12.chunk.js"},{"revision":"666c1ba1cab90d93658d1527f90e1d89","url":"static/js/7.6f9a959e.chunk.js"},{"revision":"13ce9b0000feee9d585cb6ecaacfdc61","url":"static/js/8.636e97d2.chunk.js"},{"revision":"60986cfe0b08e4dc9f82c10c78b6850a","url":"static/js/9.758369c0.chunk.js"},{"revision":"3b4cd19956bae9937b1a60576d6969ec","url":"static/js/main.8751e1d0.chunk.js"},{"revision":"2280bdfd5df151bea42058ca929a2108","url":"static/js/runtime-main.a19c5bbd.js"}]);

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
