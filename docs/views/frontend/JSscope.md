---
title: js深入系列：静、动态作用域和上下文栈
date: 2021-10-19
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

> 以下大多数内容最初灵感启发来自于[冴羽博客](https://github.com/mqyqingfeng/Blog)

## 作用域

作用域是程序定义变量的区域。

作用域规定了如何去查找变量，也就是执行当前代码对变量的访问权限。

作用域存在静态作用域和动态作用域。静态作用域指的是，在声明的时候作用域就已经决定好了。而动态作用域是根据调用的位置。而 JavaScript 采用的是静态作用域。

接下来看一个例子：

```js
var value = 1;
function foo() {
  console.log(value);
}
function bar() {
  var value = 2;
  foo();
}
bar();
// 1
```

因为 js 使用的是静态作用域，而且函数具有声明提升，即：

```js
function foo() {
  console.log(value);
}
var value = 1;
// balabala.....
```

所以调用`foo()`首先在函数内部寻找，若没有则寻找外面的，也就是`value=1`。

试想一下，如果是动态作用域的话，则在调用的时候决定作用域，即寻找到外面的是`value=2`。

我们再来一个例子看看：

```js
var val = 10;
foo();
var val = 20;
function foo() {
  console.log(val); // 10
}
```

这里的 foo 有声明提升，然后执行 foo()的时候，`val`值还没有被 20 覆盖，所以答案是 10。

## 上下文栈

对于 JavaScript 代码的执行顺序，一般来说都是顺序执行的，比如说：

```js
var foo = function () {
  console.log("foo1");
};

foo(); // foo1

var foo = function () {
  console.log("foo2");
};

foo(); // foo2
```

但是在下面这个例子中却变得有点不一样：

```js
function foo() {
  console.log("foo1");
}
foo(); // foo2
function foo() {
  console.log("foo2");
}
foo(); // foo2
```

了解过 js 深入一点的知识的同学就可以知道，这里的函数声明提升导致了这个结果。接下来我们进一步来了解一下 JavaScript 的执行顺序吧。

> 函数声明提升优先于`var`声明提升

### 执行上下文栈

首先 js 的可执行代码分为全局代码、函数代码以及`eval`代码。当执行到一个可执行代码的时候，js 引擎就会创建一个执行上下文栈`（Execution context stack）`。
当 JavaScript 要执行代码的时候，首先遇到的是全局代码，初始化的时候就会将一个`globalContext`压入 ECS 中，并且只有当程序结束的时候，ECS 才会被清空。

然后如果遇到了以下代码：

```js
function fun3() {
  console.log("fun3");
}
function fun2() {
  fun3();
}
function fun1() {
  fun2();
}
fun1();
```

当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈中，等函数执行完毕的时候，就会从 ECS 中弹出。

因此上一段代码的 ECS 过程如下：

```js
ECS.push(<fun1> functionContext)
ECS.push(<fun2> functionContext)
ECS.push(<fun3> functionContext)
ECS.pop(<fun3> functionContext)
ECS.pop(<fun2> functionContext)
ECS.pop(<fun1> functionContext)
```

了解了执行上下文栈后，我们来看看下面的这个问题:

```js
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f();
}
checkscope();
// ---------------------------------------------
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f;
}
checkscope()();
```

由静态作用域可以知道这两个函数执行结果都是`local scope`，但是它们的区别在于 ECS 的顺序：

```js
ECS.push(<checkscope> functionContext)
ECS.push(<f> functionContext)
ECS.pop()
ECS.pop()
----------------------------
ECS.push(<checkscope> functionContext)
ECS.pop()
ECS.push(<f> functionContext)
ECS.pop()
```

## 例子题目

我们来看一下类似的题目吧。

**一**

```js
var length = 100;
function f1() {
  console.log(this.length);
}
var obj = {
  length: 10,
  f2: function (f1) {
    f1();
    arguments[0]();
  },
};
obj.f2(f1, 1, 2);
```

首先我们要知道，`this`的指向性问题是由**动态作用域**决定的。因此`this`指向决定于调用者。

举个栗子：

```js
var a = 100;
function f1() {
  console.log(this.a);
}
f1(); // 100 调用者是window
```

> 要注意的是，这里如果在 node 环境中的话打印的是`undefined`，因为在文件里写的代码被函数包裹着，所以不会挂到全局`global`对象，这个包裹着的函数是用作模块化的。而在浏览器中(es6)，`var、function`声明的全局变量属于顶层对象的属性，即`Window`；而`let`声明的变量不再挂载在顶层对象中。**本文例子环境默认是浏览器中**

再举个栗子：

```js
function f1() {
  console.log(this.a);
}
var obj = {
  a: 10,
  f2: f1,
};
obj.f2(); //10 调用者obj
```

如果是数组的话，调用者就是数组本身。

我们再来看回栗子，第一个`f1()`没有调用者，默认是 window 因此答案是 100；第二个调用 f1 的主人是`arguments`,因此返回的是`arguments`的长度 3

**二**

```js
var a = 10;
function test() {
  console.log(a);
  a = 100;
  console.log(this.a);
  var a;
  console.log(a);
}
```

我们可以根据声明提升将代码变成这样：

```js
var a = 10;
function test() {
  var a;
  console.log(a);
  a = 100;
  console.log(this.a);
  console.log(a);
}
test();
```

**外部变量不会影响到内部变量的作用域**，因此第一个返回 undefined，第二个返回 10，第三个返回 100

**三**

经历了以上困难，下面的题应该可以秒杀了吧~~~

```js
var a = 10;
function f1() {
  var b = 2 * a;
  var a = 20;
  var c = a + 1;
  console.log(b); // 2*undefined=NaN
  console.log(c); // 21
}
f1();
```
