---
title: 《ES6标准入门》阮一峰---读书笔记
date: 2021-11-29
lastUpdated: 2021-11-29
categories:
  - 随笔日记
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

## 第 15 章 Iterator 遍历器接口

在使用`...`、`for...of`等运算的时候都会默认调用对象的 Iterator 接口。但是 JavaScript 中普通对象是没有这个接口的。下面这个例子是手动给对象添加上这个 Iterator 遍历器。

```js
let obj = {
  count: 0,
  [Symbol.iterator]() {
    return {
      next: () => {
        if (obj.count < 10) {
          return {
            value: obj.count++,
            done: false,
          };
        } else
          return {
            value: obj.value,
            done: true,
          };
      },
    };
  },
};
for (let i of obj) {
  console.log(i); // 0~9
}
```

## 第 16 章 Generator 函数的语法

Generator 函数是 ES6 提供的一个异步编程解决方案，它的语法行为跟正常函数完全不一样。可以理解为一个状态机。

### 状态机

```js
function* clock() {
  while (1) {
    console.log("Tick!");
    yield;
    console.log("Tock!");
    yield;
  }
}
let c = clock();
c.next(); // Tick!
c.next(); // Tock!
```

上述例子就有`Tick`、`Tock`两种状态。

> yield 表达式只能用在 Generator 函数里面。如果要用在另一表达式中，除了用在函数实参以及赋值表达式右边不需要加括号以外，都需要加括号。

### 遍历器对象 Iterator

Generator 函数会返回一个遍历器对象。

```js
let obj = {
  a: 1,
  b: 2,
  [Symbol.iterator]: function* () {
    for (let [key, val] of Object.entries(obj)) {
      yield [key, val];
    }
  },
};
for (let i of obj) {
  console.log(i); // ['a', 1],['b', 2]
}
```

这种方案可以最简单的为对象添加上遍历器属性。

### next 方法的参数

`next()`可以传入一个参数，这个参数会作为上一个`yield`表达式的返回值。`yield`本身是没有返回值的，即`undefined`

```js
function* foo() {
  for (let i = 0; i < 100; i++) {
    let res = yield i;
    if (res) i = 0;
  }
}
for (let i of foo()) {
  console.log(i);
}
```

上述例子会打印出 1~100 的数字，因为`res`总是`undefined`。因此我们可以做以下尝试：

```js
let g = foo();
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next(8));
// { value: 0, done: false }
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 1, done: false }
```

因此第 4 次传入一个参数 8，因此触发 if 条件，i=0，此后 `i++` 变为 1 输出

> 因此 next 的参数表示上一条 yield 语句的返回值，所以第一次 next 传参是无效的。V8 引擎直接忽略第一次 next 的参数。从语义上说，第一次 next 是用于启动遍历器对象的。

### Generator.prototype.throw()

Generator 函数返回的遍历器对象有一个 throw()方法，在函数体外抛出错误，可以在函数体内捕获错误，并且不会影响后续的遍历器操作。

> throw()执行后，会附带执行下一次 yield 语句。

### Generator.prototype.return()

可以返回给定的数，并且终结 Generator 函数的遍历。

### yield\* 表达式

如果想要在 Generator 函数中使用另一个 Generator 函数，那么就得使用`yield*` 表达式。

```js
function* foo() {
  yield 1;
  yield* bar();
  yield 4;
}
function* bar() {
  yield 2;
  yield 3;
}

for (let i of foo()) {
  console.log(i);
}
```

有了这个特性，我们可以利用 Generator 函数来实现一个扁平化数组的算法：

```js
function* flat(arr) {
  if (Array.isArray(arr)) {
    for (let i of arr) {
      yield* flat(i);
    }
  } else yield arr;
}

let arr = [1, [2, 3, [4, 5], 6], 7];
let g = flat(arr);
let res = [];
for (let i of g) {
  res.push(i);
}
console.log(res);
```

### 异步编程

这部分可以直接使用`async..await`了

## 第十八章 async 函数

其实`async..await`就是 Generator 的一个语法糖，其实现原理也就是将 Generator 函数和自动执行器包在一个函数内：

```js
// async function fn(args) {
//      ...
// }
// 等同于

function* gen() {
  yield 1;
  yield 2;
}
function fn(gen: () => Generator) {
  return spawn(gen);
}
function spawn(gen: () => Generator) {
  return new Promise((resolve, reject) => {
    let g = gen();
    function step(nextF: Function) {
      let next;
      try {
        next = nextF(); // { value: 1, done: false }
      } catch (error) {
        return reject(error);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value)
        .then((res) => {
          step(() => g.next(res));
        })
        .catch((e) => {
          step(() => g.throw(e));
        });
    }
    step(() => g.next(undefined)); // 这里不能直接传g.next()因为有可能发生错误而无法捕获
  });
}

fn(gen);
```

## 第 22 章 Module 的语法

### 模块加载方案

```js
// commonJS
let { stat, exists, readFile } = require("fs");
//等同于
let _fs = require("fs");
let stat = _fs.stat;
//...

// ES6
import { stat, exists, readFile } from "fs";
```

从上面的例子我们可以得知，commonJS 的加载方案，实质上会先生成一个对象再从其身上读取属性。这种方法叫做**运行时加载**，即只有当代码运行的时候才开始加载这个对象，因此也完全没办法进行编译时 “静态优化”。

而 ES6 中的方法，可以实现只加载指定的 3 个方法，这种方法叫做**编译时加载**，即可以在编译的时候就完成加载。因此`import`无法用在表达式或者条件语句中。

### export

- `export`语句输出的接口和对应的值是动态绑定的，因此要是内部文件变量改变了，外部引用的值也会实时变化。

> 这也和 commonJS 的不一样，commonJS 加载的是静态缓存，即不会实时变化。

- `export`语句只能放在模块顶层，不能放在函数之中、块作用域之中...

### import

基本语法：

```js
import { foo } from "my_module";
import * as module from "my_module";
```

`import` 具有**声明提升**的特性。且如果多次重复执行同一句`import`，则只会**执行一次**。

但在需要动态加载的场合下，那就得用到`import()`函数了。`import()`返回一个 Promise 对象。

```js
import(`./section_modules/${someVariable}.js`).then((module) => {
  console.log(module);
  // 这里的module还可以写成解构形式
});
```

## 第 23 章 Module 的加载实现

总所周知，异步加载 JavaScript 脚本有两种方法：`defer`和`async`

- `defer`是异步加载完 js 文件后等页面渲染完成之后再去执行 js 代码
- `async`则是异步加载完后立即中断渲染去执行 js 代码。

浏览器在加载 ES6 模块的时候，需要加入`type="module"`属性，这个属性等同于带了`defer`属性一样。

> 这里注意一下，模块顶层的 this 关键字返回 undefined，而不是指向 window

### require 命令加载

#### 循环加载

循环加载指的是 a 脚本执行依赖 b 脚本，b 脚本的执行也依赖 a 脚本。

对于处理循环加载的情况，我们从 CommonJS 和 ES6 两种角度进行分析学习：

**CommonJS 模块加载原理**是 require 命令第一次加载脚本的时候会全部执行，然后生成一个对象在内存中，以后再用到的话都是从**缓存**中去取值了。

这里做了一个小 demo：

```js
// a.js
exports.done = false;
let b = require("./b.js");
console.log(`in a.js，b.done=${b.done}`);
exports.done = true;
console.log("a finished");
// b.js
exports.done = false;
let a = require("./a.js");
console.log(`in b.js，a.done=${a.done}`);
exports.done = true;
console.log("b finished");
// main.js
let a = require("./a.js");
let b = require("./b.js");
console.log(`in main.js,a.done=${a.done},b.done=${b.done}`);

/* 执行后 */
// in b.js，a.done=false
// b finished
// in a.js，b.done=true
// a finished
// in main.js,a.done=true,b.done=true
```

由此可以看出，首先引用 a，然后 a 又引用了 b，在 b 执行的过程中引用 a 的时候会从缓存中取值，因此 a.done=false。

commonJS 模块循环加载的时候返回的是**当前已经执行的部分**的值。(缓存)

因此我们引用模块的时候，为了避免值的准确性不要使用以下写法：

```js
let foo = require("a").foo;
```

**ES6** 的循环加载原理：因为 ES6 是动态引用的，所以通过`import`加载的变量是不会被缓存的，而是成为一个指向被加载模块的引用。

这里举两个例子就很清楚了。

```js
//a.js
import { bar } from "./b.js";
console.log("a.js");
console.log(bar);
export let foo = "foo";
// b.js
import { foo } from "./a.js";
console.log("b.js");
console.log(foo);
export let bar = "bar";
```

上述代码，首先加载 a.js，然后执行 b.js，而 b.js 的第一行又是加载 a.js，由于此时 a.js 已经开始执行所以不会重复执行，于是继续执行 b.js，打印`b.js`，但由于此时 a.js 还没执行完，还没暴露 foo 变量，因此报错。

下面来看第二个例子吧。

```js
// a.js
import { bar } from "./b.js";
export function foo() {
  console.log("foo");
  bar();
  console.log("finished A");
}
foo();
// b.js
import { foo } from "./a.js";
export function bar() {
  console.log("bar");
  if (Math.random() > 0.5) foo();
}
```

根据 Commonjs 规范，上述代码肯定无法执行，因为对于 b 来说 foo 变量为空。 但是在 ES6 就可以执行上述代码。**因为`bar`建立了一个 b.js 的一个引用。**
