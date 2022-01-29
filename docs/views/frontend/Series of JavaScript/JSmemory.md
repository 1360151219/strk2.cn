---
title: JavaScript深入系列之函数记忆
date: 2022-1-29
lastUpdated: 2022-1-29
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

这篇文章依旧是参考[冴羽博客](https://github.com/mqyqingfeng/Blog)系列而出的。边学边输出~~

# JavaScript 深入系列之函数记忆

在调用函数的时候，如果多次调用传入相同参数的同一个函数，会不会觉得非常浪费时间。既然都是同参数的同函数，为什么不可以把结果存起来，等下次调用的时候直接返回呢？

## 第一版

说做就做，我们可以利用闭包来实现缓存对象。

```js
function memory(fn) {
  const cache = new Map();
  return function () {
    let che = arguments.length + Array.prototype.join.call(arguments, ",");
    if (cache.has(che)) return cache.get(che);
    else {
      let res = fn.apply(this, arguments);
      cache.set(che, res);
      return res;
    }
  };
}
```

接下来我们来测试一下（这里直接用别人的例子）：

```js
var add = function (a, b, c) {
  return a + b + c;
};

var memoizedAdd = memoize(add);

console.time("use memoize");
for (var i = 0; i < 100000; i++) {
  memoizedAdd(1, 2, 3);
}
console.timeEnd("use memoize");

console.time("not use memoize");
for (var i = 0; i < 100000; i++) {
  add(1, 2, 3);
}
console.timeEnd("not use memoize");

// use memoize: 35.377ms
// not use memoize: 1.645ms
```

这里我们可以看到，使用了函数记忆反而效率更差了。所以，函数记忆也并不是万能的，你看这个简单的场景，其实并不适合用函数记忆。

但这种用空间换取时间来提高时间效率的做法是十分可取的。

## 第二版

之前我们用了数组的`join`方法用来生成缓存的 key，如果是对象的话，会产生不符合预期的问题（因为对象生成的 key 永远是`[object Object]`）

```js
var propValue = function (obj) {
  return obj.value;
};

var memoizedAdd = memoize(propValue);

console.log(memoizedAdd({ value: 1 })); // 1
console.log(memoizedAdd({ value: 2 })); // 1
```

对于对象，我们可以采用序列化的方式来转化为 key

```js
function memory(fn) {
  const cache = new Map();
  return function () {
    let che = JSON.stringify(Array.prototype.slice.call(arguments));
    console.log(che);
    if (cache.has(che)) return cache.get(che);
    else {
      let res = fn.apply(this, arguments);
      cache.set(che, res);
      return res;
    }
  };
}
```

> 下面是 underscore 实现函数记忆的函数：

```js
// 第二版 (来自 underscore 的实现)
var memoize = function (func, hasher) {
  var memoize = function (key) {
    var cache = memoize.cache;
    var address = "" + (hasher ? hasher.apply(this, arguments) : key);
    if (!cache[address]) {
      cache[address] = func.apply(this, arguments);
    }
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
};
```

可见这里支持我们传入一个自定义 key 的一个函数 hasher

## 使用场景

我们以斐波那契数列为例：

```js
var count = 0;
var fibonacci = function (n) {
  count++;
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};
for (var i = 0; i <= 10; i++) {
  fibonacci(i);
}

console.log(count); // 453
```

只是简单的循环到了 10 就调用了 453 次函数！！！

如果用函数记忆呢：

```js
var count = 0;
var fibonacci = function (n) {
  count++;
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};

fibonacci = memory(fibonacci);

for (var i = 0; i <= 10; i++) {
  fibonacci(i);
}

console.log(count); // 11
```

因此，**需要大量重复的计算，或者大量计算又依赖于之前的结果**时候，不如用一下函数记忆吧
