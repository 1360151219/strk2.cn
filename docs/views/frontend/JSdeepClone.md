---
title: JavaScript深入之深浅拷贝
date: 2021-12-4
lastUpdated: 2021-12-4
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

今天我们来了解一下深浅拷贝。

## 浅拷贝

对于数组来说，如果要实现浅拷贝的话，可以使用`slice()`、`concat()`方法来实现。

如果要对数组实现深拷贝的话，简单粗暴的方法是使用`JSON.stringify()`

```js
function deepClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}
/* 测试. */
let arr = [1, 2, { a: 1, b: 2 }, [1, 2]];
let clone = deepClone(arr);
clone[2].a = 2;
console.log(arr, clone);
//[ 1, 2, { a: 1, b: 2 }, [ 1, 2 ] ]
//[1, 2, { a: 2, b: 2 }, [1, 2]]
```

但是这种方法有一个缺陷，因为是用的序列化方法，因此序列化的一些小缺陷也会发生在这里。

> 为了简单起见， 我们来看看什么是 不安全的 JSON 值 。 undefined 、 function 、 symbol （ES6+）和包含循环引用（对象之间相互引用，形成一个无限循环）的 对象 都不符合 JSON 结构标准，支持 JSON 的语言无法处理它们。

`JSON.stringify(..)` 在对象中遇到 `undefined` 、 `function` 和 `symbol` 时会自动将其忽略， 在 数组中则会返回 `null` （以保证单元位置不变）。

```js
JSON.stringify(undefined);
JSON.stringify(function () {});
JSON.stringify([1, undefined, function () {}, 4]);
JSON.stringify({ a: 2, b: function () {} });
// undefined // undefined
// "[1,null,null,4]"
// "{"a":2}"
```

下面我们来实现一下浅拷贝，其实很简单，只需要遍历对象或属性的键值对然后赋值到新对象身上即可。

```js
function shallowClone(obj) {
  if (!obj || typeof obj !== "object") return;
  let clone = obj instanceof Array ? [] : {};
  for (let key in obj) {
    clone[key] = obj[key];
  }
  return clone;
}
```

## 深拷贝

深拷贝的实现其实可以在上述函数中加一个递归。

```js
function deepClone(obj) {
  if (obj === null) return null; // 对于null需要特殊判断
  if (!obj || typeof obj !== "object") return;
  let clone = obj instanceof Array ? [] : {};
  for (let key in obj) {
    clone[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key];
  }
  return clone;
}

/* 测试... */
let obj = { a: 1, b: { c: 3 } };
let clone = deepClone(obj);
clone.a = 2;
clone.b.c = 4;
console.log(obj, clone);
//{ a: 1, b: { c: 3 } } ; { a: 2, b: { c: 4 } }
```

这只是一个简单的深拷贝函数。但如果要实现一个较为完整的深拷贝函数，比如能拷贝`Date()`、`RegExp`,破解循环引用等问题。

这里采用一位大佬的实现方法：

```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return null;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== "object") return obj;
  if (hash.has(obj)) return hash.get(obj);
  let clone = obj instanceof Array ? [] : {};
  Reflect.ownKeys(obj).forEach((key) => {
    clone[key] = deepClone(obj[key]);
  });
  return clone;
}
```
