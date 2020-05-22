if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"6f626b92cc117c3a28ddb58520adf8c9","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"e1f0cf91c3c19dc35580d13ad3e01aa7","url":"fonts/Archia/archia-light-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"02155d96e4a3f18305ab944925389c77","url":"fonts/Archia/archia-regular-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e88f1cf30180bd74b3201844b0c03c69","url":"fonts/Archia/archia-thin-webfont.woff2"},{"revision":"6f626b92cc117c3a28ddb58520adf8c9","url":"index.html"},{"revision":"d36e0251a5bab3b3701fb6b734d6839a","url":"precache-manifest.d36e0251a5bab3b3701fb6b734d6839a.js"},{"revision":"dc75e87e9fafe1f32ed81161b554ac64","url":"static/css/14.93b3b32d.chunk.css"},{"revision":"e3f1dd009e110222b3c6454d15fb1864","url":"static/css/main.b62b46c0.chunk.css"},{"revision":"f0a906677b717c18268fa43bd76c440d","url":"static/js/0.2fd58e1d.chunk.js"},{"revision":"fb81c1e2a0dc51c7105db9d19322b50a","url":"static/js/1.dac51fac.chunk.js"},{"revision":"ecb53ce32a1a061f13e29ad75a94ccc9","url":"static/js/12.774d3d8a.chunk.js"},{"revision":"4d29b2bc69146d4cd9dbb545ceaec87f","url":"static/js/13.f6e5dddb.chunk.js"},{"revision":"34dd4d6509c17b3a87c6fe13851f15d6","url":"static/js/14.bbaa835e.chunk.js"},{"revision":"f059711a71ca41c7a7764e8ca239af68","url":"static/js/15.11cdf82f.chunk.js"},{"revision":"695ac4d69a6f051dbd06648233672968","url":"static/js/16.d70aabc0.chunk.js"},{"revision":"0e5b6a47325b3b89a1017591c8c38d5b","url":"static/js/2.c62817c5.chunk.js"},{"revision":"278fb1d17d7d6c3df8329f63b7627e53","url":"static/js/3.8b035f5e.chunk.js"},{"revision":"1e554b42bcb2d5c8d15684457d652168","url":"static/js/DeepDive.103f29be.chunk.js"},{"revision":"2fa0a5d4903777184f7a2892d0b44585","url":"static/js/Essentials.0e2f3654.chunk.js"},{"revision":"e9bdc77b3b49c70bf27b2c2bc92c0f25","url":"static/js/FAQ.c6389aad.chunk.js"},{"revision":"1fe2d0d6c0e1fcbeaa3157a793eab0ae","url":"static/js/Home.8f2b927e.chunk.js"},{"revision":"671343d74e9ee4a71d9228675838bebd","url":"static/js/main.c92bfb8b.chunk.js"},{"revision":"e10c70b600ea1c26027682f2fcc32e10","url":"static/js/PatientDB.d4d74249.chunk.js"},{"revision":"8bf308cd689cbc2566de841e9f4d4570","url":"static/js/runtime-main.f0893893.js"},{"revision":"65af5474d3d0a0c756fca4914092d8f9","url":"static/js/State.dc7c8268.chunk.js"}]);

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
