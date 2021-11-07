---
title: js深入系列：深入原型以及原型链
date: 2021-10-19
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

> 以下大多数内容最初灵感启发来自于[冴羽博客](https://github.com/mqyqingfeng/Blog)

首先，深入了解过 JavaScript 的人都应该知道构造函数、原型以及实例之间的简单关系，如下图:

![](../imgs/Prototype/prototype-1.png)

即：

```js
function Person() {}
let person = new Person();
console.log(person._proto_ === Person.prototype); // true
console.log(Person === Person.prototype.constructor); // true
console.log(Object.getPrototypeOf(person) === Person.prototype); // true
```

### 实例和原型

---

当我们去读取实例的属性的时候，如果找不到，就会到该实例的原型上去找属性，如果还找不到，就去找原型的原型。一直到找到了为止。

```js
function Person() {}

Person.prototype.name = "Kevin";

var person = new Person();

person.name = "Daisy";
console.log(person.name); // Daisy

delete person.name;
console.log(person.name); // Kevin
```

### 原型的原型

我们说过，这个实例的原型实质上就是一个对象,因此原型的原型指向 Object 构造函数的 prototype，所以我们可以再完善一下关系图：

![](../imgs/Prototype/prototype-2.png)

### 原型链

那么这个 Object.prototype 的原型呢？我们可以测试一下：

```js
console.log(Object.prototype.__proto__ === null); // true
```

我们得知，Object 的 prototype 没有原型，所以查找属性到这里就可以停止了。图中蓝色的线其实就是一条原型链啦。

![](../imgs/Prototype/prototype-3.png)

### 补充

---

**constructor**

```js
function Person() {}
var person = new Person();
console.log(person.constructor === Person); // true
```

由上面这个例子我们可以知道，`person`上本来没有`constructor`属性，所以就到了`person._proto_`上去查找。

\***\*proto\*\***

其次是 `__proto__` ，绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 `Person.prototype` 中，实际上，它是来自于 `Object.prototype` ，与其说是一个属性，不如说是一个 getter/setter，当使用 obj.**proto** 时，可以理解成返回了 Object.getPrototypeOf(obj)。
