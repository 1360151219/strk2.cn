---
title: JavaScript深入之各种继承方式
date: 2021-11-11
lastUpdated: 2021-11-11
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

# JavaScript 深入之各种继承方式

这篇文章依旧是参考[冴羽博客](https://github.com/mqyqingfeng/Blog)系列而出的，但是这是作者本人根据红宝书第 4 版第 8 章的内容做的一些总结笔记~。

## 原型链继承

```js
function SuperType() {
  this.property = true;
}
SuperType.prototype.getSuperValue = function () {
  console.log(this.property);
};
function SubType() {
  this.subPropertype = false;
}
// 通过原型链继承
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function () {
  console.log(this.subPropertype);
};
SubType.prototype.getSuperValue = function () {
  console.log(this.property + " in SubType");
};
let instance = new SubType();
instance.getSuperValue(); // true in SubType
instance.getSubValue(); // false
```

这种方法将`SubType`的原型指向了`SuperType`的实例，这样不仅使得`SubType`继承了`SuperType`的方法和属性，还能与其原型挂上了钩。

**但要注意的是，这里实现多态的时候，必须在原型赋值给父类实例之后才可以定义新属性和方法，而且不能用对象字面量方式重写原型。**

但这个方法有一个缺点：因为子类原型指向父类的实例，因此父类属性也会在子类实例上共享。如下：

```js
function SuperType() {
  this.colors = ["yello"];
}

function SubType() {}
// 通过原型链继承
SubType.prototype = new SuperType();

let instance1 = new SubType();
let instance2 = new SubType();

instance1.colors.push("black");
instance2.colors.push("red");
console.log(instance1.colors, instance2.colors); //['yello', 'black', 'red']['yello', 'black', 'red']
```

除此之外，子类实例化的时候不能给父类的构造函数传参。

## 借用构造函数继承 / 经典继承

顾名思义，借用父类的构造函数实现继承

```js
function SuperType() {
  this.colors = ["yello"];
}
SuperType.prototype.getColors = function () {
  console.log(this.colors);
};

function SubType() {
  SuperType.call(this);
}
let instance1 = new SubType();
let instance2 = new SubType();

instance1.colors.push("black");
instance2.colors.push("red");
console.log(instance1.colors, instance2.colors); //[ 'yello', 'black' ] [ 'yello', 'red' ]
instance1.getColors(); // TypeError: instance1.getColors is not a function
```

通过改变 this 指向，使得父类构造函数在子类的实例的上下文中执行了，也就是说，在新的子类实例上执行了父类的构造函数，因此子类实例上继承的属性都是独立的。

缺点：因为所有方法都是在构造函数中定义，因此不能重用。每次调用构造函数都得重新创建一遍方法。而且不能使用父类原型上的方法。因此这种方法不能直接用。

## 组合继承

结合了上述两种方式的优点，是目前 JavaScript 使用最多的继承模式。且保留了`instanceof`、`isPrototypeOf`方法识别合成对象的能力。

```js
function SuperType() {
  this.colors = ["yello"];
}
SuperType.prototype.getColors = function () {
  console.log(this.colors);
};

function SubType() {
  SuperType.call(this);
}
// 通过原型链继承
SubType.prototype = new SuperType();

let instance1 = new SubType();
let instance2 = new SubType();

instance1.colors.push("black");
instance2.colors.push("red");
instance1.getColors(); // ['yello', 'black']
instance2.getColors(); // ['yello', 'red']
```

## 原型式继承

这种方法的出发点是即使不自定义类型也可以通过原型实现对象间信息共享。

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

就是 ES5 `Object.create` 的模拟实现，将传入的对象作为创建的对象的原型。

缺点也很明显，和原型链继承一样，对于引用类型的属性会在所有实例间共享。对于基础类型不会共享是因为给了特定的实例添加上了属性而不是改变原型上的属性。

## 寄生式继承

这个方法在上述方法的基础上，增强对象并返回对象。

```js
function createAnother(original) {
  let clone = object(original);
  clone.sayHi = function () {
    console.log("Hi");
  };
  return clone;
}
```

这个方法会导致函数难以复用。

## 寄生式组合继承

其实组合继承存在效率问题，因为父类构造函数始终会被调用两次，一次是在创建子类原型的时候调用，一次是在子类构造函数上调用的。

避免这种情况的思路是，不通过调用父类构造函数来给子类原型赋值，而是获取父类原型的一个副本。寄生式组合继承可以算是引用类型继承的最佳模式。

```js
function inheritPrototype(sub,super){
    let prototype=object(super)
    prototype.constructor=sub
    sub.prototype=prototype
}
```

## ES6 Class 语法糖

首先类表达式有一些特点：

- 类表达式在它们被求值前不能被引用，且类定义没有声明提升。
- 类受块作用域限制。

> Class 其实就是一个引用 js 构造函数的语法糖，因此如果类的构造函数中返回一个对象，那么也会返回这个对象。其他特性也跟普通构造函数一样。

**Class 继承**

ES 类支持单继承，使用`extends`关键字可以继承任何具有[Constructor]和原型的对象。(保持向后兼容)

子类可以通过`super`来引用父类原型。还可以通过`super()`来调用父类构造函数。

注意事项：

- `super`只能在子类中使用，而且仅限于**类构造函数、实例方法和静态方法**内部。
- 不能单独使用`super`关键字，要么用于构造函数，要么引用静态方法。

```js
class Vehicle {}
class Bus extends Vehicle {
  constructor(){
    console.log(super);// SyntaxError: 'super' keyword unexpected here
  }
}
```

- 调用`super()`如同调用构造函数，并将返回实例赋值给 this(如果有参数就传入)

- 如果没有定义子类构造函数，在实例化子类的时候会默认调用`super()`，而且会自动传入参数。

- 在子类构造函数中，不能在调用`super()`之前使用 this

- 若子类有显式的构造函数，则必须调用`super()`或者返回一个对象。

**抽象基类**

有时候需要定义一个类，它可以被其他类继承但本身不需要被实例化。我们可以通过`new.target`来实现。

`new.target`保存通过 new 关键字调用的类或函数。下面例子是通过使用`new.target`来阻止对抽象基类的实例化。

```js
class Vehicle {
  constructor() {
    console.log(new.target);
    if (new.target === Vehicle) {
      throw new Error("Vehicle cannot be directly instantiated");
    }
  }
}
class Bus extends Vehicle {}
new Bus(); // [class Bus extends Vehicle]
new Vehicle(); // [class Vehicle]  Error: Vehicle cannot be directly instantiated
```

> 补充：ES5 中判断构造函数是否被 new 创建，在 vue 源码中是这样做的：`if(!this instanceof Vue) throw new Error('balabala')`

或者还可以实现要求子类必须定义某个方法。

```js
class Vehicle {
  constructor() {
    if (new.target === Vehicle) {
      throw new Error("Vehicle cannot be directly instantiated");
    }
    if (!this.foo) {
      throw new Error("Inheriting class must define foo()");
    }
    console.log("success");
  }
}
class Bus extends Vehicle {}
class Van extends Vehicle {
  foo() {}
}
new Van(); // success
new Vehicle(); // Error: Vehicle cannot be directly instantiated
new Bus(); // Error: Inheriting class must define foo()
```

**类的混入**

这里首先说明一下，组合胜过继承。但是了解一下也是对自己思维有帮助的噢。我们可以借助类表达式实现：

```js
class Vehicle {}
let FooMixin = (superClass) =>
  class extends superClass {
    foo() {
      console.log("foo");
    }
  };
let BuzMixin = (superClass) =>
  class extends superClass {
    buz() {
      console.log("buz");
    }
  };
class Bus extends FooMixin(BuzMixin(Vehicle)) {}
let bus = new Bus();
bus.foo();
bus.buz();
```

这样太冗杂了，我们可以设计一个辅助函数：

```js
function mix(superClass, ...mixs) {
  return mixs.reduce((accumulator, cur) => cur(accumulator), superClass);
}
class Bus extends min(Vehicle, FooMixin, BuzMixin) {}
```
