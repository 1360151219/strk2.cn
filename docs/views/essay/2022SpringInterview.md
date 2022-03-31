---
title: 2022 前端春招大汇总
date: 2022-3-31
lastUpdated: 2022-3-31
categories:
  - 随笔日记
author: 盐焗乳鸽还要砂锅
tags:
  - 面试
---

## 蚂蚁-大安全前端

### 一面 3.7 （10min +）

1. 自我介绍
2. 讲一下 Vue 的双向绑定
   - 讲到了 Dep、Observer、Watcher 类以及他们之间的关系：依赖收集 Dep.target、dep.depend、watcher.addDep、dep.addSub
   - 依赖更新：dep.notify、watcher.update
3. 如何让元素垂直居中
   - 分为块元素和行内元素
   - 行内元素：line-height、text-align
   - 块元素：flex 布局、定位、margin padding...
4. 说一下我是怎么学前端的
5. 说一下我的博客
6. 反问环节...

### 二面 3.14 （1h 左右）

1. 自我介绍
2. 问了一下我如何学习前端
3. 问了一下我在学校团队中负责的项目和内容
   - 遇到的挑战、如何解决（Servive Worker 直接怼上去）
4. 手写题：使得以下代码能被`try..catch`捕获

```js
try {
  ajaxGet(url, (err, res) => {
    res.data.children = 1;
  });
} catch (error) {
  console.log(error);
}
```

这里思路很简单，就是讲他转化为 async..await 的形式嘛。但是当时有点紧张，在细节方面一直卡顿，在面试官不断提醒下勉强写出。
PS：还得加强一下面对手写题的时候的心态，不要着急！！不要着急！！着急吃不到热豆腐！！

5. 手写题：树状数组数据结构根据 id 找到对应属性

dfs 一下子就写出来了，但是还是被面试官指出来没有进行类型判断，不严谨，害~~~

前面两道手写题就费了半个多小时。面试官有点不满意，但是还是问了些基础知识来挽救我。上天啊

6. 讲一下浏览器的重绘、重排

   - 我的强项来了：讲了一下浏览器渲染过程：DOM 树、css 树、布局树、绘制顺序、合成。
   - 重排对性能影响更大、触发重排的方法、如何避免、如何利用 C3 来调用 GPU 加速

7. 了解 BFC 嘛？

   - 说了下父元素不会被浮动元素撑开、父子元素 margin 合并等
   - 讲了下如何触发 BFC

8. 反问环节
   - 问了下面试官手写题的答案。。面试官说我思路是对的、但是细节不到位

### 三面 3.15 （1h 左右）

1. 自我介绍

   - 面试官问了一下我前端学习路径
   - 问了一下团队工作
   - 我负责的项目
   - 我遇到的挑战（我说了 autoLoader、Service Worker）

2. url 输入到浏览器地址栏之后发生了啥

我说了：

- 判断是 url 还是搜索字符串
- DNS 解析
- 缓存（强缓存和协商缓存）
- 建立请求头、请求体
- 交给网络线程发起请求
  - 这里我说完之后，让我在具体分析这里
  - TCP 3 次握手细节过程
  - HTTPS RSA 4 次 TLS 连接过程
  - TCP 4 次挥手
    - 进一步展开了 time_wait 的作用：1.历史数据包完全消失 2.帮助服务端正确关闭
- 提前准备好一个渲染器线程
- 渲染过程：DOM 树、css 树、布局树、绘制顺序、分层分块、光栅化线程池、GPU 内存，显卡（前后缓冲区）

3. 算法题：一个数组，如何查找其中的出现次数最多的元素

   - 我首先说了利用哈希表或者数组实现 On 的遍历（但之后他说如果数字非常大或者负数，那就哈希表呗）
   - 他进一步提问，明确有一个元素出现次数达到一半以上
   - 我说：摩尔投票法，讲了一下基本思路。他说 OK

4. 返回环节
   - 实习生进入团队有无培训、学习期
   - 目前蚂蚁大前端团队的规模

面试官说我虽然是非科班但是了解很多细节，非常不错。整体面试氛围很好，面试官听的很认真，我也讲的很开心。这里应该已经稳了- -

### HR 面 3.17 （30min）

- 问了我的学习过程
- 团队工作，你印象深刻的事件
- 问了我的未来想法，为什么不读研
- 反问.....

## 字节跳动 直播业务

### 一面 3.11 （50 min）

> 顺序不定

1. 自我介绍

2. 面试官说你是非科班，那你学了哪些计算机课程？ 计网~~

   - 说一下 HTTP 状态码
   - 我说了很多：200、204、206、301、302、304、400、401、403、500、502、503
   - 问我 206 是干嘛的？ 我说断点续传、content-range 等等
   - 说一下三次握手的过程？ 八股文嘛背就完事了
   - HTTP 是那一层？突然有点小短路，问懵了，回过神来说应用层。

3. 面试官问我了解哪些跨域方法？

   - jsonp
   - CORS 讲了很详细：assess-control-allow-origin、assess-control-allow-headers、assess-control-allow-methods、（带 cookie）assess-control-allow-credentials、Withcredentials、OPTIONS 预检、简单、非简单请求。
   - 面试官说了解很详细 OK

4. 面试官问讲一下 eventLoop 机制？

   - 经典分为浏览器和 Node 环境中：微任务（Promise、MutationObserver）和宏任务（script、setTimeout、setInmmediate）

5. 你了解哪些网络安全相关知识？

   - 说了很多：XSS（存储、反射、DOM 型）、CSRF（cookie：domain、path、samesite 的三个值、httpOnly；reference）

6. 一道算法题：数组的归并排序

7. 说一下 http 缓存机制？

   - 首先强缓存和协商缓存
   - 我又说了项目中的 Service Worker 缓存，staleWhileReralidate、cacheFirst..策略等等

8. 说一下我的博客魔改过程，CICD 流程

9. 反问环节

面试官很满意。

### 二面 3.17 （50 min+）

1. 自我介绍

2. 说一下你的项目。（这里比较主观化我就不写了）

3. 讲一下什么是 BFC

   - table 可以触发嘛 （我说可以）
   - flex 呢 （当时说了不行）

4. 讲一下 flex 布局

   - 主轴，侧轴
   - justify-item、align-self
   - flex-grow、flex-thrink、flex-basis

5. 讲一下 v-for 的 key 值
   - 讲一下 v-if 和 v-show 的区别
   - 讲一下 v-html 的原理（innerHTML，但我当时误解了面试官意思说了 AST）

然后面试官说我可以熟悉一下原生 api。然后我有点不服气，把我自己实现的一个 vue demo 说了一遍：

- 编译原理：正则匹配、节点查询、nodeTypes、attributes、innerHTML、textContent....
- 双向绑定：Dep、Watcher、Observer、Dep.target、dep.addSub、notify、update
  - 对象：Object.defineProperty...
  - 数组：重写数组方法、对新增属性重新绑定响应式、手动触发更新 `xxx.__ob__.dep.notify`

面试官说很不错，没什么好问的了。

5. 算法题：leetcode 20

6. 反问环节
   - 实习生培训期间
   - 团队规模

### 三面 3.23 （50 min +）

1. 自我介绍

- 讲了一下我的团队经历和项目
- 讲了一下我学习计算机的途径
- 我说我自学了计网和数据结构和算法

2. 问 OSI 的七层协议：

- 会话层、表示层、应用层、传输层、网络层、数据链路层、物理层。相关的协议：https、http（应用层）、TCP 和 UDP（运输层）

3. 问我 TCP 和 UDP 的区别

- 提到了头部字段大小
- TCP 的面向连接、可靠传输、UDP 的不面向连接、最大努力交付
- 还结合了 HTTP2.0 和 3.0 的区别做了不同的介绍：队头阻塞等等。

4. 你还用过 TS，你认为 TS 和 JS 相比有什么优势和作用？

5. 算法题 leetcode 54. 这里卡了挺久的，思路很清晰但是处理方向变化的时候一直没处理好，还好心态没有炸最后调出来了。

6. 反问环节....

三面面完马上 HR 找我 HR 面

### HR 面 3.23（50min）

- 总之聊了很多，人生规划，学习途径，专业看法，互联网发展前景等等。。

## 拼多多

### 二面 3.20 （1h）

1. 自我介绍
2. 讲一下 Vue 和原生 JS、jQuery 的区别特点

- 讲一下 Vue 的生命周期
- 讲一下 Vue 的响应式绑定原理

3. 做一道题：（吐槽一下 pdd 的手写题，不能调试，很烦，导致我面的时候有细小错误）

```js
let logs = [
  { id: 1, time: 2 },
  { id: 1, time: 4 },
  { id: 1, time: 3 },
  { id: 1, time: 5 },
  { id: 2, time: 11 },
  { id: 3, time: 1 },
  { id: 1, time: 50 },
];
let t = [0, 10];
// 输出
// [{cnt:4,num:1},{cnt:1,num:1}]

法一：
function sortLogs(logs, t) {
  logs.sort((a, b) => a.id - b.id);
  logs = logs.filter((item) => item.time > t[0] && item.time < t[1]);
  const n = logs.length;
  let cnt = 0;
  let ans = [];
  let map = new Map();
  for (let i = 0; i < n; i++) {
    let log = logs[i];
    // if (log.time < t[0] || log.time > t[1]) continue
    cnt++;
    if (i == n - 1 || log.id != logs[i + 1].id) {
      if (map.has(cnt)) map.set(cnt, map.get(cnt) + 1);
      else map.set(cnt, 1);
      cnt = 0;
    }
  }
  for (let [cnt, num] of map.entries()) {
    ans.push({ cnt, num });
  }
  return ans;
}

法二： 数据范围不知道~
function sortLogs(logs, t) {
  let cnt = new Array(100).fill(0); // id
  let ans = [];
  for (let log of logs) {
    if (log.time < t[0] || log.time > t[1]) continue;
    cnt[log.id]++;
  }
  let max = Math.max(...cnt);
  for (let i = max; i >= 1; i--) {
    let num = 0;
    for (let c of cnt) {
      if (c == i) num++;
    }
    if (!num) continue;
    ans.push({ cnt: i, num: num });
  }
  return ans;
}
```

4. for..in 和 for..of 的区别

5. flex 布局

6. 一些元素的大小值：说了 px、em、rem、vw、vh ... 他提示还有百分比

- 百分比除了依据父元素，还在什么情况下依据子元素？居中定位

7. 浏览器解析 HTML 的原理

- 进一步，什么能阻塞 dom 的渲染。（script）
- 获取 html 解析的时间。（performance）

8. 反问环节。

### 三面 3.25 （40min）

- 自我介绍

  - 问了关于我的团队
  - 项目
  - 学校方面
  - 反正聊了很多吧

- 最后一道算法题：target=15，输出`[[1,2,3,4,5],[4,5,6],[7,8]]`,要求子数组由小到大连续数字组成、整体数组由子数组长度大到小排序
  - 滑动窗口（卡了一点边界情况的时间，最后做出来了。）

## 后话

除此之外 你还需要准备几个面试的**杀手锏**

什么意思呢？就是八股一般人人都会背，那你如何你表现自己更优秀呢，就是你必须要有一些杀手锏去保证自己在一些题中一定会答得比别人好

比如问你 https 你得知道 TLS4 次连接、证书签发、验证流程、加密算法 RSA static DH DHE ECDHE ；或者问你 Vue，比如深入到源码级别的响应式绑定、nextTick 的源码、或者问你浏览器渲染，合成阶段的详细流程、或者是跨域 jsonp CORS 各种情况的扩展等等

只有掌握好各种细节，你才有可能在众多的面试者中脱颖而出。
