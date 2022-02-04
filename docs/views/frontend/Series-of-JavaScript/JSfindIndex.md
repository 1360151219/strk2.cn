---
title: JavaScript深入之寻找数组下标优雅实现
date: 2021-12-20
lastUpdated: 2021-12-20
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

无论在哪里，寻找数组元素下标的需求非常常见。今天我跟着![大佬的博客](https://github.com/mqyqingfeng/Blog/issues/37)来学习一下如何优雅的实现各种方法。

### FindIndex

ES6 中新增了`findIndex`方法，如:

```js
[1, 2, 3].findIndex((i) => i > 2); // 2
```

那如何去手写一个这样的函数的呢?
我们需要注意到这个地方:

- 参数是一个函数，函数参数分别是 element、index、arr，返回值是一个布尔值。

于是：

```js
function findIndex(arr, fn) {
  for (let i = 0; i < arr.length; i++) {
    if (fn.call(arr, arr[i], i, arr)) return i;
  }
  return -1;
}
findIndex([1, 2, 3, 4, 5], (i) => i > 4);
```

### findLastIndex

`findIndex` 是正序查找，但正如 `indexOf` 还有一个对应的 `lastIndexOf` 方法，倒序查找的 `findLastIndex` 函数也相应存在。下面来实现一下：

```js
function findLastIndex(arr, fn) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (fn.call(arr, arr[i], i, arr)) return i;
  }
  return -1;
}
findLastIndex([1, 2, 3, 4, 5], (i) => i > 4);
```

### indexFinder

上面两个方法的代码区别其实就一个循环遍历的方向。为了将其结合，我们得将两者结合一下:

```js
function indexFinder(arr, fn, dir, context) {
  let i = dir > 0 ? 0 : arr.length - 1;
  for (; i >= 0 && i < arr.length; i += dir) {
    if (fn.call(context, arr[i], i, arr)) return i;
  }
  return -1;
}
```

### sortedIndex

今天有一个新需求：在一个排序好的数组中插入一个元素，要求返回插入元素的索引。

```js
function sortedIndex(arr, value) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    let mid = Math.floor((high + low) / 2);
    if (arr[mid] >= value) high = mid;
    else low = mid + 1;
  }
  return high;
}
```

这里使用二分查找的方式，将找到的合适的索引返回。

但现在我需要拓展一下通用性，比如能处理如下情况：

```js
// stooges 配角 比如 三个臭皮匠 The Three Stooges
var stooges = [
  { name: "stooge1", age: 10 },
  { name: "stooge2", age: 30 },
];

var result = sortedIndex(
  stooges,
  { name: "stooge3", age: 20 },
  function (stooge) {
    return stooge.age;
  }
);

console.log(result); // 1
```

为了处理这种情况，我们需要传入一个函数来对数组中元素进行处理，而且这也会涉及到 this 指向的问题。因此:

```js
function sortedIndex(arr, value, iterator, context) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    let mid = Math.floor((high + low) / 2);
    if (iterator.call(context, arr[mid]) > iterator.call(context, value))
      high = mid;
    else low = mid + 1;
  }
  return high;
}
```

### indexOf & lastIndexOf

```js
function indexOfFinder(arr, value, dir) {
  let length = arr.length;
  let i = dir > 0 ? 0 : length - 1;
  for (; i >= 0 && i < length; i += dir) {
    if (arr[i] === value) return i;
  }
  return -1;
}
```

在数组的`indexOf`中还可以传入第二个参数用来表示开始寻找的索引位置。而且需要注意的是：

> 如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回 -1。如果参数中提供的索引值是一个负值，则将其作为数组末尾的一个抵消，即 -1 表示从最后一个元素开始查找，-2 表示从倒数第二个元素开始查找 ，以此类推。 注意：如果参数中提供的索引值是一个负值，仍然从前向后查询数组。如果抵消后的索引值仍小于 0，则整个数组都将会被查询。其默认值为 0。

而`lastIndexOf`中的第二个参数:

> 从此位置开始逆向查找。默认为数组的长度减 1，即整个数组都被查找。如果该值大于或等于数组的长度，则整个数组会被查找。如果为负值，将其视为从数组末尾向前的偏移。即使该值为负，数组仍然会被从后向前查找。如果该值为负时，其绝对值大于数组长度，则方法返回 -1，即数组不会被查找。

总结一下: 若**第二个参数是负数，则会从数组末尾开始向前偏移**。其余则通过方向有些许的差异。

下面来实现一下：

```js
function indexOfFinder(arr, value, dir, fromIdx) {
  let length = arr.length;
  let i = dir > 0 ? 0 : length - 1;
  if (typeof fromIdx === "number") {
    // 若负数则从末尾偏移
    if (fromIdx >= 0) {
      i = fromIdx;
    } else {
      i = length + fromIdx;
    }
  }
  // 若超范围，则根据方向判断是否遍历
  if (i < 0 && dir > 0) i = 0;
  if (i >= length && dir < 0) i = length - 1;
  for (; i >= 0 && i < length; i += dir) {
    if (arr[i] === value) return i;
  }
  return -1;
}
```

### 优化

到此为止以及非常接近原生的`index`函数了，但 underscore 还做了两个地方上的优化：

**一、支持搜索 NaN**

我们知道 `NaN==NaN` 为 false，因此原生的 index 函数也不支持搜索 NaN

我们使用`isNaN`函数来判断：

```js
function indexOfFinder(arr, value, dir = 1, fromIdx) {
  let length = arr.length;
  let i = dir > 0 ? 0 : length - 1;
  if (typeof fromIdx === "number") {
    if (fromIdx >= 0) {
      i = fromIdx;
    } else {
      i = length + fromIdx;
    }
  }
  let isFindNaN = isNaN(value) ? true : false;
  if (i < 0 && dir > 0) i = 0;
  if (i >= length && dir < 0) i = length - 1;
  for (; i >= 0 && i < length; i += dir) {
    if (isFindNaN && isNaN(arr[i])) return i;
    if (arr[i] === value) return i;
  }
  return -1;
}
```

**二、对有序数组支持使用速度更快的二分查找**

如果第三个参数不是数字的话，而是一个 true，则使用我们之前封装的 sortedIndex 函数

```js
function indexOfFinder(arr, value, dir = 1, fromIdx) {
  let length = arr.length;
  let i = dir > 0 ? 0 : length - 1;
  if (typeof fromIdx === "number") {
    if (fromIdx >= 0) {
      i = fromIdx;
    } else {
      i = length + fromIdx;
    }
  }
  if (typeof fromIdx === "boolean") {
    if (fromIdx) {
      let index = sortedIndex(arr, value);
      return arr[index] === value ? index : -1;
    }
  }
  let isFindNaN = isNaN(value) ? true : false;
  if (i < 0 && dir > 0) i = 0;
  if (i >= length && dir < 0) i = length - 1;
  for (; i >= 0 && i < length; i += dir) {
    if (isFindNaN && isNaN(arr[i])) return i;
    if (arr[i] === value) return i;
  }
  return -1;
}
```

不过这里二分查找只支持`indexOf`而没有支持`lastIndexOf`。
