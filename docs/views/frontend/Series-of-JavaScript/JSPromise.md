---
title: JavaScript之深入了解Promise
date: 2022-1-19
lastUpdated: 2022-1-19
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

# JavaScript 之深入了解 Promise

## 什么是 Promise

Promise 是 ES6 新加入的一个对象，顾名思义，是保存着未来才会结束的操作的结果，即‘期许’。

Promise 的出现很好的解决了回调地狱的难题。

这里贴一下![Promise的A+规范](https://www.ituring.com.cn/article/66566)

## Promise 基本结构

首先来看一下我们平时是如何使用 Promise 的。

```js
var p = new Promise(function (resolve, reject) {
  console.log("done");
  setTimeout(function () {
    resolve(1);
  }, 1000);
});
p.then(
  function (res) {
    console.log("suc", res);
  },
  function (err) {
    console.log("err", err);
  }
);
```

可以看到，new 的 Promise 对象中传入了一个函数，这个函数有 2 个参数，且是 2 个函数。resolve 之后，通过 then 对返回结果进行处理。

同时，在 promise/A+规范规定了一下规则：

> promise 是一个拥有 then 方法的对象或函数，其行为符合本规范；
> 一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。

因此我们可以先定义三个状态以及 Promise 内部用于存储数据的一些变量：

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
function _Promise(executor) {
  let _this = this;
  _this.state = PENDING;
  _this.value = undefined; // resolve res
  _this.reason = ""; // err
  function resolve(value) {}
  function reject(err) {}
}
```

而且我们知道 Promise 构造函数传入的函数也是需要被执行的，而且优先级相当于立即执行。（记得还要捕获报错）

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
function _Promise(executor) {
  let _this = this;
  _this.state = PENDING;
  _this.value = undefined; // resolve res
  _this.reason = ""; // err
  function resolve(value) {}
  function reject(err) {}
  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
```

## Promise 状态不变

Promise 一旦从 pending 态变成了 fulfilled 或者 rejected 态后，就不可以再改变了！

因此下面我们来实现`resolve`以及`reject`

`resolve`与`reject`要做的事情非常相似：首先是保存好传入的值，一个是返回值一个是报错原因；其次是改变状态。而且注意只能起始于 pending 态。

```js
function resolve(value) {
  if (_this.state === PENDING) {
    _this.value = value;
    _this.state = FULFILLED;
  }
}
function reject(reason) {
  if (_this.state === PENDING) {
    _this.reason = reason;
    _this.state = REJECTED;
  }
}
```

为什么要将 value 和 reason 存储起来呢？理由是因为我们在 then 之后，需要获取到成功或者失败的返回值，这时候就需要从 Promise 身上取出了。

## then 的简单实现

当 Promise 的状态从 pending 发生变化的时候，都会触发 then 回调函数。而 then 有 2 个参数。

> 根据 Promise/A+规范，onfulfilled 和 onrejected 都是可选参数，但只能是函数。非函数值一律忽略

```js
_Promise.prototype.then = function (onfulfilled, onrejected) {
  if (_this.state === FULFILLED) {
    typeof onfulfilled === "function" && onfulfilled(this.value); // 此时取出之前保存值
  }
  if (_this.state === REJECTED) {
    typeof onrejected === "function" && onrejected(this.reason);
  }
};
```

看起来好像功能差不多了，让我们做一个小 demo 吧：

```js
new _Promise(function (resolve, reject) {
  console.log("start");
  setTimeout(function () {
    reject(1);
  }, 1000);
}).then(
  function (res) {
    console.log(res);
  },
  function (err) {
    console.log(err);
  }
);
```

然后可以看到，控制台只输出了`start`，而没有输出 1。我们可以在 then 中输出当前状态值来排错，发现输出的是 pending

理由也很简单，因为 setTimeout 是宏任务，当执行完`executor`后，将 setTimeout 推入外部队列、then 推进内部队列后，就会执行 then（then 是微任务）。此时 state 还没被改变。简而言之就是 **then 发生在 resolve 之前**。

![](../imgs/Promise1.jpg)

因此我们需要在状态改变完之后，再去执行 then 中的回调函数。因此这里我们可以使用发布-订阅模式：当执行 then 的时候 state 还没改变的时候，将回调函数都先保存下来，等到 state 变了，再把回调函数取出并执行。

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
function _Promise(executor) {
  let _this = this;
  _this.state = PENDING;
  _this.value = undefined; // resolve res
  _this.reason = ""; // err
  _this.onfulfilled = [];
  _this.onrejected = [];
  function resolve(value) {
    if (_this.state === PENDING) {
      _this.value = value;
      _this.state = FULFILLED;
      _this.onfulfilled.forEach((fn) => fn(value));
    }
  }
  function reject(reason) {
    if (_this.state === PENDING) {
      _this.reason = reason;
      _this.state = REJECTED;
      _this.onrejected.forEach((fn) => fn(reason));
    }
  }
  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
_Promise.prototype.then = function (onfulfilled, onrejected) {
  if (_this.state === FULFILLED) {
    typeof onfulfilled === "function" && onfulfilled(this.value); // 此时取出之前保存值
  } else if (_this.state === REJECTED) {
    typeof onrejected === "function" && onrejected(this.reason);
  } else {
    typeof onfulfilled === "function" && this.onfulfilled.push(onfulfilled);
    typeof onrejected === "function" && this.onrejected.push(onrejected);
  }
};
```

至此 我们已经自己手写实现了一个简单的 Promise 辣！

## then 的链式调用（难点）

接下来才是真正的难点。首先来看一下 Promise/A+规范关于链式调用的内容吧

> then 方法必须返回一个 promise 对象

> promise2 = promise1.then(onFulfilled, onRejected);

也就是说每次 then 方法都需要返回一个新的 Promise 对象。

```js
promise2 = promise1.then(onFulfilled, onRejected);
```

因此我们需要：

```js
_Promise.prototype.then = function (onfulfilled, onrejected) {
  let p2 = new _Promise((resolve, reject) => {});
  return p2;
};
```

然后继续看一下 then 的执行过程规范：

> 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：`[[Resolve]](promise2, x)`
> 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
> 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
> 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因

这里规范的译者还有一句话:

> **不论 promise1 被 reject 还是被 resolve 时 promise2 都会被 resolve，只有出现异常时才会被 rejected。**

我们先看第 3、4 点，其实说的都是一回事。如：

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  });
})
  .then(1, 1)
  .then((res) => {
    console.log(res);
  });
```

这就是返回值的传递。

因此我们需要对传入的 onFulfilled 和 onRejected 做一下处理：

```javascript
_Promise.prototype.then = function (onfulfilled, onrejected) {
  const _this = this;
  onfulfilled =
    typeof onfulfilled === "function" ? onfulfilled : (value) => value;
  onrejected =
    typeof onrejected === "function"
      ? onrejected
      : (reason) => {
          throw reason;
        };
  var p2 = new _Promise((resolve, reject) => {
    if (_this.state === FULFILLED) {
      let x = onfulfiiled(_this.value);
      resolvePromise(p2, x, resolve, reject);
    } else if (_this.state === REJECTED) {
      let x = onrejected(_this.reason);
      resolvePromise(p2, x, resolve, reject);
    } else {
      _this.onfulfilled.push(() => {
        let x = onfulfilled(_this.value);
        resolvePromise(p2, x, resolve, reject);
      });
      _this.onrejected.push(() => {
        let x = onrejected(_this.reason);
        resolvePromise(p2, x, resolve, reject);
      });
    }
  });
  return p2;
};
```

这里的 resolvePromise 就是上面第一点说的解决方法，可以对上个 Promise 的返回值以及新的 promise 进行处理操作。

这里对 Promise 作一下异步操作。

```js
var p2 = new _Promise((resolve, reject) => {
  if (_this.state === FULFILLED) {
    setTimeout(() => {
      try {
        const res = onfulfilled(_this.value);
        resolvePromise(p2, res, resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }
  if (_this.state === REJECTED) {
    setTimeout(() => {
      try {
        const res = onrejected(_this.reason);
        resolvePromise(p2, res, resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }
  if (_this.state === PENDING) {
    _this.fulfilled.push(() => {
      setTimeout(() => {
        try {
          const res = onfulfilled(_this.value);
          resolvePromise(p2, res, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });
    _this.rejected.push(() => {
      setTimeout(() => {
        try {
          const res = onrejected(_this.reason);
          resolvePromise(p2, res, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
});
```

## resolvePromise

首先我们要知道这个函数的作用。这肯定是用来做上一个 Promise 的 onFulfilled 或者 onRejected 值和状态的传递。

> Promise 解决过程是一个抽象的操作，其需输入一个 promise 和一个值，如果 x 有 then 方法且看上去像一个 Promise ，解决程序即尝试使 promise 接受 x 的状态；否则其用 x 的值来执行 promise 。

```js
// promise 新的promise
// x 上个Promise的返回值
// resolve和reject：新Promise的方法
function resolvePromise(promise, x, resolve, reject) {}
```

- x 与 promise 相等
  - 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
- x 为 Promise
  - 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
  - 如果 x 处于执行态，用相同的值执行 promise
  - 如果 x 处于拒绝态，用相同的据因拒绝 promise
- x 为对象或函数
  - 把 x.then 赋值给 then
  - 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
  - 如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise:
    - 如果 resolvePromise 以值 y 为参数被调用，则运行 resolvePromise
    - 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
    - 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    - 如果 then 不是函数，以 x 为参数执行 promise
- 如果 x 不为对象或者函数，以 x 为参数执行 promise

首先来看第一点，

这很好理解，如果返回的对象 x 和新的 promise 相等，这不就死循环了嘛

因此要排除掉：

```js
if (x === promise)
  reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
```

其次要对 x 进行类型判断，并且如果是函数或者对象的话，先把 x.then 取出来。（注意错误捕获）

```js
function resolvePromise(promise, x, resolve, reject) {
  if (x === promise)
    reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      const then = x.then;
    } catch (e) {
      reject(e);
    }
  } else {
    resolve(x);
  }
}
```

然后我们继续对 3.3 进行实现：

```js
function resolvePromise(promise, x, resolve, reject) {
  if (x === promise)
    reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            resolve(y);
          },
          (err) => {
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  } else {
    resolve(x);
  }
}
```

这时候还有一种特殊情况：当 y 还是一个 Promise 对象的时候要怎么办呢？举个例子（在浏览器中实验）：

```js
const p1 = new Promise((resolve, reject) => {
  resolve("p1");
});
p1.then((res) => {
  return new Promise((resolve, reject) => {
    resolve(
      new Promise((resolve, reject) => {
        resolve("p2");
      })
    );
  });
}).then((res) => {
  //Promise {state: "fulfilled", value: "p2"}
  console.log(res);
});
```

这时候可以直接递归调用 resolvePromise

```js
function resolvePromise(promise, x, resolve, reject) {
  if (x === promise)
    reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    let used = false;
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (used) return;
            used = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (err) => {
            if (used) return;
            used = true;
            reject(err);
          }
        );
      } else {
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (e) {
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}
```

至此我们一个 Promise 就手写完毕了。下面我们来以一个例子来梳理一下思路吧：

```js
var p1 = new _Promise((resolve, reject) => {
  resolve(1);
});
p1.then((res) => {
  return new _Promise((resolve, reject) => {
    console.log(res);
    resolve(2);
  });
}).then((res) => {
  console.log(res);
});
```

思路步骤如下：

- new 一个构造函数----p1:new \_Promise(executor)
- 执行 executor(resolve,reject) --> resolve(1)
- then(onFulfilled)-->resolve(2) --> x=newPromise --> resolvePromise
- then=newPromise.then(newOnFulfilled)-->x=undefined--> resolvePromise
- then-->x=undefined
