---
title: 关于Vue + TypeScript的类组件声明写法
date: 2021-8-29
lastUpdated: 2021-8-29
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - Vue
---

在做项目的过程中，我曾经遇到过一些很奇怪的问题：

- 按照教程引入 vuetify 组件，但是却不生效。
- btn 的 disabled 属性绑定变量后，变量状态改变但按钮状态不变。

这些问题我偶然在别人的聊天中找到答案：关于 **@Component**

那么，这个东西是什么呢？装饰器？声明组件的语法？于是我去查了一下明确了答案。

## @Component

使用@Component 注解，将类转化为 Vue 的组件。**只有使用后，类中声明的属性或者方法，才能被响应式监控。**

> 切忌这样使用： `@Component({})` 这样是不对的！！

需要注意的是，如果变量属性未定义初始值(undefined)，则类属性将不会是相应式的，这意味着不会检测到属性的更改。

还有一个问题，就是在引入 Vue 相关组件，如(Vuelidate,Vue router)的时候，一定要用`Component.registerHooks`注册一下。另外写在一个文件里。

```js
// class-component-hooks.js
import Component from "vue-class-component";

// Register the router hooks with their names
Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate",
]);
```

## 关于构造函数

**应当总是使用声明周期钩子而非使用构造函数**。

由于原始的构造函数已经被使用来收集初始组件的 `data`数据。因此，建议不要自行使用构造函数。

```js
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Posts extends Vue {
  posts = [];

  // DO NOT do this
  constructor() {
    fetch("/posts.json")
      .then((res) => res.json())
      .then((posts) => {
        this.posts = posts;
      });
  }
}
```

上面的代码打算在组件初始化时获取 post 列表，但是由于 Vue 类组件的工作方式，fetch 过程将被调用两次。
建议使用组件声明周期函数，如 creatd（） 而非构造函数（constructor）。

## TypeScript 相关

**Vuex 的用法：**

```js
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters, mapActions } from 'vuex'

// Interface of post
import { Post } from './post'

@Component({
  computed: mapGetters([
    'posts'
  ]),

  methods: mapActions([
    'fetchPosts'
  ])
})
export default class Posts extends Vue {
  // Declare mapped getters and actions on type level.
  // You may need to add `!` after the property name
  // to avoid compilation error (definite assignment assertion).

  // Type the mapped posts getter.
  posts!: Post[]

  // Type the mapped fetchPosts action.
  fetchPosts!: () => Promise<void>

  mounted() {
    // Use the mapped getter and action.
    this.fetchPosts().then(() => {
      console.log(this.posts)
    })
  }
}
```

**\$ref 的类型声明**

```js
$refs!: {
    input: HTMLInputElement
  }
```

## 关于修饰符

`@Prop({default:balabala})`
