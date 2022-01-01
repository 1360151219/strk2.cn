---
title: JavaScript深入之两变量相等
date: 2022-1-1
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

> 以下大多数内容最初灵感启发来自于[冴羽博客](https://github.com/mqyqingfeng/Blog)

今天是 2022 年的第一天，新的一年里也要继续学习继续进步噢~~

今天来学习一下相等。

# 相等

今天我们来定义一个不一样的相等的概念。除了使用`===`来定义相等以外，

我们认为：

1. `NaN` 和 `NaN` 是相等
2. `[1]` 和 `[1]` 是相等
3. `{value: 1}` 和 `{value: 1}` 是相等
   不仅仅是这些长得一样的，还有

4. 和 new Number(1) 是相等
5. 'Curly' 和 new String('Curly') 是相等
6. true 和 new Boolean(true) 是相等

我们要实现的目标很简单：

```js
function eq(a,b){...}
```

实现一个`eq`函数来判断是否相等。

在此之前我们先来了解一下 js 中的令人疑惑的一些地方吧。

## +0 和-0

在 JavaScript 中，`a===b`为 true 就一定证明 a 与 b 相等嘛？

我们可以自己在编译器中测试一下：

```js
console.log(+0 === -0); //true

console.log((+0).toString()); // '0'
console.log((-0).toString()); // '0'
```

可见 JavaScript 认为`+0`和`-0`是相等的。但是再看看以下的例子：

```js
console.log(1 * -0); // -0
console.log(1 * +0); // 0

1 / +0; // Infinity
1 / -0; // -Infinity
```

由此可见，这两者实际上并不相同。

两者是因为 JavaScript 采用 IEEE_754 浮点数表示法(二进制表示法)，其最高位是表示符号的，其余位表示大小。因此有了 1000 和 0000，即正负 0 的区别。

要区分它们也很容易：

```js
function eq(a, b) {
  if (a === b) return 1 / a === 1 / b;
}
```

## NaN

在这里我们认为 NaN 等于其自身，但在 JavaScript 中，`NaN==NaN`返回的是 false。

利用 NaN 被 JS 认为不等于其自身的特性，我们也可以很容易的区分出来 NaN。

```js
function eq(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b; // 全等的情况(包括了正负0)
  if (a !== a) return b !== b; // 若a是NaN，则判断b是不是NaN
}
```

## eq 函数的第一版

```js
function eq(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b; // 全等的情况(包括了正负0)
  if (a !== a) return b !== b; // 若a是NaN，则判断b是不是NaN
  if (a === null || b === null) return false; // 提前排除null
  // 排除一个是基本类型 另一个是函数 肯定不相等
  let typeA = typeof a;
  let typeB = typeof b;
  if (typeA !== "object" && typeA !== "function" && typeB !== "object")
    return false;
  if (typeB !== "object" && typeB !== "function" && typeA !== "object")
    return false;
  return deepEq(a, b); // 对象类型需要深度判断
}
```

## deepEq(String、Number 等类型 对象)

现在要解决的问题是如何让`'bob'===new String('bob')` 返回 true 呢？

我们可以利用别的判断类型的方法：`Object.prototype.toString`来判断，但这样还是太啰嗦了，为了简便我们使用隐式类型转换：

```js
function deepEq(a, b) {
  if (typeof a !== "object" || typeof b !== "object") return a + "" === b + "";
}
```

除此之外，其他对象也一样。于是我们可以写出 deepEq 的第一版：

```js
function deepEq(a, b) {
  let ta = Object.prototype.toString.call(a);
  let tb = Object.prototype.toString.call(b);
  if (ta !== tb) return false;
  switch (ta) {
    case "[object RegExp]":
    case "[object String]":
      return a + "" === b + "";
    case "[object Number]":
      if (a !== a) return b !== b;
      return (+a === 0 && 1 / +a === 1 / +b) || +a === +b;
    case "[object Boolean]":
    case "[object Date]":
      return +a === +b;
  }
}
```

## 构造函数实例

在冴羽博客上，主要的想法是：希望不同构造函数的相同属性的实例区分开来，但是若没有原型的相同属性的实例对象，则可以判断为相等。

```js
if (ta !== "[object Array]") {
  // 排除两个函数的情况
  if (isFunction(a) || isFunction(b)) return false;
  let aCtor = a.constructor;
  let bCtor = b.constructor;
  // aCtor和bCtor都必须存在而且不相等
  if (aCtor !== bCtor && "constructor" in a && "constructor" in b) return false;
}
```

## 数组和对象

这里就直接遍历来判断里面的元素值了。

```js
// 数组
if (ta === "[object Array]") {
  let length = a.length;
  if (length !== b.length) return false;
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) return false;
  }
} else {
  let keys = Object.keys(a);
  let length = keys.length;
  if (length !== Object.keys(b).length) return false;
  while (length--) {
    key = keys[length];
    if (!b.hasOwnProperty(key) || !eq(a[key], b[key])) return false;
  }
}
return true;
```

## 循环引用

最难的部分就要来了，我们先举个例子吧：

```js
a = { abc: null };
b = { abc: null };
a.abc = a;
b.abc = b;

eq(a, b);
```

正常情况下，如果用`===`来判断的话是返回 false 的，但是这个我们希望它返回的是 true

下面有冴羽博客上的一个案例，小伙伴们可以直接将其复制到浏览器中运行看看：

```js
// demo
var a, b;

a = { foo: { b: { foo: { c: { foo: null } } } } };
b = { foo: { b: { foo: { c: { foo: null } } } } };
a.foo.b.foo.c.foo = a;
b.foo.b.foo.c.foo = b;

function eq(a, b, aStack, bStack) {
  if (typeof a == "number") {
    return a === b;
  }

  return deepEq(a, b);
}

function deepEq(a, b) {
  var keys = Object.keys(a);
  var length = keys.length;
  var key;

  while (length--) {
    key = keys[length];

    // 这是为了让你看到代码其实一直在执行
    console.log(a[key], b[key]);

    if (!eq(a[key], b[key])) return false;
  }

  return true;
}

eq(a, b);
```

可见其实上述代码就是一个死循环。

那么要如何解决这个问题呢？undercore 中是引入了两个数组，用于保存遍历过的值。只要判断源对象是否被遍历过即可脱离循环引用的陷阱中。

```js
let len = aStack.length;
while (len--) {
  if (aStack[len] === a) {
    return bStack[len] === b;
  }
}
aStack.push(a);
bStack.push(b);
```

# 最终版

```js
function isFunction(obj) {
  return Object.prototype.toString.call(obj) === "[object Function]";
}
function eq(a, b, aStack = [], bStack = []) {
  if (a === b) return a !== 0 || 1 / a === 1 / b; // 全等的情况(包括了正负0)
  if (a !== a) return b !== b; // 若a是NaN，则判断b是不是NaN
  if (a === null || b === null) return false; // 提前排除null
  // 排除一个是基本类型 另一个是函数 肯定不相等
  let typeA = typeof a;
  let typeB = typeof b;
  if (typeA !== "object" && typeA !== "function" && typeB !== "object")
    return false;
  if (typeB !== "object" && typeB !== "function" && typeA !== "object")
    return false;
  return deepEq(a, b, aStack, bStack); // 对象类型需要深度判断
}
function deepEq(a, b, aStack = [], bStack = []) {
  let ta = Object.prototype.toString.call(a);
  let tb = Object.prototype.toString.call(b);
  if (ta !== tb) return false; // 若对象类型不一样直接返回错误
  switch (ta) {
    case "[object RegExp]":
    case "[object String]":
      return a + "" === b + "";
    case "[object Number]":
      if (a !== a) return b !== b;
      return (+a === 0 && 1 / +a === 1 / +b) || +a === +b;
    case "[object Boolean]":
    case "[object Date]":
      return +a === +b;
  }
  // 构造函数实例
  if (ta !== "[object Array]") {
    // 排除两个函数的情况
    if (isFunction(a) || isFunction(b)) return false;
    let aCtor = a.constructor;
    let bCtor = b.constructor;
    // aCtor和bCtor都必须存在而且不相等
    if (aCtor !== bCtor && "constructor" in a && "constructor" in b)
      return false;
  }
  let len = aStack.length;
  while (len--) {
    if (aStack[len] === a) {
      return bStack[len] === b;
    }
  }
  aStack.push(a);
  bStack.push(b);
  // 数组
  if (ta === "[object Array]") {
    let length = a.length;
    if (length !== b.length) return false;
    for (let i = 0; i < length; i++) {
      if (a[i] !== b[i]) return false;
    }
    //
  } else {
    let keys = Object.keys(a);
    let length = keys.length;
    if (length !== Object.keys(b).length) return false;
    while (length--) {
      key = keys[length];
      if (!b.hasOwnProperty(key) || !eq(a[key], b[key], aStack, bStack))
        return false;
    }
  }
  // 遍历过了就pop
  aStack.pop();
  bStack.pop();
  return true;
}
console.log(eq(0, 0)); // true
console.log(eq(0, -0)); // false

console.log(eq(NaN, NaN)); // true
console.log(eq(Number(NaN), Number(NaN))); // true

console.log(eq("Curly", new String("Curly"))); // true

console.log(eq([1], [1])); // true
console.log(eq({ value: 1 }, { value: 1 })); // true
function Person(name) {
  this.name = name;
}
function Animal(name) {
  this.name = name;
}

var person = new Person("Kevin");
var animal = new Animal("Kevin");

var attrs = new Object();
attrs.name = "Bob";
console.log(eq(person, animal)); // false
console.log(eq(attrs, { name: "Bob" })); // true
var a, b;

a = { foo: { b: { foo: { c: { foo: null } } } } };
b = { foo: { b: { foo: { c: { foo: null } } } } };
a.foo.b.foo.c.foo = a;
b.foo.b.foo.c.foo = b;

console.log(eq(a, b)); // true
```
