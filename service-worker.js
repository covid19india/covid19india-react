if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"48a53665e9a5b7c3b812d5d6ba82ad13","url":"2607bfc30afc84ea4e21.worker.js"},{"revision":"d9a7876d272ff73ada28ba7293759d28","url":"404.html"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"d9a7876d272ff73ada28ba7293759d28","url":"index.html"},{"revision":"b8a76dfc200c570ef1c95c60707c4a44","url":"precache-manifest.b8a76dfc200c570ef1c95c60707c4a44.js"},{"revision":"4106c517347acae79f966f6492797959","url":"static/css/14.aa9ef476.chunk.css"},{"revision":"dd5a04426790bd19ca34854dd42dac30","url":"static/js/0.668fa44e.chunk.js"},{"revision":"c951c15a5e8ed9e6d74ce288a8785c4f","url":"static/js/1.1fb1b76e.chunk.js"},{"revision":"7b8174651c8900b47689cd6678fce544","url":"static/js/10.6e04581f.chunk.js"},{"revision":"b1f2f71525ed62221afe5dcc75e96d75","url":"static/js/11.08709831.chunk.js"},{"revision":"03743c66736400f73888869fe4615dc5","url":"static/js/12.21272d94.chunk.js"},{"revision":"0d48bc700ea6a69cdcfb67a18486f5cc","url":"static/js/13.502ef527.chunk.js"},{"revision":"f17db1122d6b201d1d0bf10064255515","url":"static/js/14.eafc0c32.chunk.js"},{"revision":"47ff1418e4b3a5e5a85af2a61f8b78a4","url":"static/js/15.36eb7c4d.chunk.js"},{"revision":"98c777f0814ca7ed89f5191cf4413551","url":"static/js/16.a703eb28.chunk.js"},{"revision":"5e0f7ca5ea7e4b2491752915e24ca620","url":"static/js/17.4c41448c.chunk.js"},{"revision":"eedc28a63ad288cfd6f27ef8861a3bbe","url":"static/js/18.9dc66ec2.chunk.js"},{"revision":"70b17c5d97f0b649a01e09bce7efdc2e","url":"static/js/19.9950086e.chunk.js"},{"revision":"d50d4079049e18599000ca7ee6ae937c","url":"static/js/2.9dc2b985.chunk.js"},{"revision":"24928cba2063545a5387da10762b8010","url":"static/js/20.e880c28b.chunk.js"},{"revision":"54ea66e4d7d6aec089d525ca047fb2cb","url":"static/js/21.e32f0e72.chunk.js"},{"revision":"3cdb59897b47d6a8fc3dcc333df240cb","url":"static/js/22.c86dbcae.chunk.js"},{"revision":"67103903c2474e6039c45a74ee9fb347","url":"static/js/23.b1000aab.chunk.js"},{"revision":"165795f53c83636eec4ed7fd040d0182","url":"static/js/24.9fa2cc66.chunk.js"},{"revision":"3c78c90071ff27cd038a721ea8460e08","url":"static/js/25.87ff72e9.chunk.js"},{"revision":"4ac454d61b44598180f264205a1db9ff","url":"static/js/26.9e564ae2.chunk.js"},{"revision":"5f314f1a6b5f761b6a03c860a317ffa9","url":"static/js/27.10bf4cc6.chunk.js"},{"revision":"2e6282ccf957fa4aa34f6a6035a31fdd","url":"static/js/28.8a783803.chunk.js"},{"revision":"8880ae528f5ec6f59b29ee34d2fde226","url":"static/js/29.22e254aa.chunk.js"},{"revision":"27b4db684c521f9a659ff6095bcfb271","url":"static/js/3.1a55f62c.chunk.js"},{"revision":"96294f7a766da79e75db9f55a3c76740","url":"static/js/30.dc99b4ed.chunk.js"},{"revision":"7065d3bb69a515a96eb4ea3faf105630","url":"static/js/31.9401e001.chunk.js"},{"revision":"cf6ca2d1b7258570f237c409485e8a3f","url":"static/js/32.f82fbffb.chunk.js"},{"revision":"12ea6f7d9ce8e4ca049eb6eaff625743","url":"static/js/33.108f6495.chunk.js"},{"revision":"e2660c94475a15c1140dc5ac20140cd1","url":"static/js/34.3abcbfc7.chunk.js"},{"revision":"63733034b5930af54acbf23205025df4","url":"static/js/35.1fe2997a.chunk.js"},{"revision":"d45de000a5dd8f5de30e4914d216f013","url":"static/js/36.44e42e27.chunk.js"},{"revision":"2d43f668512b9a858f42b41bf0254097","url":"static/js/4.48a698fe.chunk.js"},{"revision":"5556caa33fe02980e9151190224d46bf","url":"static/js/5.4bccbdb6.chunk.js"},{"revision":"0ac2621b6f0e40cbc9f1373a68efec51","url":"static/js/8.baa3474c.chunk.js"},{"revision":"817c8fd5e9a649b9a485ab8111c5d7f9","url":"static/js/9.15fe78d6.chunk.js"},{"revision":"c53c2b4d95f819287dc8f58d1df8e43b","url":"static/js/main.ed774efc.chunk.js"},{"revision":"f0b176d3c14314d0528f5e717291596e","url":"static/js/runtime-main.f9308ede.js"}]);

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
