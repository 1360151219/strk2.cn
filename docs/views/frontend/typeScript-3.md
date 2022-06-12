---
title: 再战typescript(进阶拓展)----三
date: 2022-6-10
lastUpdated: 2022-6-10
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - TypeScript
---

# 再战 TypeScript

本文是根据[冴羽博客](https://github.com/mqyqingfeng/Blog/issues/226)整理出来的学习记录。

## TypeScript 的工具类型

### `Partial<Type>`

用于构造一个`Type`下面所有属性都是可选的类型。

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### `Required<Type>`

顾名思义，与`Partial`相反。

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

### `Readonly<T>`

用于构造一个`Type`下面所有属性都是只读类型的类型。

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### `Record<Keys, Type>`

用于构造一个对象类型，其所有的键值都是`Keys`，所有 value 都是`Type`，即将 keys 映射到了 Type 身上

```ts
type Record<Keys extends string | symbol | number, Type> = {
  [K in Keys]: Type;
};

interface Person {
  name: string;
  age: number;
}

type Class = Record<"teacher" | "student", Person>;
/* 
type Class = {
    teacher: Person;
    student: Person;
} 
*/
type Class = Record<string, Person>;
/* type Class = {
    [x: string]: Person;
} */
```

### `Pick<Type, Keys>`

用于从一个对象类型中去挑出一些属性`Keys`(这里一定要是字符串字面量或者联合类型，原因看下面代码就知道了)

```ts
type Pick<Type, Keys extends keyof Type> = {
  [K in Keys]: Type[Keys];
};
```

### `Omit<Type,Keys>`

与`Pick`相反，表示过滤掉一些属性`Keys`

```ts
type Omit<Type, Keys extends string | number | symbol> = {
  [K in Exclude<keyof Type, Keys>]: Type[K];
};
```

> 以上介绍的所有工具类都是返回一个对象类型，以下的工具类型则是会返回任何类型~~，即作为更为泛用基础的工具类型

### `Exclude<T,U>` 和 `Extract<T,U>`

```ts
type Exclude<T, U> = T extends U ? never : T;

type Extract<T, U> = T extends U ? T : never;
```

### `NonNullable<T>`

顾名思义，去掉类型中所有`null`、`undefined`的类型

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

### `Parameters<Type>`

用于根据传入的`Type`函数类型，构造出其参数的元组类型。

```ts
type Parameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer K
) => any
  ? K
  : // 这里直接K，因为infer推断出的就是元组类型
    never;
```

### `ReturnType<T>`

用于根据传入的函数类型，返回其返回值类型。**这个也非常常用**

```ts
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;
```
