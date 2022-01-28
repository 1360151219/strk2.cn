---
title: 有关typescript的一些个人记录
date: 2021-8-9
lastUpdated: 2021-8-9
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

## 关于函数参数为对象时的类型标注：

::: danger
错误版本如下：
:::

```ts
function add({ one: number, two: number }) {
  return one + two;
}
```

> 正确版本如下：即**标注的时候要以整个对象来进行标注**

```js
function add({ one, two }: { one: number, two: number }): number {
  return one + two;
}
```

## 关于接口与类的约束关系

> 类中的方法是定义的非常细节，但接口中的方法只定义类型

#### 接口 interface 和 type 的区别

- `interface`只能定义对象类型、而`type`可定义任何类型
- `interface`可以声明两个接口合并，而`type`不行
- `type`有类型推导

#### 类与接口的约束

**implements** 关键字，表示约束的意思，即 Teacher **类**必须满足 Person **接口**中定义的属性

```ts
class Teacher implements Person {}
```

#### 类之间的继承

```ts
class EnglishTeacher extends Teacher {}
```

> `super` 关键字表示继承父类的各种方法

#### 类的访问类型----3 个关键字

`public` **允许在类的内部和外部被调用. 默认类型**

`private` **只允许再类的内部被调用，外部不允许调用**

`protected` **允许在类内及继承的子类中使用**

## 关于联合类型中的类型保护问题

```js
interface Waiter {
  isTeaching: boolean;
  say: () => {};
}

interface Teacher {
  isTeaching: boolean;
  skill: () => {};
}

function judgeWho(person: Waiter | Teacher) {
  person.say();
}
```

上述例子，由于不知道 person 的类型是什么，无法判断 person 是否有 say 函数，因此 ts 会报错。

> 我们可以利用类型断言 ( **as** ) 来保护类型。例子如下：

```js
function judgeWho(person: Waiter | Teacher) {
 if (person.isTeaching) {
    (person as Teacher).skill();
  }else{
    (person as Waiter).say();
  }
}

```

> 或者利用 in 语法

```js
function judgeWho(person: Waiter | Teacher) {
  if ("skill" in person) {
    person.skill();
  } else {
    person.say();
  }
}
```

> 利用 typeof 来保护类型

```js
function add(first: string | number, second: string | number) {
  if (typeof first === "string" || typeof second === "string") {
    return `${first}${second}`;
  }
  return first + second;
}
```

> 利用 instanceof 来保护类型 (只能作用 类)

```js
class NumberObj {
  count: number;
}
function addObj(first: object | NumberObj, second: object | NumberObj) {
  if (first instanceof NumberObj && second instanceof NumberObj) {
    return first.count + second.count;
  }
  return 0;
}
```

## Enum 枚举类型

```js
enum Status {
  MASSAGE,// 对应 0
  TEACHER, // 对应 1
  BAG, // 对应 2
}
```

## 泛型的使用

```js
function identity<T>(arg: T): T {
  return arg;
}
let output = identity < string > "myString"; // type of output will be 'string'
// 类型推断
let output = identity("myString"); // type of output will be 'string'
```

> 数组中泛型的使用

如果传递过来的值要求是数字，如何用泛型进行定义那两种方法:

- 第一种是直接使用[]。 `number[]`
- 第二种是使用 **Array<泛型>**。形式不一样，其他的都一样。 `Array<number>` `Promise<void>`

> 多个泛型的定义

```js
function join<T, P>(first: T, second: P) {
  return `${first}${second}`;
}
join < number, string > (1, "2");
join(1, "2"); // 类型推断
```

> 类中的泛型

看下面的案例：

```js
interface Person {
    name: string
}
// 这里不能用implements 因为是接口间继承
class Persons<T extends Person>{
    constructor(private persons: T[]) {
        this.persons = persons;
    }
    getPersonName(index: number):string {
        return this.persons[index].name
    }
}

let arr = new Persons([
    {name:'xiaohong'},
    {name:'xiaolan'}
])
```
