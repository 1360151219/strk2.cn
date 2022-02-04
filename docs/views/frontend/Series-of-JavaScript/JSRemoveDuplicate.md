---
title: JavaScript深入之论数组去重
date: 2021-11-28
lastUpdated: 2021-11-28
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

数组去重这个问题到处都有在讨论，实现的方法也有许许多多种。

### indexOf

比如最简单的使用`indexof`来检测数组：

```js
function deDuplicate(arr) {
  let res = [];
  for (let i of arr) {
    if (res.indexOf(i) === -1) {
      res.push(i);
    }
  }
  return res;
}
console.log(deDuplicate([1, 1, 2, 2, 3, 3, "3"])); // [1, 2, 3, '3']
```

> 因为`indexOf`方法底层原理是使用`===`运算符来判断的，因此`3`和`'3'`被判断为不相等。

### 排序去重

这种方法时间复杂度不太好，我们可以这样来做：

```js
function deDuplicate(arr) {
  let res = [];
  let sortedArr = arr.concat().sort();
  let last;
  for (let i = 0; i < arr.length; i++) {
    if (!i || last !== sortedArr[i]) {
      res.push(sortedArr[i]);
    }
    last = sortedArr[i];
  }
  return res;
}
```

如果我们事先知道传入的数组是否已经排好序，我们就可以选择相应的方法来去实现去重。

### Mixin

因此综上述两种方法，我们可以封装如下方法：

```js
function deDuplicate(arr, isSorted) {
  let res = [];
  let last;
  for (let i = 0; i < arr.length; i++) {
    if (isSorted) {
      if (!i || last !== arr[i]) {
        res.push(arr[i]);
      }
      last = arr[i];
    } else {
      if (res.indexOf(arr[i]) === -1) {
        res.push(arr[i]);
      }
    }
  }
  return res;
}
```

为了用户着想，我们可以给这个函数添加一个自定义方法，可以让用户对数组中元素进行一下操作。

下面例子就是对数组内的字符串做的一个小写化的操作。

```js
function deDuplicate(arr, isSorted, handle) {
  let res = [];
  let last;
  for (let i = 0; i < arr.length; i++) {
    if (isSorted) {
      if (!i || last !== arr[i]) {
        res.push(arr[i]);
      }
      last = arr[i];
    } else if (handle) {
      const computed = handle(arr[i], i, arr);
      if (res.indexOf(computed) === -1) {
        res.push(computed);
      }
    } else {
      if (res.indexOf(arr[i]) === -1) {
        res.push(arr[i]);
      }
    }
  }
  return res;
}
console.log(
  deDuplicate([1, 1, 2, 3, 3, "3", "a", "A"], false, (i) => {
    return typeof i === "string" ? i.toLowerCase() : i;
  })
); // [ 1, 2, 3, '3', 'a' ]
```

### ES6

随着 ES6 的到来，数组去重也有多了许许多多简简单单的方法了。

```js
function deDuplicate(arr) {
  return [...new Set(arr)];
}
```

### Object 键值对去重

除此之外，我们还可以使用对象键值对来去重，我们知道 JavaScript 里面的 Object 会将键转化为字符串进行存储，因此可以去掉比如像`3`和`'3'`这样的元素，则：

```js
function deDuplicate(arr) {
  let obj = {};
  return arr.filter((item, i) => {
    return obj.hasOwnProperty(item) ? false : (obj[item] = true);
  });
}
```

那若是不想去掉这种类型的元素，只需要使用加号即可。

```js
function deDuplicate(arr) {
  let obj = {};
  return arr.filter((item, i) => {
    return obj.hasOwnProperty(item + item) ? false : (obj[item + item] = true);
  });
}
```

但是这对于对象来说是无法区分一律删除的，因为对象加对象始终等于`object[object Object]`，但我们可以利用`JSON.stringify`来区分。

```js
function deDuplicate(arr) {
  let obj = {};
  return arr.filter((item, i) => {
    return obj.hasOwnProperty(item + JSON.stringify(item))
      ? false
      : (obj[item + JSON.stringify(item)] = true);
  });
}
```

这看似已经万无一失了。但是我们要知道：`JSON.stringify()`对于**正则表达式**来说，始终返回`{}`的。因此这种方法无法对正则表达式区分。

### 总结

数组去重的方法多种多样，但是我们应该怎么去选择并使用呢？这里给大家看一段代码

```js
var str1 = "1";
var str2 = new String("1");

console.log(str1 == str2); // true
console.log(str1 === str2); // false

console.log(null == null); // true
console.log(null === null); // true

console.log(undefined == undefined); // true
console.log(undefined === undefined); // true

console.log(NaN == NaN); // false
console.log(NaN === NaN); // false

console.log(/a/ == /a/); // false
console.log(/a/ === /a/); // false

console.log({} == {}); // false
console.log({} === {}); // false
```

除了例子中简单的 1 和 '1' 之外，对于各种奇奇怪怪的元素比如 null、undefined、NaN、对象等，那么对于这些元素我们需要选择相应的方法去去重。

比如对于以下这个数组，我们想要去重的话，选择不同的方法产生的结果也会不一样。这个可以读者自行去测试。

```js
var array = [
  1,
  1,
  "1",
  "1",
  null,
  null,
  undefined,
  undefined,
  new String("1"),
  new String("1"),
  /a/,
  /a/,
  NaN,
  NaN,
];
```

总而言之，我认为使用对象键值对的方法去重是区分度最高的(除了正则表达式外)。但要是去重一些简单元素，并且不考虑效率的话，我会选择`Set`去重，一行代码就完事了~~
