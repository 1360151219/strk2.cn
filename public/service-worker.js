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
    "revision": "6b102eea23c5c3d1200d0149fd201f16"
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
    "url": "assets/js/10.2b3bb982.js",
    "revision": "fe1992c12ecd73a1e7f3aa9c824d106f"
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
    "url": "assets/js/16.79801c11.js",
    "revision": "526ab0b61a91af6ab0c986cccec97446"
  },
  {
    "url": "assets/js/17.2d512173.js",
    "revision": "633fd4dd701e0ac0174ac2bd3cb3637b"
  },
  {
    "url": "assets/js/18.03a40397.js",
    "revision": "c35ff455c27bb872102644c7af7f08da"
  },
  {
    "url": "assets/js/19.d4a41156.js",
    "revision": "faa85e477b5404d58b05fb52636edf2c"
  },
  {
    "url": "assets/js/20.857c0cb4.js",
    "revision": "c66a3c2f6a03679542e3271cc4a15d36"
  },
  {
    "url": "assets/js/21.a839f0e9.js",
    "revision": "ac0ebef0a02b8be0581c090f96b6ae48"
  },
  {
    "url": "assets/js/22.4d6d4cc7.js",
    "revision": "bfaba8abf362ece6c32d80768272294c"
  },
  {
    "url": "assets/js/23.3a89c30c.js",
    "revision": "908d5abe5fdb71ddadd41bdfb78114a2"
  },
  {
    "url": "assets/js/24.ceacccf1.js",
    "revision": "8174d3d4464da60736de9b1c08bb14a6"
  },
  {
    "url": "assets/js/25.5388e83e.js",
    "revision": "0e0c4c669f77181a69b26c4f98eb6b05"
  },
  {
    "url": "assets/js/26.c7ee5b30.js",
    "revision": "4ccf8fa3d35ddf7387716c0bbe2baac1"
  },
  {
    "url": "assets/js/27.9d43cce3.js",
    "revision": "96fe480b95baf35eade5564655b5d621"
  },
  {
    "url": "assets/js/28.3d47ca86.js",
    "revision": "16001742c75cf522c6e735a4237c0590"
  },
  {
    "url": "assets/js/29.c8a38767.js",
    "revision": "711f64d56cacdccab02d0c2bec9ef67d"
  },
  {
    "url": "assets/js/30.54dcd73c.js",
    "revision": "c3bd1544d3cb7a355f7c0affbcefa43d"
  },
  {
    "url": "assets/js/31.fd468d0a.js",
    "revision": "f515195ab7bc089fa9777692c109bcb8"
  },
  {
    "url": "assets/js/32.88bb0277.js",
    "revision": "a04680323027bf5efae6b0e0443f21e0"
  },
  {
    "url": "assets/js/33.26fdfb24.js",
    "revision": "a7478e3fee74691ce143c6c4e07713cc"
  },
  {
    "url": "assets/js/4.e3a3abff.js",
    "revision": "07cd6191aa9c2b6b7af08f1332381ef4"
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
    "url": "assets/js/9.fa64a175.js",
    "revision": "fafc995d7e6832dc135ab47a76aa1b4f"
  },
  {
    "url": "assets/js/app.53e568d0.js",
    "revision": "3bb6f0d5073fa7158e22edc62cdf6e56"
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
    "revision": "ae6f49081fab466e1e28a66bc9d20ac4"
  },
  {
    "url": "categories/frontend-article/index.html",
    "revision": "779206958e281ee64e96434ff8c6f073"
  },
  {
    "url": "categories/frontend-article/page/2/index.html",
    "revision": "37a51e36505873cdd2a0032a9d102d63"
  },
  {
    "url": "categories/index.html",
    "revision": "86540e3af143aab9f764b6965e6dc900"
  },
  {
    "url": "categories/网络协议/index.html",
    "revision": "04db7dce472341facff30332b9f4b8bb"
  },
  {
    "url": "categories/运维/index.html",
    "revision": "5aa632c3d467fdf7ed873355ee185d2f"
  },
  {
    "url": "categories/随笔日记/index.html",
    "revision": "e92f59dd0230ac7493a0fcc94cd9b134"
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
    "revision": "96aba973ac54529c1daf12a9fd796ccc"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "8120b1d8d450bdb5b1aa8ce52fcc9718"
  },
  {
    "url": "tag/index.html",
    "revision": "2a0f6ebe92c68339fb7ce14155a3d78a"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "08af3772fed00556c278f97940b248da"
  },
  {
    "url": "tag/TCP/index.html",
    "revision": "807dd31f167ae210ac9fe8df4c4be57a"
  },
  {
    "url": "tag/Vue/index.html",
    "revision": "9f1b99604321ee2015e7b0b147d4d61c"
  },
  {
    "url": "tag/算法/index.html",
    "revision": "46fd6a409a9d68718514218f7d667ddb"
  },
  {
    "url": "tag/运维/index.html",
    "revision": "0cce7c006fd2476e53dd802fcde80f5b"
  },
  {
    "url": "tag/项目/index.html",
    "revision": "71e12986d2e39f10f1f6708680fb65d4"
  },
  {
    "url": "timeline/index.html",
    "revision": "c71dd28a750781501f1bba5e4d7eead2"
  },
  {
    "url": "views/datastructure&algorithm/algorithm.html",
    "revision": "0cdd025cb4c64242597bb5bfe8921836"
  },
  {
    "url": "views/datastructure&algorithm/dataStructures.html",
    "revision": "65910aa9634ee8832c7ea957d1c452c0"
  },
  {
    "url": "views/essay/2021-9-11.html",
    "revision": "1db7af1638b40e1cd747345bee6d718d"
  },
  {
    "url": "views/essay/Proj-essay.html",
    "revision": "1088918a53860a7d4948a7a4d8fe04d3"
  },
  {
    "url": "views/essay/Question-and-answer-h5.html",
    "revision": "c11cfc11de85c8609aa225a21ce14b21"
  },
  {
    "url": "views/essay/vue-reader.html",
    "revision": "253c00db20f5beba5521e0aeae252a5b"
  },
  {
    "url": "views/frontend/currying.html",
    "revision": "a21f4d86e192303be4c474bddeb622aa"
  },
  {
    "url": "views/frontend/es6.html",
    "revision": "b1a0f5dc3ca3b76ba0b9e510791769a9"
  },
  {
    "url": "views/frontend/eventloop.html",
    "revision": "c18efbb8ae492c891f1a48d417d725e3"
  },
  {
    "url": "views/frontend/optimizing.html",
    "revision": "e2a3cfcdba91ab593a0e5a8c9a83bbe6"
  },
  {
    "url": "views/frontend/pwa.html",
    "revision": "fadee199ffb4098c19e953eb1e8e8954"
  },
  {
    "url": "views/frontend/typeScript.html",
    "revision": "0cb9a393956fe4708b65b3f04a9f689d"
  },
  {
    "url": "views/frontend/vue_classcomponent.html",
    "revision": "06675027e6b8ad7b868af254a111a233"
  },
  {
    "url": "views/frontend/Vue.html",
    "revision": "3019c22acd20197ec861971404a62d0c"
  },
  {
    "url": "views/frontend/VueCli.html",
    "revision": "8ecd7917c3b5d6621ca2071d9efff71b"
  },
  {
    "url": "views/frontend/vuelidate.html",
    "revision": "e21c39842b67ab6b2f52ffe61f5a4e7b"
  },
  {
    "url": "views/frontend/VueRouter.html",
    "revision": "c1951bef738a36b73e7d2718f6f55d9c"
  },
  {
    "url": "views/net/CORS.html",
    "revision": "2fa1bb81c6847bdbd3347046d1ba3fd6"
  },
  {
    "url": "views/net/Shakehands-wave.html",
    "revision": "6327f1ae711826cfa60edbaad493af9d"
  },
  {
    "url": "views/server/docker.html",
    "revision": "5c16673d1b926fda8121254ec8ce16c7"
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
