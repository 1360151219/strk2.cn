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
    "revision": "a8c1c9fbedb0c7fbc6f7ca417c85dffc"
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
    "url": "assets/js/10.3ec308dd.js",
    "revision": "ec37ecf32a740a91486b381b4d521b08"
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
    "url": "assets/js/15.e76bcf28.js",
    "revision": "4c4fddb4fcba0058b142ccff364cd89f"
  },
  {
    "url": "assets/js/16.12456b4a.js",
    "revision": "6743fd3a0e0d0b4d415566be7d2203f0"
  },
  {
    "url": "assets/js/17.202d6e1b.js",
    "revision": "7333466c7b57fb75e59ced57ca1f32a3"
  },
  {
    "url": "assets/js/18.03a40397.js",
    "revision": "c35ff455c27bb872102644c7af7f08da"
  },
  {
    "url": "assets/js/19.80d6b8c4.js",
    "revision": "db633a4073c0229e6b9f2de68ff77bf0"
  },
  {
    "url": "assets/js/20.857c0cb4.js",
    "revision": "c66a3c2f6a03679542e3271cc4a15d36"
  },
  {
    "url": "assets/js/21.9c217de2.js",
    "revision": "eda0b94b96d443a33a3720a26a0ac46d"
  },
  {
    "url": "assets/js/22.1a8f4434.js",
    "revision": "a07c6a67d513a088a97f58a215fdc867"
  },
  {
    "url": "assets/js/23.9f1b69f3.js",
    "revision": "903348af7314f6e8f7c2e0666e310dbf"
  },
  {
    "url": "assets/js/24.df2b15be.js",
    "revision": "62095ed3c1fa7ed73ee8fa41e9a82a81"
  },
  {
    "url": "assets/js/25.77082141.js",
    "revision": "3846cfc0b887c982646f50e37a166eee"
  },
  {
    "url": "assets/js/26.a400f9cd.js",
    "revision": "a9f85501dd84980ddc9270f95eb171d4"
  },
  {
    "url": "assets/js/27.fb9b6291.js",
    "revision": "7ce09808fee2d71b3ef7687803c5f7a1"
  },
  {
    "url": "assets/js/28.eb3208f2.js",
    "revision": "776655b89864bf8879b092a36f5fdcd2"
  },
  {
    "url": "assets/js/29.ca0a9070.js",
    "revision": "806dcdda32cd4aa79a05e5b5e87d6c0a"
  },
  {
    "url": "assets/js/30.eaea4ea6.js",
    "revision": "2899d8de0113c8d644d9ca076d8f036c"
  },
  {
    "url": "assets/js/31.5bc1cb77.js",
    "revision": "816bfdb02cdd6ec35519f88f5f5671dd"
  },
  {
    "url": "assets/js/32.b819c704.js",
    "revision": "e691447d08a7b91ab908e6c43b3df9ab"
  },
  {
    "url": "assets/js/33.26fdfb24.js",
    "revision": "a7478e3fee74691ce143c6c4e07713cc"
  },
  {
    "url": "assets/js/4.99499a2c.js",
    "revision": "0200e2fb992791662df2b5ce406e8f06"
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
    "url": "assets/js/9.caa275f5.js",
    "revision": "84a6b20305669dc08acc33613e2a34c6"
  },
  {
    "url": "assets/js/app.3728a2cd.js",
    "revision": "b66ab9471bc35bbd6b1da56cb5e63dfd"
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
    "revision": "7dd3705bd5884406a2bcbadcbdaf98a4"
  },
  {
    "url": "categories/frontend-article/index.html",
    "revision": "9c436c74f0e8ea2e700d7051827ef372"
  },
  {
    "url": "categories/frontend-article/page/2/index.html",
    "revision": "48503e6ef7a4f5b47a160a3e065f46f9"
  },
  {
    "url": "categories/index.html",
    "revision": "2b3993e4d029822cdc342c3722028873"
  },
  {
    "url": "categories/网络协议/index.html",
    "revision": "260f8122e8056e4c670130c700252cc6"
  },
  {
    "url": "categories/运维/index.html",
    "revision": "176b35123019ec90a90c0908e940b397"
  },
  {
    "url": "categories/随笔日记/index.html",
    "revision": "254cd53f8bf0eb0d307517ba8a449707"
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
    "revision": "6f04ed640eb03ceaa271f15b2ea2ddc4"
  },
  {
    "url": "tag/HTTP/index.html",
    "revision": "9dc15d2e8d8c5572f99f63a2dd0da749"
  },
  {
    "url": "tag/index.html",
    "revision": "a3f87cf89f4d5d7909b4944ecf7b4f47"
  },
  {
    "url": "tag/JavaScript/index.html",
    "revision": "fd799056fec9423c48d4fada58974174"
  },
  {
    "url": "tag/TCP/index.html",
    "revision": "ca75684c0b9eed6b7418117b56d60888"
  },
  {
    "url": "tag/Vue/index.html",
    "revision": "0039408b4377fd031e4399b6ed29dd73"
  },
  {
    "url": "tag/算法/index.html",
    "revision": "14e80a6c8dbc7441b2de122ec060b023"
  },
  {
    "url": "tag/运维/index.html",
    "revision": "a393e6c132d7473d2898d6f14b9ba76e"
  },
  {
    "url": "tag/项目/index.html",
    "revision": "c9a6bcf68af5e39c968b3adadb379f2c"
  },
  {
    "url": "timeline/index.html",
    "revision": "b3194962f4cb8f13363f2e3d099686dc"
  },
  {
    "url": "views/datastructure&algorithm/algorithm.html",
    "revision": "f78c21ffac5f43ddfb2912613bbe27e9"
  },
  {
    "url": "views/datastructure&algorithm/dataStructures.html",
    "revision": "62e5f5dc1c983715e2563d9deb837789"
  },
  {
    "url": "views/essay/2021-9-11.html",
    "revision": "4ee75e121a3d7f7be4cb98005f2ff0e7"
  },
  {
    "url": "views/essay/Proj-essay.html",
    "revision": "dc0b1ad87defac61e24ba362043ae889"
  },
  {
    "url": "views/essay/Question-and-answer-h5.html",
    "revision": "eb5161f4dc93ad9df0a65cae4dd61ef8"
  },
  {
    "url": "views/essay/vue-reader.html",
    "revision": "7d7411f50a396a44ba830be2d3bbc214"
  },
  {
    "url": "views/frontend/currying.html",
    "revision": "45b9e919de70e0b8f6bfbfb7b7766b67"
  },
  {
    "url": "views/frontend/es6.html",
    "revision": "315def6e0f5d9c814b7683a5cd364677"
  },
  {
    "url": "views/frontend/eventloop.html",
    "revision": "ce33899beaf4ab6b6cd32e6718462d87"
  },
  {
    "url": "views/frontend/optimizing.html",
    "revision": "eda571b09187f332d654b919d1b50766"
  },
  {
    "url": "views/frontend/pwa.html",
    "revision": "b0e9b6a656d8828e44808a706a264f8b"
  },
  {
    "url": "views/frontend/typeScript.html",
    "revision": "03fa68e3507db71d2c960d418fc5e237"
  },
  {
    "url": "views/frontend/vue_classcomponent.html",
    "revision": "6b371853edec14355436003e0fbf7905"
  },
  {
    "url": "views/frontend/Vue.html",
    "revision": "eb4a85d44c9ca0887e826e2e9217d10f"
  },
  {
    "url": "views/frontend/VueCli.html",
    "revision": "68d2682ff42fe0435bf70c81a38f0ee2"
  },
  {
    "url": "views/frontend/vuelidate.html",
    "revision": "e4e14a9ba62d3d3ad1ea604cbba1f36b"
  },
  {
    "url": "views/frontend/VueRouter.html",
    "revision": "5ff68c5ba941f566bfdd87ad7988ce97"
  },
  {
    "url": "views/net/CORS.html",
    "revision": "813b101fbb5e8654414228a137e24298"
  },
  {
    "url": "views/net/Shakehands-wave.html",
    "revision": "5fab5aafd3525da8fc0dfbb63fa4492f"
  },
  {
    "url": "views/server/docker.html",
    "revision": "7314becdc22cea5a02c257789c31f93b"
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
