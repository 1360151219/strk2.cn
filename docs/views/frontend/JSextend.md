---
title: JavaScript深入之extend的实现
date: 2021-12-10
lastUpdated: 2021-12-10
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

今天来根据[冴羽博客](https://github.com/mqyqingfeng/Blog)的思路学习实现一下 JQuery 的 extend 的函数。

extend 的功能，官方的介绍是：

> Merge the contents of two or more objects together into the first object.

翻译过来就是，合并两个或者更多的对象的内容到第一个对象中。

用法：`extend(target,[,objectN])`

## 实现 extend 第一版

主要逻辑是将后续所有对象的属性都赋值到 target 身上。

```js
function extend(target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    let option = rest[i];
    if (option) {
      for (let key in option) {
        target[key] = option[key];
      }
    }
  }
  return target;
}
```

## extend 第二版

这一版主要实现深浅拷贝的功能。在 JQurey 中，通过传入一个布尔值可以切换深浅拷贝的方式。

```js
function extend(isDeep = false, target, ...rest) {
  if (typeof target !== "object" && typeof target !== "function") {
    // 兼顾函数的情况
    target = {};
  }
  for (let i = 0; i < rest.length; i++) {
    let option = rest[i];
    if (typeof option === "object") {
      for (let key in option) {
        if (isDeep && typeof option[key] === "object") {
          if (!option[key]) target[key] = null;
          // null 特殊处理
          else target[key] = extend(true, target[key], option[key]); // 递归实现：将value重新赋值
        } else {
          target[key] = option[key];
        }
      }
    }
  }
  return target;
}
```

这里主要是递归的实现比较需要时间思考。其余细节还得考虑一下极端情况，如 null

## target 是函数

总所周知函数也是一种对象。比如：

```js
function a() {}
a.target = "b";
console.log(a.target); // b
```

因此我们也要兼顾这种情况，所以在一开始的判断条件中需要改成：

```js
if (typeof target !== "object" && typeof target !== "function") {
  target = {};
}
```

## 对象中 value 是数组时存在 bug

直接上例子：

```js
var obj1 = {
  a: 1,
  b: {
    b: 3,
    c: 2,
  },
};

var obj2 = {
  b: {
    c: [5, 6],
  },
};

var d = extend(true, obj1, obj2);
console.log(d);
// { a: 1, b: { b: 3, c: { '0': 5, '1': 6 } } }
```

我们很容易就发现，因为最后一次情况是：

```
c:2 与 c:[5,6]
```

由于 2 是基本数据类型，进入递归函数后变成`{}`,然后遍历数组对象，因为数组其实就是由`下标->值`的一个对象，因此赋值的时候变成了`{'0':5,'1':6}`

因此我们还需要加一个判断数组的条件语句：

```js
function extend(isDeep = false, target, ...rest) {
  if (typeof target !== "object" && typeof target !== "function") {
    // 兼顾函数的情况
    target = {};
  }

  for (let i = 0; i < rest.length; i++) {
    let option = rest[i];
    if (typeof option === "object") {
      if (Array.isArray(option)) target = [];
      for (let key in option) {
        if (isDeep && typeof option[key] === "object") {
          if (!option[key]) target[key] = null;
          // null 特殊处理
          else target[key] = extend(true, target[key], option[key]); // 递归实现：将value重新赋值
        } else {
          target[key] = option[key];
        }
      }
    }
  }
  return target;
}
```

只要被赋值的对象是一个数组，那么就初始化 target 为一个空数组。

## 循环引用

```js
function extend(isDeep = false, target, ...rest) {
  if (typeof target !== "object" && typeof target !== "function") {
    // 兼顾函数的情况
    target = {};
  }

  for (let i = 0; i < rest.length; i++) {
    let option = rest[i];
    if (typeof option === "object") {
      if (Array.isArray(option)) target = [];
      for (let key in option) {
        if (isDeep && typeof option[key] === "object") {
          // 解决循环引用
          if (target === option[key]) {
            continue;
          }
          if (!option[key]) target[key] = null;
          // null 特殊处理
          else target[key] = extend(true, target[key], option[key]); // 递归实现：将value重新赋值
        } else {
          target[key] = option[key];
        }
      }
    }
  }
  return target;
}
```
