if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"8093b9cf1d876b287768895521129f17","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"8093b9cf1d876b287768895521129f17","url":"index.html"},{"revision":"c203d90016dc458383b030d4c3272495","url":"precache-manifest.c203d90016dc458383b030d4c3272495.js"},{"revision":"32ea8fb69e90c13c1440ca949a1871b9","url":"static/css/14.e4be5385.chunk.css"},{"revision":"e9baa5e0a6a23b112e00009d7b59c0ee","url":"static/js/0.d37a45b3.chunk.js"},{"revision":"27df6fb615a0b2edec3e409a4bcd6680","url":"static/js/1.678a9836.chunk.js"},{"revision":"abbea5d3cbd099e377a2ac1372dc0ce1","url":"static/js/10.bffc15b4.chunk.js"},{"revision":"14f0d06aae9d9afe906fa87d970e737e","url":"static/js/11.7bc31ae1.chunk.js"},{"revision":"bdfd0de7ac393418ee4438098567c650","url":"static/js/12.914c2406.chunk.js"},{"revision":"cd3e2ee5081dd981d80bc4ef2dc15e21","url":"static/js/13.ae77a819.chunk.js"},{"revision":"a537bc2f1e5905a972b305e9d47783cc","url":"static/js/14.e277155b.chunk.js"},{"revision":"8c910ff4737463bb00ee9c42a7bd53ef","url":"static/js/15.ce5ad806.chunk.js"},{"revision":"3dad41b46e1bda274601ae6e49d0e206","url":"static/js/16.09734440.chunk.js"},{"revision":"93a8130b766641a62cf7121c6487aac0","url":"static/js/17.d2a42dc1.chunk.js"},{"revision":"f7e326ec955723b146e23dcdf887c5c0","url":"static/js/18.64b6ee89.chunk.js"},{"revision":"50c8d20ca6dd77fd85e5731582107b2e","url":"static/js/19.61f6affc.chunk.js"},{"revision":"82513090b3068c14b27334a9056d0b35","url":"static/js/2.589f327e.chunk.js"},{"revision":"8f6b06f81713d75a33cf94b4437d6fc4","url":"static/js/20.1ead4a97.chunk.js"},{"revision":"1380d7c74adcce5092438140d7787255","url":"static/js/21.c7102844.chunk.js"},{"revision":"631420a90e5da1cc280a4a005956ae0c","url":"static/js/22.be6c7bf4.chunk.js"},{"revision":"9a4b6be5df6db95fa26076453d635830","url":"static/js/23.13222e58.chunk.js"},{"revision":"75c0d64901f48f0fc17ebd7f820782e7","url":"static/js/24.1a24644d.chunk.js"},{"revision":"4cc30dda1292f594031f9410239047e3","url":"static/js/25.0b8bb888.chunk.js"},{"revision":"034793d2948f02bb1c00d5fedb70c9d4","url":"static/js/26.6738658e.chunk.js"},{"revision":"54ecf0f377dc6c723b4b45f6ab3b70e7","url":"static/js/27.6aea748f.chunk.js"},{"revision":"8e1d7052de22f1da3c4f847a3adf5475","url":"static/js/28.b31ae3e2.chunk.js"},{"revision":"b3c39e844183d6e2177cb58d60c4bae1","url":"static/js/29.0689d6c3.chunk.js"},{"revision":"0715bf75556c0f0c8734791916afa580","url":"static/js/3.b199b006.chunk.js"},{"revision":"ca8191e0274858566933f18a6f01e57e","url":"static/js/30.8ecbcae1.chunk.js"},{"revision":"fd7d9c4189558720bfce0773a32964ab","url":"static/js/31.d8c21628.chunk.js"},{"revision":"3fb4032644f7dd7d2897628491c507e7","url":"static/js/32.cb66ead0.chunk.js"},{"revision":"a2421dc4b83715e78437feb82e6fc0e4","url":"static/js/33.d84f3628.chunk.js"},{"revision":"8a6971dfdbc025258aa58a34edef38bd","url":"static/js/34.e020740d.chunk.js"},{"revision":"2e0d15a3abc0ba053535fc51d0f95d03","url":"static/js/35.44cc0c40.chunk.js"},{"revision":"9ccc3d02fbf16226d6286c1fb1975a27","url":"static/js/36.0120936a.chunk.js"},{"revision":"c1e578fe2985dbfc9e745b42f8c83514","url":"static/js/37.b82bb081.chunk.js"},{"revision":"f2d70e4ea1e976790a59fc2c1dbb2562","url":"static/js/38.1a6d68e1.chunk.js"},{"revision":"b51dc53883f1a96d99eccbbc7e93cd66","url":"static/js/4.73c4162a.chunk.js"},{"revision":"17cf5f328ce7c5bbab01d4bdb0dbff25","url":"static/js/7.a33d71eb.chunk.js"},{"revision":"2d1097bd18b1fdf37929e4285486c245","url":"static/js/8.e5daa465.chunk.js"},{"revision":"f5a647feabaff05b69ceca86293a5d85","url":"static/js/9.6a3e7362.chunk.js"},{"revision":"88a196e180c1b03a58fd9e52ac4b5543","url":"static/js/main.1369c377.chunk.js"},{"revision":"d9ba16001e3878b95f390d0fa418ea53","url":"static/js/runtime-main.a4da96f9.js"}]);

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
