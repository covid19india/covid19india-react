if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"6fc7217b4cb613c121fd24c5ac523ef5","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"6fc7217b4cb613c121fd24c5ac523ef5","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"a66872bead1f894a79ea2488187e8ff2","url":"static/css/20.f5f9d973.chunk.css"},{"revision":"4175e57ebab47b6da8838c88025e20c9","url":"static/css/21.dabca220.chunk.css"},{"revision":"0ff5cf098070438329a1271ddf981ca0","url":"static/js/0.a0c39cc9.chunk.js"},{"revision":"f849e6a08937beadbdc9958326c721bb","url":"static/js/1.0da8edc6.chunk.js"},{"revision":"b2b36ba74ff7557b0696ee8c3f06b696","url":"static/js/11.0d4e9953.chunk.js"},{"revision":"72bf945464705ab973ab5ac51d32b208","url":"static/js/12.bee0d131.chunk.js"},{"revision":"f99eafe9a110afb8866bb8821dc9af89","url":"static/js/13.9839b892.chunk.js"},{"revision":"c3926a75c38b002c00cffd281fac2d10","url":"static/js/14.ffb02f61.chunk.js"},{"revision":"52bc6615fed8062995837cc4b8d786cb","url":"static/js/15.0dc6c4eb.chunk.js"},{"revision":"729a07b08b5492fb7d8e32b76fef809c","url":"static/js/16.a6285e93.chunk.js"},{"revision":"0ef54a5f1e71b4124f3febafc0eb7f3d","url":"static/js/17.30826802.chunk.js"},{"revision":"ffe755cb92d34a362f9ef3db877c94e8","url":"static/js/18.8bc5d175.chunk.js"},{"revision":"8ee41df2b81f3ad77fc3e4de20be1e13","url":"static/js/19.0a0ad7f3.chunk.js"},{"revision":"9e1d7b65707ab45fc810945d17a1cee4","url":"static/js/2.366b601a.chunk.js"},{"revision":"198f3f2dd78a49aa8e391aec932af685","url":"static/js/20.7679cdb9.chunk.js"},{"revision":"c9cfd00e2b72315c820bad1858ce0091","url":"static/js/21.c6979180.chunk.js"},{"revision":"2c456edb5099c8574f7da3e8905cf106","url":"static/js/22.9bcca939.chunk.js"},{"revision":"b58e814595566a9c4ce2a322dca7a623","url":"static/js/23.9abe35c6.chunk.js"},{"revision":"9d643d710d2f2621af5443802b151ca4","url":"static/js/24.cb1d4974.chunk.js"},{"revision":"11411cc5b854e9d539b96cf075252fa3","url":"static/js/25.2a5a44ef.chunk.js"},{"revision":"ead7761d8328982216c23732f044faa3","url":"static/js/26.f9b99b86.chunk.js"},{"revision":"e95c50088bb90cd75b924fd6896b4104","url":"static/js/27.80b5fe5c.chunk.js"},{"revision":"dd8079b543dbfce792c8c5a2469525fa","url":"static/js/28.e4748f84.chunk.js"},{"revision":"d3f415eabd0a41f4c71101bad4258c6c","url":"static/js/29.d422cf70.chunk.js"},{"revision":"8727e7bcd1c6b0c050eea5c319696ca6","url":"static/js/3.443f0c6a.chunk.js"},{"revision":"316e1aba8c0bd50ec6d9951faee4d484","url":"static/js/30.a2be885f.chunk.js"},{"revision":"dde4319bafd6e13b14ca12c96e36bd3d","url":"static/js/31.c9021c04.chunk.js"},{"revision":"083ffb13d42a387619dfaabf6500bbde","url":"static/js/32.7dd9e59d.chunk.js"},{"revision":"453d4262efaba49700b0bac3b91e900b","url":"static/js/33.3d66f799.chunk.js"},{"revision":"7ae4dae757b62fa372e565893252682e","url":"static/js/34.c139e92d.chunk.js"},{"revision":"711a7223380f9936282d110314ac2422","url":"static/js/35.abe8881e.chunk.js"},{"revision":"76c6ff0eda8599aa4b2ae5900ae7168d","url":"static/js/36.01823894.chunk.js"},{"revision":"7ae46bd419691da1f3bf1985124dfe6e","url":"static/js/37.32eb1c17.chunk.js"},{"revision":"434ed700bbbf3a1a857808221d6b5849","url":"static/js/38.18360de0.chunk.js"},{"revision":"b83822a7d42d3c3ad9bb09d10f59af00","url":"static/js/39.eb4985bf.chunk.js"},{"revision":"a01cebf2d8302261b57ec08261972ba1","url":"static/js/4.c6f23ee7.chunk.js"},{"revision":"78c0adbe9e97aeaab2360b80aae3d4ae","url":"static/js/40.f51ba65d.chunk.js"},{"revision":"a5e3446248f2a545b5712e03caecee2c","url":"static/js/41.26795e6c.chunk.js"},{"revision":"6bdeb5116a13f3bb314efe2ba1525a94","url":"static/js/42.947557f7.chunk.js"},{"revision":"24830c0800c3d0223bb0325fbaf94ffd","url":"static/js/43.d20a0257.chunk.js"},{"revision":"213105899199284a8e9883da9b0e357c","url":"static/js/44.b1e6e9a3.chunk.js"},{"revision":"16420bf4cc6eaaabf9bd5ed07eec2b84","url":"static/js/45.d3aa4888.chunk.js"},{"revision":"594cad55ce0730ecb36467536d6eaf1e","url":"static/js/5.5ebebbbd.chunk.js"},{"revision":"fabfd06e7bddf8ee9e28e094b7337f1d","url":"static/js/6.2269dc02.chunk.js"},{"revision":"1910ce0303a559ee34149896bf845b7d","url":"static/js/7.b7d67f23.chunk.js"},{"revision":"e3647437c02f782022c22bf1a63971ff","url":"static/js/8.52a51453.chunk.js"},{"revision":"8c50be20950686c29ef5557b24a15194","url":"static/js/main.2c11766b.chunk.js"},{"revision":"0594fed92389730c43f1bc2dbb610c5a","url":"static/js/runtime-main.849201da.js"}]);

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
