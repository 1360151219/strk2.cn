---
title: Error 的妙用，来一起看一下吧
date: 2022-3-25
lastUpdated: 2022-3-25
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

# Error 的妙用，来一起看一下吧

最近看到了 anifu 的 ni 自制包管理器后，我觉得很有趣也按照其主要思想自己实现一下，并且加了更多的功能希望能够成为一个团队的 _包管理器_ + _模板脚手架_ 的一个缝合怪吧

## 前言

我在使用 ESM 的时候，发现 Node 内置的`__dirname`属性居然显示 undefined 了。查资料后发现这个属性在 CommonJS 中可以使用，但是在 ESM 模式下却无法使用，这可就难为我了。

经查找后发现一个`es-dirname`的第三方包，那么它就是我们今天的主角了，我们来一起看看他的源码吧。

## es-dirname 源码--Error 的妙用

它的源码其实就 20 行不到：

```js
const _dirname = require("path").dirname;
const { platform } = require("os");

const dirname = () => {
  try {
    ShadowsAlwaysDieTwice;
  } catch (e) {
    const initiator = e.stack.split("\n").slice(2, 3)[0];
    let path = /(?<path>[^\(\s]+):[0-9]+:[0-9]+/.exec(initiator).groups.path;
    if (path.indexOf("file") >= 0) {
      path = new URL(path).pathname;
    }
    let dirname = _dirname(path);
    if (dirname[0] === "/" && platform() === "win32") {
      dirname = dirname.slice(1);
    }
    return dirname;
  }
};
```

我 clone 在了一个 js 文件中去调试，那么首先我们打印一下这个`initiator`是什么吧：

```
at Object.<anonymous> (D:\workplace\CodeGraveyard\index.js:21:13)
```

这里`e.stack`属性是将报错信息按照一行行的形式打印出来，再通过分割取出当前文件的报错信息（含当前文件 url）

通过正则将其中文件的 path 筛出来，然后通过`path.dirname()`方法获得该文件**所处于的路径**。

最后进行一些特殊情况判别后返回。
