---
title: 柯里化函数编程思想--手写一个bind函数
date: 2021-8-14
lastUpdated: 2022-1-14
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

今天看博客，看到一道 3 年前的前端面试题，

> 请实现一个 add 函数，并且满足以下功能

```
add(1) //1
add(1)(2) //3
add(1)(2)(3) //6
add(1)(2,3) //6
add(1,2)(3) //6
add(1,2,3) //6
```

在解决这个问题之前，我们首先先了解以下什么叫 **柯里化函数**。

> 维基百科上说道：柯里化，英语：Currying(果然是满满的英译中的既视感)，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

柯里化函数对性能方面有一些特点：

- 存取 arguments 对象通常要比存取命名参数要慢一点
- 一些老版本的浏览器在 arguments.length 的实现上是相当慢的
- 使用 fn.apply( … ) 和 fn.call( … )通常比直接调用 fn( … ) 稍微慢点
- 创建大量嵌套作用域和闭包函数会带来花销，无论是在内存还是速度上

不过 JS 上的花销不算的了什么。

那么，柯里化函数也有一些好处：

- 可以利用闭包的机制，把最初的参数先存入到私有作用域中，后面返回的函数就可以调用这个作用域内的变量了。

```js
function fn(...args) {
  let i = 0;
  console.log(i++);
  return function () {
    console.log(args);
  };
}
// 这里的外层作用域中的代码只被调用一次
setInterval(fn(100, 200), 1000); //0 [ 100, 200 ] [ 100, 200 ] [ 100, 200 ]
```

- 预先处理
- 延迟运行

我们以 bind()函数为例子，bind()函数接收了参数之后，并不会立即执行。并且预先把 this 的指向存在了闭包作用域内。
那么，我们可以自己手写一个 mybind()函数试试看。

```js
(function () {
  function mybind(context = window, ...outer) {
    const _this = this; // fn(){}
    return function (...inner) {
      _this.call(context, ...outer.concat(inner));
    };
  }
  Function.prototype.mybind = mybind;
})();
let obj = {
  name: "aa",
};
function fn(...args) {
  console.log(this, args);
}
document.body.onclick = fn.mybind(obj, 100, 200);
// obj , [100, 200, MouseEvent]   bind会默认返回事件对象
```

让我们回到开篇的面试题中，我们来解答一下这个经典题：

```js
function add() {
  // arguments是一个伪书数组，这句话是将arguments全部push到_args中。
  let _args = [].slice.call(arguments);
  var adder = function () {
    var _adder = function () {
      _args.push(...arguments); // 第2~~~次开始传递的参数
      return _adder;
    };
    // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
      return _args.reduce(function (a, b) {
        return a + b;
      });
    };
    return _adder; // 始终返回一个函数，可以无限次调用
  };
  return adder(..._args);
}

add(1, 2)(3, 4).toString(); // 10
```

- 首先参数[1,2]传入`_args`中，然后进入到内层函数 `adder(1,2)`中。
- 第二次再传递(3,4)参数，进入`_adder`参数中。并且将(3,4)`push`到了`_args`中，然后改写`toString`方法，让它可以返回全部参数之和，最后再返回`_adder`函数。
- 以后继续调用的时候，就不断重复`_adder`函数。

# JS 深入系列之函数柯里化思想

> 以下内容灵感来自[冴羽博客](https://github.com/mqyqingfeng/Blog)

了解了函数柯里化之后，我们要来实现一个很强大的 curry 函数。在此之前，先看一下以下例子：

```js
var person = [{ name: "kevin" }, { name: "daisy" }];
// 如果我们要获取所有的 name 值，我们可以这样做：

var name = person.map(function (item) {
  return item.name;
});
// 不过如果我们有 curry 函数：

var prop = curry(function (key, obj) {
  return obj[key];
});

var name = person.map(prop("name"));
```

这个 prop 实际上是使用 curry 函数后返回的一个封装好的工具函数，能更好的对外使用。

下面我们来实现一下吧。

## 第一版

> 注意，这里如果按照冴羽博客上的来实现将不能复现刚刚的需求，比如要在 prop 中传入对象 item

```js
function curry(fn) {
  let args = [].slice.call(arguments, 1);
  return function () {
    let arg = args.concat([].slice.call(arguments));
    return fn.apply(this, arg);
  };
}

// *******************//
var person = [{ name: "kevin" }, { name: "daisy" }];
var prop = curry(function (key, obj) {
  return obj[key];
});

var name = person.map((item) => prop("name", item));
console.log(name); // [ 'kevin', 'daisy' ]

const add = (a, b) => a + b;
let a1 = curry(add, 1, 2);
console.log(a1()); // 3
let a2 = curry(add, 1);
console.log(a2(6)); // 7
let a3 = curry(add);
console.log(a3(6, 6)); // 12
```

这个 curry 函数还没有达到最终的效果，下面我们来继续深入探讨。

## 第二版

```js
function sub_curry(fn) {
  let args = [].slice.call(arguments, 1);
  return function () {
    let arg = args.concat([].slice.call(arguments));
    return fn.apply(this, arg);
  };
}
function curry(fn, length) {
  length = length || fn.length;
  const slice = Array.prototype.slice;
  return function () {
    if (arguments.length < length) {
      const args = [fn].concat(slice.call(arguments));
      return curry(sub_curry.apply(this, args), length - arguments.length);
    } else {
      return fn.apply(this, slice.call(arguments));
    }
  };
}
//
function foo(a, b, c) {
  return [a, b, c];
}
const f = curry(foo);
f(1)(2)(3); //[1,2,3]
```

这一版的比较难理解，我总结为以下一句话：

**可以这么理解，在参数没有传够之前，参数都交给 sub_curry 保存并合并，等传够后再执行 sub_curry**

其实还有更**简单易懂**的实现方法，直接通过递归将参数都存起来，等到参数够了之后再执行 fn 函数：

```js
function curry(fn, args) {
  args = args || [];
  const length = fn.length;
  return function () {
    let _args = args.concat([].slice.call(arguments));
    if (_args.length < length) return curry.call(this, fn, _args);
    else return fn.apply(this, _args);
  };
}
```

## 第三版（占位符- -）

这一版我就直接转载冴羽大佬的代码了，因为我不是很明白，而且感觉也有一点问题，也没有必要这样。主要的想法是不希望将参数从左到右的形式传入，而引入一个占位符。

比如：

```js
var fn = curry(function (a, b, c) {
  console.log([a, b, c]);
});

fn("a", _, "c")("b"); // ["a", "b", "c"]
```

实现代码如下（转载）：

```js
// 第三版
function curry(fn, args, holes) {
  length = fn.length;

  args = args || [];

  holes = holes || [];

  return function () {
    var _args = args.slice(0),
      _holes = holes.slice(0),
      argsLen = args.length,
      holesLen = holes.length,
      arg,
      i,
      index = 0;

    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      // 处理类似 fn(1, _, _, 4)(_, 3) 这种情况，index 需要指向 holes 正确的下标
      if (arg === _ && holesLen) {
        index++;
        if (index > holesLen) {
          _args.push(arg);
          _holes.push(argsLen - 1 + index - holesLen);
        }
      }
      // 处理类似 fn(1)(_) 这种情况
      else if (arg === _) {
        _args.push(arg);
        _holes.push(argsLen + i);
      }
      // 处理类似 fn(_, 2)(1) 这种情况
      else if (holesLen) {
        // fn(_, 2)(_, 3)
        if (index >= holesLen) {
          _args.push(arg);
        }
        // fn(_, 2)(1) 用参数 1 替换占位符
        else {
          _args.splice(_holes[index], 1, arg);
          _holes.splice(index, 1);
        }
      } else {
        _args.push(arg);
      }
    }
    if (_holes.length || _args.length < length) {
      return curry.call(this, fn, _args, _holes);
    } else {
      return fn.apply(this, _args);
    }
  };
}

var _ = {};

var fn = curry(function (a, b, c, d, e) {
  console.log([a, b, c, d, e]);
});

// 验证 输出全部都是 [1, 2, 3, 4, 5]
fn(1, 2, 3, 4, 5);
fn(_, 2, 3, 4, 5)(1);
fn(1, _, 3, 4, 5)(2);
fn(1, _, 3)(_, 4)(2)(5);
fn(1, _, _, 4)(_, 3)(2)(5);
fn(_, 2)(_, _, 4)(1)(3)(5);
```
