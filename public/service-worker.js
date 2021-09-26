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
    "revision": "469783fb54d5ac21fa597e42a6335751"
  },
  {
    "url": "assets/css/0.styles.3873a65f.css",
    "revision": "08c48b47b3f7a7031693eb9e974d8ee5"
  },
  {
    "url": "assets/img/1.2db9b366.png",
    "revision": "2db9b3665606b1a44bc5ccfccede030b"
  },
  {
    "url": "assets/img/1.f5e7574b.png",
    "revision": "f5e7574b2eb50be7222863eb7ec09bf3"
  },
  {
    "url": "assets/img/2.0c182c25.png",
    "revision": "0c182c2594374ae7d5ca92b7e63cfa78"
  },
  {
    "url": "assets/img/algorithm1.8f805051.jpg",
    "revision": "8f805051843ea867e6683089cc5ab855"
  },
  {
    "url": "assets/img/algorithm2.98d45d3c.jpg",
    "revision": "98d45d3ce0800161c6a1ee084af75fb5"
  },
  {
    "url": "assets/img/algorithm3.ca837ffb.jpg",
    "revision": "ca837ffb0010a4479d9e2bf27fee07cb"
  },
  {
    "url": "assets/img/bg.2cfdbb33.svg",
    "revision": "2cfdbb338a1d44d700b493d7ecbe65d3"
  },
  {
    "url": "assets/img/BRtree1.f1aa3845.jpg",
    "revision": "f1aa38450e1cc4ec67fd5bfc24778f78"
  },
  {
    "url": "assets/img/BRtree2.18ffe8fc.jpg",
    "revision": "18ffe8fcb1cb60d0715353ef9a12e5ec"
  },
  {
    "url": "assets/img/BRtree3.a8567e1a.jpg",
    "revision": "a8567e1a42f33f41760720e1d4d7109d"
  },
  {
    "url": "assets/img/BRtree4.dac0088d.jpg",
    "revision": "dac0088d974a8e6f85f765d83bbd56db"
  },
  {
    "url": "assets/img/BRtree5.3e1a4fc5.jpg",
    "revision": "3e1a4fc59af5b03979414e9eb5f44552"
  },
  {
    "url": "assets/img/BRtree6.7820ed33.jpg",
    "revision": "7820ed3395676aae8098646a99036684"
  },
  {
    "url": "assets/img/BRtree7.dfe1c8ac.jpg",
    "revision": "dfe1c8ac6eaaabc00df39db9e13049d6"
  },
  {
    "url": "assets/img/claw.f886b8d5.svg",
    "revision": "f886b8d5021c8af029e2cd4dea609bcc"
  },
  {
    "url": "assets/img/CORS_1.62e1811f.png",
    "revision": "62e1811f634d16518ee7f502d96bd418"
  },
  {
    "url": "assets/img/Event-bus.628fe234.jpg",
    "revision": "628fe234ec68b39624752a912a721597"
  },
  {
    "url": "assets/img/eventloop1.63cc97b5.jpg",
    "revision": "63cc97b56920e259fde5e5c47a3041b2"
  },
  {
    "url": "assets/img/eventloop2.20e9a248.jpg",
    "revision": "20e9a248cc97f1db599dcf52506931e9"
  },
  {
    "url": "assets/img/gitprocession.d3450701.jpg",
    "revision": "d3450701a83113c95f2beaf66c15f46b"
  },
  {
    "url": "assets/img/graph1.48b74e62.jpg",
    "revision": "48b74e621a463aec782de4ef28a1a376"
  },
  {
    "url": "assets/img/graph2.86556a56.jpg",
    "revision": "86556a562df7ca8bb392b4ac3304ca12"
  },
  {
    "url": "assets/img/graph4.b337453d.jpg",
    "revision": "b337453d77f7d1457f9bc8fbdaf4927e"
  },
  {
    "url": "assets/img/graph5.08868021.jpg",
    "revision": "088680219b355a165c90724cd7d33998"
  },
  {
    "url": "assets/img/graph6.f805f2f2.jpg",
    "revision": "f805f2f24e8a23f81ae407cce61b5680"
  },
  {
    "url": "assets/img/graph7.d5ae77a0.jpg",
    "revision": "d5ae77a083210bd18604170dee3339df"
  },
  {
    "url": "assets/img/graph8.a4744a08.jpg",
    "revision": "a4744a08e2ec13a7156a09b6b02d2cd3"
  },
  {
    "url": "assets/img/h5hole-1.3a02f9d5.png",
    "revision": "3a02f9d5d918be187ae8d8ba696d693c"
  },
  {
    "url": "assets/img/Hash1.c77848e0.jpg",
    "revision": "c77848e0d51f230a497dc2a5b4ac7e3f"
  },
  {
    "url": "assets/img/Hash2.3c411b6f.jpg",
    "revision": "3c411b6f1e13b7a853b3435394a3081d"
  },
  {
    "url": "assets/img/Hash3.140dcf09.jpg",
    "revision": "140dcf09e3698e7292fbab5a1e20b967"
  },
  {
    "url": "assets/img/hash4.820e4e57.jpg",
    "revision": "820e4e5714c0a2288be65dc6173e9e54"
  },
  {
    "url": "assets/img/iconfont.36767f3e.svg",
    "revision": "36767f3efa2e4c880f42a42e8b2075b0"
  },
  {
    "url": "assets/img/lifecycle.6f2c97f0.png",
    "revision": "6f2c97f045ba988851b02056c01c8d62"
  },
  {
    "url": "assets/img/QA1.bc8d7ecf.png",
    "revision": "bc8d7ecf52a4df753e196c7ce6c27894"
  },
  {
    "url": "assets/img/QA2.71d8a2c8.png",
    "revision": "71d8a2c8a96f4d71733e408705b810c4"
  },
  {
    "url": "assets/img/quickSort.637730fc.jpg",
    "revision": "637730fcc4bd79e5c1a9b432dc8e591d"
  },
  {
    "url": "assets/img/render-theory-second.d8d6290c.png",
    "revision": "d8d6290cbf9c622eef481563586290b4"
  },
  {
    "url": "assets/img/render-theory-third.547d7b8b.png",
    "revision": "547d7b8b9fb9c3425ae814bd2c579ce4"
  },
  {
    "url": "assets/img/render-theory.b7d93616.png",
    "revision": "b7d9361608522ba425353ce355bf75e2"
  },
  {
    "url": "assets/img/shake1.5c0e7ba1.png",
    "revision": "5c0e7ba1aba62e502052464aeb9a1142"
  },
  {
    "url": "assets/img/shake2.826c5bd5.png",
    "revision": "826c5bd5ee91618d4246a80980582a62"
  },
  {
    "url": "assets/img/shellSort.0a95909a.png",
    "revision": "0a95909af53e76fa0e6365d12504cbe6"
  },
  {
    "url": "assets/img/transition.5990c1df.png",
    "revision": "5990c1dff7dc7a8fb3b34b4462bd0105"
  },
  {
    "url": "assets/img/tree1.3e6cdb38.jpg",
    "revision": "3e6cdb38d96133fc831b321cf0e5af30"
  },
  {
    "url": "assets/img/tree10.14a854f0.jpg",
    "revision": "14a854f01e5fd5f371a9ef922814b63e"
  },
  {
    "url": "assets/img/tree11.2585b98c.jpg",
    "revision": "2585b98cae57ee6fb31dfc4abbc6c94e"
  },
  {
    "url": "assets/img/tree2.8580800f.jpg",
    "revision": "8580800ff1e9e22b1c8ed27f82b26dee"
  },
  {
    "url": "assets/img/tree3.f2959c56.jpg",
    "revision": "f2959c568bfee1a414f413c99e2e16d4"
  },
  {
    "url": "assets/img/tree4.a6974ff9.jpg",
    "revision": "a6974ff9c0f55e8caa548d7f106bbb78"
  },
  {
    "url": "assets/img/tree5.73413525.jpg",
    "revision": "734135257dedc5fb4c22f132e2c908c6"
  },
  {
    "url": "assets/img/tree6.812c957f.jpg",
    "revision": "812c957ff5c363dd94a2074880b88a01"
  },
  {
    "url": "assets/img/tree7.a2a3b8a3.jpg",
    "revision": "a2a3b8a37dceb183ecbd5bec9c713cb6"
  },
  {
    "url": "assets/img/tree8.a13f47c9.jpg",
    "revision": "a13f47c91092ff684075cab0232e380b"
  },
  {
    "url": "assets/img/tree9.1845c1e5.jpg",
    "revision": "1845c1e5a4c40d787edc0a9eb8139c3f"
  },
  {
    "url": "assets/img/vuecli-create1.75f5e83a.png",
    "revision": "75f5e83aab9d310c3a64b9bf74b339f7"
  },
  {
    "url": "assets/img/vuecli-pro.be51dc70.png",
    "revision": "be51dc7081761c5a7b07a4dc08010293"
  },
  {
    "url": "assets/js/1.60fccb86.js",
    "revision": "118898b02dc0adee054de8120fac0489"
  },
  {
    "url": "assets/js/10.c69f886a.js",
    "revision": "c5c7ef0cc15f3d7efe84214a95e44f41"
  },
  {
    "url": "assets/js/11.fb0b23aa.js",
    "revision": "f3e1faf3422258568aee1294ce10bc1d"
  },
  {
    "url": "assets/js/12.0345760d.js",
    "revision": "34dc0bc4302020a6bb2a5df29fb12a10"
  },
  {
    "url": "assets/js/13.0a4f946d.js",
    "revision": "f2dc7db20d3e95a24a4026f185f14040"
  },
  {
    "url": "assets/js/14.8430c17c.js",
    "revision": "a9e8eb4ad960c5483f4060320107b9ff"
  },
  {
    "url": "assets/js/15.47bd8f57.js",
    "revision": "e346fcb852d86db9cd103a7cefb3245b"
  },
  {
    "url": "assets/js/16.e7ea0565.js",
    "revision": "fdf4b9ae65f5c7c22b921768b0581816"
  },
  {
    "url": "assets/js/17.2d512173.js",
    "revision": "633fd4dd701e0ac0174ac2bd3cb3637b"
  },
  {
    "url": "assets/js/18.03c8acec.js",
    "revision": "d3254c823ced817e11b3f0f75b6ca770"
  },
  {
    "url": "assets/js/19.7a77a8fc.js",
    "revision": "44f719913cff602386d42bdffa4a40e6"
  },
  {
    "url": "assets/js/20.aebcb00c.js",
    "revision": "ed5e523e9d3adb2e92823d53ca1ed721"
  },
  {
    "url": "assets/js/21.b580937f.js",
    "revision": "f8e2aed5660e7745e24c4dbdd7aa394c"
  },
  {
    "url": "assets/js/22.1a8f4434.js",
    "revision": "a07c6a67d513a088a97f58a215fdc867"
  },
  {
    "url": "assets/js/23.f5784356.js",
    "revision": "da972c51e48f1b358f68075f32e5eb06"
  },
  {
    "url": "assets/js/24.546cef79.js",
    "revision": "9a340241860d3c7ac6c7cfc7206a0b3f"
  },
  {
    "url": "assets/js/25.964e5ae3.js",
    "revision": "5b1c9d0cb2b27563538ffa5b2c3b4590"
  },
  {
    "url": "assets/js/26.859583bc.js",
    "revision": "0f5be745d68f1d4890fe509cb77bc881"
  },
  {
    "url": "assets/js/27.b4060971.js",
    "revision": "5f270342ee0ce62970bee1b20bddb639"
  },
  {
    "url": "assets/js/28.efa8dc10.js",
    "revision": "40b0d7fa4307826ab571d7f3cf7197c2"
  },
  {
    "url": "assets/js/29.53fede5d.js",
    "revision": "1c8bacb4353fc15f0387cee3c9f2e141"
  },
  {
    "url": "assets/js/30.eaea4ea6.js",
    "revision": "2899d8de0113c8d644d9ca076d8f036c"
  },
  {
    "url": "assets/js/31.13dda85c.js",
    "revision": "f648732a238e62fb7f12106313b4dc40"
  },
  {
    "url": "assets/js/32.4eee27cb.js",
    "revision": "d03e4a60b8a248482fc0b7005beb89f7"
  },
  {
    "url": "assets/js/33.26fdfb24.js",
    "revision": "a7478e3fee74691ce143c6c4e07713cc"
  },
  {
    "url": "assets/js/4.e8635aea.js",
    "revision": "3a16a2505cdd6593bbb75abd7a1ff00c"
  },
  {
    "url": "assets/js/5.05eaafec.js",
    "revision": "75074f5dc53a7b566288b2dc29c8b129"
  },
  {
    "url": "assets/js/6.a175f833.js",
    "revision": "5e4c5bc568a2ecaa4da437a403ed25d9"
  },
  {
    "url": "assets/js/7.f6a7fe54.js",
    "revision": "312d39f252d0e496837326cc95fb602d"
  },
  {
    "url": "assets/js/8.7bc90144.js",
    "revision": "a1be97436786916955601c81b4819993"
  },
  {
    "url": "assets/js/9.8c6db37d.js",
    "revision": "c675fbcad42e1b18ef61132f27112772"
  },
  {
    "url": "assets/js/app.1cab0bc0.js",
    "revision": "a71cf787f80ff98dfe4675c22b8c8356"
  },
  {
    "url": "assets/js/vendors~flowchart.cbc429d5.js",
    "revision": "a61aaaaabf57aec37532687dc6ae5bd8"
  },
  {
    "url": "banner.jpg",
    "revision": "1c189586bbd99a17b9e4b0121a408d3c"
  },
  {
    "url": "categories/datastructure&algorithm/index.html",
    "revision": "9be36905f769863f17fc8946c832a471"
  },
  {
    "url": "categories/frontend-article/index.html",
    "revision": "45c9c38c5f7fffd4eff93c40adc72056"
  },
  {
    "url": "categories/frontend-article/page/2/index.html",
    "revision": "5bd21e7db102ce569962df379d873954"
  },
  {
    "url": "categories/index.html",
    "revision": "c5b087f781f76c648fa0b27e6ca43644"
  },
  {
    "url": "categories/网络协议/index.html",
    "revision": "2948e2b1a6c8d6126d9893f77abcf198"
  },
  {
    "url": "categories/运维/index.html",
    "revision": "621fd524f389908ffee1f4e3eb41aa82"
  },
  {
    "url": "categories/随笔日记/index.html",
    "revision": "a6359e12de2e6dfd559513a41471aa8c"
  },
  {
    "url": "head.jpg",
    "revision": "350e4ac403a28d3ee7580e76d27e3202"
  },
  {
    "url": "head.png",
    "revision": "9e98f9efba10bcad33519b782a1d09db"
  },
  {
    "url": "hero_black.png",
    "revision": "341621b18486ba4639bd2fa6fa5aab98"
  },
  {
    "url": "hero_old.png",
    "revision": "6e0567b30bfbca91471a5d5b886a13c5"
  },
  {
    "url": "hero_write.png",
    "revision": "944bdac8ed5e270e2e51db554b4c2232"
  },
  {
    "url": "index.html",
    "revision": "d488d0896737d7a7f0e9d1e2a79cbf0a"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "392ac6e718ff170e395e8da7c0434224"
  },
  {
    "url": "tag/index.html",
    "revision": "521cabe78ea20208357c37b092d9a277"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "f92ba29def4483bdaba791640fcb262f"
  },
  {
    "url": "tag/TCP/index.html",
    "revision": "72a15b3d0a0e319f2c89953c1bab5235"
  },
  {
    "url": "tag/Vue/index.html",
    "revision": "7aa399d39549ac8687ef7d0392d0eff5"
  },
  {
    "url": "tag/算法/index.html",
    "revision": "cfe64b66c55c0b8ce2f2f54f964dc62d"
  },
  {
    "url": "tag/运维/index.html",
    "revision": "873f53dcf900c56ba6491376f0f41fc9"
  },
  {
    "url": "tag/项目/index.html",
    "revision": "264a50059772697d1ed4773c1fe12938"
  },
  {
    "url": "timeline/index.html",
    "revision": "3fb213818c5b2e229c2fb194a6ec0962"
  },
  {
    "url": "views/datastructure&algorithm/algorithm.html",
    "revision": "2e9373d373f7db43313b55ae31f9cb5b"
  },
  {
    "url": "views/datastructure&algorithm/dataStructures.html",
    "revision": "c67d6a92444632752cc7ee6d3db8bbce"
  },
  {
    "url": "views/essay/2021-9-11.html",
    "revision": "7d188a3ccfaba45601756fb8535f6d72"
  },
  {
    "url": "views/essay/Proj-essay.html",
    "revision": "ad2fc0b1ff7b56702d12632284e4ca83"
  },
  {
    "url": "views/essay/Question-and-answer-h5.html",
    "revision": "48cc539a47218b3919bba132d10c8f53"
  },
  {
    "url": "views/essay/vue-reader.html",
    "revision": "52564a7cf5866f66c2d39aa6de3e282c"
  },
  {
    "url": "views/frontend/currying.html",
    "revision": "dc2507248aa104e197242fc4fc3a7a3d"
  },
  {
    "url": "views/frontend/es6.html",
    "revision": "0f60b57495dfad994ade09decc021734"
  },
  {
    "url": "views/frontend/eventloop.html",
    "revision": "117d33d11f782bd080bcc117fc1b8eb7"
  },
  {
    "url": "views/frontend/optimizing.html",
    "revision": "c92c6ad773daba8d5454de4a9c19176f"
  },
  {
    "url": "views/frontend/pwa.html",
    "revision": "f7b54d48d09a48cee20ad689641413fe"
  },
  {
    "url": "views/frontend/typeScript.html",
    "revision": "72e37876e2d8ec274fb5f35b50e7a9c6"
  },
  {
    "url": "views/frontend/vue_classcomponent.html",
    "revision": "0cc092cd7e38905896fc20aeff5aa851"
  },
  {
    "url": "views/frontend/Vue.html",
    "revision": "c6028d08d264c213289ac0435b4d071b"
  },
  {
    "url": "views/frontend/VueCli.html",
    "revision": "dbb5296c970b91c69323c5b330facaac"
  },
  {
    "url": "views/frontend/vuelidate.html",
    "revision": "359e766fdc46a09ec8e4a0a0a814f467"
  },
  {
    "url": "views/frontend/VueRouter.html",
    "revision": "24100dbdea686d7f8837bdee850ed6d4"
  },
  {
    "url": "views/net/CORS.html",
    "revision": "8b6e4f4b7a35006cc4b7ef784a155e1e"
  },
  {
    "url": "views/net/Shakehands-wave.html",
    "revision": "768a6899f8f18b8802c0eed0d3cec31c"
  },
  {
    "url": "views/server/docker.html",
    "revision": "e95cd4607dcf4296f1eba696660091fb"
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
