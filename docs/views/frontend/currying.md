---
title: 柯里化函数编程思想---手写一个bind函数
date: 2021-8-14
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
  return function() {
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
(function() {
  function mybind(context = window, ...outer) {
    const _this = this; // fn(){}
    return function(...inner) {
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
  var adder = function() {
    var _adder = function() {
      _args.push(...arguments); // 第2~~~次开始传递的参数
      return _adder;
    };
    // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function() {
      return _args.reduce(function(a, b) {
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
