---
title: JavaScript深入之forEach方法
date: 2022-2-15
lastUpdated: 2022-2-15
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

# 聊一聊 forEach

今天在封装一个红绿灯函数切换的时候，发现了一个很让人疑惑的问题：

```js
function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
const Task = {
  red: 1000,
  green: 2000,
  yellow: 1000,
};
async function task(light) {
  console.log(light);
  await sleep(Task[light]);
}
async function run() {
  for (let i in Task) {
    await task(i);
  }
  run();
}
run();
// red green yellow
```

```js
function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
const Task = {
  red: 1000,
  green: 2000,
  yellow: 1000,
};
async function color(key) {
  await sleep(Task[key]);
  console.log(key);
}
async function task(tasks) {
  let keys = Object.keys(tasks);
  keys.forEach(async (key) => {
    await color(key);
  });
}
task(Task);
// red  yellow  green
```

我们可以看到以上两个例子，唯一的区别就是使用了`for..in `以及`forEach`方法，但为什么执行结果截然不同呢？

理论上由于我使用了`async...await`，应该会变成同步操作的，可是在`forEach`中却还是异步执行操作。

这让我想要去查找 forEach 的特性！！

目前我已经知道了一些关于 forEach 的特性：

- **无法 break 和 return**
- **删除自身元素，其 index 不会重置**

```js
let arr = [1, 2];
arr.forEach((item, index) => {
  arr.splice(index, 1);
  console.log(1);
});
console.log(arr); // 【2】 ,由于index在0的时候删除了1，此时index变成了1，由于现在数组最大索引是0，因此结束循环
```

- **不对未初始化的值进行任何操作（稀疏数组）**

```js
const arraySparse = [1, 3, , 7];
let numCallbackRuns = 0;

arraySparse.forEach(function (element) {
  console.log(element);
  numCallbackRuns++;
});

console.log("numCallbackRuns: ", numCallbackRuns);

// 1
// 3
// 7
// numCallbackRuns: 3
```

**[注]在读了下面的源码后发现，其实是因为将数组转化为对象后，索引 2 对应的值为 undefined**,因此在`2 in O`的时候返回的是 false

而今天，又多了一个新特性，就是**forEach 不会对 Promise 进行处理**

这里贴一下 forEach 的源码吧

```js
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    var T, k;
    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }
    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);
    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;
    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.

        // 这里k即index，kValue就是value值，T即this指向，这里一般为undefined，O就是数组对象
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
```

可以看到，forEach 内部利用 while 循环来遍历数组，但是此时有一个很重要的问题，就是它并**没有对 Promise 作任何处理**。即使 callback 是 Promise 对象，它也没有任何操作。因此其实它并不支持 async...await

解决方法也及其简单，只需要加上一个 await 即可：

```js
await callback.call(T, kValue, k, O);
```

> 上述代码也说明了为什么我们在回调函数中使用 `break` 或者 `return` 不生效

- break 无效

break 只能用来跳出循环，但是我们使用 forEach 时通常是把代码写在回调函数里，break 用于跳出回调函数时会报错，所以无法跳出外层的 forEach 循环

- return 无效

return 可以跳出函数，但是只能跳出当前函数，所以在 forEach 中**return 只能跳出当前这一次的回调函数，仍然在 for 循环中，而无法跳出 forEach 函数**，所以回调函数外的 for 循环会继续执行下去。
