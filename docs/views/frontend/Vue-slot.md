---
title: 关于Vue插槽的深入学习
date: 2021-12-7
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - Vue
---

## 引子

最近在造一个瀑布流组件的轮子，遇到一个场景：我需要判断我给的插槽有没有被使用，若没有的话，我需要给一个默认的元素占位。

于是我自己实验了一下，发现只有下面情况是成功判断的：

```js
// 子组件
<slot name="loading"></slot>

console.log(this.$slots.loading)// 有东西
// 父组件
<Component>
  <template slot="loading">loading</template>
</Component>
```

但例如使用`#loading`或者`v-slot:loading`的时候却显示`undefined`。这个问题我还没找出答案。

> 题外话，以上写法是我参照别人组件的，我觉得这其实直接写进 slot 中作为后备内容不就没有这么多事情了吗----

于是我想仔细读一下 Vue 关于插槽的文档。

## 插槽的编译作用域

这里简单来说就是不能通过插槽来进行父子组件的传值。引用一下官方的话：

> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

## 插槽的后备内容

后备内容就是若没有使用插槽的话，会显示默认的内容。
官方的例子：

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

## 具名插槽

这里我就只讲一些细节吧：

- `v-slot:xxx`和`#xxx`只能用于组件中或者`template`中
- 一个不带 name 的 `<slot>` 出口会带有隐含的名字 **default**。

## \*作用域插槽

让插槽内容能够访问到子组件作用域内的数据是很有用的。例如有一个这样的组件`<current-user>`：

```html
<span>
  <slot>{{ user.lastName }}</slot>
</span>
```

我们可能想换掉备用内容，用名而非姓来显示。如下：

```html
<current-user> {{ user.firstName }} </current-user>
```

正常来说上面写法是不生效的，因为在父组件中没有`user`

为了让 user 在父级的插槽内容中可用，我们可以将 user 作为 <slot> 元素的一个 attribute 绑定上去，同时在父级作用域中，我们可以使用带值的 v-slot 来定义我们提供的插槽 prop 的名字：

```html
// 子组件
<span>
  <slot v-bind:user="user"> {{ user.lastName }} </slot>
</span>
// 父组件
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

### 独占默认插槽的缩写语法

在上述情况下，当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上：

```html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

甚至能直接省略成`v-slot='slotProps'`

> 注意默认插槽的缩写语法不能和具名插槽混用，因为它会导致作用域不明确：

## 动态插槽名

```html
<template v-slot:[dynamicSlotName]> ... </template>
```

