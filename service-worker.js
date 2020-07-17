if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"39c36dfb21154e06c7f0d58aee800469","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"39c36dfb21154e06c7f0d58aee800469","url":"index.html"},{"revision":"5d712e8d6c9140bf561bddff78b32c11","url":"precache-manifest.5d712e8d6c9140bf561bddff78b32c11.js"},{"revision":"bebd6794cf5ab6437547ab1cce53f02f","url":"static/css/13.f1ad6525.chunk.css"},{"revision":"7d76895dc12bb91d35802c57a4bea4b6","url":"static/js/0.4956e05b.chunk.js"},{"revision":"b64414e5891cbfbb220e7fc42e366668","url":"static/js/1.b1c2968b.chunk.js"},{"revision":"24696751246a3201d30862ef2e978d91","url":"static/js/10.f15727cf.chunk.js"},{"revision":"e5b639a451277f1dfd7378ba2b0204f3","url":"static/js/11.0cdafa43.chunk.js"},{"revision":"51f2a9109f0d6892c4d180caffeeac2e","url":"static/js/12.317ee810.chunk.js"},{"revision":"3602867b5ea62983e509b7c95f59cbc5","url":"static/js/13.c1c6f18b.chunk.js"},{"revision":"0334c37fb47b91c012c4d20a8210cb26","url":"static/js/14.83167b46.chunk.js"},{"revision":"253f50bb072086b6eed6e9c2f798f800","url":"static/js/15.4bdce848.chunk.js"},{"revision":"263cac2056ba5014d9c1cb9e446dadfe","url":"static/js/16.65b943a0.chunk.js"},{"revision":"9f74d3f394da2e25c1f89d32e5273679","url":"static/js/17.29dd5efb.chunk.js"},{"revision":"e9dddda2a82a7a93ac6edec80ec3471f","url":"static/js/18.d61c1976.chunk.js"},{"revision":"0164f8cf8a355b8f6fbe485b42585040","url":"static/js/19.ee178e8c.chunk.js"},{"revision":"4f797dfc52ad31bdcacc5e197fc7b1b9","url":"static/js/2.3438894e.chunk.js"},{"revision":"ca7067000e87127f708ed5b0c8be737a","url":"static/js/20.df5665b2.chunk.js"},{"revision":"f6b695342d55e487c46e5fb0a9136ced","url":"static/js/21.bdd283bc.chunk.js"},{"revision":"1851bc24cc88a502aa769baf8a47aa3c","url":"static/js/22.b0ca0bfb.chunk.js"},{"revision":"e37958e13f1067e61ba44e120f358fbe","url":"static/js/23.073fe84c.chunk.js"},{"revision":"022daa7dbd982c1e70a269e3b8bbccc9","url":"static/js/24.83beeeb4.chunk.js"},{"revision":"070dd7843682d61e792236e202e32447","url":"static/js/25.d9d6b9ab.chunk.js"},{"revision":"c784e77d2e1c2e27d583014b18443602","url":"static/js/26.f27710df.chunk.js"},{"revision":"326fca4d10c908dc1f5ff688850ac29e","url":"static/js/27.8b1442ad.chunk.js"},{"revision":"d968d0b0bcb854d2eb40ac6bd665232f","url":"static/js/28.3760c017.chunk.js"},{"revision":"483ed1fa3598877eca80993d44d9e603","url":"static/js/29.8c59b2de.chunk.js"},{"revision":"35b5f94dfa80bcb63ad512b1306acec7","url":"static/js/3.9ec522c9.chunk.js"},{"revision":"cfcc8c3c70a5c81c0d8daf0c7f412871","url":"static/js/30.24edb2e4.chunk.js"},{"revision":"ffee4e3957de711e7a9f05b5ff14f27a","url":"static/js/31.8e6fd040.chunk.js"},{"revision":"ea9469883414a1d7b1a7b21ee60e5226","url":"static/js/32.7b9a874e.chunk.js"},{"revision":"60b967a8ba911ba8829aac6fcde76793","url":"static/js/33.f96cb661.chunk.js"},{"revision":"0714909a612aea44134ec4860867b0e9","url":"static/js/34.9d35f445.chunk.js"},{"revision":"037e71c6e73a917bfaf26e3bb4752845","url":"static/js/35.c2533661.chunk.js"},{"revision":"f373b1692fe2fbc55367aca6fca00634","url":"static/js/36.705a8bf1.chunk.js"},{"revision":"43747e8ae3ea47f06efc5284b5ab0c66","url":"static/js/37.cfbeac1d.chunk.js"},{"revision":"a8da7c25844f9c68f1d7f92f4667be44","url":"static/js/38.ebe86702.chunk.js"},{"revision":"57c29069f16ec708a20fae9c977608cb","url":"static/js/4.47be6b77.chunk.js"},{"revision":"ea53d178b847dc89769e9559f662c85d","url":"static/js/7.977086ae.chunk.js"},{"revision":"354640568d8a659f55544d1a947222eb","url":"static/js/8.bbc194a2.chunk.js"},{"revision":"04756501f37cf16ec108f96a621d6baa","url":"static/js/9.2f4d6821.chunk.js"},{"revision":"7fa3d02186cc6edf27143cc1d48b7bbe","url":"static/js/main.519ca8de.chunk.js"},{"revision":"5a758cbe9c88b85374cd7c3a58a14118","url":"static/js/runtime-main.e28254cc.js"}]);

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
