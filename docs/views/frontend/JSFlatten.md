---
title: JavaScript深入之数组的扁平化
date: 2021-12-12
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

> 参考：![冴羽博客的文章](https://github.com/mqyqingfeng/Blog/issues/36)

> 扁平化数组这个老生常谈了，许许多多博客都有提到这个问题。那今天我们就来摸索一下这个算法实现吧。

## 递归实现

直接上手写一写吧，这种算法首先想到的就是递归：

```js
function flatten(arr) {
  let res = [];
  for (let i of arr) {
    if (Array.isArray(i)) {
      res = res.concat(flatten(i));
    } else {
      res.push(i);
    }
  }
  return res;
}
```

## toString

因此对数组使用`toString`方法可以直接将所有元素变成一段字符串，那么只要再处理一下即可。

```js
function flatten(arr) {
  return arr
    .toString()
    .split(",")
    .map(function (item) {
      return +item;
    });
}
```

但是这里有个问题，因为 tostring 将所有元素都转换成了字符串类型，然后我通过 map 又全部转换成了 number 类型。也就是说这个方法局限性非常大。

## reduce

因为是原理其实需要遍历数组，因此可以使用`reduce`来简化代码。

```js
function flatten(arr) {
  return arr.reduce(function (prev, next) {
    return (prev = prev.concat(Array.isArray(next) ? flatten(next) : next));
  }, []);
}
```

注意一定要赋值给 reduce 的原始值为一个空数组，否则运行失败。

## ...运算符

```js
function flatten(arr) {
  while (arr.some((i) => Array.isArray(i))) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

这里要注意，我在这里卡了一会：

`[].concat()` 如果参数是一个数组的话，就相当于合并。可传入多个参数，使用逗号分隔开。

## 使用 Generator

```js
function flatten(arr) {
  function* flattenGenerator(arr) {
    for (let i of arr) {
      if (Array.isArray(i)) {
        yield* flattenGenerator(i);
      } else {
        yield i;
      }
    }
  }
  let g = flattenGenerator(arr);
  let res = [];
  for (let i of g) {
    res.push(i);
  }
  return res;
}
```

## undercore

下面我们就作了解吧。了解一下 undercore 的扁平化函数吧：

```js
/**
 * 数组扁平化
 * @param  {Array} input   要处理的数组
 * @param  {boolean} shallow 是否只扁平一层
 * @param  {boolean} strict  是否严格处理元素，下面有解释
 * @param  {Array} output  这是为了方便递归而传递的参数
 * 源码地址：https://github.com/jashkenas/underscore/blob/master/underscore.js#L528
 */
function flatten(input, shallow, strict, output) {
  // 递归使用的时候会用到output
  output = output || [];
  var idx = output.length;

  for (var i = 0, len = input.length; i < len; i++) {
    var value = input[i];
    // 如果是数组，就进行处理
    if (Array.isArray(value)) {
      // 如果是只扁平一层，遍历该数组，依此填入 output
      if (shallow) {
        var j = 0,
          length = value.length;
        while (j < length) output[idx++] = value[j++];
      }
      // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
      else {
        flatten(value, shallow, strict, output);
        idx = output.length;
      }
    }
    // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
    else if (!strict) {
      output[idx++] = value;
    }
  }

  return output;
}
```
