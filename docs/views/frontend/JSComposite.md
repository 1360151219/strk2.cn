---
title: JavaScript深入之函数组合
date: 2022-1-20
lastUpdated: 2022-1-20
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

> 以下大多数内容最初灵感启发来自于[冴羽博客](https://github.com/mqyqingfeng/Blog)

# 函数组合

什么是函数组合？首先想到的就是设计模式中的组合模式。跟那个差不多，如果我们想要实现一个可能将多个函数组合在一起的函数要怎么实现呢？首先来看个例子：

写一个函数，输入 'kevin'，返回 'HELLO, KEVIN'。

```js
function greeting(s) {
  return "HELLO, " + s;
}
function toUpper(s) {
  return s.toUpperCase();
}
console.log(greeting(toUpper("kevin")));
```

## Composite 函数的实现

这样子写显得十分冗杂难看。我们可不可以写一个 composite 函数，直接用`composite(greeting,toUpper)`来代替呢？

我们只需要将子函数都传入 composite 中，然后在返回的新函数中传入我们想操作的参数。

```js
function composite() {
  let args = arguments;
  let len = args.length;
  return function () {
    // 这里不能变len，len式不能改变的
    let i = len - 1;
    let res = args[i].apply(this, arguments);
    while (i) res = args[--i].call(this, res);
    return res;
  };
}
const com = composite(greeting, toUpper);
console.log(com("kevin")); // HELLP,KEVIN
```

接下来我们了解一个概念：pointfree

## pointfree

阮一峰老师说过：

> 我现在觉得，Pointfree 就是如何使用函数式编程的答案。

```
fn = R.pipe(f1, f2, f3);
```

这个公式说明，如果先定义 f1、f2、f3，就可以算出 fn。整个过程，根本不需要知道 a 或 b。

也就是说，我们完全可以把数据处理的过程，定义成一种与参数无关的合成运算。不需要用到代表数据的那个参数，只要把一些简单的运算步骤合成在一起即可。

这就叫做 Pointfree：**不使用所要处理的值，只合成运算过程**。中文可以译作"无值"风格。

下面举一个比较复杂的例子：需求：输入 'kevin daisy kelly'，返回 'K.D.K'

```js
// 非pointfree：因为函数中存在待处理的值
let initials = function (s) {
  return s.split(" ").map(composite(toUpperCase, head)).join(".");
};
// pointfree:这里需要用到柯里化，使得组合的子函数延时执行
var split = curry(function (separator, str) {
  return str.split(separator);
});
var head = function (str) {
  return str.slice(0, 1);
};
var toUpperCase = function (str) {
  return str.toUpperCase();
};
var join = curry(function (separator, arr) {
  return arr.join(separator);
});
var map = curry(function (fn, arr) {
  return arr.map(fn);
});

let com = composite(join("."), map(composite(head, toUpperCase)), split(" "));
console.log(com("kevin daisy kelly"));
```

Pointfree 的本质就是使用一些通用的函数，组合出各种复杂运算。上层运算不要直接操作数据，而是通过底层函数去处理。即不使用所要处理的值，只合成运算过程。

> [ramda.js](https://ramda.cn/docs/) 这个库已经写好了一些基础的子函数。

## ES6 骚操作实现

```js
composite =
  (...args) =>
  (value) =>
    args.reverse().reduce((res, next) => next(res), value);
```
