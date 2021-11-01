if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"e2d93eed8d6d50ff26f0385e544fb12b","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"e2d93eed8d6d50ff26f0385e544fb12b","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"e1b4bb7171f893224fd40d3fb983c9a2","url":"static/css/22.80df4701.chunk.css"},{"revision":"0ff5cf098070438329a1271ddf981ca0","url":"static/js/0.a0c39cc9.chunk.js"},{"revision":"6921c53d5b0ea6c27335b6ff4941541c","url":"static/js/1.27744010.chunk.js"},{"revision":"b2b36ba74ff7557b0696ee8c3f06b696","url":"static/js/11.0d4e9953.chunk.js"},{"revision":"88222d083d21167476f62857ca53ac56","url":"static/js/12.4c8aa93a.chunk.js"},{"revision":"46c54e5c973289c1942b81fb4a4c79c5","url":"static/js/13.fda466c5.chunk.js"},{"revision":"402ad77d29dccafe22b8d0aff0c320d8","url":"static/js/14.849156f7.chunk.js"},{"revision":"4f87ced6bbd0eba95d8c08cdc388fabe","url":"static/js/15.d5336327.chunk.js"},{"revision":"d77355d7366584f739618d30637d3d44","url":"static/js/16.e94658d6.chunk.js"},{"revision":"8bb024c784cc4e6f08d058bc49392389","url":"static/js/17.c37db271.chunk.js"},{"revision":"91aeb64a0965c3ccc695815c9eb7a102","url":"static/js/18.036c6a61.chunk.js"},{"revision":"5c61e1f59bd40ced5bfd694614ae79a4","url":"static/js/19.e04decfb.chunk.js"},{"revision":"f0fbd43ae3c7cb2bce87ae3f37d9b816","url":"static/js/2.b9040596.chunk.js"},{"revision":"acc3e52f1f7d7ca08418c9fd71d7dc95","url":"static/js/20.11a55dbc.chunk.js"},{"revision":"7260d14b02dc8adabcfd5605dc55cd91","url":"static/js/21.cd5a6b2d.chunk.js"},{"revision":"1e1b106238fdd81d24a370aac1f6cc5c","url":"static/js/22.81d68eac.chunk.js"},{"revision":"67f3073a7a06fc87e22cf8d7b72b05d2","url":"static/js/23.18371aa3.chunk.js"},{"revision":"13cbcf93e5b953ef0657611e08508a85","url":"static/js/24.b920258e.chunk.js"},{"revision":"2e9f68d40c525d5fe68a1c131a6cd4a4","url":"static/js/25.d9276c6a.chunk.js"},{"revision":"23deca0c1af81b70fc4d458fbc84ca03","url":"static/js/26.4d1c5a86.chunk.js"},{"revision":"6def797eeb55b9b5d0344136872de69c","url":"static/js/27.a9ff8964.chunk.js"},{"revision":"afcbfd804cf2b22f955fd0bbb7a30834","url":"static/js/28.e963accf.chunk.js"},{"revision":"b0a0037fdce0e7a78449151263fc5ba9","url":"static/js/29.40f59c61.chunk.js"},{"revision":"3ca9eb7e89807503890989aa016d2d07","url":"static/js/3.d56101d8.chunk.js"},{"revision":"d2297ac38ad828289670295c8978d314","url":"static/js/30.b151d166.chunk.js"},{"revision":"d405b7afbbb820c642003d04b56472bd","url":"static/js/31.8ae71b75.chunk.js"},{"revision":"74e9680b365c7186b3643f1f9cce9db0","url":"static/js/32.177efa5e.chunk.js"},{"revision":"97470936ee2c13625645b010b4ee7355","url":"static/js/33.169a5f31.chunk.js"},{"revision":"a00894765a81b0808815a468600ae01f","url":"static/js/34.36efcee9.chunk.js"},{"revision":"bc62029e94fa89db52d9b3e2abdd5495","url":"static/js/35.06939100.chunk.js"},{"revision":"5b71654abf0daf9dbf4768b4c063e10b","url":"static/js/36.0bef3183.chunk.js"},{"revision":"3eedec739037edf17abe98357256fb78","url":"static/js/37.c0ce4e2c.chunk.js"},{"revision":"7b5e1f6287ed875345b7dc89107b243c","url":"static/js/38.b8f6696f.chunk.js"},{"revision":"1b4ec1e90fb5ab762d2f7703caaeefed","url":"static/js/39.d1182d34.chunk.js"},{"revision":"6f2d773a71432e513a78fcdf2626b9a0","url":"static/js/4.2c0898e3.chunk.js"},{"revision":"1a4be41a69c7867d487ce7d80741286e","url":"static/js/40.6a411bfd.chunk.js"},{"revision":"6cd80d51546af140ae807c09495fd29a","url":"static/js/41.5ed429f9.chunk.js"},{"revision":"9a74ba111b494f4183c8195db96a82e4","url":"static/js/42.17cd16c9.chunk.js"},{"revision":"4119ffc754359d2eb85c274ec4113323","url":"static/js/43.30f9e54f.chunk.js"},{"revision":"aef0ea953ce08cfbe092a0508640b75f","url":"static/js/44.f845debe.chunk.js"},{"revision":"13cefcd0461769506093a21639276e12","url":"static/js/45.bd4ac566.chunk.js"},{"revision":"a5483a5bb0b0a98302cf07d2452f7244","url":"static/js/46.8c39b76b.chunk.js"},{"revision":"d0e28c294c23f3118787401ef971d50d","url":"static/js/5.a414692c.chunk.js"},{"revision":"2586bf0c80b72ae133c72b656d3f23b3","url":"static/js/6.59de0973.chunk.js"},{"revision":"685a5ab8c030d3b9b38ab827d8d37336","url":"static/js/7.25f0e432.chunk.js"},{"revision":"89e73e00ad21924249b315556e880d07","url":"static/js/8.13a8fe0d.chunk.js"},{"revision":"e23656cc9a341f742072bda87d87866c","url":"static/js/main.4a30894b.chunk.js"},{"revision":"c0935b9453b01e737e66652478f6c470","url":"static/js/runtime-main.776090d6.js"}]);

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
