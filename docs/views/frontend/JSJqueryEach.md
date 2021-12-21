---
title: JavaScript深入之jQuery的each遍历方法实现
date: 2021-12-21
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

> 参考：![冴羽博客的js系列](https://github.com/mqyqingfeng/Blog)

### jQuery 的 each 介绍

jQuery 的`each`方法，可以遍历数组或者对象。其中，回调函数第一个参数是索引(key)，第二个参数是值(val)。

```js
// 遍历数组
$.each([0, 1, 2], function (i, n) {
  console.log("Item #" + i + ": " + n);
});

// Item #0: 0
// Item #1: 1
// Item #2: 2
// 遍历对象
$.each({ name: "John", lang: "JS" }, function (i, n) {
  console.log("Name: " + i + ", Value: " + n);
});
// Name: name, Value: John
// Name: lang, Value: JS
```

- **退出循环**

总所周知 ES5 的`forEach`方法不可以通过 return 来退出循环。但是 jQuery 的 each 方法可以通过 return false 来退出循环，其他返回值均被忽略。

### 第一版的实现

对于数组、类数组，使用 for 循环遍历；对于对象，则使用 for in 来遍历。

```js
function each(obj, callback) {
  if (typeof obj !== "object") return;
  if (
    Array.isArray(obj) ||
    (obj.length && typeof obj.length === "number" && obj[obj.length - 1])
  ) {
    for (let i = 0; i < obj.length; i++) {
      if (callback(i, obj[i]) === false) break;
    }
  } else {
    for (let i in obj) {
      if (callback(i, obj[i]) === false) break;
    }
  }
}
```

### this

现在有这样一个需求，我希望在遍历的时候，使用 this 来表示当前遍历到的元素，并给他加上新的属性：

实例：

```js
// 我们给每个人添加一个 age 属性，age 的值为 18 + index
var person = [{ name: "kevin" }, { name: "daisy" }];
$.each(person, function (index, item) {
  this.age = 18 + index;
});
```

改变 this 指向，使用到的就是 call 和 apply 方法了：

```js
function each(obj, callback) {
  if (typeof obj !== "object") return;
  if (
    Array.isArray(obj) ||
    (obj.length && typeof obj.length === "number" && obj[obj.length - 1])
  ) {
    for (let i = 0; i < obj.length; i++) {
      if (callback.call(obj[i], i, obj[i]) === false) break;
    }
  } else {
    for (let i in obj) {
      if (callback.call(obj[i], i, obj[i]) === false) break;
    }
  }
}
```

### 性能上的说明

我们来看一个例子：

```js
function each(obj, callback) {
  var i = 0;
  var length = obj.length;
  for (; i < length; i++) {
    value = callback(i, obj[i]);
  }
}

function eachWithCall(obj, callback) {
  var i = 0;
  var length = obj.length;
  for (; i < length; i++) {
    value = callback.call(obj[i], i, obj[i]);
  }
}

var arr = Array.from({ length: 1000000 }, (v, i) => i);

console.time("each");
var i = 0;
each(arr, function (index, item) {
  i += item;
});
console.timeEnd("each");

console.time("eachWithCall");
var j = 0;
eachWithCall(arr, function (index, item) {
  j += item;
});
console.timeEnd("eachWithCall");
```

结果如下:
![](..\imgs\jQuery-each\each1.png)

这才知道原来是 call 将性能变慢了。但是有了 call 才能让我们将 this 指向当前元素噢。
