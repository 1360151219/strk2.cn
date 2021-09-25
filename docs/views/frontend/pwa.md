---
title: PWA 插件配置
date: 2021-9-11
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - Vue
---

最近学长给项目引进了 PWA，这个感觉有点高大上，现在来简单学习一下配置，记录一下。

因为项目技术栈是 Vue Vue-Cli ，所以用的插件叫做 `@vue/cli-plugin-pwa`。

有一些注意点需要知道：

- 这个插件最好只用于生产环境，如果用来开发环境的话会由于缓存导致新的代码无法生效。
- 需要在本地测试 service worker，用浏览器的匿名模式来进行测试

首先来看一下我们项目的 pwa 配置：

```js
 pwa: {
    manifestOptions: {
      name: "1037树洞",
      short_name: "1037 hole",
      start_url: "http://husthole.pivotstudio.cn",
      display: "standalone",
      description: "1037树洞",
      "icons": [
        {
          "src": "windows10/SmallTile.scale-100.png",
          "sizes": "71x71"
        },
        {
          "src": "windows10/SmallTile.scale-125.png",
          "sizes": "89x89"
        },
        //......
      ],
    },
    workboxOptions: {
      skipWaiting: true,// service worker是否应该跳过等待生命周期阶段
      navigateFallback: 'https://husthole.pivotstudio.cn/index.html',
      //用于创建一个NavigationRoute，响应未预缓存的navigation requestsURL。
      //定义运行时缓存（可接受多个json对象）
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://husthole.pivotstudio.cn/api/'),
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 3,
            cacheName: 'api-cache',// 定义缓存这些图片的 cache名称
          },
        },
        {
          urlPattern: new RegExp(".*\\.(jpg|png|tif|ico|txt|css|webp|js)$"),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-cache',
          },
        }
      ],

    }
  },
```

- manifestOptions：用于展示 pwa 的配置信息。
- workboxOptions：wokbox 配置。wokbox 是用于向 web 应用程序添加离线支持的 JavaScript 库。

> 在这里我们默认使用**generateSW**模式(一个 workbox 的模式)

这个 workbox 可以帮助我们生成 service-worker，它默认是预缓存一切资源的，我们可以通过配置来进行修改。
如上述例子，我们通过需要来进行修改。

我们可以看一下别的例子：

```js
runtimeCaching: [
    {
    // 匹配包含`api`的任何同源请求。
    urlPattern: /api/,
    // 应用网络优先策略。
    handler: 'networkFirst',
    options: {
      // 超过10s使用缓存做为回退方案。
      networkTimeoutSeconds: 10,
      // 为此路由指定自定义缓存名称。
      cacheName: 'my-api-cache',
      // 配置自定义缓存过期。
      expiration: {
        maxEntries: 5,
        maxAgeSeconds: 60,
      },
      // 配置background sync.
      backgroundSync: {
        name: 'my-queue-name',
        options: {
          maxRetentionTime: 60 * 60,
        },
      },
      // 配置哪些response是可缓存的。
      cacheableResponse: {
        statuses: [0, 200],
        headers: {'x-test': 'true'},
      },
      // 配置广播缓存更新插件。
      broadcastUpdate: {
        channelName: 'my-update-channel',
      },
      // 添加您需要的任何其他逻辑插件。
      plugins: [
        {cacheDidUpdate: () => /* 自定义插件代码 */}
      ],
      // matchOptions 和 fetchOptions 用于配置 handler.
      fetchOptions: {
        mode: 'no-cors',
      },
      matchOptions: {
        ignoreSearch: true,
      },
    },
  },
   {
    // 匹配跨域请求，使用以origin开头的正则:
    urlPattern: new RegExp('^https://cors\.example\.com/'),
    handler: 'staleWhileRevalidate',
    options: {
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
  },
  ]
```

除此之外，我们可以自定义 Service-worker.js,只需要在 workboxOptions 中通过 swSrc 引入即可。

我们使用 Workbox：

- 预缓存(静态资源)

```js
workbox.precaching.precacheAndRoute([
  { url: "/index.html", revision: "383676" },
  { url: "/styles/app.0c9a31.css", revision: null },
  { url: "/scripts/app.0d5770.js", revision: null },
  // ... other entries ...
  {
    /* 通常当用户访问 / 时，对应的访问的页面 HTML 文件是 /index.html，默认情况下，precache 路由机制会在任何 URL 的结尾的 / 后加上 index.html，这就以为着你预缓存的任何 index.html 都可以通过 /index.html 或者 / 访问到。
当然，你也可以通过 directoryIndex 参数禁用掉这个默认行为： */
    directoryIndex: null,
  },
]);
```

> 使用 workbox 提供的 Webpack 插件 需要加上：`workbox.precaching.precacheAndRoute(self.__precacheManifest || []);`

- 路由请求缓存

```js
workbox.routing.registerRoute(
  /^https:\/\/xxx.cn\/api\//,
  new workbox.strategies.NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
    plugins: [],
  }),
  "GET"
);
workbox.routing.registerRoute(
  /.*\.(jpg|png|tif|ico|txt|css|webp|js)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-cache",
    plugins: [],
  }),
  "GET"
);
```

- 配置缓存命名

workbox 的缓存命名规则为：`<prefix>-<ID>-<suffix>`，我们可以这样对其进行指定：

```js
workbox.core.setCacheNameDetails({
  prefix: "my-app",
  suffix: "v1",
  precache: "custom-precache-name", // 不设置的话默认值为 'precache'  precache类型
  runtime: "custom-runtime-name", // 不设置的话默认值为 'runtime'     runtime类型
});
```
