---
title: 再战typescript(复习提升版)
date: 2021-8-9
lastUpdated: 2022-6-4
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - TypeScript
---

# 再战 TypeScript

本文是我的一个个人复习 typescript 的记录，因此有一些基础会省略，小白建议先了解一下 typescript 的基础再来看这篇文章~

## 基础类型篇

### Object 对象类型

#### Readonly

`Readonly` 个人觉得，可以类比`const`，即基本类型只读，对于引用类型，可以改变其属性的值而对其地址只读。除此之外，TypeScript 在检查两个类型是否兼容的时候并不会考虑`readonly`，`readonly`的属性可以通过别名修改

```ts
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```

#### 索引签名

```ts
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  name: string;
  // Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}
```

#### \* 接口继承和交叉类型

这两种对象拓展的方式最大的不同在于冲突如何处理！

```ts
interface Colorful {
  color: string;
}

interface ColorfulSub extends Colorful {
  color: number;
}

// Interface 'ColorfulSub' incorrectly extends interface 'Colorful'.
// Types of property 'color' are incompatible.
// Type 'number' is not assignable to type 'string'.

interface Colorful {
  color: string;
}

type ColorfulSub = Colorful & {
  color: number;
};
```

接口继承如果重写属性类型会报错，但交叉类型不会，最终`color`类型为 never (string 和 number 的交集)

#### ReadonlyArray 和 元组

- 语法：`ReadonlyArray<Type>` 或者 `readonly T[]`

需要注意的是，`Array`和`ReadonlyArray`并不能双向赋值

- 元组（Tuple Types）是另一种数组类型，明确知道数组长度而且每个位置元素都被确定下来了。比如`type Tuple = [string, number]`

当元组遇上剩余元素语法的时候，来看一下下面的例子：

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];

function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

- `readonly` 元组类型

```ts
type pair = readonly [string, number];
// 等同于 ['1',2] as const
```

### Function 函数类型

#### 函数类型表达式 Function Type Expression

```ts
type foo = (a: string) => void;
```

#### 调用签名 Call Signatures

JavaScript 的函数除了被调用，自己也是可以有属性值的。如果想要描述一个带属性的函数，我们就可以在**对象类型**中写一个**调用签名**。（这里很重要，这是一个对象类型，因此不用`=>`）

```ts
type DescribableFunc = {
  des: string;
  (num: number): number;
};
function doSomething(fn: DescribableFunc) {
  console.log(fn.description + " returned " + fn(6));
}
```

#### 构造签名 Construct Signatures

JavaScript 函数可以使用`new`来调用，此时函数为构造函数。那么我们可以使用构造签名来描述它：

```ts
type SomeConstructor = {
  new (s: string): SomeObject;
};
```

#### 函数泛型、约束

有时候我们想要关联某些值，如下面的例子，要求返回参数中`length`更长的那一个：

```ts
function longest<T extends { length: number }>(a: T, b: T) {
  return a.length > b.length ? a : b;
}
```

注意看一下下面一个使用泛型约束常出现的错误：

```ts
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
    // Type '{ length: number; }' is not assignable to type 'Type'.
    // '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
  }
}
```

你可能会不知道为什么会报错，返回的对象也有`length`属性呀。但是注意，Type 不只有`length`属性，我们很容易可以举一个反例：

```ts
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

#### 一个良好的泛型函数

- **类型参数下移**

```ts
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  // arr[0]有可能是对象中的key为0的属性值，无法推断
  return arr[0];
}

// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

我们来看上面两个函数，它们长的非常像，但第一个函数更好。因为第一个函数 typescript 可以推断出来返回类型是`number`，而第二个推断的是`any`。

这里的下移指的是如果超类中某个函数只与一个或少数几个子类有关，最好将其从超类中拿走，放到具体的子类中去。即父类只需要保留最少的公共部分即可。

- **使用更少的类型参数**

这是另一对长得很像的函数：

```ts
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

我们并不需要去毫无理由地去指定多一个类型参数`Func`，因为`Func`只与 Type 关联。

- **类型参数应该出现两次**

有时候我们可能会忘记一个函数其实并不需要泛型。但我们只需要记住，泛型是用来关联多个值的类型，如果它只在函数签名中出现了一次，那它就没有产生任何关联。

#### 函数重载

举个例子，我想要写一个返回`Date`类型的函数，它可以只接收一个时间戳或者一个年、月、日格式的参数：

```ts
function makeDate(timestamp: number): Date;
function makeDate(y: number, m: number, d: number): Date;
function makeDate(yOrTimestamp: number, m?: number, d?: number): Date {
  if (m !== undefined && d !== undefined) {
    return new Date(yOrTimestamp, m, d);
  } else {
    return new Date(yOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
// error : No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```

这里我们写了两个函数重载，被称为重载签名，最后是一个实现签名。但这个签名不能直接被调用。尽管我们在函数声明中，在一个必须参数后，声明了两个可选参数，它依然不能被传入两个参数进行调用，即**可选符失效**

再举个例子：

```ts
function fn(x: string): void;
function fn() {
  // ...
}
// Expected to be able to call with zero arguments
fn();
Expected 1 arguments, but got 0.
```

**实现签名对外界来说是不可见的**，因此一定要多个重载签名在实现签名之上。

#### 一个良好的函数重载

需要注意的是，TypeScript 只能一次使用一个函数重载来处理函数调用：

```ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);

No overload matches this call.
  Overload 1 of 2, '(s: string): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
      Type 'number[]' is not assignable to type 'string'.
  Overload 2 of 2, '(arr: any[]): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
      Type 'string' is not assignable to type 'any[]'.
```

> 尽可能使用**联合类型**去代替函数重载

#### 函数的可赋值性

当函数的返回类型是`void`的时候，下面这些情况是不会强制函数一定不能返回内容的：

```ts
type voidFunc = () => void;
const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
// push返回一个数字，但forEach方法期待一个返回void的函数，但这段代码不会报错
```

但如果是函数字面量返回`void`，则一定不能返回内容

### Enum 枚举类型

可以理解为一个双向的字典。

#### 数字枚举

```ts
enum Status {
  MASSAGE, // 对应 0
  TEACHER, // 对应 1
  BAG, // 对应 2
}
```

```ts
enum Statu {
  loading, // 0
  fulfilled = 100, // 100
  rejected, // 101
}
```

#### 字符串枚举以及异构枚举

字符串枚举最大的特点就是，**一定要有初始值 & 字符串枚举无反向映射**

异构枚举顾名思义，就是不同类型，即数字、字符串混合在一起的枚举。

> 不建议运用异构枚举，因为这对你想要做的目标并不清晰。

#### 计算&常量成员枚举

```ts
enum FileAccess {
  // constant members
  None, // 0
  Read = 1 << 1, // 2
  Write = 1 << 2, // 4
  ReadWrite = Read | Write, // 6
  // computed member
  G = "123".length, // 3
}
```

#### 联合枚举和枚举成员类型

当枚举成员都是字面量类型的时候，枚举就成了类型！

```ts
enum ShapeKind {
  Circle,
  Square,
}

interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}

let c: Circle = {
  kind: ShapeKind.Square,
  // Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'.
  radius: 100,
};
```

#### const 枚举

有的时候为了减少访问枚举值的代价，就可以使用 const 枚举。const 枚举成员不能是计算类型。

```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

> Enum 在编译之后是一个丰富的对象，但是 const Enum 编译之后是没有东西的，看下面这个例子：

```ts
const enum Status {
  success = 200,
  error = 500,
}
const res = Status.successs;
// 编译后
("use strict");
const res = 200; /* success */
```

#### 环境枚举

```js
enum a {
    A = 1,
    B,
    C = 2,
}
/* 1: "A"
2: "C"
A: 1
B: 2
C: 2 */
```

#### Enum vs Object

```js
const enum EDirection {
    Up,
    Down,
    Left,
    Right,
}

const ODirection = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3,
} as const;

EDirection.Up;
//         ^? 0

ODirection.Up;
//         ^? 0

// Using the enum as a parameter
function walk(dir: EDirection) { }

// It requires an extra line to pull out the values
type Direction = typeof ODirection[keyof typeof ODirection];
function run(dir: Direction) { }
```

### 字面量推断

当你初始化变量为一个对象的时候，TypeScript 会假设该对象属性的值未来会被修改。因此 typescript 只会推断类型。看下面的代码：

```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);

// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

解决方式也很容易想到，使用类型断言 as

或者用**const**，使用`as const`可以确保**所有属性都被赋予了字面量类型**，而不是简单的字符串类型：

```ts
const req = { url: "https://example.com", method: "GET" } as const;
```

### 关于接口与类的约束关系

> 类中的方法是定义的非常细节，但接口中的方法只定义类型

#### 接口 interface 和 type 的区别

- `interface`只能定义对象类型、而`type`可定义任何类型
- `interface`可以声明同样两个接口合并，而`type`不行，`type`是唯一的
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

## 类型收窄问题

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

### 可辩别联合

试想我们要一个处理`Shape:(Circle、Squares)`的函数，`Shape`定义如下：

```js
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

然后我们需要去获取其面积：

```js
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // Object is possibly 'undefined'.
  }
  else{
    ...
  }
}
```

因为我们一开始定义`radius`属性的时候设置了可选属性，但是我们需要在这里认为其一定存在，前后语义矛盾了！这里我们可以使用`!`非空断言符号来解决。

但这不是一个很好的方法，主要的问题在于`Shape`并不能根据`kind`的值来判断`radius`是否存在。因此我们只能将`Circle`和`Square`分开定义

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

此时`Shape`联合类型中每个类型都有`kind`属性，即可辩别联合，然后就可以根据其来对具体成员类型进行收窄

### 穷尽检查 (Exhaustiveness checking)

**`never`类型可以赋值给任何类型，但没有类型可以赋值给 never**，因此当 typescript 将所有类型可能都判断完毕后，就可以使用 never 来做一个穷尽检查：

```js
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
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
