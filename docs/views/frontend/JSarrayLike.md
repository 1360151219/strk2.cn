---
title: JavaScript深入之类数组与arguments
date: 2021-11-7
lastUpdated: 2021-11-7
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

> 以下大多数内容最初灵感启发来自于[冴羽博客](https://github.com/mqyqingfeng/Blog)

## 类数组对象

说起类数组对象，我们在平时写代码的时候也见得多了。比如像`document.getElementsByClassName()`等获取的 DOM 类数组、`arguments`...说白了，类数组对象就是拥有跟数组一样的索引以及 length 属性，但缺少数组的基本方法。

但要是我们就是想使用数组原型上的方法要怎么办呢？这里就可以利用`call`、`apply`等方法了。

```js
let arrayLike = { 0: "name", 1: "age", 2: "sex", length: 3 };
console.log(Array.prototype.join.call(arrayLike, "&")); // name&age&sex
let arr1 = Array.prototype.map.call(arrayLike, function (v, i) {
  console.log(v, i);
  return v;
  /*
   *  name 0
   *  age 1
   *  sex 2
   */
});
let arr2 = Array.prototype.slice.call(arrayLike, 0); // ["name", "age", "sex"]
```

这里我们通过 Array 原型然后改变其 this 指向来调用数组方法。而且，这里返回的`arr1`以及`arr2`就是一个数组对象。

除了以上方法可以将类数组方法转化为数组以外，ES6 也有新的方法可以办到这种事情：

```js
function foo() {
  return arguments;
}
let arr1 = [...foo(1, 2, 3)]; // [1, 2, 3]
let arr2 = Array.from(foo(4, 5, 6));
console.log(Array.isArray(arr1)); // true
console.log(Array.isArray(arr2)); // true
```

## arguments

`arguments`这个对象只存在于函数体内。我们来看看它有什么好玩的吧。

- **形参与实参的长度**

```js
function foo(b, c, d) {
  console.log("实参的长度为：" + arguments.length);
}

console.log("形参的长度为：" + foo.length); // 函数的length指的是形参长度

foo(1);

// 形参的长度为：3
// 实参的长度为：1
```

arguments 的长度只和具体实参相关。

- **callee**

它除了类数组的属性之外，还拥有一个`callee`属性，指向函数本身。我们来看一个例子：

```js
var data = [];

for (var i = 0; i < 3; i++) {
  (data[i] = function () {
    console.log(arguments.callee.i);
  }).i = i;
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```

在这个例子中我们给每一个函数都附上了一个`i`属性。可以通过 `callee` 来获取这个 `i` 属性

- **arguments 与参数之间的绑定**

```js
function foo(name, age, sex, hobbit) {
  console.log(name, arguments[0]); // name name

  // 改变形参
  name = "new name";

  console.log(name, arguments[0]); // new name new name

  // 改变arguments
  arguments[1] = "new age";

  console.log(age, arguments[1]); // new age new age

  // 测试未传入的是否会绑定
  console.log(sex); // undefined

  sex = "new sex";

  console.log(sex, arguments[2]); // new sex undefined

  arguments[3] = "new hobbit";

  console.log(hobbit, arguments[3]); // undefined new hobbit
}

foo("name", "age");
```

我们可以总结一个结论，**arguments 会和实参双向绑定，但与未传入的形参不会绑定在一起。**

> 要注意的是，这只是在非严格模式中，如果在严格模式中的话，参数和 arguments 之间是相互独立的。

- **这里补充一个关于判断类数组的方法**

```js
function isArrayLike(o) {
  if (
    o && // o is not null, undefined, etc.
    typeof o === "object" && // o is an object
    isFinite(o.length) && // o.length is a finite number
    o.length >= 0 && // o.length is non-negative
    o.length === Math.floor(o.length) && // o.length is an integer
    o.length < 4294967296
  )
    // o.length < 2^32
    return true;
  // Then o is array-like
  else return false; // Otherwise it is not
}
```
