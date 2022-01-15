---
title: JavaScript深入之各种函数学习
date: 2022-1-15
lastUpdated: 2022-1-15
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

# JavaScript 之偏函数学习

> 以下大多数内容最初灵感启发来自于[冴羽博客](https://github.com/mqyqingfeng/Blog)

什么是偏函数（Partial application）？在维基百科中的介绍是这样的：

在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。

什么是元？元是指函数参数的个数，比如一个带有两个参数的函数被称为二元函数。

举个简单的例子：

```js
function add(a, b) {
  return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2); // 3

// 假设有一个 partial 函数可以做到局部应用
var addOne = partial(add, 1);

addOne(2); // 3
```

实际上，这和之前写过的柯里化函数非常相似，但其实它们之间也存在一些区别：

- 柯里化函数：将多参数函数分成多个小参数函数
- 偏函数：先固定函数的一个或多个函数，后在传入 n-x 个参数的函数

今天主要跟着大佬一起学习一下怎么模仿 underscore 写一个 partial 函数。

认真观察上面例子的读者可能发现，这不就是 bind 的格式嘛（bind 可以先传入一些参数）:

```js
let addOne = add.bind(null, 1);
addOne(2);
```

但下面我们要使用不改变 this 指向的方法。

## 第一版

```js
// 这不就是bind嘛- -
function partial(fn) {
  let args = [].slice.call(arguments, 1);
  return function () {
    let newArgs = args.concat([].slice.call(arguments));
    fn.apply(this, newArgs);
  };
}
```

# JavaScript 之惰性函数学习

现在有一个需求：写一个函数返回**首次**调用时候的 Date 对象。

## 第一版

```js
let t;
function foo() {
  if (t) return t;
  t = new Date();
  return t;
}
```

这是一种很朴素的方法，但它污染了全局变量而且每次调用都需要进行一次判断。

## 第二版闭包

为了防止全局变量的污染我们很容易想起闭包：

```js
function foo() {
  let t;
  return function () {
    if (t) return t;
    t = new Date();
    return t;
  };
}
```

除此之外，因为函数自身也是一个对象，因此可以把日期存储该函数的身上。

```js
function foo() {
  if (foo.t) return foo.t;
  foo.t = new Date();
  return foo.t;
}
```

但这都并没有解决每次调用都要判断的问题。

## 第三版---惰性函数

惰性函数就是为了解决这个问题，原理就是重写函数本身。

```js
var foo = function () {
  var t = new Date();
  foo = function () {
    return t;
  };
  return foo();
};
```

当第一次运行 foo()后，foo 就已经被重写了。以后再运行 foo()的时候，就直接返回 t 了。

## 惰性函数的应用

比如在 DOM 添加监听事件的时候，我们需要兼容 IE 老版本：

```js
function addEvent(type, el, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false);
  } else {
    el.attachEvent("on" + type, fn);
  }
}
```

这样写的问题也是在于每次调用都需要判断一次。这时候我们就可以使用惰性函数了。

```js
// 这种写法第一次调用并没有绑定监听函数噢
function addEvent(type, el, fn) {
  if (window.addEventListener) {
    addEvent = function (type, el, fn) {
      el.addEventListener(type, fn, false);
    };
  } else {
    addEvent = function (type, el, fn) {
      el.attachEvent("on" + type, fn);
    };
  }
}
```

或者这样写：

```js
const addEvent = (function (type, el, fn) {
  if (window.addEventListener) {
    return function (type, el, fn) {
      el.addEventListener(type, fn, false);
    };
  } else {
    return function (type, el, fn) {
      el.attachEvent("on" + type, fn);
    };
  }
})();
```
