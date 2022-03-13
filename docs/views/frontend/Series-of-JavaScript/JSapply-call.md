---
title: JavaScript深入之call、apply和bind的模拟实现
date: 2021-10-24
lastUpdated: 2021-10-24
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

> 以下大多数内容最初灵感启发来自于[冴羽博客](https://github.com/mqyqingfeng/Blog)

## Call

**第一次模拟**

要是我们要自己实现一个模拟的`call`函数，需要怎么做呢？我们可以从一些简单的功能开始做起。首先`call`函数可以改变`this`的指向，并且可以执行对应的函数。

举个例子：

```js
const obj = {
  name: "Tony",
};
function sayName() {
  console.log(this.name);
}
sayName.call(obj); // Tony
```

因此我们可以这样想：

- 在 obj 上赋一个 sayName 函数方法
- 调用结束后 delete 掉

```js
Function.prototype._call = function (context = window) {
  context.fn = this; // this指向调用者，即sayName
  context.fn();
  delete context.fn;
};
const obj = {
  name: "Tony",
};
function sayName() {
  console.log(this.name);
}
sayName._call(obj); // Tony
```

**第二次模拟**
除了上述功能以外，`call`还能传递参数，而且是不定数量的参数。

```js
const foo = {
  value: 1,
};

function bar(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}

bar.call(foo, "kevin", 18);
// kevin
// 18
// 1
```

这个我们可以利用`arguments`来获取参数。

```js
Function.prototype._call = function (context = window) {
  arguments.splice(0, 1); // 将context除去
  context.fn = this;
  context.fn(...arguments);
  delete context.fn;
};
const foo = {
  value: 1,
};

function bar(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}

bar._call(foo, "kevin", 18);
// kevin
// 18
// 1
```

**第三版模拟**

`call`还支持有返回值的函数。因此我们可以在执行 fn 的时候将其返回值 return 出来。而且当`context`传入 null 的时候，默认指向`window`对象。完成了这些，一个`call`模拟函数就成功完成啦。

```js
Function.prototype._call = function (context) {
  context = context || window;
  let args = Array.from(arguments);
  args.splice(0, 1); // 将context除去
  context.fn = this;
  const res = context.fn(...args);
  delete context.fn;
  return res;
};
```

## Apply

`apply`跟`call`也是一样的原理，只需要在传参的时候修改一下即可。

```js
Function.prototype._apply = function (context, args) {
  context = context || window;
  context.fn = this;
  const res = context.fn(...args);
  delete context.fn;
  return res;
};
```

## bind

之前我也写过一个`bind`的模拟函数，但是并不能完整地复现`bind`的功能。

```js
function _bind(context = window, ...outer) {
  const _this = this; // fn(){}
  return function (...inner) {
    _this.call(context, ...outer.concat(inner));
  };
}
Function.prototype._bind = _bind;
```

这个函数有一个很明显的问题，就是对于要绑定有返回值的函数，它会返回一个`undefined`,因为本来就没定义返回值。

修改后的模拟函数如下：

```js
function _bind(context = window, ...outer) {
  const _this = this; // fn(){}
  return function (...inner) {
    return _this.call(context, ...outer.concat(inner));
  };
}
Function.prototype._bind = _bind;
```

**构造函数的模拟实现**

`bind`有一个特点：

> 一个绑定函数也能使用 `new` 操作符创建对象：这种行为就像把原函数当成构造器。提供的 `this` 值被忽略，同时调用时的参数被提供给模拟函数。

也就是说，此时`bind`绑定的`this`会被忽略。举个例子：

```js
var foo = {
  value: 1,
};

function bar(name, age) {
  this.habit = "shopping";
  console.log(this.value);
  console.log(name);
  console.log(age);
}
bar.prototype.friend = "kevin";
var bindFoo = bar.bind(foo, "daisy");
var obj = new bindFoo("18");
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

这里输出的`this.value`是`undefined`，就说明绑定的 this 失效了。（实际上绑定在了 obj 上）

因此我们可以这样修改：

```js
function _bind(context = window, ...outer) {
  const _this = this; // fn(){}
  let fBound = function (...inner) {
    // 当作为构造函数的时候，this指向实例，就会返回true
    // 普通函数的时候，this指向window
    return _this.call(
      this instanceof fBound ? this : context,
      ...outer.concat(inner)
    );
  };
  fBound.prototype = _this.prototype; // 让实例可以继承绑定函数的原型
  return fBound;
}
Function.prototype._bind = _bind;
```

现在我们还剩下最后的一个问题，我们在修改 fBound 的原型的时候，会直接改变原来绑定的 this 的原型。

```js
Function.prototype._bind = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
  };
  fBound.prototype = this.prototype;
  return fBound;
};

function bar() {}
var bindFoo = bar._bind(null);
bindFoo.prototype.value = 1;
console.log(bar.prototype.value); // 1
```

因此我们可以做最后的修改，用一个空对象来过渡。

```js
Function.prototype._bind = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  // 注意 ：作构造函数使用的时候，this绑定在构造函数身上而不是context
  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };
  var fNOP = function () {};
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```
