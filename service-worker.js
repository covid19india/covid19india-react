if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"2f7ca39816d70a3e96332f1a6b69b25f","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"2f7ca39816d70a3e96332f1a6b69b25f","url":"index.html"},{"revision":"893d27e0a73e8ee2d8e936c1095c996a","url":"precache-manifest.893d27e0a73e8ee2d8e936c1095c996a.js"},{"revision":"32ea8fb69e90c13c1440ca949a1871b9","url":"static/css/14.e4be5385.chunk.css"},{"revision":"e9baa5e0a6a23b112e00009d7b59c0ee","url":"static/js/0.d37a45b3.chunk.js"},{"revision":"17092dd99ff21777b7498040d2190727","url":"static/js/1.a9c5f1fa.chunk.js"},{"revision":"a8bf7e42a7d848a5cc6606905a5ff2f9","url":"static/js/10.ea0bf2d3.chunk.js"},{"revision":"bd8de98699696df9af563e083eec9c14","url":"static/js/11.1e8689cf.chunk.js"},{"revision":"fe1342ef77e71be257cf78baec08a04b","url":"static/js/12.f190a2f1.chunk.js"},{"revision":"44ea4e9dc370516c93cbf1963d0de7e4","url":"static/js/13.2288208a.chunk.js"},{"revision":"45a8cf2f9eefa54e03108c92cc6d2ed5","url":"static/js/14.44432a14.chunk.js"},{"revision":"53109b42b3c42301d73ac187e1aa0873","url":"static/js/15.39d4d25c.chunk.js"},{"revision":"09e800e0b15a6dd9e6599191f6b4f321","url":"static/js/16.b0dc1cc4.chunk.js"},{"revision":"45415142bc2c75e55ec798b121e42d0b","url":"static/js/17.98c4f4df.chunk.js"},{"revision":"025505c327b11b8eace417d12ef34c55","url":"static/js/18.bec7727a.chunk.js"},{"revision":"1f5704f67f3f4a489ffd2d5fa9986c0e","url":"static/js/19.ed41c518.chunk.js"},{"revision":"447d0838c67e6d123e4ae132593db20c","url":"static/js/2.f2ec6b08.chunk.js"},{"revision":"7ccab53fcd2b5068df4c00ef8fdbfa4e","url":"static/js/20.45c44cad.chunk.js"},{"revision":"fd7ea0d07db4ca85093625d14997ba32","url":"static/js/21.9fa817e4.chunk.js"},{"revision":"74a0fd44ab5630e3e6cb795733708185","url":"static/js/22.7c1847ea.chunk.js"},{"revision":"e219c9e231930451f9eb7e4988bc23a3","url":"static/js/23.bdf3fd77.chunk.js"},{"revision":"b6434db56e33038e747af28c5e42e7a3","url":"static/js/24.bb03c5b3.chunk.js"},{"revision":"a1f63217cb5c28a22c08121f78c30b2e","url":"static/js/25.fd953431.chunk.js"},{"revision":"22fc62d598b85e9bc3f7d8d9312a2af0","url":"static/js/26.c9139175.chunk.js"},{"revision":"2c6409a952f58119080d76532e7d76e2","url":"static/js/27.82ed08d5.chunk.js"},{"revision":"84abbc1fbf81eb7b5844e17d62ae6f42","url":"static/js/28.0f1dc14a.chunk.js"},{"revision":"89c89e1c133cbdaa7386856d5e4102dc","url":"static/js/29.ea55cdb5.chunk.js"},{"revision":"3efbcac330dd543606b36ddb8795d382","url":"static/js/3.ce2c1aaf.chunk.js"},{"revision":"7d34861e9575250df3d315b3d7e56bfe","url":"static/js/30.7d32e025.chunk.js"},{"revision":"9c71e07a31c3cacbe9562f2eef5ddb2d","url":"static/js/31.6f6d20c5.chunk.js"},{"revision":"f304c7c8784124a80aaeef93cbc0a5b9","url":"static/js/32.9b815896.chunk.js"},{"revision":"cdb5f20ef36e47cd0d6b3f0395df09d3","url":"static/js/33.4364aab2.chunk.js"},{"revision":"2a340a40d924fac46695ad5bd6169f43","url":"static/js/34.d87637dc.chunk.js"},{"revision":"810c2e79ff1b0b1b407b0c11bb9807eb","url":"static/js/35.6c77958b.chunk.js"},{"revision":"d86bced266fb46031d861a259b1b3e71","url":"static/js/36.99a4d0ef.chunk.js"},{"revision":"22a06850353c27f2b0fa8fc2c4f4e6bd","url":"static/js/37.0c469bf6.chunk.js"},{"revision":"f2d70e4ea1e976790a59fc2c1dbb2562","url":"static/js/38.1a6d68e1.chunk.js"},{"revision":"989c24b194fbd61ab580733427028103","url":"static/js/4.b18d7d97.chunk.js"},{"revision":"17cf5f328ce7c5bbab01d4bdb0dbff25","url":"static/js/7.a33d71eb.chunk.js"},{"revision":"848af9231e9b701ef525c49f26ff831f","url":"static/js/8.b51f0c05.chunk.js"},{"revision":"2174312d22c1ec99766d7a8f5ef4254d","url":"static/js/9.5e3e4f7c.chunk.js"},{"revision":"379caab1ef3087ff3f66fcd7b3ff1571","url":"static/js/main.d40ac55c.chunk.js"},{"revision":"4f5761721a82877c3d16ca73ae134c0a","url":"static/js/runtime-main.fcafd794.js"}]);

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
