---
title: 有关 ES6 的一些个人记录
date: 2021-8-9
lastUpdated: 2021-8-9
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

## 带标签的模板字符串

模板字符串前可以带一个函数，函数的第一个参数是**被插值分割出来的字符串数组**，其他参数对应**各个插值**。

```js
const name = "Herry";
const sex = "man";
tag = function (strings, name, sex) {
  return strings[0] + name + strings[1] + sex;
};
const res = tag`${name} is a ${sex}`;
console.log(res); // Herry is a man
```

## 对象中的计算属性名

在 ES6 中，我们可以将表达式作为对象的属性名：

```js
const person = {
  name: "too",
  sayHi: function () {
    console.log(this);
  },
  [Math.random()]: 123,
};
```

## 对象代理监听 Proxy------Vue3 的属性监听核心

```js
const handler = {
  get: function (obj, prop) {
    return prop in obj ? obj[prop] : 37;
  },
  set: function (obj, prop, value) {
    if (prop === "age") {
      if (!Number.isInteger(value)) {
        throw new TypeError("The age is not an integer");
      }
      if (value > 200) {
        throw new RangeError("The age seems invalid");
      }
    }
    // The default behavior to store the value
    obj[prop] = value;
    // 表示成功
    return true;
  },
};
const p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b); // 1, undefined
console.log("c" in p, p.c); // false, 37
person.age = 100;
console.log(person.age);
// 100
person.age = "young";
// 抛出异常: Uncaught TypeError: The age is not an integer
person.age = 300;
```

## 类的静态方法

`static` 定义的静态方法，直接在类的原型上使用，不用创建实例对象

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  static create(name) {
    return new Person(name);
  }
  sayHi() {
    console.log(this.name);
  }
}
const person = Person.create("xiaohong");
person.sayHi();
```

## Object 与 Map 的区别

ES6 中新增了一个 **Map** 数据结构，它真正意义上实现了任意类型键值对的存放。有人可能疑惑说，obj 对象本来就可以存放任意类型键值对呀，我们看下面的例子：

```js
let obj = {};
obj[() => "hello world"] = 123;
obj[{ a: 1 }] = 123;
console.log(Object.keys(obj)); // output: [ "() => 'hello world'", '[object Object]' ]
console.log(obj[{}]); // output: 123   这就离谱。。。。。
```

从这个例子我们可以看出，实际上对象将任意类型的键都转化成了字符串进行存放，这样就会造成问题。
而换成 Map 的话，就没有这种困扰了。

```js
let map = new Map();
let obj = { a: 1 };
map.set(() => "hello world", 123);
map.set(obj, 123);
for (let v of map) {
  console.log(v); // output： [ [Function (anonymous)], 123 ]，[ { a: 1 }, 123 ]
}
console.log(map.has(obj)); // true
```

## Set 数据结构

Set 类似于数组，但是只能存放不重复的值。而且 set 的方法跟数组也不一样。

```js
let set = new Set();
set.add(1); // 添加值
set.size; // 返回Set长度
set.has(1); // true
set.delete(1); // 删除指定值
set.clear(); // 清空
```

## Iterator 迭代器

es6 新增了一个可以基本遍历所有数据结构的方法： `for...of`
但是他不能遍历对象，原因是对象里面没有维护迭代器方法。

下面是一个自制迭代器接口的案例：

```js
const obj = {
  store: ["foo", "bar", "baz"],
  [Symbol.iterator]: function () {
    let index = 0;
    const _this = this;
    return {
      next: function () {
        const res = {
          value: _this.store[index],
          done: index >= _this.store.length,
        };
        index++;
        return res;
      },
    };
  },
};
for (let i of obj) {
  console.log(i); // foo bar baz
}
```

## for...in 和 for...of 的区别

为了搞清楚这个问题，我们先来举一个例子：

```js
let arr = [1, 2, 3];
Array.prototype.method = function () {
  console.log(1);
};

for (let i in arr) {
  console.log(arr[i]);
  console.log(typeof i);
}
/* 
output:
1
string
2
string
3
string
[Function (anonymous)]
string
 */
```

我们很清楚的可以看到，`for...in`不仅遍历了数组键，还遍历了包括原型链上的其他键；而且遍历的索引为`string`类型。因此不适合用来遍历数组。

对于`for...of`，我们上面也提到过，它可以遍历所有带有 Iterator 迭代器的数据结构，比如 Array，Set，Map，唯独不能遍历对象。
而且，`for...of`与`forEach`不同的是，它可以通过 break、return 退出循环。

**总结一句话：`for...in`用来遍历对象，`for...of`用来遍历数组！！**

## 生成器对象

yield 类似 return ，但需要 next()才会执行一步

```js
function* foo() {
  console.log(11);
  yield 100;
  console.log(22);
  yield 200;
  console.log(33);
  yield 300;
}
const generator = foo(); // 返回一个生成器对象
console.log(generator.next()); // 11 {value:100,done:false}
console.log(generator.next()); // 22 {value:200,done:false}
console.log(generator.next()); // 33 {value:300,done:false}
console.log(generator.next()); // 11 {value:undefined,done:true}
```

用 generator 来实现 iterator：

```js
const todos = {
  life: ["吃饭", "睡觉", "打豆豆"],
  learn: ["数学", "英语", "语文"],
  [Symbol.iterator]: function* () {
    const all = [...this.life, ...this.learn];
    for (let i of all) {
      yield i;
    }
  },
};
```
