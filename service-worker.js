if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"4b97b2a570ba41d1a1d9023c084eda4c","url":"2df8de709567e293b27c.worker.js"},{"revision":"87a2317e8238ace34186445475b54ff5","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"87a2317e8238ace34186445475b54ff5","url":"index.html"},{"revision":"bc55dbedd958c9cb5466f92c350e3447","url":"static/css/22.82de5fb4.chunk.css"},{"revision":"cde61785a0fd95f82b577d693bc32a02","url":"static/js/0.22cbb2c9.chunk.js"},{"revision":"c397dd04dccb893c5a038c057c0145ff","url":"static/js/1.328f3482.chunk.js"},{"revision":"d36dbe73ce42b2a4c1017b5151b84ff8","url":"static/js/10.9ba183cb.chunk.js"},{"revision":"4df89d532bf71910fd5b42eb947a1583","url":"static/js/11.44410913.chunk.js"},{"revision":"9807797f60422ac604164b69623f647b","url":"static/js/14.c4624bc0.chunk.js"},{"revision":"f0eaa5847646bd1f342b478ebbd696ba","url":"static/js/15.174906f7.chunk.js"},{"revision":"0e01963355007c75dffa216d12f54fe7","url":"static/js/16.b52c8e90.chunk.js"},{"revision":"c985b25e5fb98e6a9c80df1cf8c920ee","url":"static/js/17.c3f74389.chunk.js"},{"revision":"b7084d94a465f028a43aa1769f4df24b","url":"static/js/18.f9668a07.chunk.js"},{"revision":"400c2bc19161942d879e07496d520e4f","url":"static/js/19.2533362e.chunk.js"},{"revision":"75f0b18f2ad67fe683e3fb5691c3d545","url":"static/js/2.39f723d2.chunk.js"},{"revision":"782464fe6e8d646c207ddec647d2b18a","url":"static/js/20.2b74bdf5.chunk.js"},{"revision":"6233678fb89690ae0daad803bac6d5e0","url":"static/js/21.13be0bb6.chunk.js"},{"revision":"431a3d0b94ff9938f75e72a1df49ff6a","url":"static/js/22.8fc14ef7.chunk.js"},{"revision":"dc7cc97cc4b7b9d526cfac878df911e9","url":"static/js/23.3f23d0ce.chunk.js"},{"revision":"101353813c1402f4de7c407b624b9022","url":"static/js/24.1ac48085.chunk.js"},{"revision":"15b70c33200bf63b0af739240f961cd9","url":"static/js/25.10a516df.chunk.js"},{"revision":"2f5e11ffc0fd0819da5bd04ac43f382d","url":"static/js/26.d58b1214.chunk.js"},{"revision":"72224e3e74cfd794be2a5fb59f83e501","url":"static/js/27.62be3f50.chunk.js"},{"revision":"98211d766f90173fd5da695118b042a8","url":"static/js/28.dceb66b6.chunk.js"},{"revision":"0ae301bd52102ab08a8e50a9b115dbfe","url":"static/js/29.f5d1161c.chunk.js"},{"revision":"5c909b13fabf261c07c9617096f5261a","url":"static/js/3.e2da794f.chunk.js"},{"revision":"dc324f4e7d148998a8dcf174f6eeeabe","url":"static/js/30.1ae597ac.chunk.js"},{"revision":"14958727c81a1fc3e57ddeddac04166e","url":"static/js/31.67bc70ee.chunk.js"},{"revision":"087c5a3a5c093049beeaf38381d11222","url":"static/js/32.d130c084.chunk.js"},{"revision":"d1597fee5bf8aa3a12a55777a38f2e35","url":"static/js/33.e5250909.chunk.js"},{"revision":"bc68bdae7c05169bdce9ae8aba87a190","url":"static/js/34.31499b17.chunk.js"},{"revision":"9afaa1e9a717bfd465494bb88e486cc0","url":"static/js/35.0b4aa274.chunk.js"},{"revision":"99df44cc804ed9c4dcf1ed67d2e432b1","url":"static/js/36.d52b4760.chunk.js"},{"revision":"b1507113a82d5bff13cfae20db26fd80","url":"static/js/37.6a9923ed.chunk.js"},{"revision":"9c6c0a16ff0725e4dc0ce811793ad811","url":"static/js/38.6441d2d3.chunk.js"},{"revision":"c85d0766c86729c2da540884a294a02f","url":"static/js/39.fcec2e0d.chunk.js"},{"revision":"5cfc9e278ab76476c1d35519dde79ada","url":"static/js/4.a0dcf844.chunk.js"},{"revision":"45d251b2a4d611fa6077d456fb3fa5b8","url":"static/js/40.456720b7.chunk.js"},{"revision":"0a4429817d19a9f076c580cf4b0ba0c0","url":"static/js/41.cf098f83.chunk.js"},{"revision":"35c1b37040ee8ab2509e7b212e6ce501","url":"static/js/42.197a8744.chunk.js"},{"revision":"2e74b6e11c1619b727753594570ad3c7","url":"static/js/5.b45eb95d.chunk.js"},{"revision":"e981971d8d8350a0601ce41b297f0441","url":"static/js/6.ea2c60bb.chunk.js"},{"revision":"3df1c77b44bd0357ad3a208de72e28f3","url":"static/js/7.c5e28e2f.chunk.js"},{"revision":"32fa1cc77d8e1b9b9e6087132983bdcb","url":"static/js/8.51d776c9.chunk.js"},{"revision":"7d771809ee7a3145f22131659710b260","url":"static/js/9.36d5164b.chunk.js"},{"revision":"c9f9fea2d9db01e351142fbe5d2f6b87","url":"static/js/main.ec5d990c.chunk.js"},{"revision":"973c730a9f6b7be48c4e76913b6abafd","url":"static/js/runtime-main.c59e1cb4.js"}]);

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
