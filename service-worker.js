/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "dd74f2b74277ed5289bd3548937c021b"
  },
  {
    "url": "assets/css/0.styles.9c9418b9.css",
    "revision": "7d69715487b1532849e91f70cb79143f"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.e1696e81.js",
    "revision": "cda27a18709410f208b9c52b9370bad9"
  },
  {
    "url": "assets/js/3.b2fa71ef.js",
    "revision": "bb8ceafb8974aed34a3a763c7ef01149"
  },
  {
    "url": "assets/js/4.761ded7b.js",
    "revision": "f2ebfd1b4a4d0727db1e6c363600447d"
  },
  {
    "url": "assets/js/5.2cd55344.js",
    "revision": "7402a97a8e6a982ab22849ee165f996f"
  },
  {
    "url": "assets/js/6.aa6ae63c.js",
    "revision": "24c93f8acaaa3abdd79884a46891b4f9"
  },
  {
    "url": "assets/js/7.43ce90aa.js",
    "revision": "8c1a743af63097a54952da48317cb049"
  },
  {
    "url": "assets/js/app.880a2463.js",
    "revision": "50478d640239101d4442ccb4f13807d9"
  },
  {
    "url": "dts-webpack-plugin/index.html",
    "revision": "2813e60ce0f617f77abf1a5883a2064c"
  },
  {
    "url": "index.html",
    "revision": "f087cf874072a742a6af11afad77b519"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
