---
title: JavaScript深入之求数组最值的模拟实现
date: 2021-12-12
lastUpdated: 2021-12-12
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

## Math.max

说到要求数组的最值，肯定想到的就是 Math 对象的静态方法: `Math.max()`、`Math.min()`。

然而这里有几个需要注意的地方：

- 当有一个参数不能转换成数值，则返回 NAN
- 当没有参数的时候，`max`返回`-Infinity`，`min`则返回的是`Infinity`

```js
Math.max(true, 0); // 1
Math.max(true, "2", null); // 2
Math.max(1, undefined); // NaN
Math.max(1, {}); // NaN
```

那除此之外还有什么方法可以求出数组得最值呢？

## 自定义函数

最原始的方法就是遍历一遍数组，依次进行元素大小的比较：

```js
function max(arr) {
  let max = -Infinity;
  for (let i of arr) {
    if (i > max) max = i;
  }
  return max;
}
```

还可以使用`reduce` API：

```js
let arr = [6, 4, 1, 8, 2, 11, 23];
function max(prev, next) {
  return prev > next ? prev : next;
}
console.log(arr.reduce(max));
```

或者使用 ES6 的语法：

```js
Math.max(...arr);
Reflect.apply(Math.max, Math, arr);
```
