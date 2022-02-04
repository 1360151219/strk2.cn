---
title: JavaScript深入之创建对象的方式
date: 2021-11-8
lastUpdated: 2021-11-8
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

这篇文章依旧是参考[冴羽博客](https://github.com/mqyqingfeng/Blog)系列而出的，但是这是作者本人根据红宝书第 3 版第 6 章的内容做的一些总结笔记~。

## 工厂模式

工厂模式顾名思义，类似一个工厂源源不断产出类似的产品一样。举个栗子：

```js
function createPerson(name, age, job) {
  let o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    console.log(this.name);
  };
  return o;
}
let person = createPerson("Nicholas", 29, "Software Engineer");
```

**缺点**：无法识别新创建的对象的类型。

## 构造函数模式

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = sayName;
}
function sayName() {
  console.log(this.name);
}
let person = new Person("Nicholas", 29, "Software Engineer");
```

**优点**：解决了实例类型的问题。我们可以通过`instanceof`来测试一下：

```js
console.log(person instanceof Person); // true
console.log(person instanceof Object); // true
```

**缺点**：这里`sayName()`方法定义在了构造函数外部，虽然解决了其定义的方法在每个实例都会被创建一遍的问题，但是这也带来了一个新问题：这个函数实际上只能在一个对象上调用，这导致了全局作用域被搞乱了。

> 这一段我不是非常理解，实际上我自己测试的时候函数调用是没有毛病的

```js
let person1 = new Person("Nichola", 28, "Software Engineer");
let person2 = new Person("Nicholas", 29, "Software Engineer");
person2.sayName(); // Nicholas
person1.sayName(); // Nichola
console.log(person2.sayName === person1.sayName); // true
```

## 原型模式

> 原型：包含应该由特定引用类型的实例共享的属性和方法

> `hasOwnProperty(key)`可以清楚看到访问属性是实例上属性还是原型上属性。来自实例则返回 true

```js
function Person(name) {}

Person.prototype.name = "keivn";
Person.prototype.getName = function () {
  console.log(this.name);
};

var person1 = new Person();
```

> 注意，不要把一个对象赋值给原型，不然会因此丧失`constructor`属性

**优点**：所有方法不会重新被创建
**缺点**：不能初始化参数；所有的属性和方法会在实例上共享。

## 组合模式

构造函数与原型模式相结合。这种集两者之长的模式是目前使用**最广泛**的一种方式。

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}
Person.prototype = {
  constructor: Person,
  sayName: function () {
    console.log(this.name);
  },
};

let person = new Person("Nicholas", 29, "Software Engineer");
```

此时实例对象的 name、age、job 是不一样的，独立的，而 sayName 方法是共享的。
**缺点**：构造函数和原型分开，没有封装性。

## 动态原型模式

这种模式很好的解决了组合模式的缺点。这里的新增代码只会在第一次调用构造函数的时候执行，此后原型完成初始化会自动反应在所有实例对象上。

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  //
  if (typeof this.sayName !== "function") {
    Person.prototype.sayName = function () {
      console.log(this.name);
    };
  }
}

let person = new Person("Nicholas", 29, "Software Engineer");
```

这里一定要**注意**，在创建了实例对象之后，不能使用字面量形式覆盖 prototype，否则会切断新原型和现有实例的关系。因为覆盖 prototype 并不会改变实例原型的引用，实例对象指向旧的原型对象。

## 寄生构造函数模式

```js
function Person(name) {
  var o = new Object();
  o.name = name;
  o.getName = function () {
    console.log(this.name);
  };

  return o;
}

var person1 = new Person("kevin");
console.log(person1 instanceof Person); // false
console.log(person1 instanceof Object); // true
```

书上说，在前述几种模式都不适用的情况下可以使用这种模式。但其实我认为这种模式可以尽量不用吧，跟工厂模式没啥区别，就是多了个 new，而且也残留着无法识别实例对象的问题。

但这种模式可以在特殊情况下使用，比如我们想创建一个具有额外方法的数组但又不想修改 Array 原型。

```js
function SpecialArray() {
  var values = new Array();

  for (var i = 0, len = arguments.length; i < len; i++) {
    values.push(arguments[i]);
  }

  values.toPipedString = function () {
    return this.join("|");
  };
  return values;
}

var colors = new SpecialArray("red", "blue", "green");
var colors2 = SpecialArray("red2", "blue2", "green2");

console.log(colors);
console.log(colors.toPipedString()); // red|blue|green

console.log(colors2);
console.log(colors2.toPipedString()); // red2|blue2|green2
```

## 稳妥构造函数模式

```js
function Person(name) {
  var o = new Object();
  o.getName = function () {
    console.log(name);
  };

  return o;
}
```

所谓的**稳妥对象**指的是没有公共属性，其方法不引用 this 的对象。适用于安全环境中（无 new、this）。
这种模式创建的对象除了使用 getName 方法以外没有其他办法访问 name 的值。

同样没有对象识别。
