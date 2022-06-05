---
title: 再战typescript(内置操作符)----二
date: 2022-6-5
lastUpdated: 2022-6-5
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - TypeScript
---

# 再战 TypeScript

本文是根据[冴羽博客](https://github.com/mqyqingfeng/Blog/issues/226)整理出来的学习记录。

## `keyof` 类型操作符

### 对象类型

对一个**对象类型**使用`keyof`，返回该对象属性名组成的一个**字符串**|**数字字面量**|**Symbol** 的联合：

```ts
type Point = { x: number; y: number };
type P = keyof Point; // 'x'|'y'

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// type M = string | number
```

注意`M`返回`string|number`，因为 JavaScript 对象的属性名会被强制转换成字符串类型。

那么什么时候返回数字字面量联合呢？

```ts
const NumbericObj = {
  [1]: "a",
  [2]: "b",
};
type P = keyof typeof NumbericObj; // 1|2
```

> 注意 keyof 后面必须跟一个类型，就上面的例子而言，这种写法是错误的`keyof NumbericObj`

其实 typeScript 也支持`Symbol`类型

```ts
const sym1 = Symbol();
const sym2 = Symbol();
const sym3 = Symbol();

const symbolToNumberMap = {
  [sym1]: 1,
  [sym2]: 2,
  [sym3]: 3,
};

type KS = keyof typeof symbolToNumberMap; // typeof sym1 | typeof sym2 | typeof sym3
```

因此我们知道，keyof 返回的类型只可能是`string|number|symbol`

```ts
function useKey<T, K extends keyof T>(o: T, k: K) {
  var name: string = k;
  // Type 'string | number | symbol' is not assignable to type 'string'.
}
```

如果我们确保只是用字符串的属性名，可以使用`Extract`工具符

> `type Extract<T, U> = T extends U ? T : never`

```ts
function useKey<T, K extends Extract<keyof T, string>>(o: T, k: K) {
  var name: string = k;
}

// 即 string|number|symbol extends string => string|never|never
```

### 类和接口

```ts
class Person {
  name: "Bob";
  [1]: "Alice";
}
type r = keyof Person; // name | 1
```

接口类似。这里要注意的是，我们可以直接在`keyof`后面跟一个类声明和接口，但并不能直接跟具体的对象

## `typeof` 类型操作符

typeScript 中的`typeof`和 JavaScript 中的不一样，这里是用于获取数据类型的

```ts
typeof "hello"; // string
```

但这并不是它的主要用途，它需要搭配上其他类型操作符才能发挥出它的作用，如`returnType<T>`

```ts
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
/// type K = boolean
```

但我们不能直接对一个函数使用`ReturnType`，因此需要`typeof`先获取具体函数的类型：

```ts
function foo() {
  return "foo";
}

type s = ReturnType<typeof foo>;
```

除了 typeof 可以获取类型以外，还可以使用**索引访问类型**的方式

```ts
type Person = {
  name: string;
  age: number;
};
Person["age"]; // number
```

注意这里的索引必须是**类型**，即你要是创建一个`let a="age"`变量，通过变量去访问是错误的。

这里有一个实战案例，假设有这样一个业务场景，一个页面要用在不同的 APP 里，比如淘宝、天猫、支付宝，根据所在 APP 的不同，调用的底层 API 会不同，我们可能会这样写：

```ts
const APP = ["TaoBao", "Tmall", "Alipay"];

function getPhoto(app: string) {
  // ...
}

getPhoto("TaoBao"); // ok
getPhoto("whatever"); // ok
```

现在我需要约束 app 只能是 APP 数组中的字面量联合，就可以这样写：

```ts
const APP = ["TaoBao", "Tmall", "Alipay"] as const;

function getPhoto(app: typeof APP[number]) {
  // ...
}

getPhoto("TaoBao"); // ok
getPhoto("whatever"); // ok
```

## 条件类型 Conditional Types

typeScript 中的条件类型写法有点类似于三目运算符：

```ts
Type extends checkType ? tureType : falseType
```

### 当条件类型遇上泛型

当条件类型遇上泛型的时候就会发挥出它的十分作用了。

举个例子：

```ts
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

这里使用函数重载，描述了`createLabel`根据输入值的不同和返回不同的东西，十分繁琐，其实我们可以直接把逻辑写在类型中：

```ts
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

const createLabel = <T extends number | string>(nameOrId: T): NameOrId<T> => {
  if (typeof nameOrId === "number") {
    return { id: 1 } as NameOrId<T>;
  } else if (typeof nameOrId === "string") {
    return { name: "1" } as NameOrId<T>;
  }
};
// 注意，这里nameOrId<string | number> 会被认为是 nameOrId<string> | nameOrId<number>，因此需要类型断言去约束一下。
```

### 条件类型约束

条件类型结合类型收窄可以为我们提供一个更为具体的类型。现在我们想要写一个获取数组元素的类型的类型：

```ts
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>;
type Num = Flatten<Array<number>>;
type Tuple = Flatten<[string, number, boolean]>;
// type Tuple = string | number | boolean
```

上面是我们利用了索引访问类型将数组元素类型*手动*的获取，但是 typeScript 中还提供了`infer`关键词，可以从条件类型中推断类型，然后在`true`分支中引用该推断结果，这样我们不用再苦心思考如何从我们感兴趣的类型结构中挖出我们想要的子类型：

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

有了`infer`，我们可以写一些有用的**类型帮助别名**，比如我们写一个获取函数返回类型：

```ts
type GetReturnType<Type> = Type extends (...args: any[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;
// type Num = number

type Str = GetReturnType<(x: string) => string>;
// type Str = string

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
// type Bools = boolean[]
```

### 分发条件类型 Distributive Conditional Types

当在泛型中使用条件类型时，若传入一个联合类型，就会变成**分发**的，举个例子：

```ts
type ToArray<T> = T extends any ? T[] : never;

let a: ToArray<number>;
let b: ToArray<never>;
let c: ToArray<number | string | boolean>;
// let c: string[] | number[] | false[] | true[]
```

这是我们通常所要期望的行为，如果你要避免这种行为，你可以用方括号包裹`extends`关键字的每一部分。

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
// type StrArrOrNumArr = (string | number)[]
```
