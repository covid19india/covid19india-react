if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"12f712b8ca9ea13c39753c06b7ae368d","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"12f712b8ca9ea13c39753c06b7ae368d","url":"index.html"},{"revision":"ed1b86505b88c1f8e3df3351c18ab409","url":"precache-manifest.ed1b86505b88c1f8e3df3351c18ab409.js"},{"revision":"3a6124f3de768f9ce104b602ca20cd89","url":"static/css/14.9f79f680.chunk.css"},{"revision":"e9baa5e0a6a23b112e00009d7b59c0ee","url":"static/js/0.d37a45b3.chunk.js"},{"revision":"838791748221445a3656cc39b7d2c1fc","url":"static/js/1.b43926fd.chunk.js"},{"revision":"a8bf7e42a7d848a5cc6606905a5ff2f9","url":"static/js/10.ea0bf2d3.chunk.js"},{"revision":"79362583f6f5e382f52595c6d42c5856","url":"static/js/11.74f574f2.chunk.js"},{"revision":"557572fc1cbf42d7dd02f3a6b0c6bff5","url":"static/js/12.ef891a9e.chunk.js"},{"revision":"44ea4e9dc370516c93cbf1963d0de7e4","url":"static/js/13.2288208a.chunk.js"},{"revision":"8460cff88070ac1ae7877c13431e3bbe","url":"static/js/14.5776d98f.chunk.js"},{"revision":"53109b42b3c42301d73ac187e1aa0873","url":"static/js/15.39d4d25c.chunk.js"},{"revision":"cdca6d0d7bae4946bf70168b6cd61369","url":"static/js/16.01947886.chunk.js"},{"revision":"ed718215a32ee555a79ca0483a994ad0","url":"static/js/17.1fcdc077.chunk.js"},{"revision":"f202df4ac94c833e844a9413cfab1e08","url":"static/js/18.e4f045a0.chunk.js"},{"revision":"39524294db049c8e7bd7169d5b8dd112","url":"static/js/19.18a49579.chunk.js"},{"revision":"341bf1574bf1d2de567649a78ea596a6","url":"static/js/2.a2008832.chunk.js"},{"revision":"7ccab53fcd2b5068df4c00ef8fdbfa4e","url":"static/js/20.45c44cad.chunk.js"},{"revision":"a93bd2b803b0854826dddd304fbc263a","url":"static/js/21.e1cfac7e.chunk.js"},{"revision":"06ef8fb26212e00a7b05afd222ab314d","url":"static/js/22.8e9bc59b.chunk.js"},{"revision":"a0e7c07517d9c846fa856ca6d45a43c5","url":"static/js/23.98490cb5.chunk.js"},{"revision":"6bf72e068df07f0ffad2c5a75ad4a7ab","url":"static/js/24.b2c90104.chunk.js"},{"revision":"ca0813cbc430c071ba72cac22879f71e","url":"static/js/25.f88301b1.chunk.js"},{"revision":"5ee9e534af4e2847e00e69d6e6a61b93","url":"static/js/26.7dbb899c.chunk.js"},{"revision":"f791acc0700667b756ac9699898d0869","url":"static/js/27.afd7bfcf.chunk.js"},{"revision":"d4aa663a25cac5fad5a610f96e126322","url":"static/js/28.1af64321.chunk.js"},{"revision":"d76bbb7cc6ef7d1ea12a811945f53c6a","url":"static/js/29.d3bcf6b3.chunk.js"},{"revision":"ac92cf7a3325e3c944e17218e363a34f","url":"static/js/3.746c98f4.chunk.js"},{"revision":"1eac02d69edb65c9a2b96019f700afb3","url":"static/js/30.fccc1055.chunk.js"},{"revision":"9c71e07a31c3cacbe9562f2eef5ddb2d","url":"static/js/31.6f6d20c5.chunk.js"},{"revision":"f304c7c8784124a80aaeef93cbc0a5b9","url":"static/js/32.9b815896.chunk.js"},{"revision":"181d89492043ae1439f0b81c079858d6","url":"static/js/33.019cd4cb.chunk.js"},{"revision":"3e95a146d552b089543c95768320f3db","url":"static/js/34.be61f761.chunk.js"},{"revision":"609de1c5c61f168be86614a183d1648d","url":"static/js/35.8f7e02a5.chunk.js"},{"revision":"fe60b817cfedd2e61f4337a6cc22516a","url":"static/js/36.e6b605b3.chunk.js"},{"revision":"22a06850353c27f2b0fa8fc2c4f4e6bd","url":"static/js/37.0c469bf6.chunk.js"},{"revision":"f2d70e4ea1e976790a59fc2c1dbb2562","url":"static/js/38.1a6d68e1.chunk.js"},{"revision":"f629dd4af632965c52024583a857f6b9","url":"static/js/4.89f1d4c0.chunk.js"},{"revision":"17cf5f328ce7c5bbab01d4bdb0dbff25","url":"static/js/7.a33d71eb.chunk.js"},{"revision":"6fdd7c170b32714f76ebe3b2bb5ab07c","url":"static/js/8.1b12626a.chunk.js"},{"revision":"f398455c771199dfd86c81bee17e5d2d","url":"static/js/9.0f2da75a.chunk.js"},{"revision":"2dadc3aeb377e52688e085b4022a51c3","url":"static/js/main.ae88068e.chunk.js"},{"revision":"88ebe4076b217ac1f0455f52d24acbb6","url":"static/js/runtime-main.04dfff8b.js"}]);

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
