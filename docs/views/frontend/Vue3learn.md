---
title: Vue 3.x 的个人学习记录
date: 2021-12-24
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - Vue
---

Vue 3 自发布以来也接近一年多时间了吧，最近看到很多关于 Vue 3 的博客文章，而且 Vue 3 也慢慢的被人们关注起来，也好像能够使用来项目中去了。于是我也打算开始学习一下 Vue 3！！

## 组合式 API

组合式 API 用于解决一个大项目中，很多的 data 以及 methods 同时放在一个单文件组件中使得逻辑关注点混乱以及代码变得非常冗长的问题。主要是为了提高代码可读性以及可维护性。

### setup

> 一个组件选项，在组件被创建之前，`props` 被解析之后执行。它是组合式 API 的**入口**。

参数是：`(props , context)`.

注意这里`props`包含子组件显式声明的所有 props，无论父组件有没有传值，若没有传值则 undefined

#### 生命周期钩子

**选项式 API 的生命周期选项和组合式 API 之间的映射**

- `beforeCreate` × 使用 `setup()`

- `created` × 使用 `setup()`

- `beforeMount` -> `onBeforeMount`

- `mounted` -> `onMounted`

- `beforeUpdate` -> `onBeforeUpdate`

- `updated` -> `onUpdated`

- `beforeUnmount` -> `onBeforeUnmount`

- `unmounted` -> `onUnmounted`

- `errorCaptured` -> `onErrorCaptured`

- `renderTracked` -> `onRenderTracked`

- `renderTriggered` -> `onRenderTriggered`

- `activated` -> `onActivated`

- `deactivated` -> `onDeactivated`

### setup 语法糖

> 注意，使用这个语法糖在 Vetur 插件下会爆红！可以换成 Vue 3 插件 Volar

#### 基本语法

```vue
<script setup>
console.log("hello script setup");
</script>
```

> 里面的代码会被编译成组件 setup() 函数的内容。这意味着与普通的 <script> 只在组件被首次引入的时候执行一次不同，**<script setup> 中的代码会在每次组件实例被创建的时候执行。**

使用这个`<script setup>`语法糖的时候，所有的 data、methods...，包括引用的方法，都可以直接用于模板中。这就类似 Vue 2 中类组件形式的写法了。我觉得这个非常方便简洁！！

```vue
<template>
  <div>
    <h1>{{ msg }}</h1>
    <button @click="handleClick">msg change</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
let msg = ref("I am a msg"); // 响应式添加
function handleClick() {
  msg.value = "change Msg";
  //   console.log(msg);
}
</script>
```

注意，这里必须要使用`ref`、`reative`声明变量才能使其变为响应式。

**使用组件**

使用组件也是直接在模板使用组件名即可：

```vue
<script setup>
import MyComponent from "./MyComponent.vue";
</script>

<template>
  <MyComponent />
</template>
```

**递归组件**

一个单文件组件可以通过它的文件名被其自己所引用。例如：名为 `FooBar.vue` 的组件可以在其模板中用 `<FooBar/>` 引用它自己。不过这种语法优先级低于用 import 引入的组件

**命名空间组件**

引用 官方 的话：(我还没用过- -)

可以使用带点的组件标记，例如 <Foo.Bar> 来引用嵌套在对象属性中的组件。这在需要从单个文件中导入多个组件的时候非常有用：

```vue
<script setup>
import * as Form from "./form-components";
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

#### defineProps 和 defineEmits 父子组件通信

在 `<script setup>` 中必须使用 `defineProps` 和 `defineEmits` API 来声明 `props` 和 `emits` ，它们具备完整的类型推断并且在 `<script setup>` 中是直接可用的，不需要再进行引用：

> 注： 我试了一下其实不可以直接用，必须要从 vue 中引入，我也不知道为什么反正不引用的话会一直报错

```vue
// 子组件
<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  text: {
    type: String,
    default: "text here please!",
  },
});
</script>
<template>
  <div>{{ text }}</div>
</template>

// 父组件
<TextItem text="here is Parent Component"></TextItem>
```

下面是 defineEmits 的例子：

```vue
// 子组件
<script setup lang="ts">
import { defineEmits } from "vue";
const emit = defineEmits(["textImport"]);
emit("textImport");
</script>
<template>
  <div>{{ text }}</div>
</template>

// 父组件
<TextItem @textImport="handleImport"></TextItem>
```

#### defineExpose

使用 `<script setup>` 的组件是**默认封闭**的，其他组件无法通过 `ref` 等方法获取该组件的实例中的属性。如果要获取，则必须通过`defineExpose`暴露出去。

```vue
// 子组件
<script setup lang="ts">
import { defineExpose } from "vue";
// 只有通过defineExpost 外部组件才可以访问暴漏变量
const a = ref(0);
const b = 1;
defineExpose({
  a,
  b,
});
</script>
<template>
  <div>{{ text }}</div>
</template>

// 父组件
<script setup lang="ts">
import { onMounted, ref } from "vue";
import TextItem from "./TextItem.vue";
const textItem = ref(null);
onMounted(function () {
  console.log(textItem.value.a, textItem.value.b);
});
</script>
<template>
  <div>
    <TextItem ref="textItem"></TextItem>
  </div>
</template>
```
