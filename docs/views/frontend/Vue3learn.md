---
title: Vue 3.x 的个人学习记录
date: 2021-12-25
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

> 里面的代码会被编译成组件 setup() 函数的内容。这意味着与普通的 `<script>` 只在组件被首次引入的时候执行一次不同，`<script setup>` 中的代码会在每次组件实例被创建的时候执行。

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

引用 官方 的话：(我还没用过，不太懂官方的用法，希望能找到大神的例子- -)

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

#### 其他

在使用`defineProps`以及`defineEmits`的时候，可以使用 Typescript 的语法：

```ts
const props = defineProps<{
  foo: string;
  bar?: number;
}>();

const emit = defineEmits<{
  (e: "change", id: number): void;
  (e: "update", value: string): void;
}>();
```

这种方式有一个缺陷，不能提供默认值，为此 Vue 还提供了`withDefaults` API：

```js
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

**限制：不能使用 src 属性**

## teleport 组件

这个组件我觉得非常好用鸭，有的时候我们在封装组件的时候，组件内一些 dom 元素在技术角度上不应该放在该组件的内部。比如模态框！模态框出现的时候，为了使它的定位更方便更快速，肯定希望它能够直接放在 body 下面呀。但是逻辑层面它必须依赖于父组件。

在这种情况下，teleport 就出现了。

teleport 有一个 `to` 属性，可以传入 **css 选择器** 来声明该组件需要传送的目的父元素。而且还有一点非常好，引用下官方的话：

> 请注意，这将移动实际的 DOM 节点，而不是被销毁和重新创建，并且它还将保持任何组件实例的活动状态。所有有状态的 HTML 元素 (即播放的视频) 都将保持其状态。

下面放一下我试用的例子吧：

```vue
// 子组件
<script setup lang="ts">
import { ref } from "vue";
let modalOpen = ref(false);
</script>
<template>
  <button @click="modalOpen = true">
    Open full screen modal! (With teleport!)
  </button>
  <teleport to="body">
    <div v-if="modalOpen" class="modal">
      <div>
        I'm a teleported modal! (My parent is "body")
        <button @click="modalOpen = false">Close</button>
      </div>
    </div>
  </teleport>
</template>
<style scoped>
.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 300px;
  height: 300px;
  padding: 5px;
}
</style>

// 父组件
<script setup lang="ts">
import ModalButton from "@/components/Modal.vue";
</script>
<template>
  <div class="about">
    <modal-button></modal-button>
  </div>
</template>
```

## 片段

现在在`template`中可以同时存在多个根节点了！

## 组件自定义事件

### v-model 参数

关于自定义事件这部分，Vue 3 有一个让我觉得非常方便的一个改变。让子组件有 props 参数的时候，**默认情况下，组件上的 v-model 使用 modelValue 作为 prop 和 update:modelValue 作为事件。**

也就是说再也不用自己去自定义一个监听事件以及回调函数才能去监听到一个 props 的变化了。。

举一个最简单的监听输入框内容的例子：

```vue
// 子组件
<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
defineProps({
  modelValue: String,
});
defineEmits(["update:modelValue"]);
</script>
<template>
  <div>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

// 父组件
<script setup lang="ts">
import InputVue from "@/components/Input.vue";
import { ref } from "vue";
let modelValue = ref("text here");
</script>
<template>
  <div class="about">
    <input-vue v-model:model-value="modelValue"></input-vue>
    <div>This is input's value : {{ modelValue }}</div>
  </div>
</template>
```

可见上面的例子，我并没有使用`@update:modelValue`来定义监听回调函数，但它还是能够正常的双向绑定在一起噢！

### 自定义修饰符

这里直接引用官方的话：

> 添加到组件 v-model 的修饰符将通过 modelModifiers prop 提供给组件。在下面的示例中，我们创建了一个组件，其中包含默认为空对象的 modelModifiers prop。

> 请注意，当组件的 created 生命周期钩子触发时，modelModifiers prop 会包含 capitalize，且其值为 true——因为 capitalize 被设置在了写为 v-model.capitalize="myText" 的 v-model 绑定上。

下面举一个我自己参考官方的例子： 将字符串首字母大写！

```vue
// 子组件
<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from "vue";
import { Modifiers } from "@/models";
interface Props {
  modelValue: string;
  modelValueModifiers: Modifiers;
}
const props = withDefaults(defineProps<Props>(), {
  modelValueModifiers: () => ({}),
});

const emits = defineEmits(["update:modelValue"]);
function emitValue(e) {
  let value = e.target.value;
  if (props.modelValueModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1);
  }
  emits("update:modelValue", value);
}
</script>
<template>
  <div>
    <input type="text" :value="modelValue" @input="emitValue" />
  </div>
</template>

// 父组件
<input-vue v-model:model-value.capitalize="modelValue"></input-vue>
```

**注意：这里的 Modifiers 默认值为` arg + "Modifiers"：`**
