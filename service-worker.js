if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"1d6209be8482a381e80bef1d10d764b7","url":"404.html"},{"revision":"9ec9216728dbf5a2c2a2b69256419662","url":"8ae050b0e0e914e9c1ae.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"1d6209be8482a381e80bef1d10d764b7","url":"index.html"},{"revision":"ee193d41615fb8cf1732f6191cb78d96","url":"static/css/22.f5f9d973.chunk.css"},{"revision":"f215608a7ce073a74dafc9c9baa3ea22","url":"static/css/23.e7bf9b77.chunk.css"},{"revision":"60c8fb994cef7b598e34ffae31d06e42","url":"static/js/0.44045b94.chunk.js"},{"revision":"176d12aee200dc11ad84b6e3511d2fda","url":"static/js/1.e19b2e8b.chunk.js"},{"revision":"c3be0207d7981caf4bc55b817cb65477","url":"static/js/12.dd9b125d.chunk.js"},{"revision":"ef336f7fa552fbd193070c5759a296d1","url":"static/js/13.3bbbd442.chunk.js"},{"revision":"8b3e08b1e3716d31d19bb4ddff66397d","url":"static/js/14.136161e4.chunk.js"},{"revision":"68198a02f7c48e71b36110c8089097c4","url":"static/js/15.b6f4fceb.chunk.js"},{"revision":"76297277be379bf20b2619c74e636ac3","url":"static/js/16.3375b0da.chunk.js"},{"revision":"bfda322c16f2a41a45bc9e0452b7ac27","url":"static/js/17.659dee46.chunk.js"},{"revision":"252935f1ce55af8daad4fe46a0da24ff","url":"static/js/18.62188e23.chunk.js"},{"revision":"e2f0270e4b291f9293eeab38e2f2783e","url":"static/js/19.3a01c6d6.chunk.js"},{"revision":"24f27bf8e8bb0052a1f470018ce08926","url":"static/js/2.e2d97dc9.chunk.js"},{"revision":"34f7f87d8fd740a95b90707aabfd8a4a","url":"static/js/20.e6c3c901.chunk.js"},{"revision":"9350acc149ecd0970750e0d284dd160a","url":"static/js/21.7ed1c1d0.chunk.js"},{"revision":"64b5d6e16a3ce0b65aa07e42e5abf0fc","url":"static/js/22.5737a647.chunk.js"},{"revision":"f34023562b7a1e500771e5dff7c6d6c3","url":"static/js/23.97d20207.chunk.js"},{"revision":"65abf026705339ceb8dfecda12354ed9","url":"static/js/24.92c40b63.chunk.js"},{"revision":"6b79febbaa633615d1c3a2c028b987f6","url":"static/js/25.bcd24197.chunk.js"},{"revision":"2d022cfd66bdf893077db03bb169749d","url":"static/js/26.edca5285.chunk.js"},{"revision":"c97706c021bad6e3edf92c07ccd66652","url":"static/js/27.7a3cf900.chunk.js"},{"revision":"0975cfeacd24f21c733795e5fb755ccd","url":"static/js/28.f103366b.chunk.js"},{"revision":"c99998d45537380dc7cae89310c12d3b","url":"static/js/29.0163e922.chunk.js"},{"revision":"4dd82e6484fdf82730d76b203e3ea6c2","url":"static/js/3.c0b1f7fb.chunk.js"},{"revision":"cd3029e84e0af0cdacf2f53d24d3c2c9","url":"static/js/30.0dfc162f.chunk.js"},{"revision":"9c4968f5010c9fded427827e21573654","url":"static/js/31.1a43bb29.chunk.js"},{"revision":"f91babca99b12b57b17ecda60fb6eec6","url":"static/js/32.c317de85.chunk.js"},{"revision":"3a94c913ee5f7c5243796150781d17be","url":"static/js/33.7757f612.chunk.js"},{"revision":"c69ccf27b950d1246990433c7462035e","url":"static/js/34.39e57388.chunk.js"},{"revision":"02f07ea5dc25cdb07f657b0842500f4c","url":"static/js/35.6d5d76d3.chunk.js"},{"revision":"84125c8dfcdd8e4020f56a74c1474981","url":"static/js/36.610cae5e.chunk.js"},{"revision":"abd9d8e2c62e66f95ab3eb6ca29cffcb","url":"static/js/37.44517507.chunk.js"},{"revision":"183dbbaa3cf6bbedef5ac129fe445ecd","url":"static/js/38.1076b507.chunk.js"},{"revision":"18885d99941b120400fe7ca7355af57c","url":"static/js/39.27d710c7.chunk.js"},{"revision":"bc37b5cd1673cf3ff6516e3bc9877fbf","url":"static/js/4.89c0005f.chunk.js"},{"revision":"3d0d028617a2391f554bb74b266e4477","url":"static/js/40.8079b2be.chunk.js"},{"revision":"1b2bda948db793f38b31a95cf00ec433","url":"static/js/41.ed147df8.chunk.js"},{"revision":"224cbc0389a7343e931b03fced41c402","url":"static/js/42.ef7e3ed8.chunk.js"},{"revision":"88d580e9157cae0a14e1fcc7f2e2f956","url":"static/js/43.f5edfa30.chunk.js"},{"revision":"cddc9ea3f008f2d7a570622ab6ff2f88","url":"static/js/44.81552550.chunk.js"},{"revision":"28dd55926d038cc8f84dda2eef84bd58","url":"static/js/5.455735ca.chunk.js"},{"revision":"540c585e2b766ba6f36de3e8bfd603c1","url":"static/js/6.bb3b41fb.chunk.js"},{"revision":"f48332b350a48672aec9e223922c44da","url":"static/js/7.38b683fe.chunk.js"},{"revision":"830dc80dfedb1ca4100584ef8e1582a5","url":"static/js/8.13ca8b0d.chunk.js"},{"revision":"f13e1e3b7e20a35dc9791cf2d56df04b","url":"static/js/9.6b0f21a2.chunk.js"},{"revision":"e3497fe38749159fb3ed0d19dac5d79f","url":"static/js/main.56d5fbc6.chunk.js"},{"revision":"643e22a29ca3b2be28a298601389b649","url":"static/js/runtime-main.05f6b0e9.js"}]);

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
