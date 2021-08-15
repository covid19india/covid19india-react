if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded 🚀');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([{"revision":"fc401140d5c936c5a100995a79920570","url":"404.html"},{"revision":"0c209acdd19f6732370568f7a6ae0bdf","url":"ece08537062c28a2a7c1.worker.js"},{"revision":"ad8463d1313fed60e1d10324511efdc3","url":"fonts/Archia/archia-bold-webfont.woff2"},{"revision":"80da55a565ba8976b8e9e84e8c511bf7","url":"fonts/Archia/archia-medium-webfont.woff2"},{"revision":"890ee929da47c4931933ff77fd557520","url":"fonts/Archia/archia-semibold-webfont.woff2"},{"revision":"fc401140d5c936c5a100995a79920570","url":"index.html"},{"revision":"3a9110ae9e9919cf864852f316e8e086","url":"static/css/2.1432c553.chunk.css"},{"revision":"1139c7f91659b8d1e1f13fd2fdfdf753","url":"static/css/21.f5f9d973.chunk.css"},{"revision":"fa58b34f703b8f212cb370759f77815a","url":"static/css/22.abf343ae.chunk.css"},{"revision":"038a830223503314180873a2c08b9a52","url":"static/js/0.3d2b55ab.chunk.js"},{"revision":"7e7ca35a8a5239507508df4e63217ecd","url":"static/js/1.4e5d9725.chunk.js"},{"revision":"1577d0ead58068767ec32da154139094","url":"static/js/12.91c2a2ee.chunk.js"},{"revision":"a1504cc66f371f7cd36832d3289c5d93","url":"static/js/13.5f9df3ac.chunk.js"},{"revision":"cf1138150a440e8e5f12a49de506f37b","url":"static/js/14.483108de.chunk.js"},{"revision":"a9cb50aad705c4b8bde199863faba00a","url":"static/js/15.e15ac25f.chunk.js"},{"revision":"41891a7eecca793407228a9748aac6c7","url":"static/js/16.ff48d2af.chunk.js"},{"revision":"c032d74bcdda1256b028d255ccf50a97","url":"static/js/17.fa388029.chunk.js"},{"revision":"25ca1b80ef98665fc9ac98135a2181e1","url":"static/js/18.201ff006.chunk.js"},{"revision":"481592f8711d79a5947faaa54f22b796","url":"static/js/19.2d409621.chunk.js"},{"revision":"9e1d7b65707ab45fc810945d17a1cee4","url":"static/js/2.366b601a.chunk.js"},{"revision":"cc777d6aa417337a89f74362834c86dd","url":"static/js/20.8166b4fb.chunk.js"},{"revision":"85a2ae34a4b39f8e66efe5aebd0801cb","url":"static/js/21.9bd19794.chunk.js"},{"revision":"97fd4f0395eee24e11d6506beaf60332","url":"static/js/22.5e2447be.chunk.js"},{"revision":"404aa6d9f42d44e746f1b771de070e22","url":"static/js/23.42d3f2ab.chunk.js"},{"revision":"d72c7c69b4122738cba4303b6112027d","url":"static/js/24.ee7e814d.chunk.js"},{"revision":"2c73b303141c95b09433c1910813ac99","url":"static/js/25.ba337a84.chunk.js"},{"revision":"78986b100d1c2198b22cc72dbdab826b","url":"static/js/26.f2b255d2.chunk.js"},{"revision":"28090b1d33dedeb535c7897657c8e284","url":"static/js/27.5ccd541d.chunk.js"},{"revision":"0781d2320ce5663d175392b3df908ba0","url":"static/js/28.38092025.chunk.js"},{"revision":"ec49642fa22a3866efcf4e1364009919","url":"static/js/29.2631d456.chunk.js"},{"revision":"23fba0311df18956392ade9e769242e9","url":"static/js/3.46c4bf93.chunk.js"},{"revision":"d217794d1678503dd7fbccd18078e693","url":"static/js/30.60038fdf.chunk.js"},{"revision":"b1451e5332f14140ba952a0811aeede2","url":"static/js/31.2eb4a85e.chunk.js"},{"revision":"b152da9a16849e7b9df646e979678466","url":"static/js/32.02b2960c.chunk.js"},{"revision":"349e7ad2fc08f8054629b563468f6bc4","url":"static/js/33.bc66a3bd.chunk.js"},{"revision":"4ef522f1e765701f0639eb64aa83fc48","url":"static/js/34.6ac3cd52.chunk.js"},{"revision":"a700ba81ee19510a558724da690400d8","url":"static/js/35.7765fb3a.chunk.js"},{"revision":"194a668a09ecab34f2da21372820bed6","url":"static/js/36.55fde370.chunk.js"},{"revision":"851bf260838b4a693efefdbd4de735ea","url":"static/js/37.17f2e74f.chunk.js"},{"revision":"e631fbc76ef0d627805bcc1c8d2010f4","url":"static/js/38.6f1499c4.chunk.js"},{"revision":"b3353fd158c6094ef648297358c25826","url":"static/js/39.d35e33aa.chunk.js"},{"revision":"790e1d33656c2ae278bd35043eca2682","url":"static/js/4.de3e7cc2.chunk.js"},{"revision":"78c0adbe9e97aeaab2360b80aae3d4ae","url":"static/js/40.f51ba65d.chunk.js"},{"revision":"be19461d69f77b9de767975a0410bee9","url":"static/js/41.41771167.chunk.js"},{"revision":"0a0a27ab5a4c3d785518dd85b3bcf0b7","url":"static/js/42.3a616d0f.chunk.js"},{"revision":"3e2d7902613731325809063be527478f","url":"static/js/43.f943f022.chunk.js"},{"revision":"583230a9d9c38bb5b788ad45cc9346da","url":"static/js/44.366c4d9c.chunk.js"},{"revision":"8fd985c0bc9ae388350997558cc45429","url":"static/js/45.e9b2d3f9.chunk.js"},{"revision":"a5483a5bb0b0a98302cf07d2452f7244","url":"static/js/46.8c39b76b.chunk.js"},{"revision":"fe3156fed30837a3df4ee65a8c1c9d7b","url":"static/js/5.c5ce36d5.chunk.js"},{"revision":"ae1618115480c6076d4502b84688dfe8","url":"static/js/6.d2095f22.chunk.js"},{"revision":"23afd2f4fcd9571d0827fc5f79600801","url":"static/js/7.d3661f2d.chunk.js"},{"revision":"01cfc3c4e0edaea40b07ec1eaafdbc09","url":"static/js/8.858f68c6.chunk.js"},{"revision":"3504d30aaf2770e6b4d91aba3266e420","url":"static/js/9.6a558fda.chunk.js"},{"revision":"9d30c3371d73daeaaa9da30627ee1db9","url":"static/js/main.691500ad.chunk.js"},{"revision":"dafc188f40539d1bbbe07469f555ec98","url":"static/js/runtime-main.0c84b304.js"}]);

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
