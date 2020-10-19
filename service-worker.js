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
    "revision": "eb5153a3d485acd51b1f3519e8d80986"
  },
  {
    "url": "assets/css/0.styles.607c8ecb.css",
    "revision": "fe2aab286b7cbbc92e6bf0033c62d448"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.4b0f61ca.js",
    "revision": "cda27a18709410f208b9c52b9370bad9"
  },
  {
    "url": "assets/js/3.b2fa71ef.js",
    "revision": "bb8ceafb8974aed34a3a763c7ef01149"
  },
  {
    "url": "assets/js/4.4487d67d.js",
    "revision": "f2ebfd1b4a4d0727db1e6c363600447d"
  },
  {
    "url": "assets/js/5.cb0d05db.js",
    "revision": "674f134c60ab63c266a5b1ac52eb4e46"
  },
  {
    "url": "assets/js/6.8c5c41a4.js",
    "revision": "9ec957a3ec2bc047da7de2ef92f218bf"
  },
  {
    "url": "assets/js/7.43ce90aa.js",
    "revision": "8c1a743af63097a54952da48317cb049"
  },
  {
    "url": "assets/js/app.57ed5ccd.js",
    "revision": "01c53614ed4c8466c111e6f3ff363b8e"
  },
  {
    "url": "dts-webpack-plugin/index.html",
    "revision": "3709af59f6627531c68b4f5eeacf4cf4"
  },
  {
    "url": "index.html",
    "revision": "50f2ab95deea7237a9ebc953350281b8"
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
