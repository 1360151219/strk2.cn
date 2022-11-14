---
title: ServiceWorker 学习
date: 2021-10-11
lastUpdated: 2022-02-24
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

# Service Worker

今天要上课，闲的无聊于是想研究一下 sw。

使用 ServiceWorker 可以做一个离线缓存应用，可以使得 h5 网页拥有原生 app 一样的用户体验。

> 之前我写过一个 ServiceWorker 做一个 PWA 应用的配置 可以结合看一下。
> [点这里](http://www.strk2.cn/views/frontend/pwa.html)

首先我们先来了解一下 ServiceWorker 的生命周期和所支持的事件。

![](https://mdn.mozillademos.org/files/12636/sw-lifecycle.png)

![](https://mdn.mozillademos.org/files/12632/sw-events.png)

## Service Worker 安装流程

---

### 注册你的 Service Worker

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw-test/sw.js", { scope: "/sw-test/" })
    .then(function (reg) {
      // registration worked
      console.log("Registration succeeded. Scope is " + reg.scope);
    })
    .catch(function (error) {
      // registration failed
      console.log("Registration failed with " + error);
    });
}
```

- 首先是需要检测 ServiceWorker 是否被支持。
- 接着需要用`register`来注册站点的 serviceworker。注意，这里的地址是相对于 origin 的 url。
- `scope` 参数是选填的，可以被用来指定你想让 service worker 控制的内容的子目录。在这个例子例，我们指定了 `'/sw-test/'`，表示 app 的 origin 下的所有内容。如果你留空的话，默认值也是这个值， 我们在指定只是作为例子。

如果 ServiceWorker 注册失败了，可能有以下原因：

- 你没有在 HTTPS 下运行你的程序
- service worker 文件的地址没有写对，一定要相对于 origin 而不是 app 的根目录。
- service worker 不能处于其他 origin 中

### 安装和激活你的 Service Worker：填充缓存

在 Service Worker 注册完毕后，`install`事件会被触发，`install`一般是用于填充我们的缓存的，这里有一个 Service Worker 的新 API `caches`，一个 Service Worker 上的全局对象，它可以让我们缓存网络相应回来的资源，并且根据他们的缓存生成 key。它会一直存在。

```js
this.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("v1").then(function (cache) {
      return cache.addAll([
        "/sw-test/",
        "/sw-test/index.html",
        "/sw-test/style.css",
        "/sw-test/app.js",
        "/sw-test/image-list.js",
        "/sw-test/star-wars-logo.jpg",
        "/sw-test/gallery/",
        "/sw-test/gallery/bountyHunters.jpg",
        "/sw-test/gallery/myLittleVader.jpg",
        "/sw-test/gallery/snowTroopers.jpg",
      ]);
    })
  );
});
```

- `event.waitUntil()` 方法确保你的 ServiceWorker 不会在`waitUntil()`里面的代码执行完毕之前安装好。

- `event.skipWaiting()`可以立即激活你的 ServiceWorker。

- 在 `waitUntil()` 内，我们使用了 `caches.open()` 方法来创建了一个叫做 v1 的新的缓存，将会是我们的站点资源缓存的第一个版本。它返回了一个创建缓存的 promise，当它 resolved 的时候，我们接着会调用在创建的缓存示例上的一个方法 `addAll()`，**这个方法的参数是一个由一组相对于 `origin` 的 URL 组成的数组**，这些 URL 就是你想缓存的资源的列表。

- 当安装成功完成之后， service worker 就会激活。在第一次你的 service worker 注册／激活时，这并不会有什么不同。但是当 service worker 更新 `(稍后查看 Updating your service worker 部分)` 的时候 ，就不太一样了。

### 自定义请求的响应

![](https://mdn.mozillademos.org/files/12634/sw-fetch.png)

每次当 serviceWorker 控制的资源被请求的时候，都会触发`fetch`事件，这些资源包括了指定 scope 内的文档，和这个文档内引用的任何其他资源。

你可以给 service worker 添加一个 `fetch` 的事件监听器，接着调用 event 上的 respondWith() 方法来劫持我们的 HTTP 响应，然后你用可以用自己的方法来更新他们。

```js
this.addEventListener("fetch", function (event) {
  event.respondWith(caches.match(event.request));
});
```

- `event.respondWith()`方法可以劫持我们 HTTP 响应，然后更新他们。
- `caches.match()`允许我们对网络请求的资源和 cache 里获取的资源进行一个匹配，查看缓存中是否有响应的资源。

如果没有在缓存中找到响应的资源，可以告诉浏览器去 fetch 默认的网络请求：

```js
fetch(event.request);
```

如果没有在缓存中找到匹配的资源，同时网络也不可用，你可以用 match() 把一些回退的页面作为响应来匹配这些资源，比如：

```js
caches.match("/back.html");
```

### 恢复失败的请求

当我们没有匹配到任何资源的话，promise 就会 reject，同时也会出现一个网络错误。这时候我们可以利用 promise 改善一下：

```js
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

如果`fetch`失败了，我们也可以执行默认的网络请求`fetch(event.request)`，即网络可用的时候就向服务器请求资源。

我们还可以将服务器请求回来的资源，缓存下来，以便离线的时候使用。

```js
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((res) => {
          return caches.open("v1").then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    })
  );
});
```

- 这里我们通过默认网络请求后获得响应，然后通过`cache.open()`来抓取我们的网络响应，当`resolve`的时候，再通过`cache.put()`将这些资源放入缓存中，这个资源是通过`event.request`获取的，它的响应会被`res.clone()`一份然后加入缓存。响应的克隆被加入缓存，它的原始响应被返回给浏览器来调用它的页面。

> 为什么要这样做？这是因为请求和响应流只能被读取一次。为了给浏览器返回响应以及把它缓存起来，我们不得不克隆一份。所以原始的会返回给浏览器，克隆的会发送到缓存中。它们都是读取了一次。

除此之外，我们可以给请求没有匹配到缓存中任何资源以及网络请求不可用的时候一个回退方案：

```js
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((res) => {
            return caches.open("v1").then((cache) => {
              cache.put(event.request, res.clone());
              return res;
            });
          })
        );
      })
      .catch(() => {
        return caches.match("/back.html");
      })
  );
});
```

**更新你的 service worker**

如果你的 serviceworker 已经被安装，在刷新页面的时候有一个新的版本可用，新的 serviceworker 会在后台安装，但不会被激活。只有当不在有任何已加载的页面使用旧的 serviceworker 的时候，新版本才会被激活。

你得把新的 serviceworker 安装时候的缓存版本更新一下，这样才不会扰乱旧的缓存。

```js
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',

        …

        // include other new resources for the new version...
      ]);
    })
  );
});
```

### 删除旧缓存

`activate`事件通常被用于破坏原有页面的事情。比如清除缓存。

```js
self.addEventListener("activate", function (event) {
  var cacheWhitelist = ["v2"];
  /* 
    ** caches:{
        keylist:['v1','v2'] 
    **   }
     */
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
```

## Service Worker API

---

### Clients 与 Client

`client` 表示一个可执行的上下文。(我的理解是一个客户端吧。)每一个 client 存在三个属性`type`、`id`、`url`。

- `client.postMessage()` 给 client 传递信息
- `clients.claim()`允许一个激活的 serviceworker 将自己设置其 scope 内所有 client 的`controller`。
- `clients.matchAll()` 方法返回 service worker Client 对象列表的 Promise 。

### Notification

**`Notification`的通知接口用于向用户配置和显示桌面通知。**

`let notification = new Notification(title, options)`

- `title`：显示的通知标题
- `options`：
  - `body`: 通知中额外显示的字符串
  - `tag`: 赋予通知一个 ID，以便在必要的时候对通知进行刷新、替换或移除。
  - `icon`: 一个图片的 URL，将被用于显示通知的图标。

**方法**

- `Notification.permission`(只读)：返回一个表面当时授权状态的字符串。`denied` (用户拒绝了通知的显示), `granted` (用户允许了通知的显示), 或 `default` (因为不知道用户的选择，所以浏览器的行为与 `denied` 时相同).

- `Notification.requestPermission()`：用于当前页面向用户申请显示通知的权限。

> 新版本支持返回一个 promise，但旧版本是传入一个 cb，所以需要兼容。

### serviceWorker 对象 与 serviceWorkerScope

`serviceWorker.controller`：返回一个 serviceworker 对象，表示页面的控制器。

`serviceWorkerRegistration.showNotification(title, [options]);`/`serviceWorker.registration.showNotification()`:创建一个消息通知。

```js
self.registration.showNotification(element.alias, {
  body: element.content,
  icon: "/xxx/xxx.jpg",
  data: element,
});
```

**方法**

- `serviceWorker.postMessage(data)`：向 serviceworker 发送数据。

**事件**

- `message`：当 serviceworker 接收到信息的时候该事件会触发。

Service Worker 可以通过监听 message 事件来接收消息：

```js
// in the service worker
addEventListener("message", (event) => {
  // event is an ExtendableMessageEvent object
  console.log(`The client sent me a message: ${event.data}`);

  event.source.postMessage("Hi client");
});
```

> 前几天学长写了一个基于 serviceWorker 的一个系统通知功能。看了许久明白了主要逻辑：每 3 秒请求一次后端接口，接收返回的数据，然后进行比较，若有新的通知则创建一个系统通知。点击通知的时候，通过`client.postMessage()`来触发`navigator.serviceworker`的`messages`事件，然后再 push 到相应的页面。

## 补充

Service Worker 的出现，旨在可以创建有效的离线体验，拦截网络请求进行缓存控制以及推送通知等

其特点如下：

- 相对于主 JavaScript 线程，Service Worker 独占一个线程，因此不会因为样式计算、JavaScript 代码而被阻塞，性能更好

- 但也因此，无法访问 DOM

- 整个 Serive Worker 是完全异步的，因此无法使用同步 API（如`localStorage`、`XHR`等）

- 只能运行于 HTTPS 中

### 缓存策略

> 提问：Service Worker 的缓存控制与浏览器缓存有什么区别？

Service Worker 的缓存控制其实主要是应用于离线状态之中。

但其实它也有它的一些缓存策略：

- `staleWhileRevalidate`

顾名思义，首先去看一下有没有对应的缓存，如果有则返回缓存，同时会发起网络请求去更新 sw 中的缓存。

若没有对应的缓存，就会直接发起网络请求，获取新资源写入缓存并返回给客户端。

- `networkFirst`

优先发起网络请求，将请求的新资源返回给客户端同时写入缓存中。

若网络请求失败，则使用缓存中的资源。

- `cacheFirst`

优先使用缓存。若没有缓存则发起网络请求，将请求的新资源返回给客户端同时写入缓存中

- `cacheOnly`与`networkOnly`

只能使用缓存和完全禁止缓存
